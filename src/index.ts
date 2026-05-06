import { ShopifyClient } from "./client.js";
import {
  ProductsResource,
  OrdersResource,
  ThemesResource,
  CustomersResource,
  CollectionsResource,
  InventoryResource,
} from "./resources/index.js";
import type { ShopifyClientConfig } from "./types/index.js";

export class Shopify {
  readonly products: ProductsResource;
  readonly orders: OrdersResource;
  readonly themes: ThemesResource;
  readonly customers: CustomersResource;
  readonly collections: CollectionsResource;
  readonly inventory: InventoryResource;

  private readonly client: ShopifyClient;

  constructor(config: ShopifyClientConfig) {
    this.client = new ShopifyClient(config);
    this.products = new ProductsResource(this.client);
    this.orders = new OrdersResource(this.client);
    this.themes = new ThemesResource(this.client);
    this.customers = new CustomersResource(this.client);
    this.collections = new CollectionsResource(this.client);
    this.inventory = new InventoryResource(this.client);
  }
}

export { ShopifyClient } from "./client.js";
export * from "./types/index.js";
export * from "./resources/index.js";
