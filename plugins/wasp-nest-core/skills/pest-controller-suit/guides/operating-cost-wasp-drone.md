# operating-cost routing guide

**Plugin owner:** `software-economics-tools`. **Required:** Core plus this selected owner.
**Source Drone:** `packs/software-economics-tools/agents/operating-cost-wasp-drone.md`.
**Source Stinger:** `packs/software-economics-tools/skills/operating-cost-stinger/SKILL.md`.

## Domain

Estimate operating costs from supplied workload and dated provider rate assumptions.

## Trigger phrases

operating cost; infrastructure budget; monthly bill; cost scenarios.

## Do NOT route when

Infrastructure selection is a distinct decision; Unit Economics owns contribution and break-even; no provider provisioning or live price setting.

## Inputs the Drone needs

workload, rate units and dated evidence, currency/region, floors, allowances and credits.

## Outputs the Drone produces

low/base/high cost worksheet with source assumptions and excluded costs.

## Dispatch

Read the root catalog for source work. For installed work resolve `operating-cost-stinger` through trusted Core's selected-plugin resolver and read the returned path. A cached plugin is not a selected capability. Follow [Core's arming contract](../SKILL.md#dispatch-and-arming-contract). If the host lacks a native role, use direct skill execution only within the user-authorized approach and report that surface honestly. No guessed role or source fallback.

The runtime produces an advisory artifact. No installation, credential entry, provider change, messages or release action follows implicitly. Keep the parent's scope, clock and file ownership. Code-producing changes close with Security then Quality and the orchestrator repository-health review.

[Paired source skill](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/software-economics-tools/skills/operating-cost-stinger/SKILL.md) and [source Drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/software-economics-tools/agents/operating-cost-wasp-drone.md) carry the exact domain procedure and boundaries.
