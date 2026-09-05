# Platform Selection — Domestic Payroll

Use this guide when the user's company has or is planning to have W-2 employees in the United States. Output: a concrete platform recommendation with rationale, downsides, and migration path.

---

## Decision tree (start here)

```
Q1: Does the company have or expect any non-US employees in the next 12 months?
├── YES → see guides/03-international-eor.md (evaluate Rippling Global or Gusto+Deel combo)
└── NO → continue below

Q2: What is the current/projected headcount?
├── 1-15 employees, simple US payroll → GUSTO (default recommendation)
├── 15-100 employees, growth-stage, tech-forward → RIPPLING
├── Any size, benefits-first PEO preferred → JUSTWORKS
└── 100+ employees, complex enterprise needs → PAYCHEX FLEX or ADP

Q3: Is benefits administration a primary driver?
├── YES, want bundled health/dental/vision → JUSTWORKS or RIPPLING
└── NO, benefits is secondary → GUSTO or RIPPLING based on headcount

Q4: Does the company use Rippling for IT/MDM?
├── YES → RIPPLING (unified platform advantage is significant)
└── NO → evaluate on price and simplicity alone
```

---

## Platform comparison matrix (2026)

> **Note:** Verify current pricing at gusto.com/pricing and rippling.com/pricing before quoting. Rippling pricing requires a demo/quote for exact modular costs.

| Platform | Base cost | Per-employee cost | Sweet spot | Key strength | Key weakness |
|---|---|---|---|---|---|
| **Gusto Simple** | ~$40-49/mo | ~$6/employee/mo | 1-50 employees, US-only | Simplicity, clean UX, great contractor + W-2 combo | Headcount ceiling (~50 before Rippling is cheaper on TCO), no native IT/MDM |
| **Gusto Plus** | ~$80/mo | ~$12/employee/mo | 5-50 with more HR features | Adds time tracking, workforce costing | Same headcount ceiling |
| **Gusto Concierge** | ~$149/mo | ~$12/employee/mo | 20-50 with HR support needs | Certified HR professionals on call | Expensive at small headcount |
| **Rippling** | ~$8/employee/mo base | ~$20-30 total after modules | 20+ employees, rapid growth, tech-forward | Unified IT+HR+payroll, global reach, strong API | Per-module pricing opacity, requires demo for exact cost, higher admin overhead |
| **Justworks** | ~$59/employee/mo | Included | Benefits-first companies, PEO structure | PCI-compliant group rates for health benefits, no HR overhead | More expensive at low headcount, PEO means co-employment structure |
| **Justworks Plus** | ~$99/employee/mo | Included | ACA-compliant benefits required | Full ACA employer status, medical/dental/vision | Same PEO caveat |
| **Paychex Flex** | Custom | Custom | 100+ employees, compliance-heavy | Enterprise compliance depth, accountant-friendly | Outdated UX, expensive, over-engineered for seed/Series A |

---

## Gusto — recommended for most early-stage companies

**Use Gusto when:**
- US-only payroll, 1-50 employees
- Budget is a real constraint (bootstrapped or small seed)
- The team wants to self-administer without a dedicated HR person
- The company already uses Gusto for contractors (Gusto handles 1099 and W-2 from one dashboard)
- Carta integration is needed (Gusto has a native Carta sync)

**Avoid Gusto when:**
- Headcount will exceed 50-75 in 12 months (Rippling's TCO becomes competitive and its platform is more scalable)
- The company needs Rippling's IT/MDM integration (offboarding + device management)
- The company has non-US employees requiring global payroll

**Gusto plan selection:**
- **Simple** — payroll + basic HR, best for companies not yet offering health benefits
- **Plus** — adds time tracking, workforce costing, and better onboarding tools; worth it at 10+ employees
- **Concierge** — only if the company needs HR advisory support and cannot hire an HR manager yet

---

## Rippling — recommended for growth-stage companies

**Use Rippling when:**
- Headcount 15+ and growing fast (Rippling's per-module pricing becomes competitive at scale)
- The company wants to unify HR, IT, and payroll into one system (Rippling's key differentiator)
- The company has or will have non-US employees (Rippling Global covers 160+ countries)
- The company uses many SaaS tools and wants automated provisioning/deprovisioning
- The company needs strong HRIS reporting and org-chart tooling

**Avoid Rippling when:**
- Headcount under 15 (Gusto is simpler and cheaper)
- The company cannot commit time to a Rippling implementation project (Rippling setup is more complex than Gusto)
- Budget is tightly constrained and Rippling's per-module pricing opacity is unacceptable

**Rippling pricing reality check:**
Rippling does not publish a fixed per-employee price. The $8/employee base covers Unity (the platform core) only. Every module — Payroll, Benefits, PTO, Headcount Planning — adds cost. Typical all-in cost for a startup using Payroll + HR + Time + Benefits is $20-30/employee/month. Require a Rippling demo with a line-item quote before recommending to a cost-sensitive company.

---

## Justworks — recommended for PEO/benefits-first companies

**Use Justworks when:**
- The company's primary goal is offering competitive health benefits without a full HR team
- Founders want to outsource compliance (Justworks is the co-employer of record and handles tax filings)
- The company is at a stage where group health rates via a PEO are meaningfully cheaper than individual market rates (typically meaningful at 10+ employees)

**PEO co-employment caveat:** Under a PEO arrangement, Justworks is technically a co-employer. This means Justworks's workers' comp coverage, benefits contracts, and tax EIN apply. This simplifies compliance but creates dependency on Justworks staying in business and imposes exit friction (especially mid-year due to reset tax wage bases).

**Avoid Justworks when:**
- The company wants full employer control of all employment decisions without co-employment structure
- The company plans to grow internationally (Justworks does not cover EOR)
- The company wants Carta integration (Justworks has a Carta sync, but the PEO structure creates complexity in cap table attribution)

---

## Common mistakes to flag

1. **Choosing Gusto when EOR is needed.** Gusto does not provide EOR. A company that hires a "contractor" in Germany via Gusto is not compliant — the German worker must be on a German payroll or through an EOR. See `guides/03-international-eor.md`.

2. **Staying on Gusto past 75 employees.** At 75+ employees, Rippling's unified platform usually wins on TCO and capability. Flag the migration early — Q3 of the year before the company expects to cross this threshold.

3. **Using Justworks for a global team.** Justworks is US-only. Companies with international growth ambitions need a parallel EOR solution (Deel, Remote.com) alongside Justworks, or should migrate to Rippling Global.

4. **Underestimating Rippling's implementation timeline.** Gusto can be live in a day. Rippling typically takes 2-8 weeks of implementation depending on the modules activated.
