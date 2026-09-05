# Happy Path: Slash Command (discord.js v14)

A complete end-to-end example of a slash command bot: command registration, handler, DeferReply pattern.

*Demonstrates: `guides/00-principles.md`, `guides/02-slash-commands.md`*

---

## Scenario

Build a `/weather <city>` slash command that calls an external weather API (slow; needs DeferReply).

---

## File structure

```
src/
├── index.ts          # Bot entry point
├── deploy-commands.ts # One-time command registration script
└── commands/
    └── weather.ts    # Slash command definition + handler
```

---

## `src/commands/weather.ts`

```ts
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("weather")
  .setDescription("Get the current weather for a city")
  .addStringOption(opt =>
    opt.setName("city")
      .setDescription("City name")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // Defer immediately — the weather API call may take > 3 seconds
  await interaction.deferReply();

  const city = interaction.options.getString("city", true);

  try {
    const weather = await fetchWeather(city); // your API call
    await interaction.editReply(`Weather in ${city}: ${weather.description}, ${weather.temp}°C`);
  } catch (err) {
    await interaction.editReply("Could not fetch weather. Try again later.");
  }
}

async function fetchWeather(city: string) {
  // Replace with real API call
  return { description: "Sunny", temp: 22 };
}
```

---

## `src/deploy-commands.ts`

```ts
import { REST, Routes } from "discord.js";
import { data } from "./commands/weather";

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

// Guild-scoped for dev; switch to Routes.applicationCommands() for prod
await rest.put(
  Routes.applicationGuildCommands(
    process.env.CLIENT_ID!,
    process.env.GUILD_ID!,
  ),
  { body: [data.toJSON()] },
);

console.log("Commands registered.");
```

Run this script once: `npx ts-node src/deploy-commands.ts`

---

## `src/index.ts`

```ts
import { Client, GatewayIntentBits, Collection } from "discord.js";
import * as weatherCmd from "./commands/weather";

const client = new Client({
  intents: [GatewayIntentBits.Guilds], // minimum needed for slash commands only
});

const commands = new Collection<string, typeof weatherCmd>();
commands.set(weatherCmd.data.name, weatherCmd);

client.once("ready", () => console.log(`Logged in as ${client.user?.tag}`));

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(err);
    const msg = { content: "An error occurred.", ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
```

---

## What this example demonstrates

- **Minimum intents**: only `Guilds`, no `MessageContent`, no `GuildMembers`.
- **DeferReply**: immediately defer before the slow API call.
- **Error handling**: handles both pre-reply and post-deferral error paths.
- **Guild-scoped registration**: fast iteration in dev, swap to global for prod.
- **Token from env**: `process.env.DISCORD_TOKEN`, never hardcoded.
