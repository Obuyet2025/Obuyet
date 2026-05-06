import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShopifyClient } from "../src/client.js";
import { InventoryResource } from "../src/resources/inventory.js";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function ok(body: unknown) {
  return { ok: true, status: 200, headers: new Headers(), json: async () => body };
}

describe("InventoryResource", () => {
  let inventory: InventoryResource;

  beforeEach(() => {
    const client = new ShopifyClient({ shop: "test.myshopify.com", accessToken: "t", retryLimit: 0 });
    inventory = new InventoryResource(client);
    mockFetch.mockReset();
  });

  it("setLevel posts to set endpoint", async () => {
    const fixture = { inventory_item_id: 1, location_id: 2, available: 50 };
    mockFetch.mockResolvedValueOnce(ok({ inventory_level: fixture }));

    const result = await inventory.setLevel({ inventory_item_id: 1, location_id: 2, available: 50 });
    expect(result.available).toBe(50);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("inventory_levels/set.json");
  });

  it("adjustLevel posts to adjust endpoint", async () => {
    const fixture = { inventory_item_id: 1, location_id: 2, available: 55 };
    mockFetch.mockResolvedValueOnce(ok({ inventory_level: fixture }));

    await inventory.adjustLevel({ inventory_item_id: 1, location_id: 2, available_adjustment: 5 });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("inventory_levels/adjust.json");
  });

  it("listLocations returns locations array", async () => {
    const fixture = [{ id: 1, name: "HQ" }, { id: 2, name: "Warehouse" }];
    mockFetch.mockResolvedValueOnce(ok({ locations: fixture }));

    const result = await inventory.listLocations();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("HQ");
  });
});
