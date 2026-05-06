import type { ShopifyClient } from "../client.js";
import type {
  Product,
  ProductVariant,
  CreateProductInput,
  UpdateProductInput,
  ListProductsParams,
  ShopifyListResponse,
} from "../types/index.js";

export class ProductsResource {
  constructor(private readonly client: ShopifyClient) {}

  async list(params?: ListProductsParams): Promise<ShopifyListResponse<Product>> {
    const res = await this.client.get<{ products: Product[] }>(
      "/products.json",
      params as Record<string, unknown>
    );
    return { data: res.products };
  }

  async count(params?: Pick<ListProductsParams, "vendor" | "product_type" | "collection_id" | "created_at_min" | "created_at_max" | "updated_at_min" | "updated_at_max" | "published_status">): Promise<number> {
    const res = await this.client.get<{ count: number }>(
      "/products/count.json",
      params as Record<string, unknown>
    );
    return res.count;
  }

  async get(id: number, fields?: string): Promise<Product> {
    const res = await this.client.get<{ product: Product }>(
      `/products/${id}.json`,
      fields ? { fields } : undefined
    );
    return res.product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const res = await this.client.post<{ product: Product }>("/products.json", {
      product: input,
    });
    return res.product;
  }

  async update(input: UpdateProductInput): Promise<Product> {
    const { id, ...rest } = input;
    const res = await this.client.put<{ product: Product }>(
      `/products/${id}.json`,
      { product: rest }
    );
    return res.product;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/products/${id}.json`);
  }

  // --- Variants ---

  async listVariants(productId: number, params?: ListProductsParams): Promise<ShopifyListResponse<ProductVariant>> {
    const res = await this.client.get<{ variants: ProductVariant[] }>(
      `/products/${productId}/variants.json`,
      params as Record<string, unknown>
    );
    return { data: res.variants };
  }

  async getVariant(variantId: number): Promise<ProductVariant> {
    const res = await this.client.get<{ variant: ProductVariant }>(
      `/variants/${variantId}.json`
    );
    return res.variant;
  }

  async createVariant(productId: number, variant: Omit<ProductVariant, "id" | "product_id" | "created_at" | "updated_at">): Promise<ProductVariant> {
    const res = await this.client.post<{ variant: ProductVariant }>(
      `/products/${productId}/variants.json`,
      { variant }
    );
    return res.variant;
  }

  async updateVariant(variantId: number, variant: Partial<ProductVariant>): Promise<ProductVariant> {
    const res = await this.client.put<{ variant: ProductVariant }>(
      `/variants/${variantId}.json`,
      { variant }
    );
    return res.variant;
  }

  async deleteVariant(productId: number, variantId: number): Promise<void> {
    await this.client.delete(`/products/${productId}/variants/${variantId}.json`);
  }
}
