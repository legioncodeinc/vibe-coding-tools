# Guide 06: Score and evidence findings

## What this guide covers

How a checklist observation (guide 04) becomes a scored finding this Drone hands to `audit-scoring-wasp-drone`.

## Procedure

1. Score every sub-check on the plugin's zero-to-six scale (build plan section 4.1). Boolean checkpoints (present/absent, e.g. "trust signal above the fold": yes or no) resolve only to 6 or 1, never a value between.
2. Every score carries three mandatory fields: the numeric value, an evidence pointer (the checkpoint's screenshot path, e.g. `visual/desktop/03-cart.png`), and a one-line justification. A score without all three is incomplete and will be rejected by `audit-scoring-wasp-drone` and returned to this Drone, per build plan section 4.1.
3. Use score 0 (N/A, excluded from both numerator and denominator) only when a sub-check is genuinely not relevant to this site type, e.g. scoring "cart persistence" on a lead-gen site with no cart. Do not use 0 to mean "could not observe"; an unobservable checkpoint that should exist is a low score with an evidence pointer to whatever was captured (including a failure-state screenshot), not an N/A.
4. Label any judgment call that cannot be reduced to a checklist item, message-match quality, headline "feel," visual hierarchy, as `[subjective]` and keep it in a separate section of the funnel report from the quantified score table, per conduct rule 3.
5. When a checklist item's threshold data conflicts with what's actually observed (e.g. Baymard's 70.22% average cart-abandonment figure is a benchmark, not this specific site's number), do not import the benchmark as if it were this site's measured value. Use it only as interpretive context in the justification line, and cite it as a benchmark explicitly ("cart total is hidden until step 3, consistent with the 40%-extra-costs abandonment driver Baymard reports; not this site's own measured abandonment rate").
6. Log any candidate finding that gets rejected or reframed during scoring, with the reason, to the run's verification log. This is a deliverable per conduct rule 4, not an internal scratch note.
7. Write final scores to `05-funnel/funnel-report.md` using `references/templates/funnel-report-template.md`, and confirm every screenshot referenced by a score's evidence pointer actually exists under `visual/desktop/` or `visual/mobile/` before finishing this Drone's pass.

## Common failure this guide prevents

Scoring the whole funnel as one number instead of per-checkpoint, per-sub-check. `audit-scoring-wasp-drone` needs leaf-level scores with evidence to compute the N/A-aware rollup formula (build plan section 4.3); a single aggregate "funnel score: 4" from this Drone cannot be consumed by that formula and will be rejected.
