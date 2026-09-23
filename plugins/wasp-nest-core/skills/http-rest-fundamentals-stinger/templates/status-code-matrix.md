# Status Code Decision Matrix

Use this matrix to select the correct status code for a given scenario.

---

## "What is the outcome?"

### The request succeeded

| Scenario | Code |
|---|---|
| Read/GET returned data | 200 OK |
| New resource created (POST/PUT) | 201 Created + Location header |
| Async operation accepted (not yet complete) | 202 Accepted |
| Success with no response body (DELETE, PUT/PATCH with no body to return) | 204 No Content |
| Partial content (Range request) | 206 Partial Content |

### The resource has moved or changed URL

| Scenario | Code |
|---|---|
| Permanent URL change; preserve method | 308 Permanent Redirect |
| Permanent URL change; OK to change method to GET | 301 Moved Permanently |
| Temporary redirect; preserve method | 307 Temporary Redirect |
| Temporary redirect; OK to change method to GET | 302 Found |
| After POST, redirect to result via GET | 303 See Other |

### The client made an error

| Scenario | Code |
|---|---|
| Request body is malformed (invalid JSON, missing required field) | 400 Bad Request |
| Not authenticated (no token, expired token, invalid token) | 401 Unauthorized + WWW-Authenticate |
| Authenticated but not authorized (insufficient permissions) | 403 Forbidden |
| Resource does not exist | 404 Not Found |
| Resource exists but you want to hide it from unauthorized users | 404 Not Found (use instead of 403) |
| HTTP method not allowed for this resource | 405 Method Not Allowed + Allow header |
| Content-Type or Accept header conflict | 406 Not Acceptable or 415 Unsupported Media Type |
| Conflict with current resource state (duplicate, stale ETag) | 409 Conflict |
| Resource permanently deleted | 410 Gone |
| ETag / If-Match precondition failed | 412 Precondition Failed |
| Requested byte range not satisfiable | 416 Range Not Satisfiable |
| Request structurally valid but semantically invalid (business rule violation) | 422 Unprocessable Content |
| Rate limit exceeded | 429 Too Many Requests + Retry-After |

### The server made an error

| Scenario | Code |
|---|---|
| Unhandled exception or bug | 500 Internal Server Error |
| Gateway received bad response from upstream | 502 Bad Gateway |
| Server temporarily unavailable (maintenance, overload) | 503 Service Unavailable + Retry-After |
| Gateway timed out waiting for upstream | 504 Gateway Timeout |

---

## Quick disambiguation

| "Should I use 400 or 422?" | 400 = syntactically malformed. 422 = syntactically valid but semantically wrong. |
|---|---|
| "Should I use 401 or 403?" | 401 = not authenticated (who are you?). 403 = authenticated but not authorized. |
| "Should I use 404 or 410?" | 404 = temporarily unavailable or unknown. 410 = permanently gone. |
| "Should I use 301 or 308?" | 301 = OK for browser to switch to GET. 308 = preserve method (for POST/PUT redirects). |
| "Should I use 200 or 204?" | 200 = response body present and meaningful. 204 = success but no body. |
