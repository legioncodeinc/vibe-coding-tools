# Example: HTTP/3 Readiness Assessment

Walkthrough of an HTTP/3 readiness assessment for a typical Node.js (Express) + Nginx stack.

---

## Stack under assessment

- Application: Node.js + Express, served on port 3000
- Reverse proxy: Nginx 1.24 on port 443, proxying to Node.js
- CDN: None (direct traffic to origin)
- Certificate: Let's Encrypt, auto-renewed

---

## Assessment findings

### F1: Nginx 1.24 does not support QUIC (HTTP/3)

- **Finding:** HTTP/3 requires nginx 1.25+ with the `--with-http_v3_module` compile flag. Nginx 1.24 does not support QUIC.
- **Impact:** HTTP/3 is not available; all connections use HTTP/2 or HTTP/1.1.
- **Options:**
  - Upgrade to nginx 1.25+: requires a TLS library that supports QUIC (quictls/BoringSSL, not OpenSSL 1.x).
  - Switch to Caddy (built-in HTTP/3, no compile flags needed).
  - Add Cloudflare or another CDN with HTTP/3 support in front of the origin (no origin changes needed).

### F2: No Alt-Svc header advertising HTTP/3

- **Finding:** The server does not send `Alt-Svc: h3=":443"; ma=86400`.
- **Impact:** Even if HTTP/3 is enabled at the infrastructure level, clients will not automatically upgrade without this header.
- **Fix (after upgrading nginx):**
```nginx
add_header Alt-Svc 'h3=":443"; ma=86400' always;
```

### F3: HTTP/1.1 domain sharding present in client-side code

- **Finding:** Frontend code references `cdn1.example.com` and `cdn2.example.com` to work around HTTP/1.1 per-host connection limits.
- **Impact:** With HTTP/2 (which is already in use), domain sharding creates new connections and defeats multiplexing. Performance regression.
- **Recommendation:** Remove domain sharding. Serve all assets from one origin or CDN host.

### Informational: Node.js has no built-in HTTP/3 as of 2026

- **Observation:** Node.js does not have a first-class HTTP/3 implementation in its standard library. The application layer (Express, Fastify, etc.) cannot serve HTTP/3 directly.
- **Recommendation:** Use a reverse proxy (Nginx 1.25+, Caddy) or CDN for HTTP/3 support. The application code is unchanged.

---

## Recommended action plan

| Priority | Action | Effort |
|---|---|---|
| High | Remove domain sharding from frontend (HTTP/2 regression) | Low |
| Medium | Evaluate CDN option for transparent HTTP/3 (Cloudflare free tier) | Low |
| Medium | If no CDN: upgrade Nginx to 1.25+ with quictls | Medium |
| Low | Add `Alt-Svc` header after nginx upgrade | Low |

---

## What good looks like (after fixes)

```nginx
# nginx 1.25+ configuration with HTTP/3
http {
    server {
        listen 443 ssl;
        listen 443 quic reuseport;  # HTTP/3 / QUIC

        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
        ssl_protocols TLSv1.3;  # QUIC requires TLS 1.3

        add_header Alt-Svc 'h3=":443"; ma=86400' always;
        add_header QUIC-Status $http3 always;

        location / {
            proxy_pass http://localhost:3000;
        }
    }
}
```
