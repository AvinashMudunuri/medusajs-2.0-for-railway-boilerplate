import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/utils";
import { TwilioService } from "modules/sms-notifications/services/twilio";

type SendReq = {
  phone: string;
  code: string;
};

export const POST = async (
  req: MedusaRequest<SendReq>,
  res: MedusaResponse
) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Phone number and code are required"
    );
  }
  try {
    const twilioService = req.scope.resolve("TWILIO_SERVICE") as TwilioService;
    const isValid = await twilioService.verifyOTP(phone, code);
    if (isValid) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
