---
source_url: http://docs.slack.dev/tools/bolt-js/concepts/authenticating-oauth
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: oauth-install
stinger: slack-app-stinger
---

# Authenticating with OAuth: Bolt for JavaScript | Slack Developer Docs

## Summary

The Bolt OAuth guide describes the full OAuth 2.0 v2 installation flow for multi-workspace apps: configuring the App with `clientId`, `clientSecret`, `stateSecret`, and an `installationStore`; Bolt's built-in state parameter generation and validation; the token exchange flow; and per-workspace `Installation` object storage containing `botToken`, `botId`, `botUserId`, `userToken` (optional), and team metadata. Bolt provides a default in-memory store (development only) and expects a persistent `InstallationStore` for production.

## Key quotations / statistics

- Bot tokens (`xoxb-`) are tied to the app, not the installing user: the app stays installed even if the installing user is deactivated.
- `stateSecret` in Bolt auto-generates and validates the `state` parameter: bypassing this validation is a CSRF vulnerability.
- "Each workspace installation issues unique bot tokens that can be retrieved for incoming events."
- `InstallationStore` interface requires two methods: `storeInstallation(installation)` and `fetchInstallation(query)`.
- `clientId` and `clientSecret` must come from environment variables: never hardcoded.
- For org-wide installs (Enterprise Grid): the `Installation` object's `enterprise` field is populated; `isEnterpriseInstall: true` indicates an org-level install.
- Token refresh applies to user tokens, not bot tokens. User tokens can expire if using granular OAuth scopes with refresh enabled.
- Redirect URL must match exactly what is registered in app settings.

## OAuth 2.0 v2 flow (condensed)

1. User clicks "Add to Slack" / install button.
2. App redirects to `https://slack.com/oauth/v2/authorize?client_id=...&scope=...&state=<generated>`.
3. User approves scopes in Slack UI.
4. Slack redirects to app's `redirect_uri` with `code` and `state` parameters.
5. App validates `state` matches what was generated (CSRF protection).
6. App exchanges `code` for tokens via `oauth.v2.access`.
7. App stores the `Installation` object in `InstallationStore`.
8. Subsequent event payloads include `team_id`; app retrieves the stored bot token via `fetchInstallation`.

## Annotations for stinger-forge

- Maps directly to `guides/05-oauth-install.md`.
- The `state` parameter validation step is a Critical Directive in the Command Brief: stinger-forge must show explicitly where Bolt enforces this and what happens if bypassed.
- The `InstallationStore` interface is the correct abstraction for production multi-workspace apps; stinger-forge should provide a code scaffold showing a DB-backed implementation (e.g., Prisma model or SQLAlchemy model for storing `Installation` objects).
- Org-wide install (Enterprise Grid) differs in scoping: the `fetchInstallation` query receives `enterpriseId` rather than `teamId`. Stinger-forge should note this as an advanced edge case.
- Python equivalent: `http://docs.slack.dev/tools/bolt-python/concepts/authenticating-oauth`: same concepts, async-friendly `AsyncInstallationStore`.
