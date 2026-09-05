# Google OAuth Verification: Real-World Journey

**Sources:**
- https://medium.com/@info.brightconstruct/the-real-oauth-journey-getting-a-google-workspace-add-on-verified-fc31bc4c9858
- https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance
- https://developers.google.com/identity/protocols/oauth2/policies

**Retrieved:** 2026-04-25

## Summary

Google's OAuth verification process for sensitive and restricted scopes is multi-week minimum. Real-world reports describe 2-6 weeks for sensitive scopes, 3-6 months for restricted with CASA. Reviewer feedback iterates; demos and privacy policies often need rework.

## What gets reviewed

- Brand consistency (consent screen ↔ app ↔ marketing).
- Domain ownership (Search Console).
- Privacy policy: explicit mention of Google data, retention, sharing.
- Per-scope justification.
- Demo video showing each scope's data being used in-app, with full URL bar visible.
- For restricted: CASA assessment by Google-approved third-party assessor (annual).

## Common failures (real-world)

- Demo video missing scope coverage: e.g., `gmail.readonly` requested, video doesn't show Gmail data being read.
- Privacy policy too generic: doesn't enumerate Google data types.
- Logo with text or transparency: re-submission required.
- Domain not verified or DNS lag.
- Scope-creep across multiple submissions: each new scope re-triggers review.

## Cost

- CASA assessor cost: USD $5k-$75k+ depending on scope of assessment. Annual.
- Internal cost: ~40-80 engineer hours per cycle, often including a UX revision and a security re-architecture.

## Why this matters

- Plan launch dates around verification timeline, not the other way.
- Bundle scopes once if possible; re-verification on incremental scope adds is expensive.
- Sensitive vs restricted matters: `gmail.readonly` (sensitive) is far cheaper than `gmail.modify` (restricted).

## Relevance

- `guides/07-google-oauth-verification.md`: full process.
- `guides/06-google-oauth.md`: scope tiers.
- `templates/scope-justification-template.md`: per-scope justification.
