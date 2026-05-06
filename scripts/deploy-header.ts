/**
 * deploy-header.ts
 *
 * Applies the OBUYET desktop header redesign to the live theme.
 * Changes are scoped to min-width: 990px — mobile/tablet are untouched.
 *
 * Usage:
 *   SHOPIFY_SHOP=obuyet.myshopify.com \
 *   SHOPIFY_ACCESS_TOKEN=shpat_xxxx \
 *   npx tsx scripts/deploy-header.ts
 *
 * What it changes:
 *   1. assets/custom.css — appends desktop-only header CSS
 *   2. sections/header-inline.liquid — injects desktop trust strip HTML
 *
 * The script is idempotent: re-running it is safe.
 */

import { Shopify } from "../src/index.js";

const shop = process.env.SHOPIFY_SHOP;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

if (!shop || !accessToken) {
  console.error("Missing SHOPIFY_SHOP or SHOPIFY_ACCESS_TOKEN env vars");
  process.exit(1);
}

const THEME_ID = 184792121708; // OBUYETUAE — active/main theme

const shopify = new Shopify({ shop, accessToken });

// ─── CSS block ──────────────────────────────────────────────────────────────
const REDESIGN_CSS = `

/* ============================================================
   OBUYET DESKTOP HEADER REDESIGN — v3
   All rules scoped to desktop (min-width: 990px).
   Mobile / tablet are 100% untouched.
   To revert: delete everything between START and END markers.
   ============================================================ */
/* OBUYET-HEADER-REDESIGN:START */

/* 1. Announcement bar — compact terracotta strip */
@media screen and (min-width: 990px) {
  .t4s-announcement-bar,
  #shopify-section-announcement-bar .t4s-announcement-bar {
    background-color: #E2783C !important;
    min-height: 40px !important;
    max-height: 44px !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .t4s-announcement-bar .t4s-container,
  .t4s-announcement-bar-text,
  .t4s-announcement-bar__inner {
    min-height: 40px !important;
    align-items: center !important;
    justify-content: center !important;
  }
  /* White text on all children except the close button */
  .t4s-announcement-bar *:not(.t4s-announcement-bar-close) {
    color: #ffffff !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    letter-spacing: 0.01em !important;
  }

  /* 2. Main header row — white, compact */
  .t4s-section-header [data-header-height] {
    min-height: 88px !important;
    max-height: 96px !important;
  }
  .t4s-header__wrapper {
    background: #ffffff !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  }

  /* 3. Navigation — premium boutique styling */
  .t4s-nav__ul > li > a {
    font-size: 16px !important;
    font-weight: 600 !important;
    letter-spacing: 0.01em !important;
    color: #222222 !important;
    padding: 5px 22px !important;
    transition: color 0.2s ease !important;
  }
  .t4s-nav__ul > li > a:hover {
    color: #E2783C !important;
  }
  /* "Sale" link — always terracotta */
  .t4s-nav__ul > li > a[href*="sale"],
  .t4s-nav__ul > li > a[href*="/collections/sale"],
  .t4s-nav__ul > li > a[href$="/sale"] {
    color: #E2783C !important;
  }

  /* 4. Header icons — dark, consistent size */
  .t4s-site-nav__icons svg.t4s-icon {
    width: 24px !important;
    height: 24px !important;
    color: #222222 !important;
  }
  .t4s-site-nav__icons .t4s-site-nav__icon {
    padding: 0 14px !important;
  }
  /* Cart count bubble — terracotta */
  .t4s-count-box {
    background-color: #E2783C !important;
    color: #ffffff !important;
    border-radius: 50% !important;
    font-size: 10px !important;
    font-weight: 700 !important;
  }

  /* 5. Hide Temu-style full-width search bar on desktop */
  .oby-mini__wrap {
    display: none !important;
  }

  /* 6. Desktop trust strip (HTML injected into header-inline.liquid) */
  .oby-desktop-trust {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: #fffaf7 !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
    min-height: 52px !important;
    padding: 0 20px !important;
    width: 100% !important;
  }
  .oby-desktop-trust__item {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #222222 !important;
    padding: 0 28px !important;
    white-space: nowrap !important;
  }
  .oby-desktop-trust__sep {
    display: block !important;
    width: 1px !important;
    height: 20px !important;
    background: rgba(0, 0, 0, 0.12) !important;
    flex-shrink: 0 !important;
  }
}

/* 990px–1200px: tighten gaps to prevent nav wrapping */
@media screen and (min-width: 990px) and (max-width: 1200px) {
  .t4s-nav__ul > li > a {
    padding: 5px 14px !important;
  }
  .oby-desktop-trust__item {
    padding: 0 18px !important;
    font-size: 13px !important;
  }
}

/* Hide desktop trust strip on mobile / tablet */
@media screen and (max-width: 989px) {
  .oby-desktop-trust {
    display: none !important;
  }
}

/* OBUYET-HEADER-REDESIGN:END */
`;

