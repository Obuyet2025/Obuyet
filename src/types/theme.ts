import type { ShopifyListParams } from "./common.js";

export type ThemeRole = "main" | "unpublished" | "demo" | "development";

export interface Theme {
  id?: number;
  name: string;
  role?: ThemeRole;
  theme_store_id?: number | null;
  previewable?: boolean;
  processing?: boolean;
  admin_graphql_api_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ThemeAsset {
  key: string;
  value?: string;
  attachment?: string;
  public_url?: string | null;
  content_type?: string;
  size?: number;
  checksum?: string | null;
  theme_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateThemeInput {
  name: string;
  src?: string;
  role?: ThemeRole;
}

export interface UpdateThemeInput {
  name?: string;
  role?: ThemeRole;
}

export interface UpsertThemeAssetInput {
  key: string;
  value?: string;
  attachment?: string;
  src?: string;
  source_key?: string;
}

export interface ListThemeAssetsParams extends ShopifyListParams {
  theme_id: number;
}
