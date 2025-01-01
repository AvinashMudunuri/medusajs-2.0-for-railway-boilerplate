import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/utils";
import { OtpService } from "modules/otp/services/otp";

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
    const otpService = req.scope.resolve("OTP_SERVICE") as OtpService;
    const isValid = await otpService.verifyOTP(phone, code);
    if (isValid) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
