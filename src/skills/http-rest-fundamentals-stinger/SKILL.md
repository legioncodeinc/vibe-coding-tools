---
name: "http-rest-fundamentals-stinger"
description: "'HTTP and REST protocol authority: audits HTTP method safety/idempotency contracts, status-code honesty, header correctness (Cache-Control, ETag, Vary, CORS), conditional and range requests, HTTP/2 + HTTP/3 readiness, and REST architectural-style compliance. Activate when the user says \\\\\\\"audit this API\\\\\\\", \\\\\\\"is this status code correct?\\\\\\\", \\\\\\\"why is CORS failing?\\\\\\\", \\\\\\\"explain preflight\\\\\\\", \\\\\\\"PUT vs PATCH\\\\\\\", \\\\\\\"HTTP/3 ready?\\\\\\\", or when reviewing any route handler, OpenAPI spec, or HTTP trace. Do NOT activate for TLS/cipher config (devops-worker-bee), auth token semantics (auth-worker-bee), or crawler-facing metadata (seo-aeo-worker-bee).'"
---

# http-rest-fundamentals Stinger

Procedural arsenal for `http-rest-fundamentals-worker-bee`, the HTTP and REST protocol authority in the Hive.

This stinger encodes the practical reference material needed to audit HTTP and REST usage authoritatively against RFC semantics. It is organized around eight concern areas, each with its own guide, plus templates for common deliverables and worked examples for the most frequently misunderstood scenarios.

**Paired Bee:** `../../agents/http-rest-fundamentals-worker-bee.md`
**Command Brief:** `ai-tools/command-briefs/http-rest-fundamentals-worker-bee-command-brief.md`

---

## First action when this stinger is loaded

Read these in order before doing anything:

1. **`guides/00-principles.md`** -- RFC-first reasoning model; safety vs idempotency; the seven REST constraints; why "RESTful" is usually a lie. This is the foundation every other guide builds on.
2. **`guides/10-failure-modes.md`** (if it exists; otherwise check `reports/README.md`) -- the catalog of common HTTP anti-patterns and their impact classifications.
3. The guide most relevant to the current task (see index below).

Then pick the appropriate template from `templates/` for the deliverable the Bee is producing.

---

## Guide index

| Guide | Topic | When to open |
|---|---|---|
| `guides/00-principles.md` | RFC-first reasoning; safety vs idempotency; REST constraints | Every invocation |
| `guides/01-http-methods.md` | GET/POST/PUT/PATCH/DELETE + safety/idempotency table | Method-choice questions; "is this the right verb?" |
| `guides/02-status-codes.md` | Full status-code honesty audit; 2xx/3xx/4xx/5xx decision trees | Status code reviews; "is this 200 OK?" |
| `guides/03-headers.md` | Caching (Cache-Control, ETag, Vary); content negotiation; security-adjacent headers | Header audits; caching questions; negotiation failures |
| `guides/04-cors.md` | Preflight flow; wildcard-with-credentials footgun; credential-bearing requests | Any CORS question or failure |
| `guides/05-conditional-and-range.md` | ETag strong/weak; If-None-Match/If-Match; Range requests; 304/412/416 | Caching optimizations; partial downloads |
| `guides/06-http2-http3.md` | HTTP/2 multiplexing; HTTP/3 QUIC transport; Alt-Svc; 0-RTT caveats | Performance questions; protocol upgrade readiness |
| `guides/07-rest-vs-rpc.md` | Fielding's six constraints; HATEOAS; versioning strategies | API design review; "is this REST?" |

---

## Template index

| Template | Use when |
|---|---|
| `templates/findings-report.md` | Producing the audit findings report |
| `templates/status-code-matrix.md` | Choosing the correct status code for a scenario |
| `templates/cors-decision-tree.md` | Diagnosing a CORS misconfiguration or designing a CORS policy |
| `templates/rest-checklist.md` | Evaluating whether an API is genuinely RESTful |

---

## Example index

| Example | Shows |
|---|---|
| `examples/cors-correct-vs-incorrect.md` | Side-by-side correct vs incorrect CORS configuration |
| `examples/status-code-audit.md` | A full status-code honesty audit on a sample API spec |
| `examples/http3-readiness-assessment.md` | HTTP/3 readiness assessment for a typical Node.js + Nginx stack |

