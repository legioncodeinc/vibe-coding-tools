# 05 — Microsoft Advertising / Bing Ads

Best-fit ICP: B2B buyers over 35, Microsoft-ecosystem companies, LinkedIn-targetable professionals. Strongest unique advantage: LinkedIn Profile Targeting layered onto search campaigns.

---

## LinkedIn Profile Targeting — Microsoft's platform-exclusive differentiator

No other search platform offers LinkedIn Profile Targeting (LPT). Microsoft Advertising's integration with LinkedIn allows layering B2B audience attributes (company, industry, job function, seniority) onto standard search campaigns.

**Proven LPT performance impact:**
- 16% CTR lift (vs non-LPT search campaigns targeting the same keywords)
- 64% CVR lift (vs non-LPT search campaigns)
- 30-50% lower cost per SQL vs keyword-only search

This makes Microsoft Advertising uniquely powerful for B2B search intent campaigns where the buyer persona can be defined by LinkedIn attributes.

*Source: `research/external/2026-05-20-microsoft-ads-linkedin-profile-targeting-b2b.md`*

---

## LinkedIn Profile Targeting: setup (6 steps)

1. **Log into Microsoft Advertising.** Navigate to the campaign you want to add LPT to.
2. **Go to Ad Group or Campaign level > Audiences > Add audience association.**
3. **Select "LinkedIn Profile Targeting."**
4. **Choose targeting dimensions:** Company (by name or industry), Job Function, Job Title, Company Size, Seniority.
5. **Set bid modifier:** Add a bid increase of 10-30% for your LPT audience layer to ensure your ads show more frequently to matched profiles. Do NOT use "Target Only" — this restricts delivery to only LPT-matched users and reduces volume severely.
6. **Enable observation mode first** for 1-2 weeks to see performance data before committing to bid adjustments.

> **Important:** LinkedIn Profile Targeting uses "bid modifier" (observation) mode by default. Switch to "Target Only" only for highly targeted ABM campaigns where you explicitly want to exclude non-LPT traffic. For most campaigns, bid modifier mode is correct.

*Source: `research/external/2026-05-20-microsoft-ads-linkedin-targeting-implementation.md`*

---

## Import from Google Ads

If the user already runs Google Ads campaigns, Microsoft Advertising supports importing campaigns directly.

**Import workflow:**
1. In Microsoft Advertising, go to Import > Import from Google Ads.
2. Authenticate with Google Ads.
3. Select campaigns/ad groups/keywords to import.
4. Map extensions and landing pages.
5. Run the import — Microsoft will auto-translate Google Ads formats to Microsoft equivalents.

**Post-import tasks:**
- Review and adjust bids (Bing CPCs are typically 20-30% lower than Google — initial bids from Google import may be too high).
- Set up UET (Universal Event Tracking) tag separately — it does not import from Google Tag Manager automatically.
- Add LinkedIn Profile Targeting layer (this is the incremental value vs a Google clone).

---

## Universal Event Tracking (UET) tag

The Microsoft Advertising tracking pixel. Required for conversion tracking and remarketing.

**Setup:**
1. Create a UET tag in Microsoft Advertising (Tools > Conversion Tracking > UET Tags).
2. Install the UET tag JavaScript in `<head>` or via Google Tag Manager (Microsoft has a native GTM template).
3. Create Conversion Goals (Tools > Conversion Tracking > Conversion Goals).
4. Verify tag fires on conversion pages via the UET Tag Helper browser extension.

For server-side CAPI with Microsoft Advertising (Enhanced Conversions), see `guides/12-capi-wiring.md`.

---

## 2026 benchmarks

| Metric | Microsoft/Bing Ads |
|---|---|
| Avg CPC vs Google Search | 20-35% lower |
| Avg CPA (with LPT) | 30-50% lower than Google Search (same keyword set) |
| Audience demographics | Older (35+), higher household income, Microsoft workplace users |
| Market share (US search) | ~6-9% vs Google's ~89% |

*Source: `research/external/2026-05-20-microsoft-ads-linkedin-profile-targeting-b2b.md`*

---

## Microsoft Audience Network

Beyond search, Microsoft Advertising offers the Audience Network — display/native ads across MSN, Outlook, Xbox, and third-party publishers. Uses the same LinkedIn Profile Targeting layer.

Best use case: retargeting existing website visitors with LinkedIn-profile-refined audience overlays. Not recommended as a cold acquisition channel.
