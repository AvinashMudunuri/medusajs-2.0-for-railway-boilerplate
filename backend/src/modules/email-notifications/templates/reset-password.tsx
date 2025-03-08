import { Text, Section, Hr, Link } from "@react-email/components";
import * as React from "react";
import { Base } from "./base";

export const RESET_PASSWORD = "reset-password";

export interface ResetPasswordTemplateProps {
  url: string;
  preview?: string;
}

export const isResetPasswordTemplateData = (
  data: any
): data is ResetPasswordTemplateProps => typeof data.url === "string";

// First define the preview props type
export type ResetPasswordPreviewProps = {
  preview: string;
};

// Then create the component and assign the static property
export const ResetPasswordTemplate: React.FC<ResetPasswordTemplateProps> & {
  PreviewProps: ResetPasswordPreviewProps;
} = ({ url, preview = "Reset your password" }) => {
  return (
    <Base preview={preview}>
      <Section>
        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
          Suchitra Foods
        </Text>
        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
          We received a request to reset the password for your account
          associated with this email address.
        </Text>
        <Text>
          To reset your password, please click the link below and follow the
          instructions:
        </Text>
        <Link href={url}>Reset Password</Link>
        <Text>
          If you did not request a password reset, please ignore this email. For
          additional assistance, feel free to reach out to our support team at
          connect@suchitrafoods.com.
        </Text>
        <Text>Thank you for taking steps to secure your account!</Text>
      </Section>
    </Base>
  );
};

ResetPasswordTemplate.PreviewProps = {
  preview: "Reset your password",
} as const;
