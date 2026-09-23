# Master Service Agreement (MSA): Structure and Startup Defaults

**Source:** `research/external/2026-05-20-msa-saas-template-structure.md` + `research/external/2026-05-20-saas-tos-enterprise-template.md`

---

## MSA vs ToS: when to use each

| Form | Use when |
|---|---|
| **Terms of Service (ToS)** | Self-serve product, credit-card signup, contract formed by click-through acceptance |
| **MSA** | Enterprise deal, sales-negotiated, multi-year contract, custom pricing, procurement required |
| **Both (MSA + Order Form)** | Enterprise with multiple products or purchase orders; Order Form incorporates MSA by reference |

**Decision rule:** if a customer has a legal or procurement team reviewing the contract, you need an MSA. For self-serve customers below $5k ACV, ToS is sufficient.

---

## 9 required MSA sections

### Section 1: Services description

Reference the Order Form or Statement of Work (SoW) for the specific services. The MSA itself should be generic. Avoid hard-coding product names or feature sets that may change.

### Section 2: Subscription and payment terms

- Annual vs monthly billing (annual preferred for SaaS; discounted rate in exchange for commitment)
- Auto-renewal clause with notice period for cancellation (typically 60-90 days before renewal)
- True-up mechanism for user count overages
- Late payment interest rate (1.5%/month is typical)
- Currency and tax handling (VAT for EU customers)

### Section 3: Intellectual property ownership

- Vendor retains all IP in the service and its derivatives
- Customer retains ownership of their data
- Vendor has a limited license to process customer data to provide the service
- No license to use customer data for training AI models (this clause is increasingly demanded in 2026)

### Section 4: Confidentiality

Mutual NDA-style clause. Standard carveouts: publicly available information, independently developed, received from a third party without obligation. Survival period: typically 3-5 years post-termination.

### Section 5: Warranties and representations

Vendor warranties:
- Service will perform materially as documented
- Vendor has authority to enter this agreement
- Service does not infringe third-party IP

Customer warranties:
- Customer has authority to enter this agreement
- Customer data does not infringe third-party IP

Disclaimer: All other warranties disclaimed (merchantability, fitness for purpose, uninterrupted service).

### Section 6: Limitation of liability

This is the most heavily negotiated clause in enterprise SaaS MSAs.

| Position | Liability cap |
|---|---|
| Startup default | 12 months of fees paid in the prior subscription year |
| Enterprise mid-market | 24 months of fees |
| Government / regulated sector | Unlimited or very high caps (rare) |
| Exclusions from cap | Gross negligence, willful misconduct, IP indemnity, death/personal injury, data breach (negotiated) |

**Consequential damages waiver:** exclude loss of profits, loss of data, business interruption. Enterprise customers will push back on the data-loss exclusion — consider carving out data breach liability up to a sublimit.

### Section 7: Indemnification

Vendor indemnifies customer against:
- Third-party IP infringement claims related to the service (standard; this is your obligation)

Customer indemnifies vendor against:
- Third-party claims arising from customer data (including GDPR violations in customer data)
- Customer's use of the service in violation of the MSA

### Section 8: Term and termination

- Initial term (1 year typical; 3-year enterprise deals)
- Auto-renewal unless notice given
- Termination for cause (material breach, uncured after 30 days)
- Termination for convenience (rarely given by vendor; customer sometimes demands it)
- Effect of termination: data deletion timeline, export window, outstanding invoices accelerate

### Section 9: General provisions

- Governing law (vendor's choice: Delaware for US; England and Wales for global enterprise)
- Dispute resolution (arbitration clause, class action waiver, or litigation)
- Entire agreement (MSA + Order Form supersede all prior discussions)
- Force majeure
- Assignment (vendor can assign to acquirer; customer cannot assign without consent)
- Notice requirements (in-product notice, email, or certified mail)

---

## Enterprise pressure points (where deals stall)

| Clause | Customer demand | Vendor counter |
|---|---|---|
| Liability cap | Increase to 2-3x annual fees | Offer 12-month fees + higher cap for data breach only |
| IP ownership of customizations | Customer owns custom features | Vendor owns all code; licenses custom features back |
| Audit rights | Annual on-site audit | Third-party audit report (SOC 2) in lieu of direct audit |
| No training on customer data | Absolute prohibition on AI training | Include the explicit "no AI training" clause |
| SLA credit carve-out from liability cap | SLA credits don't count toward cap | SLA credits are the exclusive remedy for uptime failures |
| Source code escrow | If vendor fails, customer gets source code | Escrow agent (Iron Mountain) holds code; release conditions defined |

---

## The attorney-review invariant

> "This is a generated draft for reference. Have a qualified attorney review before countersigning any MSA."
