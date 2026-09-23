# Client-side injection surface and vendor cross-reference

Procedural companion to `references/templates/client-side-injection-and-vendor-crossref-template.md`. Grounded in distilled research sections 4-5.

## 1. This is a read of `vendor-inventory-wasp-drone`'s output, not a fresh census

`01-recon/vendor-inventory.md` already enumerates every third-party script, tag, pixel, and iframe on the site, including a dedicated flagged category for content-injection/metadata-manipulation tooling (PRD-004 AC-2). This Drone's job is to interpret that inventory specifically for security-posture risk: what does each vendor's presence mean for the site's actual CSP `script-src` allowlist and for who can modify live page content. Do not re-detect vendors; if the inventory is missing or looks incomplete, report that as a blocking dependency issue against `vendor-inventory-wasp-drone`, not a gap this Drone fills in itself.

## 2. Tag managers turn a static CSP allowlist into a moving target

GTM is "the loader that injects every other marketing and tracking script" on a page. [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] Its detection signatures (`dataLayer`, `window.google_tag_manager`, the `googletagmanager.com/gtm.js` URL, its HTML comment markers) are already captured by `vendor-inventory-wasp-drone`; this Drone's added value is the security read: a marketing-managed GTM container can add new script origins without a code deploy or a CSP update. This is a structural tension with a static-allowlist CSP, and specifically why `strict-dynamic` (checked in `guides/03`) matters for any site running GTM. [raw/web-dev-articles-security-headers.md] [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] State plainly in the report that this GTM-to-CSP connection is this Stinger's own synthesis across two research clusters, not a claim either raw source makes directly.

## 3. Content-injection/metadata-manipulation tools are a distinct risk from XSS

Search Atlas's OTTO Pixel autonomously rewrites live page content and metadata by default, unless "approval mode" is explicitly turned on, per the vendor's own product description. [raw/searchatlas-com-otto-pixel.md] No header control in this archive is described as mitigating a vendor's own authorized, intentionally-installed content-modification capability; CSP restricts what scripts can load and execute, not what an already-trusted, already-loaded script the site owner installed is authorized to do. Report this as its own finding category, separate from the header checklist, whenever `vendor-inventory-wasp-drone`'s dedicated flagged category names such a tool. Always label the source as vendor-self-reported marketing copy, not independent security analysis, since the OTTO Pixel source makes no security claims of its own; the risk framing here is this Stinger's inference, not the vendor's.

## 4. What NOT to conclude

Do not conclude that GTM's presence or a content-injection tool's presence is itself a critical (score-1) finding. The critical finding, if any, is the specific gap it creates (a static CSP allowlist incompatible with a GTM-managed script surface; an autonomous content-modification tool running without confirmed approval-mode). Score the specific gap, evidenced, not the vendor's mere presence.
