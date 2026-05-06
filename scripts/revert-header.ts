/**
 * revert-header.ts
 *
 * Reverts the OBUYET desktop header redesign from the live theme.
 *
 * Usage:
 *   SHOPIFY_SHOP=obuyet.myshopify.com \
 *   SHOPIFY_ACCESS_TOKEN=shpat_xxxx \
 *   npx tsx scripts/revert-header.ts
 */

import { Shopify } from "../src/index.js";

const shop = process.env.SHOPIFY_SHOP;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

if (!shop || !accessToken) {
  console.error("Missing SHOPIFY_SHOP or SHOPIFY_ACCESS_TOKEN env vars");
  process.exit(1);
}

const THEME_ID = 184792121708;
const shopify = new Shopify({ shop, accessToken });

const CSS_START_MARKER = "/* OBUYET-HEADER-REDESIGN:START */";
const CSS_END_MARKER = "/* OBUYET-HEADER-REDESIGN:END */";
const TRUST_START = `{%- comment -%}✅ Desktop-only trust strip`;
const TRUST_END = `</div>\n\n`;

function section(title: string) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`  ${title}`);
  console.log("─".repeat(60));
}

async function revertCustomCss() {
  section("assets/custom.css");

  const asset = await shopify.themes.getAsset(THEME_ID, "assets/custom.css");
  const current = asset.value ?? "";

  const startIdx = current.indexOf(CSS_START_MARKER);
  const endIdx = current.indexOf(CSS_END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.log("  ✓ Redesign CSS not found — nothing to revert.");
    return;
  }

  // Remove everything from the blank line before START to after END
  const blockStart = current.lastIndexOf("\n", startIdx - 2) + 1;
  const blockEnd = endIdx + CSS_END_MARKER.length;

  const updated = current.slice(0, blockStart) + current.slice(blockEnd);

  await shopify.themes.upsertAsset(THEME_ID, { key: "assets/custom.css", value: updated });
  console.log("  ✓ Redesign CSS removed.");
}

async function revertHeaderLiquid() {
  section("sections/header-inline.liquid");

  const asset = await shopify.themes.getAsset(THEME_ID, "sections/header-inline.liquid");
  const current = asset.value ?? "";

  const startIdx = current.indexOf(TRUST_START);
  if (startIdx === -1) {
    console.log("  ✓ Trust strip not found — nothing to revert.");
    return;
  }

  // Find the closing </div>\n\n that belongs to the trust strip
  const trustDivClose = "</div>\n\n";
  const endIdx = current.indexOf(trustDivClose, startIdx);
  if (endIdx === -1) {
    console.error("  ✗ Could not locate end of trust strip — aborting.");
    process.exit(1);
  }

  // Remove the blank line before the trust strip comment too
  const blockStart = current.lastIndexOf("\n", startIdx - 2) + 1;
  const blockEnd = endIdx + trustDivClose.length;

  const updated = current.slice(0, blockStart) + current.slice(blockEnd);

  await shopify.themes.upsertAsset(THEME_ID, {
    key: "sections/header-inline.liquid",
    value: updated,
  });
  console.log("  ✓ Trust strip removed from header-inline.liquid.");
}

async function main() {
  console.log(`\n  Reverting OBUYET desktop header redesign`);
  console.log(`  Theme ID : ${THEME_ID}`);
  console.log(`  Store    : ${shop}`);

  await revertCustomCss();
  await revertHeaderLiquid();

  console.log(`\n${"─".repeat(60)}`);
  console.log("  ✅ Revert complete — header restored to original state.");
  console.log("─".repeat(60));
}

main().catch((err) => {
  console.error("\n  ✗ Error:", err.message);
  if (err.errors) console.error("    Details:", JSON.stringify(err.errors, null, 2));
  process.exit(1);
});
