import { Text, Section, Hr } from "@react-email/components";
import * as React from "react";
import { Base } from "./base";
import { OrderDTO, OrderAddressDTO } from "@medusajs/framework/types";
import getSymbolFromCurrency from "currency-symbol-map";

export const ORDER_PLACED = "order-placed";

interface OrderPlacedPreviewProps {
  order: OrderDTO & {
    display_id: string;
    summary: { raw_current_order_total: { value: number } };
  };
  shippingAddress: OrderAddressDTO;
}

export interface OrderPlacedTemplateProps {
  order: OrderDTO & {
    display_id: string;
    summary: { raw_current_order_total: { value: number } };
  };
  shippingAddress: OrderAddressDTO;
  preview?: string;
}

export const isOrderPlacedTemplateData = (
  data: any
): data is OrderPlacedTemplateProps =>
  typeof data.order === "object" && typeof data.shippingAddress === "object";

export const OrderPlacedTemplate: React.FC<OrderPlacedTemplateProps> & {
  PreviewProps: OrderPlacedPreviewProps;
} = ({
  order,
  shippingAddress,
  preview = "Suchitra Foods Order Confirmation",
}) => {
  return (
    <Base preview={preview}>
      <Section>
        <Text
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "0 0 30px",
          }}
        >
          Order Confirmation
        </Text>

        <Text style={{ margin: "0 0 15px" }}>
          Dear {shippingAddress.first_name} {shippingAddress.last_name},
        </Text>

        <Text style={{ margin: "0 0 30px" }}>
          Thank you for the trust you have placed in us and your order.
        </Text>

        <Text style={{ margin: "0 0 30px" }}>
          We are delighted to inform you that your order has been successfully
          placed with Suchitra Foods. You can check the status of your order
          anytime by visiting the “My Orders” page after logging into our
          website
        </Text>

        <Text
          style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 10px" }}
        >
          Order Summary
        </Text>
        <Text style={{ margin: "0 0 5px" }}>Order ID: {order.display_id}</Text>
        <Text style={{ margin: "0 0 5px" }}>
          Order Date:{" "}
          {new Date(order.created_at).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Text style={{ margin: "0 0 20px" }}>
          Total: {getSymbolFromCurrency(order.currency_code.toUpperCase())}{" "}
          {order.summary.raw_current_order_total.value}
        </Text>

        <Hr style={{ margin: "20px 0" }} />

        <Text
          style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 10px" }}
        >
          Shipping Address
        </Text>
        <Text style={{ margin: "0 0 5px" }}>{shippingAddress.address_1}</Text>
        <Text style={{ margin: "0 0 5px" }}>
          {shippingAddress.city}, {shippingAddress.province}{" "}
          {shippingAddress.postal_code}
        </Text>
        <Text style={{ margin: "0 0 20px" }}>
          {shippingAddress.country_code}
        </Text>

        <Hr style={{ margin: "20px 0" }} />

        <Text
          style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 15px" }}
        >
          Order Items
        </Text>

        <div
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            margin: "10px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#f2f2f2",
              padding: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Item</Text>
            <Text style={{ fontWeight: "bold" }}>Quantity</Text>
            <Text style={{ fontWeight: "bold" }}>Price</Text>
          </div>
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <Text>
                {item.title} - {item.product_title}
              </Text>
              <Text>{item.quantity}</Text>
              <Text>
                {item.unit_price} {order.currency_code}
              </Text>
            </div>
          ))}
          <Hr style={{ margin: "20px 0" }} />
          <Text style={{ margin: "0 0 20px" }}>
            <b>What's Next:</b> You will be notified as soon as your order is
            packed and shipped.
          </Text>
          <Text style={{ margin: "0 0 20px" }}>
            Need Help: For Queries or any assistance, contact us at{" "}
            <a href="mailto:connect@suchitrafoods.com">
              connect@suchitrafoods.com
            </a>
          </Text>
          <Text style={{ margin: "0 0 20px" }}>
            Thank you for choosing{" "}
            <a href="https://www.suchitrafoods.com">Suchitra Foods!</a>
          </Text>
          <Text style={{ margin: "0 0 20px" }}>
            From our Kitchen to yours,
            <br />
            Suchitra Foods
          </Text>
        </div>
      </Section>
    </Base>
  );
};

OrderPlacedTemplate.PreviewProps = {
  order: {
    id: "test-order-id",
    display_id: "ORD-123",
    created_at: new Date().toISOString(),
    email: "test@example.com",
    currency_code: "USD",
    items: [
      {
        id: "item-1",
        title: "Item 1",
        product_title: "Product 1",
        quantity: 2,
        unit_price: 10,
      },
      {
        id: "item-2",
        title: "Item 2",
        product_title: "Product 2",
        quantity: 1,
        unit_price: 25,
      },
    ],
    shipping_address: {
      first_name: "Test",
      last_name: "User",
      address_1: "123 Main St",
      city: "Anytown",
      province: "CA",
      postal_code: "12345",
      country_code: "US",
    },
    summary: { raw_current_order_total: { value: 45 } },
  },
  shippingAddress: {
    first_name: "Test",
    last_name: "User",
    address_1: "123 Main St",
    city: "Anytown",
    province: "CA",
    postal_code: "12345",
    country_code: "US",
  },
} as OrderPlacedPreviewProps;

export default OrderPlacedTemplate;
