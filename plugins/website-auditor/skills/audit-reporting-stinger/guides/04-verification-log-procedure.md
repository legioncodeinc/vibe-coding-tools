# 04. Verification-log procedure

Grounded in this plugin's own build plan and PRDs, not this pair's external research cluster (the five raw sources in `references/research/raw/` do not address verification logging - it is a Legion Code Inc. conduct rule, not an industry convention this research pass sourced). See [plan/website-auditor-build-plan.md section 7, conduct rule 4](../../../plan/website-auditor-build-plan.md) and [prd-021's Conduct rules applied section](../../../library/requirements/backlog/prd-021-audit-reporting/prd-021-audit-reporting-index.md).

## Why this exists

Conduct rule 4, carried forward from the AC Direct engagement into every one of this plugin's 20 Drone/Stinger pairs: "Verification log is a deliverable. Candidates that fail verification are recorded as rejected, with the reason. On AC Direct that log caught two findings that would have been material errors." A candidate finding that gets quietly dropped when it turns out to be wrong is invisible to the auditor-report reader - and invisible failure is exactly what erodes trust in an audit's other findings once the client's own team spots one the auditor missed or over-claimed. Logging the rejection, with its reason, turns a near-miss into evidence that the process caught its own error, which is the opposite of hedging: it is the receipt that the report's other findings were actually checked.

## What gets logged

Every upstream Drone (wave W5/W6/W7) that considers, then discards or reframes, a candidate finding before it reaches the findings register is expected to record that disposition per conduct rule 4. By the time `audit-reporting-wasp-drone` runs in W8, this Stinger's job is to render whatever verification-log entries already exist, not to generate them - report generation is a rendering step, not an analysis step, per prd-021's Non-Goals. A verification-log entry, as rendered in `references/templates/auditor-report-template.md` section 6, carries:

- **Candidate ID** - a stable reference distinguishing it from the findings-register IDs it was never promoted to.
- **Original claim** - what was initially suspected or flagged, stated plainly, not softened after the fact.
- **Disposition** - `Rejected` (the candidate did not hold up on re-verification) or `Reframed` (the underlying observation was real but the initial framing/severity was wrong and was corrected before promotion to the register).
- **Reason** - the specific check that resolved it. `render-report.py`'s sample data shows the pattern: "Badge was present but rendered below the fold on the captured viewport; re-verified with a taller capture and confirmed present. Not a real finding."

## An open gap this guide states honestly rather than papering over

prd-021's Shared workspace contract lists exactly three read inputs for this Drone: `scoring/audit-scorecard.xlsx`, `scoring/findings-register.csv`, `_shared/evidence-index.md`. It does not name a specific file path for the verification log itself, and the build plan's folder spec (section 3) does not list one under `_shared/` either (only `run-ledger.json`, `target-profile.json`, `evidence-index.md` are enumerated there). Conduct rule 4 establishes THAT a verification log must exist as a deliverable; it does not fix WHERE it lives on disk. Until a specific pair (most plausibly `audit-scoring-wasp-drone`, since it is the sync point that receives every upstream Drone's output in W7) claims ownership of a canonical `_shared/verification-log.md` (or an equivalent column set folded into `findings-register.csv` itself, e.g. a `status=rejected` row class), this Drone's rendering procedure is:

1. Look for `_shared/verification-log.md` first, since it groups naturally with the other run-wide, append-only artifacts already in `_shared/`.
2. If absent, check whether `scoring/findings-register.csv` itself carries rejected/reframed rows (a `status` or `disposition` column), since a single CSV avoids a second file to keep in sync.
3. If neither exists for a given run, render section 6 of the auditor report using the template's `verification_log_empty` branch ("No candidate findings were rejected or reframed during this engagement") rather than inventing entries or failing the render - but flag the absence in the run's own completion ledger, since an engagement producing zero verification-log entries across every upstream Drone is itself worth a second look, not a default to assume is always correct.

This is stated as an explicit sequencing/ownership gap, matching the honesty standard this plugin already applies to its own research (see `references/research/distilled-audit-reporting.md` section 9's stated gaps) - not resolved by this Stinger inventing a file path and treating it as settled.

## Why it belongs in the auditor report by default, and the customer report only conditionally

The build plan's own Q13 (section 9) names the tension directly: the verification log builds trust but adds length and can read as hedging to a non-technical reader. Its stated default, which this Stinger follows: the auditor report always carries the verification log (section 6 of `auditor-report-template.md`); the customer report carries it only when the customer-facing register is running in "technical" mode rather than the default plain-language executive mode (see `references/templates/customer-report-template.md`'s structure, which does not include a verification-log section at all in its current, plain-language-only form - a technical customer register variant, if this plugin ever adds one, would need its own template rather than a conditional block bolted onto the current one, to avoid the plain-language reader ever seeing a "candidates we rejected" table that reads as an admission of doubt rather than a rigor signal).

## Procedure when rendering

1. Resolve the verification-log source per the three-step lookup above.
2. Pass the resulting list (possibly empty) into the render context's `verification_log` key, and set `verification_log_empty` accordingly - see `render-report.py`'s `build_sample_context()` for the exact shape.
3. Render section 6 of the auditor report from that data, never by hand-authoring entries during report generation - this Drone renders, it does not investigate or adjudicate a candidate finding itself.
4. If the customer report's technical register is used for a given engagement, mirror the same data into that report's equivalent section rather than re-deriving it, for the same reason guide 01 requires the customer and auditor bodies to derive from one shared data pass.
