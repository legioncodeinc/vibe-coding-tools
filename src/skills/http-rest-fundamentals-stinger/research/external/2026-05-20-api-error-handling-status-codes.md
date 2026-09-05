---
source_url: https://apiscout.dev/guides/api-error-handling-status-codes-2026
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: status-codes
stinger: http-rest-fundamentals-stinger
---

# API Error Handling: Status Codes & Error Objects 2026 (APIScout)

Published: 2026-03-08. APIScout Team.

## Summary
Practical status code and error object reference covering both the HTTP status code selection and the corresponding error response body shape. Cites RFC 7231 and RFC 9110. Provides a "minimum viable" status code set and a "Common Mistakes" table. The error object shape recommended aligns with RFC 9457 Problem Details: `type`, `code`, `message`, `request_id`, `field` (for validation errors), `docs` link. Includes retry strategy table by status code.

## Key quotations / statistics
- Minimum status code set: "If you only use a few, use these: 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500, 503."
- Common mistake table: "200 for everything → clients can't distinguish success/failure by status code | Stack traces in production → security vulnerability, leaks internals | Missing Retry-After on 429 → clients retry immediately, making it worse."
- Retry strategy: 429 (rate limited) → Wait Retry-After seconds; 500/502/503 → Exponential backoff; 400/401/403/404 → Do NOT retry.
- Error object: must include `request_id` field for every error: "Debugging requires reproducing the issue" without it.
- "Consistent error schema is more important than a perfect schema."

## Annotations for stinger-forge
- `guides/02-status-codes.md`: the retry strategy table is directly useful as a "how clients should interpret each status" section.
- `templates/findings-report.md`: the Common Mistakes table maps to audit finding types. "200 for everything" should be a Critical finding template.
- The `request_id` inclusion in every error response is a practical recommendation (beyond pure RFC compliance) worth including in the guide.
- Pairs with RFC 9457 internal reference for the standard error body shape.
