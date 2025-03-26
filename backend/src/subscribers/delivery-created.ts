import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { INotificationModuleService, Logger } from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";
import { SMSTemplate } from "../modules/sms-notifications/templates";

export default async function deliveryCreatedHandler({
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
      "order.*", // This retrieves all order fields
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
        template: EmailTemplates.DELIVERY_CREATED,
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
  event: ["delivery.created"],
};
