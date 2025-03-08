import { Modules } from "@medusajs/framework/utils";
import {
  INotificationModuleService,
  IOrderModuleService,
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

  const order = await orderModuleService.retrieveOrder(data.id, {
    relations: ["items", "summary", "shipping_address"],
  });
  const shippingAddress = await (
    orderModuleService as any
  ).orderAddressService_.retrieve(order.shipping_address.id);

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: EmailTemplates.ORDER_PLACED,
      data: {
        emailOptions: {
          replyTo: "info@example.com",
          subject: "Your order has been placed",
        },
        order,
        shippingAddress,
        preview: "Thank you for your order!",
      },
    });
  } catch (error) {
    console.error("Error sending order confirmation notification:", error);
  }

  try {
    if (!shippingAddress.phone) {
      throw new Error("Shipping address phone number is not provided");
    }
    await notificationModuleService.createNotifications({
      to: shippingAddress.phone,
      channel: "sms",
      template: "order_confirmation" as SMSTemplate,
      data: {
        orderId: order.id,
        customerName: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
      },
    });
  } catch (error) {
    console.error("Error sending order confirmation SMS:", error);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
