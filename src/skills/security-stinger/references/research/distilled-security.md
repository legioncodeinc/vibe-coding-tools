# Distilled security research

Dense reference distilled from `raw/`. Every claim below cites its source file in brackets. Organized as a vulnerability catalog mapped to this repo's stack: SvelteKit (Svelte 5), Neon Postgres with Drizzle, WorkOS auth, Stripe payments, Vercel hosting, Doppler secrets, GoHighLevel integration. Where research is thin or a source conflicts with another, that is stated plainly rather than smoothed into a guess.

Research window: single sweep, 2026-08-14. Standards and vendor docs are current as of fetch date regardless of publish date; blog/analysis sources are dated in their own header.

## 1. OWASP Top 10:2025 mapped to this stack

| Category | What it looks like in SvelteKit + Drizzle + Neon | Default severity | Source |
|---|---|---|---|
| A01:2025 Broken Access Control (SSRF folded in for 2025) | Missing authz in `+server.ts`/form actions; `hooks.server.ts` not gating a route; layout `load` treated as a guard when it is not; missing `WHERE tenant_id` / missing RLS; SSRF via a server-side fetch to a user- or webhook-supplied URL | Critical/High | [raw/security--owasp--top10-2025-list.md] |
| A02:2025 Security Misconfiguration | Missing/weak CSP, HSTS, frame-options; `SameSite=none` without justification; Doppler/Vercel env var misrouted to the wrong environment; debug/verbose errors in production | Medium/High | [raw/security--owasp--top10-2025-list.md] |
| A03:2025 Software Supply Chain Failures (new for 2025) | Lockfile injection; unpinned/unreviewed transitive deps; missing `npm audit signatures` in CI; unvetted install scripts | High/Critical | [raw/security--owasp--top10-2025-list.md] [raw/security--supply-chain--npm-lockfile-injection-2026.md] |
| A04:2025 Cryptographic Failures | Session/cookie secrets under 32 chars or hardcoded; JWT verified without checking `iss`/`aud`; secrets logged or committed | Critical | [raw/security--owasp--top10-2025-list.md] [raw/security--workos--sveltekit-session-cookie-config.md] |
| A05:2025 Injection | Raw string SQL, `sql.raw()` fed from request input, unescaped `sql.identifier()` from user input | Critical | [raw/security--drizzle--sql-template-injection-safety.md] |
| A06:2025 Insecure Design | No tenant-isolation design (RLS or equivalent) decided up front; webhook intake designed without signature verification from day one | High | [raw/security--postgres--rls-multitenant-production-pattern.md] |
| A07:2025 Authentication Failures | Session fixation (accepting externally supplied session IDs); missing session regeneration on login; JWKS verification skipping issuer/audience checks | Critical/High | [raw/security--owasp--session-management-cookie-flags-fixation.md] [raw/security--workos--jwks-verification-guide.md] |
| A08:2025 Software or Data Integrity Failures | Lockfile `integrity`/`resolved` tampering; unverified webhook payloads trusted as if first-party | Critical/High | [raw/security--supply-chain--npm-lockfile-injection-2026.md] |
| A09:2025 Security Logging & Alerting Failures | PII/secrets logged in breadcrumbs or Sentry context; no alerting on webhook signature failures or push-protection bypasses | Medium/High | [raw/security--pii--sentry-scrubbing-sensitive-data.md] [raw/security--secrets--github-push-protection.md] |
| A10:2025 Mishandling of Exceptional Conditions (new for 2025) | Webhook handler that fails open (200 on error without safe fallback logic); auth error paths that default to allow | High | [raw/security--gohighlevel--webhook-signature-verification.md] |

OWASP's own framing: A01 remains #1 at ~3.73% of apps carrying one of its 40 CWEs; A02 rose to #2 at ~3.00%; A05 Injection fell from #3 to #5 even though it remains one of the most-tested categories, reflecting broad industry improvement on classic injection while access-control and configuration failures have not improved at the same rate. [raw/security--owasp--top10-2025-list.md]

## 2. SvelteKit attack surface

