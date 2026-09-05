---
source_url: https://discordpy.readthedocs.io/en/latest/intents.html
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: intents
url: https://discordpy.readthedocs.io/en/latest/intents.html
fetched: 2026-05-20
---

# discord.py: A Primer to Gateway Intents

## Summary

Official discord.py documentation on intents. Covers how to configure `discord.Intents`, the default intents (all except presences, members, message_content), and detailed guidance on when each privileged intent is needed. Includes practical code showing `intents.members = True` and `intents.message_content = True` patterns.

## Key quotations / statistics

- "The intents that are necessary for your bot can only be dictated by yourself."
- "default intents are defined here to have all intents enabled except presences, members, and message_content"
- "Enabling privileged intents when your bot is in over 100 guilds requires going through [verification]"
- Gateway strict rate limit: "120 requests per 60 seconds"
- "Even if you enable intents through the developer portal, you still have to enable the intents through code as well"

## Intents code pattern

```python
import discord
from discord.ext import commands

# Minimal intents (no privileged)
intents = discord.Intents.default()
intents.typing = False        # reduce noise
intents.presences = False     # default off

# Add privileged intents only when actually needed
intents.members = True        # for join/leave tracking
intents.message_content = True  # for prefix commands / content reading

bot = commands.Bot(command_prefix='!', intents=intents)
```

## Do-I-need-it checklist

**Presence Intent**: Do you use member statuses, activities (Playing/Listening), or custom status?

**Members Intent**: Do you track join/leave events? Do you need to fetch the full member list? Do you track nickname/role changes? Do you need high-accuracy member cache?

**Message Content Intent**: Do you use prefix commands? Do you check message content, attachments, embeds, or components? Do you check polls content?

## Annotations for stinger-forge

- **guides/00-principles.md**: The "Portal alone does not grant events; code and Portal must align" is a critical point: bots often enable intents in the portal but forget the code side. Both must agree.
- **templates/slash-command-discord-py.py**: Should use `discord.Intents.default()`, no privileged intents unless the specific use case requires them.
- The `intents.typing = False` / `intents.presences = False` optimizations are worth documenting as a performance tip for bots that don't need these events.
- Member cache and `chunk_guilds_at_startup` configuration belongs in guides/05-scaling-ops.md: chunking all guilds at startup is expensive for large bots.
