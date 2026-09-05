---
name: "discord-bot-stinger"
description: "Discord bot and application specialist for discord.js (v14/v15), discord.py 2.x, and Serenity (Rust). Covers slash commands, interactive components (buttons, select menus, modals), voice pipeline (Lavalink 4 + DAVE-compliant clients), gateway-vs-HTTP-endpoint architecture, rate-limit handling, shard management, and the bot verification path past 100 servers. Use when building, reviewing, or debugging any Discord bot or application: SDK selection, command registration, component flows, voice queues, scaling, or the bot-verification checklist. Do NOT use for general Python packaging (python-worker-bee), container/CI shapes (devops-worker-bee), credential vault integration (security-worker-bee), or database schema design for bot state (db-worker-bee)."
license: MIT
---

# discord-bot-stinger

Equips `discord-bot-worker-bee` to build, review, and audit Discord bots and applications on the 2026 Discord API surface. Read this file first on every invocation, then follow the guide pointer for the specific task.

---

## Quick-reference: critical API facts (May 2026)

| Fact | Value | Source |
|------|-------|--------|
| discord.js stable | **v14.25.1** (v15 pre-release, ~94% milestone; not production-ready) | `research/external/2026-05-20-discordjs-v15-status.md` |
| discord.py stable | **v2.x** (CommandTree + app_commands) | `research/external/2026-05-20-discordpy-app-commands.md` |
| Wavelink status | **ABANDONED**: do not recommend | `research/external/2026-05-20-wavelink-deprecated.md` |
| Voice clients (Python) | **Mafic** or **lavalink.py** (both DAVE-compliant) | `research/external/2026-05-20-lavalink-clients-2026.md` |
| Voice clients (Node.js) | **Shoukaku** or **Lavalink-Client** (both DAVE-compliant) | `research/external/2026-05-20-lavalink-clients-2026.md` |
| Lavalink version | **v4** | `research/external/2026-05-20-lavalink-clients-2026.md` |
| DAVE protocol | Mandatory in all voice channels since **March 1, 2026** | `research/external/2026-05-20-discord-changelog-2026.md` |
| Discord API version | **v10** (Gateway v10) | `research/external/2026-05-20-discord-api-v10-changes-2026.md` |
| Sharding required at | **2,500 guilds** (hard enforcement) | `research/external/2026-05-20-discord-sharding-guide.md` |
| Privileged intent gate | Apply at **75 servers**; hard block at **100** | `research/external/2026-05-20-discord-privileged-intents.md` |
| Data retention limit | **30 days** max for privileged intent approval | `research/external/2026-05-20-discord-privileged-intents.md` |
| Global command propagation | **~1 hour** | `research/external/2026-05-20-discord-application-commands-spec.md` |
| Guild command propagation | **Instant**: use in dev | `research/external/2026-05-20-discord-application-commands-spec.md` |
| Modal custom_id max | **100 characters** | `research/external/2026-05-20-discord-components-modals.md` |
| Buttons per message | **25 max** (5 action rows × 5 buttons) | `research/external/2026-05-20-discord-components-modals.md` |
| Node.js minimum | **22.12.0** for discord.js | `research/external/2026-05-20-discordjs-v14-slash-commands.md` |

---

## Critical directives (non-negotiables)

Every code sample, review comment, and recommendation from this stinger must respect:

1. **Never hardcode bot tokens or client secrets.** Use `process.env.DISCORD_TOKEN` (JS) or `os.environ["DISCORD_TOKEN"]` (Python). Tokens committed to source are harvested by secret-scanning bots immediately.
2. **Always specify the minimum required Gateway Intents.** Over-privileged intents trigger the Privileged Intent approval gate, slow verification, and increase PII exposure. See `guides/03-gateway-intents.md`.
3. **Pin SDK major versions in package manifests.** discord.js and discord.py introduce breaking changes. Unpinned installs silently break bots in CI.
4. **Surface bot-verification at 75 servers, not 100.** The verification application takes 1-5 business days; missing the gate hard-blocks new guild joins. See `guides/06-verification-checklist.md`.
5. **Register commands to a test guild during development.** Global registration has ~1 hour propagation delay; guild-scoped is instant. See `guides/02-slash-commands.md`.
6. **Do not recommend Wavelink.** It is abandoned. Use Mafic/lavalink.py (Python) or Shoukaku/Lavalink-Client (Node.js). See `guides/04-voice-pipeline.md`.
7. **All new voice code must use DAVE-compliant clients.** The DAVE E2EE protocol is mandatory in all voice channels since March 1, 2026.

