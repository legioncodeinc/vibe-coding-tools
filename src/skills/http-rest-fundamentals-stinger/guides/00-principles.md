# 00. Principles

Core reasoning model for every HTTP and REST audit.

---

## RFC-first reasoning

HTTP semantics are defined in RFCs, not in framework docs. Before ruling on any HTTP concern, ask: "What does the RFC say?" The hierarchy is:

1. **RFC 9110 (HTTP Semantics)** -- the normative foundation for method definitions, status codes, and headers. Supersedes RFC 7231.
2. **RFC 9112 / 9113 / 9114** -- wire format for HTTP/1.1, HTTP/2, HTTP/3 respectively. Application-layer semantics from RFC 9110 apply equally to all three versions.
3. **RFC 9000** -- QUIC transport for HTTP/3.
4. **WHATWG Fetch spec** -- the normative authority for CORS mechanics (the browser-side view).
5. **RFC 9457** -- `application/problem+json` for structured error responses.
6. **Framework documentation** -- secondary; framework conventions sometimes diverge from RFC semantics for developer-experience reasons. Always surface the distinction.

**Cite the RFC section, not just the RFC number.** "RFC 9110 §9.3.1" is auditable; "the RFC says so" is not.

---

## Safety vs idempotency

These are orthogonal properties. Confusing them is one of the most common HTTP API design errors.

| Property | Definition | RFC reference |
|---|---|---|
| **Safe** | The method must not cause any state change on the server. The client can call it freely without side effects. GET, HEAD, OPTIONS, TRACE are safe. | RFC 9110 §9.2.1 |
| **Idempotent** | Calling the method N times produces the same server state as calling it once. GET, HEAD, PUT, DELETE, OPTIONS, TRACE are idempotent. POST and PATCH are NOT idempotent unless the implementation explicitly makes them so. | RFC 9110 §9.2.2 |

Implications:
- A `GET` that mutates state (creates a record, fires an email) violates the safety contract. This breaks caches, crawlers, and pre-fetchers.
- A `DELETE /resource/123` that returns 404 on the second call is fine from an idempotency perspective (the outcome is the same: the resource doesn't exist). But a `DELETE` that creates a tombstone record on every call is NOT idempotent.
- `PATCH` is NOT idempotent by default. A `PATCH` that appends to a list will produce different state on repeated calls. A `PATCH` with conditional request headers (`If-Match`) CAN be made idempotent.

---

## The seven REST constraints (Fielding, 2000)

"REST" is an architectural style defined by Roy Fielding in his 2000 dissertation. An API is only genuinely RESTful if it satisfies all six (later seven with code-on-demand as optional) constraints:

1. **Client-server** -- the client and server are separate concerns; the server does not push UI logic to the client, the client does not know about server internals.
2. **Stateless** -- each request from the client must contain all information needed to process it; the server holds no session state between requests. This enables horizontal scaling and transparent caching.
3. **Cacheable** -- responses must declare whether they are cacheable. Violating this degrades performance and correctness.
4. **Uniform interface** -- four sub-constraints: resource identification (URIs), resource manipulation through representations, self-descriptive messages (media types + HTTP methods), and hypermedia as the engine of application state (HATEOAS).
5. **Layered system** -- the client cannot tell whether it is connected to the end server or an intermediary (cache, gateway, load balancer). APIs must not break when a proxy or CDN is in the path.
6. **Code on demand (optional)** -- servers may transfer executable code to clients (JavaScript). Optional, and irrelevant to API design.

**Most "REST APIs" violate the uniform interface constraint** (specifically HATEOAS) and the stateless constraint (session cookies, JWT-in-cookie without proper scope). They are REST-ish or RPC-over-HTTP, not REST. Naming this distinction matters because HATEOAS violations affect discoverability and client coupling; stateless violations affect scalability.

---

## The "200 with error body" anti-pattern

Returning `HTTP/1.1 200 OK` with a JSON body of `{"error": "not found"}` is a fundamental violation of HTTP semantics. It:
- Breaks HTTP caches (200 responses are cacheable by default; your error is now cached).
- Breaks monitoring (your error rate is invisible to APM tools that classify by status code).
- Breaks clients that check the status code before parsing the body (as they should).
- Forces every consumer to write custom error-detection logic instead of using the status code.

This pattern originated in SOAP (which used HTTP as a dumb transport) and has no place in a genuine HTTP API.

---

## Boundary with peer Bees

| Concern | Owner |
|---|---|
| TLS, cipher suites, certificate validity | `devops-worker-bee` |
| Authorization header semantics, JWT validation, OAuth flows | `auth-worker-bee` |
| 401 vs 403 distinction (HTTP-layer) | `http-rest-fundamentals-worker-bee` |
| WWW-Authenticate header format | `http-rest-fundamentals-worker-bee` |
| OWASP-level security header enforcement (CSP, X-Frame-Options) | `security-worker-bee` (flag here; hand off) |
| HTTP headers used as crawler hints (X-Robots-Tag, canonical) | `seo-aeo-worker-bee` |

---

*Sources: `research/internal/2026-05-20-rfc9110-http-semantics.md`, `research/internal/2026-05-20-fielding-dissertation.md`*
