# Vendor lookup table

Human-readable copy of the table that drives `shared/scripts/vendor-census.py`
(`VENDOR_SIGNATURES`). If the two ever disagree, the script is the source of truth for what actually
runs; update this file to match it, not the other way around.

`Category` follows PRD-004's fixed function taxonomy: `analytics`, `tag-manager`, `chat`,
`payments`, `cro-testing`, `seo-injection`, `ads`, `consent-cmp`, `other`. `Grounding` states whether
the row traces to this Stinger's two-source research archive (`Researched`) or is common public
vendor-domain knowledge not present in it (`Judgment call`), per the honesty rule this whole build
carries: ground every substantive claim or flag it explicitly.

## Researched rows

| Vendor | Category | Channel | Signal | Source |
|---|---|---|---|---|
| Google Tag Manager | tag-manager | script src | `googletagmanager.com/gtm.js` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Google Tag Manager | tag-manager | script src | `.googletagmanager.com/` (broader host match) | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Google Tag Manager | tag-manager | js global | `window.google_tag_data` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Google Tag Manager | tag-manager | js global | `window.google_tag_manager` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Google Tag Manager | tag-manager | js global | `window.googletag` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Google Tag Manager | tag-manager | html source | `googletagmanager\.com/ns\.html[^>]+></iframe>` (noscript fallback) | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Google Tag Manager | tag-manager | html source | `<!-- (?:End )?Google Tag Manager -->` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Adobe Launch | tag-manager | script src | `assets.adobedtm.com` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] (named for comparison, not detailed) |
| Adobe Launch | tag-manager | js global | `window._satellite` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] (named for comparison, not detailed) |
| Tealium | tag-manager | script src | `utag.js` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] (named for comparison, not detailed) |
| HubSpot | other | script src | `js.hs-scripts.com` | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] (cited in the stack-fingerprint archive, carried over as a directly-quoted vendor domain) |

## Judgment-call rows (not in this Stinger's research archive)

PRD-004 requires a full census across analytics, chat, payments, CRO/testing, ads, and consent/CMP,
but this Stinger's two raw sources cover only tag managers and Search Atlas in any depth. The rows
below fill the taxonomy from common public vendor-domain knowledge, not from a researched source.
Report every match from this section with `grounded: judgment-call` in the census output and do not
present it with the confidence of a researched, multi-channel GTM match.

| Vendor | Category | Channel | Signal |
|---|---|---|---|
| Google Analytics (GA4) | analytics | script src | `googletagmanager.com/gtag/js`, `google-analytics.com/g/collect`, `google-analytics.com/analytics.js` |
| Meta Pixel | ads | script src | `connect.facebook.net`, `facebook.com/tr` |
| LinkedIn Insight Tag | ads | script src | `snap.licdn.com` |
| TikTok Pixel | ads | script src | `analytics.tiktok.com` |
| Intercom | chat | script src | `widget.intercom.io`, `js.intercomcdn.com` |
| Drift | chat | script src | `js.driftt.com` |
| Stripe | payments | script src | `js.stripe.com` |
| PayPal | payments | script src | `paypal.com/sdk/js` |
| Optimizely | cro-testing | script src | `cdn.optimizely.com` |
| VWO | cro-testing | script src | `dev.visualwebsiteoptimizer.com` |
| Hotjar | cro-testing | script src | `static.hotjar.com` |
| OneTrust | consent-cmp | script src | `cdn.cookielaw.org`, `onetrust.com` |
| Cookiebot | consent-cmp | script src | `consent.cookiebot.com` |

## Content-injection / metadata-manipulation category (seo-injection)

PRD-004's central requirement: this category must be flagged distinctly from ordinary analytics,
never blended into a generic "marketing tag" bucket.

| Vendor | Detection signal | Grounding |
|---|---|---|
| Search Atlas OTTO Pixel | `searchatlas.com`, `otto-pixel`, `ottopixel` (domain-substring heuristic) | **Judgment call.** The vendor's own product page describes what OTTO does once installed in detail, but does not document a script URL pattern, HTML comment marker, or global variable name for the pixel itself, a gap the distillation names explicitly (section 7). Every match from this row must carry `verification_status: candidate, needs manual confirmation`, never be reported as a confirmed detection. |

Per the vendor's own description, the OTTO Pixel grants Search Atlas the ability to autonomously
rewrite meta tags, inject schema, publish content, and manage a Google Business Profile, by default
without a human approval step unless the site owner has turned on "approval mode"
[raw/searchatlas-com-otto-pixel.md]. This is exactly the shape of tool PRD-004 requires flagging
separately: its presence materially affects what an SEO/AEO audit is looking at, since the page's
own metadata may not be what the client's team last set it to. Every claim about what OTTO does
traces only to the vendor's own marketing page, not independent analysis, report it to the user
labelled vendor-self-reported.

Peer products in the same category (other autonomous SEO-injection/content-management pixels) are
not named in this archive. If one is found on an audited site and is clearly the same shape of tool
(a single script granting a third party autonomous content/metadata write access), record it under
`seo-injection` with `grounded: judgment-call` and describe the observed behavior rather than
assuming it matches Search Atlas's feature set.

## GTM hydration: read this before under-reporting

GTM is a loader, not an analytics tool itself
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. Detecting the GTM container alone
under-reports the true vendor list: "whatever else is tracking the user is very likely being loaded
through it" [raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. A real-world stack commonly puts
Google Analytics plus Meta/LinkedIn/TikTok ad-conversion pixels behind the same GTM container
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. This is the direct reason PRD-004 requires a
real JS-executed page load rather than a static fetch: cross-reference every vendor row in this
table against the same page load's network log, do not stop at "GTM detected."

## Confidence scoring

Per the GTM source's own description of its detection tool's method, "each signal alone is rarely
conclusive," results are cross-referenced across signals and weighted by confidence
[raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. `shared/scripts/vendor-census.py` mirrors
this: 2+ independently matched channels on a researched row -> `high`; exactly 1 -> `medium`; any
judgment-call row -> capped at `low` regardless of hit count.

## Version detection

GTM (and tag managers generally) ship as hosted SaaS, not a bundled package, so version-specific
detection is not generally possible; "GTM present, version unknown" is the expected, correct outcome,
not a detection gap to chase [raw/sme-mapree-dev-stack-tech-google-tag-manager.md]. Where a platform
leaks a version via response headers or a generator meta tag, surface it, otherwise report presence
only.
