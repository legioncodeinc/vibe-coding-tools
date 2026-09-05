---
source_url: https://docs.slack.dev/surfaces/modals
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: block-kit-modals
stinger: slack-app-stinger
---

# Modals | Slack Developer Docs

## Summary

The official Slack Modals surface reference describes the view stack architecture, block limits, modal lifecycle events (`view_submission`, `view_closed`), and all key modal view properties. Modals are dialog boxes that capture user focus. They are built entirely with Block Kit and available in both Bolt and Deno Slack SDK apps. The view stack supports up to 3 views at a time; apps can push, update, or pop views while maintaining state.

## Key quotations / statistics

- "Modals are focused surfaces that allow you to collect data from users, or display dynamic and interactive information."
- View stack maximum: 3 views at a time; only one visible at any moment.
- Block limits: Messages = up to 50 blocks each; Modals and Home tabs = up to 100 blocks each.
- `private_metadata`: max 3000 characters; used to pass state between views (e.g., carry context from slash command through a chained modal flow).
- `callback_id`: max 255 characters; required for identifying interactions in `view_submission` handlers.
- `external_id`: max 255 characters; unique per-team identifier useful for deduplicating modal opens.
- `clear_on_close: true` clears the entire view stack when the user closes the modal.
- `notify_on_close: true` sends a `view_closed` event when the user closes without submitting: allows cleanup or logging.

## Block Kit component types (current as of retrieval)

Official block types for use inside modals:
- `section`: text + optional accessory element
- `divider`: horizontal rule
- `image`: standalone image block
- `actions`: row of interactive elements (buttons, select menus)
- `context`: small text/image annotations
- `input`: wraps an input element; required for `view_submission` data collection
- `header`: plain-text heading
- `rich_text`: formatted rich text (Slack's own rich text format)
- `video`: embed a video

Interactive elements available inside `input` blocks: `plain_text_input`, `email_text_input`, `number_input`, `url_text_input`, `datepicker`, `timepicker`, `datetimepicker`, `checkboxes`, `radio_buttons`, `static_select`, `multi_static_select`, `external_select`, `multi_external_select`, `users_select`, `multi_users_select`, `conversations_select`, `channels_select`.

## Annotations for stinger-forge

- Maps directly to `guides/03-modals.md` and partly to `guides/02-block-kit.md`.
- The `private_metadata` 3000-character limit is a production gotcha stinger-forge should flag explicitly.
- The view stack max of 3 is a UX constraint that shapes modal chaining patterns.
- `notify_on_close` is often overlooked; stinger-forge should include it in the modal lifecycle state machine diagram.
- Cross-reference with `external/2026-05-20-slash-commands-interactive.md` for how slash commands open modals via `views.open`.
