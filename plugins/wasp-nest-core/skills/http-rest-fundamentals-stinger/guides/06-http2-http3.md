# 06. HTTP/2 and HTTP/3

Protocol upgrades, multiplexing, QUIC, and what changes for application developers.

---

## HTTP/2 (RFC 9113)

### Key improvements over HTTP/1.1

| Feature | Impact |
|---|---|
| Binary framing layer | More efficient to parse; eliminates text-parsing ambiguities |
| Multiplexing | Multiple requests over a single TCP connection; eliminates head-of-line blocking at the HTTP layer |
| Header compression (HPACK) | Repeated headers (Authorization, Accept, etc.) compressed by >50% |
| Server push (deprecated in practice) | Server can proactively send resources before the client asks; rarely used, removed from Chrome |
| Stream prioritization | Clients can hint at priority; largely ignored in practice |

### HTTP/1.1 anti-patterns that are irrelevant in HTTP/2

| Anti-pattern | Why it was used in HTTP/1.1 | Why it's harmful in HTTP/2 |
|---|---|---|
| CSS/JS concatenation | Reduce request count | Multiplexing already handles multiple requests; concatenation increases cache invalidation surface |
| Domain sharding (cdn1.example.com, cdn2.example.com) | Work around per-host connection limits | Creates new TCP connections, defeating multiplexing |
| Image spriting | Reduce request count | Same as concatenation |
| Inlining small assets | Save a round-trip | Multiple requests are cheap with multiplexing |

### Application-layer changes for HTTP/2

None required. HTTP/2 is a drop-in transport replacement; the HTTP methods, headers, and status codes are identical to HTTP/1.1.

However: `Upgrade: h2` is NOT used for direct HTTP/2 connections (only TLS negotiation via ALPN). HTTP/2 over cleartext (h2c) is rarely supported and not recommended.

---

## HTTP/3 (RFC 9114) and QUIC (RFC 9000)

### What changed

HTTP/3 replaces TCP with QUIC (a UDP-based transport developed by Google, standardized in RFC 9000). Key improvements:

| Feature | Benefit |
|---|---|
| UDP-based (QUIC) | Eliminates TCP head-of-line blocking at the transport layer (HTTP/2 solved application-layer HOL; TCP still had transport-layer HOL) |
| Built-in TLS 1.3 | 0-RTT or 1-RTT handshakes (vs 2-RTT for TCP+TLS) |
| Connection migration | Client can change IP (e.g., WiFi to cellular) without breaking the connection |
| Better loss recovery | QUIC handles packet loss per-stream; TCP blocks the entire connection |

### 2026 deployment reality split

**CDN users (Cloudflare, Fastly, Akamai, AWS CloudFront):** HTTP/3 is transparently available at the edge. No application-layer changes required. The CDN handles QUIC negotiation with browsers; the origin continues using HTTP/1.1 or HTTP/2.

**Self-hosted origins:** Must configure QUIC explicitly:
- nginx 1.25+ with `--with-http_v3_module` and QUIC-compatible TLS library (quictls or BoringSSL)
- Caddy: built-in, enabled by default
- Envoy: built-in HTTP/3 support
- Node.js, Go stdlib, Python stdlib, Ruby: NO first-class HTTP/3 as of 2026. Use a reverse proxy.

**Recommendation for self-hosted:** Put Nginx 1.25+ or Caddy in front; let the proxy handle QUIC. Application code remains unchanged.

### Alt-Svc header: advertising HTTP/3

The server tells the client that HTTP/3 is available via the `Alt-Svc` header:
```
Alt-Svc: h3=":443"; ma=86400
```

- `h3` = HTTP/3
- `:443` = same host, port 443 (or specify a different port)
- `ma=86400` = max-age in seconds for caching this advertisement

On subsequent requests, the browser will attempt HTTP/3 first. If it fails, it falls back to HTTP/2 or HTTP/1.1.

### 0-RTT caveats

QUIC supports 0-RTT resumption for returning connections (data sent in the first packet). However:
- 0-RTT data can be replayed by an attacker. Do NOT use 0-RTT for requests that are not idempotent (POST, PUT, PATCH, DELETE).
- RFC 9001 §8.1: servers SHOULD reject 0-RTT data for non-idempotent methods.

### Application-layer changes for HTTP/3

None required. Methods, status codes, and headers are identical to HTTP/1.1 and HTTP/2.

---

## Audit checklist

### HTTP/2
- [ ] Are HTTP/1.1 anti-patterns (domain sharding, concatenation, spriting) present? Flag as low-priority technical debt.
- [ ] Is the server configured to use HTTP/2 (ALPN `h2` in TLS handshake)?
- [ ] Is server push being used? If yes: flag as deprecated; remove.

### HTTP/3
- [ ] Is `Alt-Svc: h3=...` present on responses? If not: CDN may be handling it transparently; verify.
- [ ] Is the stack self-hosted? If yes: verify nginx 1.25+ or Caddy is configured with QUIC.
- [ ] Is 0-RTT enabled? If yes: verify non-idempotent requests are rejected.
- [ ] Do CORS headers survive the QUIC path? (Usually yes if CDN handles it; verify.)

---

*Sources: RFC 9113 (HTTP/2), RFC 9114 (HTTP/3), RFC 9000 (QUIC), `research/external/2026-05-20-http3-quic-production-guide.md`, `research/external/2026-05-20-http3-adoption-stats.md`, `research/external/2026-05-20-http3-open-source-gap.md`*
