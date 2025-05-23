import { Logger, NotificationTypes } from "@medusajs/framework/types";
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils";
import { Twilio } from "twilio";
import { generateSMSTemplate, SMSTemplate } from "../templates";

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

export class TwilioService extends AbstractNotificationProviderService {
  static identifier = "TWILIO_SERVICE";
  protected config_: TwilioServiceConfig; // Configuration for Twilio API
  protected logger_: Logger; // Logger for error and event logging
  protected twilio: Twilio; // Instance of the Twilio API client

  constructor({ logger }: InjectedDependencies, options: TwilioServiceOptions) {
    super();
    this.config_ = {
      accountSid: options.account_sid,
      authToken: options.auth_token,
      phoneNumber: options.phone_number,
      verifyServiceSid: options.verify_service_sid,
    };
    this.logger_ = logger;
    this.twilio = new Twilio(this.config_.accountSid, this.config_.authToken);
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No notification information provided`
      );
    }
    if (notification.channel === "email") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `email notification not supported`
      );
    }
    if (!notification.to) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No recipient phone number provided`
      );
    }

    const messageBody = generateSMSTemplate(
      notification.template as SMSTemplate,
      notification.data as Record<string, string>
    );

    try {
      const message = await this.twilio.messages.create({
        body: messageBody,
        from: this.config_.phoneNumber,
        to: notification.to,
      });
      this.logger_.info(`SMS sent successfully: ${message.sid}`);
      return { id: message.sid };
    } catch (error) {
      this.logger_.error(
        `Failed to send SMS notification to ${notification.to}: ${error.message}`
      );
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send SMS notification: ${error.message}`
      );
    }
  }
}
