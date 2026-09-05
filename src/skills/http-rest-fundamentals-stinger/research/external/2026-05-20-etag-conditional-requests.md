---
source_url: https://oneuptime.com/blog/post/2026-01-30-api-etag-headers/view
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: conditional-requests
stinger: http-rest-fundamentals-stinger
---

# How to Implement API ETag Headers (OneUptime, 2026-01-30)

Published: 2026-01-30. OneUptime (monitoring platform).

## Summary
Full implementation guide for ETag-based conditional requests in REST APIs. Covers both the GET caching use case (If-None-Match → 304) and the optimistic concurrency control use case (If-Match → 412 on conflict). Includes Node.js/Express code for both server-side ETag generation, conditional response handling, and client-side ETag cache management. Addresses multi-ETag parsing (If-None-Match can include a comma-separated list), wildcard handling (`*` matches any ETag), and the HTTP spec requirement that If-None-Match takes precedence over If-Modified-Since.

## Key quotations / statistics
- "ETag headers solve two critical problems in API development: efficient cache validation and optimistic concurrency control."
- "When a client sends `If-None-Match` with a cached ETag, your server should return 304 Not Modified if the content has not changed. This is where you save bandwidth."
- "Strong vs weak validators: `ETag: 'abc'` means byte-identical (strong). `ETag: W/'abc'` means semantically equivalent but maybe not byte-identical (weak — useful when whitespace or compression differs but content is the same)."
- "The `304 Not Modified` response has an empty body — bandwidth savings of 80-95% on read-heavy endpoints with long-lived data."
- If-Match for PUT: "if (ifMatch && ifMatch !== currentETag) return res.status(412).set('ETag', currentETag).json({ error: 'Resource has been modified', currentVersion: currentETag })"
- "Handle If-Match for PUT/PATCH requests (return 412 on mismatch, 428 if missing)": 428 Precondition Required when the server requires a conditional header.
- "Generate ETags from content hash using SHA-256": use content hash as strong ETag for exact byte-identical matching.

## Annotations for stinger-forge
- `guides/05-conditional-and-range.md`: this guide covers both ETag use cases (caching and concurrency). Use the two-use-case framing: "cache revalidation" and "optimistic concurrency control."
- The 412 vs 428 distinction: 412 Precondition Failed (If-Match present and fails), 428 Precondition Required (server requires If-Match but client didn't send it). Both are audit findings.
- Weak ETag use cases: serve as weak ETags when responses differ by whitespace/compression but are semantically equivalent. Strong ETags required for range requests (byte-range resumption).
- `examples/status-code-honesty-audit.md`: include an ETag/304 example in the correct status code honesty audit examples.
- Pairs with RFC 7232 (conditional requests original spec, now superseded by RFC 9110 §13) and the MDN If-None-Match reference.
