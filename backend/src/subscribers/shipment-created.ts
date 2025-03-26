import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { INotificationModuleService, Logger } from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";
import { SMSTemplate } from "../modules/sms-notifications/templates";

export default async function shipmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);

  const logger: Logger = container.resolve("logger");
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // When you receive the fulfillment_id from the delivery.created event
  const fulfillmentId = data.id; // or however you access the fulfillment ID

  // Use Query to retrieve the fulfillment with its linked order
  const { data: fulfillments } = await query.graph({
    entity: "fulfillment",
    fields: [
      "id",
      "order.id",
      "order.email",
      "order.shipping_address.first_name",
      "order.shipping_address.last_name",
      "order.shipping_address.phone",
    ],
    filters: {
      id: [fulfillmentId],
    },
  });

  // Now you can access the order data
  const order = fulfillments[0].order;
  const shippingAddress = order.shipping_address;
  logger.info(`Order ==> ${JSON.stringify(order)}`);

  try {
    const emailNotification =
      await notificationModuleService.createNotifications({
        to: order.email,
        channel: "email",
        template: EmailTemplates.SHIPMENT_CREATED,
        data: {
          emailOptions: {
            replyTo: "connect@suchitrafoods.com",
            subject: "Suchitra Foods Order Shipped!",
          },
          order,
          shippingAddress,
          preview: "Suchitra Foods Order Shipped!",
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
        template: "shipment_created" as SMSTemplate,
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
  event: ["shipment.created"],
};
