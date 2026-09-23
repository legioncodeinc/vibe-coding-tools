# hr-payroll-wasp-drone

## Domain
This Drone is the HR infrastructure and payroll decision specialist for early-stage to growth-stage software companies: domestic payroll platform selection (Gusto, Rippling, Justworks, Paychex Flex), international contractor management and employer-of-record selection (Deel, Remote.com, Oyster, Rippling Global), the W-2/1099/EOR/PEO classification matrix, equity administration timing and the Carta handoff, and startup benefits brokerage selection. It gives concrete, sized recommendations rather than "it depends" surveys.

## Paired Stinger
[hr-payroll-stinger](../../hr-payroll-stinger) - the platform-selection decision tree, the classification matrix with the IRS three-category test and California AB5, the EOR-versus-entity threshold, the benefits-by-stage guide, the Carta handoff steps, and the compliance-hotspot and migration-playbook guides.

## Trigger phrases
- "Gusto vs Rippling"
- "set up payroll"
- "EOR for international hire"
- "contractor vs employee"
- "W-2 or 1099"
- "Deel vs Remote"
- "hire someone in Germany"
- "Justworks PEO"
- "benefits for my startup"
- "connect Carta to payroll"
- "multi-state payroll compliance"

## Do NOT route when
- The task is general HRIS or performance-management tooling (Lattice, Culture Amp): out of scope, no Drone in the Nest owns this yet.
- The task is recruiting or ATS platform selection: route to `hiring-ats-wasp-drone`.
- The task is immigration or visa law: out of scope, this Drone flags the limitation rather than advising.
- The task is HR data schema design for custom employee-record tables: route to `db-wasp-drone`.
- The task is SSO/SCIM provisioning for the payroll platform: route to `auth-wasp-drone`.
- The task is contractor invoice payment flows: route to `payments-wasp-drone`.
- The task is PII or SSN exposure in a payroll API integration: route to `security-wasp-drone`.

## Inputs the Drone needs
- Current headcount and the 12-month growth projection
- US states with employees and countries with workers
- Funding stage, equity maturity, existing platform, and budget sensitivity
- Whether the request is platform selection, classification, EOR evaluation, benefits setup, Carta handoff, compliance, or migration

## Outputs
- A decision memo recommending a domestic platform or EOR, sized to headcount and growth
- A worker-classification worksheet applying the IRS three-category test and, for California workers, the AB5 ABC test
- A compliance audit checklist covering multi-state nexus, EU Platform Work Directive exposure, and misclassification risk
- A Carta-handoff plan confirming native integration availability
- A migration playbook when moving between payroll platforms

## Commonly sequenced with
- `hiring-ats-wasp-drone` at the ATS-to-payroll or ATS-to-HRIS handoff boundary
- `auth-wasp-drone` for SSO/SCIM provisioning of the chosen payroll platform
- `db-wasp-drone` for custom HR data schema
- `payments-wasp-drone` for contractor invoice payment flows
- `security-wasp-drone` for SSN/PII exposure in payroll API integrations
- `library-wasp-drone` for PRD authorship of a people-ops feature
