# Google OAuth Scopes & Policies

**Sources:**
- https://developers.google.com/identity/protocols/oauth2/scopes
- https://developers.google.com/identity/protocols/oauth2/policies
- https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance
- https://developers.google.com/workspace/guides/configure-oauth-consent

**Retrieved:** 2026-04-25

## Summary

Google OAuth scopes are tiered: non-sensitive, sensitive, restricted. Each tier carries an escalating verification cost. Production-mode external apps requesting sensitive scopes need verification; restricted scopes additionally need an annual independent CASA security assessment.

## Tiers

- **Non-sensitive**: identity-only scopes. `openid`, `email`, `profile`, `userinfo.email`, `userinfo.profile`. No verification needed for sign-in-only apps.
- **Sensitive**: most Workspace data scopes (`calendar`, `gmail.readonly`, `drive.metadata.readonly`, `tasks`, etc.). Verification required when External + Production. Process: app review including demo video, branding review, privacy policy review.
- **Restricted**: high-power Workspace data scopes (`gmail.modify`, `drive`, `gmail.send`, `https://mail.google.com/`, `gmail.metadata`). Verification + annual independent CASA security assessment.

## Google Auth Platform pages

- **Branding**: app name, logo, support email, homepage URL, privacy policy URL, terms URL, authorized domains.
- **Audience**: Internal (Workspace) vs External; if External, Testing (≤100 test users) vs Production.
- **Data Access**: scope list. Add minimum scope required.

## Policy compliance (Production)

Apps must comply with Google API Services User Data Policy:

- Privacy policy reachable, mentions Google user data.
- Limited use: don't transfer data except as needed for the user-facing feature.
- Don't use Google data for ads.
- Don't allow humans to read Google data except: (a) with explicit consent, (b) for security, (c) to comply with law, (d) for sysadmin tasks like aggregated stats.

## Relevance to this stinger

- `guides/06-google-oauth.md`: full deep dive.
- `guides/07-google-oauth-verification.md`: verification process.
- `templates/scope-justification-template.md`: per-scope justification table.
- `templates/google-oauth-consent-screen-checklist.md`: pre-submission checklist.
