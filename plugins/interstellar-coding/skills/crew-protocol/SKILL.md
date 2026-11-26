---
name: "crew-protocol"
description: "Shared contract for the Interstellar Coding crew: roster, authority, messages, the append-only ledger, state layout, and session-start and post-compaction recovery. Read by every role."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork for the documents. The hooks need Node 18 or newer and bind in Claude Code plugins; Codex after hook trust; Cursor and home installs are not wired."
metadata:
  hive-tier: standalone
  hive-drone: none
  domain: crew-coordination
  research-window: 2026-05-25 to 2026-11-25
---

# Crew Protocol

## Purpose

Interstellar Coding is a small development team of agent roles led by TARS. This skill is the one contract they all share: who owns what, who may decide what, how they talk, how progress reaches the ledger, where state lives, and how a role gets its rules back when a session starts or its context is compacted. It has no Drone of its own. Every crew role skill loads it first.

## When to use

- Any crew role starting, resuming, or recovering after a compaction.
- A question about a boundary between two roles, or who may decide something.
- Writing a message another role must act on, or a ledger submission.
- Pausing or terminating an agent and handing its work to a replacement.
- Checking what the crew hook does, or why it said something.

## When not to use

- Doing a role's actual work: load that role's skill (`crew-tars-stinger` and its siblings).
- Routing a single task to a specialist Drone with no crew running: `pest-controller-suit`.
- Forging or changing crew components: `queen-wasp-stinger`.

## Procedure

1. Read [references/REFERENCE.md](references/REFERENCE.md) in full. It is the contract: roster, ownership, authority, message grammar, ledger schema, state layout, hook table.
2. Find your role's row and stay inside it. See [guides/01-roster-and-authority.md](guides/01-roster-and-authority.md) for the reasoning and the hard cases between roles.
3. Talk and report as [guides/02-messaging-and-ledger.md](guides/02-messaging-and-ledger.md) describes. Every update that matters becomes a `LEDGER` line to OWEL, or a spooled entry when OWEL cannot be reached.
4. At session start, on resume, and after any compaction, follow [guides/03-session-start-and-compaction-recovery.md](guides/03-session-start-and-compaction-recovery.md) before other work. Fill [the recovery worksheet](references/templates/recovery-worksheet.md) when facts are missing.
5. When an agent must be paused, terminated or replaced, follow [guides/04-pause-terminate-and-handoff.md](guides/04-pause-terminate-and-handoff.md). Work is preserved and verified before anything is stopped.

## References map

- [references/REFERENCE.md](references/REFERENCE.md), load always: the contract.
- [references/templates/](references/templates), load when writing a handoff packet, the crew roster, the ledger folder README, or a recovery worksheet.
- [scripts/ledger.mjs](scripts/ledger.mjs), run to `append`, `spool`, `drain`, `verify` or `tail` the ledger; its header documents every flag.
- [references/research/distilled-crew-protocol.md](references/research/distilled-crew-protocol.md), load when a claim about hooks, compaction, or a role's mandate needs checking.
- Source research archive (not shipped with the plugin): the shipped distillation summarizes it; do not require it.

## Related drones and stingers

- [crew-tars-stinger](../crew-tars-stinger) - TARS, the lead and only spawner.
- [crew-kipp-stinger](../crew-kipp-stinger) - KIPP, product team and librarian.
- [crew-case-stinger](../crew-case-stinger) - CASE, consultant and contrarian.
- [crew-lady-stinger](../crew-lady-stinger) - LADY, deep independent investigator.
- [crew-moon-stinger](../crew-moon-stinger) - MOON, operating efficiency.
- [crew-owel-stinger](../crew-owel-stinger) - OWEL, documentarian and ledger keeper.
- [crew-coop-stinger](../crew-coop-stinger) - COOP, build engineer.
- [crew-murph-stinger](../crew-murph-stinger) - MURPH, verification and release gate.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [time-blocked-turns](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/time-blocked-turns) - The cadence and retry limits MOON measures against, and the compaction recovery worksheet this protocol extends.
  - [pest-controller-suit](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/pest-controller-suit) - Roster and routing for specialist Drones the crew dispatches.
  - [tars-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/tars-stinger) - The session-management skill TARS arms, whose effort folder the crew shares.

Ship Gate removed: shared protocol skill. It commits no product code; COOP carries the Ship Gate and MURPH runs it.
