---
source_url: https://apiscout.dev/guides/content-negotiation-rest-apis-guide-2026
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: content-negotiation
stinger: http-rest-fundamentals-stinger
---

# Content Negotiation in REST APIs 2026 (APIScout)

Published: 2026-03-08. APIScout Team.

## Summary
Practical guide to implementing content negotiation in REST APIs. Ground truth: most APIs should support JSON only; content negotiation adds complexity that rarely pays off unless multi-format is genuinely needed. The `Vary: Accept` header is mandatory when supporting multiple formats or CDNs will serve the wrong cached response. Quality values (`q=`) must be parsed correctly. Returns 406 Not Acceptable for unsupported formats (not 200 with a default). Versioning via Accept header (content negotiation) is technically cleaner but practically worse than URL versioning.

## Key quotations / statistics
- "Most APIs should support JSON only — content negotiation adds complexity that rarely pays off unless you have specific multi-format needs."
- "Always include the `Vary: Accept` header when supporting multiple formats — CDNs will serve wrong cached responses without it."
- "Versioning via `Accept` header is technically cleaner than URL versioning but practically worse — harder to test, less visible, trickier to route."
- Common mistakes: ignoring Accept header but returning wrong type, no 406 response, missing Content-Type header, no `Vary: Accept`, over-engineering formats.
- CDN caching pitfall: "A CDN might cache the first response (say, JSON) and serve it for all subsequent requests — including those requesting CSV." The `Vary: Accept` header prevents this.
- "The downside: Vary significantly reduces cache hit rates because cache keys become more specific."
- Code example: Hono (edge runtime) implementation of multi-format endpoint with proper `Vary: Accept` header.

## Annotations for stinger-forge
- `guides/03-headers.md`: the `Vary: Accept` caching requirement is a concrete audit finding. Any API serving multiple content types without `Vary: Accept` is a finding.
- `guides/07-rest-vs-rpc.md`: include the Accept-header versioning note as an alternative to URL versioning, with the practical trade-off.
- `templates/findings-report.md`: "Missing Vary header for content-negotiated response" is a Medium-severity audit finding template.
- Pairs with MDN Content Negotiation docs and the RFC 9110 §12 internal reference.
- Note for stinger-forge: the guide recommends Brotli (`br`) and gzip as the main `Accept-Encoding` values; zstd is emerging but not yet universally supported client-side.
