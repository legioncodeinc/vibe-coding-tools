# Audit checklist by surface

Work top to bottom. Each item cites the guide with the full reasoning and the raw source behind it. Mark every item, including "none found" - a silent skip looks identical to "not checked."

## SvelteKit application surface

- [ ] `svelte.config.js` `kit.csrf` - `checkOrigin`/`trustedOrigins` at safe defaults; no `trustedOrigins: ['*']`.
- [ ] Every `+server.ts` handler independently authorizes the request (does not rely on a sibling layout's `load`).
- [ ] Every form action (`+page.server.ts` `actions`) independently authorizes, and validates `request.formData()` input.
- [ ] `hooks.server.ts` `handle` contains the route-group-based authorization chokepoint; confirm it actually gates the routes it claims to (test with a manually-expired/deleted session cookie against a cached client-side navigation, per the documented SvelteKit bypass pattern).
- [ ] No secret is imported outside `$lib/server/**` or `*.server.ts`; no secret carries a `PUBLIC_` prefix. Grep per [references/grep-patterns.md](grep-patterns.md).
- [ ] `config.kit.dangerZone.trackServerFetchesPotentiallyExposingSecrets` is not enabled (or if it is, every server-`load` `fetch()` call is confirmed secret-free in its URL).
- [ ] Every `{@html ...}` usage is fed either app-controlled content or output sanitized immediately before render.
- [ ] `kit.csp.mode` is set (`'auto'` unless there's a documented reason otherwise) and `directives` avoid `unsafe-inline`/`unsafe-eval` without justification.
- [ ] Session/auth cookies: `HttpOnly`, `Secure`, explicit `SameSite`, `__Host-` prefix where feasible.

See [guides/02-sveltekit-attack-surface.md](../guides/02-sveltekit-attack-surface.md).

## Authorization and tenancy (Drizzle / Neon)

- [ ] Every multi-tenant table has RLS enabled AND forced (`ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY`), or an equivalent reviewed justification for why it doesn't need tenant scoping.
- [ ] Tenant-scoping GUC (`app.tenant_id` or equivalent) is set via `set_config(..., true)` inside a transaction wrapper that the rest of the app cannot bypass (the raw `db`/pool client is not exported from that module).
- [ ] Connection pooling mode (if PgBouncer or similar) is transaction-mode, not session-mode, if RLS session variables are in play.
- [ ] A negative test exists: unset tenant context returns zero rows; a write tagged as another tenant is rejected.
- [ ] No `sql.raw()` or `sql.identifier()` call takes an argument derived from request input without an allowlist check first.
- [ ] No raw string SQL bypasses the `` sql`` `` template.

See [guides/03-authorization-and-tenancy.md](../guides/03-authorization-and-tenancy.md).

## Secrets and environment

- [ ] Doppler integration exists for every Vercel environment in use (Development, Preview, Production) - not just Production.
- [ ] No secret uses a Vercel "Reserved Environment Variable" name.
- [ ] Vercel env vars holding secrets are set as "Sensitive," not legacy "Encrypted."
- [ ] `git log -p --all -- '**/.env*'` (or equivalent) shows no committed `.env` file, past or present.
- [ ] GitHub secret scanning and push protection are enabled on the repository.
- [ ] No open push-protection bypass alert with an unresolved "I'll fix it later" reason.

See [guides/04-secrets-and-env.md](../guides/04-secrets-and-env.md).

## Webhooks and third-party intake (Stripe, GoHighLevel)

- [ ] Stripe: raw body reaches `constructEvent`/verifier before any JSON body-parser runs; correct per-environment `whsec_` secret; signature check happens before any side effect.
- [ ] Stripe: idempotency table with a unique constraint on `event.id`; 2xx returned before heavy processing.
- [ ] GoHighLevel: `X-GHL-Signature` (Ed25519) checked when present, `X-WH-Signature` (RSA) only as fallback; verification runs against raw payload bytes.
- [ ] GoHighLevel: webhook handler returns 2xx even on internal processing failure (per GHL's own contract) while still recording/alerting on that failure internally.
- [ ] Duplicate `webhookId`/`event.id` values are tracked and skipped.
- [ ] Any server-side fetch to a URL sourced from webhook payload data is allowlisted / blocked from resolving internal addresses (SSRF).

See [guides/05-webhooks-and-third-party-intake.md](../guides/05-webhooks-and-third-party-intake.md).

## Dependencies and supply chain

- [ ] CI uses `npm ci`, never `npm install`, on build/deploy paths.
- [ ] `npm audit signatures` runs in CI after install.
- [ ] `npm audit --audit-level=high` (or equivalent) is a blocking CI gate.
- [ ] A `resolved`-URL domain allowlist check runs in CI against the lockfile.
- [ ] Any PR touching `package-lock.json` is reviewed for `resolved`/`integrity` changes with no matching version bump, and for new entries with no `package.json` counterpart.
- [ ] No new dependency with `hasInstallScript: true` was added without review.

See [guides/06-dependencies-and-supply-chain.md](../guides/06-dependencies-and-supply-chain.md).

## Headers and transport (Vercel)

- [ ] CSP present in production (not left in Report-Only indefinitely without a plan to enforce).
- [ ] HSTS present (automatic on `.vercel.app`/custom domains, verify it isn't disabled).
- [ ] `X-Frame-Options` and `X-Content-Type-Options` present.
- [ ] Rate limiting configured on auth-adjacent and webhook-intake paths not already covered by the managed WAF's own protections.
- [ ] A WAF rule (or equivalent) blocks requests to `.env`, `.git`, `.bak`-suffixed paths.

See [guides/07-headers-and-transport.md](../guides/07-headers-and-transport.md).

## AI-generated code patterns

- [ ] Every authorization-critical code path (auth, tenancy, payments, admin actions) was written or reviewed with explicit security intent, not accepted as first-draft AI output.
- [ ] No hardcoded secret value that looks like a placeholder default (`supersecretkey`, `changeme`, a JWT secret matching a known LLM-common default).
- [ ] Every `package.json` dependency was checked to actually exist on the registry before being trusted (guards against slopsquatting of a hallucinated package name).
- [ ] Database/API access controls (RLS, endpoint authz) were verified present, not assumed present because "the AI probably added it."

See [guides/08-ai-generated-code-patterns.md](../guides/08-ai-generated-code-patterns.md).

## PII and logging hygiene

- [ ] Sentry `beforeSend`/`beforeSendLog`/`beforeBreadcrumb` scrub or omit PII (email, tokens, DB query params) before transmission.
- [ ] No PII logged as a breadcrumb or in HTTP context by default (`sendDefaultPii` reviewed).
- [ ] PostHog `maskTextSelector` covers any page rendering PII as static text, not just input fields.
- [ ] PostHog `maskCapturedNetworkRequestFn` redacts tokens/identifiers in captured URLs.
- [ ] Custom (non-native) password/sensitive input components are manually masked in PostHog, since auto-detection only covers native input semantics.

See [guides/01-audit-procedure.md](../guides/01-audit-procedure.md) for how these checklists fit into the end-to-end pass.
