---
source_type: official-template
authority: high
relevance: high
topic: dpa
url: https://ezel.ai/templates/gdpr-data-processing-agreement
date_fetched: 2026-05-20
---

# GDPR Data Processing Agreement Template: Article 28 Clause Anatomy

## Summary

Authoritative GDPR DPA template with explicit Article 28 clause-by-clause mapping. Published February 2026. Also cross-referenced with Docusign's official DPA template (February 2026) which covers UK GDPR. Both confirm the same mandatory clause structure. Primary reference for `guides/03-dpa.md`.

## Key Facts

### GDPR Article 28 Mandatory Clause Map

Every compliant DPA must contain clauses mapping to Art. 28(3)(a)-(h):

| Art. 28 Subsection | Required Clause | Content |
|---|---|---|
| 28(3)(a) | Processing per instructions | Processor only processes on documented Controller instructions |
| 28(3)(b) | Confidentiality | Personnel bound by confidentiality obligations |
| 28(3)(c) + Art. 32 | Security measures | Technical and organizational measures (encryption, access controls) |
| 28(3)(d) + 28(2) | Sub-processors | Written authorization required; same obligations flow down |
| 28(3)(e) | Data subject rights | Processor assists Controller in fulfilling DSARs (Arts. 15-22) |
| 28(3)(f) | Compliance assistance | DPIA support, breach notification assistance |
| 28(3)(g) | Data deletion/return | At Controller's choice upon termination |
| 28(3)(h) | Audits and inspections | Processor allows audits; makes information available |

Additionally required:
- **Art. 33** - Personal data breach notification (processor to controller within 72 hours)
- **Art. 5 International transfers** - Safeguards for data transfers outside EEA

### DPA Document Structure (canonical)

1. Definitions and interpretation
2. Scope and details of processing (including Schedule 1)
3. Processor obligations (Art. 28(3) clauses a-h)
4. Personal data breach notification (Art. 33)
5. International data transfers
6. Liability and indemnification
7. General provisions (term, governing law)

**Schedules:**
- Schedule 1: Details of the processing (subject matter, duration, nature, purpose, data types, data subject categories)
- Schedule 2: Controller's documented instructions
- Schedule 3: Technical and organizational security measures (TOMs)
- Schedule 4: Approved sub-processors

### Sub-Processor Clause (Critical Detail)

> "The Processor cannot engage a sub-processor without the Controller's prior written authorisation and remains fully liable for the sub-processor's performance."

Two authorization models:
- **Specific authorization:** Named sub-processors with written approval for each change
- **General authorization:** Controller approves category; Processor gives advance notice (typically 30 days) of changes with objection right

The general authorization with objection right is the standard market practice.

### Breach Notification Standard

> "The Processor must notify the Controller without undue delay after becoming aware of a Personal Data Breach."

GDPR requires notification within 72 hours of becoming aware. The DPA should specify the notification mechanism.

### Data Transfer Mechanisms (Post-Schrems II)

For transfers outside EEA to non-adequate countries:
- **EU-US Data Privacy Framework (DPF):** Adequate for transfers to certified US companies (adopted July 2023, still valid as of 2026)
- **Standard Contractual Clauses (SCCs):** Commission Decision 2021/914 (new modules replacing 2010 SCCs)
- **UK IDTA or UK Addendum:** For transfers from UK post-Brexit
- **BCRs (Binding Corporate Rules):** For intra-group transfers

**Practical current guidance:** A DPA covering US-based SaaS processors should reference SCCs as the baseline mechanism AND note whether the processor is EU-US DPF certified (eliminating the need for SCCs for that specific transfer).

## Key Quotations (from Docusign template, Feb 2026)

- "Sub-processors (Clause 3.4 & 3.5): The Processor cannot engage a sub-processor without the Controller's prior written authorisation and remains fully liable for the sub-processor's performance."
- "Audits (Clause 3.10): The Processor must make available all information necessary to demonstrate compliance and allow for audits or inspections conducted by the Controller or a mandated auditor."
- "International Transfers (Clause 5): Data cannot be transferred outside the UK without the Controller's prior consent, and appropriate safeguards (like the IDTA or the UK Addendum) must be put in place."

## Annotations for stinger-forge

- This is the primary reference for `guides/03-dpa.md`
- The Art. 28(3)(a)-(h) table is the canonical checklist to build the guide around
- The four-schedule structure is the template structure to recommend in `templates/sub-processor-list.md`
- Stinger should include a controller vs processor determination flowchart (SaaS is almost always processor for customer data)
- Cross-reference with the real-world Rencore DPA PDF source (see sister note) for actual implementation patterns
