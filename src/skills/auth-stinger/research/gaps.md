# Gaps

Known limitations of v1 of auth-stinger.

## Coverage gaps

- **Mobile-native auth flows**: App Auth for iOS / Android is referenced but not deeply covered. Mobile keystore APIs, biometric prompts, deep-link callback handling.
- **Device Flow / OAuth 2.0 Device Authorization Grant**: used for CLIs and TVs. Briefly mentioned; no dedicated guide.
- **Federated identity between SaaS apps** (e.g., Okta-managed user consumed by your SaaS, then re-emitted to a sub-SaaS): not covered.
- **PASETO** as a JWT alternative: not covered. Smaller adoption; revisit.
- **Self-hosted IdP** (Keycloak, Ory Kratos, Authentik): referenced as out-of-scope for v1; recommended only when constraints demand.

## Provider gaps

- **Auth0 / Okta CIC**: listed but not given a dedicated guide. If user demand materializes, add `guides/12-auth0.md`.
- **Frontegg, Logto, Hanko, Descope**: known players, not in the matrix yet.
- **Firebase Auth**: common in mobile; not covered. Adjacent to Supabase Auth but distinct.

## Topic gaps

- **JWT key rotation / JWKS rollover**: referenced, not deeply covered.
- **OAuth audit log retention requirements** (SOC 2, HIPAA, GDPR): `security-worker-bee` territory; auth-worker-bee flags.
- **Step-up auth UX patterns**: covered conceptually; UI patterns deferred to `react-worker-bee` and `ux-ui-svelte-worker-bee`.

## Tooling gaps

- No automated check for two-layer enforcement (middleware + data-layer). Hard to lint deterministically; manual audit via `templates/audit-report-template.md`.
- No automated CSRF defense audit. Partial via `scripts/cookie-attribute-checker.ts`.

## Update cadence

This Stinger should refresh:

- **Quarterly**: provider landscape, scope policies, deletion-policy thresholds.
- **On release**: WebAuthn Level updates, OAuth 2.1 finalization, major provider feature drops.
- **Annually**: re-walk the decision tree against current pricing and feature matrices.
