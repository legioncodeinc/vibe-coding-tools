# Command Brief Notes: legal-docs-worker-bee

Extracted by scripture-historian from `ai-tools/command-briefs/legal-docs-worker-bee-command-brief.md`.

## Metadata

- **Angel name:** `legal-docs-worker-bee`
- **Stinger name:** `legal-docs-stinger`
- **Research depth:** normal
- **Backlog position:** 162
- **Created:** 2026-05-20

## Domain Summary

`legal-docs-worker-bee` owns the full lifecycle of the five canonical SaaS legal documents:

1. Terms of Service (ToS / EULA)
2. Privacy Policy
3. Data Processing Agreement (DPA)
4. Master Service Agreement (MSA)
5. Cookie Notice / Cookie Policy

The "template + lawyer review" path is the opinionated delivery model. Primary generator platforms: Termly, Iubenda, Osano. CLM/contract layer: Contractbook, Docusign CLM.

## Scope Boundaries (from brief)

- **Owns:** document authoring, generation, maintenance, customer-DPA triage workflow.
- **Does NOT own:** technical data-protection controls (route to `security-worker-bee`), database schema decisions for personal-data fields (route to `db-worker-bee`), commercial contract negotiation strategy beyond the DPA.

## Compliance Regimes to Cover

| Regime | Jurisdiction | Key Notes from Brief |
|---|---|---|
| GDPR | EU/EEA | Art. 28 DPA mandatory, SCCs for cross-border |
| CCPA/CPRA | California, USA | Opt-out model, GPC signal |
| Quebec Law 25 | Canada (Quebec) | PIAs required, strictest Canadian law |
| LGPD | Brazil | Brief asks: is enforcement mature enough by 2026? |

## Proposed Guides (stinger-forge targets)

- `guides/00-generator-selection.md` - Termly vs Iubenda vs Osano vs Contractbook
- `guides/01-terms-of-service.md` - ToS section checklist, clickwrap vs browse-wrap
- `guides/02-privacy-policy.md` - regime-specific required sections, data inventory
- `guides/03-dpa.md` - Art. 28, SCCs, sub-processor list, controller vs processor
- `guides/04-msa.md` - SaaS MSA structure, startup defaults, enterprise pressure points
- `guides/05-cookie-notice.md` - cookie taxonomy, consent banner, IAB TCF v2.2
- `guides/06-compliance-posture-matrix.md` - GDPR / CCPA / Quebec Law 25 / LGPD side-by-side
- `guides/07-customer-dpa-workflow.md` - receive redline, triage, produce response memo

## Proposed Templates

- `templates/privacy-policy-data-inventory.md`
- `templates/sub-processor-list.md`
- `templates/customer-dpa-response-memo.md`

## Critical Directives from Brief

1. Always close with attorney-review disclaimer.
2. Never assert regulatory compliance on behalf of a specific company.
3. Always surface applicable privacy regimes before generating.
4. Do not route technical data-protection questions.
5. Always name the sub-processor list as a living artifact.

## Open Questions Carried In (for scripture-historian to resolve)

- Q1: Is Termly's 2026 generator current with CCPA/CPRA amendments and Quebec Law 25?
- Q2: What is the current status of the EU-US Data Privacy Framework (post-adequacy decision) for cross-border transfer clauses in DPAs?
- Q3: Has LGPD enforcement matured enough in 2026 that Brazilian market exposure requires a materially different DPA from the GDPR one?

## Reference Material URLs from Brief

- https://termly.io/products/terms-and-conditions-generator/
- https://www.iubenda.com/en/terms-and-conditions-generator
- https://www.osano.com/
- https://contractbook.com/templates/saas-msa
- https://gdpr.eu/article-28-processor/
- https://oag.ca.gov/privacy/ccpa
- https://www.cai.gouv.qc.ca/en/
- https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd
- https://iapp.org/resources/
