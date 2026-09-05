# Queen Bee Stinger

The forge of The Hive. This skill creates every other component of the Hive agentic development system: rules, plugins, commands (Beekeeper Tools), agents (Bees), and skills (Stingers), across the four supported harnesses: Claude Code, Cursor, ChatGPT Codex, and Claude Cowork.

It replaces two earlier tools: Anthropic's original skill-creator and the Hive's stinger-forge. Where those were single-harness and research-thin, this one is grounded in a dedicated research corpus and covers all five component types on all four harnesses.

## Why it exists

Harnesses move fast and their docs disagree with each other, with community writeups, and sometimes with themselves. Authoring a component from memory produces spec drift: skills that fail Cowork upload, rules Cursor silently ignores, MCP configs Codex never loads. This skill pins every authoring decision to downloaded primary sources so the components it forges actually load where they're supposed to.

## Structure

```
queen-bee-stinger/
├── SKILL.md                      The forge workflow and hard portability rules
├── README.md                     This file
├── guides/
│   ├── the-hive-architecture.md              System model, pairing law, Ship Gate
│   ├── beekeeper-registration.md             Registering new Bee and Stinger pairs
│   ├── vibe-coding-tools-reference-update.md Keeping repo references in sync
│   ├── harness-support-matrix.md             What each harness supports, at a glance
│   └── per-type-per-harness-specific-guide.md  Deep authoring procedures, all 20 combos
└── references/
    ├── research/
    │   ├── distilled-research-articles.md    Cited digest of all research
    │   ├── distilled-<harness>.md            Per-harness digests
    │   └── raw/                              59 archived primary sources
    ├── scripts/
    │   ├── per-type-validation.py            Validate any component per harness
    │   ├── cowork-skill-packager.py          Validate and zip .skill for Cowork
    │   └── cowork-plugin-packager.py         Validate and zip plugins for Cowork
    └── templates/
        ├── skills/      Reference SKILL.md template + harness field reference
        ├── agents/      Hive Bee template + harness field reference
        ├── rules/       Reference .mdc template + harness field reference
        ├── commands/    Hive command template + harness field reference
        └── plugins/     Working plugin skeleton + harness field reference
```

## Quick start

Ask the orchestrator to forge a component and name the target harnesses. Examples:

- "Forge a new stinger for Postgres migration safety, all four harnesses"
- "Build a Bee and Stinger pair for API contract testing, register them with the beekeeper"
- "Turn this checklist into a Cursor rule and a matching CLAUDE.md section"
- "Package the marketing plugin for Cowork and tell me what breaks"

The skill walks the forge workflow: intent, support matrix, per-type guide, template, conventions, validation, registration.

## Provenance

Research window 2026-02-14 to 2026-08-14. 289 sources reviewed, 59 raw documents archived under `references/research/raw/`, every distilled claim cited back to its source file. Known conflicts between sources are flagged in the guides rather than silently resolved.

## Hive placement

Orchestrator level. No paired Bee. The other skills at this level are `beekeeper-suit` and `get-started-stinger`. Everything this skill forges follows the pairing law: every Bee gets a Stinger, every Stinger gets a Bee.

Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).
