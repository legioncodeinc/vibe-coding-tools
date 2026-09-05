# Research Summary: http-rest-fundamentals-stinger

Produced by scripture-historian (Phase 1.5). Date: 2026-05-20.

---

## Depth Tier Consumed

**normal** (~100 pages target; 19 structured source files produced from live web research and canonical spec review)

## Time Window Covered

2025-11-20 to 2026-05-20 (6 months), with several canonical documents (RFCs, Fielding dissertation) included as evergreen internal references regardless of publication date.

## Files Written

| Subfolder | Count | Topics |
|---|---|---|
| `internal/` | 7 | RFC 9110, RFC 9113, RFC 9114, RFC 9000, WHATWG Fetch spec, Fielding dissertation, RFC 9457 |
| `external/` | 12 | HTTP/3 production (3 files), status codes (2 files), CORS (2 files), content negotiation (3 files), conditional requests (2 files) |
| **Total** | **19** | |

---

## 5 Most Influential Sources

### 1. RFC 9110: HTTP Semantics (`internal/2026-05-20-rfc9110-http-semantics.md`)
**Why it matters for stinger-forge:** This is the root citation for every method, status code, and content negotiation ruling in the stinger. Every `guides/` file must have at least one RFC 9110 §-level citation to be credible. Stinger-forge should treat it as the mandatory citation source for all seven ACTION guides. Key facts encoded: safety vs idempotency definitions (§9.2.1, §9.2.2); 422 renamed to "Unprocessable Content" (§15.5.21); conditional request evaluation order (§13.2.2).

### 2. WHATWG Fetch Spec (`internal/2026-05-20-whatwg-fetch-cors.md`)
**Why it matters for stinger-forge:** The authoritative source for CORS browser mechanics. The wildcard-with-credentials prohibition is specified here (not in any RFC), making this the mandatory citation for the Critical-severity CORS finding. Also defines Private Network Access, null origin danger, and the complete preflight flow. `guides/04-cors.md` cannot be written without this source.

### 3. HTTP/3 and QUIC Implementation Guide 2026 (`external/2026-05-20-http3-quic-production-guide.md`)
**Why it matters for stinger-forge:** The most operationally complete 2026 HTTP/3 guide found. Encodes the four prerequisites (TLS 1.3, UDP/443, Alt-Svc, implementation config), nginx version caveats (1.29.1+ for 0-RTT with OpenSSL), and the curl-based verification workflow. This is the template for `examples/http3-readiness-assessment.md` and the HTTP/3 section of `guides/06-http2-http3.md`.

### 4. CORS Errors Explained: Preflight, Credentials, Misconfigurations (`external/2026-05-20-cors-preflight-credentials.md`)
**Why it matters for stinger-forge:** Contains the "auth before CORS" gotcha (preflights arrive uncredentialed, auth middleware must not block OPTIONS), the triple-wildcard prohibition (ACAO + ACAM + ACAH all forbidden with credentials), and the requirement to omit `Access-Control-Allow-Credentials` entirely when the request is not credentialed. These are non-obvious findings that distinguish a deep CORS audit from a surface-level one.

### 5. Roy Fielding's REST Dissertation (`internal/2026-05-20-fielding-rest-dissertation.md`)
**Why it matters for stinger-forge:** The only authoritative source for the six REST constraints. `guides/07-rest-vs-rpc.md` must derive from this source, particularly the stateless constraint (server-side sessions violate REST), the HATEOAS requirement (nearly universally skipped), and the architectural basis for distinguishing REST from RPC-over-HTTP. The stinger should state clearly that most "RESTful" APIs are HTTP+JSON RPC: this framing prevents the worker-bee from over-prescribing HATEOAS where it's not needed.

---

## 5 Open Questions for the User

1. **HTTP/3 scope for self-hosted vs CDN-proxied origins:** The research revealed a meaningful split: CDN-proxied traffic gets HTTP/3 automatically; self-hosted origins require explicit configuration (nginx 1.25+, Caddy, etc.). Should the stinger's HTTP/3 guide explicitly scope its "readiness assessment" to CDN users vs origin-server users? Or produce a unified checklist?

2. **RFC 9457 Problem Details adoption guidance:** RFC 9457 (`application/problem+json`) is the standard for HTTP error response bodies as of July 2023, superseding RFC 7807. Should the stinger mandate RFC 9457 compliance as an audit finding, or recommend it as a best practice? The bee's Command Brief says "audit status code honesty": does error body shape fall within scope?

3. **HATEOAS guidance level:** Fielding's dissertation requires HATEOAS for true REST. The stinger's `guides/07-rest-vs-rpc.md` must decide: should it instruct the bee to flag absence of HATEOAS as a finding, or just document the theoretical/practical split? Most production APIs skip HATEOAS and work fine.

4. **HTTP/2 server push:** RFC 9113 allows server push; Chrome removed support in April 2022; Safari followed. Should the stinger instruct the bee to flag `Link: rel=preload` + server push configurations as a "deprecated" finding, or just informational?

5. **Content-Disposition scope:** The Command Brief mentions `Content-Disposition` (inline vs attachment) as a possible in-scope header. Research did not produce a dedicated source for it. Should stinger-forge add a brief `Content-Disposition` section to `guides/03-headers.md`, or treat it as out of scope? If in scope, the key decision is `inline` (browser renders) vs `attachment` (browser downloads), and the `filename*` encoding (RFC 5987) for non-ASCII filenames.

---

## Sources Stinger-forge Should Re-fetch for Deeper Context

- **RFC 9114 §10 (Security Considerations):** The 0-RTT replay attack section. Fetch the full section text to extract the exact safe-method restriction language for the HTTP/3 security callout.
- **WHATWG Fetch spec, §3.2.2 (CORS preflight flow):** The step-by-step preflight algorithm. The internal note summarizes it; stinger-forge may want the exact algorithm steps for the CORS decision tree template.
- **MDN HTTP Caching Guide** (`https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching`): Not fetched in this run. Would complement the caching sections in `guides/03-headers.md` and `guides/05-conditional-and-range.md`.
- **Cloudflare QUIC/HTTP3 production blog** (`https://blog.cloudflare.com/http3-the-past-present-and-future/`): Listed in the Command Brief's REFERENCE MATERIAL. Not fetched because the 2026 TechBytes and w3techs sources provided more current data, but the Cloudflare post has authoritative Cloudflare-specific traffic share data worth citing.
