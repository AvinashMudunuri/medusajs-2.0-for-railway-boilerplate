import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import OtpModule from "../modules/otp";

export default defineLink(
  CustomerModule.linkable.customer,
  OtpModule.linkable.otp
);
