/**
 * SMS Templates Generator
 * Generates SMS content based on predefined templates and dynamic data.
 */

export type SMSTemplate =
  | "otp_verification"
  | "order_confirmation"
  | "shipment_created"
  | "delivery_created"
  | "cart_update"
  | "general_notification";

interface TemplateData {
  [key: string]: string | number;
}

/**
 * Generates an SMS message based on the provided template and data.
 * @param template - The template identifier.
 * @param data - Dynamic data for message placeholders.
 * @returns The generated SMS content.
 */
export const generateSMSTemplate = (
  template: SMSTemplate,
  data: TemplateData
): string => {
  console.log("template", template);
  switch (template) {
    case "otp_verification":
      return `Your OTP code is ${data.otp}. Please use this to verify your account.`;
    case "order_confirmation":
      return `Dear ${data.customerName}!, Your ${data.orderId} has been placed successfully. We'll notify you once it ships. -- Suchitra Foods!`;
    case "shipment_created":
      return `Dear ${data.customerName}!, Your ${data.orderId} has been shipped to your location! -- Suchitra Foods!`;
    case "delivery_created":
      return `Dear ${data.customerName}!, Your ${data.orderId} has been delivered. Enjoy our delicacies. -- Suchitra Foods`;
    case "cart_update":
      return `Your cart has been updated. You have ${data.itemCount} items in your cart.`;
    case "general_notification":
      return data.message as string;
    default:
      throw new Error(`Unknown SMS template: ${template}`);
  }
};
