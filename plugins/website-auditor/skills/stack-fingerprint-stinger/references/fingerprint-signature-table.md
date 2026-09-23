# Fingerprint signature table

Human-readable copy of the signature table that drives `shared/scripts/fingerprint.py`
(`SIGNATURES`). If the two ever disagree, the script is the source of truth for what actually runs;
update this file to match it, not the other way around.

Every row states its grounding explicitly. `Researched` traces to a raw source in
`references/research/raw/`. `Judgment call` does not, per the distillation's own gap note
(`references/research/distilled-stack-fingerprint.md` section 8): this Stinger's research
archive has only two sources, neither of which documents React+Vite, SvelteKit specifically (versus
Svelte generally), or Magento as a dedicated case study. A judgment-call row must be reported at
capped (`low`) confidence in `target-profile.json`, never presented with the same authority as a
multi-channel researched match.

## Precision-over-recall discipline

Every signal below matches a vendor asset URL, header name, cookie name, or generator tag, never a
free-text keyword. This is the single strongest instruction in the research archive: matching
product names in ordinary page prose ("this blog post mentions WordPress") produces false positives
at scale, while boring, unambiguous strings like `/wp-content/` or `cdn.shopify.com` almost never
are wrong [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md]. Do
not add a keyword-style signature to this table without that same discipline.

## Signature rows

| Stack id | Platform | Channel | Signal | Grounding | Source |
|---|---|---|---|---|---|
| `shopify` | Shopify | html | `cdn.shopify.com` | Researched | [raw/dev-to-scrapemint-...-3opf.md] |
| `shopify` | Shopify | header | `x-shopify-stage` present | Researched | [raw/dev-to-scrapemint-...-3opf.md] |
| `shopify` | Shopify | meta_generator | `shopify` | Judgment call (generator-tag channel itself is researched generally, this specific string is not) | [raw/edgedns-dev-guides-domain-tech.md] (generator-tag channel only) |
| `nextjs-postgres` | Next.js | html | `__NEXT_DATA__` | Researched | [raw/dev-to-scrapemint-...-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |
| `nextjs-postgres` | Next.js | html | `/_next/static/`, `/_next/` | Researched | [raw/dev-to-scrapemint-...-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |
| `wordpress-php-mysql` | WordPress | html | `/wp-content/`, `/wp-admin/`, `/wp-includes/` | Researched | [raw/dev-to-scrapemint-...-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |
| `wordpress-php-mysql` | WordPress | cookie | `PHPSESSID` (substring) | Researched (as a PHP signal generally; WordPress-specific pairing is this Stinger's own inference, stated openly) | [raw/dev-to-scrapemint-...-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |
| `wordpress-php-mysql` | WordPress | meta_generator | `wordpress` | Judgment call (generator-tag channel is researched, this exact string is not) | [raw/edgedns-dev-guides-domain-tech.md] (generator-tag channel only) |
| `sveltekit-postgres` | SvelteKit | html | `data-sveltekit` | Researched, but only as a generic Svelte marker, not a dedicated SvelteKit case study | [raw/edgedns-dev-guides-domain-tech.md] |
| `react-vite-postgres` | React + Vite | html | `/assets/index-`, `type="module" crossorigin` | Judgment call, no source in this archive documents React+Vite at all | none |
| `magento-php-mysql` | Magento | html | `/skin/frontend/`, `Mage.Cookies`, `/static/version` | Judgment call, no source in this archive documents Magento at all | none |
| `magento-php-mysql` | Magento | header | `X-Magento-Cache-Debug` present | Judgment call | none |
| `magento-php-mysql` | Magento | cookie | `frontend` (substring) | Judgment call | none |
| `magento-php-mysql` | Magento | meta_generator | `magento` | Judgment call | none |

## Hosting/CDN header hints (informational only, never sets `stack`)

| Header | Hint | Grounding |
|---|---|---|
| `cf-ray` | Cloudflare | Researched [raw/dev-to-scrapemint-...-3opf.md] |
| `x-vercel-id` | Vercel | Researched [raw/dev-to-scrapemint-...-3opf.md] |
| `x-nf-request-id` | Netlify | Researched [raw/dev-to-scrapemint-...-3opf.md] |
| `x-amz-cf-id` | CloudFront | Researched [raw/dev-to-scrapemint-...-3opf.md] |
| `x-served-by: cache-...` | Fastly (or similar edge cache) | Researched [raw/dev-to-scrapemint-...-3opf.md] |

## Channels the research documents but this table does not act on yet

JavaScript globals (`window.jQuery`, `window.React`, `window.dataLayer`, `ng-version`, `__NEXT_DATA__`
as a runtime marker, `__vue_app__`) require the page to actually execute
[raw/edgedns-dev-guides-domain-tech.md]. `shared/scripts/fingerprint.py` does not drive a browser, so
it cannot confirm these itself; the render-mode comparison (see
`guides/03-render-mode-detection.md`) is the one place a headless-browser load enters this Stinger's
procedure, and it is used for render-mode only, not for additional stack signals, per this Stinger's
non-goal of not crawling or executing beyond what PRD-003 requires.

## Confidence scoring

Per the EdgeDNS source's confidence-by-pattern-family description
[raw/edgedns-dev-guides-domain-tech.md], `shared/scripts/fingerprint.py` counts independently-matched
*channel families* (html, header, cookie, meta_generator), not raw hit count:

| Matched channel families | Confidence (researched row) | Confidence (judgment-call row) |
|---|---|---|
| 2 or more | High | Low (capped, never raised) |
| Exactly 1 | Medium | Low (capped, never raised) |
| 0 (no match) | n/a, row excluded | n/a, row excluded |

## Known blind spots (state honestly, never guess past them)

| Blind spot | Detail | Source |
|---|---|---|
| Inner-page-only tooling | A tool loaded only on inner pages (example: a checkout-only payment SDK) will not appear in a landing-page-only fetch | [raw/dev-to-scrapemint-...-3opf.md] |
| Fully client-rendered pages | HTML-level signatures can be hidden entirely; headers and cookies still work as a fallback channel | [raw/dev-to-scrapemint-...-3opf.md] |
| Bot-protected / unreachable sites | Record `reachable: false` and move on rather than retrying into a block | [raw/dev-to-scrapemint-...-3opf.md] |
