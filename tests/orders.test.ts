import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShopifyClient } from "../src/client.js";
import { OrdersResource } from "../src/resources/orders.js";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function ok(body: unknown) {
  return { ok: true, status: 200, headers: new Headers(), json: async () => body };
}

describe("OrdersResource", () => {
  let orders: OrdersResource;

  beforeEach(() => {
    const client = new ShopifyClient({ shop: "test.myshopify.com", accessToken: "t", retryLimit: 0 });
    orders = new OrdersResource(client);
    mockFetch.mockReset();
  });

  it("list returns orders", async () => {
    const fixture = [{ id: 1001, name: "#1001" }];
    mockFetch.mockResolvedValueOnce(ok({ orders: fixture }));

    const result = await orders.list({ status: "open" });
    expect(result.data).toEqual(fixture);
    expect(mockFetch.mock.calls[0][0]).toContain("status=open");
  });

  it("cancel posts to cancel endpoint", async () => {
    const fixture = { id: 1001, cancelled_at: "2024-01-01" };
    mockFetch.mockResolvedValueOnce(ok({ order: fixture }));

    await orders.cancel(1001, { reason: "customer" });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/orders/1001/cancel.json");
  });

  it("createFulfillment posts to fulfillments endpoint", async () => {
    const fixture = { id: 1, status: "success" };
    mockFetch.mockResolvedValueOnce(ok({ fulfillment: fixture }));

    await orders.createFulfillment(1001, { line_items: [] });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("/orders/1001/fulfillments.json");
    expect((init as RequestInit).method).toBe("POST");
  });

  it("createRefund posts to refunds endpoint", async () => {
    const fixture = { id: 5, order_id: 1001 };
    mockFetch.mockResolvedValueOnce(ok({ refund: fixture }));

    await orders.createRefund(1001, { refund_line_items: [] });

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/orders/1001/refunds.json");
  });
});
