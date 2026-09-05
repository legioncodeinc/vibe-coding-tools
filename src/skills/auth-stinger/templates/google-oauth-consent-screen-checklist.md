# Google OAuth Consent Screen Checklist

Fill for every Google OAuth client headed to production. Cite the Google Cloud Console URL (Project → APIs & Services → OAuth consent screen).

**Project name:** _____
**Project number:** _____
**Submission date:** _____

## Branding

- [ ] App name (matches public branding)
- [ ] App logo uploaded (square, ≥120×120, PNG, no transparency, no text)
- [ ] User support email (monitored, not aliased to dev null)
- [ ] Developer contact email (monitored)
- [ ] Application home page URL (reachable, branded, HTTPS)
- [ ] Application privacy policy URL (reachable, mentions Google user data explicitly)
- [ ] Application terms of service URL (reachable)
- [ ] Authorized domain(s) added (every domain in branding fields)

## Audience

- [ ] User type: Internal / External (circle one)
- [ ] If External + Testing: test user emails added (≤100)
- [ ] If External + Production: see "Verification" below

## Scopes (Data Access)

| Scope | Tier | Justification (1-2 sentences) |
|---|---|---|
| `openid` | Non-sensitive | Required for OIDC sign-in |
| `email` | Non-sensitive | Display user email in app |
| `profile` | Non-sensitive | Display user name and avatar |
| _____ | _____ | _____ |

Ship with `templates/scope-justification-template.md` filled per scope.

- [ ] No scope marked "we might use this later": every scope is in active code
- [ ] Sensitive scopes flagged for verification
- [ ] Restricted scopes flagged for verification + CASA

## OAuth Client (Web Application)

- [ ] Authorized JavaScript origins:
  - [ ] `https://app.example.com`
  - [ ] `https://app-staging.example.com`
  - [ ] (preview deployments, see Vercel / Netlify pattern if needed)
  - [ ] `http://localhost:3000` (dev only; remove for production-only client)
- [ ] Authorized redirect URIs:
  - [ ] `https://app.example.com/api/auth/callback/google`
  - [ ] `https://app-staging.example.com/api/auth/callback/google`
  - [ ] `http://localhost:3000/api/auth/callback/google` (dev only)

No wildcards. Each URI explicit.

## Domain verification

- [ ] Each authorized domain verified via Google Search Console
- [ ] Verification record persisted (DNS TXT, HTML file, or HTML tag)
- [ ] Re-check propagation (24 h max)

## Verification (External + Production)

- [ ] Sensitive scopes? Verification required.
  - [ ] Demo video link: _____
  - [ ] Per-scope justification document: _____
  - [ ] Privacy policy mentions Google data: link _____
  - [ ] Submitted: _____
- [ ] Restricted scopes? Verification + CASA required.
  - [ ] CASA assessor selected: _____
  - [ ] CASA report received: _____
  - [ ] Annual re-verification calendared: _____

## Operations

- [ ] Production OAuth `client_id` and `client_secret` stored in secret manager (NOT in code)
- [ ] Synthetic monthly call configured (deletion-policy defense, `guides/06-google-oauth.md` §"Unused-client deletion")
- [ ] Runbook entry with `client_id`, owner, last-used date, re-verification triggers
- [ ] Cross-Account Protection (RISC) subscriber configured (optional but recommended)
- [ ] Owner email alias confirmed (deletion notification routes to a human)

## Audit handoff (post-implementation)

Cite this filled checklist in the audit-handoff block for `security-worker-bee`.
