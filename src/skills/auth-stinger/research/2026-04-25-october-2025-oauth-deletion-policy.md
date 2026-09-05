# October 2025 Google OAuth Unused-Client Deletion Policy

**Sources:**
- https://support.google.com/cloud/answer/13463073
- Google Cloud blog and product notifications (October 2025)

**Retrieved:** 2026-04-25

## Summary

In October 2025 Google began enforcing automatic deletion of OAuth client IDs that have had no API traffic for 6 months. Once deleted, the client cannot be recovered; users on that client see `deleted_client` errors.

## Mechanism

- "No traffic" defined as no successful authorization or token-exchange call attributable to the client.
- Threshold: 6 months idle.
- Notification: email to project owner / billing contact 30 days before deletion.
- Recovery: not possible; a new client must be created. Existing user grants on the deleted client are also lost.

## Risk surface

- **Rarely-used flows**: admin import that runs quarterly; CLI tool used by a small subset of users; secondary auth flow that handles a niche provider.
- **Staging / DR clients**: created for emergency rollback; never see traffic; deleted.
- **Pre-launch clients**: created in dev, paused for re-design, returned to months later, deleted.
- **Archived / legacy projects**: dormant projects with active clients, deleted.

## Defenses

1. **Synthetic call**: scheduled job (weekly is plenty) hits `https://oauth2.googleapis.com/tokeninfo` with the client OR makes a minimal API call.
2. **Runbook entry**: production-critical clients listed with `client_id`, owner, last-used date, deletion-policy defense, re-verification triggers.
3. **Email subscription**: ensure owner email is monitored.
4. **Quarterly audit**: confirm each listed client has had recent traffic.

## Why it's load-bearing

- A dormant client breaks production silently a year after launch: exactly the kind of bug that escapes regression tests.
- The notification email lands in a generic project-owner inbox; teams that don't tend to that inbox miss it.
- For Google Workspace add-ons or marketplace listings, deletion may also revoke marketplace listings.

## Relevance

- `guides/06-google-oauth.md` §"Unused-client deletion (October 2025 policy)".
- `templates/google-oauth-consent-screen-checklist.md` § Operations.
- `guides/00-principles.md` Principle 7.
