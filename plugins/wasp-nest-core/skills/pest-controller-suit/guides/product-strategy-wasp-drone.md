# Product Strategy - Pest-Controller-Suit's Guide

The Pest-Controller-Suit routing skill's record of when to invoke `product-strategy-wasp-drone`. Use this guide to decide whether a user request belongs to this Drone.

**Plugin owner:** `product-studio`
**Source Drone:** [`packs/product-studio/agents/product-strategy-wasp-drone.md`](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/product-studio/agents/product-strategy-wasp-drone.md)
**Source Stinger:** [`packs/product-studio/skills/product-strategy-stinger/SKILL.md`](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/product-studio/skills/product-strategy-stinger/SKILL.md)
**Required plugins/workflow:** `wasp-nest-core`; the full sequence runs through `/product-studio:plan-product`

Resolve the installed paired skill through Core's explicit selection registry before dispatch.
**Trigger policy:** on-demand

---

## Domain

This Drone turns a raw product idea, or an existing repository's product, into a one-page-plus Product Strategy by interviewing the owner in short batches, each question carrying a "(Recommended)" answer. It covers the problem, who it is for, the job to be done, positioning, 2 to 4 big bets, a north-star metric with three input metrics, v1 scope with an explicit NOT-in-v1 list, and the riskiest assumption with a cheap test. It never invents strategy; unanswered items stay open. Deeper research is handed to existing specialists rather than copied.

## Trigger phrases

Route to `product-strategy-wasp-drone` when the user says any of:

- "plan a new product"
- "product strategy"
- "what should v1 be"
- "who is this for"
- "positioning"
- "the strategy stage of /product-studio:plan-product"

## Do NOT route when

- A new feature idea arrives in the middle of a build: that goes to KIPP in the TARS desk.
- The task is writing a PRD or IRD: route to `library-wasp-drone`.
- The task is quarterly OKRs: route to `okr-goal-setting-wasp-drone`.
- The task is a full ICP dossier, competitor workbook or discovery cadence: route to `icp-research-wasp-drone`, `competitive-research-wasp-drone` or `discovery-research-wasp-drone`; this Drone links to their outputs.

If a request straddles two Drones' domains, prefer the narrower-scoped Drone and let the broader one act as backup.

## Inputs the Drone needs

- The product idea in the owner's words, or the repository to read
- An owner available to answer short interview batches
- Existing research (ICP dossier, competitor workbook, discovery notes) if any

If a required input is missing, do not invoke yet; ask the owner to supply it.

## Outputs the Drone produces

- `library/knowledge/private/product/product-strategy.md`
- Strategy decision notes under `library/knowledge/private/product/decisions/`

## Multi-Drone sequences this Drone participates in

- Plan a product: step 1. Hands the approved strategy to `product-design-wasp-drone`.

## Critical directives the orchestrator should respect

- The owner approves each artifact before the next stage uses it.
- This Drone plans and documents; it does not write PRDs, CTRs or application code.

(Full list lives in the Drone file.)

---

*Part of Pest-Controller-Suit's roster. See [the Core roster](../SKILL.md) for the full colony.*
