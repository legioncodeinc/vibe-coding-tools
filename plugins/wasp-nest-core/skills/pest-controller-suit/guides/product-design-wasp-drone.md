# Product Design - Pest-Controller-Suit's Guide

The Pest-Controller-Suit routing skill's record of when to invoke `product-design-wasp-drone`. Use this guide to decide whether a user request belongs to this Drone.

**Plugin owner:** `product-studio`
**Source Drone:** [`packs/product-studio/agents/product-design-wasp-drone.md`](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/product-studio/agents/product-design-wasp-drone.md)
**Source Stinger:** [`packs/product-studio/skills/product-design-stinger/SKILL.md`](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/product-studio/skills/product-design-stinger/SKILL.md)
**Required plugins/workflow:** `wasp-nest-core`; the full sequence runs through `/product-studio:plan-product`

Resolve the installed paired skill through Core's explicit selection registry before dispatch.
**Trigger policy:** on-demand

---

## Domain

This Drone turns an approved Product Strategy into a Claude-Design-grade UX package: user journeys, information architecture and screen map, key task flows in Mermaid, screen specs with empty, loading, error and success states, content and accessibility notes to WCAG 2.2 AA, and single-file clickable HTML prototypes with light and dark modes. It scores its work with a critique rubric before the owner sees it and runs Impeccable's detector when available. It also runs the Claude Design round trip: a brief out, and an import guide that turns an owner's Claude Design export into DESIGN.md, tokens and screen specs with provenance.

## Trigger phrases

Route to `product-design-wasp-drone` when the user says any of:

- "design the product"
- "UX for this app"
- "prototype the screens"
- "Claude Design handoff"
- "bring in my Claude Design export"
- "the design stage of /product-studio:plan-product"

## Do NOT route when

- Building a full design system from scratch: route to `design-system-wasp-drone`.
- Enforcing an existing design system in code: route to `ux-ui-wasp-drone` or `ux-ui-svelte-wasp-drone`.
- Polishing an existing live surface: route to `impeccable-wasp-drone`.
- Capturing a running app: route to `webapp-capture-wasp-drone`.

If a request straddles two Drones' domains, prefer the narrower-scoped Drone and let the broader one act as backup.

## Inputs the Drone needs

- The approved Product Strategy at `library/knowledge/private/product/product-strategy.md`
- Owner approval of a design direction before prototypes are built
- Any Claude Design export files, for the import path

If a required input is missing, do not invoke yet; ask the owner to supply it.

## Outputs the Drone produces

- The UX package under `library/knowledge/private/product/design/`
- Prototypes under `library/knowledge/private/product/design/prototypes/`
- A scored critique and, when requested, a Claude Design brief or import record

## Multi-Drone sequences this Drone participates in

- Plan a product: step 2. Receives the strategy from `product-strategy-wasp-drone`; hands the approved package to `product-planning-wasp-drone`.

## Critical directives the orchestrator should respect

- The owner approves each artifact before the next stage uses it.
- This Drone plans and documents; it does not write PRDs, CTRs or application code.

(Full list lives in the Drone file.)

---

*Part of Pest-Controller-Suit's roster. See [the Core roster](../SKILL.md) for the full colony.*
