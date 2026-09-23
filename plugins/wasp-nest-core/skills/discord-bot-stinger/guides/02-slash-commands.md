# 02: Slash Commands

How to author application commands (slash, user-context, message-context), register them, and handle interactions correctly.

*Sources: `research/external/2026-05-20-discord-application-commands-spec.md`, `research/external/2026-05-20-discordjs-v14-slash-commands.md`, `research/external/2026-05-20-discordpy-app-commands.md`*

---

## Command types

| Type | Trigger | discord.js | discord.py |
|------|---------|-----------|-----------|
| Slash command | `/commandname` | `SlashCommandBuilder` | `@app_commands.command` |
| User context menu | Right-click on a user | `ContextMenuCommandBuilder` (UserCommand) | `@app_commands.context_menu` |
| Message context menu | Right-click on a message | `ContextMenuCommandBuilder` (MessageCommand) | `@app_commands.context_menu` |

---

## discord.js: command file pattern (v14)

Each command lives in its own file. See `templates/slash-command-discord-js.ts` for the full stub.

```ts
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply("Pong!");
}
```

**Key rules:**
- `.setName()` must be lowercase, 1-32 chars, no spaces.
- `.setDescription()` must be 1-100 chars.
- Option names follow the same constraints as command names.

---

## discord.py: command pattern (v2.x)

```python
import discord
from discord import app_commands

class MyBot(discord.Client):
    def __init__(self):
        super().__init__(intents=discord.Intents.default())
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        # Guild-scoped for dev; remove guild arg for global
        await self.tree.sync(guild=discord.Object(id=YOUR_GUILD_ID))

@bot.tree.command(name="ping", description="Replies with Pong!")
async def ping(interaction: discord.Interaction):
    await interaction.response.send_message("Pong!")
```

---

## Registration: guild vs global

| | Guild-scoped | Global |
|--|---|---|
| Propagation | Instant | ~1 hour |
| When to use | Development, testing | Production only |
| How | Pass `guild=discord.Object(id=GUILD_ID)` to `.sync()` or the `guild_ids` kwarg | Call `.sync()` / deploy commands without a guild |

**Never register global commands during development.** The 1-hour delay makes iteration painful; stale commands from previous registers linger and confuse testing.

---

## The DeferReply pattern (slow operations)

Discord requires a response within **3 seconds** of receiving an interaction. For anything that may take longer (database queries, API calls, LLM chains):

**discord.js:**
```ts
await interaction.deferReply(); // ephemeral: true for private
// ... long work ...
await interaction.editReply("Result: " + result);
```

**discord.py:**
```python
await interaction.response.defer()
# ... long work ...
await interaction.followup.send("Result: " + result)
```

After `deferReply` / `defer()`, you have **15 minutes** to call `editReply` / `followup.send()`. Missing that window produces an "interaction failed" error visible to the user.

---

## Subcommand groups

Use `addSubcommand()` / `addSubcommandGroup()` when a command has more than 3-4 related variations:

```ts
new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Manage the music queue")
  .addSubcommand(sub => sub.setName("add").setDescription("Add a track"))
  .addSubcommand(sub => sub.setName("clear").setDescription("Clear the queue"))
```

Limit: 25 subcommands per command, 25 options per subcommand.

---

## Autocomplete

Use `setAutocomplete(true)` on a string option, then handle the `AutocompleteInteraction`:

```ts
// discord.js
if (interaction.isAutocomplete()) {
  const focused = interaction.options.getFocused();
  const results = myDatabase.search(focused).slice(0, 25);
  await interaction.respond(results.map(r => ({ name: r.label, value: r.id })));
}
```

Autocomplete response must arrive within **3 seconds**. Return max 25 choices.

---

*See `examples/happy-path-slash-command.md` for a full working slash command flow.*
