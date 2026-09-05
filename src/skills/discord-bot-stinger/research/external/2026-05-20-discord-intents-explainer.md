---
source_url: https://gist.github.com/advaith1/e69bcc1cdd6d0087322734451f15aa2f
retrieved_on: 2026-05-20
source_type: github
authority: medium
relevance: high
topic: intents
url: https://gist.github.com/advaith1/e69bcc1cdd6d0087322734451f15aa2f
fetched: 2026-05-20
---

# Discord Gateway Intents Explainer (advaith1 Gist)

## Summary

Comprehensive community explainer (widely cited, treated as reference material) covering what each privileged intent actually controls, common misconceptions, and how to enable them per bot size. Clarifies several things developers routinely get wrong: the member count case, guild member caching, and the v6 vs v9/v10 gateway differences.

## Key quotations / statistics

- discord.js v14 uses **Gateway v10**
- discord.py v2 uses **Gateway v10**
- "You do not need, and will not get, privileged intents to get a 'user count' for your bot."
- "You do not need privileged intents to get a server's member count or online member count."
  - Instead: fetch guild and use `approximate_member_count` and `approximate_presence_count`
- "You should be fetching members/users when needed instead of relying on your bot's member/user cache."

## What each privileged intent is actually needed for

### GUILD_MEMBERS
- Needed: member join/leave/update events, full guild member list requests
- NOT needed: getting message author data, fetching a specific member by ID, getting member count (use approximate_member_count)

### GUILD_PRESENCES
- Needed: presence updates (Playing/Watching/Listening), custom status, user status (online/idle/dnd/offline)
- NOT needed: setting the bot's own status/presence

### MESSAGE_CONTENT
- Needed: reading `content`, `embeds`, `attachments`, `components` fields of messages in guild channels
- NOT needed: sending messages, getting message metadata (author, timestamp), DM messages, @mention messages, interaction payloads

## Gateway version table

| Library | Gateway version |
|---------|----------------|
| discord.js v14 | Gateway v10 |
| discord.py v2 | Gateway v10 |
| discord.js v13 | Gateway v9 |

## Annotations for stinger-forge

- **guides/00-principles.md**: The `approximate_member_count` alternative for "user count" is an important escape hatch. Bots that just want to display server member counts do NOT need `GUILD_MEMBERS`.
- **guides/06-verification-checklist.md**: "You will not be approved for privileged intents for userinfo/serverinfo commands": this is critical guidance for intent application justification prose.
- **Common misconception documented**: Many developers enable `MESSAGE_CONTENT` because they want to count messages or respond to @mentions: both work WITHOUT the intent. The intent is only needed to read the actual message body content.
