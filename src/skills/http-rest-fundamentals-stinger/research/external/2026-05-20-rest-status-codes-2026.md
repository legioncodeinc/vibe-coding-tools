---
source_url: https://www.restguide.info/status-codes
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: status-codes
stinger: http-rest-fundamentals-stinger
---

# HTTP Status Codes: Complete REST API Reference (2026)

Published: 2026-02-12. RestGuide.info.

## Summary
Comprehensive status code reference for REST APIs, grounded in RFC 9110 §15. The guide covers all five classes, documents the most common decision points (401 vs 403, 400 vs 422, 404 vs 410, 301 vs 302 vs 307 vs 308), and provides a "Status Codes by HTTP Method" matrix. It also lists status codes that carry implicit method-change semantics: 302 and 303 change method to GET even for POST; 307 and 308 preserve the method (critical for REST API redirect flows).

## Key quotations / statistics
- "401 Unauthorized means the request lacks valid authentication... 403 Forbidden means the server understood who the user is (authenticated) but they do not have permission." Rule: `No valid auth → 401 | Valid auth, no permission → 403`
- "404 Not Found means the resource does not currently exist, but it may exist in the future. 410 Gone means the resource existed but was permanently removed."
- "400 Bad Request means the request is syntactically invalid. 422 Unprocessable Entity means the request is syntactically correct but semantically invalid." Rule: `Invalid syntax → 400 | Invalid semantics → 422`
- 307 vs 308 vs 302 vs 301: "307 Temporary Redirect and 308 Permanent Redirect preserve the HTTP method. 301 and 302 do NOT preserve the method — the browser changes POST to GET on redirect." Critical for form submission flows and API redirects.
- 201 Created: "Include the Location header pointing to the newly created resource."
- 202 Accepted: "Request accepted for async processing — not yet completed. Include a status URL or job ID."
- 204 No Content: "No response body. Use for DELETE or PUT with no response body."

## Annotations for stinger-forge
- `guides/02-status-codes.md`: the 401/403 distinction, the 400/422 distinction, and the redirect method-preservation rules are the top audit findings. Encode all three as explicit "finding templates" with RFC 9110 citations.
- `templates/status-code-matrix.md`: the "Status Codes by HTTP Method" pattern from this guide is stinger-forge-ready as a fillable matrix template.
- The "200 with error body" anti-pattern (returning 200 OK with `{"success": false, ...}` body) is not explicitly called out here but is the most common API mistake. Stinger-forge should add it to the findings guide.
- Pairs with RFC 9110 internal reference for citations, and with RFC 9457 for error body format.
