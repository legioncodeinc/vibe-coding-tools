# Compliance Hotspots — Payroll and HR

Use this guide to surface the compliance obligations a company triggers as it grows. Output: a compliance checklist with triggered obligations and action items.

---

## Multi-state nexus rules

When a company has employees in a state, it typically has:
- **Payroll tax nexus:** Must register with the state for income tax withholding and unemployment insurance
- **Workers' comp nexus:** Must carry workers' compensation coverage in the state (varies by state)
- **Physical nexus:** May trigger state corporate income or franchise tax obligations (flagged to consult a CPA)

### Registration sequence for a new state employee

1. Register with the state's department of revenue for income tax withholding (typically online, 1-3 business days)
2. Register with the state's department of labor/workforce for unemployment insurance (SUTA)
3. Obtain workers' compensation coverage (via carrier or PEO)
4. Add the employee to payroll with the new state tax setup
5. File state new-hire report (required in all 50 states, typically within 20 days of hire)

Gusto and Rippling will prompt for state registrations during employee onboarding but will not complete registrations on your behalf without additional setup. Justworks handles all state registrations as part of the PEO co-employer relationship.

---

## California AB5 (workers' compensation)

California's AB5 (2020) creates a presumption that workers are employees (not independent contractors) unless the company can prove ALL of:

**A:** The worker is free from the company's control and direction in performing the work
**B:** The work is outside the usual course of the company's business  
**C:** The worker is customarily engaged in an independently established trade

**Prong B is the hardest to meet for tech companies.** If a software company engages a software engineer as a 1099 contractor, the engineer is performing work within the usual course of the company's business — failing Prong B. The engineer should be W-2 unless they have their own incorporated business and multiple clients.

### AB5 penalties
- Labor Commissioner can order reclassification and back wages
- Private right of action for workers
- California EDD (Employment Development Department) can assess back unemployment taxes
- California DLSE can assess penalties per violation

### AB5 exemptions (partial list as of 2026)
Some professions were granted exemptions via AB 2257 and subsequent amendments:
- Graphic designers
- Marketing professionals
- Human resources administrators
- Travel agents
- Certain licensed professionals (lawyers, accountants, architects)
- Workers providing services to another business (B2B exemption if business has its own clients, licenses, etc.)

The B2B exemption is the most commonly applicable for software companies engaging incorporated contractors. The contractor must: have a business entity (LLC or corp), have a business license, maintain their own tools, set their own hours, and have multiple clients.

**If in doubt: W-2.** The cost of Gusto/Rippling is far cheaper than an AB5 dispute.

---

## FLSA — Federal salary threshold (2026)

The Fair Labor Standards Act (FLSA) exempts employees from overtime requirements if they are paid above the salary threshold AND meet certain duties tests. The 2026 threshold:

- **Standard exemption (executive, administrative, professional):** $684/week ($35,568/year) — this is the level restored by the court ruling in 2025 that struck down the Biden DOL's $43,888 threshold
- **Highly compensated employee (HCE) exemption:** $107,432/year

> **Verify at dol.gov before finalizing any advice.** FLSA salary thresholds have been subject to litigation and the DOL may issue a new rule.

### Common FLSA misclassification in startups
- **Salaried employees who are improperly classified as exempt:** Software engineers with supervisory duties but below the salary threshold; must receive overtime
- **Engineers classified as "computer professionals":** FLSA has a special computer professional exemption at $27.63/hour or $684/week salary — this applies to systems analysts, programmers, and similar roles but NOT to IT support or data entry

---

## Paid Family and Medical Leave (PFML) — state mandates

As of 2026, these states have mandatory PFML payroll deductions:

| State | Program | Employer contribution | Employee contribution |
|---|---|---|---|
| California | SDI/PFL | 0% | ~0.9% of wages up to $1.6M |
| New York | NY PFL | 0% | ~0.373% of wages |
| New Jersey | NJ FLI | 0% | Employee-only, rates vary |
| Washington | WA PFML | Shared | ~0.8% total (varies by employer size) |
| Massachusetts | MA PFML | Shared (1+ employees) | ~0.88% total |
| Colorado | CO FAMLI | 0.45% employer | 0.45% employee |
| Oregon | OR Paid Leave | 40% employer | 60% employee (if 10+ employees) |
| Connecticut | CT PFML | 0% | 0.5% of wages |
| Minnesota | MN PFML | Launching 2026 | ~0.7% (verify at mn.gov) |

> **Three additional states are launching PFML in 2026** (from research). Verify exact states and rates at each state's labor department website before advising.

Gusto and Rippling handle PFML withholding automatically for supported states once the employee's work address is set correctly. Justworks handles PFML as part of the PEO co-employer relationship.

---

## I-9 and E-Verify

- **I-9:** Required for all US employees within 3 business days of start date. Employer must physically examine identity and work authorization documents (or use an authorized remote I-9 service for remote hires).
- **E-Verify:** Mandatory for federal contractors and contractors in states that require it (Alabama, Arizona, Georgia, Mississippi, North Carolina, South Carolina, Tennessee, Utah). Optional (but recommended) for all other employers.
- **Gusto / Rippling:** Both have built-in I-9 workflows; remote I-9 inspection can be done via designated authorized representatives.

---

## 2026 international regulatory changes

### EU Platform Work Directive (December 2, 2026)
- Reverses burden of proof: companies must prove a worker is NOT an employee if the worker asserts employment status
- Applies when 5 of 7 control criteria are met (set algorithm, supervise performance, restrict communication, prevent side work, set pay/prices)
- Applies to platform and gig work but has spillover effects on any EU-based contractor arrangement
- **Action if you have EU contractors:** Review all EU contractor arrangements before December 2026

### Germany — misclassification penalties
- Germany introduced a €50,000 penalty per misclassified worker in 2025
- German labor courts already have a presumption-of-employment standard; the new penalty adds criminal exposure
- **Action:** Any German contractors who perform ongoing, integrated work should be converted to EOR or local entity employment

### UK IR35
- IR35 (off-payroll working rules) require the UK end-client to assess whether a contractor working through a personal service company (PSC) is "inside IR35" (functionally an employee)
- If inside IR35: UK end-client must deduct income tax and NICs as if the worker were an employee
- Most UK tech contractors operating through limited companies expect an IR35 assessment; provide a Status Determination Statement (SDS)
