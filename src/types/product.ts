import type { Image, ShopifyListParams } from "./common.js";

export type ProductStatus = "active" | "archived" | "draft";

export interface ProductVariant {
  id?: number;
  product_id?: number;
  title: string;
  price: string;
  compare_at_price?: string | null;
  sku?: string;
  barcode?: string;
  inventory_item_id?: number;
  inventory_management?: string | null;
  inventory_policy?: "deny" | "continue";
  inventory_quantity?: number;
  weight?: number;
  weight_unit?: "g" | "kg" | "lb" | "oz";
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  requires_shipping?: boolean;
  taxable?: boolean;
  fulfillment_service?: string;
  grams?: number;
  image_id?: number | null;
  position?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductOption {
  id?: number;
  product_id?: number;
  name: string;
  position?: number;
  values: string[];
}

export interface Product {
  id?: number;
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  status?: ProductStatus;
  handle?: string;
  tags?: string;
  variants?: ProductVariant[];
  options?: ProductOption[];
  images?: Image[];
  image?: Image | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  template_suffix?: string | null;
  metafields_global_title_tag?: string;
  metafields_global_description_tag?: string;
}

export interface CreateProductInput
  extends Omit<Product, "id" | "created_at" | "updated_at"> {}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: number;
}

export interface ListProductsParams extends ShopifyListParams {
  title?: string;
  vendor?: string;
  product_type?: string;
  status?: ProductStatus;
  collection_id?: number;
  ids?: string;
  since_id?: number;
  published_status?: "published" | "unpublished" | "any";
  created_at_min?: string;
  created_at_max?: string;
  updated_at_min?: string;
  updated_at_max?: string;
}
