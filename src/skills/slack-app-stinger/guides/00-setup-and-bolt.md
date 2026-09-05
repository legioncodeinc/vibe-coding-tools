# Guide 00: Bolt SDK Setup and HTTP vs Socket Mode

**Sources:** `research/external/2026-05-20-bolt-sdk-setup-patterns.md`, `research/external/2026-05-20-socket-mode-vs-http.md`, `research/external/2026-05-20-app-manifest-reference.md`

---

## Step 1: Decide: HTTP mode or Socket Mode?

Answer this first because the choice affects your manifest, deployment, and Marketplace eligibility.

| Question | HTTP mode | Socket Mode |
|---|---|---|
| Will this app be listed in the Slack Marketplace? | Required | Blocked |
| Does your server have a publicly reachable URL? | Required | Not needed |
| Is this an internal/behind-firewall app? | Overkill | Recommended |
| Max concurrent connections needed? | Unlimited | 10 per app |
| Latency requirement? | Standard (HTTP round-trip) | Low (persistent WebSocket) |

**Decision tree:**
```
Will this app be listed in the Slack Marketplace?
  YES → HTTP mode (required)
   NO → Is it internal / behind corporate firewall?
         YES → Socket Mode (recommended)
          NO → HTTP mode (simpler for public deployments)
```

> Note: You can switch between modes at any time in App Settings without reinstalling.
> Source: `research/external/2026-05-20-socket-mode-vs-http.md`

---

## Step 2: Create the Slack app

1. Go to https://api.slack.com/apps and click **Create New App**.
2. Choose **From an app manifest** (recommended) or **From scratch**.
3. Select your development workspace (create a dedicated test workspace, avoid disrupting real work).

Minimal manifest for a Bolt HTTP app:

```yaml
display_information:
  name: My App
features:
  bot_user:
    display_name: My App
    always_online: false
oauth_config:
  scopes:
    bot:
      - chat:write
      - commands
settings:
  event_subscriptions:
    request_url: https://your-domain.com/slack/events
    bot_events:
      - app_mention
  interactivity:
    is_enabled: true
    request_url: https://your-domain.com/slack/interactive
  slash_commands:
    - command: /mycommand
      url: https://your-domain.com/slack/commands/mycommand
      description: Does something useful
  org_deploy_enabled: false
  socket_mode_enabled: false   # true for Socket Mode
  token_rotation_enabled: false
```

> Source: `research/external/2026-05-20-app-manifest-reference.md`

---

## Step 3: Install to workspace and collect credentials

After creating the app and installing it to your test workspace, collect three credentials from the App Settings dashboard:

| Environment variable | Where to find it | Notes |
|---|---|---|
| `SLACK_BOT_TOKEN` | **OAuth & Permissions > Bot User OAuth Token** | `xoxb-` prefix; stays consistent across workspace installs |
| `SLACK_SIGNING_SECRET` | **Basic Information > App Credentials > Signing Secret** | Used to verify all incoming Slack requests |
| `SLACK_APP_TOKEN` | **Basic Information > App-Level Tokens** | `xapp-` prefix; Socket Mode only; requires `connections:write` scope |

Store these in a `.env` file (never commit to version control). For production, use a secrets manager.

> Source: `research/external/2026-05-20-bolt-sdk-setup-patterns.md`

---

## Step 4: Initialize a Bolt app

### JavaScript / TypeScript (HTTP mode)

```bash
npm install @slack/bolt
```

```typescript
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Register handlers here (see guides/01-slash-commands.md, guides/04-events-api.md)

(async () => {
  await app.start(process.env.PORT ?? 3000);
  console.log('Bolt app is running');
})();
```

### JavaScript / TypeScript (Socket Mode)

```typescript
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,  // xapp- token
  socketMode: true,
});
```

### Python (async HTTP mode)

```bash
pip install slack-bolt
```

```python
from slack_bolt.async_app import AsyncApp
from slack_bolt.adapter.socket_mode.async_handler import AsyncSocketModeHandler
import asyncio, os

app = AsyncApp(
    token=os.environ["SLACK_BOT_TOKEN"],
    signing_secret=os.environ["SLACK_SIGNING_SECRET"],
)

# Register handlers here

async def main():
    handler = AsyncSocketModeHandler(app, os.environ["SLACK_APP_TOKEN"])
    await handler.start_async()

if __name__ == "__main__":
    asyncio.run(main())
```

> Bolt Python uses `AsyncApp` + `asyncio` for non-blocking handler execution: important for respecting the 3-second ACK deadline under load.
> Source: `research/external/2026-05-20-bolt-sdk-setup-patterns.md`

---

## Development workflow

1. For Socket Mode: run `npm start` (or `python app.py`); no public URL needed.
2. For HTTP mode during local development: use `ngrok http 3000` to expose a local port, update the request URL in App Settings.
3. Always use a separate development workspace. Slack events fire immediately: a mistake in production sends messages to real users.

---

## Java (brief)

Java Bolt requires `com.slack.api:bolt:*` and a servlet adapter. See `https://slack.dev/java-slack-sdk/guides/bolt-basics` for the full setup. Core concepts (token, signing secret, handler registration) are identical; the Java SDK uses a builder pattern rather than constructor arguments. Java coverage in this stinger is lighter than JS/Python due to lower practitioner documentation availability at research time.

> TODO: open question, Java Bolt guide depth. If your team uses Java, re-run scripture-historian with query "Slack Bolt Java SDK 2026" for deeper coverage.

---

*See also:* `examples/slash-command-with-modal.md` for a full working app scaffold.
