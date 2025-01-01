import { Logger } from "@medusajs/types";
import { MedusaError } from "@medusajs/utils";

import { Twilio } from "twilio";

type InjectedDependencies = {
  logger: Logger;
};

interface TwilioServiceConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  verifyServiceSid: string;
}

export interface TwilioServiceOptions {
  account_sid: string;
  auth_token: string;
  phone_number: string;
  verify_service_sid: string;
}

/**
 * Service to handle SMS notifications using the Twilio API.
 */

export class OtpService {
  protected config_: TwilioServiceConfig; // Configuration for Twilio API
  protected logger_: Logger; // Logger for error and event logging
  protected twilio: Twilio; // Instance of the Twilio API client

  constructor({ logger }: InjectedDependencies, options: TwilioServiceOptions) {
    this.config_ = {
      accountSid: options.account_sid,
      authToken: options.auth_token,
      phoneNumber: options.phone_number,
      verifyServiceSid: options.verify_service_sid,
    };
    this.logger_ = logger;
    this.twilio = new Twilio(this.config_.accountSid, this.config_.authToken);
  }

  async sendOTP(phoneNumber: string): Promise<void> {
    try {
      const verification = await this.twilio.verify.v2
        .services(this.config_.verifyServiceSid)
        .verifications.create({
          to: phoneNumber,
          channel: "sms",
        });
      this.logger_.info(`OTP sent successfully: ${verification.sid}`);
    } catch (error) {
      this.logger_.error(
        `Failed to send OTP to ${phoneNumber}: ${error.message}`
      );
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send OTP: ${error.message}`
      );
    }
  }

  async verifyOTP(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const verificationCheck = await this.twilio.verify.v2
        .services(this.config_.verifyServiceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code: code,
        });
      if (verificationCheck.status === "approved") {
        this.logger_.info(
          `OTP verification successful: ${verificationCheck.sid}`
        );
        return true;
      } else {
        this.logger_.info(`OTP verification failed: ${verificationCheck.sid}`);
        return false;
      }
    } catch (error) {
      this.logger_.error(
        `Failed to verify OTP for ${phoneNumber}: ${error.message}`
      );
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to verify OTP: ${error.message}`
      );
    }
  }

  async resendOTP(phoneNumber: string): Promise<void> {
    return this.sendOTP(phoneNumber);
  }
}
