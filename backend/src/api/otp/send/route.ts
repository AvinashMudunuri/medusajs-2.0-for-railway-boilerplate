import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/utils";
import { TwilioService } from "modules/sms-notifications/services/twilio";

type SendReq = {
  phone: string;
};

export const POST = async (
  req: MedusaRequest<SendReq>,
  res: MedusaResponse
) => {
  const { phone } = req.body;
  if (!phone) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Phone number is required"
    );
  }
  try {
    const twilioService = req.scope.resolve("TWILIO_SERVICE") as TwilioService;
    await twilioService.sendOTP(phone);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
