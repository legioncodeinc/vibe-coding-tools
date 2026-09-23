# Terms of Service: Section Checklist and Authoring Guide

**Source:** `research/external/2026-05-20-saas-tos-checklist.md` + `research/external/2026-05-20-saas-tos-enterprise-template.md`

---

## SaaS ToS vs EULA: choose the right form

| Form | Use when | Key distinction |
|---|---|---|
| **SaaS Terms of Service** | Web-based service, subscription, no software download | User accesses via browser; IP stays with vendor |
| **EULA (End User License Agreement)** | Downloadable software, on-premise install | Grants a license to execute the software; more restrictive |
| **Combined ToS + EULA** | SaaS with downloadable client / mobile app | Most B2B SaaS with mobile apps needs both |

**Default for most SaaS:** Terms of Service (not EULA).

---

## Acceptance mechanism: clickwrap is required

Courts have repeatedly refused to enforce ToS presented as browse-wrap (where the terms are linked in a footer and acceptance is implied by use). **Always use clickwrap:**

- Checkbox: "I agree to the Terms of Service and Privacy Policy" — user must actively check
- Or: "By clicking Sign Up, you agree to our Terms of Service"
- Link to ToS must be visible (not buried) at the point of acceptance
- Log the acceptance event: timestamp, user identifier, ToS version, IP address

---

## 10 required clauses for SaaS ToS

### Clause 1: Acceptance mechanism

States that by creating an account or using the service the user agrees to these terms. References the clickwrap moment. Must be the first substantive clause.

### Clause 2: License grant

Grants the user a limited, non-exclusive, non-transferable, revocable license to access and use the service for the authorized purposes. Scope of license is a key enterprise negotiation point.

### Clause 3: Account registration and security

User is responsible for maintaining account credentials. Vendor is not liable for unauthorized access due to user negligence. Requires accurate registration information.

### Clause 4: Acceptable Use Policy (AUP)

Enumerates prohibited uses (illegal activity, scraping, reverse engineering, competitive intelligence, abuse of other users). Links to a separate AUP document for enterprise-grade products.

### Clause 5: Fees and payment terms

Subscription billing cadence, auto-renewal, refund policy (or explicit no-refund policy), price change notice period (typically 30 days). References the Order Form for enterprise accounts.

### Clause 6: Intellectual property ownership

Vendor retains all IP in the service, including derivative works. User retains ownership of their data (this is important — address explicitly). Any feedback or suggestions user provides may be used by vendor without obligation.

### Clause 7: User content and data

Vendor has a limited license to process user data to provide the service. User represents they have the right to upload the data. Describes data portability and deletion on account termination.

### Clause 8: Warranty disclaimer

Service is provided "AS IS." No warranty of merchantability, fitness for a particular purpose, or uninterrupted service. This clause is legally significant; do not weaken it.

### Clause 9: Limitation of liability

Caps total liability at the greater of amounts paid in the prior 12 months or a fixed amount (e.g., $1,000). Excludes consequential, indirect, and incidental damages. Enterprise customers will negotiate this cap upward; SaaS startup default: 12-month fees.

### Clause 10: Governing law and dispute resolution

Jurisdiction, choice of law, and dispute resolution mechanism (arbitration clause, class-action waiver, or litigation). US SaaS default: Delaware law, AAA arbitration. EU customer addendum: may need to select a neutral EU member state.

---

## Optional but strongly recommended clauses

- **SLA reference:** "Uptime commitments are set out in the Service Level Agreement at [URL]" (keep SLA in a separate document for enterprise flexibility)
- **Beta program terms:** limits liability for beta features explicitly
- **Third-party integrations:** vendor is not liable for third-party service outages that affect the integration
- **Modifications to terms:** 30-day advance notice for material changes; continued use constitutes acceptance

---

## Enterprise ToS additions (multi-role / multi-team products)

- Definition of "Authorized Users" and "Customer Administrators"
- Order Form incorporation (the Order Form governs in case of conflict)
- Multi-site or multi-instance rights
- Data processing responsibilities (reference DPA)

---

## Authoring workflow

1. Use the generator (Termly or Iubenda) to produce the base document.
2. Run the 10-clause checklist above — flag missing clauses.
3. Verify clickwrap language and acceptance-log requirement.
4. If enterprise customers are in scope, add the enterprise additions.
5. Send to attorney for review before publishing.
