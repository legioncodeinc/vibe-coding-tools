# 05-funnel/ report template

Copy this structure into the run's `05-funnel/funnel-report.md`. Follows the plugin's zero-to-six scoring scale (build plan section 4.1) and evidence-pointer discipline: every score carries a numeric value, an evidence pointer, and a one-line justification, or it is not a valid score.

```markdown
# Visual funnel report: {domain}

Run date: {date}. Interactive/stateful mode: {OFF (default) | ON, opted in at intake}.

## Funnel walked

{Ordered list of checkpoints, sourced from 02-positioning/'s funnel definition, up to 25 pages. Link to checkpoint-log.md for the full per-checkpoint evidence.}

1. {Entry / landing}
2. {Discovery / category, if applicable}
3. {Product or lead-capture page}
4. {Cart or form step}
5. {Checkout or submit step}
6. {Confirmation, only if interactive mode was ON}

## Scores

| Checkpoint | Sub-check | Score (0-6) | Evidence pointer | Justification |
|---|---|---|---|---|
| {checkpoint} | Above-the-fold clarity | {0-6} | `visual/desktop/{id}.png` | {one line} |
| {checkpoint} | CTA visibility and specificity | {0-6} | `visual/desktop/{id}.png`, `visual/mobile/{id}.png` | {one line} |
| {checkpoint} | Message match to referring intent | {0-6} | {pointer} | {one line} |
| {checkpoint} | Mobile layout integrity | {0-6} | `visual/mobile/{id}.png` | {one line} |
| ... | ... | ... | ... | ... |

Boolean checkpoints (present/absent, e.g. "trust signal above the fold") resolve only to 6 or 1, never a value between, per the plugin's scoring rule.

## Where the walk stopped (if interactive mode was OFF)

{If the walk stopped short of a state-creating action, name the exact step and why, per AC-2 of prd-012-visual-funnel. This is not a missing score, it is an explicit, evidenced stopping point.}

## Subjective findings

{Findings labelled [subjective], kept separate from the quantified table above, per conduct rule 3.}

## Verification log

{Any candidate finding rejected or reframed during this walk, with the reason. Per conduct rule 4, this is never silently dropped.}
```
