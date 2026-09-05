# Research Plan: http-rest-fundamentals-stinger

- **Depth tier:** normal
- **Time window:** 2025-11-20 back to 2026-05-20 (6 months)
- **Page budget target:** ~100 pages across internal canonical references + 5 external search clusters
- **Source breadth target:** official RFCs, MDN docs, practitioner blogs (Cloudflare, Mozilla, web.dev), GitHub changelogs, StackOverflow consensus, conference talk summaries

## Initial queries (from `command-center` / Command Brief)

1. "HTTP/3 QUIC production rollout 2026"
2. "REST API status code semantics correct usage 2026"
3. "CORS preflight credentials wildcard 2026"
4. "Content negotiation Accept-Encoding language 2026"
5. "Conditional request ETag If-None-Match 2026"

## Internal canonical reference sweep (from Command Brief REFERENCE MATERIAL)

| URL | Topic | Priority |
|---|---|---|
| https://www.rfc-editor.org/rfc/rfc9110 | HTTP Semantics (core) | critical |
| https://www.rfc-editor.org/rfc/rfc9112 | HTTP/1.1 | critical |
| https://www.rfc-editor.org/rfc/rfc9113 | HTTP/2 | critical |
| https://www.rfc-editor.org/rfc/rfc9114 | HTTP/3 | critical |
| https://www.rfc-editor.org/rfc/rfc9000 | QUIC | high |
| https://fetch.spec.whatwg.org/ | CORS mechanics (WHATWG Fetch spec) | critical |
| https://developer.mozilla.org/en-US/docs/Web/HTTP | MDN HTTP docs | high |
| https://ics.uci.edu/~fielding/pubs/dissertation/top.htm | Fielding REST dissertation | critical |
| https://blog.cloudflare.com/http3-the-past-present-and-future/ | Cloudflare HTTP3 blog | high |

## Expansion queries (authored by scripture-historian)

### Branch from "HTTP/3 QUIC production rollout 2026"
- "HTTP/3 adoption statistics browser support 2026"
- "QUIC 0-RTT replay attack mitigation 2026"
- "Alt-Svc header HTTP3 upgrade production 2026"
- "HTTP/3 connection migration mobile networks 2026"

### Branch from "REST API status code semantics correct usage 2026"
- "HTTP 422 Unprocessable Entity vs 400 Bad Request API design 2026"
- "REST API error response body format RFC 9457 Problem Details 2026"
- "HTTP 409 Conflict vs 400 idempotent PUT semantics 2026"

### Branch from "CORS preflight credentials wildcard 2026"
- "CORS private network access Chrome 2026"
- "SameSite cookie CORS interaction credentials 2026"
- "Access-Control-Max-Age preflight caching best practices 2026"

### Branch from "Content negotiation Accept-Encoding language 2026"
- "HTTP Vary header caching CDN content negotiation 2026"
- "Brotli zstd compression HTTP Accept-Encoding 2026"
- "Accept-Language i18n REST API localization 2026"

### Branch from "Conditional request ETag If-None-Match 2026"
- "HTTP ETag strong vs weak validation cache revalidation 2026"
- "HTTP 304 Not Modified browser cache optimization 2026"
- "Optimistic concurrency If-Match PUT PATCH REST API 2026"

## Output folder structure plan

```
research/
  research-plan.md          (this file)
  research-summary.md       (handoff summary)
  index.md                  (manifest)
  internal/                 (RFC and spec source notes)
    2026-05-20-rfc9110-http-semantics.md
    2026-05-20-rfc9113-http2.md
    2026-05-20-rfc9114-http3.md
    2026-05-20-rfc9000-quic.md
    2026-05-20-whatwg-fetch-cors.md
    2026-05-20-fielding-rest-dissertation.md
    2026-05-20-rfc9457-problem-details.md
  external/                 (web research source notes)
    2026-05-20-http3-quic-production.md
    2026-05-20-http3-adoption-stats.md
    2026-05-20-http3-alt-svc-upgrade.md
    2026-05-20-rest-status-codes-2026.md
    2026-05-20-rfc9457-problem-details-web.md
    2026-05-20-422-vs-400-api-design.md
    2026-05-20-cors-preflight-credentials.md
    2026-05-20-cors-private-network-access.md
    2026-05-20-cors-samesite-interaction.md
    2026-05-20-content-negotiation-vary.md
    2026-05-20-brotli-zstd-compression.md
    2026-05-20-etag-conditional-requests.md
    2026-05-20-conditional-optimistic-concurrency.md
```
