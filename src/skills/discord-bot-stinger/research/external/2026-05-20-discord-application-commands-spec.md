---
source_url: https://docs.discord.com/developers/interactions/application-commands
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: slash-commands
url: https://docs.discord.com/developers/interactions/application-commands
fetched: 2026-05-20
---

# Discord Developer Docs: Application Commands Reference

## Summary

Official specification for all four application command types (CHAT_INPUT/slash, USER, MESSAGE, PRIMARY_ENTRY_POINT). Covers naming rules, option types (11 total), subcommand groups, autocomplete behavior, localization, context/install-type configuration, and permission management. POST requests to register commands act as upserts (re-registering with same name updates rather than duplicating).

## Key quotations / statistics

- Command names regex: `^[-_'\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$` (with unicode flag); must be lowercase where lowercase exists
- USER and MESSAGE commands may be mixed case and include spaces
- Autocomplete: "may not be set to true if choices are present"
- "making a new command with an already-used name for your application will update the existing command": POST is an upsert
- Command type PRIMARY_ENTRY_POINT (type 4) is for launching Activities from App Launcher

## Application command types

| Name | Type | Description |
|------|------|-------------|
| CHAT_INPUT | 1 | Slash commands (`/`) |
| USER | 2 | Right-click on user → Apps |
| MESSAGE | 3 | Right-click on message → Apps |
| PRIMARY_ENTRY_POINT | 4 | Activity launcher |

## Application command option types

| Name | Value | Notes |
|------|-------|-------|
| SUB_COMMAND | 1 | |
| SUB_COMMAND_GROUP | 2 | |
| STRING | 3 | Supports autocomplete |
| INTEGER | 4 | Supports autocomplete |
| BOOLEAN | 5 | |
| USER | 6 | |
| CHANNEL | 7 | Includes all channel types + categories |
| ROLE | 8 | |
| MENTIONABLE | 9 | Users and roles |
| NUMBER | 10 | Supports autocomplete |
| ATTACHMENT | 11 | Attachment object |

## Subcommand nesting rules

```
VALID:
command
|__ subcommand
|__ subcommand
----
command
|__ subcommand-group
  |__ subcommand

INVALID:
command
|__ subcommand-group  (cannot also have top-level subcommands alongside groups)
|__ subcommand
```

## Annotations for stinger-forge

- **guides/02-slash-commands.md**: All 11 option types documented. The ATTACHMENT type (type 11) is important for bots that accept file uploads. The subcommand nesting rules (cannot mix top-level subcommands with subcommand groups) is a common gotcha.
- **Autocomplete rule**: `autocomplete` and `choices` are mutually exclusive on the same option: cannot have both.
- **Registration as upsert**: Global commands can be re-deployed without deduplication concern; the same name = update operation.
- **Permission management**: `PUT /applications/{id}/guilds/{guild_id}/commands/{cmd_id}/permissions` requires a Bearer token with `applications.commands.permissions.update` scope, not the bot token. This is a common surprise during first integration.
