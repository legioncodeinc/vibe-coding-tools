# Beekeeper-Suit

Beekeeper-Suit routes work to the right specialist Bee, arms that Bee with its paired Stinger, and enforces the Ship Gate across Claude Code, Cursor, Codex, and Cowork.

## Start here

- [`SKILL.md`](./SKILL.md) contains the live roster, trigger phrases, routing boundaries, orchestration sequences, and dispatch contract.
- [`PAIRING-AUDIT.md`](./PAIRING-AUDIT.md) records the verified Bee, Stinger, and routing-guide totals.
- [`guides/`](./guides/) contains one detailed routing guide for every registered Bee.

The roster stays in `SKILL.md` so this README cannot drift when the colony grows.

## Add or update a Bee

The orchestrator uses [`queen-bee-stinger`](../queen-bee-stinger) to forge new components. Its registration guide is the source of truth:

1. Complete Topic, Research, Distillation, References, Guides, and the root Skill File in order.
2. Create the paired Bee from the Queen template.
3. Follow [`queen-bee-stinger/guides/beekeeper-registration.md`](../queen-bee-stinger/guides/beekeeper-registration.md) to add the roster row, routing guide, cross-links, harness outputs, and validation.
4. Update multi-Bee orchestration only when the pair joins a real recurring sequence.

Do not hand-edit generated `.agents`, `.cursor`, or `.codex` copies.

## Philosophy

See [`references/philosophy.md`](./references/philosophy.md) for the rationale behind routing over generalization.

---

*Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
