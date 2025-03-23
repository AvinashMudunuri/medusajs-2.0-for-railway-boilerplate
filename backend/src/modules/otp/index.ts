import otpLoader from "./loaders/otp";
import { OtpService } from "./services/otp";
import { Module } from "@medusajs/framework/utils";

export const OTP_MODULE = "otp";

export default Module(OTP_MODULE, {
  service: OtpService,
  loaders: [otpLoader],
});
