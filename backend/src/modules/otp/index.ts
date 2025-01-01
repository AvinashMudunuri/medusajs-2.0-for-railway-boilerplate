import { ModuleProviderExports } from "@medusajs/types";
import { OtpService } from "./services/otp";

const services = [OtpService];

const providerExport: ModuleProviderExports = {
  services,
};

export default providerExport;
