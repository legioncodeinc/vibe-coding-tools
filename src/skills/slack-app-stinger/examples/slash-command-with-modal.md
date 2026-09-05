# Example: Slash Command with Modal Flow

**Demonstrates:** `guides/01-slash-commands.md`, `guides/02-block-kit.md`, `guides/03-modals.md`

This example shows the complete flow: a slash command opens a modal, the user fills in a form, the `view_submission` handler processes the data and posts a confirmation message.

---

## Flow

```
User types /ticket → App opens modal → User fills form → Submit → App posts confirmation
```

---

## Complete TypeScript example

```typescript
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Step 1: Slash command opens a modal
app.command('/ticket', async ({ command, ack, client }) => {
  // ACK immediately — trigger_id expires in 3 seconds
  await ack();

  await client.views.open({
    trigger_id: command.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'create_ticket_modal',
      title: { type: 'plain_text', text: 'Create Ticket' },
      submit: { type: 'plain_text', text: 'Submit' },
      close: { type: 'plain_text', text: 'Cancel' },
      // Pass the originating channel via private_metadata
      private_metadata: JSON.stringify({ channelId: command.channel_id }),
      blocks: [
        {
          type: 'input',
          block_id: 'title_block',
          label: { type: 'plain_text', text: 'Title' },
          element: {
            type: 'plain_text_input',
            action_id: 'title_input',
            placeholder: { type: 'plain_text', text: 'Brief description of the issue' },
          },
        },
        {
          type: 'input',
          block_id: 'priority_block',
          label: { type: 'plain_text', text: 'Priority' },
          element: {
            type: 'static_select',
            action_id: 'priority_select',
            placeholder: { type: 'plain_text', text: 'Select priority' },
            options: [
              { text: { type: 'plain_text', text: 'P1 - Critical' }, value: 'p1' },
              { text: { type: 'plain_text', text: 'P2 - High' }, value: 'p2' },
              { text: { type: 'plain_text', text: 'P3 - Medium' }, value: 'p3' },
              { text: { type: 'plain_text', text: 'P4 - Low' }, value: 'p4' },
            ],
          },
        },
        {
          type: 'input',
          block_id: 'description_block',
          optional: true,  // Not required for submission
          label: { type: 'plain_text', text: 'Description' },
          element: {
            type: 'plain_text_input',
            action_id: 'description_input',
            multiline: true,
            placeholder: { type: 'plain_text', text: 'Additional details...' },
          },
        },
      ],
    },
  });
});

// Step 2: Handle modal submission
app.view('create_ticket_modal', async ({ ack, body, view, client }) => {
  const values = view.state.values;

  // Extract input values
  const title = values.title_block.title_input.value;
  const priority = values.priority_block.priority_select.selected_option?.value;
  const description = values.description_block?.description_input?.value;

  // Validate before ack
  if (!title || title.length < 3) {
    await ack({
      response_action: 'errors',
      errors: {
        title_block: 'Title must be at least 3 characters',
      },
    });
    return;
  }

  // Acknowledge — modal closes immediately
  await ack();

  // Parse metadata for originating channel
  const metadata = JSON.parse(view.private_metadata || '{}');

  // Dispatch async work (ticket creation can take time)
  createTicketAndNotify({
    title: title!,
    priority: priority!,
    description,
    channelId: metadata.channelId,
    userId: body.user.id,
    client,
  }).catch(console.error);
});

// Async worker function — runs after modal is closed
async function createTicketAndNotify({
  title, priority, description, channelId, userId, client,
}: {
  title: string;
  priority: string;
  description?: string | null;
  channelId: string;
  userId: string;
  client: any;
}) {
  // Create the ticket (replace with your actual ticket API)
  const ticketId = await createTicketInBackend({ title, priority, description });

  // Post confirmation to the originating channel
  await client.chat.postMessage({
    channel: channelId,
    text: `Ticket created by <@${userId}>`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Ticket #${ticketId} created* by <@${userId}>\n*${title}*\nPriority: ${priority.toUpperCase()}${description ? `\n${description}` : ''}`,
        },
      },
    ],
  });
}

async function createTicketInBackend(data: { title: string; priority: string; description?: string | null }) {
  // Stub — replace with actual DB write or API call
  return `TKT-${Date.now()}`;
}

(async () => {
  await app.start(3000);
  console.log('Bolt app running on port 3000');
})();
```

---

## Key patterns demonstrated

1. **ACK before `views.open`**: `ack()` is called before `client.views.open()` because both operations happen within the 3-second window.
2. **`private_metadata` for state passing**: the originating `channel_id` is encoded in `private_metadata` and decoded in the `view_submission` handler.
3. **Validation before `ack()`**: invalid input returns `response_action: 'errors'` without closing the modal.
4. **Async dispatch after `ack()`**: `createTicketAndNotify` is called without `await`, ensuring the handler returns immediately after `ack()`.
5. **`optional: true` on input blocks**: marks a field as not required for submission; `value` will be `null` if left empty.
