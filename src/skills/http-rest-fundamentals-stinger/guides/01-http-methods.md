# 01. HTTP Methods

Method semantics, safety, idempotency, and common misuse patterns.

---

## Safety and idempotency matrix

| Method | Safe | Idempotent | Body allowed? | RFC 9110 section |
|---|---|---|---|---|
| GET | Yes | Yes | No (SHOULD be ignored) | §9.3.1 |
| HEAD | Yes | Yes | No | §9.3.2 |
| POST | No | No | Yes | §9.3.3 |
| PUT | No | Yes | Yes | §9.3.4 |
| DELETE | No | Yes | No | §9.3.5 |
| CONNECT | No | No | No | §9.3.6 |
| OPTIONS | Yes | Yes | No | §9.3.7 |
| TRACE | Yes | Yes | No | §9.3.8 |
| PATCH | No | No | Yes | RFC 5789 |

**Key implication:** Caches MUST NOT store responses to non-safe methods unless the response explicitly permits caching via `Cache-Control`. A cached `DELETE` response is nonsensical.

---

## GET

- MUST be safe -- no state mutations.
- Responses are cacheable by default (unless overridden with `Cache-Control: no-store`).
- **Anti-pattern:** `GET /users/delete?id=42` -- this mutates state via a GET. When a search crawler or browser pre-fetches this URL, it deletes the record.
- Request bodies on GET are technically allowed by RFC 9110 but SHOULD NOT be used. Many intermediaries strip them. Use query parameters for filters.

## POST

- General-purpose "do something" method. Not idempotent, not safe.
- Canonical uses: create a new resource (returns 201 + Location), submit a form, trigger an action that doesn't map cleanly to a resource.
- **Common misuse:** Using POST for reads (GraphQL does this, which is a deliberate trade-off, not an error per se, but it breaks HTTP caching at the network level).

## PUT

- Replace the entire resource at the given URI. The request body is the complete new representation.
- Idempotent: calling `PUT /users/42` twice with the same body leaves the server in the same state.
- **Common misuse:** Using PUT to partially update a resource. If you send `PUT /users/42` with only the `email` field, you implicitly nullify all other fields. Use PATCH for partial updates.
- If the resource doesn't exist, PUT MAY create it (implementation choice; respond 201). If it exists, 200 or 204.

## PATCH

- Apply a partial modification to a resource.
- **Not idempotent by default.** A patch that appends an item to a list is not idempotent.
- Always define the patch format explicitly (JSON Merge Patch per RFC 7396, or JSON Patch per RFC 6902).
- Use `Content-Type: application/merge-patch+json` or `application/json-patch+json`.
- To make PATCH idempotent, use `If-Match: <etag>` to guard against concurrent writes.

## DELETE

- Remove the resource. Idempotent: deleting an already-deleted resource should return 404 or 204, not an error (both are valid; be consistent).
- No body in the response for success; use 204 No Content.
- **Soft-delete pattern:** if you keep a tombstone, the server state is not truly idempotent (the tombstone count grows). This is fine in practice but should be noted in API documentation.

## HEAD

- Identical to GET but the server MUST NOT send a response body.
- Useful for checking if a resource exists, getting metadata (Content-Length, Last-Modified, ETag) before deciding to download.

## OPTIONS

- Returns the allowed methods for a resource (via `Allow` header) and is the mechanism for CORS preflight requests (see `guides/04-cors.md`).
- Must not require authentication: CORS preflights send OPTIONS without credentials. Auth middleware that blocks unauthenticated OPTIONS requests will break all non-simple cross-origin requests.

---

## Common method anti-patterns

| Anti-pattern | What to flag | Correct approach |
|---|---|---|
| `GET /delete-user?id=42` | GET is safe; this mutates state | `DELETE /users/42` |
| `POST /users/42/update` | RPC-style; uses verb in URL | `PUT /users/42` or `PATCH /users/42` |
| `PUT` with partial body | PUT replaces; partial body nullifies fields | `PATCH` with JSON Merge Patch |
| `POST` for idempotent creation | POST is not idempotent; double-submit creates duplicates | `PUT` to a client-generated URI, or use idempotency key header |
| `GET` with request body for filtering | Bodies on GET are stripped by intermediaries | Use query parameters |
| `DELETE` returning 200 with a body | 204 No Content is conventional | Return 204 |

---

*Sources: RFC 9110 §9, RFC 5789 (PATCH), `research/external/2026-05-20-rest-status-codes-2026.md`*
