# Example 01 — Happy Path: New Surface (greenfield → shipped → maintained)

Demonstrates: `guides/01-context-contract.md`, `guides/02-start-phase.md`, `guides/04-polish-phase.md`, `guides/05-maintain-phase.md`.

**Task:** "Build a pricing page for a developer tool that traces every alert back to the deploy that caused it."

1. **Start — context.** No `PRODUCT.md` → `/impeccable init` (platform: web; users: SREs on call, reading fast, often in the dark; positioning: traces every alert back to the deploy that caused it; evidence: real incident timelines, no customer logos yet). No `DESIGN.md` → `/impeccable document` (extracts tokens from the existing app, writes Stitch-format `DESIGN.md` + `design.json`).
2. **Start — classification.** New surface inside an established world → composition open, world inherited. Mode: **Persuade** (a pricing page earns attention and action).
3. **Start — direction.** Derive a grounded shortlist (incident timeline, postmortem doc, terminal session, man page, pager timeline). Roll assigns index 3 (terminal session) and deals challengers from the worlds deck. Five tests: Truth (the terminal relationship exists in the product) ✓, Translation (strip names → a product-native relationship remains) ✓, Consequence (removing the terminal frame weakens the page) ✓, Survival (works on mobile within budget) ✓, Fit (honest tradeoff) ✓. Write the direction contract into the artifact (see `templates/direction-contract.md`), keep the seed key.
4. **Build.** Code toward the committed world. Craft floor: contrast >= 4.5:1, body measure 65-75ch, one authored motion moment, real states (hover/disabled/loading/error/empty), themed browser surfaces (selection, focus rings, scrollbars). No side-tab borders, no gradient text, no hero eyebrow, no Inter-as-display.
5. **Iterate.** One batched inspection round (desktop + mobile): fix overflow on the pricing table, tighten heading rhythm, replace one hardcoded hex with a token. One fix batch. One confirmation round. Stop.
6. **Polish.** `/impeccable audit` (a11y 4, perf 3, theming 4, responsive 3, anti-patterns 4; one P2: touch target on the plan toggle → fixed). `/impeccable clarify` (CTA copy tuned to SREs). `/impeccable harden` (60-char org names, prices in the billions, 500s). Gate: `npx impeccable detect src/` → 0 findings. Hand off to `security-worker-bee` → `quality-worker-bee`.
7. **Maintain.** `/impeccable extract` (the plan-toggle pattern appears 3x → token + primitive). `/impeccable document` (re-capture `DESIGN.md`). `/impeccable doctor` → clean. The next surface inherits the world.
