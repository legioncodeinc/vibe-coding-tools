---
source_url: https://http.dev/vary
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: content-negotiation
stinger: http-rest-fundamentals-stinger
---

# Vary Header Expert Guide: http.dev (Updated 2026-04-04)

Published: 2026-04-04. http.dev (HTTP reference site).

## Summary
Definitive practical guide to the `Vary` response header. The Vary header serves two functions: (1) cache key expansion: caches store separate entries per unique combination of listed header values; (2) negotiation signal: informs the client which request headers influenced the response. Most common values: `Accept-Encoding` (for compression), `Accept` (for content type), `Accept-Language` (for localization), `User-Agent` (for device-adaptive serving). `Vary: *` signals the response is uncacheable (cache treats it as never storable). Covers common CDN bugs: serving wrong encoding due to missing Vary, and the gzip/Brotli inconsistency between origin and CDN edge.

## Key quotations / statistics
- "A single URL often produces different responses based on what the client sends... The Vary header records which request headers caused the server to choose a particular representation, giving caches the information needed to store and match the right copy."
- "`Vary: *` signals unlimited variance. Most caches treat this as uncacheable and never serve a stored copy. Remove `Vary: *` unless the intention is to disable all caching for the resource."
- CDN bug: "A server compresses responses using the encoding requested by the client... Some origin servers compress with gzip but a CDN edge re-compresses to Brotli, causing a mismatch between the cached encoding and the Vary key."
- nginx tip: "Set `gzip_vary on;` to add `Vary: Accept-Encoding` automatically. When using Brotli alongside gzip, confirm both modules add the same Vary value."
- Multiple headers: "Multiple headers influencing the response are listed as a comma-separated value: `Vary: Accept-Encoding, Accept-Language`"
- Diagnosis: `curl -H "Accept-Encoding: gzip" -v https://cdn.example.re/style.css`: compare `X-Cache` or `Age` response headers with different encoding values.

## Annotations for stinger-forge
- `guides/03-headers.md`: Vary is a caching header that belongs in the headers guide alongside Cache-Control, ETag, Last-Modified. Include the "five Vary pitfalls" from this guide as audit patterns.
- The `Vary: *` anti-pattern (effectively disabling caching) is a concrete Medium-severity audit finding.
- `Vary: Origin` (for CORS dynamic origin responses) must also be documented here: it intersects with the CORS guide.
- The gzip+Brotli CDN mismatch scenario is subtle and realistic: worth a dedicated "gotcha" callout box.
- Pairs with MDN Content Negotiation docs, the APIScout content negotiation guide, and RFC 9110 §12.
