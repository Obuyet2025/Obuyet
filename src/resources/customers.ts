import type { ShopifyClient } from "../client.js";
import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  ListCustomersParams,
  SearchCustomersParams,
  ShopifyListResponse,
  Address,
  Order,
} from "../types/index.js";

export class CustomersResource {
  constructor(private readonly client: ShopifyClient) {}

  async list(params?: ListCustomersParams): Promise<ShopifyListResponse<Customer>> {
    const res = await this.client.get<{ customers: Customer[] }>(
      "/customers.json",
      params as Record<string, unknown>
    );
    return { data: res.customers };
  }

  async count(): Promise<number> {
    const res = await this.client.get<{ count: number }>("/customers/count.json");
    return res.count;
  }

  async search(params: SearchCustomersParams): Promise<ShopifyListResponse<Customer>> {
    const res = await this.client.get<{ customers: Customer[] }>(
      "/customers/search.json",
      params as Record<string, unknown>
    );
    return { data: res.customers };
  }

  async get(id: number, fields?: string): Promise<Customer> {
    const res = await this.client.get<{ customer: Customer }>(
      `/customers/${id}.json`,
      fields ? { fields } : undefined
    );
    return res.customer;
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    const res = await this.client.post<{ customer: Customer }>("/customers.json", {
      customer: input,
    });
    return res.customer;
  }

  async update(input: UpdateCustomerInput): Promise<Customer> {
    const { id, ...rest } = input;
    const res = await this.client.put<{ customer: Customer }>(
      `/customers/${id}.json`,
      { customer: rest }
    );
    return res.customer;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/customers/${id}.json`);
  }

  async sendInvite(
    id: number,
    options?: { to?: string; from?: string; subject?: string; custom_message?: string }
  ): Promise<{ customer_invite: Record<string, unknown> }> {
    return this.client.post(`/customers/${id}/send_invite.json`, {
      customer_invite: options ?? {},
    });
  }

  async generateAccountActivationUrl(id: number): Promise<string> {
    const res = await this.client.post<{ account_activation_url: string }>(
      `/customers/${id}/account_activation_url.json`
    );
    return res.account_activation_url;
  }

  // --- Addresses ---

  async listAddresses(customerId: number): Promise<Address[]> {
    const res = await this.client.get<{ addresses: Address[] }>(
      `/customers/${customerId}/addresses.json`
    );
    return res.addresses;
  }

  async createAddress(customerId: number, address: Address): Promise<Address> {
    const res = await this.client.post<{ customer_address: Address }>(
      `/customers/${customerId}/addresses.json`,
      { address }
    );
    return res.customer_address;
  }

  async updateAddress(
    customerId: number,
    addressId: number,
    address: Partial<Address>
  ): Promise<Address> {
    const res = await this.client.put<{ customer_address: Address }>(
      `/customers/${customerId}/addresses/${addressId}.json`,
      { address }
    );
    return res.customer_address;
  }

  async deleteAddress(customerId: number, addressId: number): Promise<void> {
    await this.client.delete(`/customers/${customerId}/addresses/${addressId}.json`);
  }

  async setDefaultAddress(customerId: number, addressId: number): Promise<Address> {
    const res = await this.client.put<{ customer_address: Address }>(
      `/customers/${customerId}/addresses/${addressId}/default.json`
    );
    return res.customer_address;
  }

  // --- Orders ---

  async listOrders(customerId: number, params?: { status?: string }): Promise<Order[]> {
    const res = await this.client.get<{ orders: Order[] }>(
      `/customers/${customerId}/orders.json`,
      params as Record<string, unknown>
    );
    return res.orders;
  }
}
