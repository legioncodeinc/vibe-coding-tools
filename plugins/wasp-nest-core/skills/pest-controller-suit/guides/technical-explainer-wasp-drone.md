# technical-explainer routing guide

**Plugin owner:** `developer-learning-tools`. **Required:** Core plus this selected owner.
**Source Drone:** `packs/developer-learning-tools/agents/technical-explainer-wasp-drone.md`.
**Source Stinger:** `packs/developer-learning-tools/skills/technical-explainer-stinger/SKILL.md`.

## Domain

Explain technical sources at grade 8 with faithful claims, bounded analogies and teach-back.

## Trigger phrases

explain this; eighth grade; technical post; analogy; explain this error; understand AI-generated code.

## Do NOT route when

Implementation belongs to its code owner; deep architecture docs to Knowledge; document export to selected Library Packets.

## Inputs the Drone needs

accessible source and revision, reader context, target language for actual translation; exact redacted error and runner context when available.

## Outputs the Drone produces

explanation, glossary, source-to-claim ledger, analogy limits, teach-back; error context with one suggested safe next check or code actor/data/control/state/effects map.

## Dispatch

Read the root catalog for source work. For installed work resolve `technical-explainer-stinger` through trusted Core's selected-plugin resolver and read the returned path. A cached plugin is not a selected capability. Follow [Core's arming contract](../SKILL.md#dispatch-and-arming-contract). If the host lacks a native role, use direct skill execution only within the user-authorized approach and report that surface honestly. No guessed role or source fallback.

The runtime produces an advisory artifact. No installation, credential entry, provider change, messages or release action follows implicitly. Keep the parent's scope, clock and file ownership. Code-producing changes close with Security then Quality and the orchestrator repository-health review.

[Paired source skill](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/developer-learning-tools/skills/technical-explainer-stinger/SKILL.md) and [source Drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/developer-learning-tools/agents/technical-explainer-wasp-drone.md) carry the exact domain procedure and boundaries.
