# 05: Scaling & Ops

Sharding, REST-only mode, rate-limit handling, and container health patterns for production bots.

*Sources: `research/external/2026-05-20-discord-sharding-guide.md`, `research/external/2026-05-20-discord-api-v10-changes-2026.md`*

---

## Sharding

Discord **requires** bots in **2,500+ guilds** to use sharding. Above that threshold, the gateway rejects unsharded connections.

**Auto-sharding (discord.js):**
```ts
import { ShardingManager } from "discord.js";
const manager = new ShardingManager("./bot.js", { token: process.env.DISCORD_TOKEN });
manager.spawn(); // spawns Discord-recommended shard count automatically
```

**Manual shard count:** Use Discord's `/gateway/bot` endpoint to retrieve the recommended shard count:
```
GET /api/v10/gateway/bot
Authorization: Bot {token}
→ { "shards": 4, "session_start_limit": { ... } }
```

**Shard communication:** Shards run in separate processes; use `ShardingManager.broadcastEval()` for cross-shard queries (e.g., total guild count, user lookup across shards).

**discord.py auto-sharding:**
```python
bot = commands.AutoShardedBot(command_prefix="!", intents=intents)
```

---

## REST-only / HTTP Interactions mode

If the bot is purely command-driven (no message events, no voice, no presence), you can run it without a persistent gateway connection:

- Register commands via the REST API.
- Set the **Interactions Endpoint URL** in the Developer Portal to your HTTPS server.
- Discord POSTs every interaction directly to your endpoint.
- Respond synchronously (within 3 seconds) or use deferred responses.

**When to use:** serverless functions, edge workers, cost-sensitive deployments. **When not to use:** bots that need voice, presence, or real-time message events.

---

## Rate-limit handling

Discord enforces two layers of rate limits:

1. **Per-route limits**: each REST endpoint has its own bucket. discord.js and discord.py both auto-queue requests and retry after the `Retry-After` header value.
2. **Global limit**: 50 requests/second across all routes for a single bot token.

**discord.js REST options:**
```ts
const rest = new REST().setToken(token);
// Adjust if you're hitting the global limit:
// RESTOptions.globalRequestsPerSecond (default 50)
```

> **TODO: open question:** Specific `RESTOptions` knobs for fine-grained rate-limit tuning were not retrieved during research. Add field-level detail from `discord.js.org/docs/packages/rest` on next refresh.

**Best practices:**
- Never fire-and-forget: always `await` REST calls.
- Wrap bulk operations (e.g., mass-deleting messages) in a rate-limit-aware loop, not `Promise.all()`.
- Log `DiscordAPIError` with the `code` field: it maps to Discord's error code table.

---

## Container health checks

For Dockerised bots, add a health-check endpoint. A minimal pattern:

```ts
import { createServer } from "http";
createServer((_, res) => {
  res.writeHead(client.isReady() ? 200 : 503);
  res.end();
}).listen(3000);
```

Docker Compose:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 5s
  retries: 3
```

The `client.isReady()` check ensures the health endpoint reports unhealthy during a gateway reconnect, which allows your orchestrator to restart the container.

---

## Session restart handling

Bots will eventually disconnect and reconnect. Both SDKs handle RESUME automatically, but you should:

1. Log reconnect events: `client.on("shardReconnecting", id => ...)`.
2. Re-register guild-scoped commands on `client.once("ready")` to handle the case where command registration was lost (rare, but possible after long downtime).
3. Do NOT re-login on disconnect. The SDK handles this. Double-login produces duplicate events.

---

## Error logging minimum

```ts
client.on("error", err => logger.error({ err }, "discord client error"));
process.on("unhandledRejection", err => logger.error({ err }, "unhandled rejection"));
```

Route to Sentry (`security-worker-bee` handles credential configuration), Datadog, or similar. Never swallow errors silently in a production bot.