| Surface | Risk | Control | Source |
|---|---|---|---|
| Form actions / CSRF | Cross-origin `POST`/`PUT`/`PATCH`/`DELETE` form submission forging state changes | Leave `csrf.checkOrigin`/`trustedOrigins` at SvelteKit defaults (checked in production only); only add specific trusted origins (e.g. a payment gateway's callback), never `'*'` | [raw/security--sveltekit--csrf-and-csp-configuration.md] |
| CSRF edge case | A request with no `Origin` header (some hardened browsers) is rejected regardless of `trustedOrigins`, and there is currently no supported way to accept it short of the deprecated `checkOrigin: false` | Know this is a hard SvelteKit limitation, not a misconfiguration in this repo's code, if a legitimate hardened-browser user reports a blocked submission | [raw/security--sveltekit--csrf-and-csp-configuration.md] |
| `+server.ts` endpoint authz | An endpoint is reachable directly (including via `__data.json`) regardless of UI navigation state; a check that only lives in a layout `load` does not protect it | Every `+server.ts` handler must independently authorize the request; do not assume a sibling layout's check applies | [raw/security--sveltekit--authz-chokepoint-layout-load-discussion.md] |
| Load function data leakage | (a) server `load` `fetch()` calls used to leak secret query params into the client boot script pre-fix, now closed by default unless `dangerZone.trackServerFetchesPotentiallyExposingSecrets` is enabled; (b) `+layout.server.ts` treated as a guard, skipped by the client router on cached navigation | (a) confirm the dangerZone flag is off; (b) put authorization in `hooks.server.ts`, not layout `load` | [raw/security--sveltekit--load-function-secret-leak-issue.md] [raw/security--sveltekit--authz-chokepoint-layout-load-discussion.md] |
| `$env/static/private` vs `$env/dynamic/public` mistakes | A secret assigned a `PUBLIC_`-prefixed name ships to every browser by design (dead-code-elimination bakes the literal value into the client bundle); `$lib/server/*` imported (even partially) into client-reachable code fails the build, but a same-named non-`server` file bypasses that protection | Never prefix a secret `PUBLIC_`; keep all secret-touching code under `$lib/server/` or `*.server.ts` | [raw/security--sveltekit--server-only-modules-env-leak.md] |
| `hooks.server.ts` as the authz chokepoint | This is the ONLY place guaranteed to run on every server request, per multi-year SvelteKit maintainer/community consensus - layout `load` is a cache, not middleware | Centralize route-group-based authz in `handle`, before `resolve(event)` | [raw/security--sveltekit--authz-chokepoint-layout-load-discussion.md] |
| SSR XSS via `{@html}` | Raw HTML injection, executes during SSR (before hydration, even with JS disabled) | Sanitize (e.g. DOMPurify) immediately before render, or only feed it fully app-controlled content; never feed it directly-user-influenced strings | [raw/security--sveltekit--at-html-xss-docs.md] |
| Cookie flags and session fixation | Missing `Secure`/`HttpOnly`/`SameSite`; accepting a session ID via URL/body instead of only cookies; overly broad `Domain` attribute | `__Host-` prefix + `Secure; HttpOnly; SameSite=Strict; Path=/`; regenerate the session ID on login; never accept a client-supplied session identifier | [raw/security--owasp--session-management-cookie-flags-fixation.md] |
| CSP nonce/hash strategy | Inline scripts/styles broken or insecure if CSP misconfigured | `kit.csp.mode: 'auto'` (nonces for SSR pages, hashes for prerendered - SvelteKit forbids nonces on prerendered pages as insecure) | [raw/security--sveltekit--csrf-and-csp-configuration.md] |

## 3. Authorization without RLS: tenant isolation in Drizzle/Neon

- Leaving Supabase means losing its `auth.uid()`-driven RLS convenience wiring entirely: "The Supabase `tenant_id = auth.uid()` policy falls apart the moment you leave Supabase." [raw/security--postgres--rls-multitenant-production-pattern.md] Row Level Security itself (the Postgres feature) still works identically on Neon; what's lost is Supabase's automatic JWT-claim-to-session-variable wiring, which this repo must reimplement.
- "A forgotten `WHERE` clause" is not a hypothetical: a single debug-script query, a forgotten join in an admin endpoint, or an aggregate report is enough to leak one tenant's row into another's response, and code review does not reliably catch every instance. [raw/security--postgres--rls-multitenant-production-pattern.md]
- Production pattern (four pieces, all required together): `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY` (the `FORCE` line is the one most tutorials skip, and removes the default table-owner bypass - relevant because the DB role running Drizzle migrations is often the same role the app connects as); `SELECT set_config('app.tenant_id', $1, true)` as the first statement inside every tenant-scoped transaction (`true` scopes the write to the transaction so it clears on commit/rollback); `CREATE POLICY ... USING (tenant_id = current_setting('app.tenant_id', true)::uuid)` (the `true` argument to `current_setting` makes an unset GUC fail closed to zero rows instead of raising an error or leaking); an index on the tenant column. [raw/security--postgres--rls-multitenant-production-pattern.md]
- Connection-pool trap: setting the GUC with plain `SET` (not `set_config(..., true)` inside a transaction) lets the tenant context leak to the NEXT request that reuses the same pooled connection - a cross-tenant leak from pooling alone, not application logic. [raw/security--postgres--rls-multitenant-production-pattern.md]
- Drizzle supports RLS natively via `pgPolicy`/`.withRLS()`/`entities.roles` in `drizzle.config.ts`, and ships `drizzle-orm/neon` and `drizzle-orm/supabase` role helpers for those specific providers - since this repo is on Neon without Supabase, either Neon's own predefined roles/auth integration or the generic `set_config`/GUC application-level wiring above is the applicable path, not the Supabase-specific role import. [raw/security--drizzle--row-level-security-docs.md]
- Application-level-only mitigation (no RLS): a Drizzle community pattern wraps every query through a scoped helper (`scopedDb`) that injects the tenant filter - reduces but does not eliminate the "forgot the where clause" class, because any direct `db.select()` call that bypasses the wrapper still leaks. RLS is described across sources as the only control that makes a forgotten check non-fatal (fails to zero rows) rather than merely less likely.

## 4. Drizzle and SQL injection

| Pattern | Safety | Source |
|---|---|---|
| `` sql`...${value}...` `` | Safe - automatic parameterization, "effectively prevents any potential SQL Injection vulnerabilities" | [raw/security--drizzle--sql-template-injection-safety.md] |
| Fluent query builder (`db.select().where(eq(...))`) | Safe | [raw/security--drizzle--sql-template-injection-safety.md] |
| `sql.raw(str)` | UNSAFE if `str` contains any request-derived value - performs zero escaping/parameterization by design | [raw/security--drizzle--sql-template-injection-safety.md] |
| `sql.identifier(value)` | Escapes the identifier for the dialect, but Drizzle's own docs warn it "does not offer any protection against SQL injections, so you must validate any user input beforehand" - i.e. escaping is not allowlisting | [raw/security--drizzle--sql-template-injection-safety.md] |
| Bare string to `db.execute()` | No longer accepted since a breaking change (drizzle-orm PR #3761) specifically to prevent the visually-similar-diff injection risk of an accidentally-dropped `` sql` `` wrapper | [raw/security--drizzle--sql-template-injection-safety.md] |

Confirmed historical CVE-class bug in this exact ORM: `sql.identifier()`/`sql.as()` had an escaping defect (fixed in Drizzle 1.0.0-beta.20) that was an exploitable CWE-89 SQL injection - dynamic-identifier handling is not a theoretical risk in Drizzle specifically. [raw/security--drizzle--sql-template-injection-safety.md]

## 5. Secrets: Doppler, Vercel, git history

| Control | Detail | Source |
|---|---|---|
| Doppler -> Vercel sync scope | Separate integration required PER Vercel environment (Development/Preview/Production) - a missing Preview integration is a common silent gap | [raw/security--secrets--doppler-vercel-integration.md] |
| Reserved names | A fixed `AWS_*`/`NOW_*`/`TZ`/`LAMBDA_*` name list cannot be used for Doppler-synced Vercel vars | [raw/security--secrets--doppler-vercel-integration.md] |
| Sensitive vs Encrypted | Vercel "Sensitive" env vars cannot be read back via dashboard/API once set; older Doppler syncs may still use legacy "Encrypted" and must be recreated to upgrade | [raw/security--secrets--doppler-vercel-integration.md] |
| Env var confidentiality boundary | Vercel env vars are encrypted at rest but visible to any user with project access - project access control, not encryption, is the real confidentiality boundary | [raw/security--secrets--doppler-vercel-integration.md] |
| Client-bundle leak | Any var with the public prefix (`PUBLIC_` in SvelteKit) ships to the browser by design | [raw/security--sveltekit--server-only-modules-env-leak.md] |
| Git history scanning | GitHub secret scanning covers the ENTIRE history on all branches, not just HEAD, and rescans retroactively as new detector patterns ship | [raw/security--secrets--github-push-protection.md] |
| Push protection | Blocks a push containing a detected secret before it lands, pre-commit-landing; default bypass is available to anyone with write access (three bypass reasons, one of which - "I'll fix it later" - leaves an OPEN alert); delegated bypass narrows who can override | [raw/security--secrets--github-push-protection.md] |
| Remediation priority | GitHub's own guidance: rotate the credential immediately; rewriting git history is "time-intensive and often unnecessary" once the credential itself is revoked | [raw/security--secrets--github-push-protection.md] |

## 6. Stripe webhook security

| Control | Detail | Source |
|---|---|---|
| Raw body verification | The verifier must see the exact raw UTF-8 bytes Stripe sent; any body-parser that runs before the webhook route (or a JSON-mutating framework layer) breaks verification - in Express, `express.json()` must be registered AFTER the webhook route | [raw/security--stripe--webhook-signature-verification.md] |
| Per-endpoint secrets | `whsec_...` is per-ENDPOINT, not per-account; test/live and staging/production each have distinct secrets - mixing them is a documented common failure mode | [raw/security--stripe--webhook-signature-verification.md] |
| Signature format | `Stripe-Signature: t=<unix ts>,v1=HMAC-SHA256("{t}.{raw body}", secret)` | [raw/security--stripe--webhooks-idempotency-replay-guide.md] |
| Trust framing | Verification is an authorization control, not just integrity - an unverified endpoint is equivalent to an unauthenticated privileged API, since forged events can trigger the same side effects (upgrades, refunds) as real ones | [raw/security--stripe--webhooks-idempotency-replay-guide.md] |
| Idempotency | Insert `event.id` into a table with a UNIQUE constraint before any side-effecting work; a unique-violation means already-processed, skip. Stripe retries for up to 3 days with exponential backoff on any non-2xx | [raw/security--stripe--webhooks-idempotency-replay-guide.md] |
| Fast ack | Return 2xx before heavy processing; process asynchronously off the request path to avoid the delivery timeout triggering a duplicate retry | [raw/security--stripe--webhooks-idempotency-replay-guide.md] |
| Replay | Build an internal replay path (page Stripe's Events API for a window, re-enqueue through the SAME idempotent handler) for recovering from a handler bug, distinct from Stripe's own delivery retries | [raw/security--stripe--webhooks-idempotency-replay-guide.md] |

## 7. WorkOS session security

| Control | Detail | Source |
|---|---|---|
| JWT/JWKS verification | Verify against `https://api.workos.com/sso/jwks/{client_id}` using a library that resolves by `kid` (e.g. `jose`'s `createRemoteJWKSet` + `jwtVerify` with `issuer`/`audience` checks) - never hardcode/cache a single static key long-term, since key rotation publishes old+new keys simultaneously | [raw/security--workos--jwks-verification-guide.md] |
| Sealed sessions | `WORKOS_COOKIE_PASSWORD` (>=32 chars, CSPRNG-generated) encrypts the session cookie client-side-opaque; must live only in `$env/static/private`, never a `PUBLIC_`-prefixed var | [raw/security--workos--sveltekit-session-cookie-config.md] |
| Cookie config | `WORKOS_COOKIE_SAMESITE` defaults to `lax`; setting `none` (for cross-origin/iframe cases) forces `Secure` but explicitly "reduces protection against CSRF attacks" per WorkOS's own docs - only relax for a specific understood requirement | [raw/security--workos--sveltekit-session-cookie-config.md] |
| Refresh tokens | Single-use, rotate on refresh, stored in an `HttpOnly` cookie for browser apps specifically so XSS cannot exfiltrate them; default lifetimes: 5 min access token, 7 day refresh/session | [raw/security--workos--jwks-verification-guide.md] |
| Logout | `GET /user_management/sessions/logout?session_id=...` ends a specific session server-side; `session_id` comes from the access token's `sid` claim or is extracted automatically from the sealed cookie | [raw/security--workos--jwks-verification-guide.md] |
| Token revocation | JWT/JWKS verification is stateless and CANNOT immediately revoke an already-issued access token; immediate revocation (e.g. forced admin logout) requires a separate stateful revocation list checked by every verifier, which WorkOS's own docs flag as reintroducing statefulness | [raw/security--workos--jwks-verification-guide.md] |
| Integration point | `hooks.server.ts` is WorkOS's own documented SvelteKit wiring point (`authKitHandle()`), consistent with the general SvelteKit authz-chokepoint guidance | [raw/security--workos--sveltekit-session-cookie-config.md] |

## 8. GoHighLevel webhook intake

| Control | Detail | Source |
|---|---|---|
| Signature verification | Two headers: `X-GHL-Signature` (Ed25519, current, prefer whenever present) and `X-WH-Signature` (RSA-SHA256, legacy, deprecated 2026-09-01). Verify against raw payload bytes; reject if verification fails | [raw/security--gohighlevel--webhook-signature-verification.md] |
| Deprecation deadline | Legacy header retired 2026-09-01 - after that date only `X-GHL-Signature` is sent; an integration still only checking the legacy header will start silently failing verification (or, worse, accepting unverified if the code falls back to "no signature = allow") past that date | [raw/security--gohighlevel--webhook-signature-verification.md] |
| Reliability contract | Non-2xx (including timeouts) retried up to 12 times with exponential backoff + jitter; GHL explicitly wants 2xx returned even for processing errors, reserving non-2xx for real delivery/availability problems - meaning idempotency/error handling must happen INSIDE the handler, not via HTTP status | [raw/security--gohighlevel--webhook-signature-verification.md] |
| Idempotency | Store processed `webhookId` and check before processing | [raw/security--gohighlevel--webhook-signature-verification.md] |
| Circuit breaker | GHL pauses delivery to a URL after two consecutive 3-day windows below 90% success rate (only evaluated above 10,000 webhooks/window) - an audit should confirm someone monitors the warning email, since a silent pause is indistinguishable from "no events" downstream | [raw/security--gohighlevel--webhook-signature-verification.md] |
| SSRF risk | GHL's own guide does not document an SSRF control because the webhook URL is developer-configured, not per-request user input. The SSRF risk lives on the RECEIVING app's side: if the app makes an outbound server-side fetch to a URL sourced FROM a GHL payload field (e.g. an attachment/avatar URL), that fetch is a standard SSRF vector per OWASP A01:2025 and needs allowlisting/no-internal-address-resolution controls - this is inference from general SSRF principles applied to the GHL integration shape, not a GHL-documented control | [raw/security--gohighlevel--webhook-signature-verification.md] [raw/security--owasp--top10-2025-list.md] |

## 9. Dependency supply chain

| Risk | Control | Source |
|---|---|---|
| Lockfile injection (attacker modifies `resolved`+`integrity` together for a transitive dep) | CI check validating every `resolved` URL against an explicit registry allowlist; PR review flagging `resolved`/`integrity` changes with no matching version bump | [raw/security--supply-chain--npm-lockfile-injection-2026.md] |
| Registry-level compromise (valid-looking tarball, e.g. Miasma/TanStack 2026 incidents) | `npm audit signatures` in CI after install (verifies registry signature, not just hash); pin `integrity` for high-value scopes | [raw/security--supply-chain--npm-lockfile-injection-2026.md] |
| `npm install` in CI | Never - can silently upgrade/modify the lockfile; always `npm ci` (reads only from lockfile, fails on drift, never mutates it) | [raw/security--supply-chain--npm-lockfile-injection-2026.md] |
| Install-time code execution | New transitive deps with `hasInstallScript: true` in `package-lock.json` v3 warrant review before merge | [raw/security--supply-chain--npm-lockfile-injection-2026.md] |
| PR review blind spot | Lockfiles are thousands of lines; a single-line `resolved`-domain change in an unrelated-looking PR is "almost impossible to catch in a human review" without tooling | [raw/security--supply-chain--npm-lockfile-injection-2026.md] |

Research gap: no primary source specifically documenting this repo's Renovate/Dependabot configuration was archived (general Dependabot cooldown/grouping behavior is referenced only secondhand inside the search results, not fetched as a primary source) - treat any specific Renovate/Dependabot cadence claim as unverified until a dedicated source is pulled.

## 10. AI-generated code failure patterns (2026) - central because this repo is AI-built

| Failure class | Evidence | Source |
|---|---|---|
| Missing authorization / broken access control | Dominant failure pattern across Veracode, Checkmarx, CSO Online studies; CSO Online's agentic-tool study found ZERO SQL injection/XSS but the most common CRITICAL class was API authorization logic failures - modern agentic tools have improved on classic injection while authz remains weak | [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md] |
| Unvalidated input | 45-70% of AI-generated samples fail security tests depending on methodology; XSS (CWE-79) was Veracode's single worst category at 86% failure rate for XSS-prone tasks | [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md] |
| Hardcoded secrets | Present "common enough to treat as a default assumption pending scan results"; a Cybernews analysis of 38,630 Android AI-functionality apps found 197,092 unique hardcoded secrets across 72% of apps | [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md] |
| Insecure defaults (missing DB-level access control) | CVE-2025-48757: Lovable-generated apps shipping without Supabase RLS by default exposed 303 endpoints across 170 of 1,645 scanned apps; root cause named explicitly as a DEFAULT-behavior failure in the generating tool, not a one-off app bug - directly analogous to "did this AI-built SvelteKit+Drizzle app get RLS/tenant isolation, or was it silently skipped" | [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md] |
| Package hallucination / slopsquatting | 19.7% of AI-suggested dependencies in a 576k-sample study were hallucinated (non-existent); 43% of hallucinated names recur consistently across repeated queries, making them a predictable target for attacker registration | [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md] |
| Miscalibrated trust | 75%+ of developers believe AI code is MORE secure than human code while 56% of the same group admit it frequently introduces issues; under 25% run SCA on AI suggestions - names the exact governance gap a mandatory security-audit gate exists to close | [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md] |
| Iterative degradation | 40 successive AI-driven edits to the same codebase produced 37% more critical vulnerabilities than the initial output after only 5 iterations | [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md] |

## 11. Security headers and transport (Vercel)

| Control | Detail | Source |
|---|---|---|
| CSP | Vercel best practice: start `Report-Only`, avoid `unsafe-inline`/`unsafe-eval`, use nonces/hashes for needed inline content, keep source allowlists specific. SvelteKit's own `kit.csp.mode` config is what generates the nonce/hash values that make this concrete on Vercel | [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md] [raw/security--sveltekit--csrf-and-csp-configuration.md] |
| HSTS | Automatic on `.vercel.app` domains (preloaded); custom domains get HSTS too and the header is further configurable | [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md] |
| Frame options / clickjacking | `X-Frame-Options` documented as a first-class configurable Vercel header | [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md] |
| Managed WAF | Blocks OWASP-Top-10-class attacks (SQLi, XSS) at the edge before reaching app code | [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md] |
| Rate limiting | Custom WAF rules support per-path/per-IP rate limits with persistent time-based blocks on trip, e.g. "rate limit POST /auth/login to 10/min per IP, deny for 15 minutes" - configurable via natural language, UI, or `vercel.json` (note: `vercel.json` supports only a rule-action subset - `log`/`bypass`/`redirect` require dashboard/API) | [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md] |
| Secret/config file scanning | A documented example WAF rule specifically blocks requests where the path ends in `.env`, `.git`, or `.bak` - directly relevant defense-in-depth if a secret file is ever accidentally deployed | [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md] |

## 12. PII handling and logging hygiene

| Tool | Default posture | What still requires explicit work | Source |
|---|---|---|---|
| Sentry | No PII scrubbing is fully automatic - `sendDefaultPii` governs user-context capture; scrubbing is primarily an opt-IN `beforeSend*` hook responsibility | Audit breadcrumbs (log statements, DB queries) for logged PII; check transaction-name parameterization does not leak IDs (`/users/1234/details` vs `/users/:userid/details`); hash rather than send confidential context values | [raw/security--pii--sentry-scrubbing-sensitive-data.md] |
| PostHog session replay | Inputs masked by default (`maskAllInputs: true`); general TEXT is NOT masked by default | Explicitly set `maskTextSelector` if any page renders PII as static text (e.g. account settings showing an email); use `maskCapturedNetworkRequestFn` to redact tokens/IDs in captured URLs; custom (non-native) password-input components are not auto-masked | [raw/security--pii--posthog-session-replay-privacy-masking.md] |

Recommended default posture for both tools per their own docs: start from "mask/scrub everything," selectively unmask only reviewed-safe fields - not the reverse. [raw/security--pii--sentry-scrubbing-sensitive-data.md] [raw/security--pii--posthog-session-replay-privacy-masking.md]
