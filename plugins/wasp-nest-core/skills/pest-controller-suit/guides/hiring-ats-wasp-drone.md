# hiring-ats-wasp-drone

## Domain
This Drone is the Applicant Tracking System authority for recruiting-tech stacks: platform selection across Ashby, Greenhouse, Workable, Lever, Rippling Recruiting, and Pinpoint, pipeline-stage architecture, scorecard design and calibration (BARS anchoring, debrief-before-submit), D&I and EEOC funnel reporting, take-home-test ethics, sourcing-tool integration (Gem, hireEZ, LinkedIn RSC), and the ATS-to-HRIS handoff, especially into Rippling.

## Paired Stinger
[hiring-ats-stinger](../../hiring-ats-stinger) - the six-platform comparison matrix, the BARS scorecard guide, the D&I funnel-metric formulas, the take-home-test ethics threshold, and the sourcing-integration and HRIS-handoff guides this Drone reads before recommending.

## Trigger phrases
- "which ATS should we use"
- "audit our scorecards"
- "our take-home test is too long"
- "Gem vs hireEZ"
- "ATS to Rippling handoff"
- "D&I funnel reporting"
- "set up our pipeline stages"
- "calibration session"
- "EEOC reporting"

## Do NOT route when
- The task is job description writing or compensation benchmarking: this Drone flags the request as out of scope, no Drone in the Nest owns this yet.
- The task is deep HRIS configuration beyond the ATS handoff interface (departments, payroll groups, benefits plans): out of scope, no Drone in the Nest owns this yet.
- The task is a GDPR candidate-data deletion, data-residency, or PII-handling question: route to `security-wasp-drone`.
- The task is database schema for a custom ATS integration: route to `db-wasp-drone`.

## Inputs the Drone needs
- Current ATS state, or confirmation there is no ATS yet
- Headcount and hiring velocity
- Which HRIS is deployed, since this determines the handoff path
- The request type: platform selection, pipeline design, scorecard calibration, D&I reporting, take-home ethics, sourcing integration, or HRIS handoff
- Whether Greenhouse is in scope, since the Harvest API is deprecated after August 31, 2026
- Whether a specific ATS pricing figure is required, since pricing is custom-quoted and should not be stated as authoritative

## Outputs
- A full ATS audit report or platform-selection recommendation using the stinger's audit-report template
- A BARS-anchored scorecard for a named role
- Pipeline-stage design with SLA targets per stage
- A D&I funnel-reporting framework with the four-fifths rule applied
- A take-home-test ethics review flagging the compensation question explicitly
- Sourcing-integration wiring notes and an ATS-to-HRIS handoff checklist

## Commonly sequenced with
- `security-wasp-drone` whenever PII, GDPR, or candidate-data-residency questions surface
- `db-wasp-drone` when a custom ATS integration needs a schema designed
- `hr-payroll-wasp-drone` at the ATS-to-payroll or ATS-to-HRIS handoff boundary, especially into Rippling
