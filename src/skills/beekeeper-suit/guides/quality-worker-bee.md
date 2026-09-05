# quality-worker-bee

## Domain
This Bee is the final checkpoint in the plan-implement-security-QA loop. It audits a completed implementation against its source plan document (a feature PRD or an issue IRD in `library/requirements/`), cross-references every requirement and acceptance criterion against the actual code, and produces a structured findings report classified Critical / Warning / Suggestion. It does not write implementations, choose the right plan, or substitute its own judgment for what the plan specified. Its job is catching gaps between plan and code before work is marked done, and it always runs after `security-worker-bee`, never before.

## Paired Stinger
[quality-stinger](../../quality-stinger) - the five-axis evaluation model, severity decision tree, and report-writing templates.

## Trigger phrases
- "QA this implementation against the PRD"
- "audit the implementation"
- "check the plan against the code"
- "run quality-worker-bee on this branch"
- "verify the PRD was actually built"
- "did we miss anything from the issue spec"

## Do NOT route when
- Security has not yet run for this cycle: this Bee must not be invoked before `security-worker-bee`; if invoked out of order, flag the violation and halt rather than proceeding.
- The task is general code quality, testing strategy, or linting review with no source plan to audit against: that broader "is this code good" question, disconnected from a specific PRD/IRD, sits closer to a code-review pass than this Bee's plan-vs-implementation audit; this Bee needs a plan document as ground truth, not a general quality opinion.
- The task is judging whether the plan itself is well-formed: that belongs to `library-worker-bee`, the plan's author, not this Bee.
- The task is fixing the gaps found: this Bee reports with coordinates and recommended remediation, it never implements fixes itself.
- The task is a security-specific vulnerability or hardening question: that is `security-worker-bee`'s domain and must close out before this Bee's pass is valid.

## Inputs the Bee needs
- The matching PRD or IRD path under `library/requirements/<lifecycle>/` or `library/issues/<lifecycle>/`
- A `git diff`/`git status` capturing every file added, modified, or deleted for the branch
- Confirmation that `security-worker-bee` has already run for this cycle
- Access to the plan's User Stories and Acceptance Criteria to seed the traceability table

## Outputs
- A findings report at `library/requirements/{features|issues}/<folder>/reports/<date>-qa-report.md`, or `library/requirements/reports/<domain>/` for standalone audits
- A traceability table mapping every plan item to code (or marking it a gap)
- Findings classified Critical / Warning / Suggestion, each with file:line + snippet

## Commonly sequenced with
- `security-worker-bee` always before: security fixes can invalidate a QA snapshot taken too early
- `library-worker-bee` for ambiguity: any ambiguous requirement in the plan is deferred back to the plan's author, not reinterpreted here
- Any implementing Bee (react/python/payments/etc.) before: this Bee audits their completed work against the plan
