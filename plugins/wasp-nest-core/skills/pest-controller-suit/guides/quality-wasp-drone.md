# quality-wasp-drone

## Domain
This Drone is the final checkpoint in the plan-implement-security-QA loop. It audits a completed implementation against its source plan document (a feature PRD or an issue IRD in `library/requirements/`), cross-references every requirement and acceptance criterion against the actual code, and produces a structured findings report classified Critical / Warning / Suggestion. It does not write implementations, choose the right plan, or substitute its own judgment for what the plan specified. Its job is catching gaps between plan and code before work is marked done, and it always runs after `security-wasp-drone`, never before.

## Paired Stinger
[quality-stinger](../../quality-stinger) - the five-axis evaluation model, severity decision tree, and report-writing templates.

## Trigger phrases
- "QA this implementation against the PRD"
- "audit the implementation"
- "check the plan against the code"
- "run quality-wasp-drone on this branch"
- "verify the PRD was actually built"
- "did we miss anything from the issue spec"

## Do NOT route when
- Security has not yet run for this cycle: this Drone must not be invoked before `security-wasp-drone`; if invoked out of order, flag the violation and halt rather than proceeding.
- The task is general code quality, testing strategy, or linting review with no source plan to audit against: that broader "is this code good" question, disconnected from a specific PRD/IRD, sits closer to a code-review pass than this Drone's plan-vs-implementation audit; this Drone needs a plan document as ground truth, not a general quality opinion.
- The task is judging whether the plan itself is well-formed: that belongs to `library-wasp-drone`, the plan's author, not this Drone.
- The task is fixing the gaps found: this Drone reports with coordinates and recommended remediation, it never implements fixes itself.
- The task is a security-specific vulnerability or hardening question: that is `security-wasp-drone`'s domain and must close out before this Drone's pass is valid.

## Inputs the Drone needs
- The matching PRD or IRD path under `library/requirements/<lifecycle>/` or `library/issues/<lifecycle>/`
- A `git diff`/`git status` capturing every file added, modified, or deleted for the branch
- Confirmation that `security-wasp-drone` has already run for this cycle
- Access to the plan's User Stories and Acceptance Criteria to seed the traceability table

## Outputs
- A findings report at `library/requirements/{features|issues}/<folder>/reports/<date>-qa-report.md`, or `library/requirements/reports/<domain>/` for standalone audits
- A traceability table mapping every plan item to code (or marking it a gap)
- Findings classified Critical / Warning / Suggestion, each with file:line + snippet

## Commonly sequenced with
- `security-wasp-drone` always before: security fixes can invalidate a QA snapshot taken too early
- `library-wasp-drone` for ambiguity: any ambiguous requirement in the plan is deferred back to the plan's author, not reinterpreted here
- Any implementing Drone (react/python/payments/etc.) before: this Drone audits their completed work against the plan
