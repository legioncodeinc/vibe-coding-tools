---
source_url: https://fetch.spec.whatwg.org/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: cors
stinger: http-rest-fundamentals-stinger
---

# WHATWG Fetch Specification - CORS Mechanics

## Summary
The WHATWG Fetch spec (living standard) defines the Fetch API and CORS (Cross-Origin Resource Sharing) as implemented by browsers. CORS is a browser-enforced mechanism; server-to-server requests are never CORS-restricted. The spec defines "simple" requests (no preflight) vs preflighted requests (OPTIONS sent first). Simple requests are: GET/HEAD/POST with specific allowed headers (Accept, Accept-Language, Content-Language, Content-Type: text/plain|multipart/form-data|application/x-www-form-urlencoded). Any request outside those criteria triggers a preflight OPTIONS. Credentials (cookies, HTTP auth, TLS client certs) can only be included when `Access-Control-Allow-Credentials: true` is set AND the server returns a specific non-wildcard origin. The wildcard `*` is FORBIDDEN with credentials: browsers reject the response if they see `Access-Control-Allow-Origin: *` AND `Access-Control-Allow-Credentials: true` together.

## Key quotations / statistics
- "If credentials flag is set, Access-Control-Allow-Origin cannot be `*`": the browser terminates the request if the combination is detected.
- "A wildcard cannot be used in Access-Control-Allow-Headers or Access-Control-Allow-Methods with credentialed requests."
- `Access-Control-Max-Age` caches the preflight result; browser maximum is 7200s (Chrome); specify lower during rollout.
- `Access-Control-Expose-Headers` lists response headers accessible to JavaScript; by default only CORS-safelisted headers (Cache-Control, Content-Language, Content-Length, Content-Type, Expires, Last-Modified, Pragma) are exposed.
- Private Network Access (Chrome Fetch specification extension): requests from public to private IP ranges require an additional CORS preflight with `Access-Control-Request-Private-Network: true`.
- Null origin: sandboxed iframes and file:// URLs send `Origin: null`. Allowing `null` is a misconfiguration.

## Annotations for stinger-forge
- `guides/04-cors.md`: this spec is the definitive source for the complete preflight flow, the wildcard-with-credentials prohibition, and the Expose-Headers behavior. Every CORS rule the stinger encodes must cite the Fetch spec.
- The "wildcard + credentials = Critical" directive in the bee's identity matches the spec exactly: stinger-forge should encode this as a non-negotiable Critical-severity finding.
- Private Network Access (PNA) is a newer CORS extension (2021 proposal, Chrome-enforced from 2022). Include in the guide as an advanced CORS topic.
- `templates/cors-decision-tree.md`: the simple vs preflighted decision should be a binary tree template.
- Contradiction note: some developer blog posts simplify CORS incorrectly (e.g., claiming server-side CORS protects APIs from non-browser clients). Stinger-forge should include a "what CORS does NOT do" clarifying note.
