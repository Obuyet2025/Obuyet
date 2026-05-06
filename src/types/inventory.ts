import type { Address, ShopifyListParams } from "./common.js";

export interface InventoryItem {
  id?: number;
  sku?: string;
  tracked?: boolean;
  cost?: string | null;
  country_code_of_origin?: string | null;
  province_code_of_origin?: string | null;
  harmonized_system_code?: string | null;
  country_harmonized_system_codes?: Array<{
    harmonized_system_code: string;
    country_code: string;
  }>;
  requires_shipping?: boolean;
  created_at?: string;
  updated_at?: string;
  admin_graphql_api_id?: string;
}

export interface InventoryLevel {
  inventory_item_id: number;
  location_id: number;
  available: number | null;
  updated_at?: string;
  admin_graphql_api_id?: string;
}

export interface Location {
  id?: number;
  name: string;
  address1?: string;
  address2?: string | null;
  city?: string;
  zip?: string;
  province?: string | null;
  country?: string;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
  country_code?: string;
  country_name?: string;
  province_code?: string | null;
  legacy?: boolean;
  active?: boolean;
  admin_graphql_api_id?: string;
  localized_country_name?: string;
  localized_province_name?: string | null;
}

export interface AdjustInventoryInput {
  location_id: number;
  inventory_item_id: number;
  available_adjustment: number;
}

export interface SetInventoryLevelInput {
  location_id: number;
  inventory_item_id: number;
  available: number;
  disconnect_if_necessary?: boolean;
}

export interface ConnectInventoryLevelInput {
  location_id: number;
  inventory_item_id: number;
  relocate_if_necessary?: boolean;
}

export interface ListInventoryLevelsParams extends ShopifyListParams {
  inventory_item_ids?: string;
  location_ids?: string;
  updated_at_min?: string;
}

export interface UpdateInventoryItemInput extends Partial<InventoryItem> {
  id: number;
}
