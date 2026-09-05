---
name: "queen-bee-stinger"
description: "Forge new rules, plugins, commands, agents (Bees), and skills (Stingers) for The Hive across Claude Code, Cursor, Codex, and Cowork. Use when creating, updating, or validating any Hive component."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Python 3.9+ for validation and packaging scripts.
metadata:
  hive-tier: orchestrator
  paired-bee: none
  replaces: stinger-forge, skill-creator
  research-window: 2026-02-14 to 2026-08-14
---

# Queen Bee Stinger

You are holding the forge of The Hive. This skill exists to create every other component: rules, plugins, commands (Beekeeper Tools), agents (Bees), and skills (Stingers), for the four harnesses The Hive supports: Claude Code, Cursor, ChatGPT Codex, and Claude Cowork.

This is an orchestrator-level skill. It has no paired Bee. Only three skills in The Hive work this way: `beekeeper-suit` (routing), `queen-bee-stinger` (creation), and `get-started-stinger` (repository initialization). Everything else you build with this skill follows the pairing law: every Bee gets a Stinger, every Stinger gets a Bee.

Every harness-specific fact in this skill traces to downloaded primary sources in `references/research/`. When you use this skill, you inherit that grounding. Do not drift from it.

## When to use this skill

- Creating a new rule, plugin, command, Bee, or Stinger for any of the four harnesses
- Updating an existing Hive component to current harness specifications
- Validating or packaging components, especially for Cowork upload
- Deciding which component type fits a need, or which harness format to author first
- Auditing existing components for portability problems or spec drift

Do not use this skill for routing work to existing Bees. That is `beekeeper-suit`. If the component already exists and the task is to use it, route; if the component needs to exist or needs to change, forge.

## The five component types

