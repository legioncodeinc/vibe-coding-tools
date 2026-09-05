# 01: Provider Choice Tree

The 2026 decision tree. Pick on three axes: **B2C vs B2B**, **hosted vs self-host**, **prebuilt UI vs custom**.

Source: `research/2026-04-25-provider-decision-matrix.md`, `research/2026-04-25-better-auth-momentum.md`.

## The decision tree

Walk in this order. Stop at the first match.

1. **Already on Supabase?** → **Supabase Auth**. RLS pairs with the auth flow; running a second provider against a Supabase DB is friction. See `guides/05-supabase-auth.md`.
2. **Enterprise B2B with SAML / SCIM / multi-IdP?** → **WorkOS**. Purpose-built for SSO; one API, dozens of IdPs (Okta, Azure AD / Entra, Google Workspace, OneLogin). See `templates/provider-comparison-matrix.md` row "Enterprise SSO".
3. **You want to own the data, ship custom UI, run self-host?** → **Better Auth** (OSS, framework-agnostic, momentum in 2026) or **Auth.js v5** (Next.js-native OSS, larger ecosystem). See `guides/03-better-auth.md` and `guides/04-auth-js-nextauth.md`.
4. **You want zero auth UI work, hosted, B2C-leaning, fastest TTFV?** → **Clerk**. Best prebuilt UX, built-in user management, organizations, and B2B basics. Pay-per-MAU pricing. See `guides/02-clerk.md`.
5. **Passwordless-first, B2B, want a hosted backend without Clerk's pricing?** → **Stytch** or **Kinde**. Stytch leads on passwordless / passkeys; Kinde on startup-friendly pricing.
6. **Stack Auth?** Open-source Clerk alternative: same UX shape, self-hostable. Use when you want Clerk-style DX but need to own the data.

## The three axes

### B2C vs B2B

- **B2C** (consumer SaaS, e-commerce): social login matters most; email/password is table stakes; passkeys are increasingly expected. Clerk, Better Auth, Supabase Auth, Auth.js all fit.
- **B2B** (sells to companies): SSO via SAML, SCIM provisioning, organization model, role assignment per tenant. WorkOS dominates here; Clerk has B2B mode; Better Auth has plugins; Stytch B2B is purpose-built.

### Hosted vs self-host

- **Hosted**: provider owns the backend (Clerk, WorkOS, Stytch, Kinde, Auth0). Trade vendor lock-in for fastest TTFV.
- **Self-host**: your runtime owns the auth logic (Better Auth, Auth.js, Supabase Auth on Supabase, Stack Auth, Ory Kratos). You own the data; you also own the operational burden.

### Prebuilt UI vs custom

- **Prebuilt UI**: Clerk's `<SignIn />` / `<UserProfile />` / `<OrganizationSwitcher />`, WorkOS AuthKit, Stack Auth's prebuilt components. Pixel-customizable but bound to provider conventions.
- **Custom UI**: Better Auth and Auth.js give you headless primitives; you ship your own form. Best when the brand demands it or when designers own the surface.

## The matrix

| Provider | B2C | B2B SSO | Hosted | OSS / self-host | Prebuilt UI | 2026 momentum | Best for |
|---|---|---|---|---|---|---|---|
| **Clerk** | Yes | Yes (Orgs + SAML add-on) | Yes | No | Best-in-class | Steady | Fastest TTFV; B2C SaaS |
| **Better Auth** | Yes | Plugin | No | Yes (MIT) | Headless | Hot | Custom UI; OSS-by-policy teams |
| **Auth.js (NextAuth)** | Yes | Plugin | No | Yes | Headless | Steady | Next.js default; many providers |
| **Supabase Auth** | Yes | SAML (Pro) | Yes (Supabase) | Yes (self-host) | Auth UI lib | Steady | Already on Supabase |
| **WorkOS** | Limited | Best-in-class | Yes | No | AuthKit | Strong (B2B) | B2B with enterprise SSO |
| **Stack Auth** | Yes | Yes | Yes (or self-host) | Yes (MIT) | Yes | Hot | Clerk DX, want to own data |
| **Kinde** | Yes | Yes | Yes | No | Yes | Steady | Startup-friendly hosted |
| **Stytch** | Yes (passwordless-first) | B2B SDK | Yes | No | Yes | Strong | Passwordless / passkeys-first |

Cite this matrix when justifying a pick. Source: `research/2026-04-25-provider-decision-matrix.md`.

## Common mismatches

- **"We're a startup, default to Auth0."**: Often wrong in 2026. Auth0 priced for enterprise; Clerk, Kinde, or Better Auth are usually a better fit at startup scale.
- **"NextAuth because Next.js."**: Auth.js v5 is fine; just confirm v5 specifically (v4 → v5 is a real migration). Better Auth competes hard for the same slot in 2026 with cleaner DX.
- **"Supabase Auth on a non-Supabase DB."**: Self-hosting Supabase Auth (GoTrue) outside Supabase Cloud is supported but uncommon; Better Auth or Auth.js is usually a smoother self-host path.
- **"WorkOS for B2C."**: WorkOS shines on enterprise SSO; if your buyers don't ask for SAML, you're paying for unused weight. Clerk or Better Auth is the smaller fit.

## Output

After walking the tree:

1. Name the provider chosen and the tree branch that picked it (e.g., "WorkOS, branch 2: enterprise B2B with SAML / SCIM").
2. Name one alternative and the constraint that would shift the pick (e.g., "If we drop the SCIM requirement, Clerk is cheaper and ships UI faster").
3. List the next-step tasks (provider account setup, OAuth client, callback URL, env vars, schema requirements), and flag the schema requirements for `db-worker-bee`.
