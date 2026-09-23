# Severity rubric

Classify every finding before touching code. Grounded in [research/distilled-security.md](research/distilled-security.md), OWASP Top 10:2025, and the AI-generated-code failure data.

## Critical

Fix immediately, before anything else ships. Blocks the Ship Gate outright.

- Secret, API key, session-signing password, or database credential committed to the repo or present in git history (working or not).
- A secret shipped in the client bundle: a `PUBLIC_`-prefixed SvelteKit env var, or any secret imported outside `$lib/server/`/`*.server.ts`. [research/distilled-security.md §2, §5]
- SQL injection: `sql.raw()` or `sql.identifier()` fed from unvalidated request input; string-concatenated SQL. [research/distilled-security.md §4]
- Missing tenant isolation on a multi-tenant table: no RLS policy AND no reliable application-level scoping (a query path exists that returns another tenant's rows). [research/distilled-security.md §3]
- Authentication bypass: a protected route reachable without a valid session/JWT, or a JWT verified without checking signature, issuer, or audience.
- Stripe or GoHighLevel webhook handler that processes a payload without verifying its signature, or verifies against the wrong/mutable body.
- `{@html}` fed directly from unsanitized user- or third-party-controlled input (stored or reflected XSS with server-side render, i.e. it fires before hydration and for non-JS clients too). [research/distilled-security.md §2]
- Session ID accepted from a non-cookie source (URL, body), or no session regeneration on login (session fixation). [research/distilled-security.md §2]

## High

Fix before the next Ship Gate re-evaluation. Blocks proceeding to `quality-stinger`.

- `+server.ts` endpoint or form action missing an authorization check that a sibling route in the same resource family has (inconsistent enforcement). [research/distilled-security.md §2]
- Authorization logic placed only in `+layout.server.ts`/`+page.server.ts` `load`, with no equivalent check in `hooks.server.ts` or the corresponding `+server.ts`/action. [research/distilled-security.md §2]
- Tenant isolation implemented only via application-level `WHERE` clauses with no RLS backstop, on a table holding another tenant's PII or financial data. [research/distilled-security.md §3]
- Webhook handler (Stripe/GoHighLevel) verifying signature correctly but with no idempotency guard (duplicate processing possible on retry). [research/distilled-security.md §6, §8]
- Lockfile (`package-lock.json`) modified with a `resolved`/`integrity` change that doesn't correspond to a `package.json` version bump. [research/distilled-security.md §9]
- CI running `npm install` instead of `npm ci` on a deploy/build path. [research/distilled-security.md §9]
- Session cookie missing `HttpOnly`, `Secure`, or an explicit `SameSite` value, or using `SameSite=None` without a documented cross-origin requirement. [research/distilled-security.md §2, §7]
- Missing or clearly wrong CSP (`unsafe-inline`/`unsafe-eval` present without justification, or no CSP at all on a production deployment). [research/distilled-security.md §11]
- PII rendered as plain text on a page with no PostHog `maskTextSelector` coverage, or PII logged into a Sentry breadcrumb/context field. [research/distilled-security.md §12]

## Medium

Document; fix now only if the change is under 5 lines.

- Missing `X-Frame-Options`/`X-Content-Type-Options` header.
- Doppler/Vercel integration missing for one environment (e.g. Preview) while Production/Development are covered. [research/distilled-security.md §5]
- No rate limiting on an auth-adjacent endpoint (login, password reset, webhook intake) that isn't already covered by Vercel's managed WAF. [research/distilled-security.md §11]
- Dependency with a known non-Critical/High advisory (`npm audit`) not yet upgraded, with no compensating control.
- Verbose error messages or stack traces reaching the client response.
- No lockfile diff-review automation (`lockcheck`, resolved-domain allowlist check) even though the lockfile itself looks clean today. [research/distilled-security.md §9]

## Low

Document only; hygiene.

- Missing `Content-Security-Policy-Report-Only` staging step before a CSP change goes live.
- Cookie `Domain`/`Path` broader than strictly necessary but not currently exploitable.
- Outdated but non-vulnerable dependency versions.

## Escalation rule

Financial data (Stripe-adjacent) and PII findings never get downgraded below High to save time - reaffirmed for this stack given the CVE-2025-48757/Moltbook/Tea App pattern of AI-built apps shipping unprotected financial/PII data by default. [research/distilled-security.md §10]