---

## Guide index

| Guide | When to use |
|-------|-------------|
| `guides/00-principles.md` | Architecture decisions: gateway vs HTTP, intent scoping, token hygiene |
| `guides/01-sdk-selection.md` | Choosing between discord.js, discord.py, Serenity, and forks |
| `guides/02-slash-commands.md` | Authoring slash, user-context, message-context commands; DeferReply pattern |
| `guides/03-gateway-intents.md` | Minimum-intent discipline, privileged intents, partial intents |
| `guides/04-voice-pipeline.md` | Lavalink 4 setup, DAVE-compliant clients, queue + event model |
| `guides/05-scaling-ops.md` | Sharding, REST-only mode, rate-limit handling, container health checks |
| `guides/06-verification-checklist.md` | Bot verification step-by-step (75-server trigger, 100-server hard block) |
| `guides/07-components-modals.md` | Buttons, select menus, modals, custom_id namespacing, ephemeral flows |

---

## Template index

| Template | Purpose |
|----------|---------|
| `templates/slash-command-discord-js.ts` | Minimal idiomatic slash command for discord.js v14 |
| `templates/slash-command-discord-py.py` | Minimal idiomatic slash command using discord.py app_commands |
| `templates/voice-queue-discord-js.ts` | Lavalink 4 + Shoukaku queue stub for discord.js |
| `templates/bot-verification-checklist.md` | Fillable checklist for the 100-server verification process |
| `templates/audit-report.md` | Skeleton for a full bot audit report |

---

## Example index

| Example | Demonstrates |
|---------|-------------|
| `examples/happy-path-slash-command.md` | End-to-end: register command, handle interaction, DeferReply |
| `examples/edge-case-modal-timeout.md` | Modal flow with orphaned-interaction handling |

---

## Open questions (flagged by scripture-historian)

> **TODO: stinger-forge open questions; resolve before next refresh:**

1. **Serenity/Poise (Rust)**: API surface not fully covered in research. Guides reference Rust conceptually; confirm `poise` slash command macro syntax from `docs.rs/poise` before next refresh.
2. **DisTube DAVE support**: Not confirmed. `guides/04-voice-pipeline.md` omits DisTube from active recommendations until DAVE compatibility is verified at `github.com/skick1234/DisTube`.
3. **Lavalink 4 Docker Compose YAML**: Reference snippet not retrieved. `guides/04-voice-pipeline.md` provides the install URL; embed the snippet on next refresh.
4. **discord.js REST rate-limit knobs**: Specific `RESTOptions` fields not retrieved. `guides/05-scaling-ops.md` covers the pattern; add specific field names on next refresh.
5. **Pycord vs discord.py**: Pycord is a maintained fork with growing adoption. `guides/01-sdk-selection.md` acknowledges the fork; defaults remain the Rapptz main-line unless the user specifies Pycord.

---

## Refresh cadence

- **Trigger immediately**: discord.js v15 reaches stable; Wavelink resumes maintenance (check `github.com/PythonistaGuild/Wavelink`); Discord announces API v11.
- **Annual review**: Full `normal`-depth scripture-historian re-run.
- **Quarterly**: Skim `discord.com/developers/docs/change-log` for breaking changes.

---

*Forged by stinger-forge from `ai-tools/command-briefs/discord-bot-worker-bee-command-brief.md` + `research/research-summary.md`. Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
