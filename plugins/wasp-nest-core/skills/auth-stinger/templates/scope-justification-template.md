# Scope Justification

One row per requested OAuth scope. Submitted with verification when sensitive / restricted scopes are in play.

**Project:** _____
**OAuth client_id:** _____
**Submission date:** _____

## Per-scope table

| Scope | Tier | Why we request it (1-2 sentences) | What we do with the data | Where in our code | Minimum-data alternative considered |
|---|---|---|---|---|---|
| `openid` | Non-sensitive | OpenID Connect sign-in | Identity assertion only; not stored | `auth/google/callback` | n/a |
| `email` | Non-sensitive | Display email; key user identity | Stored in `users.email` | `users` table | n/a |
| `profile` | Non-sensitive | Show name and avatar in UI | Stored in `users.name`, `users.avatar_url` | `users` table | n/a |
| `https://www.googleapis.com/auth/calendar.readonly` | Sensitive | Show user's upcoming meetings on dashboard | Read-only fetch, cached 5 min | `lib/google/calendar.ts` | Considered: `calendar.events.readonly` is narrower; chose `calendar.readonly` because we also list calendars |
| _____ | _____ | _____ | _____ | _____ | _____ |

## Reasoning prompts (one paragraph per sensitive / restricted scope)

For each sensitive or restricted scope:

### Scope: `_____`

**Feature it powers:** _____

**Why a narrower scope doesn't suffice:** _____

**Data retention:** _____ (e.g., "Cached 5 minutes in Redis; never persisted to long-term storage.")

**Who can access the data inside the company:** _____ (e.g., "On-call engineers via audit-logged break-glass; no other access.")

**Sub-processors:** _____ (any third-party that touches this data)

**User control:** _____ (how the user revokes / sees what's stored)

## Demo-video shot list (per sensitive scope)

For the verification demo video, every requested scope must be visibly used. Plan one shot per scope:

- [ ] Scope `____`: show the consent prompt listing this scope
- [ ] Scope `____`: show the in-app feature reading the data, with data on screen
- [ ] Scope `____`: show the URL bar (full domain visible)

Cite `guides/07-google-oauth-verification.md`.
