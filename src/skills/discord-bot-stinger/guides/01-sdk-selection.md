# 01: SDK Selection

Choose the right SDK before writing any code. The choice drives the language, toolchain, and ecosystem you inherit.

*Sources: `research/external/2026-05-20-discordjs-v14-slash-commands.md`, `research/external/2026-05-20-discordpy-app-commands.md`, `research/external/2026-05-20-discord-api-v10-changes-2026.md`*

---

## discord.js (Node.js / TypeScript): recommended default

**Use when:** TypeScript ecosystem, team is JS-native, or you want the most community resources.

- Current stable: **v14.25.1**. Do not use v15 in production; it is ~94% milestone-complete as of May 2026 but explicitly flagged as pre-release on the official guide.
- Node.js minimum: **22.12.0**
- Installs: `npm install discord.js` (pins to a version in `package.json`)
- TypeScript users: types are bundled; no separate `@types` package needed.

**discord.js v15 migration note:** v15 brings removal of deprecated v14 patterns (e.g., some `Message` properties). Watch the [v15 migration guide](https://discordjs.guide/v15) and upgrade only after a stable tag ships.

---

## discord.py (Python): recommended for Python stacks

**Use when:** Python ecosystem, data-heavy bots, or tight integration with Python ML/data tooling.

- Current stable: **v2.x** with the `app_commands` / `CommandTree` pattern.
- Python minimum: **3.8+** (3.11+ recommended for performance).
- Installs: `pip install discord.py` (pin in `requirements.txt` or `pyproject.toml`)
- Packaging: use `uv` for dependency management; delegate packaging concerns to `python-worker-bee`.

### Pycord note

Pycord (`py-cord`) is a maintained fork of the original discord.py library with its own release cadence and documentation at `docs.pycord.dev`. It has grown in adoption since 2024. This stinger defaults to the Rapptz `discord.py` main-line because it has the most community support, the most Stack Overflow answers, and is the SDK the Discord developer documentation links to. If the user's project already uses Pycord, apply the same patterns; the API surface is nearly identical.

---

## Serenity + Poise (Rust): for performance-critical bots

**Use when:** extreme performance requirements, embedded environments, or Rust-native teams.

- Library: `serenity` + `poise` (framework layer for slash commands)
- Slash command pattern: `poise` macros (`#[poise::command(slash_command)]`)
- DAVE voice support: available via `songbird` with a DAVE-compliant backend.

> **TODO: open question:** Serenity/Poise Rust API was not fully covered in the research sweep. Confirm current `poise` slash command macro syntax from `docs.rs/poise` before advising on a Rust bot project.

---

## Decision tree

```
Bot language?
├── JavaScript / TypeScript → discord.js v14.25.1
├── Python                  → discord.py 2.x (or Pycord if project already uses it)
└── Rust                    → Serenity + Poise (confirm current API from docs.rs)

Performance critical?
└── Yes + Rust team → Serenity

Data-heavy (ML, pandas, etc.)?
└── Yes → discord.py

Default / greenfield?
└── discord.js v14 (largest community, most examples, first to receive new features)
```

---

## What NOT to mix

- Do not mix `discord.py` 1.x patterns with 2.x: the `commands.Bot` + `@bot.command` pattern is legacy; use `app_commands.CommandTree` for slash commands.
- Do not mix `discord.js` v13 style (`client.on('interaction')` + manual type checking) with v14 builders API.
- Do not use the Discord.NET (C#) patterns as reference for JS/Python; they are structurally different.
