---
source_url: https://discordjs.guide/v15
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: sdk-versioning
url: https://discordjs.guide/v15
fetched: 2026-05-20
---

# discord.js v15 Upgrade Guide (Pre-Release)

## Summary

As of May 2026, discord.js v15 remains in a pre-release state. The official guide explicitly warns: "Version 15 is in a pre-release state, but should be usable! That being said, we do not recommend you update your production instance without careful and thorough testing!" The v15.0.0 milestone on GitHub was approximately 94% complete as of the search date (106 closed, 6 open issues). Requires Node.js 22.12.0 or newer.

## Key quotations / statistics

- "Version 15 is in a pre-release state, but should be usable! That being said, we do not recommend you update your production instance without careful and thorough testing!"
- Node.js 22.12.0 or newer is required (per the main branch docs at discord.js.org/docs/packages/discord.js/main)
- discord.js 15.0.0 milestone: 94% complete, no due date, last updated ~5 days before retrieval
- Latest stable docs shown: v14.25.1 (SlashCommandBuilder API reference)
- Latest documented stable release referenced in search: 14.19.3 (via discord.js.org/docs/packages/discord.js/14.19.3)

## Annotations for stinger-forge

- **Critical for guides/00-principles.md and guides/01-sdk-selection.md**: The answer to the Command Brief question "Does discord.js v15 ship a stable release by May 2026, or is it still in release-candidate?" is confirmed: v15 is still pre-release as of 2026-05-20. `discord-bot-worker-bee` should recommend v14 (currently v14.25.1) for production work, with a note that v15 is usable for greenfield non-production projects.
- **Contradictions**: None found; consistent across multiple sources (guide, GitHub milestone, docs).
- The docs URL pattern for v14 is `discord.js.org/docs/packages/discord.js/14.x.y`: stinger-forge should use the latest v14.x for all code samples.
