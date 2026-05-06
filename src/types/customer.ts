import type { Address, ShopifyListParams } from "./common.js";

export type CustomerState =
  | "disabled"
  | "enabled"
  | "invited"
  | "declined";

export interface Customer {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  state?: CustomerState;
  note?: string | null;
  verified_email?: boolean;
  accepts_marketing?: boolean;
  accepts_marketing_updated_at?: string;
  marketing_opt_in_level?: string | null;
  tags?: string;
  tax_exempt?: boolean;
  tax_exemptions?: string[];
  addresses?: Address[];
  default_address?: Address;
  orders_count?: number;
  total_spent?: string;
  last_order_id?: number | null;
  last_order_name?: string | null;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  multipass_identifier?: string | null;
  admin_graphql_api_id?: string;
}

export interface CreateCustomerInput
  extends Omit<
    Customer,
    | "id"
    | "state"
    | "verified_email"
    | "orders_count"
    | "total_spent"
    | "last_order_id"
    | "last_order_name"
    | "currency"
    | "created_at"
    | "updated_at"
    | "admin_graphql_api_id"
  > {
  password?: string;
  password_confirmation?: string;
  send_email_welcome?: boolean;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  id: number;
}

export interface ListCustomersParams extends ShopifyListParams {
  ids?: string;
  since_id?: number;
  created_at_min?: string;
  created_at_max?: string;
  updated_at_min?: string;
  updated_at_max?: string;
}

export interface SearchCustomersParams extends ShopifyListParams {
  query: string;
  order?: string;
}
