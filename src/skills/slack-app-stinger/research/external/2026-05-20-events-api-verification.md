---
source_url: https://docs.slack.dev/apis/events-api/using-http-request-urls
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: events-api
stinger: slack-app-stinger
---

# Using HTTP Request URLs: Events API | Slack Developer Docs

## Summary

The Slack Events API delivers event payloads to your app's HTTP endpoint via POST requests. Setting up requires a URL verification handshake (challenge/response), ongoing HMAC-SHA256 signature verification on every incoming request, and a hard 3-second acknowledgment deadline. The guide covers all three layers: initial URL verification, ongoing signing-secret verification, and event subscription management. Also covers retry behavior (Slack retries unacknowledged events up to 3 times with exponential backoff).

## Key quotations / statistics

- URL verification challenge payload fields: `token` (deprecated), `challenge` (random string to echo back), `type: "url_verification"`.
- "Request URLs are case-sensitive."
- Signing secret verification: Slack sends `X-Slack-Signature` header using HMAC-SHA256 of `v0:<timestamp>:<request_body>` signed with the app's signing secret.
- "Your app must acknowledge Events API requests within 3 seconds by responding with HTTP 200 OK, otherwise Slack may retry the request."
- Retry header: `X-Slack-Retry-Num`; apps should check this header and deduplicate using `event_id` to avoid double-processing.
- Event payload includes `event_id` (unique per event), `event_time` (Unix timestamp), `team_id`, `api_app_id`.
- Slack delivers events at-least-once; `event_id` deduplication is the app's responsibility.

## Setup checklist (from official source)

1. Navigate to app settings and enable Event Subscriptions.
2. Enter your public request URL (e.g., `https://yourdomain.com/slack/events`).
3. Complete URL verification handshake (echo `challenge` field).
4. Subscribe to desired bot events.
5. Implement signature verification using your signing secret on every subsequent request.

## Annotations for stinger-forge

- Maps directly to `guides/04-events-api.md`.
- The `event_id` deduplication requirement is a Critical Directive in the Command Brief: stinger-forge must include a code pattern showing how to check and store `event_id` (e.g., Redis SETNX or DB unique constraint).
- The 3-second ACK rule also appears in slash commands and interactive component handlers: it is a cross-cutting concern that stinger-forge should call out in the setup guide as well.
- `X-Slack-Retry-Num` header check should appear in the events guide as an explicit deduplication guard.
- Bolt handles signature verification by default; custom HTTP handlers (Express, FastAPI route handler) must implement it manually. Stinger-forge should flag this distinction.
- Additional source for signature verification details: `https://docs.slack.dev/authentication/verifying-requests-from-slack`.
