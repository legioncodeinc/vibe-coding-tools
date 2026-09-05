# Example 02 — Edge Case: Refinement with a Waiver

Demonstrates: `guides/03-iterate-phase.md`, `guides/04-polish-phase.md`, `guides/06-detector-gate.md`.

**Task:** "Polish the settings screen. Keep our sharp corners and sober palette. Remove the AI tells."

1. **Context.** `PRODUCT.md` + `DESIGN.md` exist and are current. Mode: **Operate** (settings = task completion; scanability outranks expression).
2. **Classification.** Refinement — better, not different. No new-work flow, no roll, no direction contract. The incumbent world is preserved.
3. **Iterate.** `/impeccable polish settings` — targeted fixes: 3 off-grid elements aligned; h1 kerning tightened; one hardcoded hex → `--color-accent`; missing hover state on FAQ items; modal entrance softened to 220ms ease-out-quart; stray "Lorem" removed. One batched round, one fix batch, one confirmation. Stop.
4. **Polish.** `/impeccable audit settings` (P1: gray-on-color on the danger zone → tint from the hue instead). `/impeccable harden settings` (long German labels, offline state). Gate: `npx impeccable detect src/settings` → 1 finding: `overused-font` flags the brand font (a real brand commitment, not a default).
5. **Waiver (narrowest form, with reason):**
   ```bash
   npx impeccable ignores add-value overused-font "Brand Sans" --reason "Brand font, committed in DESIGN.md"
   ```
   Re-run the gate → 0 findings. The waiver is recorded in `.impeccable/config.json` and shared with the hook.
6. **Close-out.** Hand off to `security-worker-bee` → `quality-worker-bee`. Gate result travels with the close-out (see `templates/gate-report.md`).
7. **Maintain.** No drift introduced; `doctor` clean. Nothing to extract.
