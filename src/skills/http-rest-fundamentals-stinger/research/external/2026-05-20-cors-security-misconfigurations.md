---
source_url: https://websentry.dev/blog/cors-misconfiguration-security-risks/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: cors
stinger: http-rest-fundamentals-stinger
---

# CORS Misconfiguration: The Security Risks of Wildcard Origins (WebSentry Blog)

Published: N/A (recent, retrieved 2026-05-20). Author: WebSentry team.

## Summary
Security-focused CORS guide documenting the four major CORS misconfiguration classes: (1) wildcard origin with credentials, (2) reflecting Origin without validation, (3) null origin allowed, (4) overly broad wildcard via substring matching (e.g. `.endsWith('example.com')` also matches `evil-example.com`). Provides secure configuration patterns including explicit allowlist with Set, `Vary: Origin` header requirement when using dynamic ACAO, and `Access-Control-Max-Age` for preflight caching.

## Key quotations / statistics
- Wildcard+credentials: "Browsers actually block this combination — you can't use `*` with credentials. But some developers work around it by reflecting the request's Origin header: `res.setHeader('Access-Control-Allow-Origin', req.headers.origin)` — DANGEROUS."
- Null origin: "The `null` origin can be triggered from sandboxed iframes and local files. Allowing it opens your API to attacks from those contexts."
- Substring matching bug: `if (origin.endsWith('example.com'))`: "also matches evil-example.com. Always match the full origin including the protocol and port."
- `Vary: Origin` requirement: "Always include this when the ACAO header changes based on the request. Without it, CDN caches may serve the wrong origin to the wrong requester."
- When wildcard IS OK: "Public CDN assets (fonts, images, CSS), public APIs that don't require authentication, open data endpoints."
- Secure allowlist: use `Set` for O(1) origin lookups with exact matching.

## Annotations for stinger-forge
- `guides/04-cors.md`: the four misconfiguration classes map directly to audit findings. Encode each as a named finding with severity rating.
- `guides/04-cors.md`: the null origin and substring matching bugs are less well-known than wildcard+credentials; include as non-obvious findings.
- `templates/cors-decision-tree.md`: "when is wildcard safe?" branch should include the null origin exclusion.
- `examples/cors-correct-vs-incorrect.md`: the substring matching bug makes an excellent "incorrect" example that's realistic (real developers make this mistake).
- No contradictions with WHATWG Fetch spec or codeava.com CORS guide.
