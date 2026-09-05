---
source_url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: content-negotiation
stinger: http-rest-fundamentals-stinger
---

# MDN Web Docs: Content Negotiation (Updated 2025-12-21)

Published: 2025-12-21. Mozilla MDN Web Docs.

## Summary
MDN's authoritative developer-facing guide to HTTP content negotiation. Covers proactive (server-driven) negotiation via Accept, Accept-Encoding, Accept-Language, and Accept-Charset headers; reactive (agent-driven) negotiation via 300 Multiple Choices; and the Vary response header. Documents the privacy fingerprinting concern with Accept-Language (modified values can fingerprint users, Chrome/Safari limit to one language in incognito). Notes that User-Agent-based negotiation is not recommended despite being common.

## Key quotations / statistics
- "The HTTP/1.1 standard defines a list of the standard headers that start server-driven negotiation (such as Accept, Accept-Encoding, and Accept-Language). Though User-Agent isn't in this list, it's sometimes also used to send a specific representation of the requested resource. However, this isn't always considered a good practice."
- "The Accept-Encoding header defines the acceptable content encoding (supported compressions). The value is a q-factor list (e.g., `br, gzip;q=0.8`) that indicates the priority of the encoding values."
- "The `Vary` HTTP header is sent by the web server in its response. It indicates the list of headers the server uses during the server-driven content negotiation phase."
- Accept-Language privacy concern: "Due to the configuration-based entropy increase, a modified value can be used to fingerprint the user. It's not recommended to change it."
- "`Vary: *` prevents caching from occurring, as the cache can't know what element is behind it."

## Annotations for stinger-forge
- `guides/03-headers.md`: MDN is the authoritative developer reference. The Accept/Vary section maps directly to the headers guide's content negotiation subsection.
- The Accept-Language privacy note (fingerprinting risk) is worth including as an informational observation: don't use Accept-Language for analytics.
- User-Agent-based negotiation being "not recommended" is a findable anti-pattern: flag dynamic serving based on User-Agent without `Vary: User-Agent` as a caching bug.
- Link to MDN in the stinger as a living reference: the MDN URLs are stable and always current.
- Pairs with RFC 9110 §12 (internal reference) and the APIScout content negotiation guide.
