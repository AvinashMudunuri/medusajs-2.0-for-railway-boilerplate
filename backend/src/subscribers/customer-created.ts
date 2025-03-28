import {
  INotificationModuleService,
  ICustomerModuleService,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);
  const customerModuleService: ICustomerModuleService = container.resolve(
    Modules.CUSTOMER
  );
  const customer = await customerModuleService.retrieveCustomer(data.id);

  try {
    await notificationModuleService.createNotifications({
      to: customer.email,
      channel: "email",
      template: EmailTemplates.CUSTOMER_CREATED,
      data: {
        customer,
        emailOptions: {
          replyTo: "Suchitra Foods <connect@suchitrafoods.com>",
          subject: "Welcome to Suchitra Foods – Your Account is Ready! 🎉",
        },
        preview: "Welcome to Suchitra Foods – Your Account is Ready! 🎉",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export const config: SubscriberConfig = {
  event: ["customer.created"],
};
