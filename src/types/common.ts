export interface ShopifyClientConfig {
  shop: string;
  accessToken: string;
  apiVersion?: string;
  timeout?: number;
  retryLimit?: number;
}

export interface ShopifyListParams {
  limit?: number;
  page_info?: string;
  fields?: string;
  [key: string]: unknown;
}

export interface ShopifyListResponse<T> {
  data: T[];
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface ShopifyError {
  message: string;
  code?: string;
  field?: string[];
}

export interface ShopifyApiError extends Error {
  status: number;
  errors: ShopifyError[];
}

export interface MoneyAmount {
  amount: string;
  currency_code: string;
}

export interface Address {
  first_name?: string;
  last_name?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  phone?: string;
  province_code?: string;
  country_code?: string;
}

export interface Image {
  id?: number;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  created_at?: string;
  updated_at?: string;
}
