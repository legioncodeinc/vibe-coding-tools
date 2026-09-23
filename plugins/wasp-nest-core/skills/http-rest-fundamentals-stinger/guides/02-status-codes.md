# 02. Status Codes

Honesty audit guide. Every status code is a semantic contract with the client, caches, and monitoring systems. Lying with status codes is a first-class bug.

---

## 2xx: Success

### 200 OK
- The request succeeded and the response body contains the result.
- **Anti-pattern:** Returning 200 for operations that failed. The body may say `{"error": "not found"}` but the status says "success." This is exploitable by caches and invisible to APM.
- Do NOT use 200 for resource creation (use 201). Do NOT use 200 for no-content responses (use 204).

### 201 Created
- A new resource was successfully created. MUST include a `Location` header pointing at the new resource URI.
- **Anti-pattern:** Returning 200 instead of 201 after POST creates a resource. The `Location` header is omitted, forcing clients to parse the body for the new ID.

### 202 Accepted
- The request has been accepted for processing but processing has not completed. Use for async operations.
- SHOULD include a way to check status (a `Location` or `Content-Location` pointing at a status resource).

### 204 No Content
- The request succeeded but there is no response body.
- Canonical uses: successful DELETE, successful PUT/PATCH with no representation to return.
- **Anti-pattern:** Returning 200 with an empty body. Use 204 explicitly.

### 206 Partial Content
- Used with `Range` requests (see `guides/05-conditional-and-range.md`). Must include `Content-Range` header.

---

## 3xx: Redirection

### 301 Moved Permanently
- The resource has permanently moved. The method MAY change to GET on redirect (RFC 9110 allows it; historically browsers change POST to GET). Cache the redirect indefinitely.
- Use for permanent URL restructuring.

### 302 Found
- Temporary redirect. Method MAY change to GET. Do NOT cache.
- **Anti-pattern:** Using 302 for permanent moves. The old URL won't be updated in clients/caches.

### 303 See Other
- Redirect after POST to a GET-able result. The client MUST use GET for the redirect. Canonical pattern for Post-Redirect-Get.

### 307 Temporary Redirect
- Temporary redirect. The method MUST NOT change (unlike 302). Use when you need a temporary redirect and want to preserve POST/PUT.

### 308 Permanent Redirect
- Permanent redirect. The method MUST NOT change (unlike 301). Use when you need a permanent redirect and want to preserve POST/PUT.

### Quick reference: redirects

| Code | Permanent? | Method preserved? |
|---|---|---|
| 301 | Yes | No (MAY change to GET) |
| 302 | No | No (MAY change to GET) |
| 303 | No | No (always GET) |
| 307 | No | Yes |
| 308 | Yes | Yes |

---

## 4xx: Client Error

### 400 Bad Request
- The request is malformed and cannot be processed. Use for syntactically invalid input (invalid JSON, missing required fields, schema validation failures when you can't distinguish validation from business logic).
- **Anti-pattern:** Using 400 for all client errors. Be specific: 401 for missing auth, 403 for insufficient permissions, 404 for unknown resources, 422 for business-logic validation failures.

### 401 Unauthorized (misleadingly named)
- Authentication is required and has not been provided or has failed.
- MUST include a `WWW-Authenticate` header describing the authentication scheme (RFC 9110 §15.5.2).
- **Common confusion:** 401 means "not authenticated" (who are you?). 403 means "not authorized" (I know who you are, but you can't do this). Returning 401 when the user is authenticated but lacks permissions leaks information.

### 403 Forbidden
- The server understood the request and knows who the user is, but refuses to fulfill it.
- Do NOT include `WWW-Authenticate` (unlike 401).
- Use 404 instead of 403 when you want to hide the existence of a resource from unauthorized users (security through obscurity, but a legitimate choice for sensitive resources).

### 404 Not Found
- The resource does not exist at this URI. May be temporary or permanent.
- May be used to hide 403 when the resource's existence is sensitive.

### 405 Method Not Allowed
- The HTTP method is not supported for this resource. MUST include an `Allow` header listing the supported methods.

### 409 Conflict
- The request conflicts with the current state of the resource (e.g., duplicate unique key, optimistic concurrency conflict).
- Use for conflicts that the client can potentially resolve by modifying the request.

### 410 Gone
- The resource has been permanently deleted and will not return. Unlike 404, this is a permanent signal. Use when you want clients and search engines to stop requesting a resource.

### 422 Unprocessable Content (formerly "Unprocessable Entity")
- RFC 9110 §15.5.21 renamed this from "Unprocessable Entity" to "Unprocessable Content."
- Use for semantically invalid input: the syntax is correct (valid JSON) but the content violates business rules (e.g., end date before start date, insufficient balance, referencing a non-existent foreign key).
- **With RFC 9457:** respond with `Content-Type: application/problem+json` for structured error details.

### 429 Too Many Requests
- Rate limiting. SHOULD include `Retry-After` header (seconds or HTTP date) to tell the client when to retry.

---

## 5xx: Server Error

### 500 Internal Server Error
- Catch-all for unhandled server-side exceptions. Never return 500 for client errors; use 4xx.

### 502 Bad Gateway
- The gateway or proxy received an invalid response from an upstream server.

### 503 Service Unavailable
- The server is temporarily unable to handle the request (overload, maintenance). SHOULD include `Retry-After`.

### 504 Gateway Timeout
- The gateway or proxy did not receive a timely response from an upstream server.

---

## RFC 9457: Problem Details (`application/problem+json`)

For any 4xx or 5xx response with a body, use the Problem Details format (RFC 9457, superseding RFC 7807):

```json
{
  "type": "https://example.com/probs/insufficient-balance",
  "title": "Insufficient Balance",
  "status": 422,
  "detail": "Account balance $10.00 is less than the required $50.00.",
  "instance": "/transfers/42"
}
```

`Content-Type: application/problem+json`

The `status` field in the body MUST match the HTTP status code. Do not return `{"status": 200, "error": "..."}`.

---

## Status code honesty checklist

Run this against every endpoint:

- [ ] Is the 2xx code specific (200 vs 201 vs 202 vs 204 vs 206)?
- [ ] Does POST creation return 201 + Location header?
- [ ] Does 401 include `WWW-Authenticate`?
- [ ] Does 405 include `Allow` header?
- [ ] Does 429 include `Retry-After`?
- [ ] Are 4xx codes used for client errors and 5xx for server errors (never swapped)?
- [ ] Is 200 with an error body present anywhere? (This is always wrong.)
- [ ] Are validation errors 422 (semantic) or 400 (syntactic), not 500?

---

*Sources: RFC 9110 §15, RFC 9457, `research/external/2026-05-20-rest-status-codes-2026.md`, `research/external/2026-05-20-api-error-handling-status-codes.md`*
