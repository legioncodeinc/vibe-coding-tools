---
name: legal-docs-stinger
description: SaaS legal document generation and maintenance specialist. Covers Terms of Service, Privacy Policy, DPA, MSA, and Cookie Notice using the template+lawyer-review path. Anchored in Termly/Iubenda generators and GDPR/CCPA/Quebec Law 25/LGPD compliance postures. Use when the user says "generate a privacy policy", "draft a DPA", "set up our Terms of Service", "review a customer DPA redline", "which legal doc generator should I use", "GDPR compliance for SaaS", or when legal-docs-worker-bee is invoked. Do NOT use for technical data-protection controls (security-worker-bee), database schema for personal-data fields (db-worker-bee), or contract negotiation strategy beyond the DPA (legal team).
license: MIT
---

# Legal Docs Stinger

The practitioner arsenal for generating and maintaining the five core SaaS legal documents. Read `guides/00-generator-selection.md` first to orient to the generator landscape, then navigate to the document-specific guide that matches the current task.

---

## Quick-start routing

| Task | Guide |
|---|---|
| Choose Termly vs Iubenda vs Osano | `guides/00-generator-selection.md` |
| Draft or audit Terms of Service | `guides/01-terms-of-service.md` |
| Draft or audit Privacy Policy | `guides/02-privacy-policy.md` |
| Draft or audit DPA (as data processor) | `guides/03-dpa.md` |
| Draft or audit MSA | `guides/04-msa.md` |
| Draft or audit Cookie Notice | `guides/05-cookie-notice.md` |
| Multi-regime compliance check | `guides/06-compliance-posture-matrix.md` |
| Receive and respond to a customer DPA redline | `guides/07-customer-dpa-workflow.md` |

---

## File index

### Principles and procedures (guides/)

- `guides/00-generator-selection.md` — Termly vs Iubenda vs Osano vs Contractbook decision matrix, pricing tiers, jurisdiction coverage, CMP bundling
- `guides/01-terms-of-service.md` — canonical ToS section checklist (10 required clauses), clickwrap vs browse-wrap enforcement, EULA vs SaaS ToS distinction
- `guides/02-privacy-policy.md` — required sections by regime, data-inventory input process, cookie disclosure, right-to-deletion workflow
- `guides/03-dpa.md` — GDPR Article 28 mandatory clauses, four-schedule structure, DPF vs SCCs transfer mechanism, sub-processor approval
- `guides/04-msa.md` — SaaS MSA structure (9 required sections), startup defaults, enterprise negotiation pressure points, MSA vs ToS decision
- `guides/05-cookie-notice.md` — cookie category taxonomy, consent banner mechanics, IAB TCF v2.3, GPC signal (CPRA 2026 requirement), GDPR vs CCPA consent standards
- `guides/06-compliance-posture-matrix.md` — GDPR / CCPA / Quebec Law 25 / LGPD side-by-side requirements table with minimum-viable-compliance tier
- `guides/07-customer-dpa-workflow.md` — Red Flag / Fallback Matrix, triage protocol, timing rules, response memo structure

### Worked examples (examples/)

- `examples/data-inventory-example.md` — completed data-inventory input for a typical B2B SaaS (CRM + analytics + payment)
- `examples/customer-dpa-response-example.md` — annotated DPA response memo showing the Red Flag / Fallback Matrix applied to a real redline

### Output templates (templates/)

- `templates/privacy-policy-data-inventory.md` — fillable input form for mapping personal data categories to purposes, retention, and third parties
- `templates/sub-processor-list.md` — the living sub-processor table required by GDPR Article 28(2)
- `templates/customer-dpa-response-memo.md` — clause-by-clause response memo for customer DPA negotiations

### Reports (reports/)

- `reports/README.md` — report accumulation policy; dated audit reports go here

### Research trail (research/)

- `research/research-plan.md` — depth tier, time window, query plan
- `research/research-summary.md` — executive summary, 5 most influential sources, 5 open questions
- `research/index.md` — manifest of all source files
- `research/internal/command-brief-notes.md` — brief extraction and scope decisions
- `research/external/` — 9 source notes (ToS, generator comparison, DPA, MSA, Quebec Law 25, DPF/SCCs, customer-DPA negotiation)

---

## The attorney-review invariant

Every output from this stinger is a **best-effort starting point**, not a compliance certification. The canonical closing line for all outputs is:

> "This is a generated draft for reference. Have a qualified attorney licensed in your jurisdiction review all legal documents before publishing or countersigning."

No exceptions. Including this line is a critical directive for `legal-docs-worker-bee`.

---

## Refresh triggers

Re-run scripture-historian at `shallow` tier when any of the following occur:

- New EU SCCs version published by the European Commission
- CCPA/CPRA implementing regulations amended
- Quebec Law 25 enforcement action or new CAI guidance
- LGPD (ANPD) material enforcement action or new guidance
- New IAB TCF major version
- EU-US DPF adequacy decision challenged or revoked (Schrems III risk)
- A new data category or sub-processor added to the product (partial refresh)
- Termly or Iubenda pricing / jurisdiction-coverage changes materially

---

*Paired Angel: `ai-tools/agents/legal-docs-worker-bee.md`*
*Command Brief: `ai-tools/command-briefs/legal-docs-worker-bee-command-brief.md`*
*Research: `ai-tools/skills/legal-docs-stinger/research/`*
