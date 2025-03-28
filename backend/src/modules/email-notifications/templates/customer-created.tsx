import { Text, Section, Hr } from "@react-email/components";
import { Base } from "./base";
import { CustomerDTO } from "@medusajs/framework/types";

export const CUSTOMER_CREATED = "customer-created";

interface CustomerCreatedPreviewProps {
  customer: CustomerDTO & {
    id: string;
  };
}

export interface CustomerCreatedTemplateProps {
  customer: CustomerDTO & {
    id: string;
  };
  preview?: string;
}

export const isCustomerCreatedTemplateData = (
  data: any
): data is CustomerCreatedTemplateProps =>
  typeof data.customer === "object" && typeof data.customer.id === "string";

const CustomerCreatedTemplateBase = ({
  customer,
  preview = "Welcome to Suchitra Foods – Your Account is Ready! 🎉",
}: CustomerCreatedTemplateProps) => {
  return (
    <Base preview={preview}>
      <Section>
        <Text style={{ margin: "0 0 15px" }}>
          Dear {customer.first_name} {customer.last_name},
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          Welcome to Suchitra Foods! 🎉 We're thrilled to have you on board.
          Your account has been successfully created, and you're now ready to
          enjoy a seamless shopping experience.
        </Text>
        <Text style={{ margin: "0 0 30px", fontWeight: "bold" }}>
          Your Account Details:
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          Name: {customer.first_name} {customer.last_name}
        </Text>
        <Text style={{ margin: "0 0 30px" }}>Email: {customer.email}</Text>
        <Text style={{ margin: "0 0 30px" }}>
          Registered On:{" "}
          {new Date(customer.created_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          <ul>
            <li>✅ Browse and shop from our latest collections</li>
            <li>✅ Track your orders in real-time</li>
            <li>✅ Save your favorite products to your wishlist</li>
            <li>✅ Enjoy exclusive member discounts and offers</li>
          </ul>
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          Get started now and enjoy a seamless shopping experience with us!{" "}
          <a href="https://www.suchitrafoods.com">Login to your account</a>
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          Need help? Our support team is always ready to assist you. Feel free
          to reach out at{" "}
          <a href="mailto:connect@suchitrafoods.com">
            connect@suchitrafoods.com
          </a>
        </Text>
        <Hr />
        <Text style={{ margin: "0 0 30px" }}>
          From our Kitchen to yours,
          <br />
          Suchitra Foods
        </Text>
      </Section>
    </Base>
  );
};

export const CustomerCreatedTemplate = Object.assign(
  CustomerCreatedTemplateBase,
  {
    PreviewProps: {} as CustomerCreatedPreviewProps,
  }
);
