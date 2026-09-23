# Pest-Controller-Suit

Pest-Controller-Suit routes work to the right specialist Drone, arms that Drone with its paired Stinger, and enforces the Ship Gate across Claude Code, Cursor, Codex, and Cowork.

## Start here

- [`SKILL.md`](./SKILL.md) contains the live roster, trigger phrases, routing boundaries, orchestration sequences, and dispatch contract.
- [`PAIRING-AUDIT.md`](./PAIRING-AUDIT.md) records the verified Drone, Stinger, and routing-guide totals.
- [`guides/`](./guides/) contains one detailed routing guide for every registered Drone.

The roster stays in `SKILL.md` so this README cannot drift when the colony grows.

## Add or update a Drone

The orchestrator uses [`queen-wasp-stinger`](../queen-wasp-stinger) to forge new components. Its registration guide is the source of truth:

1. Complete Topic, Research, Distillation, References, Guides, and the root Skill File in order.
2. Create the paired Drone from the Queen template.
3. Follow [`queen-wasp-stinger/guides/pest-controller-registration.md`](../queen-wasp-stinger/guides/pest-controller-registration.md) to add the roster row, routing guide, cross-links, harness outputs, and validation.
4. Update multi-Drone orchestration only when the pair joins a real recurring sequence.

Do not hand-edit generated `.agents`, `.cursor`, or `.codex` copies.

## Philosophy

See [`references/philosophy.md`](./references/philosophy.md) for the rationale behind routing over generalization.

---

*Part of The Wasp Nest, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
