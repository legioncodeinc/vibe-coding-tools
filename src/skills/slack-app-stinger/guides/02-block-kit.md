# Guide 02: Block Kit Composition

**Sources:** `research/external/2026-05-20-block-kit-modals.md`, `research/external/2026-05-20-slash-commands-interactive.md`

> TODO: open question, verify the Block Kit component list against `https://docs.slack.dev/reference/block-kit/blocks` at the time of each app submission. Slack has not published deprecation notices for Block Kit components in the 6-month research window (Nov 2025 - May 2026), but the inventory may change.

---

## Block types reference

| Block type | Use case | Available in messages | Available in modals |
|---|---|---|---|
| `section` | Text content + optional accessory element | Yes | Yes |
| `divider` | Horizontal rule | Yes | Yes |
| `image` | Standalone image | Yes | Yes |
| `actions` | Row of buttons / select menus | Yes | Yes (limited) |
| `context` | Small annotation text/images | Yes | Yes |
| `input` | Data collection form field | No | Yes (required) |
| `header` | Plain-text heading | Yes | Yes |
| `rich_text` | Slack-native formatted text | Yes | Yes |
| `video` | Embedded video | Yes | No |

Block limits:
- Messages: up to **50 blocks**
- Modals and App Home tabs: up to **100 blocks**

Source: `research/external/2026-05-20-block-kit-modals.md`

---

## Interactive element types (inside `input` or `actions` blocks)

```
plain_text_input         — single-line or multiline text input
email_text_input         — validated email address
number_input             — numeric input with optional min/max
url_text_input           — validated URL
datepicker               — date selector
timepicker               — time selector
datetimepicker           — combined date+time selector
checkboxes               — multi-select checkbox group
radio_buttons            — single-select radio group
static_select            — single-select dropdown from static list
multi_static_select      — multi-select from static list
external_select          — single-select with options loaded from external URL
multi_external_select    — multi-select with external options
users_select             — Slack user picker
multi_users_select       — multi-user picker
conversations_select     — conversation picker
channels_select          — channel picker
overflow                 — overflow (kebab) menu for secondary actions
button                   — clickable button (primary, danger, default)
```

---

## Naming conventions

Use consistent naming to avoid collisions across blocks and to make action handlers easy to register:

- **`block_id`**: Identifies a block; use snake_case and domain-prefix (e.g., `form_name_block`, `approval_actions_block`). Must be unique within a view.
- **`action_id`**: Identifies an interactive element; use snake_case verb-noun (e.g., `submit_form_button`, `select_priority`). Must be unique within a view for `app.action()` routing to work correctly.

```json
{
  "type": "input",
  "block_id": "ticket_title_block",
  "label": { "type": "plain_text", "text": "Title" },
  "element": {
    "type": "plain_text_input",
    "action_id": "ticket_title_input",
    "placeholder": { "type": "plain_text", "text": "Enter ticket title..." }
  }
}
```

---

## Building a section with a button accessory

```json
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "*PR #123* is awaiting your review."
  },
  "accessory": {
    "type": "button",
    "text": { "type": "plain_text", "text": "Review" },
    "action_id": "review_pr_button",
    "style": "primary",
    "value": "123"
  }
}
```

Button styles: `primary` (green), `danger` (red), or omit for default (white).

---

## Constructing an actions row

```json
{
  "type": "actions",
  "block_id": "approval_actions_block",
  "elements": [
    {
      "type": "button",
      "text": { "type": "plain_text", "text": "Approve" },
      "action_id": "approve_action",
      "style": "primary"
    },
    {
      "type": "button",
      "text": { "type": "plain_text", "text": "Reject" },
      "action_id": "reject_action",
      "style": "danger"
    }
  ]
}
```

---

## mrkdwn text formatting quick reference

| Format | Syntax |
|---|---|
| Bold | `*text*` |
| Italic | `_text_` |
| Strikethrough | `~text~` |
| Code (inline) | `` `code` `` |
| Code block | ` ```code block``` ` |
| Blockquote | `> text` |
| Ordered list | `1. item` |
| Unordered list | `• item` |
| Link | `<https://url|link text>` |
| Mention user | `<@USERID>` |
| Mention channel | `<#CHANNELID>` |

Use `"type": "mrkdwn"` in text objects to enable formatting. `"type": "plain_text"` strips formatting.

---

## Common gotchas

1. **`input` blocks only work inside modals and Home tabs**: not in regular messages. For interactive data collection in a message, use `actions` blocks with a modal flow instead.
2. **`actions` blocks inside modals** do not trigger `view_submission`: only `input` blocks feed into the submission payload. Use `actions` in modals only for navigation (open/push other views), not for data collection.
3. **`block_id` collisions** cause silent rendering failures. Always use unique, namespaced IDs.
4. **`button` in `actions` with no `action_id`** will fire but cannot be routed to a handler. Always set `action_id` on every interactive element.

---

*See also:* `guides/03-modals.md` for how Block Kit composing inside modals differs from message composition.
