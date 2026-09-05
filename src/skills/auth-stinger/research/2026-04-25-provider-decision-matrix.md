# Auth Provider Decision Matrix (April 2026)

**Sources:**
- https://clerk.com/docs (and pricing page)
- https://www.better-auth.com/docs
- https://authjs.dev
- https://supabase.com/docs/guides/auth
- https://workos.com/docs
- https://stack-auth.com
- https://kinde.com
- https://stytch.com
- 2025-2026 community comparison threads (Better Auth's growth in 2026, Clerk's MAU pricing analysis)

**Retrieved:** 2026-04-25

## Summary

The 2026 auth-provider landscape is mature but actively shifting. Clerk holds the prebuilt-UI / fastest-TTFV slot. Better Auth has eaten significant Auth.js mindshare with a more cohesive plugin model. WorkOS dominates B2B enterprise SSO. Supabase Auth is sticky if you're on Supabase. The remaining providers (Stack Auth, Kinde, Stytch) occupy specific niches.

## Picks per use case

- **B2C SaaS, fastest TTFV, hosted is fine** → Clerk.
- **OSS-by-policy, custom UI, framework-agnostic** → Better Auth.
- **Next.js project with existing Auth.js v4** → migrate to v5 or move to Better Auth (Better Auth wins on 2026 momentum).
- **Already on Supabase** → Supabase Auth + RLS.
- **B2B with SAML / SCIM / multi-IdP** → WorkOS.
- **Clerk DX, want to own data** → Stack Auth.
- **Startup-friendly hosted** → Kinde.
- **Passwordless / passkeys-first, B2B** → Stytch.

## Pricing model summary

- **Clerk**: per-MAU; free tier; pricing scales hard above ~10k MAU.
- **Better Auth**: free OSS; you pay for hosting.
- **Auth.js**: free OSS.
- **Supabase Auth**: bundled with Supabase pricing.
- **WorkOS**: per-organization (per-customer); enterprise-priced.
- **Stack Auth**: free OSS or hosted plans.
- **Kinde**: tiered MAU.
- **Stytch**: tiered.

## What changed in 2026

- Better Auth's plugin model (organizations, passkeys, twoFactor, magic-link as cohesive plugins) attracted devs who'd otherwise have used Auth.js.
- Clerk shipped passkeys broadly; B2B Organizations matured.
- Auth.js v5 stabilized; the v4→v5 migration is real but manageable.
- WorkOS expanded AuthKit (their hosted AuthKit-style sign-in UI).
- Stack Auth gained traction as a Clerk-shaped OSS alternative.

## Relevance

- `guides/01-provider-choice-tree.md`: the decision tree.
- `guides/02-clerk.md`, `guides/03-better-auth.md`, `guides/04-auth-js-nextauth.md`, `guides/05-supabase-auth.md`: per-provider deep dives.
- `templates/provider-comparison-matrix.md`: fillable matrix.
