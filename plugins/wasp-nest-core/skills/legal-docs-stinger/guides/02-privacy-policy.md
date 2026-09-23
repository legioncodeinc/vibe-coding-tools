# Privacy Policy: Required Sections and Data Inventory

**Source:** `research/external/2026-05-20-saas-tos-checklist.md` + `research/external/2026-05-20-generator-landscape-2026.md` + research-summary.md

---

## Required sections by regime

The table below maps required privacy policy sections to each applicable regime. Generate for the union of all applicable regimes.

| Section | GDPR | CCPA/CPRA | Quebec Law 25 | LGPD |
|---|---|---|---|---|
| Identity of data controller (name, address, contact) | Required | Required | Required | Required |
| DPO contact (if applicable) | Required | Not applicable | Not required | Not required |
| Categories of personal data collected | Required | Required (explicit list) | Required | Required |
| Purposes of processing (per category) | Required (legal basis) | Required | Required | Required |
| Legal basis for processing | Required (6 bases) | Not applicable | Not applicable | Required (similar 10 bases) |
| Third parties / sub-processors disclosed to | Required | Required ("sale" or "sharing") | Required | Required |
| Data retention periods | Required | Not required | Required | Required |
| International data transfers | Required (mechanism) | Not required | Required (TIA) | Required (equivalent protection) |
| Rights of data subjects | Required (8 GDPR rights) | Required (6 CPRA rights) | Required (Law 25 rights) | Required (9 LGPD rights) |
| Right to lodge complaint | Required | Not required | Required (CAI) | Not required |
| Cookie and tracking disclosure | Required (ePrivacy) | Required (CPRA opt-out) | Required | Not explicitly required |
| Children's data | Required if applicable | Required if applicable | Required if applicable | Required if applicable |
| Automated decision-making | Required if applicable | Not required | Not required | Required if applicable |
| Last updated date | Best practice | Best practice | Required | Best practice |

---

## Data inventory: the critical input

The privacy policy is only as accurate as the data inventory behind it. Use `templates/privacy-policy-data-inventory.md` to capture:

1. **Data categories:** what types of personal data do you collect? (name, email, IP address, usage analytics, payment card data, location, health data, etc.)
2. **Collection method:** user provides it / automatically collected / received from third party
3. **Purpose:** why you collect each category (account creation, service delivery, analytics, marketing, legal obligation)
4. **Legal basis (GDPR):** which of the 6 bases applies (consent, legitimate interest, contract, legal obligation, vital interests, public task)
5. **Retention period:** how long you keep it
6. **Third parties:** which service providers or sub-processors receive this category (Stripe, Mailchimp, AWS, Datadog, Intercom, etc.)
7. **International transfer mechanism:** DPF, SCCs (Module which?), adequacy decision, BCRs, or none needed

**Rule:** every data category in your product must appear in the privacy policy. If you can't fill in the inventory table, the privacy policy cannot be accurate.

---

## Rights of data subjects (quick reference)

### GDPR rights (8)
1. Right to be informed
2. Right of access (Subject Access Request)
3. Right to rectification
4. Right to erasure (right to be forgotten)
5. Right to restrict processing
6. Right to data portability
7. Right to object
8. Rights related to automated decision-making and profiling

### CCPA/CPRA rights (6)
1. Right to know
2. Right to delete
3. Right to opt out of sale or sharing
4. Right to non-discrimination
5. Right to correct
6. Right to limit use of sensitive personal information

### Quebec Law 25 rights
- Right of access
- Right to correct
- Right to be forgotten (new, September 2023)
- Right to data portability (new, September 2022)
- Right to complain to the CAI

---

## Cookie and tracking section

Required by GDPR (ePrivacy Directive) and CCPA/CPRA (GPC signal as of 2026). Must include:

- List of cookie categories used (strictly necessary, functional, analytics, advertising)
- Names of tracking technologies (cookies, pixels, localStorage, fingerprinting if any)
- Third-party analytics and advertising platforms
- How to opt out (link to cookie preference center)
- GPC signal support statement (required for California as of CPRA 2026)

See `guides/05-cookie-notice.md` for the full cookie guide.

---

## Privacy policy refresh triggers

Republish and notify users when:
- A new data category is collected
- A new third-party processor is added
- A new market is entered (triggers new regime obligations)
- A regulation updates (CCPA amendment, new EU adequacy decision)
- A major product change affects how data is used

**30-day advance notice is the GDPR standard** for material changes (Article 12). CCPA does not mandate a notice period but best practice is 15-30 days.
