import { Shopify } from "../src/index.js";

const shop = process.env.SHOPIFY_SHOP;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

if (!shop || !accessToken) {
  console.error("Missing SHOPIFY_SHOP or SHOPIFY_ACCESS_TOKEN env vars");
  process.exit(1);
}

const shopify = new Shopify({ shop, accessToken });

function section(title: string) {
  console.log(`\n${"─".repeat(50)}`);
  console.log(`  ${title}`);
  console.log("─".repeat(50));
}

async function main() {
  console.log(`\nConnecting to: ${shop}`);

  // --- Products ---
  section("PRODUCTS");
  const { data: products } = await shopify.products.list({ limit: 5 });
  const productCount = await shopify.products.count();
  console.log(`Total products: ${productCount}`);
  for (const p of products) {
    const variantCount = p.variants?.length ?? 0;
    console.log(`  [${p.id}] ${p.title} — status: ${p.status} — variants: ${variantCount}`);
  }

  // --- Orders ---
  section("ORDERS");
  const { data: orders } = await shopify.orders.list({ limit: 5, status: "any" });
  const orderCount = await shopify.orders.count({ status: "any" });
  console.log(`Total orders: ${orderCount}`);
  for (const o of orders) {
    console.log(`  [${o.id}] ${o.name} — ${o.financial_status} — ${o.currency} ${o.total_price}`);
  }

  // --- Themes ---
  section("THEMES");
  const themes = await shopify.themes.list();
  for (const t of themes) {
    const active = t.role === "main" ? " ★ ACTIVE" : "";
    console.log(`  [${t.id}] ${t.name} — role: ${t.role}${active}`);
  }

  // --- Customers ---
  section("CUSTOMERS");
  const { data: customers } = await shopify.customers.list({ limit: 5 });
  const customerCount = await shopify.customers.count();
  console.log(`Total customers: ${customerCount}`);
  for (const c of customers) {
    console.log(`  [${c.id}] ${c.first_name ?? ""} ${c.last_name ?? ""} <${c.email}> — state: ${c.state}`);
  }

  // --- Collections ---
  section("COLLECTIONS");
  const { data: customCollections } = await shopify.collections.listCustom({ limit: 5 });
  const { data: smartCollections } = await shopify.collections.listSmart({ limit: 5 });
  console.log(`Custom collections (${customCollections.length} shown):`);
  for (const c of customCollections) {
    console.log(`  [${c.id}] ${c.title}`);
  }
  console.log(`Smart collections (${smartCollections.length} shown):`);
  for (const c of smartCollections) {
    console.log(`  [${c.id}] ${c.title}`);
  }

  // --- Inventory / Locations ---
  section("LOCATIONS");
  const locations = await shopify.inventory.listLocations();
  console.log(`Total locations: ${locations.length}`);
  for (const l of locations) {
    const addr = [l.city, l.province, l.country].filter(Boolean).join(", ");
    console.log(`  [${l.id}] ${l.name} — ${addr} — active: ${l.active}`);
  }

  console.log("\n✓ All checks passed — no writes made to the store.\n");
}

main().catch((err) => {
  console.error("\nAPI Error:", err.message);
  if (err.errors) console.error("Details:", JSON.stringify(err.errors, null, 2));
  process.exit(1);
});
