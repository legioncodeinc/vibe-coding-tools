"""
Minimal idiomatic slash command template for discord.py 2.x.

Replace placeholders:
  COMMAND_NAME        -- lowercase, hyphens OK, max 32 chars
  COMMAND_DESCRIPTION -- 1-100 chars
  GUILD_ID            -- your test guild ID (int); remove for global commands
"""
import os
import discord
from discord import app_commands


class MyBot(discord.Client):
    def __init__(self):
        super().__init__(intents=discord.Intents.default())
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        # Guild-scoped for dev (instant); remove `guild=` for global (1 hour delay)
        test_guild = discord.Object(id=GUILD_ID)
        self.tree.copy_global_to(guild=test_guild)
        await self.tree.sync(guild=test_guild)


client = MyBot()
GUILD_ID = int(os.environ.get("TEST_GUILD_ID", "0"))


@client.tree.command(name="COMMAND_NAME", description="COMMAND_DESCRIPTION")
@app_commands.describe(option_name="OPTION_DESCRIPTION")
async def my_command(
    interaction: discord.Interaction,
    option_name: str,  # Remove if no options needed
) -> None:
    # For fast responses (< 3 seconds):
    await interaction.response.send_message(f"Response: {option_name}", ephemeral=False)

    # For slow operations (> 3 seconds), replace above with:
    # await interaction.response.defer()
    # result = await your_slow_operation()
    # await interaction.followup.send(result)


client.run(os.environ["DISCORD_TOKEN"])