---

## Critical directives (lifted from Command Brief)

- **Cite the RFC section for every status-code and method ruling.** Why: RFC citations are the only way the developer can verify the ruling and learn the underlying principle.
- **Never conflate HTTP-layer correctness with framework convention.** Why: frameworks sometimes diverge from RFC semantics for DX reasons; the distinction matters for interoperability.
- **Flag CORS wildcard-with-credentials as Critical, not Informational.** Why: this misconfiguration is exploitable by cross-origin attackers.
- **Do not audit authentication tokens, JWTs, or session cookies** -- hand off to `auth-worker-bee`. Why: boundary prevents duplicate findings.
- **Do not audit TLS, cipher suites, or certificate validity** -- hand off to `devops-worker-bee`. Why: same boundary rationale; this stinger stays at the application layer.

---

## Key research signals (from scripture-historian, 2026-05-20)

The following findings from the research sweep are high-signal for this stinger:

- **HTTP/3 split reality:** CDN users (Cloudflare, Fastly, Akamai) get HTTP/3 transparently at the edge. Self-hosted origins must configure QUIC explicitly (nginx 1.25+, Caddy, Envoy). Node.js, Go stdlib, Python stdlib, and Ruby have no first-class HTTP/3 as of 2026.
- **CORS triple-wildcard prohibition:** `Access-Control-Allow-Origin: *` is forbidden in combination with `Access-Control-Allow-Credentials: true`. The browser throws immediately. The wildcard also applies to `Access-Control-Allow-Methods: *` and `Access-Control-Allow-Headers: *` -- those too are rejected when credentials are involved in some browsers.
- **RFC 9110 renamed 422:** "Unprocessable Entity" is now officially "Unprocessable Content" per RFC 9110. The status code number is unchanged.
- **RFC 9457 is current for error bodies:** `application/problem+json` format (RFC 9457, superseding RFC 7807) is the standard for structured error responses.
- **Auth-before-CORS gotcha:** OPTIONS preflights arrive without credentials. Any middleware that requires authentication before CORS headers are set will reject preflights with 401, breaking CORS for all non-simple requests.
- **ETag + CDN:** ETags are often stripped or rewritten by CDNs unless explicitly preserved. Audits should check whether ETags survive the CDN layer.

---

## Folder layout

```
http-rest-fundamentals-stinger/
+- SKILL.md                           (this file -- master index)
+- README.md                          (one-page human overview)
+- guides/
|  +- 00-principles.md                (RFC-first reasoning; safety/idempotency; REST constraints)
|  +- 01-http-methods.md              (method semantics and the safety/idempotency table)
|  +- 02-status-codes.md              (status-code honesty audit with decision trees)
|  +- 03-headers.md                   (caching, content negotiation, security-adjacent headers)
|  +- 04-cors.md                      (preflight flow; wildcard-with-credentials; caching preflight)
|  +- 05-conditional-and-range.md     (ETag; If-None-Match; Range; 304/412/416)
|  +- 06-http2-http3.md               (HTTP/2 multiplexing; HTTP/3 QUIC; Alt-Svc; 0-RTT)
|  +- 07-rest-vs-rpc.md               (Fielding constraints; HATEOAS; versioning)
+- examples/
|  +- cors-correct-vs-incorrect.md    (side-by-side CORS configurations)
|  +- status-code-audit.md            (full status-code audit walkthrough)
|  +- http3-readiness-assessment.md   (HTTP/3 readiness for typical stack)
+- templates/
|  +- findings-report.md              (audit output template)
|  +- status-code-matrix.md           (status code decision matrix)
|  +- cors-decision-tree.md           (CORS policy design + diagnosis)
|  +- rest-checklist.md               (REST architectural compliance checklist)
+- reports/
|  +- README.md                       (how audit reports accumulate)
+- research/                          (populated by scripture-historian -- do not modify)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/                       (7 RFC + spec source notes)
   +- external/                       (12 web research source notes)
```

---

*Forged by `stinger-forge` from `http-rest-fundamentals-worker-bee-command-brief.md` and `research/`. Part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
