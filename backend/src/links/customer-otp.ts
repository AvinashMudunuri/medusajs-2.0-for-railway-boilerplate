import OtpModule from "../modules/otp";
import CustomerModule from "@medusajs/medusa/customer";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  {
    linkable: CustomerModule.linkable.customer,
    isList: true,
  },
  OtpModule.linkable.otp
);
