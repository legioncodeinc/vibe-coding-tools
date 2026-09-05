---
source_type: practitioner-blog
authority: high
relevance: high
topic: compliance-posture-quebec-law25
url: https://cyberspective.ca/law-25-compliance/
date_fetched: 2026-05-20
---

# Quebec Law 25 SaaS Compliance: What Tech Companies Get Wrong (2026)

## Summary

April 2026 practitioner guide specifically addressing Quebec Law 25 compliance for SaaS companies. High relevance as it fills a gap in the command brief's regulatory coverage. Cross-referenced with CanCertify (Feb 2026) and Upper Harbour (Feb 2026) for enforcement status and tool-level compliance guidance.

## Key Facts

### Law 25 Status (Fully in Force as of September 2024)

Law 25 (Act to modernize legislative provisions as regards the protection of personal information) came into force in stages from September 2022 to September 2024. **As of 2026, all provisions are fully active.**

It is described as "the most stringent privacy law in Canada" and draws direct comparisons to GDPR.

### Extraterritorial Scope

> "Law 25 applies to any organization that collects, holds, uses, or communicates personal information in Quebec — regardless of where the organization is headquartered."

A Toronto-based or US-based SaaS company with Quebec customers must comply with Law 25 for those individuals' data. Law 25 is not limited to Quebec-incorporated businesses.

### Core Obligations for SaaS Companies

1. **Appoint a Privacy Officer** - default is CEO; must be formally delegated; contact info published on website
2. **Publish a Privacy Governance Policy** - in clear language; available on website in both English and French
3. **Obtain informed, specific, revocable consent** - separate consent for each purpose; cannot bundle
4. **Conduct Privacy Impact Assessments (PIAs)** - required for any new feature, integration, or information system touching personal data
5. **Privacy Impact Assessments for cross-border transfers** - required before any transfer outside Quebec
6. **Written agreements with service providers** - must include: what data, processing purposes, security measures, breach notification, data destruction

### Individual Rights Under Law 25

- Right to access personal information
- Right to correction
- Right to deletion / de-indexing (remove from search results)
- Right to data portability (structured format)
- Right to object to automated decisions

### Consent Standard

> "Consent must be explicit, informed, and granular. It must be requested separately for each purpose of data collection or use."

Additional safeguards for sensitive data and minors under 14 (parental authorization required).

### Cross-Border Transfer Assessment (TIA) Requirement

> "For every SaaS tool that processes personal information outside Quebec, you must complete a TIA before the transfer occurs."

The assessment must evaluate:
- Sensitivity of the information being transferred
- Purposes for which it will be used
- Protection measures in the receiving jurisdiction
- Risks associated with the transfer

**Practical implication:** US-based SaaS companies that are customers of US-operated tools (AWS, Stripe, etc.) must complete a TIA for each tool processing Quebec resident data.

### Enforcement Status (2026)

From CAI 2023-2024 annual report:
- 277 privacy complaints received
- 444 confidentiality incident notifications (81% from private sector)
- First enforcement order issued September 2024 (ordered company to cease biometric data collection)
- No major monetary penalties announced as of February 2026

**Assessment:** Enforcement is active but still early-stage. No major fines yet. Focus has been on organizations failing to appoint a privacy officer or publish adequate policies.

### Penalties

- Up to $10 million or 2% of worldwide turnover (per CanCertify)
- Up to $25 million or 4% of global revenue (per Standard ONE comparison)
- The higher penalties appear to apply to intentional or repeated violations

### Key Difference from GDPR

Law 25 requires **cross-border transfer assessments before each transfer** (similar to GDPR's adequacy/SCC requirement but operationally lighter - no formal SCC contract needed, just documented assessment).

### Answer to Brief's Quebec Law 25 Question

The command brief asks: Is the Law 25 compliance gap significant enough that a SaaS DPA needs to differ materially from a GDPR DPA?

**Answer:** The DPA structure does not need to be materially different, but the **written service provider agreement** under Law 25 must include the same elements as a GDPR DPA. The key Law 25-specific additions are:
1. Cross-border transfer assessment (TIA) requirement (documented, not contractual)
2. Privacy officer designation
3. PIA requirement for new features
4. Separate consent for each purpose

A GDPR-compliant DPA with a Law 25 addendum is the recommended approach.

## Key Quotations

- "Law 25 compliance looks different for technology and SaaS companies than it does for most other Quebec businesses. Your platform does not just collect personal data. It processes it, stores it, shares it with third-party integrations, and handles it on behalf of your clients."
- "Every time your team ships a feature that touches personal data, law 25 requires a PIA."
- "A documented law 25 compliance program with a completed PIA and a privacy policy that reflects your actual data practices is increasingly the difference between passing vendor due diligence and being removed from consideration."

## Annotations for stinger-forge

- Primary source for `guides/06-compliance-posture-matrix.md` Quebec Law 25 column
- The TIA requirement is a key operational difference from GDPR to highlight
- PIA-on-every-feature requirement is a product development process integration point (not just a legal document issue)
- Enforcement status note: enforcement is building, not yet at GDPR fine levels, but trajectory is clear
- Law 25 addendum approach (GDPR DPA + Law 25 addendum) is the recommended practical path for the stinger
