---
name: "slack-app-stinger"
description: "Slack app development specialist for Bolt SDK (JS/Python/Java), slash commands, Block Kit UI composition, modals, Events API, OAuth multi-workspace install, and App Directory submission. Use when the user says \\\\\\\"build a Slack app\\\\\\\", \\\\\\\"add a slash command\\\\\\\", \\\\\\\"create a Slack modal\\\\\\\", \\\\\\\"set up Slack Events API\\\\\\\", \\\\\\\"OAuth multi-workspace\\\\\\\", \\\\\\\"submit to Slack Marketplace\\\\\\\", or when slack-app-worker-bee is invoked. Do NOT use for CI/CD pipeline topology (devops-worker-bee), secrets vault configuration (security-worker-bee), Django/FastAPI backend patterns beyond Bolt integration (python-worker-bee), or Slack Connect / Enterprise Grid administration."
---

# slack-app-stinger

The Slack developer playbook for `slack-app-worker-bee`. Encodes opinionated, research-backed patterns for every major Slack app surface: from first Bolt app scaffold to Marketplace submission.

## Quick navigation

| Task | Guide |
|---|---|
| Create a new Slack app, pick HTTP vs Socket Mode | `guides/00-setup-and-bolt.md` |
| Add a slash command | `guides/01-slash-commands.md` |
| Build Block Kit messages and interactive components | `guides/02-block-kit.md` |
| Open / push / update modals | `guides/03-modals.md` |
| Subscribe to events, verify webhooks | `guides/04-events-api.md` |
| Multi-workspace OAuth install flow | `guides/05-oauth-install.md` |
| Submit to App Directory / Marketplace | `guides/06-app-directory.md` |

## Critical directives

These are the non-negotiables. Violating any of them is the most common cause of production Slack app failures. See the relevant guide for code patterns.

1. **Acknowledge Slack payloads within 3 seconds, then dispatch async for long-running work.** Slack retries unacknowledged payloads up to 3 times and flags unreliable apps. This applies to slash commands, interactive component actions, and Events API deliveries equally. Source: `research/external/2026-05-20-events-api-verification.md`, `research/external/2026-05-20-slash-commands-interactive.md`.

2. **Verify Slack request signatures before processing any payload.** Bolt does this automatically. Custom HTTP handlers (Express, FastAPI routes) must implement HMAC-SHA256 verification manually using the app's signing secret. Source: `research/external/2026-05-20-events-api-verification.md`.

3. **Never store Slack tokens in plaintext config files or committed environment variables.** Bot tokens (`xoxb-`) and signing secrets go in an environment variable manager or secrets vault. Source: `research/external/2026-05-20-bolt-sdk-setup-patterns.md`.

4. **Always validate the `state` parameter in OAuth callbacks.** Bolt auto-generates and validates `state` via `stateSecret`. Bypassing this validation is a CSRF vulnerability that allows workspace installation hijacking. Source: `research/external/2026-05-20-oauth-multi-workspace.md`.

5. **Deduplicate Events API payloads using `event_id` before processing.** Slack delivers events at-least-once. Store the `event_id` (Redis SETNX, DB unique constraint) and discard duplicates. Source: `research/external/2026-05-20-events-api-verification.md`.

6. **If the app will be distributed commercially at scale, use HTTP mode and plan for Marketplace submission from the start.** Socket Mode apps cannot be listed in the Slack Marketplace. Apps intended for commercial distribution must go through Marketplace review (December 2024 policy update). Source: `research/external/2026-05-20-socket-mode-vs-http.md`, `research/external/2026-05-20-dev-policy-update.md`.

7. **Never use Slack data to train LLMs.** This is an explicit, absolute prohibition in the December 2024 Slack App Developer Policy update ("under any circumstances"). AI-powered Slack bots must not route user message content through LLM training pipelines. Source: `research/external/2026-05-20-dev-policy-update.md`.

## Scope note

This stinger covers the **Bolt SDK (JS, Python, Java)** and the classic Slack Platform. The **Deno Slack SDK** and the next-generation **Workflow Builder platform** are distinct products with separate documentation and are out of scope here. When developers encounter both in the official docs, direct them to `https://tools.slack.dev/bolt-js/` (Bolt JS) vs `https://tools.slack.dev/deno-slack-sdk/` (Deno/Workflow Builder) for the right starting point.

## Handoff map

- Deployment infrastructure for the Bolt app backend (Lambda, Fly.io, Render): route to `devops-worker-bee`.
- Token vault, signing secret rotation, security audit: route to `security-worker-bee`.
- Django or FastAPI backend decisions beyond Bolt integration: route to `python-worker-bee`.
- Slack Connect or Enterprise Grid administration: out of scope; direct the user to Slack's enterprise documentation.

---

*Forged by `stinger-forge` from `ai-tools/command-briefs/slack-app-worker-bee-command-brief.md` and `research/`. Part of the Hive.*
