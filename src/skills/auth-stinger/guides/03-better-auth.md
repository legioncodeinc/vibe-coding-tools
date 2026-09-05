# 03: Better Auth

OSS, framework-agnostic, MIT-licensed. The 2026 momentum pick when you want full control without paying for a hosted provider.

Source: `research/2026-04-25-better-auth-momentum.md`, https://www.better-auth.com/docs.

## When Better Auth wins

- You want to **own the data** end-to-end (users, sessions, accounts, MFA factors all in your DB).
- You want **headless primitives**: your design system renders the form.
- You're framework-agnostic or working in something other than Next.js (SvelteKit, Nuxt, Remix, Hono, plain Express).
- You want a path that scales without per-MAU pricing.
- You want a single config object with everything wired (email / password, social, magic link, passkeys, MFA, organizations, RBAC).

## When Better Auth loses

- You want zero auth UI work: Clerk's prebuilt UI ships in an afternoon; Better Auth makes you build the UI.
- You want a SaaS support contract for auth: Better Auth is OSS; community-supported.
- Enterprise SSO (SAML at multiple IdPs): possible via plugin, but WorkOS is purpose-built.

## Integration shape

```ts
// lib/auth.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true, requireEmailVerification: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    // organizations(), passkey(), twoFactor(), magicLink({ ... })
  ],
  trustedOrigins: ['https://app.example.com'],
});
```

```ts
// app/api/auth/[...all]/route.ts (Next.js App Router)
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
export const { GET, POST } = toNextJsHandler(auth);
```

```ts
// Server-side session check
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const session = await auth.api.getSession({ headers: headers() });
if (!session) redirect('/sign-in');
```

## Schema requirements (flag for db-worker-bee)

Better Auth ships migrations for: `user`, `session`, `account`, `verification`. Plugins add: `organization`, `member`, `invitation`, `twoFactor`, `passkey`. Source the schema from the Better Auth CLI and hand it to `db-worker-bee`:

```bash
npx @better-auth/cli@latest generate
```

`db-worker-bee` owns: indexing strategy, RLS policies if multi-tenant, ON DELETE behavior on FKs, partition strategy at scale.

## Critical config

- **`trustedOrigins`**: list of origins allowed to use the auth API. Without this, CSRF on cross-origin POSTs is wide open. Cite https://www.better-auth.com/docs/concepts/security.
- **Email verification**: `requireEmailVerification: true` for credentials flow. Otherwise account-takeover via typo'd email is trivial.
- **Cookie config**: Better Auth ships secure defaults; verify with `scripts/cookie-attribute-checker.ts`.
- **Secret key**: `BETTER_AUTH_SECRET` (a random 32+ byte string). Used for signing. Rotate via key rolling, not in-place replacement.

## Plugin highlights

- **`organization()`**: multi-tenant orgs with roles. Pair with `guides/09-rbac.md`.
- **`twoFactor()`**: TOTP enrollment, recovery codes generated automatically.
- **`passkey()`**: WebAuthn / passkeys, conditional UI.
- **`magicLink({ sendMagicLink })`**: wire to your email provider; one-time tokens with short TTL.
- **`admin()`**: admin user impersonation, ban/unban; extreme power, audit-log every call.

## Migration: Auth.js v4 / v5 → Better Auth

The most common 2026 migration. Better Auth's data model is similar to Auth.js's but not identical. Plan:

1. **Inventory**: enumerate Auth.js providers, callbacks, custom adapters, session strategy.
2. **Schema diff**: Auth.js's `users`/`sessions`/`accounts`/`verification_tokens` map cleanly; rename if needed.
3. **Dual-write window**: run both for a release; new sessions issued by Better Auth, old sessions still honored.
4. **Cutover**: stop issuing Auth.js sessions; expire remaining within session TTL.

No forced re-login if the social-account linkage (`provider` + `providerAccountId`) is preserved.

## Common pitfalls

- **Skipping `trustedOrigins`**: silent CSRF in dev, becomes an audit finding in prod.
- **Forgetting to verify the email** in credentials mode, see above.
- **Storing `userId` as the only foreign key on tenant resources without RLS**: single-layer enforcement. See `guides/09-rbac.md`.
- **Custom social provider config that omits PKCE**: OAuth 2.1 expects PKCE on auth-code flow even with a client secret.

## Audit handoff

Decisions to flag for `security-worker-bee`:

- The `BETTER_AUTH_SECRET` rotation strategy.
- The `trustedOrigins` list (must match deployed origins exactly).
- The session cookie attributes vs `templates/session-cookie-config.ts`.
- The `users` schema decisions (handed to `db-worker-bee` first).
- The 2FA enrollment + recovery code generation policy.
