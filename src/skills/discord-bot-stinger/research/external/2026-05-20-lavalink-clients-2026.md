---
source_url: https://lavalink.dev/clients
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: voice-pipeline
url: https://lavalink.dev/clients
fetched: 2026-05-20
---

# Lavalink 4: Official Client Libraries Listing (2026)

## Summary

Official Lavalink docs listing of all client libraries with DAVE (Discord's E2EE voice protocol, mandatory from March 1, 2026) support status. Lavalink v4 is the current server version. NodeLink is a performant Node.js alternative to the Lavalink server itself. The page clearly marks unmaintained libraries. DAVE support is now the primary differentiator for choosing an active client.

## Key quotations / statistics

- DAVE (Discord's End-to-End Encrypted Voice) support is mandatory from **March 1, 2026**
- Unmaintained clients listed: Lavacord, TsumiLink, Blue.ts, Nomia: "Unmaintained repositories have not received commits for at least 1 year"
- Lavalink requires Java to run as server

## Full client library table with DAVE support

### Python
| Library | Compatible With | DAVE |
|---------|----------------|------|
| lavalink.py | Any | ✅ |
| Mafic | discord.py V2/nextcord/disnake/py-cord | ✅ |
| Pomice | discord.py V2 | ✅ |
| Wavelink | discord.py V2 | ✅ (but unmaintained) |
| SonoLink | discord.py V2/py-cord/disnake/nextcord | ✅ |
| hikari-ongaku | Hikari (asyncio) | ✅ |
| lavaplay.py | Any asyncio | ✅ |

### Node.js
| Library | Compatible With | DAVE |
|---------|----------------|------|
| Moonlink.js | Any | ✅ |
| Magmastream | Any | ✅ |
| Shoukaku | Any | ✅ |
| Lavalink-Client | discord.js/DiscordDeno/Eris/Any | ✅ |
| FastLink | Any | ✅ |
| Riffy | Any | ✅ |
| Rainlink | Any | ✅ |
| lavaclient v5+ | Any | ✅ |

### Rust
| Library | Compatible With | DAVE |
|---------|----------------|------|
| lavalink-rs | Rust + Python bindings | ✅ |
| Anchorage | tokio-based | ✅ |

## Annotations for stinger-forge

- **guides/04-voice-pipeline.md**: Recommend **Shoukaku** or **Lavalink-Client** for discord.js bots (both have DAVE support and are actively maintained). Recommend **Mafic** for discord.py bots.
- The DAVE requirement is a hard blocker for any unmaintained library post-March 2026. If a bot still uses an old client without DAVE, it cannot participate in voice calls.
- NodeLink (https://github.com/PerformanC/NodeLink) is a Lavalink-compatible server alternative written in Node.js, lighter weight, useful for self-hosted deployments without Java.
- Lavalink server setup: still requires Java (v17+ recommended). The Docker recipe is the cleanest approach for self-hosted bots.
- LavaSrc plugin adds Spotify/Apple Music/Deezer support: important for music bots.
- SponsorBlock plugin adds skip-sponsored-segment support for YouTube content.
