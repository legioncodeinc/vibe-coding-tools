# Guide 03: Modals (Views)

**Sources:** `research/external/2026-05-20-block-kit-modals.md`, `research/external/2026-05-20-slash-commands-interactive.md`

---

## What modals are

Modals are focused overlay dialogs that capture user attention to collect input or display dynamic information. They are built entirely with Block Kit and rendered on top of the Slack client. Modals support a view stack of up to 3 views at a time.

---

## Opening a modal

Requires a `trigger_id` from a slash command, button click, or shortcut payload. `trigger_id` expires in **3 seconds**: call `views.open` before or immediately after `ack()`.

```typescript
await client.views.open({
  trigger_id: payload.trigger_id,
  view: buildMyView(),
});
```

---

## Modal view properties

```typescript
const view = {
  type: 'modal',
  callback_id: 'my_modal',           // Required; routes view_submission handler
  title: {                            // Required; max 24 chars
    type: 'plain_text',
    text: 'Create Ticket',
  },
  submit: {                           // Shown when input blocks are present
    type: 'plain_text',
    text: 'Submit',
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
  },
  private_metadata: JSON.stringify({ // Max 3000 characters; passes state between views
    channelId: 'C12345',
    originalTs: '1234567890.123',
  }),
  clear_on_close: false,              // true = closes entire view stack on X
  notify_on_close: true,             // true = fires view_closed event when user clicks X
  blocks: [/* ... */],
};
```

> `private_metadata` max: **3000 characters**. For larger payloads, store in a short-lived cache (Redis, etc.) and pass a lookup key in `private_metadata`. Source: `research/external/2026-05-20-block-kit-modals.md`

---

## View stack operations

```typescript
// Open: creates a new view on an empty stack
await client.views.open({ trigger_id, view });

// Push: adds a new view ON TOP of the current view (stack max: 3)
await client.views.push({ trigger_id, view });  // trigger_id from action payload

// Update: replaces the current top view in-place
await client.views.update({
  view_id: body.view.id,  // or external_id
  view: updatedView,
});
```

**View stack lifecycle:**
```
Stack empty → views.open → [View A]
[View A] → views.push → [View A, View B]  (B is now visible)
[View A, View B] → views.push → [View A, View B, View C]  (max)
[View A, View B, View C] → submit or close → stack pops
```

---

## Handling view_submission

```typescript
app.view('my_modal', async ({ ack, body, view, client }) => {
  // Extract input values from the view state
  const values = view.state.values;
  const ticketTitle = values.ticket_title_block.ticket_title_input.value;
  const priority = values.priority_block.priority_select.selected_option?.value;

  // Validate before acknowledging
  if (!ticketTitle) {
    await ack({
      response_action: 'errors',
      errors: {
        ticket_title_block: 'Title is required',
      },
    });
    return;
  }

  // Acknowledge without errors
  await ack();

  // Parse private_metadata for context
  const metadata = JSON.parse(view.private_metadata || '{}');

  // Do the work
  await createTicket({ title: ticketTitle, priority, channelId: metadata.channelId });
});
```

`response_action` options:
- `ack()` (no argument): close the modal and show success.
- `{ response_action: 'errors', errors: { block_id: 'Error message' } }`: show validation errors in-place without closing the modal.
- `{ response_action: 'update', view: updatedView }`: replace the modal with a new view.
- `{ response_action: 'push', view: newView }`: push a new view onto the stack.
- `{ response_action: 'clear' }`: clear the entire view stack.

---

## Handling view_closed

Only fires when `notify_on_close: true` is set on the view. Use for cleanup (delete drafts, release locks):

```typescript
app.view({ callback_id: 'my_modal', type: 'view_closed' }, async ({ ack, body }) => {
  await ack();
  const metadata = JSON.parse(body.view.private_metadata || '{}');
  await deleteDraft(metadata.draftId);
});
```

---

## Chained modal flow (wizard pattern)

For multi-step workflows, push views in sequence:

```typescript
// Step 1: open initial form
app.command('/create', async ({ command, ack, client }) => {
  await ack();
  await client.views.open({
    trigger_id: command.trigger_id,
    view: step1View(),
  });
});

// Step 2: push second view from step 1's submit
app.view('step1_modal', async ({ ack, body, client }) => {
  const step1Data = extractStep1(body.view.state.values);
  await ack({
    response_action: 'push',
    view: step2View(step1Data),  // Pass data via private_metadata
  });
});

// Final: handle step 2 submit
app.view('step2_modal', async ({ ack, body, client }) => {
  await ack();
  const metadata = JSON.parse(body.view.private_metadata);
  await submitFinalWork(metadata, body.view.state.values);
});
```

---

## Common gotchas

1. **No `response_url` inside modals.** Actions triggered inside modals cannot use `respond()`. Use `client.views.update()` or `client.chat.postMessage()` instead.
2. **`input` blocks only, not `actions` blocks, feed `view_submission`.** Buttons inside modals fire `app.action()` handlers and are not included in the submit payload: only `input` block elements appear in `view.state.values`.
3. **`private_metadata` 3000-char limit.** Serialize only IDs and minimal state. Store larger payloads in a cache keyed by a short ID.
4. **`trigger_id` for `views.push` comes from the action payload, not the original command.** Each button click or interactive component that triggers a push receives a new `trigger_id`.
5. **View stack max is 3.** Attempting a fourth `views.push` will return an API error. Design modal flows with a maximum of 3 steps.

---

*See also:* `guides/01-slash-commands.md` for how `trigger_id` flows from a slash command to a modal open, and `examples/slash-command-with-modal.md` for a complete working example.
