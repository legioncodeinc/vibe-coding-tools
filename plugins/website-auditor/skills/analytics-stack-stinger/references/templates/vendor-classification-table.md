# Analytics/tracking vendor classification table

Copy-ready reference for classifying a vendor already listed in `01-recon/vendor-inventory.md` into this Stinger's three scoring buckets (foundational, industry-specific, de-anonymization), or for a manual spot-check during `guides/01-audit-procedure.md`. Every row states its grounding tier explicitly. Do not upgrade a Tier B or Tier C row to "confirmed" without an independent second signal; that discipline is what conduct rule 4 (verification log) exists to enforce.

## How to read the tiers

- **Tier A, grounded.** The signature is cited to a downloaded primary source in `references/research/raw/`. Treat a match as a confirmed detection.
- **Tier B, general/public knowledge.** The signature is well-known, publicly documented platform behavior (a vendor's own script host, standard for years) but is not itself cited to a source in this Stinger's research archive. Treat a match as a strong candidate, not an archive-verified fact, and say so in the finding's justification line.
- **Tier C, unconfirmed candidate.** The vendor is named in this Stinger's own research (it shows up in the de-anonymization market discussion) but no raw source in this archive documents a technical fingerprint for it. A domain or script sighting that matches a Tier C row is a **candidate only**, log it and route it to manual verification, never assert vendor identity from a Tier C row alone.

## Tier A: tag-management layer (grounded)

| Vendor / class | Channel | Signature | Source |
|---|---|---|---|
| Google Tag Manager | JavaScript global | `window.google_tag_data`, `window.google_tag_manager`, `window.googletag` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Google Tag Manager | HTML source | `googletagmanager\.com/ns\.html[^>]+></iframe>`, `<!-- (?:End )?Google Tag Manager -->` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Google Tag Manager | Script src URL | `googletagmanager\.com/gtm\.js`, `\.googletagmanager\.com/` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |

Per the same source: no single signal is conclusive alone, cross-reference multiple signals and weight by confidence; GTM is a hosted SaaS product, so version-specific detection beyond presence is usually not possible unless a version leaks via response headers or a generator meta tag. When GTM is present, treat it as a strong cue that other analytics/tracking vendors below are loaded through it rather than hard-coded, and check the rendered/hydrated page (not just static HTML) for what it injects.

## Tier B: common foundational analytics platforms (general knowledge, not archive-sourced)

These are publicly documented, long-standing script hosts for widely deployed platforms. None of them is cited to a source in this Stinger's `references/research/raw/` archive; report a match as "Tier B, general-knowledge signature, not independently verified against this archive's primary sources."

| Vendor / class | Typical channel | Common signature (illustrative, not exhaustive) |
|---|---|---|
| Google Analytics 4 | Script src / global | `googletagmanager.com/gtag/js`, `google-analytics.com/g/collect`, `window.gtag`, `window.dataLayer` |
| Meta Pixel | Script src / global | `connect.facebook.net/.../fbevents.js`, `window.fbq` |
| LinkedIn Insight Tag | Script src / global | `snap.licdn.com/li.lms-analytics/insight.min.js`, `window._linkedin_data_partner_ids` |
| TikTok Pixel | Script src / global | `analytics.tiktok.com/i18n/pixel/events.js`, `window.ttq` |
| Adobe Analytics | Script src | `assets.adobedtm.com/`, `/AppMeasurement.js` |
| Matomo (self-hosted or cloud) | Script src / global | `matomo.js` or `piwik.js`, `window._paq` |

## Tier C: de-anonymization / visitor-identification vendors named in this archive (unconfirmed, candidates only)

No raw source in this Stinger's archive documents a script-src, global-variable, or HTML-comment fingerprint for any of the following. They are named because the market-analysis sources discuss them by name or by category, not because a detection signature exists here. [raw/abmatic-ai-blog-is-website-visitor-deanonymization-gdpr-compliant.md] [raw/www-leadpipe-com-blog-state-of-website-visitor-identification-2026.md]

| Vendor / category named in research | Tier that source places it in | What this Stinger can currently say |
|---|---|---|
| RB2B | Contact-level (person reveal) | Name only, no fingerprint in archive. Flag any unrecognized script domain that self-identifies as a "visitor identification" or "de-anonymization" vendor and route to manual verification. |
| Clearbit-style / "Clearbit-style category" | Contact-level (person reveal) | Same as above. |
| Leadpipe | Person-level, deterministic-tier vendor (source is itself a Leadpipe-published blog) | Same as above; this is the source's own product, treat its self-description as vendor-interested, not neutral. |
| Abmatic AI | Company-level and contact-level resolution (source is itself an Abmatic-published blog) | Same as above; same vendor-interest caveat. |
| Generic reverse-IP / company-level identification tooling | Company-level | No named vendor or fingerprint; if `01-recon/vendor-inventory.md` surfaces a script whose stated purpose is IP-to-company resolution, classify by function using the company-level vs contact-level table in `guides/04-deanonymization-and-jurisdiction.md`, not by brand-name match. |

## Content-injection tier (flag, do not score here)

| Vendor | Signature | Why it is flagged separately | Source |
|---|---|---|---|
| Search Atlas OTTO Pixel | No technical fingerprint in this archive (vendor page leaves its own "is this a tracking pixel?" FAQ unanswered) | Write-capable: reads pages and deploys changes to meta tags, schema, on-page content, and Google Business Profile "on its own" by default, an approval mode exists but is opt-in. This is a content-injection/SEO-manipulation risk class, not a passive analytics pixel. `vendor-inventory-wasp-drone` owns primary detection and scoring of this class; this Stinger's job is to flag if an analytics-classified vendor also shows this write-back capability, not to duplicate the finding. | [raw/searchatlas-com-otto-pixel.md] |
