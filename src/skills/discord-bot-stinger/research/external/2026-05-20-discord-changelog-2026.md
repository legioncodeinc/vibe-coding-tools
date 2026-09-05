---
source_url: https://discord.com/developers/docs/change-log
retrieved_on: 2026-05-20
source_type: changelog
authority: high
relevance: medium
topic: api-versioning
url: https://discord.com/developers/docs/change-log
fetched: 2026-05-20
---

# Discord Developer Docs: Change Log (Nov 2025 - May 2026 window)

## Summary

Official Discord changelog noting significant API changes in the research window. Two major items: DAVE (E2EE voice protocol) mandatory from March 1, 2026 for all audio/video calls; and a new rate limit on large guild member request operations rolling out October 2025. The Create Guild endpoint (POST /guilds) was restricted starting July 15, 2025.

## Key quotations / statistics

- "To support our long-term privacy goals, we will only support E2EE calls starting on March 1st, 2026 for all audio and video conversations in direct messages (DMs), group messages (GDMs), voice channels, and Go Live streams on Discord."
- "After that date, any client or application not updated for DAVE support will no longer be able to participate in Discord calls."
- Create Guild endpoint (POST /guilds) restricted for applications starting **July 15, 2025**: bots can no longer create guilds, existing bot-owned guilds transferred to real users
- Rate limit on requesting all guild members in very large guilds: rolled out to all servers **October 1, 2025**

## Annotations for stinger-forge

- **guides/04-voice-pipeline.md**: DAVE protocol enforcement (March 1, 2026) is the primary reason Wavelink's abandonment is critical. All voice clients used must support DAVE.
- **guides/05-scaling-ops.md**: The guild member request rate limit change (Oct 2025) affects any bot that bulk-fetches member lists. Audit member fetch patterns against new limits.
- **guides/00-principles.md**: Bots can no longer create or own guilds as of July 2025. This changes the architecture for any "auto-create server" bot pattern.
- The DAVE requirement means bots participating in voice channels must update their Lavalink client; unmaintained libraries (Wavelink, Lavacord) may not have received the DAVE update.
