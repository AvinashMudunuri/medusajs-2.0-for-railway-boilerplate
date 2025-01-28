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
          Reset your password
        </Text>
        <Text>Click the link below to reset your password:</Text>
        <Link href={url}>Reset Password</Link>
      </Section>
    </Base>
  );
};

ResetPasswordTemplate.PreviewProps = {
  preview: "Reset your password",
} as const;
