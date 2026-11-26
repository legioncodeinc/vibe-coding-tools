# launch-assets routing guide

**Plugin owner:** `infrastructure-decision-tools`. **Required:** Core plus this selected owner.
**Source Drone:** `packs/infrastructure-decision-tools/agents/launch-assets-wasp-drone.md`.
**Source Stinger:** `packs/infrastructure-decision-tools/skills/launch-assets-stinger/SKILL.md`.

## Domain

Prepare account, asset and platform dependency readiness without implicit setup actions.

## Trigger phrases

prepare assets; launch readiness; what accounts do I need; signing prerequisites.

## Do NOT route when

Actual account/provider setup is separate authorized work; App Primer Zero prepares repository foundations; App Store Submission owns store preparation details.

## Inputs the Drone needs

product/platform targets, current assets/accounts, owners, environments and distribution route.

## Outputs the Drone produces

readiness ledger, blocking dependencies, sources, lead-time/cost gaps and next owner action.

## Dispatch

Read the root catalog for source work. For installed work resolve `launch-assets-stinger` through trusted Core's selected-plugin resolver and read the returned path. A cached plugin is not a selected capability. Follow [Core's arming contract](../SKILL.md#dispatch-and-arming-contract). If the host lacks a native role, use direct skill execution only within the user-authorized approach and report that surface honestly. No guessed role or source fallback.

The runtime produces an advisory artifact. No installation, credential entry, provider change, messages or release action follows implicitly. Keep the parent's scope, clock and file ownership. Code-producing changes close with Security then Quality and the orchestrator repository-health review.

[Paired source skill](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/infrastructure-decision-tools/skills/launch-assets-stinger/SKILL.md) and [source Drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/infrastructure-decision-tools/agents/launch-assets-wasp-drone.md) carry the exact domain procedure and boundaries.
