---
source_type: internal
authority: high
relevance: high
topic: open-questions
url: internal
fetched: 2026-05-20
---

# Open Questions for stinger-forge: discord-bot-stinger

Compiled by scripture-historian after the research pass. These are unresolved questions that stinger-forge must address during guide authoring.

## Resolved questions (from Command Brief)

### Q1: discord.js v15 stable by May 2026?
**RESOLVED**: No. v15 is still pre-release (~94% milestone). Latest stable is **v14.25.1**. stinger-forge should build templates against v14 and mention v15 pre-release in a "roadmap" note.

### Q2: Is wavelink 3 the current stable for discord.py voice?
**RESOLVED**: Wavelink is **abandoned/unmaintained** (GitHub README says so explicitly). Recommended replacements: **Mafic** (discord.py V2, DAVE ✅), **lavalink.py** (any, DAVE ✅). For discord.js, recommend **Shoukaku** or **Lavalink-Client**.

---

## Open questions for stinger-forge to address during guide authoring

### Q3: Serenity (Rust) SDK current version and feature parity
Research only found the Serenity docs URL (https://docs.rs/serenity/latest/serenity/) in the Command Brief. The `poise` crate (slash command framework built on Serenity) is referenced but not researched. stinger-forge should scrape `docs.rs/serenity` and `docs.rs/poise` for the current stable API before authoring `guides/01-sdk-selection.md` Rust section.

### Q4: DisTube current version and DAVE compatibility
DisTube is mentioned in the Command Brief as a discord.js voice alternative. Research did not confirm whether DisTube has DAVE support (required from March 1, 2026). stinger-forge should check the DisTube GitHub (github.com/skick1234/DisTube) for DAVE support status before recommending it.

### Q5: Lavalink 4 Docker Compose recipe (current)
Research confirmed Lavalink v4 is current but did not retrieve the exact Docker Compose YAML. stinger-forge should fetch `lavalink.dev` installation docs for the current reference Compose file to embed in `templates/lavalink-queue-discord-js.ts` header comment and `guides/04-voice-pipeline.md`.

### Q6: discord.js v14 rate-limit handling API
Research found strategic-level guidance (avoid 429s, handle retry-after) but did not retrieve the specific discord.js `RESTOptions` configuration (e.g., `offset`, `globalRequestsPerSecond`). stinger-forge should check the discord.js REST client API reference for the precise rate-limit configuration knobs.

### Q7: Discord bot verification timeline (2026 SLA)
The Command Brief states verification takes "1-5 business days." Multiple community sources confirmed this range but Discord's official support page does not state an SLA explicitly. stinger-forge should note this as an estimate in the checklist, not a guarantee.

### Q8: Pycord vs discord.py for the Python track
The research found multiple Pycord references (guide.pycord.dev, docs.pycord.dev). Pycord is a maintained discord.py fork with a slightly different API. The Command Brief targets `discord.py` by Rapptz. stinger-forge should briefly note the fork landscape in `guides/01-sdk-selection.md` without treating Pycord as the default.

## Sources to re-fetch if research goes stale

| Priority | URL | Why |
|----------|-----|-----|
| High | https://github.com/PythonistaGuild/Wavelink | Confirm still unmaintained; any revival would change voice recommendations |
| High | https://lavalink.dev/clients | DAVE support table changes as clients update |
| High | https://discordjs.guide/v15 | v15 release status: once stable, guides need updating |
| Medium | https://github.com/skick1234/DisTube | DAVE support status |
| Medium | https://docs.rs/poise | Rust slash command pattern for Serenity section |
| Low | https://discord.com/developers/docs/change-log | Quarterly API changes |
