# 07 — Pinterest Ads

Best-fit ICP: D2C e-commerce in visual categories (home, garden, fashion, food, DIY/crafts, wedding, travel, beauty). Poor fit for B2B SaaS, developer tools, and most B2B products.

---

## 2026 benchmark data

| Metric | Benchmark |
|---|---|
| Average ROAS (all categories) | 2.0-3.5x |
| Average ROAS (DIY/Crafts) | 3.5-5.0x |
| Average ROAS (Home/Garden) | 2.5-4.0x |
| Average ROAS (Fashion/Apparel) | 2.0-3.0x |
| Catalog integration ROAS uplift | +30-50% vs manual product ads |
| Attribution window | 70-90 days (longer than most platforms) |

*Source: `research/external/2026-05-20-pinterest-roas-benchmarks-2026.md`*

---

## The 70-90 day attribution window

Pinterest users use the platform for **planning and discovery**, not impulse buying. The typical path from Pinterest ad impression to purchase spans weeks to months. This is a critical distinction from Meta or Google:

- A Pinterest ad shown on day 1 may convert on day 60.
- Standard 7-day or 28-day attribution windows severely undercount Pinterest's contribution.
- Pinterest's default attribution window is 30-day click + 30-day view. Extend to 60-day or 90-day in campaign settings for accurate ROAS measurement.

**Implication:** Never evaluate Pinterest ROAS at 30 days. The 90-day window is the correct measurement horizon.

*Source: `research/external/2026-05-20-pinterest-roas-benchmarks-2026.md`*

---

## Product Catalog integration

The single highest-impact setup action for e-commerce brands is connecting a Product Catalog.

**Benefits:**
- Enables Shopping Ads (dynamic product ads that auto-pull product images, prices, and titles from your catalog).
- Enables Collection Ads (one hero image + 3 product tiles).
- Unlocks +30-50% ROAS uplift vs manually created product ads.
- Catalog auto-syncs inventory status (out-of-stock items automatically stop running).

**Setup:** In Pinterest Business Hub > Catalogs > Create Catalog. Connect via data feed URL (CSV/TSV/XML), Shopify native integration, or WooCommerce plugin.

---

## Ad formats

**Shopping Ads:** Dynamic ads powered by Product Catalog. Best for bottom-of-funnel conversion.

**Collection Ads:** One lifestyle/brand image above 3 product tiles. Best for mid-funnel discovery + conversion.

**Standard Pins:** Static image ads. Brand awareness and content promotion.

**Video Pins:** Autoplay video ads. Strong for brand storytelling; 6-15 seconds perform best.

**Carousel Pins:** Multiple images in one ad. Good for product comparison or step-by-step content.

---

## Pinterest Tag + CAPI

Pinterest Tag: JavaScript pixel. Standard setup via Pinterest's official tag implementation guide or via Shopify/WooCommerce native integrations.

Pinterest CAPI (Conversions API): Available. Recommended architecture is dual Tag + CAPI with deduplication. Reduces data signal loss from iOS 14.5+ and GDPR consent requirements.

See `guides/12-capi-wiring.md` for Pinterest CAPI wiring.

---

## ICP fit check

**Strong fit:** Lifestyle, home decor, fashion, food/recipes, wedding, travel, fitness/wellness, DIY/crafts, art/photography.

**Weak fit:** B2B SaaS, enterprise software, developer tools, financial services, healthcare (unless direct-to-consumer wellness).

If the user's ICP does not overlap with Pinterest's strongly visual, aspirational content categories, do not recommend Pinterest Ads. Redirect to LinkedIn or Reddit depending on the B2B/B2C split.