| Hive name | Generic name | What it is |
|---|---|---|
| Rules | Rules | Always-loaded or scoped guidance: CLAUDE.md, .cursor/rules/*.mdc, AGENTS.md, Cowork instructions |
| Beekeeper Tools | Commands | User-invoked workflows with mandatory processes. Every command loads beekeeper-suit first |
| Bees | Agents | Focused subagents. Each Bee pairs with exactly one Stinger and loads it before any work |
| Stingers | Skills | Single-domain knowledge in SKILL.md format following the Agent Skills open standard |
| Plugins | Plugins | The distribution unit bundling the other four for install across harnesses |

## The forge pipeline

Seven stages, in order, no skipping. This is the same pipeline that built queen-bee-stinger itself, and every component this skill forges goes through it. The stage a component is allowed to start at is the stage after the last one with verifiable artifacts on disk.

1. **Topic.** Lock the domain before anything else: what the component does, when it triggers, which of the five types it is, which harnesses it must reach, and whether it is development-focused (Ship Gate) or research-only. A vague topic produces a vague component; stop and ask.
2. **Research.** Run a fresh, time-bounded sweep (default: last 6 months, never past 12 without explicit consent) of primary sources for the component's DOMAIN. Archive raw source material into the new component's own `references/research/raw/`, one file per source, each headed with URL, fetch date, and source type. Official docs outrank vendor blogs outrank community posts. Do not author from training data; if it isn't in the archive, it isn't a fact yet. Harness FORMAT knowledge is the one exception: that research already lives in this skill's `references/research/` and does not need re-running per component.
3. **Distillation.** Re-ingest the raw archive fresh and write a distilled article into the component's `references/research/`: dense, tabular where possible, every claim ending with a citation to its raw file. Where sources conflict, state both readings and the preferred official one. Where research is thin, say so; never smooth a gap into a guess.
4. **References.** Build the component's reference layer from the distillation: field tables, worked examples, reusable templates, deterministic scripts. This is the material the component loads on demand at runtime, so it earns its tokens or it goes.
5. **Guides.** Write the procedural guides, one focused file per major verb the component performs, each grounded in the distillation and citing the raw files it derives from. Consult [guides/harness-support-matrix.md](guides/harness-support-matrix.md) and [guides/per-type-per-harness-specific-guide.md](guides/per-type-per-harness-specific-guide.md) for the format rules of every target harness; never author a harness surface from memory.
6. **Skill file.** Author the root file LAST, once the knowledge exists to point at. Start from `references/templates/<type>/`, keep it lean with progressive-disclosure pointers into the guides and references, spec-six frontmatter for anything crossing harnesses, Critical Directive at the end, Ship Gate for development-focused components. Then validate: `references/scripts/per-type-validation.py` for every target harness, plus the Cowork packagers where applicable, plus an independent grounding QA pass that samples claims against the raw archive.
7. **Register.** Pair the Stinger with its Bee, register into beekeeper-suit per [guides/beekeeper-registration.md](guides/beekeeper-registration.md), deploy to the target harnesses, and sync repo references per [guides/vibe-coding-tools-reference-update.md](guides/vibe-coding-tools-reference-update.md). Unregistered components do not exist as far as the colony is concerned.

## Hard portability rules

These come from the research and they are not negotiable:

- Skill frontmatter targeting more than one harness uses only the six Agent Skills spec fields: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Anything else hard-fails claude.ai upload, which is the Cowork path. Harness-specific extension fields are opt-in per target, documented in the skills template reference.
- Never use backtick-bang dynamic injection in a skill body. Cowork replaces those lines with a dead placeholder. Instruct the model to run the command through its tools instead.
- Cursor requires a skill's `name` to exactly match its folder name, and rules files in `.cursor/rules/` must use the `.mdc` extension. Plain `.md` there is silently ignored.
- Codex MCP configuration is TOML under `[mcp_servers.<name>]` in config.toml. Pasting JSON silently fails.
- Plugin manifests live inside `.claude-plugin/` (or the harness equivalent). Every other component directory lives at the plugin root, never inside the manifest folder.
- Plugins targeting Cowork should ship `commands/` flat files alongside `skills/` until the slash-invocation gap is confirmed fixed.

## File map

Load these on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `guides/the-hive-architecture.md` | You need the system model: pairing law, closed loop, Ship Gate pipeline |
| `guides/harness-support-matrix.md` | Choosing formats or checking what a harness supports |
| `guides/per-type-per-harness-specific-guide.md` | Authoring any component: the deep field-level procedure |
| `guides/beekeeper-registration.md` | Registering a new Bee and Stinger pair |
| `guides/vibe-coding-tools-reference-update.md` | Syncing repo docs and references after changes |
| `references/templates/<type>/` | Starting any new component of that type |
| `references/scripts/` | Validating or packaging any component |
| `references/research/distilled-research-articles.md` | Verifying a harness claim or resolving a dispute |
| `references/research/raw/` | Tracing a claim to its primary source |

## Quality bar

A forged component is done when: it walked all seven stages of the forge pipeline in order, its own domain research archive exists on disk (raw sources plus a cited distillation), it validates clean for every target harness, its Hive convention blocks are present and verbatim, its factual claims trace to research (domain claims to its own archive, harness-format claims to this skill's `references/research/`), its registration and repo references are updated, and, for development-focused components, its Ship Gate ran to completion with user approval before any commit.

Where the research flags an unresolved conflict (AGENTS.md concatenation vs closest-wins, size caps, Cowork description limits), the guides state both readings and the preferred official one. Carry that honesty into what you build. Never smooth over a known unknown.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [beekeeper-suit](../beekeeper-suit) - Roster and routing for the Bee Army. Consult before dispatching work to existing Bees, and register every new Bee and Stinger pair there.
  - [security-stinger](../security-stinger) - Security audit pass. First gate of the Ship Gate pipeline.
  - [quality-stinger](../quality-stinger) - Quality assurance pass. Second gate, always after security.
  - [github-repo-health-stinger](../github-repo-health-stinger) - Repository hygiene audit. Final orchestrator-level gate before commit and push.
