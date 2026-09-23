# 05. Rejecting an upstream leaf finding back to its originating Drone

## 1. The rule, sourced

Build plan section 4.1: "Every score carries three mandatory fields: the numeric value, the
evidence pointer (file path, URL, header, or screenshot), and a one-line justification. Scores
without evidence are rejected by the scoring Drone and returned to the originating Drone." prd-020
carries this forward twice: as a Non-Goal ("this Drone... does not re-score or second-guess an
upstream Drone's leaf finding; if a leaf lacks a required evidence pointer or justification, this
Drone rejects it back to the originating Drone rather than scoring it anyway") and as AC-5 ("Given
a leaf finding arrives without an evidence pointer or justification, then this Drone rejects it
and returns it to the originating Drone rather than silently scoring it"). The existing Drone
stub's own description field states the same rule verbatim. This guide is the mechanical
procedure that rule requires; nothing here loosens or reinterprets it.

## 2. Why this is a hard boundary, not a judgement call

audit-scoring-wasp-drone's entire job is arithmetic and workbook population: masked-SUMPRODUCT
rollups, the critical-security-override, and writing verified leaf scores into
`Scorecard`. It has no domain expertise in security, SEO, accessibility, or any of the other
eleven Wave-5/W6 audit domains, and inventing a justification or guessing at an evidence
pointer on a leaf's behalf would silently launder a finding this Drone is not qualified to have
made. Rejection preserves the boundary the whole Drone/Stinger pairing law depends on: each Drone
owns its own domain's judgement calls, and the scoring Drone owns only the math that combines
them.

## 3. Validation procedure

1. Read the candidate leaf finding as a JSON record. It MUST validate against
   `references/templates/leaf-finding.schema.json` before this Drone does anything else with it.
2. The three build-plan-mandatory fields are `score` (0-6 integer), `evidence_pointer`
   (non-empty string), and `justification` (non-empty string). The schema also requires
   `leaf_id`, `category_key`, `subaudit_key`, `description`, and `originating_bee` as envelope
   fields needed to route both a valid score and a rejection to the right place (see
   `03-nesting-structure-design.md` section 2 for why these envelope fields are this Stinger's
   own addition on top of the three sourced mandatory fields).
3. Additional checks beyond bare schema validity, still under the same reject-don't-rescore
   discipline:
   - `is_boolean_checkpoint: true` with a `score` other than `1` or `6` - build plan section
     4.1: "Boolean checkpoints resolve only to 6 or 1. Nothing between." A boolean checkpoint
     scored, say, `3` is not this Drone's judgement call to round or reinterpret; it is a
     malformed finding from the originating Drone and is rejected the same as a missing
     evidence pointer.
   - `category_key` or `subaudit_key` that does not match one of the 8 categories / that
     category's own named sub-audits on `Rubric` - this Drone cannot place the finding on
     `Scorecard` at all without a valid coordinate, so it cannot be silently dropped into the
     nearest-seeming row either.
   - `evidence_pointer` or `justification` present but empty-string, whitespace-only, or a
     placeholder value (e.g. `"TBD"`, `"n/a"` used as a literal excuse rather than a genuine
     N/A score) - a non-empty string that carries no actual evidence is functionally the same
     failure as a missing field, and is rejected on the same basis.
4. A leaf scored `0` (N/A) is exempt from requiring a populated `evidence_pointer` /
   `justification` beyond a brief note of why the checkpoint does not apply to this site
   (e.g. "No commerce platform detected" is sufficient evidence for an N/A ecommerce leaf) -
   N/A is not a finding requiring proof, it is a statement that the checkpoint does not apply.
   This Drone still checks that the N/A claim itself is not obviously wrong given
   `_shared/target-profile.json` (e.g. an N/A payment-path-integrity leaf on a site the crawl
   data shows has a checkout flow is a rejection candidate, since that is a case where the N/A
   claim itself needs the originating Drone's own justification), but this is a much lighter
   check than a graduated score's evidence requirement.

## 4. What "reject" means mechanically

Rejection is never silent, per the conduct rules (build plan section 7's "verification log is
a deliverable" and "rejected/reframed candidate findings are logged to the run's verification
log with the reason, not silently dropped" - PRD Conduct rules section). On rejecting a leaf:

1. Do NOT write anything for that leaf onto the `Scorecard` sheet - leave its row as an unused
   placeholder slot (blank `E` cell), which the N/A-aware mask already treats as excluded
   (`01-rollup-procedure.md` section 2), so an unresolved rejection never corrupts a rollup by
   defaulting to 0-as-failure or being silently counted.
2. Append an entry to the run's verification log (`_shared/run-ledger.json` per build plan
   section 3, or the dedicated verification log file this pair's own audit-run tooling writes)
   recording: the `leaf_id`, the `originating_bee`, the specific validation failure (e.g.
   "missing justification", "boolean checkpoint scored 3", "evidence_pointer empty string"),
   and the timestamp.
3. Return the rejected record to the originating Drone (in-workspace, via whatever hand-off
   mechanism the run orchestrator uses) rather than proceeding to wave W8
   (`audit-reporting-wasp-drone`) with an incomplete `Scorecard`.
4. If the originating Drone cannot supply a valid replacement (e.g. its own crawl data genuinely
   does not support a justification), the leaf stays excluded (blank, i.e. treated as N/A by
   the mask) rather than scored on this Drone's own guess - an under-populated sub-audit rollup
   is the honest outcome; a fabricated score is not.

## 5. What this guide does NOT cover

This guide is about REJECTING a malformed or unevidenced finding. It is not about verifying
the SEVERITY, CORRECTNESS, or DOMAIN ACCURACY of a well-formed finding's evidence and
justification - that re-scoring, second-guessing behavior is exactly what the Non-Goal in
prd-020 and this Drone's own description forbid. A finding with a genuine evidence pointer and a
genuine one-line justification is scored as submitted, even if this Drone's own training data
would have scored the underlying issue differently. Domain judgement belongs to the Drone that
did the domain work.
