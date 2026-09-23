# Accessibility score rollup and AA/AAA-style rating bands

Grounded in `plan/website-auditor-build-plan.md` section 4 (the zero-to-six scale and N/A-aware formulas) and PRD-013 AC-1 ("a single aggregate 0-100% score and an AA/AAA-style rating are produced, each backed by per-criterion findings with evidence"). This is where this Stinger turns the per-criterion checklist (`wcag-2.1-aa-checklist-scoring-table.md`) into the two headline numbers PRD-013 requires.

## 1. The 0-100% score

Reuse the build plan's own sub-audit rollup formula verbatim (section 4.3), applied across every scored WCAG 2.1 AA success criterion in the checklist:

```
a11y_pct = SUMPRODUCT(scores, weights, --(scores>0))
         / (6 * SUMPRODUCT(weights, --(scores>0)))
```

- `scores` is every non-N/A criterion's 0-6 score from the checklist.
- `weights` is 1 for every criterion by default. This Stinger's raw archive documents no basis for differential per-criterion weighting within WCAG 2.1 AA (distilled research section 6 names testing methodology, which would include any severity weighting, as an explicit gap); equal weighting is this Stinger's own default, not a sourced claim. If a future engagement needs differential weighting (e.g. weighting checkout-flow criteria higher than a footer link), record that as an explicit per-engagement override with its own justification, not a silent change to this default.
- N/A (0) criteria are excluded from both numerator and denominator, per section 4.1, never counted as a failure.
- This is the same formula the shared script `a11y-scan.py` already applies to its own automatable subset (`automated_subset_sub_audit_pct` in its output); that number is a partial input into this full rollup, not the final score by itself, since most of the checklist's rows require heuristic judgment `a11y-scan.py` cannot perform.

**This 0-100% number is this Drone's own domain-specific score**, distinct from the leaf-level 0-6 values that later feed `audit-scoring-wasp-drone`'s cross-category rollup (build plan section 4.2/4.3). Write both: the individual 0-6 leaf scores with their evidence (for `audit-scoring-wasp-drone` to consume per PRD-020), and this aggregated 0-100% (for this Drone's own PRD-013 AC-1 requirement and the accessibility-specific report section).

## 2. Open gap: where does Accessibility sit in the eight-category weight table

The build plan's section 4.2 category-weight table (Security 20%, Revenue drivers 18%, Mission critical 14%, Analytics 12%, Technical deployment 11%, Foundational completeness 10%, Search presence 9%, Content score 6%) does not name an "Accessibility" line item, and no other build-plan section resolves which of those eight categories this Drone's leaf scores roll into. This is a genuine, unresolved cross-Drone integration gap, not something to guess silently. Write every leaf score with its evidence to `06-accessibility/` as instructed either way; flag this placement gap explicitly in this Drone's own README/handoff note so `audit-scoring-wasp-drone`'s own forge (PRD-020) resolves it rather than this Stinger inventing a category assignment it has no authority over.

## 3. AA/AAA-style rating bands

No raw source in this Stinger's archive specifies a percentage-to-rating-band mapping; WCAG itself defines conformance at three discrete pass/fail levels (A, AA, AAA: meeting *all* success criteria at a level), not a percentage scale. Since PRD-013 explicitly asks for an "AA/AAA-**style**" rating from an automated-plus-heuristic (non-exhaustive) pass, the bands below are this Stinger's own construct, styled after WCAG's own level names for reader familiarity, and must be reported with that caveat attached every time, not as a formal WCAG conformance claim:

| Band | 0-100% score range | Report as |
|---|---|---|
| AAA-style | 95-100% | "Approaches AAA-level completeness on the criteria assessed" |
| AA-style | 85-94% | "Meets AA-style baseline, with the specific gaps listed below" |
| Partial AA | 70-84% | "Partial AA conformance; material gaps remain, listed by severity" |
| Non-conformant | below 70% | "Does not meet AA-style baseline; treat as a priority remediation area" |

Never report a band as an unqualified "AA compliant" or "AAA compliant" verdict. This is a direct, sourced instruction, not house style: the vendor-blog source in this Stinger's archive argues, citing the FTC's action against accessiBe, that enforcement risk in this space "turns on claims of exactly this shape... not on the state of anyone's site, but on what was said about it," and recommends a dated, specific, gap-disclosing statement over a blanket conformance claim. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] Pair every band label above with the dated, gap-naming statement in `eaa-conformance-statement-template.md`, never with the band label alone.

## 4. What NOT to do with this rating

- Do not present this rating as a legal EAA-conformance determination. It is this plugin's own audit output; EAA conformance is a regulatory/legal determination the audited party's own counsel makes, informed by findings like this Drone's, not asserted by this Drone.
- Do not silently upgrade the reported WCAG version if section 1 of `wcag-2.1-aa-checklist-scoring-table.md`'s provenance note has gone stale; re-verify the live-current harmonised-standard reference before every engagement.
