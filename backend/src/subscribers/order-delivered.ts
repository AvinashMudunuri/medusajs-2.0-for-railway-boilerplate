import { Modules } from "@medusajs/framework/utils";
import {
  INotificationModuleService,
  IOrderModuleService,
  Logger,
} from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";
import { SMSTemplate } from "../modules/sms-notifications/templates";

export default async function fulfillmentDeliveredHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);
  const orderModuleService: IOrderModuleService = container.resolve(
    Modules.ORDER
  );
  const logger: Logger = container.resolve("logger");
  const order = await orderModuleService.retrieveOrder(data.id, {
    relations: ["items", "summary", "shipping_address"],
  });
  const shippingAddress = await (
    orderModuleService as any
  ).orderAddressService_.retrieve(order.shipping_address.id);

  try {
    const emailNotification =
      await notificationModuleService.createNotifications({
        to: order.email,
        channel: "email",
        template: EmailTemplates.ORDER_DELIVERED,
        data: {
          emailOptions: {
            replyTo: "connect@suchitrafoods.com",
            subject: "Your order has been delivered!",
          },
          order,
          shippingAddress,
          preview: "Your order has been delivered!",
        },
      });
    logger.info(`Email notification ==> ${JSON.stringify(emailNotification)}`);
  } catch (error) {
    logger.error(`Error sending order confirmation email ==> ${error}`);
    console.error("Error sending order confirmation notification:", error);
  }
  try {
    if (!shippingAddress.phone) {
      throw new Error("Shipping address phone number is not provided");
    }
    const smsNotification = await notificationModuleService.createNotifications(
      {
        to: shippingAddress.phone,
        channel: "sms",
        template: "order_delivered" as SMSTemplate,
        data: {
          orderId: order.id,
          customerName: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        },
      }
    );
    logger.info(`SMS notification ==> ${JSON.stringify(smsNotification)}`);
  } catch (error) {
    logger.error(`Error sending order confirmation SMS ==> ${error}`);
    console.error("Error sending order confirmation SMS:", error);
  }
}

export const config: SubscriberConfig = {
  event: "fulfillment.delivered",
};
