# Example: Better Auth from scratch

A worked end-to-end example: greenfield project, OSS-by-policy, custom UI, framework-agnostic auth. Better Auth is the pick.

## Constraints

- **Stack**: Next.js 15 App Router, Postgres + Prisma, custom design system.
- **Audience**: B2B SaaS for an OSS-policy customer base; cannot ship hosted-provider SaaS auth.
- **Required**: email + password, Google OAuth, passkeys, TOTP, organizations with roles.
- **Custom UI**: yes, design system has `<Field>`, `<Button>`, `<Card>` primitives we want to use.

## Provider decision

Walk `guides/01-provider-choice-tree.md`:

- Already on Supabase? No.
- Enterprise B2B with SAML / SCIM at multiple IdPs? Not yet.
- Want to own the data, ship custom UI, run self-host? **Yes → Better Auth** (over Auth.js because of the cohesive plugin model in 2026).

## Implementation manifest

### 1. Install + config

```bash
npm install better-auth
npm install -D @better-auth/cli
```

```ts
// lib/auth.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { passkey } from 'better-auth/plugins/passkey';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { organization } from 'better-auth/plugins/organization';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Wire to email provider. No Bee owns email delivery yet; see the gap list.
      await sendEmail({ to: user.email, subject: 'Reset password', body: url });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    passkey(),
    twoFactor({
      issuer: 'Example App',
      // recovery codes auto-generated at enrollment
    }),
    organization(),
  ],
  trustedOrigins: ['https://app.example.com', 'https://staging.example.com'],
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
});
```

### 2. Schema (flag for db-worker-bee)

```bash
npx @better-auth/cli@latest generate
```

Generates: `user`, `session`, `account`, `verification`, `passkey`, `two_factor`, `organization`, `member`, `invitation` tables. Hand the migration file to `db-worker-bee`. db-worker-bee owns indexing, FK ON DELETE behavior, RLS if needed.

### 3. Mount the API

```ts
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
export const { GET, POST } = toNextJsHandler(auth);
```

### 4. Google OAuth client

Per `guides/06-google-oauth.md`:

- Cloud Console → OAuth consent screen → Branding (full).
- Audience: External + Production.
- Scopes: `openid email profile` only.
- OAuth client (Web application):
  - Authorized JS origins: `https://app.example.com`, `http://localhost:3000`.
  - Authorized redirect URIs: `https://app.example.com/api/auth/callback/google`, `http://localhost:3000/api/auth/callback/google`.
- Domain verification via Search Console.
- Synthetic monthly call configured.

Fill `templates/google-oauth-consent-screen-checklist.md`.

### 5. Custom UI (spec for react-worker-bee)

auth-worker-bee writes the spec, react-worker-bee implements:

```
SignInPage spec
- Centered card, max-width 400px.
- Logo top, 48px high.
- Heading: "Sign in to Example".
- Social row: Google button (uses our <Button variant="outline">).
- Divider: "or continue with email".
- Email field (<Field type="email">), Password field (<Field type="password">).
- "Sign in" button (primary).
- Below: "Forgot password?" link, "Don't have an account? Sign up" link.
- Errors: in-line under fields, red token.
- Loading: button spinner state via React 19 useFormStatus.
```

Better Auth client SDK:

```ts
'use client';
import { authClient } from '@/lib/auth-client';

export async function handleSignIn(email: string, password: string) {
  const { data, error } = await authClient.signIn.email({ email, password });
  if (error) throw error;
  return data;
}

export async function handleGoogleSignIn() {
  await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
}
```

`react-worker-bee` owns the JSX wiring. auth-worker-bee owns the auth client config and the protocol layer.

### 6. Session check (server-side)

```ts
// app/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');
  return <DashboardClient session={session} />;
}
```

### 7. RBAC (organization plugin)

```ts
// Set role on member
await auth.api.updateMemberRole({
  body: { memberId, role: 'admin', organizationId },
  headers: await headers(),
});
```

Two-layer enforcement per `guides/09-rbac.md`:

- Middleware: check `session.user.role` (set via Better Auth) before admin routes.
- Data layer: every query filters by `organization_id IN (user's orgs)`. RLS at Postgres level, flagged for `db-worker-bee`.

Fill `templates/rbac-policy-table.md`.

### 8. MFA enrollment flow

```ts
// User enables 2FA from settings
const { data } = await authClient.twoFactor.enable({ password: currentPassword });
// data.totpURI → render as QR
// data.backupCodes → SHOW ONCE; user must save
```

Recovery codes are generated by Better Auth automatically and shown to the user. Cite `guides/08-mfa-and-passkeys.md`.

### 9. Passkey enrollment

```ts
await authClient.passkey.addPasskey();
// Browser prompts for biometric / PIN.
```

Conditional UI on sign-in field: supported via plugin.

## Audit handoff

Filled `templates/audit-report-template.md` with:

- Provider: Better Auth (OSS, framework-agnostic).
- Implementation manifest.
- Scope inventory: `openid email profile` for Google.
- Failure-mode check-list: pass on cookie attributes (verified via `scripts/cookie-attribute-checker.ts`), pass on `state` / `nonce` / ID-token verification (Better Auth handles).
- Items handed to `db-worker-bee`: full migration + RLS policies.
- Items handed to `react-worker-bee`: SignInPage / SignUpPage / OrgSwitcher specs.
- Items flagged for `security-worker-bee`:
  - `BETTER_AUTH_SECRET` rotation strategy.
  - `trustedOrigins` list.
  - 2FA recovery code storage (hashed).
  - Cross-tenant test coverage.
  - Google OAuth client unused-deletion defense.

## Operational followups

- Better Auth secret rotation: scheduled annually with key-rolling (issue new secret, dual-validate, retire old).
- Quarterly: run `scripts/validate-oauth-scopes.ts` and `scripts/cookie-attribute-checker.ts`.
- Monitor Google deletion-policy email at `oauth-owner@example.com`.