// ─── Trust strip HTML to inject into header-inline.liquid ───────────────────
const TRUST_STRIP_HTML = `
{%- comment -%}✅ Desktop-only trust strip — hidden on mobile/tablet via CSS{%- endcomment -%}
<div class="oby-desktop-trust" role="region" aria-label="Store highlights">
  <span class="oby-desktop-trust__item">🇦🇪 UAE Fulfilled</span>
  <span class="oby-desktop-trust__sep" aria-hidden="true"></span>
  <span class="oby-desktop-trust__item">🚚 Delivered Same Day or 48Hrs Max!</span>
  <span class="oby-desktop-trust__sep" aria-hidden="true"></span>
  <span class="oby-desktop-trust__item">💳 Cash on Delivery, Apple Pay, Gpay</span>
  <span class="oby-desktop-trust__sep" aria-hidden="true"></span>
  <span class="oby-desktop-trust__item">✅ Trusted Quality</span>
</div>

`;

// The unique Liquid tag we insert the trust strip before
const LIQUID_ANCHOR = `{%- if h_transparent -%}`;
const CSS_MARKER = "OBUYET-HEADER-REDESIGN:START";
const TRUST_MARKER = "oby-desktop-trust";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function section(title: string) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`  ${title}`);
  console.log("─".repeat(60));
}

// ─── Step 1: Patch custom.css ─────────────────────────────────────────────────

async function patchCustomCss() {
  section("assets/custom.css");

  const asset = await shopify.themes.getAsset(THEME_ID, "assets/custom.css");
  const current = asset.value ?? "";

  if (current.includes(CSS_MARKER)) {
    console.log("  ✓ Redesign CSS already applied — skipping.");
    return;
  }

  const updated = current + REDESIGN_CSS;
  await shopify.themes.upsertAsset(THEME_ID, { key: "assets/custom.css", value: updated });
  console.log("  ✓ Redesign CSS appended and uploaded.");
}

// ─── Step 2: Inject trust strip into header-inline.liquid ─────────────────────

async function patchHeaderLiquid() {
  section("sections/header-inline.liquid");

  const asset = await shopify.themes.getAsset(THEME_ID, "sections/header-inline.liquid");
  const current = asset.value ?? "";

  if (current.includes(TRUST_MARKER)) {
    console.log("  ✓ Trust strip already present — skipping.");
    return;
  }

  if (!current.includes(LIQUID_ANCHOR)) {
    console.error(
      `  ✗ Could not find anchor string "${LIQUID_ANCHOR}" in header-inline.liquid.\n` +
        "    The theme may have changed — aborting to avoid corruption."
    );
    process.exit(1);
  }

  // Insert trust strip immediately before the transparent-header script block
  const updated = current.replace(LIQUID_ANCHOR, TRUST_STRIP_HTML + LIQUID_ANCHOR);

  await shopify.themes.upsertAsset(THEME_ID, {
    key: "sections/header-inline.liquid",
    value: updated,
  });
  console.log("  ✓ Trust strip HTML injected and uploaded.");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n  Deploying OBUYET desktop header redesign`);
  console.log(`  Theme ID : ${THEME_ID}`);
  console.log(`  Store    : ${shop}`);

  await patchCustomCss();
  await patchHeaderLiquid();

  console.log(`\n${"─".repeat(60)}`);
  console.log("  ✅ Deployment complete!");
  console.log("  → Preview at: https://obuyet.com  (desktop, min-width 990px)");
  console.log("\n  To REVERT, run:  npx tsx scripts/revert-header.ts");
  console.log("─".repeat(60));
}

main().catch((err) => {
  console.error("\n  ✗ Error:", err.message);
  if (err.errors) console.error("    Details:", JSON.stringify(err.errors, null, 2));
  process.exit(1);
});
