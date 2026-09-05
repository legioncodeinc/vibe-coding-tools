# Guide 01: Slash Commands

**Sources:** `research/external/2026-05-20-slash-commands-interactive.md`, `research/external/2026-05-20-block-kit-modals.md`

---

## Registration

Add to your app manifest under `settings.slash_commands`:

```yaml
slash_commands:
  - command: /mycommand
    url: https://your-domain.com/slack/commands/mycommand
    description: Does something useful
    usage_hint: "[optional hint text]"
    should_escape: false
```

Reinstall the app to the workspace after manifest changes to activate new commands.

---

## Handler pattern (Bolt)

```typescript
// JavaScript / TypeScript
app.command('/mycommand', async ({ command, ack, say, respond, client }) => {
  // MUST call ack() within 3 seconds — do it first
  await ack();

  // For short work: respond directly
  await say({
    text: `You said: ${command.text}`,
    // Optional: use blocks for richer formatting (see guides/02-block-kit.md)
  });
});
```

```python
# Python
@app.command("/mycommand")
async def handle_command(ack, command, say):
    await ack()  # Must be called within 3 seconds
    await say(f"You said: {command['text']}")
```

---

## The 3-second ACK rule

**Call `ack()` immediately, then do the work.** Slack waits 3 seconds for an HTTP 200 response. If it does not receive one, it retries the request up to 3 times.

For long-running work (API calls, database writes, external service calls), use the deferred pattern:

```typescript
app.command('/report', async ({ command, ack, respond }) => {
  await ack();  // Acknowledge immediately

  // Dispatch async work — do NOT await inside the handler
  generateReport(command.user_id, respond).catch(console.error);
});

async function generateReport(userId: string, respond: RespondFn) {
  const data = await fetchReportData(userId);  // This can take as long as needed
  await respond({ text: `Report ready: ${data.summary}` });
}
```

> Source: `research/external/2026-05-20-slash-commands-interactive.md`

---

## Command payload fields

| Field | Description |
|---|---|
| `command` | The command string, e.g. `/mycommand` |
| `text` | Everything typed after the command |
| `user_id` | Slack ID of the invoking user |
| `channel_id` | Channel where the command was typed |
| `team_id` | Workspace ID |
| `trigger_id` | Required for opening modals; expires in **3 seconds** |
| `response_url` | URL for deferred responses; usable up to **5 times** within **30 minutes** |

---

## Response types

| Method | Visibility | When to use |
|---|---|---|
| `ack({ text })` | Ephemeral (only invoking user) | Immediate short confirmation |
| `say(message)` | In-channel | Message visible to all channel members |
| `respond(message)` | Ephemeral by default (configurable) | Deferred response after async work |

Control visibility explicitly:
```typescript
await respond({
  text: 'Result here',
  response_type: 'in_channel',  // 'ephemeral' (default) or 'in_channel'
});
```

`respond()` limits: **5 calls** within **30 minutes** of the original command. After that, use `client.chat.postMessage` instead.

---

## Opening a modal from a slash command

The `trigger_id` from the command payload is required to open a modal. It expires in 3 seconds; open the modal before or immediately after `ack()`:

```typescript
app.command('/form', async ({ command, ack, client }) => {
  await ack();

  // Open modal immediately — trigger_id expires in 3 seconds
  await client.views.open({
    trigger_id: command.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'my_modal',
      title: { type: 'plain_text', text: 'My Form' },
      submit: { type: 'plain_text', text: 'Submit' },
      blocks: [
        {
          type: 'input',
          block_id: 'name_block',
          label: { type: 'plain_text', text: 'Name' },
          element: {
            type: 'plain_text_input',
            action_id: 'name_input',
          },
        },
      ],
    },
  });
});
```

See `guides/03-modals.md` for the full modal lifecycle.

---

## Interactive components (buttons, selects)

Actions fired from Block Kit elements in messages use `app.action()`:

```typescript
app.action('approve_button', async ({ action, ack, respond }) => {
  await ack();  // 3-second rule applies here too
  await respond({ text: 'Approved!' });
});
```

`action_id` is the identifier set on the Block Kit element. `block_id` groups related elements. See `guides/02-block-kit.md` for naming conventions.

> Note: `response_url` (and `respond()`) is available for message actions but NOT for actions inside modals. Inside modals, use `client.views.update()` instead.

---

*See also:* `examples/slash-command-with-modal.md` for a full end-to-end example.
