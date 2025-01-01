import { OtpService } from "./services/otp";
import { Module } from "@medusajs/utils";

export const OTP_MODULE = "otp";

export default Module(OTP_MODULE, {
  service: OtpService,
});
