---
source_url: https://github.com/PythonistaGuild/Wavelink
retrieved_on: 2026-05-20
source_type: github
authority: high
relevance: high
topic: voice-pipeline
url: https://github.com/PythonistaGuild/Wavelink
fetched: 2026-05-20
---

# Wavelink GitHub Repository: Deprecation Notice

## Summary

**CRITICAL FINDING**: Wavelink is no longer maintained. The official GitHub README states: "Wavelink is no longer maintained. Visit Lavalink Client for a list of current libraries." This directly affects the Command Brief's question "Is wavelink 3 the current stable for discord.py voice, or has it been superseded?" It has been superseded by its own abandonment. The last published version on PyPI is wavelink 3.4.1 (released 2024-07-13). The Lavalink docs list active Python alternatives.

## Key quotations / statistics

- "# Important: Wavelink is no longer maintained. Visit Lavalink Client for a list of current libraries."
- wavelink 3.4.1: last PyPI release: July 13, 2024
- Wavelink 3 required Lavalink v4+
- Wavelink 3 required Python 3.10+
- "Wavelink is fully typed in compliance with Pyright Strict"
- DAVE (Discord's end-to-end encrypted voice protocol) support status for Wavelink: listed as `✅` on lavalink.dev/clients BUT the repo is marked unmaintained

## Active Python Lavalink alternatives (from lavalink.dev/clients)

| Library | Platform | DAVE Support |
|---------|----------|--------------|
| lavalink.py | Python, Any | ✅ |
| Mafic | Python discord.py V2/nextcord/disnake/py-cord | ✅ |
| Pomice | Python discord.py V2 | ✅ |
| SonoLink | Python discord.py V2/py-cord/disnake/nextcord | ✅ |
| hikari-ongaku | Python Hikari | ✅ |
| lavaplay.py | Python asyncio-based | ✅ |

## Active Node.js Lavalink clients (from lavalink.dev/clients)

| Library | Platform | DAVE Support |
|---------|----------|--------------|
| Moonlink.js | Node.js, Any | ✅ |
| Magmastream | Node.js, Any | ✅ |
| Shoukaku | Node.js, Any | ✅ |
| Lavalink-Client | Node.js discord.js/DiscordDeno/Eris/Any | ✅ |
| FastLink | Node.js, Any | ✅ |
| Riffy | Node.js, Any | ✅ |
| Rainlink | Node.js, Any | ✅ |

## Annotations for stinger-forge

- **CRITICAL for guides/04-voice-pipeline.md**: Do NOT recommend Wavelink for new discord.py bots. The library is abandoned. Recommend `Mafic` or `lavalink.py` as the primary Python alternative.
- **Contradicts the Command Brief**: The Brief lists wavelink 3 docs as a reference material URL. stinger-forge must note this discrepancy and provide the updated recommendation.
- **DAVE support**: Discord mandated E2EE voice (DAVE protocol) support from March 1, 2026. Any Lavalink client used must support DAVE. The `lavalink.dev/clients` page now shows a DAVE column: Wavelink is listed as supported but unmaintained, meaning DAVE fixes may not arrive.
- For discord.js, `Shoukaku` and `Lavalink-Client` are the most widely used. `DisTube` (mentioned in the Command Brief) is a separate, dependency-free alternative that does NOT use Lavalink at all and is worth including in the guide for simpler bots.
