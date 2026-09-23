Distilled research for the third-party vendor census this Stinger equips: identifying every script/vendor present after a real JS-executed page load, including anything Google Tag Manager (GTM) hydrates at runtime, and content-injection/metadata-manipulation tools such as Search Atlas's OTTO Pixel. Coverage is thin: only two raw sources exist, filed under the single research cluster "third-party-and-injection." One is a vendor's own marketing/product page for the specific injection tool this Stinger must flag (Search Atlas), the other is a community/vendor detection guide for GTM. Neither source is independent third-party security or SEO analysis of these tools; the Search Atlas source in particular is self-description by the vendor being profiled, not an outside evaluation, and is treated accordingly below.

Research window: single sweep, 2026-08-18.

## 1. Google Tag Manager: what it is and why it matters as a census category

GTM is a tag management system (TMS), explicitly "not an analytics tool itself" but "the loader that injects every other marketing and tracking script." [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] For a vendor census, this means detecting GTM alone is incomplete: its presence is a cue that other vendors are very likely loaded through it rather than directly, and the source states this outright ("whatever else is tracking the user is very likely being loaded through it"). [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] In a real-world stack, GTM is described as commonly the hub for Google Analytics plus ad-conversion pixels from Meta, LinkedIn, and TikTok, and any number of marketing tags fired without a code deploy. [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] This is the direct justification for this Stinger's scope note about needing a real JS-executed page load rather than a static fetch: a container-level detection of GTM by itself under-reports the actual vendor list.

## 2. GTM detection signatures, by channel

| Channel | Signature | Note | Source |
|---|---|---|---|
| JavaScript global | `window.google_tag_data` | Reproducible by typing into DevTools console | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| JavaScript global | `window.google_tag_manager` | Same | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| JavaScript global | `window.googletag` | Same | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| HTML source | `googletagmanager\.com/ns\.html[^>]+></iframe>` | The no-JS `<noscript>` fallback iframe pattern | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| HTML source | `<!-- (?:End )?Google Tag Manager -->` | GTM's own generated HTML comment markers | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Script src URL | `googletagmanager\.com/gtm\.js` | The loader script itself, carries the container ID (`GTM-XXXXXXX`) | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Script src URL | `\.googletagmanager\.com/` | Broader host match | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |

The source also names the `dataLayer` array on the page as part of GTM's core signature, alongside the `gtm.js` script carrying a container ID. [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] The detection tool this guide documents (Sourcemap Explorer, referred to only by that name in the raw source) is described as cross-referencing all seven signals and weighting by confidence rather than firing on any single match alone, and states "each signal alone is rarely conclusive." [raw/sme-mapree-dev-stack-tech-google-tag-manager.md]

## 3. GTM is a hosted SaaS product with limited version visibility

GTM ships as a hosted tag manager, not a bundled npm package, so version-specific detection is not generally possible; where a platform leaks a version via response headers (`X-Powered-By`, `Server`, generator meta tags) it can be surfaced, otherwise detection is presence-only. [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] For a vendor census this means "GTM present, version unknown" is the expected, correct outcome in the overwhelming majority of cases, not a detection gap to chase.

## 4. Other tag managers named for comparison, not detailed

The same source names two other tag managers only in passing, as part of explaining the tag-manager category generally, without giving their full signature sets: Adobe Launch (`_satellite` global, `assets.adobedtm.com` paths) and Tealium (`utag.js`). [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] Treat these two as named-but-unresearched: they are not GTM, and no dedicated source in this archive documents their detection methodology beyond these two fragments.

## 5. Search Atlas OTTO Pixel: vendor's own description of what it does

Per the vendor's own product page, the "OTTO Pixel" is "a single script that connects your website to Search Atlas," after which "OTTO SEO reads your pages, fixes what's holding your rankings back, and deploys the changes straight to your site, on its own, across any CMS." [raw/searchatlas-com-otto-pixel.md] The vendor explicitly distinguishes it from a conventional tracking/analytics pixel in its own FAQ heading ("Is the OTTO Pixel a tracking or analytics pixel?") though the raw archive does not capture the answer text itself, only the FAQ question stub. [raw/searchatlas-com-otto-pixel.md] The vendor's own framing: "The pixel isn't the product. It's the connection that lets Search Atlas do SEO strategy, content, and technical work for you instead of just handing you a report." [raw/searchatlas-com-otto-pixel.md]

## 6. What OTTO does once connected, per the vendor

| Capability claimed | Vendor's own description | Source |
|---|---|---|
| Autonomous deployment | "By default, OTTO SEO deploys fixes on its own," with an opt-in "approval mode" to review changes before they go live and roll back anything, anytime | [raw/searchatlas-com-otto-pixel.md] |
| Technical SEO fixes | "OTTO finds the technical issues holding back your visibility and fixes them on its own, no developer ticket required" | [raw/searchatlas-com-otto-pixel.md] |
| Schema markup | "OTTO adds the schema your pages are missing, FAQ, product, and more" | [raw/searchatlas-com-otto-pixel.md] |
| Meta tag changes | "OTTO writes and ships meta tags across every page, keeping keywords in and character counts in range, without you touching a template" | [raw/searchatlas-com-otto-pixel.md] |
| Content creation | "OTTO writes and publishes original content straight to your site on its own" | [raw/searchatlas-com-otto-pixel.md] |
| Content/entity optimization | "OTTO adds the entities and semantic terms your pages are missing" | [raw/searchatlas-com-otto-pixel.md] |
| Google Business Profile management | "OTTO manages your Google Business Profile on its own: posts, review replies, Q&A" | [raw/searchatlas-com-otto-pixel.md] |

This is exactly the shape of tool this Stinger's scope is written to flag as "content-injection/metadata-manipulation": by the vendor's own description, a single installed script grants a third party the ability to autonomously rewrite page metadata, inject schema, publish content, and modify pages in production, by default without a human approval step unless "approval mode" is explicitly turned on. [raw/searchatlas-com-otto-pixel.md] Because this source is the vendor's own marketing page rather than independent analysis, there is no corroborating or conflicting outside source in this archive on how OTTO actually behaves once installed, how detectable the pixel script is in HTML/network terms, or its real-world default-mode adoption rate; every claim in this section traces only to the vendor's own self-description and should be reported to the user as vendor-self-reported, not independently verified.

## 7. Gap note on detection methodology for injection tools like OTTO

Unlike the GTM source, the Search Atlas source is a plain marketing/FAQ page and does not document any fingerprinting signature for the OTTO Pixel itself (no script URL pattern, no HTML comment marker, no global variable name). [raw/searchatlas-com-otto-pixel.md] This is a direct gap for this Stinger's practical job of actually detecting the pixel's presence on an audited page: no raw source states what the pixel script's src or inline marker looks like. Any such signature used in practice must come from direct observation or a source not yet in this archive, not from anything researched here.
