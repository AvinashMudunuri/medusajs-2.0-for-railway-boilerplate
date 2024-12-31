import { ModuleProviderExports } from "@medusajs/types";
import { TwilioService } from "./services/twilioService";

const services = [TwilioService];

const providerExport: ModuleProviderExports = {
  services,
};

export default providerExport;
