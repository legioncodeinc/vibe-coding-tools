# http-rest-fundamentals-wasp-drone

## Domain
This Drone is the HTTP protocol and REST architectural-style authority for any stack in the repo. It audits method safety and idempotency contracts, status-code honesty (including the "200 with error body" anti-pattern), header correctness (Cache-Control, ETag, Vary, CORS), conditional and range requests, HTTP/2 and HTTP/3 readiness, and REST compliance against Fielding's constraints. Every ruling is grounded in an RFC citation, not framework convention.

## Paired Stinger
[http-rest-fundamentals-stinger](../../http-rest-fundamentals-stinger) - RFC-first guides on methods, status codes, headers, CORS, conditional/range requests, HTTP/2-3, and REST vs RPC, plus a findings-report template.

## Trigger phrases
- "is this status code correct?"
- "why is CORS failing?"
- "explain preflight"
- "PUT vs PATCH"
- "is our API HTTP/3 ready?"
- "audit this API"
- "why does this route return 200 on error"

## Do NOT route when
- The concern is TLS/cipher configuration or certificate validity; that belongs to devops-wasp-drone.
- The concern is authentication token semantics, JWTs, sessions, or OAuth flows; that belongs to auth-wasp-drone.
- The concern is crawler-facing HTTP headers or Core Web Vitals; that belongs to seo-aeo-wasp-drone.
- The concern is OWASP-level security header enforcement beyond a single misconfigured header; that belongs to security-wasp-drone (this Drone flags the header, security-wasp-drone tracks remediation).

## Inputs the Drone needs
- The route handler, OpenAPI spec, or captured HTTP trace under review.
- The scope of the audit (methods, status codes, headers, CORS, caching, protocol version, or REST compliance).
- Whether the ask is a diagnosis ("why is CORS failing") or a full audit.

## Outputs
- A severity-tagged findings report with RFC section citations for every ruling.
- A status-code decision matrix or CORS decision-tree walkthrough when disambiguating a single case.
- A named handoff list to auth-wasp-drone or security-wasp-drone for out-of-scope findings.

## Commonly sequenced with
- auth-wasp-drone: picks up any finding that touches token or session semantics.
- security-wasp-drone: picks up OWASP-level header enforcement and CORS-adjacent exploits flagged here.
- devops-wasp-drone: owns TLS and infrastructure-layer transport once the application-layer audit is done.
