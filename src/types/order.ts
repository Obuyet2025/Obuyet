import type { Address, MoneyAmount, ShopifyListParams } from "./common.js";

export type OrderFinancialStatus =
  | "authorized"
  | "paid"
  | "partially_paid"
  | "partially_refunded"
  | "pending"
  | "refunded"
  | "voided";

export type OrderFulfillmentStatus =
  | "fulfilled"
  | "null"
  | "partial"
  | "restocked"
  | "unfulfilled";

export type OrderStatus = "any" | "cancelled" | "closed" | "open";

export interface LineItem {
  id?: number;
  variant_id?: number | null;
  product_id?: number | null;
  title: string;
  variant_title?: string | null;
  quantity: number;
  price: string;
  sku?: string;
  grams?: number;
  vendor?: string;
  requires_shipping?: boolean;
  taxable?: boolean;
  gift_card?: boolean;
  fulfillment_service?: string;
  fulfillment_status?: string | null;
  total_discount?: string;
  tax_lines?: TaxLine[];
  properties?: Array<{ name: string; value: string }>;
}

export interface TaxLine {
  title: string;
  price: string;
  rate: number;
}

export interface ShippingLine {
  id?: number;
  title: string;
  price: string;
  code?: string;
  source?: string;
  phone?: string | null;
  tax_lines?: TaxLine[];
  carrier_identifier?: string | null;
  requested_fulfillment_service_id?: string | null;
}

export interface Refund {
  id?: number;
  order_id?: number;
  created_at?: string;
  note?: string;
  refund_line_items?: RefundLineItem[];
  transactions?: RefundTransaction[];
  user_id?: number;
}

export interface RefundLineItem {
  id?: number;
  line_item_id: number;
  quantity: number;
  restock_type?: "no_restock" | "cancel" | "return" | "legacy_restock";
  location_id?: number | null;
  subtotal?: string;
  total_tax?: string;
}

export interface RefundTransaction {
  parent_id?: number;
  amount: string;
  kind: "refund";
  gateway?: string;
  order_id?: number;
}

export interface Fulfillment {
  id?: number;
  order_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  tracking_company?: string | null;
  tracking_number?: string | null;
  tracking_numbers?: string[];
  tracking_url?: string | null;
  tracking_urls?: string[];
  line_items?: LineItem[];
  location_id?: number;
  notify_customer?: boolean;
}

export interface Order {
  id?: number;
  name?: string;
  email?: string;
  phone?: string | null;
  financial_status?: OrderFinancialStatus;
  fulfillment_status?: OrderFulfillmentStatus | null;
  line_items?: LineItem[];
  shipping_address?: Address;
  billing_address?: Address;
  shipping_lines?: ShippingLine[];
  tax_lines?: TaxLine[];
  refunds?: Refund[];
  fulfillments?: Fulfillment[];
  subtotal_price?: string;
  total_price?: string;
  total_tax?: string;
  total_discounts?: string;
  total_line_items_price?: string;
  currency?: string;
  note?: string | null;
  tags?: string;
  note_attributes?: Array<{ name: string; value: string }>;
  discount_codes?: Array<{ code: string; amount: string; type: string }>;
  created_at?: string;
  updated_at?: string;
  closed_at?: string | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  confirmed?: boolean;
  customer?: {
    id?: number;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  current_total_price?: string;
  presentment_currency?: string;
  total_price_set?: { shop_money: MoneyAmount; presentment_money: MoneyAmount };
}

export interface CreateOrderInput {
  line_items: Array<{ variant_id: number; quantity: number }>;
  customer?: { id: number };
  shipping_address?: Address;
  billing_address?: Address;
  email?: string;
  financial_status?: OrderFinancialStatus;
  note?: string;
  tags?: string;
  send_receipt?: boolean;
  send_fulfillment_receipt?: boolean;
}

export interface ListOrdersParams extends ShopifyListParams {
  status?: OrderStatus;
  financial_status?: OrderFinancialStatus;
  fulfillment_status?: OrderFulfillmentStatus;
  ids?: string;
  since_id?: number;
  created_at_min?: string;
  created_at_max?: string;
  updated_at_min?: string;
  updated_at_max?: string;
  processed_at_min?: string;
  processed_at_max?: string;
}
