---
source_type: official-docs
authority: high
relevance: high
topic: dpa-cross-border-transfers
url: https://www.edpb.europa.eu/system/files/2026-01/edpb_dpf_faq-for-businesses_v2_en.pdf
date_fetched: 2026-05-20
---

# EU-US Data Privacy Framework (DPF): Status and DPA Implications (2026)

## Summary

Official EDPB FAQ (v2, January 2026) on the EU-US Data Privacy Framework. Also references the European Commission's first periodic review report (published 2024). Answers the command brief's open question on cross-border transfer status. Critical for DPA cross-border transfer clauses.

## Key Facts

### Current Status (as of May 2026)

**The EU-US Data Privacy Framework (DPF) is valid and operational.** The European Commission adopted the adequacy decision on **July 10, 2023**, replacing the invalidated Privacy Shield (struck down by Schrems II, July 2020).

- Personal data can flow freely from EU/EEA to US companies certified under the DPF
- No additional safeguards or SCCs required when the US company has an active DPF certification
- Certifications must be renewed annually
- The first periodic review (2024) confirmed the DPF is functioning effectively

### How to Verify DPF Certification

> "Before transferring personal data to a company in the U.S. under the DPF, a data exporter in the EEA must ascertain that the company in the U.S. holds an active self-certification."

Check: https://www.dataprivacyframework.gov/list

### DPA Still Required Even with DPF

> "When an EEA controller transfers data to a processor in the U.S., the controller and processor are obliged to conclude a data processing agreement under Article 28 GDPR, regardless of whether the processor is self-certified under the DPF."

**Critical:** DPF certification eliminates the need for SCCs as a cross-border transfer mechanism, but it does NOT eliminate the requirement for a GDPR Article 28 DPA. Both are required.

### Standard Contractual Clauses (SCCs) - Still the Fallback

For US processors NOT certified under DPF, the applicable mechanism is:
- **EU SCCs (Module 2: Controller to Processor):** Commission Decision 2021/914 - these are the current valid SCCs
- **UK IDTA or UK Addendum to SCCs:** For transfers from UK
- **Swiss Addendum:** For transfers from Switzerland

The old 2010 SCCs are no longer valid for new contracts (expired June 2021).

### Transfer Mechanisms Summary for DPA Clauses

| Transfer From | US Processor is DPF Certified | US Processor NOT DPF Certified |
|---|---|---|
| EU/EEA | DPF adequacy - free transfer + Art. 28 DPA | 2021 SCCs (Module 2) + Art. 28 DPA |
| UK | DPF adequacy (UK addendum) + Art. 28 DPA | UK IDTA + Art. 28 DPA |
| Switzerland | Swiss Federal adequacy + Art. 28 DPA | Swiss Addendum to SCCs + Art. 28 DPA |

### Important Limitation: Not All DPF Certifications Cover HR Data

> "Note that not all DPF self-certifications cover HR Data. It is therefore important to check whether this is the case."

SaaS companies processing employee data of EU-based customers' employees must verify the specific HR Data coverage of the processor's DPF certification.

### Answer to Command Brief Q2: DPF Status for DPA Cross-Border Clauses

**Full answer:** The DPF adequacy decision is valid and operational as of May 2026. For DPA cross-border transfer clauses:
- Recommend DPF certification check as the first step for any US processor
- If certified: DPF reference in the DPA eliminates the need for SCCs
- If not certified: Reference the 2021 SCCs (Module 2, Controller-to-Processor)
- Always execute GDPR Art. 28 DPA regardless of transfer mechanism

**Practical stinger guidance:**
1. The DPA template should include a modular clause that covers both scenarios (DPF-certified and SCC-fallback)
2. The sub-processor list template should include a "transfer mechanism" column (DPF / SCCs / adequacy decision)

## Key Quotations

- "The adequacy decision followed the adoption of Executive Order on 'Enhancing Safeguards for United States Signals Intelligence Activities' by US President Biden on 7 October and a Regulation issued by the US Attorney General."
- "Companies that have been removed from the Data Privacy Framework List must continue to apply the Data Privacy Framework Principles to personal data received while participating in the DPF for as long as they retain these data."

## Annotations for stinger-forge

- This is the authoritative source for the DPA guide's cross-border transfer section
- The modular DPA clause approach (DPF + SCC fallback) is the recommended template design for `guides/03-dpa.md`
- The sub-processor list template (`templates/sub-processor-list.md`) should include a "transfer mechanism" column
- Schrems III risk: the DPF has been challenged legally (CNIL complaints filed 2023-2024); stinger should include a "transfer mechanism review" trigger in the refresh cadence guide
- The EDPB first periodic review PDF confirms DPF is functioning but does not preempt legal challenges
