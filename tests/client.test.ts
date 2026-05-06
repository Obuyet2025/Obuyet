import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShopifyClient } from "../src/client.js";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => body,
  };
}

describe("ShopifyClient", () => {
  let client: ShopifyClient;

  beforeEach(() => {
    client = new ShopifyClient({
      shop: "test-shop.myshopify.com",
      accessToken: "test-token",
      retryLimit: 0,
    });
    mockFetch.mockReset();
  });

  it("sends correct headers", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ ok: true }));
    await client.get("/test.json");

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("test-shop.myshopify.com");
    expect((init as RequestInit).headers as Record<string, string>).toMatchObject({
      "X-Shopify-Access-Token": "test-token",
    });
  });

  it("appends query params on GET", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ products: [] }));
    await client.get("/products.json", { limit: 10, status: "active" });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("limit=10");
    expect(url).toContain("status=active");
  });

  it("throws ShopifyApiError on 422", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ errors: { title: ["can't be blank"] } }, 422)
    );

    await expect(client.post("/products.json", {})).rejects.toMatchObject({
      status: 422,
      errors: [{ field: ["title"] }],
    });
  });

  it("throws ShopifyApiError on string errors", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ errors: "Not Found" }, 404)
    );
    await expect(client.get("/products/999.json")).rejects.toMatchObject({
      status: 404,
      message: "Not Found",
    });
  });

  it("returns undefined for 204 responses", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204, headers: new Headers(), json: async () => {} });
    const result = await client.delete("/products/1.json");
    expect(result).toBeUndefined();
  });
});
