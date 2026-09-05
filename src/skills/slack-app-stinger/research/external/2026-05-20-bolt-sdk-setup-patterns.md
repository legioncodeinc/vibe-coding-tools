---
source_url: https://tools.slack.dev/bolt-js/building-an-app/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: bolt-setup
stinger: slack-app-stinger
---

# Creating an app with Bolt for JavaScript

## Summary

The official Slack Bolt for JavaScript "Building an App" guide covers the complete setup flow: creating a Slack app via api.slack.com/apps, installing into a workspace, and writing the minimal boilerplate to receive and acknowledge events. Bolt handles request verification, payload parsing, and acknowledgment infrastructure automatically. The guide emphasizes Socket Mode for getting started (avoids exposing a public HTTP endpoint), with HTTP mode recommended once a public URL is available for production distribution.

## Key quotations / statistics

- "Bolt is a framework that lets you build Slack apps in a flash — it handles much of the foundational setup so you can focus on your app's functionality."
- Token types required: `SLACK_BOT_TOKEN` (`xoxb-` prefix), `SLACK_SIGNING_SECRET`, `SLACK_APP_TOKEN` (`xapp-` prefix, Socket Mode only).
- Bot tokens are associated with bot users and remain consistent across installations: they do not expire when the installing user leaves the workspace.
- "Create apps in a test workspace to avoid disrupting real work."
- Recommended scope for basic messaging: `chat:write`.

## Annotations for stinger-forge

- Maps directly to `guides/00-setup-and-bolt.md`. This source should be the first reference cited in that guide.
- The three environment variable names (`SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_APP_TOKEN`) are canonical; the guide should reproduce them verbatim.
- Socket Mode vs HTTP mode decision belongs in setup guide; see also `external/2026-05-20-socket-mode-vs-http.md` for the comparison page.
- Python equivalent: `https://tools.slack.dev/bolt-python/building-an-app/` (same structure, asyncio support added via `AsyncApp`).
