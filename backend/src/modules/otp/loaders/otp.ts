import { LoaderOptions } from "@medusajs/types";

export default async function otpLoader({ container }: LoaderOptions) {
  const logger = container.resolve("logger");

  logger.info("[otpLoader]: Otp Service!");
}
