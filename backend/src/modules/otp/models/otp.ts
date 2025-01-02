import { model } from "@medusajs/utils";

export const Otp = model.define("otp", {
  id: model.id().primaryKey(),
  otp: model.text().nullable(),
  otpExpiresAt: model.dateTime().nullable(),
  isPhoneVerified: model.boolean().default(false),
});
