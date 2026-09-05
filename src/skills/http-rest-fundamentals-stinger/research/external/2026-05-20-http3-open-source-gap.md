---
source_url: https://httptoolkit.com/blog/http3-quic-open-source-support-nowhere/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: http3
stinger: http-rest-fundamentals-stinger
---

# HTTP/3 Is Everywhere But Nowhere: HTTP Toolkit Blog (2025-03-12)

Published: 2025-03-12. HTTP Toolkit (practitioner tool author).

## Summary
Analysis of the HTTP/3 adoption split: 95% browser support and 35% website advertisement, vs zero standard-library support in Node.js, Go, Rust, Python, Ruby, or Android's primary HTTP library. Curl gained experimental HTTP/3 support but it is disabled in most Linux distributions. Nginx has experimental HTTP/3 support (disabled by default). Apache has no HTTP/3 support. The root cause is the OpenSSL QUIC API schism: OpenSSL implemented QUIC differently from what the existing HTTP/3 ecosystem (built on BoringSSL/quiche) requires, blocking HTTP/3 from languages that rely on system OpenSSL. OpenSSL 3.5 (2025) added server-side QUIC support but with an incompatible API.

## Key quotations / statistics
- "HTTP/3 is used in 32% of HTTP requests to Cloudflare, and support is advertised by 35% of websites (through alt-svc or DNS) in the HTTP Archive dataset."
- "Neither QUIC nor HTTP/3 are included in the standard libraries of any major language including Node.js, Go, Rust, Python or Ruby."
- "Curl recently gained experimental and disabled in most distributions."
- "Nginx has only experimental support, disabled by default, Apache has no support or published plan."
- "Ingress-Nginx (the most popular Kubernetes reverse proxy) has punted all plans for HTTP/3 support to an as-yet-unreleased successor project."
- OpenSSL root cause: "existing QUIC and HTTP/3 implementations were built on BoringSSL or quiche (Cloudflare's fork). OpenSSL's approach doesn't work easily in the TLS section for any of the existing QUIC/HTTP/3 implementations."
- "OpenSSL 3.5 (2025) adds server QUIC support but with an incompatible API."

## Annotations for stinger-forge
- `guides/06-http2-http3.md`: critical nuance section. The browser+CDN HTTP/3 world and the origin-server/library HTTP/3 world are split. Most application code never sees HTTP/3; CDN handles it.
- Audit implication: for teams behind a CDN, HTTP/3 readiness audit is mostly a CDN configuration question. For teams running origin servers directly (no CDN), HTTP/3 readiness requires checking runtime support explicitly.
- The OpenSSL gap explains why frameworks like Next.js, Express, Django, FastAPI, etc. do not expose HTTP/3 configuration: they depend on Node/Python runtimes that depend on OpenSSL.
- Contradicts the "just enable it" framing common in 2026 CDN blogs. Stinger-forge should surface this split clearly.
