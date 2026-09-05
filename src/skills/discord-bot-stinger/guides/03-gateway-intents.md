# 03: Gateway Intents

How to declare the minimum required intents, understand privileged vs standard intents, and navigate the verification gate.

*Sources: `research/external/2026-05-20-discord-privileged-intents.md`, `research/external/2026-05-20-discordpy-intents-primer.md`, `research/external/2026-05-20-discord-intents-explainer.md`, `research/external/2026-05-20-discord-privileged-intents-best-practices.md`*

---

## Standard vs Privileged Intents

| Category | Intents | Requires approval? |
|----------|---------|-------------------|
| **Standard** | `GUILDS`, `GUILD_MESSAGES`, `GUILD_VOICE_STATES`, `DIRECT_MESSAGES`, etc. | No |
| **Privileged** | `GUILD_MEMBERS`, `GUILD_PRESENCES`, `MESSAGE_CONTENT` | Yes, after 75 guilds |

Privileged Intents require you to:
1. Enable them in the **Discord Developer Portal** for your application.
2. For bots in **fewer than 75 servers**: toggle ON in the portal, no review needed.
3. For bots approaching **75 servers**: submit a Privileged Intent application before hitting 100.
4. For bots at **100+ servers**: hard block, no new guild joins until verified.

---

## Minimum-intent examples

**Voice + slash commands only (no message reading):**
```ts
// discord.js
intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
```

```python
# discord.py
intents = discord.Intents.none()
intents.guilds = True
intents.voice_states = True
```

**Moderation bot that needs member join/leave events:**
```ts
intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,  // Privileged
]
```

**Message content bot (read raw message text):**
```ts
intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,  // Privileged
]
```

---

## The 75 / 100 server boundary

- **75 servers**: Start the Privileged Intent application immediately. The process takes 1-5 business days; don't wait until 90.
- **100 servers**: Discord hard-blocks all new guild joins until verification is complete.
- **Data retention requirement**: If you're applying for `GUILD_MEMBERS` or `GUILD_PRESENCES`, your privacy policy must state a maximum data retention window. Discord requires **30 days or less** for most cases. Longer retention requires a stronger justification.

See `guides/06-verification-checklist.md` for the full application walkthrough.

---

## Partial intents

`discord.py` exposes intent sub-fields that let you enable specific sub-events:

```python
intents = discord.Intents.default()
intents.members = True   # Enables GUILD_MEMBERS (privileged)
intents.presences = False  # Explicit opt-out
```

For discord.js, intents are bit flags; combine them:
```ts
intents: [
  GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates
]
```

---

## Common mistakes

| Mistake | Effect |
|---------|--------|
| Requesting `MessageContent` without enabling it in portal | Every `message.content` returns an empty string silently |
| Requesting all intents with `Intents.all()` or `GatewayIntentBits.All` | Unnecessary privileged intent requests + verification gate triggered immediately |
| Forgetting `GUILD_VOICE_STATES` for a voice bot | Bot cannot see voice channel state; `joinVoiceChannel` fails |
| Declaring `GUILD_MEMBERS` without a privacy policy URL | Privileged intent application rejected immediately |
