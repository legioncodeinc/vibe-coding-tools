---
source_url: https://discordpy.readthedocs.io/en/stable/ext/commands/api.html
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: slash-commands
url: https://discordpy.readthedocs.io/en/stable/ext/commands/api.html
fetched: 2026-05-20
---

# discord.py v2 app_commands API Reference

## Summary

discord.py v2 introduced the `app_commands` module for slash/application commands. The core pattern uses `discord.app_commands.CommandTree` attached to a `discord.Client` or `commands.Bot`. Commands are registered with `@tree.command()` or `@app_commands.command()`. The `setup_hook` coroutine is the recommended place to sync commands. Guild-scoped sync is instant; global sync takes up to 1 hour. Autocomplete is wired via the `@command.autocomplete('param_name')` decorator. Transformers enable custom type coercion.

## Key quotations / statistics

- "setup_hook is a special asynchronous method of the Client and Bot classes which can be overwritten to perform numerous tasks. This method is safe to use as it is always triggered before any events are dispatched."
- "default intents are defined here to have all intents enabled except presences, members, and message_content"
- `commands.Bot` already has a `tree` property; `discord.Client` requires manually creating `CommandTree`
- `hybrid_command` creates a command that works as both prefix command and slash command (requires `message_content` intent for prefix path)

## Key code pattern

```python
import discord
from discord import app_commands
from discord.ext import commands

MY_GUILD = discord.Object(id=123456789)  # dev guild for instant sync

class MyBot(commands.Bot):
    def __init__(self) -> None:
        super().__init__(command_prefix="!", intents=discord.Intents.default())

    async def setup_hook(self) -> None:
        # Copy global commands to guild for instant dev testing
        self.tree.copy_global_to(guild=MY_GUILD)
        await self.tree.sync(guild=MY_GUILD)  # guild sync is instant
        # await self.tree.sync()  # global sync — 1 hour propagation delay

bot = MyBot()

@bot.tree.command()
@app_commands.describe(
    first_value='The first value to add',
    second_value='The second value to add',
)
async def add(interaction: discord.Interaction, first_value: int, second_value: int):
    """Adds two numbers together."""
    await interaction.response.send_message(f'{first_value} + {second_value} = {first_value + second_value}')
```

Autocomplete pattern:
```python
@bot.tree.command()
@app_commands.autocomplete(colour=colour_autocomplete)
async def colour(interaction: discord.Interaction, colour: str):
    ...

async def colour_autocomplete(
    interaction: discord.Interaction,
    current: str,
) -> list[app_commands.Choice[str]]:
    colours = ['red', 'green', 'blue', 'yellow']
    return [
        app_commands.Choice(name=c, value=c)
        for c in colours if current.lower() in c.lower()
    ]
```

## Annotations for stinger-forge

- **Directly informs templates/slash-command-discord-py.py**: Use `commands.Bot` (not raw `discord.Client`) since it auto-provides `self.tree`. Use `setup_hook` for sync.
- **guides/02-slash-commands.md**: Document the guild-vs-global sync gap (guild = instant, global = ~1hr). This is a critical dev pattern the Command Brief explicitly calls out.
- **guides/01-sdk-selection.md**: discord.py v2 is the stable Python SDK. No v3 in sight.
- The autocomplete callback receives `(interaction, current: str)` and must return `list[app_commands.Choice[T]]`, max 25 choices.
- `Transformer` class enables custom type coercion from interaction data; key for complex option types.
