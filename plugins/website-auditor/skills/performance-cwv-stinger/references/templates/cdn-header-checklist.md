# CDN / caching-header checklist

Copy-ready reference for `guides/02-cdn-and-caching-headers.md` and `references/scripts/cdn-header-scan.py`. This checklist is **general HTTP/CDN knowledge, not cited to a source in this Stinger's research archive**. Per `references/research/distilled-performance-cwv.md` section 7, neither raw source in this archive documents CDN caching behavior, header-level interpretation, or caching-strategy adequacy in any depth beyond mentioning "CDN edge delivery" once in passing. Every header meaning below is standard, uncontested HTTP behavior (RFC 9111 and long-standing CDN vendor convention), not this pair's own research finding, treat it as general knowledge in any report output, and do not present it as an archive-grounded claim.

## Headers to capture on every sampled page (raw, verbatim)

| Header | What its presence/value indicates | Notes |
|---|---|---|
| `Cache-Control` | Browser and shared-cache caching directives: `max-age`, `s-maxage`, `no-store`, `no-cache`, `private`, `public`, `must-revalidate`, `stale-while-revalidate` | Absent entirely on an HTML response is itself a finding, capture the raw value or its absence. |
| `CDN-Cache-Control` | An emerging, CDN-specific directive some providers honor separately from the browser-facing `Cache-Control`, letting an origin set a different TTL at the edge than at the browser | Not universally supported; capture it when present, its absence on a CDN-fronted response is not itself an error. |
| `Server` | Often names the origin server or CDN/edge platform (e.g. `cloudflare`, `AmazonS3`, `Vercel`, `Netlify`, `nginx`) | Some providers deliberately obscure this; absence or a generic value is not itself a finding. |
| `Age` | Seconds the response has been sitting in a cache; a nonzero value is direct evidence a cache actually served this response, not just that caching is configured | Strong, load-bearing evidence pointer, capture the raw value. |
| `X-Cache` | Common convention (not a standard header) for cache HIT/MISS status, used by many CDNs and reverse proxies | Values and even the header name itself vary by vendor; capture verbatim. |
| `X-Served-By` / `Via` | Often names the specific edge node or proxy chain that served the response | Useful evidence pointer for "was this actually served from an edge, not the origin." |
| `ETag` | Validator used for conditional requests (`If-None-Match`); presence supports revalidation-based caching even where `max-age` is short or absent | Capture verbatim; do not infer "good caching" from `ETag` presence alone, it's a validator, not a cache-duration guarantee. |
| `Vary` | Signals which request headers change the cached representation (e.g. `Accept-Encoding`, `Cookie`) | A `Vary: Cookie` or similarly broad value can effectively defeat shared caching; flag but do not assert this is wrong without page-specific context. |
| Vendor-specific edge headers | e.g. `CF-Ray` / `CF-Cache-Status` (Cloudflare), `X-Amz-Cf-Id` (CloudFront), `X-Akamai-*` (Akamai), `X-Vercel-Cache` (Vercel), `X-Nf-Request-Id` (Netlify) | Presence is a strong CDN-identification signal; capture the raw header name and value as the evidence pointer, do not just name the vendor without the raw header attached. |

## What this checklist does NOT let you assert

- It does not let you assert that a given `max-age` value, or the absence of one, is "correct" for a specific page type. Caching-strategy adequacy judgment is a documented research gap in this Stinger's archive (see `references/research/distilled-performance-cwv.md` section 7); score presence/absence and internal consistency (e.g. static assets with no cache headers at all) as findings, and label any adequacy judgment beyond that `[subjective]`.
- It does not let you assert a specific CDN vendor from a single ambiguous header. Require at least one clear, vendor-specific signal (a named header, not just a generic `Server: nginx`) before naming a vendor in a finding.
- It does not substitute for the raw response capture. Every row in this table exists to tell the scanning script and the guide what to look for; the finding's evidence pointer is always the raw captured header block, not a paraphrase of it.
