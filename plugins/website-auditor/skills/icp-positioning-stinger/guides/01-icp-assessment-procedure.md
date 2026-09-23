# 01. ICP assessment procedure

How `icp-positioning-wasp-drone` runs wave W2 end to end: read the W1 outputs, produce a niche/ICP/goal assessment, and route to either the taxonomy/readiness work or the hard-stop gate. This is the procedural spine; `02-conversion-taxonomy.md`, `03-buyer-readiness-model.md`, and `04-hard-stop-gate.md` supply the depth for each downstream step.

## Where this sits in the run

This Drone is wave W2, sync, and runs only after both W1a (`stack-fingerprint-wasp-drone`) and W1b (`vendor-inventory-wasp-drone`) complete (build plan section 2's dependency graph). It is a genuine hard gate: `keyword-intelligence-wasp-drone` (wave W3) and every wave after it are blocked until this Drone either produces a passing assessment or halts the run per PRD-005 AC-2.

## Phase 1: read the required inputs

Per the shared-workspace contract in `prd-005-icp-positioning-index.md`, read:

- `01-recon/stack-fingerprint.md`
- `01-recon/vendor-inventory.md`

Do not re-derive stack or platform facts this Drone has no research grounding for; those belong to `stack-fingerprint-wasp-drone` and `vendor-inventory-wasp-drone`. This Drone's job is positioning analysis layered on top of what those two Drones already found, plus whatever landing-page copy and navigation structure it observes directly.

## Phase 2: infer niche and ICP from external observation

This is the step with the thinnest grounding in this pair's research archive, and that thinness should be stated plainly in the output, not hidden. The two ICP-methodology sources in the archive (abmatic.ai, hyperspect.ai) both describe building an ICP from a company's OWN closed-won/CRM/LTV data - a method this Drone cannot run, since it has no access to the audited business's internal sales data (distilled research section 2). Use their attribute vocabulary (firmographic / technographic / behavioral) as terminology only:

- **Firmographic signals**: read off landing-page copy and navigation for industry language, company-size language ("enterprise," "small business," specific verticals named), and geography. [raw/abmatic-ai-blog-what-is-an-ideal-customer-profile.md] [raw/hyperspect-ai-blog-icp-definition-framework.md]
- **Technographic signals**: cross-reference `01-recon/vendor-inventory.md` for integrations visible in the page source (CRM widgets, payment processors, scheduling tools) as a proxy for who the site is built to serve.
- **Behavioral/intent signals**: read calls-to-action, pricing-tier structure (self-serve vs. sales-assist framing), and the conversion mechanisms found in Phase 2 of `02-conversion-taxonomy.md`.

Write the result using `references/templates/icp-assessment-output-template.md`, to `02-positioning/niche-icp-assessment.md`. Every one of the four output sections (niche, ICP description, conversion-action taxonomy, buyer-readiness framing) carries its own stated confidence level, per PRD-005 AC-1 - do not produce a single overall confidence number covering all four.

## Phase 3: build the conversion-action taxonomy

See `02-conversion-taxonomy.md`. Do this before the buyer-readiness framing (Phase 4), since the readiness worksheet's page/offer classification draws on the conversion actions identified here.

## Phase 4: apply the buyer-readiness framing

See `03-buyer-readiness-model.md`. This produces the two-stage (awareness/decision) output PRD-005 asks for, built as an explicit collapse of the three-stage model this archive actually supports.

## Phase 5: evaluate the gate

See `04-hard-stop-gate.md`. Evaluate the gate AFTER attempting Phases 2 through 4, not before - a genuinely undeterminable site will surface through those phases producing nothing but "unmeasurable" or empty results, which is the evidence the gate decision needs. Do not skip straight to a gate decision without attempting the assessment first.

- If the gate passes: write `02-positioning/niche-icp-assessment.md`, `02-positioning/conversion-taxonomy.md`, and `02-positioning/buyer-readiness.md`, mark this Drone complete in `_shared/run-ledger.json`, and allow the run to proceed to wave W3.
- If the gate fails: do not write partial/low-confidence versions of those three files as if they were final output. Follow the halt procedure in `04-hard-stop-gate.md` instead.

## Non-negotiable operating rules

1. Never proceed past the gate on a low-confidence guess (PRD-005 non-goals): "low confidence with a stated reason is acceptable output, silent continuation is not."
2. Every one of the four AC-1 outputs (niche, ICP, taxonomy, readiness) carries its own confidence level.
3. Do not re-derive stack/platform facts already owned by `stack-fingerprint-wasp-drone`/`vendor-inventory-wasp-drone`; read their outputs instead.
4. State the two-stage buyer-readiness model's grounding honestly as an explicit collapse of a three-stage sourced model (see `03-buyer-readiness-model.md`), never as independently sourced.
5. `02-positioning/` is written only after the gate passes; a halted run does not leave partial files there that a later Drone might mistake for a completed assessment.
