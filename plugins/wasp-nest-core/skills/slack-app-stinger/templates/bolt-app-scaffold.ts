/**
 * Minimal Bolt for JavaScript (TypeScript) app scaffold.
 * Covers: slash command + modal + Events API + OAuth install flow.
 *
 * Replace all TODO comments with your app's actual logic.
 * See guides/ for detailed patterns for each surface.
 */

import { App, Installation, InstallationStore, InstallationQuery } from '@slack/bolt';

// TODO: Replace with a database-backed InstallationStore for production.
// The in-memory store below loses all tokens on restart.
const installations = new Map<string, Installation>();

const installationStore: InstallationStore = {
  storeInstallation: async (installation) => {
    const key = installation.isEnterpriseInstall
      ? `enterprise:${installation.enterprise!.id}`
      : `team:${installation.team!.id}`;
    installations.set(key, installation);
  },
  fetchInstallation: async (query: InstallationQuery<boolean>) => {
    const key = query.isEnterpriseInstall
      ? `enterprise:${query.enterpriseId}`
      : `team:${query.teamId}`;
    const installation = installations.get(key);
    if (!installation) throw new Error(`No installation found for ${key}`);
    return installation;
  },
  deleteInstallation: async (query: InstallationQuery<boolean>) => {
    const key = query.isEnterpriseInstall
      ? `enterprise:${query.enterpriseId}`
      : `team:${query.teamId}`;
    installations.delete(key);
  },
};

// ---------------------------------------------------------------------------
// App initialization
// ---------------------------------------------------------------------------

const app = new App({
  // For single-workspace dev app (no OAuth):
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,

  // For multi-workspace OAuth app (comment out `token` above and uncomment below):
  // signingSecret: process.env.SLACK_SIGNING_SECRET!,
  // clientId: process.env.SLACK_CLIENT_ID!,
  // clientSecret: process.env.SLACK_CLIENT_SECRET!,
  // stateSecret: process.env.SLACK_STATE_SECRET!,
  // scopes: ['chat:write', 'commands', 'app_mentions:read'],
  // installationStore,

  // For Socket Mode (dev / internal apps only):
  // appToken: process.env.SLACK_APP_TOKEN!,
  // socketMode: true,
});

// ---------------------------------------------------------------------------
// Slash command
// ---------------------------------------------------------------------------

app.command('/TODO_COMMAND', async ({ command, ack, client }) => {
  await ack();  // Always acknowledge first (3-second deadline)

  // TODO: Open a modal, post a message, or dispatch async work here.
  // Example: open a modal
  await client.views.open({
    trigger_id: command.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'TODO_MODAL_CALLBACK_ID',
      title: { type: 'plain_text', text: 'TODO: Modal title' },
      submit: { type: 'plain_text', text: 'Submit' },
      close: { type: 'plain_text', text: 'Cancel' },
      private_metadata: JSON.stringify({ channelId: command.channel_id }),
      blocks: [
        {
          type: 'input',
          block_id: 'TODO_input_block',
          label: { type: 'plain_text', text: 'TODO: Label' },
          element: {
            type: 'plain_text_input',
            action_id: 'TODO_input_action',
          },
        },
      ],
    },
  });
});

// ---------------------------------------------------------------------------
// Modal submission
// ---------------------------------------------------------------------------

app.view('TODO_MODAL_CALLBACK_ID', async ({ ack, body, view, client }) => {
  const values = view.state.values;
  const inputValue = values.TODO_input_block.TODO_input_action.value;

  // Validate
  if (!inputValue) {
    await ack({
      response_action: 'errors',
      errors: { TODO_input_block: 'This field is required' },
    });
    return;
  }

  await ack();  // Closes the modal

  const metadata = JSON.parse(view.private_metadata || '{}');

  // TODO: Do the actual work asynchronously
  doWork({ value: inputValue, userId: body.user.id, channelId: metadata.channelId, client }).catch(console.error);
});

async function doWork(params: {
  value: string;
  userId: string;
  channelId: string;
  client: any;
}) {
  // TODO: Replace with actual logic
  await params.client.chat.postMessage({
    channel: params.channelId,
    text: `<@${params.userId}> submitted: ${params.value}`,
  });
}

// ---------------------------------------------------------------------------
// Events API
// ---------------------------------------------------------------------------

app.event('app_mention', async ({ event, say }) => {
  // TODO: Handle mentions
  await say({ text: `Hello <@${event.user}>!`, thread_ts: event.ts });
});

// ---------------------------------------------------------------------------
// Interactive component action
// ---------------------------------------------------------------------------

app.action('TODO_ACTION_ID', async ({ action, ack, respond }) => {
  await ack();
  // TODO: Handle the button click or select change
  await respond({ text: 'Action received!' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

(async () => {
  await app.start(parseInt(process.env.PORT ?? '3000'));
  console.log('Bolt app running');
})();
