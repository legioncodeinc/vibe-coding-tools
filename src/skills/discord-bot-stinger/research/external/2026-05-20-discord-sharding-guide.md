---
source_url: https://space-node.net/blog/discord-bot-sharding-guide-2026
retrieved_on: 2026-05-20
source_type: blog
authority: medium
relevance: high
topic: sharding-scaling
url: https://space-node.net/blog/discord-bot-sharding-guide-2026
fetched: 2026-05-20
---

# Discord Bot Sharding Guide 2026 (space-node.net)

## Summary

Practitioner blog (March 2026) covering discord.js `ShardingManager` setup, cross-shard communication patterns, and the 2,500-guild threshold. Discord mandates sharding at exactly 2,500 guilds (hard gateway enforcement). Recommended planning start: 2,000 guilds. Each shard runs as a separate Node.js process by default (most stable). Internal sharding (`shards: 'auto'`) is available but not recommended for large bots.

## Key quotations / statistics

- "Discord mandates sharding for bots in 2,500+ guilds"
- "Without it, Discord's API will refuse to let your bot connect"
- "Sharding is only relevant if your app uses gateway events. For webhook callbacks, this is completely irrelevant!"
- "Write code that doesn't assume all guilds are accessible from a single instance"
- Guild assignment formula: `shard_id = (guild_id >> 22) % shard_count`
- Gateway rate limit: 120 events per connection per 60 seconds
- Recommended: 1,000 guilds per shard

## discord.js ShardingManager code

```javascript
// shard_manager.js (entry point instead of index.js)
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/index.js', {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',    // Discord recommends how many shards you need
  mode: 'process'         // Each shard is a separate process (most stable)
});

manager.on('shardCreate', shard => {
  console.log(`Launched shard ${shard.id}`);
});

manager.spawn();
```

Cross-shard communication:
```javascript
// Run on ALL shards and collect results:
const results = await client.shard.broadcastEval(c => c.guilds.cache.size);
const totalGuilds = results.reduce((acc, val) => acc + val, 0);

// Fetch property across shards:
await client.shard.fetchClientValues('guilds.cache.size');
```

Internal sharding (simpler, not recommended for scale):
```javascript
const client = new Client({ shards: 'auto' });
```

## Annotations for stinger-forge

- **guides/05-scaling-ops.md**: Include the `ShardingManager` setup with `totalShards: 'auto'` + `mode: 'process'`. Warn that internal sharding (`shards: 'auto'`) is high-memory for large bots.
- **Key pre-sharding discipline**: "Don't store guild objects in global variables. Don't iterate all guilds for cross-guild features without shard broadcasting. Use a database for shared state."
- **HTTP bots are exempt**: Bots using the HTTP Interactions endpoint instead of Gateway don't need sharding at all.
- Highly available architecture (Kubernetes + NATS JetStream) referenced for 100k+ guilds: this is overkill for most bots. The ShardingManager approach covers most use cases up to ~50k guilds on a single machine.
