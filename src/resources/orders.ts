import type { ShopifyClient } from "../client.js";
import type {
  Order,
  CreateOrderInput,
  ListOrdersParams,
  Refund,
  RefundLineItem,
  Fulfillment,
  ShopifyListResponse,
} from "../types/index.js";

export class OrdersResource {
  constructor(private readonly client: ShopifyClient) {}

  async list(params?: ListOrdersParams): Promise<ShopifyListResponse<Order>> {
    const res = await this.client.get<{ orders: Order[] }>(
      "/orders.json",
      params as Record<string, unknown>
    );
    return { data: res.orders };
  }

  async count(params?: Pick<ListOrdersParams, "status" | "financial_status" | "fulfillment_status" | "created_at_min" | "created_at_max" | "updated_at_min" | "updated_at_max">): Promise<number> {
    const res = await this.client.get<{ count: number }>(
      "/orders/count.json",
      params as Record<string, unknown>
    );
    return res.count;
  }

  async get(id: number, fields?: string): Promise<Order> {
    const res = await this.client.get<{ order: Order }>(
      `/orders/${id}.json`,
      fields ? { fields } : undefined
    );
    return res.order;
  }

  async create(input: CreateOrderInput): Promise<Order> {
    const res = await this.client.post<{ order: Order }>("/orders.json", {
      order: input,
    });
    return res.order;
  }

  async update(id: number, input: Partial<Order>): Promise<Order> {
    const res = await this.client.put<{ order: Order }>(`/orders/${id}.json`, {
      order: input,
    });
    return res.order;
  }

  async cancel(
    id: number,
    options?: { reason?: string; email?: boolean; refund?: boolean; amount?: string; currency?: string }
  ): Promise<Order> {
    const res = await this.client.post<{ order: Order }>(
      `/orders/${id}/cancel.json`,
      options
    );
    return res.order;
  }

  async close(id: number): Promise<Order> {
    const res = await this.client.post<{ order: Order }>(`/orders/${id}/close.json`);
    return res.order;
  }

  async open(id: number): Promise<Order> {
    const res = await this.client.post<{ order: Order }>(`/orders/${id}/open.json`);
    return res.order;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/orders/${id}.json`);
  }

  // --- Refunds ---

  async listRefunds(orderId: number): Promise<Refund[]> {
    const res = await this.client.get<{ refunds: Refund[] }>(
      `/orders/${orderId}/refunds.json`
    );
    return res.refunds;
  }

  async calculateRefund(
    orderId: number,
    refundLineItems: RefundLineItem[],
    shipping?: { full_refund?: boolean; amount?: string }
  ): Promise<Refund> {
    const res = await this.client.post<{ refund: Refund }>(
      `/orders/${orderId}/refunds/calculate.json`,
      { refund: { refund_line_items: refundLineItems, shipping } }
    );
    return res.refund;
  }

  async createRefund(
    orderId: number,
    refund: Omit<Refund, "id" | "order_id" | "created_at">
  ): Promise<Refund> {
    const res = await this.client.post<{ refund: Refund }>(
      `/orders/${orderId}/refunds.json`,
      { refund }
    );
    return res.refund;
  }

  // --- Fulfillments ---

  async listFulfillments(orderId: number): Promise<Fulfillment[]> {
    const res = await this.client.get<{ fulfillments: Fulfillment[] }>(
      `/orders/${orderId}/fulfillments.json`
    );
    return res.fulfillments;
  }

  async createFulfillment(
    orderId: number,
    fulfillment: Omit<Fulfillment, "id" | "order_id" | "created_at" | "updated_at">
  ): Promise<Fulfillment> {
    const res = await this.client.post<{ fulfillment: Fulfillment }>(
      `/orders/${orderId}/fulfillments.json`,
      { fulfillment }
    );
    return res.fulfillment;
  }

  async updateFulfillment(
    orderId: number,
    fulfillmentId: number,
    fulfillment: Partial<Fulfillment>
  ): Promise<Fulfillment> {
    const res = await this.client.put<{ fulfillment: Fulfillment }>(
      `/orders/${orderId}/fulfillments/${fulfillmentId}.json`,
      { fulfillment }
    );
    return res.fulfillment;
  }

  async cancelFulfillment(orderId: number, fulfillmentId: number): Promise<Fulfillment> {
    const res = await this.client.post<{ fulfillment: Fulfillment }>(
      `/orders/${orderId}/fulfillments/${fulfillmentId}/cancel.json`
    );
    return res.fulfillment;
  }
}
