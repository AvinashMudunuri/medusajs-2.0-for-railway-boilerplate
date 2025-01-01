import { OtpService } from "./service/Otp";
import { Module } from "@medusajs/framework/utils";

export const OTP_MODULE = "otp";

export default Module(OTP_MODULE, {
  service: OtpService,
});
