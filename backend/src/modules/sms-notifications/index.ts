import { ModuleProviderExports } from "@medusajs/types";
import { TwilioService } from "./services/twilio";

const services = [TwilioService];

const providerExport: ModuleProviderExports = {
  services,
};

export default providerExport;
