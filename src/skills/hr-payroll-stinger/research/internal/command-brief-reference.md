---
source_url: file://c:/Users/mario/GitHub/legion-code/ai-tools/command-briefs/hr-payroll-worker-bee-command-brief.md
retrieved_on: 2026-05-20
source_type: internal
authority: official
relevance: critical
topic: stinger-scope
stinger: hr-payroll-stinger
---

# Internal Reference: hr-payroll-worker-bee Command Brief

## Summary
Command Brief authored by command-center on 2026-05-20. Defines the Angel's identity, responsibility boundaries, expected input, action sequence, output format, and critical directives. Also contains the proposed guides/ structure, reference material list, and open questions that should inform stinger-forge's architecture decisions.

## Key scope boundaries extracted from the brief

- **In scope:** Domestic payroll (Gusto, Rippling, Justworks, Paychex Flex), international contractor management and EOR (Deel, Remote.com, Oyster, Rippling Global), W-2 vs 1099 vs EOR vs PEO classification matrix, equity admin timing and Carta handoff, benefits brokerage selection (Gusto Benefits, Rippling Benefits, PeopleKeep HRA, brokered HRA)
- **Out of scope:** General HRIS/performance management (Lattice, Rippling HRIS beyond payroll — no peer Angel yet), recruiting/ATS, immigration/visa workflows beyond the EOR-vs-immigration fork
- **Handoff points (not overlaps):** auth-worker-bee (SSO/SCIM for payroll platform), db-worker-bee (HR data schema), library-worker-bee (PRD authorship), security-worker-bee (SSN/PII exposure in payroll integrations), payments-worker-bee (contractor invoice flows)

## Proposed guides/ structure (from the brief)
- `guides/00-principles.md` — scope, "classify before recommend" rule, legal-advice fence
- `guides/01-platform-selection.md` — domestic payroll decision tree (Gusto/Rippling/Justworks/Paychex Flex)
- `guides/02-classification-matrix.md` — W-2 vs 1099 vs EOR vs PEO decision matrix
- `guides/03-international-eor.md` — EOR platform selection (Deel/Remote/Oyster/Rippling Global)
- `guides/04-benefits-brokerage.md` — startup benefits selection
- `guides/05-carta-handoff.md` — equity admin integration
- `guides/06-compliance-hotspots.md` — multi-state nexus, AB5, FLSA, I-9, state PFL, EU/UK EOR changes
- `guides/07-migration-playbook.md` — provider migration (Gusto → Rippling, 1099 → EOR)

## Open questions from the brief (for stinger-forge to resolve)
1. "Does the 2026 research surface any material changes to Rippling's pricing model (shifted to modular in 2024) that affect the comparison table?" — YES: Rippling modular pricing confirmed at $8 base + add-ons; typical total $20-$30/employee; transparent pricing is difficult because modules are customized per deal
2. "Is Oyster still competitive with Deel and Remote.com post-2025 expansion, or has market consolidation shifted the recommendation?" — YES, Oyster remains competitive at $499-$599/employee with 180+ country coverage and free contractor tier (up to 2); suitable for SME-friendly onboarding
3. Suggestion for worked example: "15-person US startup with 3 international contractors deciding between Gusto+Deel vs Rippling Global" — research gathered enough pricing data to construct this example; stinger-forge should include it in `guides/01-platform-selection.md` or `guides/03-international-eor.md`

## Annotations for stinger-forge
- The "classify before recommend" directive is the structural foundation of the stinger — all guides should funnel through `guides/02-classification-matrix.md` before reaching a platform recommendation
- The legal-advice fence is non-negotiable: the Angel provides frameworks, not legal opinions. Every classification output should include a "consult a CPA / immigration attorney / employment lawyer at this branch" note
- The "size the company before naming a price" directive means all platform recommendation guides must begin with headcount and growth projection as required inputs
