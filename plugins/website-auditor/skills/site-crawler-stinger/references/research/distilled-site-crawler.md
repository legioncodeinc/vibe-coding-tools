Distilled research for platform-aware crawling to a depth of 100 pages, storing raw HTML and Markdown per page so nine Wave-5 Bees can later read read-only. Coverage is thin: only two raw sources exist, both filed under the single research cluster "platform-fingerprinting," shared with stack-fingerprint-stinger, and neither source is actually about crawling. Both are about single-request technology detection; nothing in the raw archive documents crawl algorithms, depth-limiting strategy, sitemap parsing, politeness/rate-limiting, or per-page storage format directly. What follows is what those two sources establish that is relevant to a crawler deciding how to fetch and interpret each page, not a researched crawl methodology in its own right; treat any specific crawl-mechanics claim (concurrency, retry backoff, sitemap.xml parsing) as unresearched until a dedicated source is pulled.

Research window: single sweep, 2026-08-18.

## 1. Why a crawler needs to be platform-aware per page, not just per site

Both sources' detection model is per-response: a given page's HTML, headers, and cookies reveal what generated that specific response. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] For a crawler walking many pages of the same site, this implies platform signals should in principle be checked page-by-page rather than assumed from the landing page alone, since well-known platform paths differ by page type (see section 3). Neither source discusses multi-page crawling directly, so this is an inference from their single-page methodology, not a stated recommendation.

## 2. The three signal channels available on every fetched page

| Channel | What a crawler can extract per page | Source |
|---|---|---|
| HTML body | Framework globals (`__NEXT_DATA__`, `__NUXT__`, `ng-version=`, `data-sveltekit`), vendor asset URLs (`cdn.shopify.com`, `js.hs-scripts.com`), generator meta tags | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |
| HTTP response headers | Hosting/CDN (`cf-ray`, `x-vercel-id`, `x-nf-request-id`, `x-amz-cf-id`, `x-served-by`), platform (`x-shopify-stage`, `x-wix-request-id`), application server (`Server`, `X-Powered-By`, `X-Generator`) | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |
| Cookies | Backend language/framework (`PHPSESSID`, `laravel_session`, `csrftoken`, `ASP.NET_SessionId`, `JSESSIONID`, `connect.sid`) | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |

Both sources agree these three channels are the complete evidence surface of a single HTTP fetch; this is the strongest point of agreement between them. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md]

## 3. Well-known paths as crawl-relevant signatures, not just detection signatures

The EdgeDNS source lists well-known file paths as one of its five detection categories: `/wp-admin/`, `/wp-content/`, `/sites/default/files/`, `/_next/`, `/.nuxt/`. [raw/edgedns-dev-guides-domain-tech.md] The dev.to source separately names `/wp-content/` as its example of a "boring and almost never wrong" signature, specifically because it is a path pattern rather than a prose keyword match. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] For a crawler, these same paths double as structural hints about where a platform stores assets or admin surfaces (e.g. `/wp-admin/` on a WordPress site, `/_next/` on a Next.js site) - useful for a crawler deciding what to fetch as a page versus what to skip as an asset/admin path, though neither source frames it that way explicitly; this is an inference, not a stated crawl recommendation.

## 4. The client-rendered-page blind spot is directly a crawler concern

The dev.to source states plainly that "fully client-rendered pages can hide HTML signatures, though headers and cookies still work" for a plain HTTP fetch without JS execution. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] This is the most directly crawl-relevant claim in the archive: a crawler storing "raw HTML" per page from a plain fetch (no headless browser) will, for a client-rendered page, capture a near-empty shell rather than the rendered content, and only the header/cookie channel remains reliable in that case. Neither source states whether this crawler specifically executes JS during its crawl; that is outside the raw archive's scope. The EdgeDNS source's detection methodology fetches "with a real Chrome desktop User-Agent" specifically so that "sites that gate analytics/consent JS behind UA sniffing return their full stack" [raw/edgedns-dev-guides-domain-tech.md], which is a UA-spoofing tactic, not JS execution, so it does not resolve the client-rendering blind spot the dev.to source names; the two sources are not in direct conflict here but address different problems (UA gating versus JS-required rendering) under similar-sounding language.

## 5. Bot protection and unreachable pages: the recommended failure mode

When a target is behind aggressive bot protection and does not respond, the dev.to source's explicit recommendation is to record `reachable: false` and move on, rather than retrying into a block. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] This is directly applicable to a multi-page crawl encountering the same protection on an inner page after succeeding on the landing page: the stated discipline is graceful per-page failure recording, not retry escalation. The EdgeDNS source does not address unreachable-page handling.

## 6. Inner-page-only tooling as a reason depth matters

The dev.to source names a checkout-only payment SDK as an example of a tool "loaded only on inner pages" that a landing-page-only check will miss entirely. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] This is the clearest raw-sourced justification in the archive for why a crawl beyond the landing page (this Stinger's whole purpose, versus stack-fingerprint-stinger's landing-page-only scope) surfaces information a single-page check structurally cannot. Neither source discusses how deep such tooling typically sits (checkout flow, account area, etc.) beyond this one example.

## 7. Gap note

Nothing in either raw source addresses: sitemap.xml or robots.txt handling, crawl depth/breadth strategy, concurrency or rate limiting, storage format for per-page HTML/Markdown, deduplication of near-identical pages, or handling of authenticated/gated areas. All of those are core to this Stinger's actual job (crawl to depth 100, store per-page HTML+MD in `site-data/`) and are entirely unresearched in the current archive; do not treat any claim about them as sourced.
