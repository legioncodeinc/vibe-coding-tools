# discord-bot-wasp-drone

## Domain
This Drone owns the Discord bot and application developer surface end to end: SDK selection (discord.js v14/v15, discord.py 2.x, Serenity/Poise for Rust), slash and context-menu command authoring, interactive components (buttons, modals, select menus), voice playback via Lavalink 4 with DAVE-compliant clients, gateway-vs-HTTP architecture, sharding, rate-limit handling, and the bot verification checklist that gates growth past 100 servers.

## Paired Stinger
[discord-bot-stinger](../../discord-bot-stinger) - SDK selection, slash command authoring, gateway intents, voice pipeline (with the current-stable version table), scaling ops, and the verification checklist.

## Trigger phrases
- "add a slash command"
- "set up voice"
- "my bot hits 100 servers"
- "migrate to discord.js v14"
- "wire up a modal"
- "review this discord.py bot"
- "bot verification checklist"
- "gateway intents for this bot"

## Do NOT route when
- The ask is general Python packaging unrelated to a Discord bot: that's python-wasp-drone.
- The ask is the container or CI shape the bot deploys through: that's devops-wasp-drone.
- The ask is credential vault integration for the bot token: that's security-wasp-drone.
- The ask is the database schema for bot state (guild configs, user data): that's db-wasp-drone.
- The library in question is Wavelink for voice: this Drone will not recommend it, it's abandoned; redirect to Mafic/lavalink.py or Shoukaku/Lavalink-Client.

## Inputs the Drone needs
- Which SDK the bot uses or should use (discord.js, discord.py, Serenity/Poise)
- Current server count, relevant near the 75-server verification trigger
- Whether voice is in scope, and which voice library is currently wired
- Development vs production command registration scope (guild vs global)

## Outputs
- Slash command, button, modal, or select-menu code with severity-tagged audit findings
- A voice queue setup using a DAVE-compliant client
- A filled bot-verification checklist

## Commonly sequenced with
- python-wasp-drone or the relevant language Drone: general packaging concerns outside the Discord SDK surface
- devops-wasp-drone: containerizing and deploying the bot process
- security-wasp-drone: token vault storage and credential rotation
- db-wasp-drone: schema for any persisted bot state
