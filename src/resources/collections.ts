import type { ShopifyClient } from "../client.js";
import type {
  CustomCollection,
  SmartCollection,
  Collect,
  CreateCustomCollectionInput,
  UpdateCustomCollectionInput,
  CreateSmartCollectionInput,
  UpdateSmartCollectionInput,
  ListCollectionsParams,
  ShopifyListResponse,
} from "../types/index.js";

export class CollectionsResource {
  constructor(private readonly client: ShopifyClient) {}

  // --- Custom Collections ---

  async listCustom(params?: ListCollectionsParams): Promise<ShopifyListResponse<CustomCollection>> {
    const res = await this.client.get<{ custom_collections: CustomCollection[] }>(
      "/custom_collections.json",
      params as Record<string, unknown>
    );
    return { data: res.custom_collections };
  }

  async countCustom(params?: Pick<ListCollectionsParams, "title" | "product_id" | "published_status">): Promise<number> {
    const res = await this.client.get<{ count: number }>(
      "/custom_collections/count.json",
      params as Record<string, unknown>
    );
    return res.count;
  }

  async getCustom(id: number): Promise<CustomCollection> {
    const res = await this.client.get<{ custom_collection: CustomCollection }>(
      `/custom_collections/${id}.json`
    );
    return res.custom_collection;
  }

  async createCustom(input: CreateCustomCollectionInput): Promise<CustomCollection> {
    const res = await this.client.post<{ custom_collection: CustomCollection }>(
      "/custom_collections.json",
      { custom_collection: input }
    );
    return res.custom_collection;
  }

  async updateCustom(input: UpdateCustomCollectionInput): Promise<CustomCollection> {
    const { id, ...rest } = input;
    const res = await this.client.put<{ custom_collection: CustomCollection }>(
      `/custom_collections/${id}.json`,
      { custom_collection: rest }
    );
    return res.custom_collection;
  }

  async deleteCustom(id: number): Promise<void> {
    await this.client.delete(`/custom_collections/${id}.json`);
  }

  // --- Smart Collections ---

  async listSmart(params?: ListCollectionsParams): Promise<ShopifyListResponse<SmartCollection>> {
    const res = await this.client.get<{ smart_collections: SmartCollection[] }>(
      "/smart_collections.json",
      params as Record<string, unknown>
    );
    return { data: res.smart_collections };
  }

  async countSmart(params?: Pick<ListCollectionsParams, "title" | "product_id" | "published_status">): Promise<number> {
    const res = await this.client.get<{ count: number }>(
      "/smart_collections/count.json",
      params as Record<string, unknown>
    );
    return res.count;
  }

  async getSmart(id: number): Promise<SmartCollection> {
    const res = await this.client.get<{ smart_collection: SmartCollection }>(
      `/smart_collections/${id}.json`
    );
    return res.smart_collection;
  }

  async createSmart(input: CreateSmartCollectionInput): Promise<SmartCollection> {
    const res = await this.client.post<{ smart_collection: SmartCollection }>(
      "/smart_collections.json",
      { smart_collection: input }
    );
    return res.smart_collection;
  }

  async updateSmart(input: UpdateSmartCollectionInput): Promise<SmartCollection> {
    const { id, ...rest } = input;
    const res = await this.client.put<{ smart_collection: SmartCollection }>(
      `/smart_collections/${id}.json`,
      { smart_collection: rest }
    );
    return res.smart_collection;
  }

  async deleteSmart(id: number): Promise<void> {
    await this.client.delete(`/smart_collections/${id}.json`);
  }

  async sortSmart(
    id: number,
    sortOrder?: string,
    products?: Array<{ id: number; position?: number }>
  ): Promise<void> {
    await this.client.put(`/smart_collections/${id}/order.json`, {
      sort_order: sortOrder,
      products,
    });
  }

  // --- Collects (product ↔ collection links) ---

  async listCollects(params?: { collection_id?: number; product_id?: number; limit?: number }): Promise<ShopifyListResponse<Collect>> {
    const res = await this.client.get<{ collects: Collect[] }>(
      "/collects.json",
      params as Record<string, unknown>
    );
    return { data: res.collects };
  }

  async addProductToCollection(productId: number, collectionId: number): Promise<Collect> {
    const res = await this.client.post<{ collect: Collect }>("/collects.json", {
      collect: { product_id: productId, collection_id: collectionId },
    });
    return res.collect;
  }

  async removeProductFromCollection(collectId: number): Promise<void> {
    await this.client.delete(`/collects/${collectId}.json`);
  }
}
