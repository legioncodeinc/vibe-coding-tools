# 00: Principles

Core architectural decisions every Discord bot engineer should lock in before writing any code.

*Sources: `research/external/2026-05-20-discord-interactions-official.md`, `research/external/2026-05-20-discord-intents-explainer.md`*

---

## 1. Gateway vs HTTP Interactions endpoint

Two delivery paths exist for Discord interactions (slash commands, buttons, modals):

| | Gateway (WebSocket) | HTTP Interactions Endpoint |
|--|---|---|
| **Transport** | WebSocket connection to Discord gateway | HTTPS POST to your server URL |
| **State** | Stateful connection required | Stateless; each request is independent |
| **Best for** | Bots needing presence, DMs, reactions, message events, or voice | Simple command bots with no real-time event needs |
| **Requires** | A persistent process, reconnect logic, sharding | A public HTTPS endpoint + signature verification |
| **Not suited for** | Cloud Functions / serverless with cold starts | Voice features or bots that react to raw message events |

**Decision rule:** If your bot uses voice, needs to react to messages not addressed to it, or tracks member presence, use the gateway. If your bot is purely command-driven with no real-time event needs, consider the HTTP endpoint. Most production bots use the gateway because features are added there first and the SDK ecosystem is built around it.

Critical detail: **even gateway bots respond to interactions over HTTP**, not the WebSocket. The gateway only DELIVERS the interaction payload; the bot still calls the REST API to respond.

## 2. Minimum-intent discipline

Only declare the Gateway Intents your bot actually needs:

```js
// discord.js — only what you use
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.MessageContent  <-- only if you need raw message text
  ],
});
```

- `MessageContent`, `GuildMembers`, and `GuildPresences` are **Privileged Intents** requiring explicit approval beyond 75 servers.
- Over-requesting intents increases the payload per event and widens the PII surface.
- Under-requesting causes missing data silently: check the Discord docs for which events depend on which intents.

## 3. Token environment variable discipline

Tokens MUST come from environment variables, never from source code:

```ts
const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("DISCORD_TOKEN not set");
```

```python
import os
TOKEN = os.environ["DISCORD_TOKEN"]
```

Tokens committed to source are automatically harvested by GitHub's secret-scanning and by third-party bots that mirror public commits. Rotate immediately if exposed.

## 4. Command registration scoping

- **Guild-scoped commands** (`guildId` specified): propagate **instantly**. Use for all development and testing.
- **Global commands**: propagate in **~1 hour**. Use only in production, after the command API shape is stable.

Never test with global commands; the propagation delay makes iteration painful and stale commands linger.

## 5. Error handling baseline

Every bot must have at minimum:

```ts
client.on("error", (err) => console.error("Client error:", err));
process.on("unhandledRejection", (err) => console.error("Unhandled:", err));
```

For production, wire these to your telemetry tool (Sentry, Datadog, etc.) rather than `console.error`.

---

*See `examples/happy-path-slash-command.md` for a working bot skeleton that applies all five principles above.*
