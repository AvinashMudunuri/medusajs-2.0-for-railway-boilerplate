import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/utils";
import { OtpService } from "modules/otp/services/otp";

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
    const otpService = req.scope.resolve("OTP_SERVICE") as OtpService;
    await otpService.sendOTP(phone);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
