import { ReactNode } from "react";
import { MedusaError } from "@medusajs/framework/utils";

import { InviteUserEmail, INVITE_USER, isInviteUserData } from "./invite-user";
import {
  OrderPlacedTemplate,
  ORDER_PLACED,
  isOrderPlacedTemplateData,
} from "./order-placed";
import {
  ResetPasswordTemplate,
  RESET_PASSWORD,
  isResetPasswordTemplateData,
} from "./reset-password";
import {
  OrderDeliveredTemplate,
  ORDER_DELIVERED,
  isOrderDeliveredTemplateData,
} from "./order-delivered";

export const EmailTemplates = {
  INVITE_USER,
  ORDER_PLACED,
  RESET_PASSWORD,
  ORDER_DELIVERED,
} as const;

export type EmailTemplateType = keyof typeof EmailTemplates;

export function generateEmailTemplate(
  templateKey: string,
  data: unknown
): ReactNode {
  console.log("generateEmailTemplate", templateKey, data);
  switch (templateKey) {
    case EmailTemplates.INVITE_USER:
      if (!isInviteUserData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.INVITE_USER}"`
        );
      }
      return <InviteUserEmail {...data} />;

    case EmailTemplates.ORDER_PLACED:
      if (!isOrderPlacedTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_PLACED}"`
        );
      }
      return <OrderPlacedTemplate {...data} />;

    case EmailTemplates.RESET_PASSWORD:
      if (!isResetPasswordTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.RESET_PASSWORD}"`
        );
      }
      return <ResetPasswordTemplate {...data} />;

    case EmailTemplates.ORDER_DELIVERED:
      if (!isOrderDeliveredTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_DELIVERED}"`
        );
      }
      return <OrderDeliveredTemplate {...data} />;

    default:
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unknown template key: "${templateKey}"`
      );
  }
}

export { InviteUserEmail, OrderPlacedTemplate, OrderDeliveredTemplate };
