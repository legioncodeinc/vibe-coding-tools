# Better Auth: 2026 Momentum

**Sources:**
- https://www.better-auth.com/docs
- https://www.better-auth.com/changelog
- 2025-2026 community sentiment (GitHub stars, plugin ecosystem, framework integration breadth)

**Retrieved:** 2026-04-25

## Summary

Better Auth is the OSS auth library with the strongest 2026 momentum. MIT licensed, framework-agnostic (Next.js, SvelteKit, Nuxt, Remix, Hono, Express adapters), and ships a cohesive plugin model where Auth.js historically required combining many small adapters.

## What it does well

- **Cohesive plugin model**: `organization()`, `twoFactor()`, `passkey()`, `magicLink()`, `admin()`, `bearer()`, `phoneNumber()`, all first-party.
- **Framework-agnostic core**: same `auth` config, different runtime adapters.
- **Type-safe client SDK**: `authClient` with strong types via the same config.
- **Minimal config surface**: a single `betterAuth({ ... })` object configures everything.
- **DB-first**: Postgres / MySQL / SQLite via Drizzle, Prisma, Kysely adapters.

## Where it loses

- No prebuilt UI (headless by design).
- No managed SaaS option (you self-host).
- Smaller ecosystem than Auth.js (fewer third-party plugins).
- No SAML support out of the box (community plugins exist; not first-party).
- Newer; less battle-tested than Auth.js or hosted providers.

## Common migrations to Better Auth

- **From Auth.js v4 / v5**: data model maps; dual-write window; cutover. No forced re-login if account linkage preserved.
- **From Clerk**: more complex; export users, re-issue passwords on next login (Clerk hashes; can't decrypt).

## Relevance

- `guides/03-better-auth.md`: full deep dive.
- `guides/01-provider-choice-tree.md`: decision branch 3.
- `examples/better-auth-from-scratch.md`: worked example.
