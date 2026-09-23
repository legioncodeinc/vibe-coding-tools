# 04. Secrets and env

Grounded in [references/research/distilled-security.md §4-5](../references/research/distilled-security.md).

## Drizzle and SQL injection

Drizzle's `` sql`...${value}...` `` template auto-parameterizes and auto-escapes identifiers for tables/columns interpolated as Drizzle schema objects - "this approach effectively prevents any potential SQL Injection vulnerabilities," per Drizzle's own docs. The fluent query builder (`db.select().where(eq(col, val))`) is equally safe. [raw/security--drizzle--sql-template-injection-safety.md]

Two explicit escape hatches are the actual injection risk surface:

- `sql.raw(str)` performs ZERO escaping or parameterization. Any request-derived value passed into it is a direct SQL injection vector.
- `sql.identifier(value)` escapes the identifier syntax for the dialect, but Drizzle's own documentation carries an explicit warning that this function "does not offer any protection against SQL injections, so you must validate any user input beforehand." Escaping a string as a valid identifier is not the same as confirming it names a table/column the application actually intends to reference - a user-controlled string handed to `sql.identifier()` without an allowlist check first is still an injection/logic vector (an attacker choosing which column gets read/written).

This is not theoretical for this ORM specifically: `sql.identifier()`/`sql.as()` shipped with a real escaping defect (fixed in Drizzle 1.0.0-beta.20) that was an exploitable CWE-89 SQL injection. Since a later breaking change (drizzle-orm PR #3761), bare raw strings are no longer accepted by `db.execute()` at all, specifically because an accidentally-dropped `` sql` `` wrapper around an otherwise-identical-looking template string was a realistic injection footgun in code review.

**Grep targets:** any `sql.raw(` call whose argument traces to `event.params`, `request`, `url.searchParams`, or similar; any `sql.identifier(` call not fed from a hardcoded enum/allowlist of known-good column names.

## Secrets: Doppler and Vercel env var handling

- Doppler requires a SEPARATE integration per Vercel environment (Development, Preview, Production). A Production-only integration with no Preview counterpart is a common, easy-to-miss gap - preview deployments either run with stale/wrong secrets or fail closed depending on what's left unconfigured. Confirm all three are wired. [raw/security--secrets--doppler-vercel-integration.md]
- A fixed list of `AWS_*`/`NOW_*`/`TZ`/`LAMBDA_*` names is reserved by Vercel's runtime and cannot carry a Doppler-synced secret - if the app happens to use one of these names for something unrelated to AWS, it will not sync as expected.
- Vercel recommends "Sensitive" environment variables (cannot be read back via dashboard/API once set) over the legacy "Encrypted" type; Doppler defaults new syncs to Sensitive, but older syncs may need to be deleted and recreated to upgrade.
- Encryption at rest is not the actual confidentiality boundary for Vercel env vars - project access control is. Anyone with access to the Vercel project can view non-Sensitive variable values in the dashboard.

## What leaks into the client bundle

A SvelteKit env var carrying the `PUBLIC_` prefix (default public prefix) is baked into the client bundle at build time via dead-code elimination, by design - there is no runtime gate that stops this. See [02-sveltekit-attack-surface.md](02-sveltekit-attack-surface.md) for the full server-only-module boundary. The audit-time check is simple and non-negotiable: grep for any `PUBLIC_`-prefixed name that also looks like a credential (`KEY`, `SECRET`, `TOKEN`, `PASSWORD`), per [references/grep-patterns.md](../references/grep-patterns.md).

## Git history scanning

GitHub secret scanning covers the ENTIRE git history on all branches, not just the current HEAD - a secret removed in a later commit is still flagged because it's reachable in history, and GitHub retroactively rescans as new detector patterns ship. When a leak is found, GitHub's own remediation guidance is to rotate the credential immediately; rewriting git history is explicitly called out as "time-intensive and often unnecessary" once the credential itself has been revoked - don't spend the audit session on a history rewrite when a rotation closes the actual risk faster. [raw/security--secrets--github-push-protection.md]

## Push protection

Push protection blocks a detected secret from ever landing in the repo, pre-commit-landing rather than post-hoc. By default any contributor with write access can bypass it by supplying a reason; "I'll fix it later" leaves an OPEN alert (the other two reasons close the alert as resolved). Confirm push protection is enabled for this repository, and check for any open, unresolved bypass alert during the audit - an "I'll fix it later" bypass from three weeks ago that never got followed up is exactly the kind of finding this pass exists to catch. [raw/security--secrets--github-push-protection.md]
