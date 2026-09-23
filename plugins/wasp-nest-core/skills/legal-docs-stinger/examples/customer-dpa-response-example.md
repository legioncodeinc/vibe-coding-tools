# Customer DPA Response Memo: Annotated Example

This worked example shows the Red Flag / Fallback Matrix applied to a real DPA redline from an enterprise customer ("Acme Corp"). Use it as a reference when authoring a response using `templates/customer-dpa-response-memo.md`.

---

## Context

- **Customer:** Acme Corp (EU-based, GDPR controller)
- **Vendor:** ExampleSaaS Inc. (US-based, DPF-certified, GDPR processor)
- **Document:** Acme Corp's standard DPA redline of ExampleSaaS's form
- **Triage date:** 2026-05-20

---

## Clause-by-clause response

### Clause 1: Sub-processor notification

**Acme's demand:** "Vendor must obtain written approval from Acme for each new sub-processor before engaging them."

**Risk level:** High (operational burden; would block adding any new tool)

**Recommendation:** Negotiate

**Our position:** We use general written authorization (standard per GDPR Art. 28(2)) with a 30-day advance notice period for additions.

**Proposed counter-language:**
> "Vendor maintains a publicly accessible sub-processor list at [URL]. Vendor shall provide Acme with 30 days advance notice of any material change to the sub-processor list. Acme may object in writing within 10 business days of receipt of such notice. If Acme objects and the parties cannot resolve the objection, Acme may terminate this DPA on 30 days written notice."

**Annotation:** This is the industry-standard position. The key concession is the 10-day objection window, which gives Acme real rights without requiring per-processor approval.

---

### Clause 2: Breach notification timeline

**Acme's demand:** "Vendor shall notify Acme within 24 hours of becoming aware of any personal data breach."

**Risk level:** Medium (24 hours is aggressive; GDPR standard is 72 hours to DPA)

**Recommendation:** Negotiate

**Our position:** We can commit to 48 hours to controller notification.

**Proposed counter-language:**
> "Vendor shall notify Acme without undue delay, and in any event within 48 hours of becoming aware of a personal data breach affecting Acme's personal data. Such notification shall include the information required by GDPR Article 33(3) to the extent available at the time of notification, with additional details provided as they become available."

**Annotation:** 48 hours is a reasonable compromise between Acme's 24 hours and GDPR's 72 hours. It is achievable operationally if the incident response process includes immediate escalation.

---

### Clause 3: Audit rights

**Acme's demand:** "Acme may conduct an annual on-site audit of Vendor's data processing facilities, upon 5 business days notice."

**Risk level:** High (5 business days notice is not operationally feasible; on-site audit creates security risk)

**Recommendation:** Negotiate

**Our position:** Third-party audit report (SOC 2 Type II) in lieu of direct audit rights, except for cause.

**Proposed counter-language:**
> "Vendor shall provide Acme with its current third-party audit report (SOC 2 Type II or ISO 27001 certificate) upon request, at no charge, no more than once per calendar year. Acme may conduct a direct audit (i) upon 30 days advance written notice, (ii) at Acme's expense, (iii) no more than once per year absent a material security incident."

**Annotation:** This is the standard enterprise SaaS position. SOC 2 Type II is issued annually and is the accepted substitute for most buyers. The "except for cause" carve-out satisfies procurement without creating an operational audit burden.

---

### Clause 4: Unlimited liability for data breach

**Acme's demand:** "The liability cap shall not apply to any claims arising from Vendor's breach of its data protection obligations."

**Risk level:** Critical

**Recommendation:** Reject; escalate to counsel

**Our position:** We accept a data breach sublimit (2x annual fees) but not unlimited liability.

**Proposed position for counsel to negotiate:**
> "Notwithstanding the limitation of liability clause, Vendor's total liability for claims arising from Vendor's breach of its data protection obligations shall not exceed [2x annual fees paid by Acme in the 12 months preceding the claim]. This sublimit is separate from and cumulative with the general liability cap."

**Annotation:** This is a material position. Do not accept unlimited data breach liability without board approval and insurance verification. This clause must be reviewed by outside counsel before responding.

---

### Clause 5: AI training prohibition

**Acme's demand:** "Vendor shall not use Acme Personal Data to train, fine-tune, or improve any artificial intelligence or machine learning model, including models operated by Vendor's sub-processors."

**Risk level:** Low

**Recommendation:** **Accept as-is**

**Annotation:** This is now standard practice for enterprise SaaS in 2026. Accepting this clause signals trustworthiness and unblocks deals faster than negotiating. If your architecture currently uses customer data for any ML training, that must be fixed before accepting this clause.
