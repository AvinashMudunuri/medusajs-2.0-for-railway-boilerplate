import { Text, Section, Hr } from "@react-email/components";
import { Base } from "./base";
import { OrderDTO, OrderAddressDTO } from "@medusajs/framework/types";

export const DELIVERY_CREATED = "delivery-created";

interface DeliveryCreatedPreviewProps {
  order: OrderDTO & {
    id: string;
  };
  shippingAddress: OrderAddressDTO;
}

export interface DeliveryCreatedTemplateProps {
  order: OrderDTO & {
    display_id: string;
  };
  shippingAddress: OrderAddressDTO;
  preview?: string;
}

export const isDeliveryCreatedTemplateData = (
  data: any
): data is DeliveryCreatedTemplateProps =>
  typeof data.order === "object" && typeof data.shippingAddress === "object";

const DeliveryCreatedTemplateBase = ({
  order,
  shippingAddress,
  preview = "Suchitra Foods – Your order is on the way!",
}: DeliveryCreatedTemplateProps) => {
  return (
    <Base preview={preview}>
      <Section>
        <Text style={{ margin: "0 0 15px" }}>
          Dear {shippingAddress.first_name} {shippingAddress.last_name},
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          Good news! Your order {order.id} has been shipped and is on its way to
          you.
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          We hope you enjoy our products! If you have any feedback or need
          assistance, please don't hesitate to{" "}
          <a href="mailto:connect@suchitrafoods.com">contact us</a>
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          Thank you for choosing{" "}
          <a href="https://www.suchitrafoods.com">Suchitra Foods!</a>
        </Text>
        <Hr />
        <Text style={{ margin: "0 0 30px" }}>
          <b>Note:</b> We will reach out personally to you via mobile/WhatsApp
          to provide more details about delivery tracking details.
        </Text>
        <Text style={{ margin: "0 0 30px" }}>
          From our Kitchen to yours,
          <br />
          Suchitra Foods
        </Text>
      </Section>
    </Base>
  );
};

export const DeliveryCreatedTemplate = Object.assign(
  DeliveryCreatedTemplateBase,
  {
    PreviewProps: {} as DeliveryCreatedPreviewProps,
  }
);
