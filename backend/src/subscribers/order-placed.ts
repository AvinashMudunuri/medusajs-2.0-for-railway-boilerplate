import { Modules } from "@medusajs/framework/utils";
import {
  INotificationModuleService,
  IOrderModuleService,
  Logger,
} from "@medusajs/framework/types";

import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";
import { SMSTemplate } from "../modules/sms-notifications/templates";

export default async function orderPlacedHandler({
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
        template: EmailTemplates.ORDER_PLACED,
        data: {
          emailOptions: {
            replyTo: "connect@suchitrafoods.com",
            subject: "Suchitra Foods Order Confirmation",
          },
          order,
          shippingAddress,
          preview: "Suchitra Foods Order Confirmation!",
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
        template: "order_confirmation" as SMSTemplate,
        data: {
          orderId: order.id,
          customerName: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        },
      }
    );
    logger.info(`SMS notification ==> ${JSON.stringify(smsNotification)}`);
  } catch (error) {
    logger.error(`Error sending order confirmation SMS ==> ${error}`);
    console.error("Error sending order confirmation notification:", error);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
