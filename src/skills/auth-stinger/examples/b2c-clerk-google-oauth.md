# Example: B2C SaaS with Clerk + Google OAuth

A worked end-to-end example: Next.js App Router B2C SaaS, Clerk for auth, Google sign-in (production-mode external, sign-in-only scopes).

## Constraints

- **Stack**: Next.js 15, App Router, React 19, Postgres + Prisma.
- **Audience**: B2C, public sign-up, expecting 5k MAU year 1.
- **UX**: prebuilt UI is fine; brand customization within Clerk's theming.
- **Scopes**: `openid email profile` only: no Google data access.

## Provider decision

Walk `guides/01-provider-choice-tree.md`:

- Already on Supabase? No.
- Enterprise B2B with SAML? No.
- Want zero auth UI work, hosted, B2C-leaning, fastest TTFV? **Yes → Clerk.**

Named alternative if MAU exceeds 50k and pricing becomes a problem: **Better Auth** (per `guides/03-better-auth.md`).

## Implementation manifest

### 1. Clerk project

- Create Clerk app in `clerk.com` dashboard.
- Enable email + password, Google.
- Configure Organization model: not enabled (B2C, no orgs).
- Webhook secret: generate; will wire to `/api/webhooks/clerk`.

### 2. Google OAuth client

Per `guides/06-google-oauth.md`:

- Google Cloud project, OAuth consent screen → Branding (app name, logo, support email, privacy policy URL, terms URL, homepage URL).
- Audience: External + Production.
- Data Access: scopes `openid email profile` only: no sensitive scopes, no verification needed beyond branding.
- OAuth client (Web application):
  - Authorized JS origins: `https://app.example.com`, `https://staging.example.com`.
  - Authorized redirect URIs: Clerk-provided (`https://clerk.example.com/v1/oauth_callback` or similar, copy from Clerk dashboard exactly).
- Domain verification via Search Console.
- **Unused-client deletion defense**: schedule a weekly synthetic call. Production-critical client.
- Paste `client_id` + `client_secret` into Clerk Dashboard → Social Connections → Google.

Fill `templates/google-oauth-consent-screen-checklist.md`. Fill `templates/scope-justification-template.md` (short, since only `openid email profile`).

### 3. Next.js wiring

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/protected/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] };
```

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en"><body>{children}</body></html>
    </ClerkProvider>
  );
}
```

```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';
export default function Page() { return <SignIn />; }
```

The `<SignIn />` JSX placement and theming is `react-worker-bee`'s territory; auth-worker-bee writes the spec ("centered on a card with logo top, social-buttons-first ordering, brand color from token `--color-primary`") and `react-worker-bee` writes the layout.

### 4. Database sync via webhook

```ts
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: any;
  try { evt = wh.verify(payload, headers); }
  catch { return new Response('bad signature', { status: 400 }); }

  if (evt.type === 'user.created') {
    await prisma.user.create({
      data: {
        clerk_id: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address,
        name: [evt.data.first_name, evt.data.last_name].filter(Boolean).join(' '),
      },
    });
  }
  // user.updated, user.deleted, session.created, etc.
  return new Response('ok');
}
```

The `users` schema is **flagged for `db-worker-bee`**. auth-worker-bee doesn't write the migration.

### 5. Server-side session check

```ts
// app/dashboard/page.tsx (Server Component)
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  // ... fetch tenant data
}
```

### 6. RBAC

Not needed for v1 (B2C, no orgs). When user-tier features arrive, store `subscription_tier` on the `users` row in our DB; enforce in middleware AND in queries (`guides/09-rbac.md` two-layer rule).

### 7. MFA

Enable in Clerk Dashboard → User & Authentication → Multi-factor. Default: TOTP + backup codes. Passkey support is in Clerk; enable it.

### 8. Session config

Clerk handles cookies. Run `scripts/cookie-attribute-checker.ts` against the sign-in URL to confirm:

- `HttpOnly`: pass
- `Secure`: pass
- `SameSite=Lax`: pass

## Audit handoff

Filled `templates/audit-report-template.md` with:

- Provider decision and rationale.
- Implementation manifest (above).
- Scope inventory (`openid email profile`, justified, used).
- Failure-mode check-list: pass for OAuth-specific (Clerk handles `state`, `nonce`, ID-token verification correctly), pass for session attributes.
- Items handed to `db-worker-bee` (schema), `react-worker-bee` (UI), `quality-worker-bee` (post-implementation QA).
- Items flagged for `security-worker-bee`: webhook signature verification config, the unused-client-deletion synthetic-call schedule.

## Operational followups

- Weekly synthetic call: GitHub Action that hits `https://oauth2.googleapis.com/tokeninfo` with the production `client_id`. Cite `guides/06-google-oauth.md`.
- Quarterly runbook review: confirm `client_id` shows recent usage; confirm scopes still match code (run `scripts/validate-oauth-scopes.ts`).
