# 03. Headers

Caching, content negotiation, and HTTP-layer security-adjacent headers.

---

## Caching headers

### Cache-Control
The primary directive for controlling caching. Sent by both servers (response) and clients (request).

**Response directives (most important):**

| Directive | Meaning |
|---|---|
| `no-store` | Do not cache at all; fetch fresh every time |
| `no-cache` | Cache the response but revalidate with the origin before serving (conditional request required) |
| `private` | Only the end-user's browser may cache; no shared/CDN caching |
| `public` | Any cache (CDN, proxy) may cache |
| `max-age=N` | Cache is fresh for N seconds |
| `s-maxage=N` | Override `max-age` for shared caches (CDNs) only |
| `must-revalidate` | Once stale, MUST revalidate; do not serve stale under any circumstances |
| `immutable` | The resource will never change during its freshness lifetime; skip revalidation |
| `stale-while-revalidate=N` | Serve stale for N seconds while fetching fresh in background |

**Common anti-patterns:**
- `Cache-Control: no-cache, no-store, must-revalidate` together: `no-store` already prevents caching; the others are redundant but harmless.
- Missing `Cache-Control` on API responses: browsers and CDNs apply heuristic caching, which may cache responses that should not be cached.
- `Cache-Control: max-age=0` without `must-revalidate`: the cache may serve stale content under some conditions.

### ETag
An opaque identifier for a specific version of a resource. Used for conditional requests (see `guides/05-conditional-and-range.md`).

- **Strong ETag:** `ETag: "abc123"` -- byte-for-byte identical representation required for match.
- **Weak ETag:** `ETag: W/"abc123"` -- semantically equivalent (same content, maybe different encoding). Valid for `If-None-Match` but not for `If-Match` (range requests).

**CDN note:** ETags are often stripped or rewritten by CDN edge nodes unless the CDN is configured to preserve them. Audits should verify ETags survive the CDN layer.

### Vary
Tells caches which request headers affect the response, so they can store multiple versions.

- `Vary: Accept-Encoding` -- store separate versions for gzip, br, identity.
- `Vary: Accept` -- store separate versions for JSON vs XML vs HTML representations.
- `Vary: Accept-Language` -- store separate versions per language.
- `Vary: Cookie` -- forces private caching (cookies are user-specific).

**Anti-pattern:** Omitting `Vary: Accept-Encoding` when the server compresses responses. The CDN may serve a gzip-encoded response to a client that sent `Accept-Encoding: identity`, causing a broken download.

### Last-Modified
A timestamp for the last modification of the resource. Less precise than ETag (1-second resolution). Used with `If-Modified-Since` / `If-Unmodified-Since`.

---

## Content negotiation headers

### Accept (client -> server)
The client declares acceptable media types in preference order:
```
Accept: application/json, text/html;q=0.9, */*;q=0.1
```
The server SHOULD honor the preference order. If none match, respond 406 Not Acceptable.

### Accept-Encoding (client -> server)
Compression algorithms the client accepts:
```
Accept-Encoding: br, gzip, deflate, identity
```
- `br` (Brotli) is preferred in 2026; compresses ~15-20% better than gzip.
- Server MUST respond with `Content-Encoding` matching what it used.
- Server SHOULD add `Vary: Accept-Encoding` to the response.

### Accept-Language (client -> server)
Language preferences:
```
Accept-Language: en-US, en;q=0.9, fr;q=0.5
```
Used for server-side i18n. Server SHOULD add `Vary: Accept-Language` if the response varies by language.

### Content-Type (server -> client)
The media type of the response body. Must be accurate.
- `application/json` -- JSON
- `application/problem+json` -- RFC 9457 problem details
- `application/merge-patch+json` -- JSON Merge Patch body (RFC 7396)
- `application/json-patch+json` -- JSON Patch body (RFC 6902)
- `multipart/form-data` -- file uploads

**Anti-pattern:** Responding with `Content-Type: application/json` when the body is HTML, plain text, or an error string. Clients will fail to parse.

### Content-Encoding (server -> client)
The compression applied to the response body:
- `Content-Encoding: br` -- Brotli
- `Content-Encoding: gzip` -- Gzip
Not to be confused with `Transfer-Encoding`, which applies to the transfer layer.

---

## Security-adjacent headers (HTTP-layer scope)

These headers are HTTP-layer concerns for `http-rest-fundamentals-worker-bee`. The enforcement and prioritization of OWASP-level violations is `security-worker-bee`'s domain.

### Strict-Transport-Security (HSTS)
Forces HTTPS for future requests:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
- Only meaningful over HTTPS (ignored over HTTP).
- `preload` requires submission to the HSTS preload list.

### X-Content-Type-Options
Prevents MIME sniffing:
```
X-Content-Type-Options: nosniff
```
Always include. No downside.

### Referrer-Policy
Controls how much referrer information is sent with requests:
```
Referrer-Policy: strict-origin-when-cross-origin
```
A reasonable default for 2026.

### Permissions-Policy
Restricts browser feature access (camera, geolocation, etc.):
```
Permissions-Policy: camera=(), microphone=(), geolocation=()
```
Scope: only relevant for browser-facing responses.

---

*Sources: RFC 9110 §7, RFC 9110 §12, `research/external/2026-05-20-content-negotiation-rest-apis.md`, `research/external/2026-05-20-vary-header-guide.md`, `research/external/2026-05-20-mdn-content-negotiation.md`*
