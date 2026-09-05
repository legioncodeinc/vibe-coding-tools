---
source_url: https://support-dev.discord.com/hc/en-us/articles/6207308062871-What-are-Privileged-Intents
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: verification-intents
url: https://support-dev.discord.com/hc/en-us/articles/6207308062871
fetched: 2026-05-20
---

# Discord Developer Support: What Are Privileged Intents?

## Summary

Official Discord documentation defining the three privileged Gateway intents. Unverified apps in under 100 servers can enable privileged intents freely via the Developer Portal toggle. Verified apps (or apps approaching 100 servers) must apply for approval at 75+ servers. The three privileged intents are: GUILD_PRESENCES, GUILD_MEMBERS, MESSAGE_CONTENT. Minimum-intent principle is strongly enforced by Discord's review process.

## Key quotations / statistics

- "Unverified apps may use Privileged Intents freely, but must enable them in their app's settings."
- "However, verified apps (required for apps in 100+ guilds) will need to apply for access to these intents when they are in 75 servers or more."
- "apps in fewer than 100 servers can use Privileged Intents without needing to apply; just turn them on from the bot's page on the Developer Portal"
- Intent application opens at **75 servers** (not 100), applies to the verification form too.

## Three privileged intents

| Intent | Controls |
|--------|----------|
| GUILD_PRESENCES | Presence updates: online/offline/status, activities (Playing, Listening, etc.) |
| GUILD_MEMBERS | Member join/leave/update events; ability to request full guild member list |
| MESSAGE_CONTENT | Read access to `content`, `embeds`, `attachments`, `components` fields of messages from non-DM/non-mention contexts |

## What MESSAGE_CONTENT does NOT block

- Messages the bot sends
- Messages the bot receives in DMs
- Messages in which the bot is @mentioned
- Message objects received via interaction payloads (buttons, etc.)

## Application requirements (from policy docs)

To be approved for MESSAGE_CONTENT, the use case must:
- Provide a "unique, compelling, and/or transformative experience"
- Be non-invasive, privacy-first
- Include a Privacy Policy URL
- Not be feasibly replaced by interactions (slash commands)
- Not store data longer than 30 days without justification

## Annotations for stinger-forge

- **Directly informs guides/06-verification-checklist.md**: The application threshold is at 75 servers (not 100). Bots should begin the process at 75 to avoid hitting the hard wall at 100. discord-bot-worker-bee's critical directive "Surface the bot-verification deadline before 75 servers, not at 100" is confirmed by official docs.
- **guides/00-principles.md (minimum-intent principle)**: Discord's review is strict about over-privileged bots. Always declare only needed intents in code and portal.
- **Contradiction to watch**: Community tutorials say "100 servers" as the trigger; official docs say "75 servers" to apply, "100 servers" as the hard enforcement boundary. The Command Brief's directive (75 servers) is correct.
- Data retention > 30 days is a documented denial reason. Bots should design their storage to respect this.
