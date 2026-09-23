# REST Architectural Compliance Checklist

Use this checklist when evaluating whether an API is genuinely RESTful, REST-like, or RPC-over-HTTP.

---

## Fielding constraints

| Constraint | Check | Pass/Fail |
|---|---|---|
| Client-server | UI logic and business logic are separated; server does not push rendering decisions | |
| Stateless | Every request contains all information needed; no server-side session state between requests | |
| Cacheable | Responses include Cache-Control and/or ETag; no uncacheable responses without explicit `no-store` | |
| Uniform interface: resource identification | Resources identified by URIs; no verb-in-URL (/createUser) | |
| Uniform interface: manipulation via representations | Clients send representations (JSON body); server sends representations | |
| Uniform interface: self-descriptive | Content-Type present; method conveys the operation | |
| Uniform interface: HATEOAS | Responses include `_links` or equivalent with next-state transitions | |
| Layered system | API works correctly behind a proxy or CDN; no headers that break with intermediaries | |

---

## URL design

| Check | Pass/Fail |
|---|---|
| Collections use plural nouns (`/users`, `/orders`) | |
| Individual resources use noun + ID (`/users/42`) | |
| No verbs in URLs except for non-CRUD actions (`/orders/42/cancel`) | |
| Nesting reflects ownership relationships (`/users/42/orders`) | |
| URLs are stable and version-compatible within a version | |

---

## HTTP method compliance

| Check | Pass/Fail |
|---|---|
| GET endpoints are safe (no side effects) | |
| PUT/DELETE are idempotent | |
| POST is used for non-idempotent creation or actions | |
| PATCH is used for partial updates (not PUT with missing fields) | |
| 405 + Allow header returned for unsupported methods | |

---

## Status code honesty

| Check | Pass/Fail |
|---|---|
| No 200 returned for errors | |
| POST creation returns 201 + Location | |
| No-content responses use 204 | |
| 401 includes WWW-Authenticate | |
| 422 used for semantic validation errors (not 400 or 500) | |
| 429 includes Retry-After | |

---

## Verdict

| Category | Assessment |
|---|---|
| **REST** | All six Fielding constraints satisfied including HATEOAS |
| **REST-like / resource-oriented** | Satisfies client-server, stateless, cacheable, uniform interface (excluding HATEOAS) |
| **RPC-over-HTTP** | Uses HTTP transport but with procedure-call URL patterns |
