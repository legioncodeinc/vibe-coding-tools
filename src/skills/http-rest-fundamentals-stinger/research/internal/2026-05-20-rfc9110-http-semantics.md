---
source_url: https://www.rfc-editor.org/rfc/rfc9110
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: http-semantics
stinger: http-rest-fundamentals-stinger
---

# RFC 9110 - HTTP Semantics (June 2022)

## Summary
RFC 9110 is the authoritative reference for HTTP semantics, superseding RFC 7231/7232/7233/7235. It defines the meaning of HTTP methods, status codes, header fields, and content negotiation. This is the foundational document every audit finding must cite. It renamed "422 Unprocessable Entity" to "422 Unprocessable Content" (§15.5.21). It defines safe methods (no observable side-effects: GET, HEAD, OPTIONS, TRACE), idempotent methods (multiple identical requests have the same effect: GET, HEAD, PUT, DELETE, OPTIONS, TRACE), and cacheable methods (GET, HEAD, POST, PATCH, though POST and PATCH are only cacheable when fresh).

## Key quotations / statistics
- "The request method token is the primary source of request semantics; it indicates the purpose for which the client has made this request and what is expected by the client as a successful result." (§9)
- "A method is safe if the method's semantics are essentially read-only" (§9.2.1): GET, HEAD, OPTIONS, TRACE are safe.
- "A method is idempotent if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request." (§9.2.2): PUT, DELETE, safe methods are idempotent. POST and PATCH are NOT.
- "The 422 (Unprocessable Content) status code indicates that the server understands the content type of the request content... but was unable to process the contained instructions." (§15.5.21)
- Status code classes: 1xx informational, 2xx successful, 3xx redirection, 4xx client error, 5xx server error.
- "The server MUST send a Date header field in all responses" (§6.6.1), unless it has no reasonable clock.
- Conditional requests precedence: If-Match → If-Unmodified-Since → If-None-Match → If-Modified-Since → If-Range.
- Content negotiation is defined in §12: proactive (Accept headers), reactive (300/alternatives), transparent.

## Annotations for stinger-forge
- `guides/00-principles.md`: cite RFC 9110 §9.2.1 for safety, §9.2.2 for idempotency definitions.
- `guides/01-http-methods.md`: cite §9.3 (GET), §9.3.3 (POST), §9.3.4 (PUT), §9.3.5 (DELETE), §9.3.6 (CONNECT), §9.3.7 (OPTIONS), §9.3.8 (TRACE).
- `guides/02-status-codes.md`: cite §15.5.21 for 422 (note rename from "Unprocessable Entity" to "Unprocessable Content"), §15.5.1 (400), §15.5.2 (401), §15.5.4 (403).
- `guides/05-conditional-and-range.md`: cite §13 for conditional request evaluation order.
- `templates/`: status-code decision matrix must cite RFC 9110 not RFC 7231 for correctness.
- No contradictions with other research sources: this is the primary source all others reference.
