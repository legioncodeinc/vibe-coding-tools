# 05. Tag manager and injection cross-check

Google Tag Manager (GTM) detection and the Search Atlas OTTO Pixel write-capable-pixel pattern both live primarily with `vendor-inventory-wasp-drone`. This guide exists so `analytics-stack-wasp-drone` reads the same signatures correctly when cross-checking its own foundational and de-anonymization findings against what the census already found, not to duplicate primary detection.

## Why GTM detection matters to this Stinger specifically

GTM is a tag container, not an analytics tool itself, it is the loader that injects other marketing and tracking scripts. Its presence is a specific cue to look deeper: "whatever else is tracking the user is very likely being loaded through it." [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] When GTM is found, it "rarely travels alone," commonly hosting Google Analytics, ad conversion pixels (Meta, LinkedIn, TikTok), and other marketing tags fired without a codebase change. [raw/sme-mapree-dev-stack-tech-google-tag-manager.md]

Practical consequence for `guides/02-foundational-analytics-coverage.md` and `guides/04-deanonymization-and-jurisdiction.md`: if `01-recon/vendor-inventory.md` shows GTM present but doesn't itemize every tag it fires (GTM ships as a hosted SaaS container, so a static-HTML crawl may only see the container, not every runtime-injected tag), treat GTM's presence as a reason to check the rendered/hydrated page rather than concluding "no foundational analytics detected" from a static read alone.

## Grounded detection signatures (Tier A, cited)

| Channel | Signature | Source |
|---|---|---|
| JavaScript global | `window.google_tag_data`, `window.google_tag_manager`, `window.googletag` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| HTML source | `googletagmanager\.com/ns\.html[^>]+></iframe>`, `<!-- (?:End )?Google Tag Manager -->` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |
| Script src URL | `googletagmanager\.com/gtm\.js`, `\.googletagmanager\.com/` | [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] |

No single signal is conclusive alone, cross-reference multiple signals and weight by confidence. GTM ships as a hosted SaaS product rather than a bundled package, so version-specific detection is usually not possible beyond presence, unless a version leaks via response headers or a generator meta tag. [raw/sme-mapree-dev-stack-tech-google-tag-manager.md]

## The write-capable pixel pattern (flag, do not score)

The Search Atlas OTTO Pixel is described on its own product page as "a single script that connects your website" to the vendor's platform, after which the platform reads the site's pages and "deploys the changes straight to your site, on its own, across any CMS," covering meta tags, schema markup, on-page content, and even Google Business Profile management (posts, review replies, Q&A). By default "OTTO SEO deploys fixes on its own," with an opt-in approval mode to review changes first. [raw/searchatlas-com-otto-pixel.md]

This is a materially different risk category from a passive analytics or tracking pixel: write access to live page content and structured data, not just read access to visitor behavior. `vendor-inventory-wasp-drone` owns detecting and scoring this class. This Stinger's job when it appears: if the same vendor is also classified as analytics-adjacent (unlikely for OTTO specifically, its own FAQ leaves "is this a tracking or analytics pixel?" unanswered, so treat it as content-injection, not analytics, unless a future research pass says otherwise), cross-reference the finding in `references/templates/analytics-findings-template.md` section 4 rather than scoring it twice.

**Detection gap:** no raw source in this archive documents a technical fingerprint (script URL pattern, global variable) for the OTTO Pixel specifically. If `vendor-inventory.md` names it, use that census finding as the evidence pointer; do not attempt to independently fingerprint it from this Stinger's archive alone.

## Procedure when both patterns appear together

If GTM is present AND a write-capable content-injection vendor is present, note in `08-analytics/analytics-findings.md` section 4 that GTM is a plausible (not confirmed, unless independently evidenced) delivery mechanism for the injection vendor too, per the synthesis in `references/research/distilled-analytics-stack.md` section 5. Label this connection as an inference, since no single raw source in this archive makes the connection explicitly.
