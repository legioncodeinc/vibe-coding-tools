# Example: B2B SaaS with WorkOS SSO

A worked end-to-end example: B2B SaaS, enterprise customers, SAML / OIDC / Microsoft Entra integration, SCIM provisioning. WorkOS owns the IdP federation layer.

## Constraints

- **Stack**: Next.js 15, App Router, Postgres + Prisma.
- **Audience**: B2B; sells to enterprise; expects multiple IdPs per customer.
- **Required**: SAML, OIDC, SCIM, organizations, roles per org.
- **Pricing**: per-organization is fine.

## Provider decision

Walk `guides/01-provider-choice-tree.md`:

- Already on Supabase? No.
- Enterprise B2B with SAML / SCIM / multi-IdP? **Yes → WorkOS.**

Named alternative if SCIM requirement is dropped: **Clerk** with B2B mode (cheaper, faster TTFV, but weaker enterprise SSO matrix).

## Implementation manifest

### 1. WorkOS project

- WorkOS dashboard → create project.
- AuthKit configuration: enable email + password (for non-SSO users), Google, Microsoft, GitHub.
- Connections: turn on SAML, OIDC, Magic Link.
- Each customer gets an Organization in WorkOS; each Organization has one or more Connections (their IdP).

### 2. Next.js wiring

```ts
// lib/workos.ts
import { WorkOS } from '@workos-inc/node';
export const workos = new WorkOS(process.env.WORKOS_API_KEY!);
export const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID!;
```

```ts
// app/auth/login/route.ts — initiate SSO via AuthKit
import { workos, WORKOS_CLIENT_ID } from '@/lib/workos';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const organizationId = url.searchParams.get('org'); // optional org hint
  const authUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    clientId: WORKOS_CLIENT_ID,
    redirectUri: 'https://app.example.com/auth/callback',
    organizationId: organizationId ?? undefined,
    state: crypto.randomUUID(),
  });
  return NextResponse.redirect(authUrl);
}
```

```ts
// app/auth/callback/route.ts
import { workos, WORKOS_CLIENT_ID } from '@/lib/workos';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (!code) return new NextResponse('missing code', { status: 400 });

  const { user, organizationId, accessToken, refreshToken } =
    await workos.userManagement.authenticateWithCode({ code, clientId: WORKOS_CLIENT_ID });

  // Establish OUR session — opaque ID, server-side store.
  const sessionId = await createSession({
    userId: user.id,
    organizationId,
    accessToken,
    refreshToken,
  });

  const c = await cookies();
  c.set('__Host-session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return NextResponse.redirect(new URL('/dashboard', url));
}
```

Cite `templates/session-cookie-config.ts` and `guides/10-session-storage.md`.

### 3. SCIM provisioning

WorkOS handles SCIM (Directory Sync): when a customer's IdP provisions a user, WorkOS calls our webhook. Wire it:

```ts
// app/api/webhooks/workos/route.ts
import { workos } from '@/lib/workos';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const sig = req.headers.get('workos-signature');
  const body = await req.text();
  if (!workos.webhooks.verifySignature({ signature: sig!, payload: body, secret: process.env.WORKOS_WEBHOOK_SECRET! })) {
    return new Response('bad signature', { status: 400 });
  }
  const evt = JSON.parse(body);
  switch (evt.event) {
    case 'dsync.user.created':
      await prisma.user.create({ data: { workos_id: evt.data.id, email: evt.data.emails[0].value, organization_id: evt.data.organization_id } });
      break;
    case 'dsync.user.deleted':
      await prisma.user.update({ where: { workos_id: evt.data.id }, data: { deactivated_at: new Date() } });
      break;
    // dsync.user.updated, dsync.group.user_added, dsync.group.user_removed, ...
  }
  return new Response('ok');
}
```

Schema: `users` + `organizations` + `user_organizations(user_id, organization_id, role)`, flagged for `db-worker-bee`.

### 4. RBAC

Per `guides/09-rbac.md` and `templates/rbac-policy-table.md`:

- Roles: `owner`, `admin`, `editor`, `viewer`.
- Two-layer enforcement:
  - Middleware: `requireRole('admin')` on admin routes.
  - Data layer: every query filters by `organization_id IN (user's orgs)`.
- Cross-tenant test cases added.

### 5. Session

`__Host-session` cookie, opaque, 30-day Max-Age, idle timeout 30 min enforced server-side. Refresh token from WorkOS rotated on every access-token refresh.

### 6. MFA

WorkOS handles MFA at the IdP for SAML / OIDC users. For email + password users, enable WorkOS's MFA module: TOTP + recovery codes.

## Audit handoff

Filled `templates/audit-report-template.md` with:

- Provider decision (WorkOS, B2B SSO + SCIM).
- Implementation manifest.
- Scope inventory: AuthKit handles scopes for connected IdPs; we only consume the user identity claim.
- Failure-mode check-list: pass on OAuth-specific; pass on session attributes.
- Items handed to `db-worker-bee`: `users`, `organizations`, `user_organizations`, `sessions` schema; RLS by `organization_id`.
- Items handed to `react-worker-bee`: `<OrgSwitcher />`, `<RolePill />` UI components.
- Items flagged for `security-worker-bee`: webhook signature verification, refresh-token rotation, two-layer enforcement audit.

## Operational followups

- Quarterly: review the per-customer Connection list in WorkOS dashboard. Stale connections from churned customers should be deactivated.
- For each customer's IdP onboarding: WorkOS provides a Connection setup link; document in the customer playbook.
- SCIM webhook reliability: monitor failures; WorkOS retries, but persistent failures mean drift between IdP truth and our DB.
