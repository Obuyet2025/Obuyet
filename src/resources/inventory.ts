import type { ShopifyClient } from "../client.js";
import type {
  InventoryItem,
  InventoryLevel,
  Location,
  AdjustInventoryInput,
  SetInventoryLevelInput,
  ConnectInventoryLevelInput,
  ListInventoryLevelsParams,
  UpdateInventoryItemInput,
  ShopifyListResponse,
} from "../types/index.js";

export class InventoryResource {
  constructor(private readonly client: ShopifyClient) {}

  // --- Inventory Items ---

  async listItems(params?: { ids?: string; limit?: number; page_info?: string }): Promise<ShopifyListResponse<InventoryItem>> {
    const res = await this.client.get<{ inventory_items: InventoryItem[] }>(
      "/inventory_items.json",
      params as Record<string, unknown>
    );
    return { data: res.inventory_items };
  }

  async getItem(id: number): Promise<InventoryItem> {
    const res = await this.client.get<{ inventory_item: InventoryItem }>(
      `/inventory_items/${id}.json`
    );
    return res.inventory_item;
  }

  async updateItem(input: UpdateInventoryItemInput): Promise<InventoryItem> {
    const { id, ...rest } = input;
    const res = await this.client.put<{ inventory_item: InventoryItem }>(
      `/inventory_items/${id}.json`,
      { inventory_item: rest }
    );
    return res.inventory_item;
  }

  // --- Inventory Levels ---

  async listLevels(params: ListInventoryLevelsParams): Promise<ShopifyListResponse<InventoryLevel>> {
    const res = await this.client.get<{ inventory_levels: InventoryLevel[] }>(
      "/inventory_levels.json",
      params as Record<string, unknown>
    );
    return { data: res.inventory_levels };
  }

  async setLevel(input: SetInventoryLevelInput): Promise<InventoryLevel> {
    const res = await this.client.post<{ inventory_level: InventoryLevel }>(
      "/inventory_levels/set.json",
      input
    );
    return res.inventory_level;
  }

  async adjustLevel(input: AdjustInventoryInput): Promise<InventoryLevel> {
    const res = await this.client.post<{ inventory_level: InventoryLevel }>(
      "/inventory_levels/adjust.json",
      input
    );
    return res.inventory_level;
  }

  async connectLevel(input: ConnectInventoryLevelInput): Promise<InventoryLevel> {
    const res = await this.client.post<{ inventory_level: InventoryLevel }>(
      "/inventory_levels/connect.json",
      input
    );
    return res.inventory_level;
  }

  async deleteLevel(inventoryItemId: number, locationId: number): Promise<void> {
    await this.client.request("DELETE", "/inventory_levels.json", {
      params: { inventory_item_id: inventoryItemId, location_id: locationId },
    });
  }

  // --- Locations ---

  async listLocations(): Promise<Location[]> {
    const res = await this.client.get<{ locations: Location[] }>("/locations.json");
    return res.locations;
  }

  async countLocations(): Promise<number> {
    const res = await this.client.get<{ count: number }>("/locations/count.json");
    return res.count;
  }

  async getLocation(id: number): Promise<Location> {
    const res = await this.client.get<{ location: Location }>(`/locations/${id}.json`);
    return res.location;
  }

  async getLocationInventoryLevels(locationId: number): Promise<ShopifyListResponse<InventoryLevel>> {
    const res = await this.client.get<{ inventory_levels: InventoryLevel[] }>(
      `/locations/${locationId}/inventory_levels.json`
    );
    return { data: res.inventory_levels };
  }
}
