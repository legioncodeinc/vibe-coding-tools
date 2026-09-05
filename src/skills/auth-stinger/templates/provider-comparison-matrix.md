# Provider Comparison Matrix

Fill in for the project. Date the decision. Cite the chosen provider against the row that picks it.

**Project:** _____
**Decision date:** _____
**Decided by:** _____

## Constraints (fill first)

- B2C / B2B / both: _____
- Hosted-OK / self-host-required: _____
- Prebuilt-UI / custom-required: _____
- Jurisdiction: _____
- Expected MAU at 12 months: _____
- Required IdPs: _____
- Required features: _____ (e.g., MFA, passkeys, magic links, SAML, SCIM, Orgs)

## Matrix

| Provider | B2C | B2B SSO | Hosted | OSS / self-host | Prebuilt UI | Pricing model | Pick if... | Disqualified because... |
|---|---|---|---|---|---|---|---|---|
| **Clerk** | Yes | Orgs + SAML add-on | Yes | No | Best-in-class | Per-MAU | Fastest TTFV; B2C; Next.js | _____ |
| **Better Auth** | Yes | Plugin | No | Yes (MIT) | Headless | Free OSS | Custom UI; OSS-by-policy | _____ |
| **Auth.js (NextAuth) v5** | Yes | Plugin | No | Yes | Headless | Free OSS | Next.js; existing knowledge | _____ |
| **Supabase Auth** | Yes | SAML (Pro) | Yes (Supabase) | Yes (self-host) | Auth UI lib | Bundled with Supabase | Already on Supabase | _____ |
| **WorkOS** | Limited | Best-in-class | Yes | No | AuthKit | Per-org | B2B with enterprise SSO | _____ |
| **Stack Auth** | Yes | Yes | Yes / self-host | Yes (MIT) | Yes | Free OSS or hosted | Clerk DX, own data | _____ |
| **Kinde** | Yes | Yes | Yes | No | Yes | Tiered MAU | Startup-friendly hosted | _____ |
| **Stytch** | Yes | B2B SDK | Yes | No | Yes | Tiered | Passwordless / passkey-first | _____ |

## Decision

**Chosen provider:** _____

**Rationale (one paragraph):** _____

**Named alternative if [constraint] shifts:** _____

## Next-step tasks

- [ ] Provider account creation
- [ ] OAuth client config (per `guides/06-google-oauth.md` if Google)
- [ ] Callback URLs registered (dev / preview / staging / prod)
- [ ] Env vars sourced from secret manager
- [ ] Schema requirements flagged for `db-worker-bee`
- [ ] React `<SignIn />` integration flagged for `react-worker-bee`
- [ ] Webhook secret + signature verification
- [ ] Health check (for unused-client deletion if Google)
