# Open Questions

Tracked for future Stinger refresh.

## Provider landscape

- **Better Auth's plugin ecosystem trajectory**: is it sustainable? Track 6-12 months out.
- **Stack Auth maturity**: gaining traction; does it become the OSS Clerk?
- **Auth0 / Okta CIC fit in 2026**: once dominant, less common in modern starter stacks. When does Auth0 win in 2026? (Probably: legacy enterprise migrations, Okta-bundled customers.)
- **Frontegg, Logto, Hanko**: adjacent providers worth a future row in the matrix.

## Google OAuth

- **CASA assessor pricing trends**: is third-party security assessment cost trending up or down? (As of 2026: still steeply variable, $5k-$75k+.)
- **OAuth client deletion enforcement variance**: is the 6-month threshold strict, or are there grace periods for verified apps? Behavior may evolve.
- **Cross-Account Protection (RISC) adoption**: is anyone besides Google + Microsoft + Adobe really subscribing? Track 12 months.

## Standards

- **OAuth 2.1 ratification**: currently draft. When stable, update guides to cite RFC number directly.
- **WebAuthn Level 4**: under discussion. Track for changes to attestation, conditional UI semantics.
- **Passkey provider portability**: Google, Apple, Microsoft passkey sync vs cross-vendor portability. Evolving fast.

## Stinger scope

- **React Native / mobile auth**: currently out of scope; high-level only. Should we forge a `mobile-auth-stinger` if mobile-first projects become a frequent user request?
- **CLI auth (Device Flow, OAuth 2.0 Device Authorization Grant)**: covered briefly; deserves a dedicated guide if requested.
- **Identity federation between SaaS apps**: emerging pattern (Okta-managed identities consumed by sub-SaaS). Track.
