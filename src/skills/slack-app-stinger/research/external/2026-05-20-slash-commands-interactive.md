---
source_url: https://api.slack.com/slash-commands
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: slash-commands
stinger: slack-app-stinger
---

# Implementing Slash Commands | Slack Developer Docs

## Summary

The slash commands reference covers command registration in the app manifest, the payload structure Slack sends to the app's endpoint, the 3-second acknowledgment requirement, response types (ephemeral vs in-channel), deferred responses via `response_url`, and Bolt's `app.command()` handler pattern. Slash commands are typically the entry point for interactive workflows: they open modals, trigger background jobs, or post formatted messages.

## Key quotations / statistics

- Bolt pattern: `app.command('/commandname', async ({ command, ack, say, respond }) => { await ack(); ... })`.
- Commands must be acknowledged with `ack()` within 3 seconds: same rule as events and interactive components.
- `say()` posts a message to the channel where the command was invoked.
- `respond()` uses the `response_url` to post a message: can be called up to **5 times** within **30 minutes** of the original command invocation.
- `response_type: "ephemeral"` (default): only visible to the invoking user.
- `response_type: "in_channel"`: visible to all channel members.
- Command payload includes: `command` (the command text, e.g., `/echo`), `text` (everything after the command), `user_id`, `channel_id`, `team_id`, `trigger_id` (required for opening modals).
- `trigger_id` is required to open a modal via `views.open`: it expires in 3 seconds, so the modal must be opened before or immediately after the `ack()` call.

## Interactive components handler pattern

From `https://docs.slack.dev/interactivity/handling-user-interaction`:

- Interactive components (buttons, select menus, datepickers in Block Kit) fire events to the app's Interactivity endpoint.
- Bolt uses `app.action('action_id', async ({ action, ack, respond }) => { await ack(); ... })`.
- `action_id` is set on the Block Kit element; `block_id` groups related elements.
- `response_url` is available for actions triggered in messages; NOT available for actions inside modals (use `views.update` instead).
- 3-second ACK rule applies here too: same as commands and events.

## Annotations for stinger-forge

- Maps directly to `guides/01-slash-commands.md`.
- The `trigger_id` expiry (3 seconds) is a critical gotcha for the modal-opening pattern in `examples/slash-command-with-modal.md`: the `views.open` call must happen in the same async tick as `ack()` or immediately after.
- The `respond()` 5-call / 30-minute limit is a less-known constraint stinger-forge should document in the slash commands guide.
- `action_id` / `block_id` naming conventions belong in `guides/02-block-kit.md`; slash commands guide should cross-reference.
- For deferred long-running tasks: acknowledge immediately, dispatch async job (e.g., Celery task, BullMQ job), then use `respond()` or `chat.postMessage` from the job when ready.
