# 03. Content-injection / metadata-manipulation tool detection

PRD-004's second core requirement, alongside the GTM hydration question: flag tools like Search
Atlas's OTTO Pixel as their own category, distinct from ordinary analytics, because they alter what
an SEO/AEO audit sees on the page.

## What OTTO does, per the vendor's own description

The OTTO Pixel is described as "a single script that connects your website to Search Atlas," after
which OTTO SEO reads the site's pages against Google's ranking factors and, by default, deploys
fixes on its own: technical SEO fixes, schema markup, meta tag rewrites, original content publishing,
entity/semantic-term additions, and Google Business Profile management, all without a developer
ticket or template edit [raw/searchatlas-com-otto-pixel.md]. An opt-in "approval mode" lets the site
owner review changes before they go live [raw/searchatlas-com-otto-pixel.md]. This is the exact
shape of tool this Stinger's scope exists to flag: a single installed script grants a third party the
ability to autonomously rewrite page metadata, inject schema, and publish content in production.

## Report this as vendor-self-reported, not independently verified

Every claim in the paragraph above traces only to Search Atlas's own marketing/product page, there
is no corroborating or conflicting independent source in this Stinger's research archive
[raw/searchatlas-com-otto-pixel.md]. When this section appears in `01-recon/vendor-inventory.md`,
label it "vendor-self-reported" explicitly, per this pair's own conduct-rules note that subjective
or unverified claims are labelled and kept separate from quantified findings.

## The detection gap you must not paper over

Unlike GTM, the Search Atlas source is a plain marketing/FAQ page and documents no fingerprinting
signature for the OTTO Pixel itself: no script URL pattern, no HTML comment marker, no global
variable name [raw/searchatlas-com-otto-pixel.md]. `shared/scripts/vendor-census.py`'s
`searchatlas.com` / `otto-pixel` / `ottopixel` substring match is therefore a domain-name heuristic
this Stinger invented, not a researched signature. Any hit from it MUST carry
`verification_status: candidate, needs manual confirmation` in the output, never be presented as a
confirmed detection. If a match fires, inspect the actual script tag/request by hand (script src,
inline content, any comment markers) before writing it into the report as anything stronger than a
candidate.

## Peer products

No peer content-injection/metadata-manipulation vendor is named in this Stinger's research archive.
If a site shows the same shape of behavior (a single installed script granting a third party
autonomous content or metadata write access) but does not match the Search Atlas heuristic, record
it under the `seo-injection` category with `grounded: judgment-call`, describe the observed behavior
in your own words, and do not claim it is Search Atlas or a specifically named competitor without
direct evidence (e.g. a script src or vendor branding visible on the page).

## Downstream handoff

PRD-004 AC-2 requires this flagged category to be cross-referenced in `01-recon/vendor-inventory.md`
"for prd-008/prd-009 to account for when interpreting on-page metadata." Concretely: `prd-008`
(`technical-seo-wasp-drone`) and `prd-009` (`aeo-audit-wasp-drone`) both read on-page meta tags,
schema, and content as evidence of the site owner's own SEO posture. If a content-injection tool is
present, some of what they will observe may have been written by that tool rather than by the site
owner or their team, name that explicitly in the flagged-category table so those downstream Drones do
not attribute injected metadata to the client's own hand.
