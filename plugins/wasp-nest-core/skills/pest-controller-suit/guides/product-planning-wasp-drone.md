# Product Planning - Pest-Controller-Suit's Guide

The Pest-Controller-Suit routing skill's record of when to invoke `product-planning-wasp-drone`. Use this guide to decide whether a user request belongs to this Drone.

**Plugin owner:** `product-studio`
**Source Drone:** [`packs/product-studio/agents/product-planning-wasp-drone.md`](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/product-studio/agents/product-planning-wasp-drone.md)
**Source Stinger:** [`packs/product-studio/skills/product-planning-stinger/SKILL.md`](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/product-studio/skills/product-planning-stinger/SKILL.md)
**Required plugins/workflow:** `wasp-nest-core`; the full sequence runs through `/product-studio:plan-product`

Resolve the installed paired skill through Core's explicit selection registry before dispatch.
**Trigger policy:** on-demand

---

## Domain

This Drone turns an approved Product Strategy and UX package into the build plan: a PRD map with dependencies and shared boundaries, a dependency-ordered wave plan saved at `library/requirements/plans/wave-plan.md` with a Mermaid graph and entry and exit criteria, the project Definition of Done at `library/knowledge/private/standards/definition-of-done.md`, and a handoff packet for Library and Contract Writing. It fills the gap where nothing in the Library owned wave plans or a project-level Definition of Done. Each artifact is approved by the owner by revision before anything downstream uses it.

## Trigger phrases

Route to `product-planning-wasp-drone` when the user says any of:

- "plan the build"
- "wave plan"
- "definition of done"
- "what order do we build in"
- "break this into PRDs"
- "the planning stage of /product-studio:plan-product"

## Do NOT route when

- Writing PRDs or IRDs: route to `library-wasp-drone`.
- Writing CTR contracts: route to `contract-writing-wasp-drone`.
- Executing PRDs: use `/smoke-it`; running sessions is TARS.
- Mid-build feature ideas go to KIPP; sprint ceremonies go to `agile-scrum-wasp-drone`; forecasts go to `estimation-wasp-drone`.

If a request straddles two Drones' domains, prefer the narrower-scoped Drone and let the broader one act as backup.

## Inputs the Drone needs

- The approved Product Strategy
- The approved UX package, or the owner's written OK to plan without one
- Existing PRDs and accepted CTRs, if any

If a required input is missing, do not invoke yet; ask the owner to supply it.

## Outputs the Drone produces

- `library/requirements/plans/prd-map.md`
- `library/requirements/plans/wave-plan.md`
- `library/knowledge/private/standards/definition-of-done.md`
- `library/requirements/plans/handoff-packet.md`

## Multi-Drone sequences this Drone participates in

- Plan a product: step 3. Hands the packet to `library-wasp-drone` and `contract-writing-wasp-drone`; `/smoke-it` and TARS read the approved wave plan.

## Critical directives the orchestrator should respect

- The owner approves each artifact before the next stage uses it.
- This Drone plans and documents; it does not write PRDs, CTRs or application code.

(Full list lives in the Drone file.)

---

*Part of Pest-Controller-Suit's roster. See [the Core roster](../SKILL.md) for the full colony.*
