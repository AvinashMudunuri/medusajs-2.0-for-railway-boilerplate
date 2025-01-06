import {
    CreatePaymentProviderSession,
    Logger,
    PaymentProviderError,
    PaymentProviderSessionResponse,
    PaymentSessionStatus,
    ProviderWebhookPayload,
    UpdatePaymentProviderSession,
    WebhookActionResult,
    MedusaContainer
  } from "@medusajs/types";
  import { AbstractPaymentProvider, MedusaError } from "@medusajs/utils";
  import Razorpay from "razorpay";
  
  interface RazorpayServiceConfig {
    keyId: string;
    keySecret: string;
  }
  
  export interface RazorpayServiceOptions {
    key_id: string;
    Key_secret: string;
  }
  
  export class RazorpayService extends AbstractPaymentProvider {
    protected config_: RazorpayServiceConfig;
    protected logger_: Logger;
    protected razorpay: Razorpay;
    protected container: MedusaContainer;
  
    constructor(
      container: MedusaContainer,
      options: RazorpayServiceOptions
    ) {
      super(container);
      this.config_ = {
        keyId: options.key_id,
        keySecret: options.Key_secret,
      };
      this.logger_ = container.logger as Logger;
      this.razorpay = new Razorpay({
        key_id: this.config_.keyId,
        key_secret: this.config_.keySecret,
      });
    }
  
    async getPaymentStatus(paymentData: Record<string, unknown>): Promise<PaymentSessionStatus> {
      try {
        const payment = await this.razorpay.payments.fetch(paymentData.id as string);
        switch (payment.status) {
          case 'captured':
            return PaymentSessionStatus.AUTHORIZED;
          case 'created':
            return PaymentSessionStatus.PENDING;
          case 'failed':
            return PaymentSessionStatus.ERROR;
          default:
            return PaymentSessionStatus.PENDING;
        }
      } catch (error) {
        throw new PaymentProviderError(error.message);
      }
    }
  
    async createPaymentSession(
      context: CreatePaymentProviderSession
    ): Promise<PaymentProviderSessionResponse> {
      try {
        const { amount, currency_code } = context;
  
        const order = await this.razorpay.orders.create({
          amount: Math.round(amount),
          currency: currency_code.toUpperCase(),
        });
  
        return {
          session_data: {
            id: order.id,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
          },
          update_requests: null,
        };
      } catch (error) {
        throw new PaymentProviderError(error.message);
      }
    }
  
    async updatePaymentSession(
      context: UpdatePaymentProviderSession
    ): Promise<PaymentProviderSessionResponse> {
      try {
        const { amount, currency_code } = context;
  
        const order = await this.razorpay.orders.create({
          amount: Math.round(amount),
          currency: currency_code.toUpperCase(),
        });
  
        return {
          session_data: {
            id: order.id,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
          },
          update_requests: null,
        };
      } catch (error) {
        throw new PaymentProviderError(error.message);
      }
    }
  
    async capturePayment(paymentData: Record<string, unknown>): Promise<Record<string, unknown>> {
      try {
        const payment = await this.razorpay.payments.capture(
          paymentData.id as string,
          paymentData.amount as number
        );
        return payment;
      } catch (error) {
        throw new PaymentProviderError(error.message);
      }
    }
  
    async refundPayment(
      paymentData: Record<string, unknown>,
      refundAmount: number
    ): Promise<Record<string, unknown>> {
      try {
        const refund = await this.razorpay.payments.refund(paymentData.id as string, {
          amount: Math.round(refundAmount),
        });
        return refund;
      } catch (error) {
        throw new PaymentProviderError(error.message);
      }
    }
  
    async cancelPayment(paymentData: Record<string, unknown>): Promise<Record<string, unknown>> {
      return await this.refundPayment(paymentData, paymentData.amount as number);
    }
  
    async deletePayment(paymentData: Record<string, unknown>): Promise<void> {
      return;
    }
  
    async handleWebhook(
      payload: ProviderWebhookPayload,
      type: string
    ): Promise<WebhookActionResult> {
      try {
        let status: PaymentSessionStatus;
  
        switch (type) {
          case "payment.captured":
            status = PaymentSessionStatus.AUTHORIZED;
            break;
          case "payment.failed":
            status = PaymentSessionStatus.ERROR;
            break;
          default:
            status = PaymentSessionStatus.PENDING;
        }
  
        return {
          data: payload,
          payment_status: status,
        };
      } catch (error) {
        throw new PaymentProviderError(error.message);
      }
    }
  }
  