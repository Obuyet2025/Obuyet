import type { Image, ShopifyListParams } from "./common.js";

export interface CustomCollection {
  id?: number;
  title: string;
  body_html?: string | null;
  handle?: string;
  image?: Image | null;
  published?: boolean;
  published_at?: string | null;
  published_scope?: string;
  sort_order?: string;
  template_suffix?: string | null;
  disjunctive?: boolean;
  rules?: CollectRule[];
  created_at?: string;
  updated_at?: string;
}

export interface SmartCollection {
  id?: number;
  title: string;
  body_html?: string | null;
  handle?: string;
  image?: Image | null;
  published?: boolean;
  published_at?: string | null;
  published_scope?: string;
  sort_order?: string;
  template_suffix?: string | null;
  disjunctive?: boolean;
  rules?: CollectRule[];
  created_at?: string;
  updated_at?: string;
}

export interface CollectRule {
  column: string;
  relation: "contains" | "ends_with" | "equals" | "greater_than" | "less_than" | "not_contains" | "not_equals" | "starts_with";
  condition: string;
}

export interface Collect {
  id?: number;
  collection_id: number;
  product_id: number;
  created_at?: string;
  updated_at?: string;
  position?: number;
  sort_value?: string;
}

export interface CreateCustomCollectionInput
  extends Omit<CustomCollection, "id" | "created_at" | "updated_at"> {}

export interface UpdateCustomCollectionInput
  extends Partial<CreateCustomCollectionInput> {
  id: number;
}

export interface CreateSmartCollectionInput
  extends Omit<SmartCollection, "id" | "created_at" | "updated_at"> {
  rules: CollectRule[];
}

export interface UpdateSmartCollectionInput
  extends Partial<CreateSmartCollectionInput> {
  id: number;
}

export interface ListCollectionsParams extends ShopifyListParams {
  ids?: string;
  since_id?: number;
  title?: string;
  product_id?: number;
  published_status?: "published" | "unpublished" | "any";
}
