import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShopifyClient } from "../src/client.js";
import { ProductsResource } from "../src/resources/products.js";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function ok(body: unknown) {
  return {
    ok: true,
    status: 200,
    headers: new Headers(),
    json: async () => body,
  };
}

describe("ProductsResource", () => {
  let products: ProductsResource;

  beforeEach(() => {
    const client = new ShopifyClient({
      shop: "test.myshopify.com",
      accessToken: "token",
      retryLimit: 0,
    });
    products = new ProductsResource(client);
    mockFetch.mockReset();
  });

  it("list returns products array", async () => {
    const fixture = [{ id: 1, title: "T-Shirt" }];
    mockFetch.mockResolvedValueOnce(ok({ products: fixture }));

    const result = await products.list({ limit: 5 });
    expect(result.data).toEqual(fixture);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("products.json");
    expect(url).toContain("limit=5");
  });

  it("get returns single product", async () => {
    const fixture = { id: 42, title: "Hoodie" };
    mockFetch.mockResolvedValueOnce(ok({ product: fixture }));

    const result = await products.get(42);
    expect(result).toEqual(fixture);
    expect(mockFetch.mock.calls[0][0]).toContain("/products/42.json");
  });

  it("create sends POST with product body", async () => {
    const input = { title: "New Product" };
    const fixture = { id: 99, ...input };
    mockFetch.mockResolvedValueOnce(ok({ product: fixture }));

    const result = await products.create(input);
    expect(result).toEqual(fixture);

    const [, init] = mockFetch.mock.calls[0];
    expect((init as RequestInit).method).toBe("POST");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.product.title).toBe("New Product");
  });

  it("update sends PUT to correct URL", async () => {
    const fixture = { id: 1, title: "Updated" };
    mockFetch.mockResolvedValueOnce(ok({ product: fixture }));

    await products.update({ id: 1, title: "Updated" });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("/products/1.json");
    expect((init as RequestInit).method).toBe("PUT");
  });

  it("delete sends DELETE to correct URL", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204, headers: new Headers(), json: async () => {} });

    await products.delete(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("/products/1.json");
    expect((init as RequestInit).method).toBe("DELETE");
  });

  it("count returns number", async () => {
    mockFetch.mockResolvedValueOnce(ok({ count: 25 }));
    const count = await products.count();
    expect(count).toBe(25);
  });
});
