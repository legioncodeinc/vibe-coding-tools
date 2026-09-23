# 04: Voice Pipeline

Setting up voice playback using Lavalink 4 and DAVE-compliant client libraries.

*Sources: `research/external/2026-05-20-lavalink-clients-2026.md`, `research/external/2026-05-20-wavelink-deprecated.md`, `research/external/2026-05-20-discord-changelog-2026.md`*

---

## DAVE protocol: mandatory since March 1, 2026

Discord's E2EE audio protocol (DAVE) became mandatory for all voice channels on **March 1, 2026**. Any voice client that does not implement DAVE will **fail to connect** or produce degraded audio in DAVE-enforced channels. Always verify DAVE support before recommending a voice library.

---

## Wavelink is ABANDONED: do not use

The `research/external/2026-05-20-wavelink-deprecated.md` source note confirms the official `PythonistaGuild/Wavelink` repository states "Wavelink is no longer maintained." The `wavelink.dev` documentation URL in the Command Brief no longer reflects an actively maintained library. **Remove any existing wavelink references from bot code.**

---

## Recommended voice clients (2026)

### Python (discord.py bots)

| Library | Status | DAVE support | Notes |
|---------|--------|-------------|-------|
| **Mafic** | Active | Yes | Lavalink 4 client; recommended |
| **lavalink.py** | Active | Yes | Alternative Lavalink 4 Python client |
| wavelink | **Abandoned** | Unknown | Do not use |

**Mafic install:**
```
pip install mafic
```

**Mafic basic setup:**
```python
import mafic

class MyBot(commands.Bot):
    pool: mafic.NodePool

    async def setup_hook(self):
        self.pool = mafic.NodePool(self)
        await self.pool.create_node(
            host="127.0.0.1",
            port=2333,
            label="MAIN",
            password="youshallnotpass",
        )
```

### Node.js / TypeScript (discord.js bots)

| Library | Status | DAVE support | Notes |
|---------|--------|-------------|-------|
| **Shoukaku** | Active | Yes | Full-featured Lavalink 4 client |
| **Lavalink-Client** | Active | Yes | Official-adjacent client |
| DisTube | Uncertain | Unconfirmed | Check `github.com/skick1234/DisTube` for DAVE PR before recommending |

**Shoukaku install:**
```
npm install shoukaku
```

> **TODO: open question:** DisTube DAVE support was not confirmed during the research sweep. Do not recommend DisTube for voice until `github.com/skick1234/DisTube` confirms DAVE compatibility in CHANGELOG or issues.

---

## Lavalink 4 server

All recommendations above require a running **Lavalink v4** server. Lavalink is a standalone Java audio streaming server that the bot client connects to over WebSocket.

**Quick start (Docker):**
```bash
docker run -p 2333:2333 \
  -e "SERVER_PORT=2333" \
  -e "LAVALINK_SERVER_PASSWORD=youshallnotpass" \
  ghcr.io/lavalink-devs/lavalink:4
```

> **TODO: open question:** The exact reference `docker-compose.yml` for Lavalink v4 was not retrieved. Fetch `https://lavalink.dev/getting-started/` for the current canonical Compose file snippet.

**Lavalink configuration file (`application.yml`):**
```yaml
server:
  port: 2333
  address: 0.0.0.0
lavalink:
  plugins: []
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      soundcloud: true
      http: true
```

---

## Queue model

A production voice queue needs:

1. **Connect** to a voice channel before playing.
2. **Queue tracks** in an in-memory list (or Redis for multi-shard bots).
3. **On track end**, pop the next item and call `play()`.
4. **Handle edge cases**: bot kicked from voice channel, voice channel emptied (auto-leave), track error (skip or retry).

**discord.js + Shoukaku (conceptual skeleton):**
```ts
const player = await shoukaku.joinVoiceChannel({
  guildId: guild.id,
  channelId: voiceChannel.id,
  shardId: 0,
  deaf: true,
});

const result = await player.node.rest.resolve("ytsearch:lofi beats");
if (!result.tracks.length) return;
player.playTrack({ track: result.tracks[0] });

player.on("end", () => {
  const next = queue.shift();
  if (next) player.playTrack({ track: next });
});
```

---

## Shard considerations for voice

Each shard maintains its own gateway connection. A `ShardingManager`-based bot must ensure the voice channel's guild is on the same shard as the player. Use `ShardClientUtil.shardIdForGuildId(guildId, totalShards)` to verify.
