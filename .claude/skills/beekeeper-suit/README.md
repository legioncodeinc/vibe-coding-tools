# Beekeeper-Suit

The Hive's cross-harness routing skill for Claude Code, Cursor, ChatGPT Codex, and Claude Cowork.

Beekeeper-Suit does not perform domain work. It routes the orchestrator's tasks to the correct Bee and passes the paired Stinger so every delegation arrives fully equipped.

## Entry point

- [`SKILL.md`](./SKILL.md): the skill definition Cursor loads.

## Roster

77 Bees are registered in the live roster in [`SKILL.md`](./SKILL.md). Each registered Bee has a routing guide under [`guides/`](guides/), subject to any explicitly reported in-progress registration work in the current checkout.

## Adding new Bees

The orchestrator uses [`queen-bee-stinger`](../queen-bee-stinger) to forge new components. Its registration guide is the source of truth:

1. Complete Topic, Research, Distillation, References, Guides, and the root Skill File in order.
2. Create the paired Bee from the Queen template.
3. Follow [`queen-bee-stinger/guides/beekeeper-registration.md`](../queen-bee-stinger/guides/beekeeper-registration.md) to add the roster row, routing guide, cross-links, harness outputs, and validation.
4. Update multi-Bee orchestration only when the pair joins a real recurring sequence.

## Philosophy

See [`references/philosophy.md`](./references/philosophy.md) for the rationale behind routing over generalization.

---

*Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
