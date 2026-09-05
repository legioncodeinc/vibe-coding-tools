# Auth.js (NextAuth) v5: 2026 Status

**Sources:**
- https://authjs.dev
- https://authjs.dev/getting-started/migrating-to-v5
- 2025-2026 community migration sentiment

**Retrieved:** 2026-04-25

## Summary

Auth.js v5 (formerly NextAuth.js v5) has stabilized. It remains the largest-ecosystem OSS auth library for Next.js with 50+ provider configurations. The v4 → v5 migration is real but well-documented.

## What changed in v5

- Single `auth.ts` file replaces inline config in `[...nextauth]/route.ts`.
- `getServerSession()` → `auth()`.
- Middleware: `export { auth as middleware }`.
- Env var: `NEXTAUTH_SECRET` → `AUTH_SECRET`.
- `AUTH_TRUST_HOST` required behind reverse proxies.
- Provider configs reshaped (e.g., scope on `Google`).
- Adapter API updated; check version compatibility per adapter.

## Default-strategy debate

Auth.js docs lean toward `session: { strategy: 'jwt' }` as default. This is widely critiqued: JWT-only sessions force a choice between long TTLs (security risk) and short TTLs (UX cost) with no graceful logout-everywhere. For most apps, `database` strategy is the better default.

## Auth.js vs Better Auth (2026)

- Auth.js: mature, larger provider matrix, larger community.
- Better Auth: cleaner DX, cohesive plugin model, hot in 2026.
- For a new project on Next.js, Better Auth is the slightly stronger pick for the team that wants minimal config; Auth.js still reasonable when an obscure IdP needs to be supported.

## Relevance

- `guides/04-auth-js-nextauth.md`: full deep dive.
- `guides/01-provider-choice-tree.md`: decision branch 3 (alongside Better Auth).
