---
source_url: https://www.codeava.com/blog/cors-errors-preflight-credentials-misconfigurations
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: cors
stinger: http-rest-fundamentals-stinger
---

# CORS Errors Explained: Preflight Requests, Credentials, and Common Misconfigurations (CodeAva, 2026-04-18)

Published: 2026-04-18. Author: Kuda Zafevere. CodeAva.

## Summary
Comprehensive practical CORS guide covering browser enforcement model, preflight mechanics, credential rules, and common misconfiguration patterns. Explicitly states that CORS is a browser mechanism: curl, Postman, and server-to-server calls are never CORS-restricted. Covers the wildcard-with-credentials prohibition in detail and documents that wildcards are also forbidden in `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` for credentialed requests (not just in `Access-Control-Allow-Origin`).

## Key quotations / statistics
- "CORS is enforced by browsers for cross-origin script requests. It does not stop curl, Postman, or server-to-server calls."
- "A wildcard origin combined with credentials is not allowed. Browsers reject the response and the request fails. The same restriction applies to Access-Control-Allow-Methods and Access-Control-Allow-Headers: for credentialed requests, wildcards are not honoured — you must list actual values."
- "Access-Control-Allow-Credentials has only one valid value: `true`. Anything else (including absent) means credentials are not allowed. If the request is not credentialed, omit the header entirely."
- "Vary: Origin tells caches not to share the response across different calling origins. Without it, a CDN can serve the wrong origin's response to another caller."
- "If you see Access-Control-Allow-Origin: * and Access-Control-Allow-Credentials: true together on the same response, the configuration is broken."
- Auth middleware before CORS gotcha: "When a browser preflight arrives without credentials (preflights are never credentialed), the auth layer returns 401 and the preflight fails. Make sure OPTIONS requests bypass auth middleware and return CORS headers directly."
- Required CORS response headers table: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials` (when credentials involved), `Access-Control-Max-Age` (optional, caches preflight).

## Annotations for stinger-forge
- `guides/04-cors.md`: this is the most complete practical CORS guide found. Especially valuable: the "preflights are never credentialed" point (auth middleware must NOT block OPTIONS), and the triple-wildcard prohibition (origin + methods + headers all forbidden with credentials).
- The "auth before CORS" gotcha must be a named finding in the stinger: it's a non-obvious bug that blocks all preflight requests.
- `templates/cors-decision-tree.md`: encode the wildcard rules as branching conditions in the decision tree.
- `examples/cors-correct-vs-incorrect.md`: use the secure allowlist pattern from this guide as the "correct" example.
- No contradictions with WHATWG Fetch spec (internal reference).
