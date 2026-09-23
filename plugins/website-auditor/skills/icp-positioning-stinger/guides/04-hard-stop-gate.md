# 04. Hard-stop gate

How `icp-positioning-wasp-drone` evaluates and, when necessary, enforces the run's one hard stop. This is the depth layer for Phase 5 of `01-icp-assessment-procedure.md`.

## Why this gate exists and what "hard" means here

Per PRD-005: "if the site's focus cannot be determined, the run halts rather than guessing." This is conduct rule 6 in `rules/website-audit-conduct.md`, made concrete for this specific Drone: "The hard gate holds. If the site's focus and subject cannot be determined (`icp-positioning-wasp-drone`), the run stops and asks. That is a critical failure, not a low-confidence guess." The build plan's dependency graph marks this gate explicitly: `W2 icp-positioning | * HARD GATE | focus undeterminable -> STOP, query user`.

**"Hard" means:** this is not a severity-graded finding the run can note and continue past. It is a binary condition. If it fires, no downstream wave (W3 keyword-intelligence through W8 audit-reporting) may proceed on this engagement until the user resolves the ambiguity (PRD-005 AC-2: "the run halts... and does not proceed to prd-006 or any later wave").

## What counts as gate-failing (this Drone's own construct, not sourced)

**No source in this pair's five-source archive defines or names a "focus cannot be determined" condition** (distilled research section 7: "No source discusses a hard-stop/halt-and-ask design pattern for an undeterminable classification by name... that condition remains this Drone's own construct, not sourced"). The threshold below is therefore this Stinger's own engineering judgment call, built from the closest available analogues in the archive, and should be read as such rather than as a sourced fact.

The closest analogues, read together:

- The distilled research's own framing (section 5): a site whose observable content only supports "unmeasurable" or "mono-attribute" characterizations - e.g. the only determinable fact is a broad vertical with no discernible segment, geography, or buyer signal - is the closest analogue to a focus-undeterminable condition, borrowing the "unmeasurable criteria" and "mono-attribute ICP" failure patterns from the ICP-quality literature. [raw/abmatic-ai-blog-what-is-an-ideal-customer-profile.md] [raw/hyperspect-ai-blog-icp-definition-framework.md]
- The round-3 addition sharpens this only slightly and explicitly warns against over-firing the gate: "a site with a single generic conversion mechanism... is evidence of poor site strategy, not evidence that the site's focus/niche is undeterminable, and this Drone should not conflate the two." [raw/321webmarketing-com-audit-conversion-paths-buyer-stage.md] (See `02-conversion-taxonomy.md`'s single-mechanism flag - that finding alone never trips this gate.)
- Genuine focus-undeterminability, per the distilled research, is "closer to 'no vertical, no ICP-relevant signal, and no coherent conversion action of any kind is present or inferable.'"

## Gate criteria (this Drone's threshold, stated plainly as engineering judgment)

Evaluate the gate as FAILING (halt) only when ALL of the following hold after a genuine attempt at Phases 2-4 of `01-icp-assessment-procedure.md`:

1. No coherent niche or vertical can be named from landing-page copy and navigation, even at a broad level (e.g. not even "some kind of B2B software" is inferable).
2. No conversion action of any kind (macro or micro, per `02-conversion-taxonomy.md`) is present or inferable anywhere on the site.
3. The failure is not explained by a technical access problem this Drone can name and route elsewhere (a broken landing page returning an error, a holding/under-construction page, content genuinely blocked from external view) - name the specific reason in the halt message either way.

Do NOT evaluate the gate as failing when:

- The site has a single, low-quality conversion mechanism but a determinable niche (this is a site-strategy finding, per `02-conversion-taxonomy.md`'s single-mechanism flag - continue the assessment, note the finding, and let `audit-scoring-wasp-drone` score it later).
- Confidence in the ICP description specifically is low, but the niche and at least one conversion action ARE determinable. A low-confidence ICP with a stated reason is acceptable output per PRD-005's non-goals ("low confidence with a stated reason is acceptable output, silent continuation is not") - continue and state the low confidence honestly in `02-positioning/niche-icp-assessment.md`.

## Halt procedure, when the gate fails

1. Do NOT write `02-positioning/niche-icp-assessment.md`, `conversion-taxonomy.md`, or `buyer-readiness.md` as if they were completed output. If partial working notes exist, they may be kept for the user's reference but must be clearly marked incomplete/gate-failed, not presented as this Drone's deliverable.
2. Write a critical-failure message that states plainly: which of the gate criteria failed, what was actually observed (the specific technical or content reason - e.g. "landing page returned a 500 error," "page is a single 'coming soon' holding page with no navigation," "copy is present but describes no product, service, or vertical of any kind"), and that the run has halted at wave W2 rather than guessing.
3. Ask the user for clarification. Do not offer a low-confidence guess as a fallback default; per PRD-005's non-goals, continuing on a guess is explicitly disallowed even if the user does not immediately respond.
4. Update `_shared/run-ledger.json` with a `blocked` (not `complete`, not `failed` in the sense of an error) status for `icp-positioning-wasp-drone`, so any later resume attempt (per `audit-intake-stinger`'s resume pattern) surfaces the correct state rather than silently re-running from scratch or silently skipping this Drone.
5. Do not allow `keyword-intelligence-wasp-drone` (W3) or any later wave to start against this workspace while the block stands.

## Verification-log discipline applies here too

Per conduct rule 4 ("Verification log is a deliverable. Candidates that fail verification are recorded as rejected, with the reason, not silently dropped"), if this Drone considered and rejected a candidate niche/ICP characterization before concluding the gate should fire, that rejected candidate and its reason belong in the run's verification log, not discarded silently.
