---
source_url: https://www.devtoolnow.com/guides/http-caching-cache-control-etag-cdn
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: conditional-requests
stinger: http-rest-fundamentals-stinger
---

# HTTP Caching: Cache-Control, ETag, and CDN Strategies for 2026 (DevToolNow)

Published: 2026-05-06. DevToolNow.

## Summary
End-to-end HTTP caching guide covering Cache-Control directives, ETag and conditional requests, CDN cache strategies (s-maxage, stale-while-revalidate), and the content-type-specific strategy table. Covers the `304 Not Modified` bandwidth savings (80-95% on read-heavy endpoints), strong vs weak ETag semantics, the `max-age` vs `s-maxage` distinction for shared caches, `stale-while-revalidate` for zero-latency stale serving, and the `immutable` directive for hashed assets.

## Key quotations / statistics
- "Strong vs weak validators: `ETag: 'abc'` means byte-identical (strong). `ETag: W/'abc'` means semantically equivalent but maybe not byte-identical (weak)."
- Caching strategy by content type: hashed JS/CSS → `public, max-age=31536000, immutable`; HTML pages → `public, max-age=0, s-maxage=60, stale-while-revalidate=86400`; JSON API (read) → `public, max-age=60` + ETag; sensitive data (auth, payments) → `no-store`.
- "`s-maxage` overrides `max-age` for shared caches only (CDN/proxy), letting you set different TTLs for browser and CDN."
- "Why doesn't my browser cache work? Three usual causes: (1) the response includes Set-Cookie which makes the browser cache it as private; (2) the request method isn't GET/HEAD; (3) the response has Cache-Control: no-store or Pragma: no-cache."
- RFC citations: RFC 9111 (HTTP Caching), RFC 9110 (HTTP Semantics/ETag), RFC 5861 (stale-while-revalidate), RFC 8246 (HTTP Immutable Responses).
- "When both ETag and Last-Modified are present, RFC 9110 says clients should prefer ETag."

## Annotations for stinger-forge
- `guides/03-headers.md`: the caching strategy table by content type is stinger-forge-ready as a "recommended caching strategy" lookup table.
- `guides/05-conditional-and-range.md`: the "ETag preferred over Last-Modified" hierarchy from RFC 9110 should be stated explicitly.
- The `no-store` directive for sensitive data (auth tokens, payment data) is a security-relevant caching finding: pairs with `security-worker-bee` handoff.
- The `immutable` directive for hashed assets is a modern best practice not in older documentation.
- `stale-while-revalidate` (RFC 5861) is worth a dedicated mention as a performance pattern for content that can tolerate occasional staleness.
