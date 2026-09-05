# 02: Clerk

Hosted, prebuilt UI, B2C-leaning, with Organizations for B2B basics. Best DX in the 2026 hosted-provider space.

Source: `research/2026-04-25-provider-decision-matrix.md`, https://clerk.com/docs.

## When Clerk wins

- B2C SaaS that wants users live in days, not weeks.
- A team that doesn't want to author `<SignIn />` / `<UserProfile />` / `<OrganizationSwitcher />`.
- Multi-tenancy via Clerk Organizations (no SCIM required, no SAML required).
- Next.js (the integration is first-class via `@clerk/nextjs`); also strong on Remix, Expo, Astro.
- "We need passkeys, social, email/password, magic links, MFA, yesterday."

## When Clerk loses

- **Pricing scales with MAU.** At sustained scale (>10k MAU), the bill becomes a board-level conversation. Run the math against an OSS path before locking in.
- **Custom UI past the customizer.** Clerk components are theme-able to a point; if your brand requires deeply custom auth flows, headless (Better Auth / Auth.js) wins.
- **Heavy B2B with SCIM / multi-IdP enterprise SSO.** Clerk's B2B mode is good for SMB-B2B; for true enterprise SSO with SAML + SCIM at multiple IdPs, WorkOS is the more direct fit.
- **OSS-by-policy environments** (regulated, data-residency-strict): vendor-hosted is a non-starter.

## The integration shape (Next.js App Router)

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/(.*)']);

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

The `<SignIn />` JSX placement and styling is `react-worker-bee`'s territory. auth-worker-bee owns the middleware, route protection, and webhook integration.

## Critical config

- **Environment**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`. Never commit. Source via secret manager.
- **Webhook secret**: `CLERK_WEBHOOK_SECRET`. Verify every webhook with `svix` before trusting. Webhooks fire `user.created`, `user.updated`, `session.created`; wire them to your DB so the `users` table reflects Clerk truth. Schema design lives with `db-worker-bee`.
- **Session token verification**: server-side, use `auth()` from `@clerk/nextjs/server`. Never trust the JWT from the cookie without verifying.
- **Organizations**: enable in Dashboard → Organizations. Memberships, roles, and invitations come for free. Custom permissions live on the role.

## Google OAuth via Clerk

Clerk delegates Google OAuth to your own Google Cloud project once you exit dev mode (or you can use Clerk's shared dev OAuth client for prototyping only). Once on production: configure your own Google client per `guides/06-google-oauth.md` and paste the `client_id` / `client_secret` into Clerk Dashboard → User & Authentication → Social Connections → Google. The October 2025 unused-client deletion policy still applies. Clerk's dev client is shared and stays alive, but **your production client is yours to keep alive**.

## Common pitfalls

- **`<SignedIn>` / `<SignedOut>` flicker on first paint**: use Server Components for protected routes; reach for the client wrappers only on highly interactive surfaces.
- **Forgetting the webhook to sync `users` table**: your DB drifts from Clerk, foreign keys break. Always wire the webhook on day one.
- **Treating `userId` as the immutable identity**: Clerk does emit `userId` per user, but external lookups (Google ID, GitHub ID) belong on the `external_accounts` rows. Don't conflate.
- **Using `auth()` in a Client Component**: server-only. Use `useAuth()` / `useUser()` on the client side.

## Migration: Clerk → something else

- Export users via Clerk's User Export (UI / API). Includes email, social account links, MFA enrollments.
- Re-issue passwords is impossible (Clerk hashes them; you can't decrypt). Plan: dual-write window (new provider primary; Clerk still issues sessions for not-yet-migrated users), force-reset on first login post-cutover, OR import via Clerk → target provider migration tooling if available.
- Don't break Google sign-in: keep the same Google OAuth `client_id` (paste into the new provider) so users see no consent re-prompt.

## Audit handoff

Decisions to flag for `security-worker-bee` after Clerk implementation:

- Webhook signature verification configuration.
- Session-token JWT validation on every server route (Clerk handles it via SDK; confirm).
- The Google OAuth client_id / client_secret pairing: confirm the secret lives in Clerk Dashboard, not in the code.
- Org-level role enforcement at the data layer (Clerk roles are useful; per `guides/09-rbac.md` they must be enforced AT the data, not just by middleware).
