# Multi-Regime Compliance Posture Matrix

**Source:** `research/external/2026-05-20-quebec-law25-saas-compliance.md` + `research/external/2026-05-20-eu-us-dpf-cross-border-transfers.md` + `research/external/2026-05-20-generator-landscape-2026.md`

---

## Which regimes apply to your SaaS?

| Regime | Applies if |
|---|---|
| **GDPR** | You have users in EU/EEA, or you process personal data of EU individuals |
| **CCPA/CPRA** | You have California users AND meet one of: $25M annual gross revenue, buy/sell/receive 100K+ consumers' data/yr, or derive 50%+ of revenue from selling personal data |
| **Quebec Law 25 (Law 25)** | You have Quebec users. No revenue threshold. Extraterritorial reach confirmed. |
| **LGPD (Brazil)** | You have Brazilian users. No revenue threshold. |
| **UK DUAA** | You have UK users post-Brexit. GDPR-equivalent but UK-specific. Confirm with attorney. |

---

## Document requirements by regime

| Document | GDPR | CCPA/CPRA | Quebec Law 25 | LGPD |
|---|---|---|---|---|
| **Privacy Policy** | Required | Required | Required | Required |
| **Cookie Notice** | Required (ePrivacy) | Required (opt-out link) | Required | Recommended |
| **DPA (as processor)** | Required (Art. 28) | Required (Service Provider Agreement) | Required (service agreement) | Required (analogous to Art. 28) |
| **MSA** | Recommended | Recommended | Recommended | Recommended |
| **Records of Processing Activities (RoPA)** | Required (Art. 30) if >250 employees, or high risk | Not required | Required (privacy incident register) | Required |
| **Data Protection Impact Assessment (DPIA)** | Required for high-risk processing | Not required | Required for high-risk | Required for high-risk |
| **Transfer Impact Assessment (TIA)** | Required for SCCs (post-Schrems II) | Not required | Required before EVERY cross-border transfer | Required for international transfers |

---

## Minimum viable compliance (pre-Series A / under 50 employees)

For early-stage SaaS with no dedicated legal ops:

**Tier 1 (all SaaS must have):**
- Privacy Policy (generator output + attorney review)
- Terms of Service (generator output + attorney review)
- Cookie Notice (CMP tool handles mechanics)

**Tier 2 (add when first EU customer signs):**
- Standard DPA (your processor form) available on demand
- Sub-processor list published (link from Privacy Policy and DPA)
- DSAR response process documented internally (even a Notion page suffices)

**Tier 3 (add at enterprise / regulated-sector deal):**
- Custom MSA with Order Form process
- Full RoPA (Records of Processing Activities)
- DPIA for high-risk features
- SOC 2 Type II or ISO 27001 (satisfies audit rights clause)

---

## Quebec Law 25 specific obligations (fully in force September 2024)

Law 25 is the most materially different regime from GDPR for SaaS:

1. **Mandatory TIA before every cross-border transfer:** unlike GDPR (TIA required for SCCs), Law 25 requires a TIA before any transfer of personal information outside Quebec, including to other Canadian provinces and US cloud providers.
2. **Privacy-incident register:** mandatory internal register of all privacy incidents (breaches, near-misses). CAI (Commission d'accès à l'information) must be notified of serious incidents.
3. **Automated decision-making disclosure:** if your SaaS makes decisions affecting individuals via algorithms, users must be told and can request human review.
4. **Portability:** users can request their data in a structured, commonly used format (similar to GDPR Art. 20).
5. **DPO-equivalent:** must designate a person responsible for personal information protection (can be the CEO/founder for small companies).
6. **Enforcement:** CAI issued its first enforcement order September 2024. Administrative fines up to C$25M or 4% of worldwide turnover.

**Generator gap:** neither Termly nor Iubenda explicitly covers Law 25 TIA requirements. Attorney review with a Quebec-specialized privacy lawyer is required for Law 25 compliance.

---

## LGPD (Brazil) posture recommendation (2026)

Research finding: LGPD enforcement is maturing (ANPD issued 7 resolutions in 2024-2025) but Brazil-specific DPA differentiation guidance from practitioners is limited compared to GDPR.

**Recommended posture for SaaS with Brazil exposure:**
- Use GDPR-analogous DPA structure (LGPD Art. 37-40 is substantively similar to GDPR Art. 28)
- Identify whether you are a "controller" or "operator" (LGPD terms; analogous to controller/processor)
- 10 legal bases under LGPD (more than GDPR's 6; notable addition: credit protection, health protection)
- ANPD notification within 2 working days of a data breach affecting rights or freedoms
- Consult a Brazil-specialized privacy attorney for material Brazil exposure; do not treat LGPD as GDPR-identical

---

## EU-US data transfers: DPF vs SCCs (2026 status)

| Scenario | Mechanism | Risk level |
|---|---|---|
| US processor DPF-certified | DPF adequacy reference in DPA (no SCCs needed) | Medium (Schrems III challenge risk) |
| US processor NOT DPF-certified | 2021 SCCs Module 2 + Article 28 DPA | Low (battle-tested) |
| Belt-and-suspenders approach | SCCs + DPF reference | Lowest (recommended for regulated-sector customers) |

**Schrems III monitoring:** the DPF adequacy decision is valid as of May 2026 but has been challenged before EU courts. Include a DPF-invalidation fallback clause in all DPAs: "If the adequacy decision is invalidated, the parties shall execute the 2021 SCCs within 30 days."
