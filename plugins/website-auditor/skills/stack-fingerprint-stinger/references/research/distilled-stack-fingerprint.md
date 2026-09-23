Distilled research for landing-page-only technology and render-mode fingerprinting: detecting CMS, framework, hosting/CDN, and platform from a single homepage fetch, before any deeper crawl happens. Coverage is thin: only two raw sources exist, both filed under the single research cluster "platform-fingerprinting," one a community how-to post and one a vendor/community guide. No dedicated primary source on SSR/CSR/hybrid render-mode detection specifically, or on the named frameworks in this Stinger's own scope (React+Vite, Next.js, SvelteKit, WordPress, Shopify, Magento) individually, was archived; claims below are generalized from the two sources' broader detection methodology and should be read as directional, not exhaustive, for any single one of those six platforms.

Research window: single sweep, 2026-08-18.

## 1. The three evidence channels a single-request fingerprint relies on

| Channel | What it reveals | Example signatures | Source |
|---|---|---|---|
| HTML body | Vendor asset URLs, framework globals, generator markers | `cdn.shopify.com` (Shopify), `js.hs-scripts.com` (HubSpot), `__NEXT_DATA__` (Next.js), `__NUXT__` (Nuxt), `ng-version=` (Angular), `data-sveltekit` (Svelte), `<meta name="generator">` markers, well-known paths like `/wp-admin/`, `/wp-content/`, `/sites/default/files/`, `/_next/`, `/.nuxt/` | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |
| HTTP response headers | Hosting, CDN, and application server, often invisible in HTML entirely | `cf-ray` (Cloudflare), `x-vercel-id` (Vercel), `x-nf-request-id` (Netlify), `x-amz-cf-id` (CloudFront), `x-served-by: cache-...` (Fastly), `x-shopify-stage`, `x-wix-request-id`, `x-powered-by: WP Engine`; more generically `Server`, `X-Powered-By`, `X-Generator`, and CDN-specific headers like `CF-Ray`, `X-Cache` | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |
| Cookies | Server-side language/framework, survives even behind a proxy that hides the real backend | `PHPSESSID` (PHP), `laravel_session` (Laravel), `csrftoken` (Django), `ASP.NET_SessionId` (ASP.NET), `JSESSIONID`, `connect.sid`, `__Secure-next-auth.session-token` | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md] |

Both sources independently converge on the same three-channel model, which is the strongest cross-source agreement in this thin archive. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] [raw/edgedns-dev-guides-domain-tech.md]

## 2. What "runs after page load" adds beyond the raw response

The EdgeDNS guide separately calls out JavaScript globals available only once the page has executed, not just the raw HTML/header/cookie response: `window.jQuery`, `window.React`, `window.dataLayer`, plus runtime markers like `ng-version`, `__NEXT_DATA__`, `__vue_app__`. [raw/edgedns-dev-guides-domain-tech.md] The dev.to source treats this as a genuine capability gap rather than a nice-to-have: a pure single-HTTP-request fetch cannot see fully client-rendered pages' HTML-level signatures at all, only their headers and cookies, and cannot see anything that loads only after JS execution. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] Neither source states this Stinger's specific render-mode boundary (landing-page-only, no execution) explicitly; the implication drawn here is that a single-request fetch is a strictly HTML/header/cookie-only view, and any JS-global-based signal requires the page to actually run, which a landing-page-only single fetch does not do by default.

## 3. Precision-over-recall as the core detection discipline

The dev.to source frames the single biggest failure mode in this kind of detection as false positives from matching product names in ordinary page prose, e.g. a blog post that mentions "WordPress" in text getting flagged as a WordPress site. Its stated fix: only match strings that cannot appear in prose, specifically vendor asset URLs, header names, cookie names, and unique JavaScript globals, never free-text keyword matches. Example given: `/wp-content/` or `static1.squarespace.com` as "boring and almost never wrong," versus keyword matching which pollutes results at scale (its own framing: "each false positive pollutes a lead list"). [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] The EdgeDNS source does not address false-positive avoidance directly, so this is single-sourced.

## 4. Detection confidence and cross-referencing signals

The EdgeDNS/Sourcemap-style methodology (as described generally in the edgedns.dev guide) returns "categorized results with confidence levels (graded by how many pattern families matched) and detection evidence," i.e. a single matched signature is treated as lower-confidence than multiple independent signals agreeing. [raw/edgedns-dev-guides-domain-tech.md] The dev.to source does not describe a confidence-scoring scheme; it treats a matched signature as a binary detection, so on this point the two sources differ in sophistication rather than in direct conflict, and EdgeDNS's confidence-weighting description is the more developed treatment of the two, though it is also the less rigorously precision-focused of the two (it does not raise the false-positive/prose-matching problem the dev.to source raises).

## 5. Known blind spots to record honestly rather than guess past

| Blind spot | Detail | Source |
|---|---|---|
| Inner-page-only tooling | A tool loaded only on inner pages (example given: a checkout-only payment SDK) will not appear in a landing-page-only fetch | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] |
| Fully client-rendered pages | HTML-level signatures can be hidden entirely; headers and cookies still work as a fallback channel | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] |
| Bot-protected / unreachable sites | The site will simply not respond; the recommended handling is to record `reachable: false` and move on rather than retry into a block | [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] |

## 6. Single-request versus headless-browser tradeoff

The dev.to source explicitly frames why a landing-page-only, no-browser fetch is the right default rather than a limitation to work around: a Playwright-style headless-browser detector "sees more" (runtime globals, late-loaded scripts) but costs roughly 100x the compute and gets blocked roughly 10x as often, and for the stated commercial use case (segmenting large lead lists by technology) the cheaper single-request method answers correctly for "the overwhelming majority of sites" at a cost point where checking at scale is worth it. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] This is the only source that makes this specific cost/accuracy tradeoff argument; EdgeDNS does not compare fetch strategies at all.

## 7. Scale characteristics

A signature-matching pass of roughly 100 signatures against 600KB of HTML runs in single-digit milliseconds once HTML and header values are lowercased once up front and matching is reduced to substring scanning. [raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md] No comparable performance figure appears in the EdgeDNS source.

## 8. Gap note on this Stinger's named target platforms

Neither raw source documents React+Vite, Next.js, SvelteKit, WordPress, Shopify, or Magento as a dedicated named case study with a full signature set; Next.js (`__NEXT_DATA__`, `/_next/`) and Shopify (`cdn.shopify.com`, `x-shopify-stage`) each get one example signature apiece from the dev.to source, and WordPress gets a path signature (`/wp-content/`) from the same source used purely as an example of a "boring, precise" signature, not as a worked case. React+Vite, SvelteKit specifically (versus Svelte generally, which does appear via `data-sveltekit`), and Magento have no signature examples in either raw source. Do not treat any specific claim about those platforms' detection reliability as researched until a dedicated source is pulled.
