# 04: Auth.js (formerly NextAuth)

OSS, Next.js-native, the long-time default. v5 (formerly NextAuth.js v5) is the version to use in 2026.

Source: `research/2026-04-25-authjs-v5-status.md`, https://authjs.dev.

## When Auth.js wins

- Next.js project where you want OSS auth and the team already knows the library.
- A wide range of OAuth providers (50+): almost any social IdP has a built-in Auth.js provider config.
- You want the lowest-friction integration with `next-auth/middleware` and Server Components.
- You want a path you can self-host without paying anyone.

## When Auth.js loses

- **DX gap vs Better Auth in 2026.** Better Auth ships a more cohesive plugin model (orgs, MFA, passkeys built-in) where Auth.js still has a sprawling adapter / provider matrix.
- **You want a non-Next.js framework**: Auth.js core is framework-agnostic but the polished surface is Next.js. SvelteKit / SolidStart support is real but lags.
- **You want prebuilt UI**: Auth.js is headless. Reach for Clerk or AuthKit (WorkOS).

## Integration shape (v5, App Router)

```ts
// auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'database' }, // or 'jwt' — see decision below
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
```

```ts
// app/api/auth/[...nextauth]/route.ts
export { GET, POST } from '@/auth';
```

```ts
// middleware.ts
export { auth as middleware } from '@/auth';
```

```tsx
// Server Component
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  if (!session) redirect('/sign-in');
  return <Dashboard userId={session.user.id} />;
}
```

## Session strategy decision: `database` vs `jwt`

| | `database` | `jwt` |
|---|---|---|
| Storage | session row in DB | signed cookie |
| Revocation | delete the row | impossible without a deny-list |
| Refresh | extend TTL on use | re-issue on use |
| Cross-region cost | DB read on every request | none |
| Default | for most apps | only when you must avoid the DB read |

**Default to `database`.** Revocation matters more than the saved DB read for most apps. JWT-only sessions force you to choose between long TTLs (dangerous) and short TTLs (UX) with no graceful logout-everywhere. See `guides/10-session-storage.md`.

## v4 → v5 migration

Real migration, not a name change. Notable shifts:

- Single `auth.ts` file replaces `[...nextauth]/route.ts` config inline.
- `getServerSession()` → `auth()`.
- Middleware is now just `export { auth as middleware }`.
- Provider configs reshape (e.g., scope on `Google` provider).
- Adapter API: most adapters updated; check the version compatibility table.

Cite https://authjs.dev/getting-started/migrating-to-v5 for the canonical migration steps. Don't pretend it's a no-op.

## Critical config

- **`AUTH_SECRET`**: required in v5 (env var renamed from `NEXTAUTH_SECRET`). Random 32+ byte string.
- **`AUTH_TRUST_HOST`**: required when running behind a reverse proxy (Vercel sets this implicitly; self-host needs it).
- **`AUTH_URL`**: only required for non-Vercel deployments and dev tunnels.
- **`callbacks.signIn`**: runs every sign-in; use to enforce email-domain allowlists, ban lists, MFA gates.
- **`events.linkAccount`**: fire on account linking; useful for tracking the `external_accounts` row.

## Common pitfalls

- **Migrating v4 → v5 without reading the migration guide**: half the config moves and half stays.
- **`session: { strategy: 'jwt' }` by default reasoning**: Auth.js's docs lean toward JWT; it is *not* the right default for most apps. Pick deliberately per the table above.
- **Trusting `session.user.email` for authorization**: emails are user-mutable; key on `user.id` (a stable `cuid` / `uuid`).
- **No CSRF protection on credentials provider**: Auth.js builds in a CSRF token; if you're sidestepping the framework's form submission, you've sidestepped the protection. Don't.
- **Forgetting `trustHost` behind a proxy**: login redirects break in subtle ways.

## Migration: Auth.js → Better Auth or Clerk

- **To Better Auth**: see `guides/03-better-auth.md` §"Migration".
- **To Clerk**: export users via Auth.js's DB; import via Clerk's User Import. Keep same Google OAuth client to avoid re-consent. Force-reset for credentials users.

## Audit handoff

Decisions to flag for `security-worker-bee`:

- The session strategy choice (`database` vs `jwt`) and the rationale.
- `AUTH_SECRET` rotation strategy.
- The `signIn` callback enforcement rules (allowlist, ban list, MFA gate).
- The Google OAuth client config (per `guides/06-google-oauth.md`).
- Whether `linkAccount` events are wired to your audit log.
