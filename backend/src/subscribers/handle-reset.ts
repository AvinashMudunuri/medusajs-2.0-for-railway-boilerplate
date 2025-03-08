import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa";
import { Modules } from "@medusajs/framework/utils";
import { EmailTemplates } from "modules/email-notifications/templates";

export default async function resetPasswordTokenHandler({
  event: {
    data: { entity_id: email, token, actor_type },
  },
  container,
}: SubscriberArgs<{ entity_id: string; token: string; actor_type: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);

  const urlPrefix =
    actor_type === "customer"
      ? "https://suchitrafoods.com"
      : "https://backend-production-a387.up.railway.app/app";

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: EmailTemplates.RESET_PASSWORD,
    data: {
      emailOptions: {
        replyTo: "connect@suchitrafoods.com",
        subject: "Password Reset Request - Suchitra Foods",
      },
      // a URL to a frontend application
      url: `${urlPrefix}/account?view=update-password&token=${token}&email=${email}`,
      preview: "Password Reset Request - Suchitra Foods",
    },
  });
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
};
