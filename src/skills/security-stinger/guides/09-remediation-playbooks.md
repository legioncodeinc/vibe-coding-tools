# 09. Remediation playbooks

Canonical before/after fixes per vulnerability class. Use [references/secure-by-default-snippets.md](../references/secure-by-default-snippets.md) as the copy-paste starting point for each; adapt names and types to the actual schema before applying.

## Missing `hooks.server.ts` authorization

**Before:** authorization logic lives only in `+layout.server.ts` `load`, or is duplicated inconsistently across several `+page.server.ts`/`+server.ts` files.

**After:** centralize the check in `hooks.server.ts` `handle`, gated by route groups, per the snippet in [references/secure-by-default-snippets.md](../references/secure-by-default-snippets.md#hooksserverts-authorization-chokepoint). Remove the now-redundant per-layout check only if the `hooks.server.ts` check is confirmed to cover the same routes - do not delete the old check and add the new one in the same commit without verifying route coverage overlaps exactly, or a route can end up with neither.

## Secret shipped to the client bundle

**Before:** a secret assigned a `PUBLIC_`-prefixed variable name, or imported from outside `$lib/server/**`/`*.server.ts`.

**After:** rename the variable to drop the public prefix, move its only usages into server-only files, and ROTATE the credential - a build that already shipped means the old value is compromised regardless of the code fix, per [04-secrets-and-env.md](04-secrets-and-env.md). Confirm the rotated value is set via Doppler for every Vercel environment that uses it, not just Production.

## Missing tenant isolation (no RLS, or RLS not forced)

**Before:** a multi-tenant table with a `tenant_id`/`organization_id` column but no `ENABLE ROW LEVEL SECURITY` / `FORCE ROW LEVEL SECURITY`, relying solely on application-level `WHERE` clauses.

**After:** apply the four-piece pattern in [03-authorization-and-tenancy.md](03-authorization-and-tenancy.md): enable + force RLS, `set_config(..., true)`-based transaction wrapper, policies against `current_setting(..., true)`, index on the tenant column. This is architectural, not a one-line patch - if time-boxed, ship the transaction wrapper and application-level enforcement immediately (closes the acute risk) and document the RLS migration as a required High-severity follow-up with a target date, not silently deferred.

## SQL injection via `sql.raw()` or unvalidated `sql.identifier()`

**Before:**
```ts
db.execute(sql.raw(`SELECT * FROM ${tableName} WHERE status = '${status}'`));
```

**After:**
```ts
const ALLOWED_TABLES = new Set(['orders', 'invoices'] as const);
if (!ALLOWED_TABLES.has(tableName)) throw error(400, 'invalid table');
db.select().from(sql.identifier(tableName)).where(eq(statusColumn, status));
// or, fully parameterized:
db.execute(sql`SELECT * FROM ${sql.identifier(tableName)} WHERE status = ${status}`);
```
Allowlist any dynamic identifier BEFORE it reaches `sql.identifier()`; parameterize every value through the `` sql`` `` template rather than string interpolation.

## Unverified webhook handler

**Before:** a webhook route that parses and acts on the payload before (or without) verifying its signature.

**After:** apply the Stripe or GoHighLevel snippet in [references/secure-by-default-snippets.md](../references/secure-by-default-snippets.md) - raw body captured before any parsing, signature verified before any side effect, idempotency check before any side effect, fast 2xx ack with async processing. If the handler was already live and unverified, treat this as Critical and check for evidence of exploitation (forged events in logs/DB) as part of remediation, not just the code fix.

## `{@html}` without sanitization

**Before:** `{@html rawUserContent}` with no sanitizer in the render path.

**After:** `DOMPurify.sanitize()` (or equivalent) applied immediately before render, per the snippet in [references/secure-by-default-snippets.md](../references/secure-by-default-snippets.md#html-with-sanitization). If the content genuinely never contains user- or third-party-influenced text, document that reasoning explicitly in the report rather than leaving the finding unaddressed with no explanation.

## Weak session cookie configuration

**Before:** a session cookie missing `HttpOnly`/`Secure`/`SameSite`, or a token stored in `localStorage`.

**After:** `__Host-` prefix, `Secure; HttpOnly; SameSite=Strict; Path=/`, per [references/secure-by-default-snippets.md](../references/secure-by-default-snippets.md#session-cookie-flags). If the token was ever in `localStorage`, treat any user who loaded a page during that window as having a potentially XSS-exfiltratable token, independent of whether an actual XSS vulnerability has been found - rotate the signing/cookie password to invalidate existing sessions if the exposure window and risk warrant it.

## `npm install` on a build/deploy path

**Before:** a CI workflow or Vercel build command running `npm install`.

**After:** replace with `npm ci`; add `npm audit signatures` and a `resolved`-domain allowlist check as documented in [06-dependencies-and-supply-chain.md](06-dependencies-and-supply-chain.md). This is a Medium-to-High severity config change, not a code change - verify the lockfile itself is currently clean (per the same guide's PR-review red flags) before assuming the switch alone closes the gap, since an already-tampered lockfile would just get faithfully installed by `npm ci` too.

## PII leaking into Sentry or PostHog

**Before:** default Sentry/PostHog config with no explicit scrubbing/masking beyond each tool's built-in defaults, on a page or flow known to render/log PII.

**After:** apply the Sentry `beforeSend`/`beforeBreadcrumb` snippet and PostHog `maskTextSelector`/`maskCapturedNetworkRequestFn` config in [references/secure-by-default-snippets.md](../references/secure-by-default-snippets.md). Specifically check for PII rendered as plain TEXT (not just inputs) - PostHog's input masking is on by default, but general text is not, so an account-settings page showing an email as static text is a real gap even with default PostHog config in place.

## After any remediation

Run `git diff` and confirm it contains ONLY the security-relevant change - no opportunistic refactoring, no unrelated formatting churn. A reviewer needs to be able to read the diff and understand exactly what security property changed and why.
