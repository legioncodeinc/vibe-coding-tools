# 04. CORS

Cross-Origin Resource Sharing: the preflight flow, the wildcard-with-credentials footgun, and common misconfigurations.

---

## Why CORS exists

The browser's Same-Origin Policy (SOP) blocks JavaScript from making requests to a different origin (scheme + host + port). CORS is the HTTP mechanism that allows a server to explicitly opt in to cross-origin requests from specific origins.

**CORS is a browser-enforced security mechanism.** Non-browser clients (curl, Postman, server-to-server) are not subject to it. CORS headers do NOT protect your server; they tell browsers which cross-origin requests to allow.

---

## Simple vs preflighted requests

The browser determines whether a request is "simple" (no preflight) or requires a preflight before allowing it.

### Simple requests (no preflight)
A request is simple if ALL of:
- Method is GET, HEAD, or POST.
- The only manually-set headers are `Accept`, `Accept-Language`, `Content-Language`, `Content-Type` (restricted to `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`).

Simple requests are sent directly and the browser checks the CORS headers on the response. If `Access-Control-Allow-Origin` is absent or doesn't match, the browser blocks the response JS from seeing.

### Preflighted requests
All other requests trigger a preflight: the browser first sends an `OPTIONS` request with:
- `Origin`: the requesting origin
- `Access-Control-Request-Method`: the actual method
- `Access-Control-Request-Headers`: the custom headers

The server must respond with appropriate CORS headers. If the preflight succeeds, the browser sends the actual request.

---

## The preflight flow

```
Browser -> Server:
OPTIONS /api/resource HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization, Content-Type

Server -> Browser (correct):
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Vary: Origin
```

---

## The wildcard-with-credentials footgun (Critical)

**This is the most commonly misunderstood CORS constraint.**

When a request includes credentials (`credentials: 'include'` in the Fetch API, meaning cookies or HTTP authentication), the browser REJECTS these wildcard values:

- `Access-Control-Allow-Origin: *` -- rejected
- `Access-Control-Allow-Headers: *` -- rejected in some browsers
- `Access-Control-Allow-Methods: *` -- rejected in some browsers

The server MUST respond with the specific origin: `Access-Control-Allow-Origin: https://app.example.com`

And MUST include: `Access-Control-Allow-Credentials: true`

**The combination that breaks things:**
```
# This will NEVER work with credentials:
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```
The browser throws a CORS error even if the server sends both headers. This is intentional: credentials + wildcard would allow any origin to make credentialed requests, defeating the Same-Origin Policy.

**Impact:** Critical -- this is a security boundary, not a preference. Classify as Critical in audit reports.

---

## Preflight caching

```
Access-Control-Max-Age: 86400
```
Tells the browser to cache the preflight result for 86400 seconds (24 hours). Without this, the browser sends a preflight before every non-simple request. For performance, always set `Access-Control-Max-Age`.

Browser limits:
- Chrome: maximum 7200 seconds (2 hours), ignores longer values
- Firefox: maximum 86400 seconds (24 hours)

---

## Exposed headers

By default, the browser only exposes six "safe" response headers to JS: `Cache-Control`, `Content-Language`, `Content-Length`, `Content-Type`, `Expires`, `Last-Modified`, `Pragma`.

To expose custom headers (e.g., `X-Request-Id`, `X-Rate-Limit-Remaining`):
```
Access-Control-Expose-Headers: X-Request-Id, X-Rate-Limit-Remaining
```

**Anti-pattern:** Setting `Access-Control-Expose-Headers: *`. This is a wildcard that is forbidden when credentials are present.

---

## Auth-before-CORS gotcha

OPTIONS preflight requests arrive WITHOUT credentials. Any middleware that enforces authentication before CORS headers are set will:
1. Receive the OPTIONS preflight
2. Check for a valid token (absent, because preflights don't include cookies/tokens)
3. Return 401 or 403
4. The browser never sees the CORS headers and reports a CORS error

**The fix:** CORS headers must be set BEFORE (or outside of) authentication middleware. Set CORS headers on OPTIONS requests unconditionally (the security is provided by the origin allowlist, not by authentication).

---

## Vary: Origin

When CORS headers vary by origin (dynamic allowlist), the response MUST include `Vary: Origin`. Without it, a CDN may cache a response with CORS headers for origin A and serve it to origin B.

---

## CORS audit checklist

- [ ] Is `Access-Control-Allow-Origin: *` used with `Access-Control-Allow-Credentials: true`? (Critical: must fix)
- [ ] Are credential-bearing requests using explicit origin instead of wildcard?
- [ ] Is `Vary: Origin` present when the allowed origin is dynamic?
- [ ] Is `Access-Control-Max-Age` set to reduce preflight overhead?
- [ ] Are OPTIONS requests exempted from authentication middleware?
- [ ] Are custom response headers listed in `Access-Control-Expose-Headers`?
- [ ] Does the server return 204 or 200 on OPTIONS preflights (not 401/403)?

---

*Sources: WHATWG Fetch spec §3.2, `research/external/2026-05-20-cors-preflight-credentials.md`, `research/external/2026-05-20-cors-security-misconfigurations.md`*
