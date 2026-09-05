---
source_url: https://discord.js.org/docs/packages/discord.js/14.25.1/SlashCommandBuilder:Class
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: slash-commands
url: https://discord.js.org/docs/packages/discord.js/14.25.1/SlashCommandBuilder:Class
fetched: 2026-05-20
---

# discord.js v14 SlashCommandBuilder API Reference

## Summary

The SlashCommandBuilder class is the primary way to build slash commands in discord.js v14. It supports all Discord option types (string, integer, boolean, user, channel, role, mentionable, number, attachment), subcommands, subcommand groups, locale/localization maps, NSFW flag, default member permissions, and interaction contexts. The `setDefaultPermission` and `setDMPermission` methods are deprecated in favor of `setDefaultMemberPermissions` and `setContexts`. The `toJSON()` method serializes to a REST-compatible payload.

## Key quotations / statistics

- Latest stable v14 as of retrieval: **14.25.1**
- `setDefaultPermission(value: boolean)`: **deprecated**, use `setDefaultMemberPermissions` instead
- `setDMPermission(enabled: boolean)`: **deprecated**, use `setContexts` instead
- `setContexts(...contexts: RestOrArray<InteractionContextType>)`: the modern way to set where a command can be used (guild, bot DM, private channel)
- `setIntegrationTypes(...integrationTypes: RestOrArray<ApplicationIntegrationType>)`: controls whether a command is available in guild-installed vs user-installed apps
- `toJSON()`: serializes to `RESTPostAPIChatInputApplicationCommandsJSONBody`

## Key builder pattern from docs

```typescript
import { SlashCommandBuilder } from '@discordjs/builders';

const boopCommand = new SlashCommandBuilder()
  .setName('boop')
  .setDescription('Boops the specified user, as many times as you want')
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to boop').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('boop_amount').setDescription('How many times to boop')
  );

const rawData = boopCommand.toJSON();
```

Subcommand groups example:
```typescript
const pointsCommand = new SlashCommandBuilder()
  .setName('points')
  .setDescription('Lists or manages user points')
  .addSubcommandGroup((group) =>
    group.setName('manage').setDescription('Shows or manages points')
      .addSubcommand((subcommand) =>
        subcommand.setName('user_points').setDescription("Alters a user's points")
          .addUserOption((option) =>
            option.setName('user').setDescription('The user whose points to alter').setRequired(true)
          )
      )
  );
```

## Annotations for stinger-forge

- **Directly informs templates/slash-command-discord-js.ts**: Use `SlashCommandBuilder` fluent API, export `data` (the builder) + `execute` (the handler) per the recommended file structure from discordjs.guide.
- **Deprecated methods** to warn about: `setDefaultPermission`, `setDMPermission`, should appear in audit checklist.
- **setContexts** is the current (non-deprecated) way to control where commands appear; this is a common migration gap in existing bots.
- The separate `@discordjs/builders` package can be used independently for building payloads without the full client.
