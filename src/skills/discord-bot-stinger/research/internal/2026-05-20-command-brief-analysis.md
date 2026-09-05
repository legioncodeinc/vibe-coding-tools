---
source_type: internal
authority: high
relevance: high
topic: command-brief
url: file://ai-tools/command-briefs/discord-bot-worker-bee-command-brief.md
fetched: 2026-05-20
---

# Command Brief Analysis: discord-bot-worker-bee

## Summary

Analysis of the `discord-bot-worker-bee-command-brief.md` document. The Bee is a Discord developer platform specialist covering three SDK stacks (discord.js TypeScript, discord.py Python, Serenity Rust), interaction authoring, voice integration, verification, and deployment. The Stinger encodes the 2026-current API surface. Research depth: normal.

## Key directives from Command Brief

### Critical Directives (hard constraints for code samples)
1. **Never hardcode bot tokens**: always `process.env.DISCORD_TOKEN` or `os.environ["DISCORD_TOKEN"]`
2. **Always specify minimum required Gateway Intents**: over-privilege triggers the approval gate
3. **Pin SDK major versions** in package manifests: discord.js and discord.py break on minor bumps
4. **Surface verification deadline before 75 servers**: not at 100 (application takes 1-5 business days)
5. **Always recommend test guild for command registration**: global = 1hr propagation delay, guild = instant

### Overlap Boundaries
- `python-worker-bee` owns: Python packaging (uv, pyright, Ruff), general Python tooling
- `devops-worker-bee` owns: Dockerfile and CI pipelines (worker-bee can author env var contract + reference Dockerfile stub)
- `security-worker-bee` owns: token rotation, vault integration (worker-bee only enforces "never hardcode" rule)
- `db-worker-bee` owns: bot state database schema

### Expected Guides Structure
1. `guides/00-principles.md`: gateway-vs-webhook decision tree, minimum-intent, command scope (guild vs global), token discipline
2. `guides/01-sdk-selection.md`: discord.js (TS/Node.js), discord.py (Python), Serenity (Rust), hybrid pattern
3. `guides/02-slash-commands.md`: Builder API vs raw JSON, autocomplete, option types, subcommand groups, DeferReply/FollowUp
4. `guides/03-components-modals.md`: custom_id namespacing, timeout handling, modal validation, ephemeral flows
5. `guides/04-voice-pipeline.md`: Lavalink 4 Docker recipe, wavelink/alternative client, queue+event model, edge cases
6. `guides/05-scaling-ops.md`: auto-sharding, REST-only mode, rate-limit handling, health checks
7. `guides/06-verification-checklist.md`: terms, privacy policy, intent justifications, support server, timeline

### Expected Templates
- `templates/slash-command-discord-js.ts`: idiomatic discord.js v14 slash command
- `templates/slash-command-discord-py.py`: idiomatic discord.py 2.x app_commands
- `templates/lavalink-queue-discord-js.ts`: Lavalink 4 + client queue setup

### Open Questions FROM the Command Brief (for stinger-forge to confirm)
1. "Does discord.js v15 ship a stable release by May 2026, or is it still in release-candidate?" **ANSWERED**: Still pre-release. Use v14.25.1.
2. "Is wavelink 3 the current stable for discord.py voice, or has it been superseded?" **ANSWERED**: Wavelink is ABANDONED. Use Mafic or lavalink.py instead.

## Annotations for stinger-forge

- The two open questions from the brief have been answered by the research. stinger-forge should prominently note both in `SKILL.md` critical-knowledge section.
- The Serenity (Rust) SDK is listed in scope but will have less research depth available in the external folder: stinger-forge may need to pull from `https://docs.rs/serenity/latest/serenity/` directly.
- The DisTube alternative (mentioned in guides/04) is NOT Lavalink-based: it's a standalone discord.js audio library. Include as a lighter-weight option for simple music bots that don't need Lavalink's server architecture.
