# Example: Seed Startup — Hiring First W-2 Employee

This example walks through the simplest case: a 2-person founding team (both founders with equity, no payroll yet) bringing on their first W-2 engineer.

---

## Company profile

- **Company:** 2 co-founders, both on equity only (no salary; seed funded at $1.5M)
- **First hire:** Senior engineer, US-based, California, $165,000/year salary
- **Current payroll setup:** None
- **Benefits:** None yet
- **Question:** What do we need to set up, and in what order?

---

## Step 1: Pre-payroll checklist (before first payroll run)

- [ ] Confirm the company is a Delaware C-Corp (required for most payroll platforms and for equity grants)
- [ ] Obtain EIN (federal employer identification number) from irs.gov — free, takes 5-10 minutes
- [ ] Register for California EDD (Employment Development Department) for payroll tax account — required before first California payroll
- [ ] Register for California workers' compensation insurance (required for any California employee)
- [ ] Open a separate payroll/operating bank account (mix of operating and payroll funds is poor hygiene)

---

## Step 2: Platform selection

For a 1-employee seed startup with a California hire:

**Recommendation: Gusto Simple**
- Cost: ~$40/month + $6/month per employee = ~$46/month
- Gusto handles California EDD payroll tax registration as part of setup
- Gusto handles California SDI withholding automatically
- Simple plan covers full payroll + basic onboarding + contractor 1099 if needed later

Alternatives: Rippling (overkill at 1 employee), Justworks (benefits-forward but expensive at 1 employee)

---

## Step 3: What Gusto handles automatically for California

- Federal income tax withholding (based on W-4)
- California income tax withholding (based on DE 4)
- California SDI (State Disability Insurance) deduction (~0.9% of wages)
- FICA employee and employer portions (6.2% Social Security + 1.45% Medicare each side)
- California SUI (State Unemployment Insurance) employer contribution
- California ETT (Employment Training Tax) employer contribution
- Quarterly 941 (federal) and DE 9 (California) tax filings
- Year-end W-2 filing

---

## Step 4: Benefits setup at 1 employee

With 1 employee, ACA does NOT require you to offer health coverage. Options:

**Option A: No benefits yet (bootstrapped approach)**
- Common at seed stage for cost management
- Offer a compensation premium instead (~$500-600/month) to help the employee buy their own health plan
- Set up ICHRA via PeopleKeep or Thatch if you want to reimburse tax-free

**Option B: Gusto Benefits — offer health insurance from day 1**
- Gusto offers group health plans even for 1-person groups in most states
- Employer pays 50-100% of employee premium (50% is ACA minimum if you choose to cover employees and want plans to be affordable; 75-90% is startup competitive standard)
- At 1 employee, group premiums will be higher than individual market plans
- Rule of thumb: if the engineer is healthy and single, ICHRA is often cheaper; if the engineer has a family, group plan may be better

**Recommendation for this scenario:** Start with ICHRA ($500/month employer allowance) for the first 6-12 months. Switch to group plan via Gusto Benefits at 5+ employees.

---

## Step 5: Equity and Carta

- Set up Carta cap table before the first option grant (not strictly required at hire, but best practice)
- Grant options to the new hire (NSOs are simplest; ISOs require 409A)
- Connect Gusto to Carta so future exercise events trigger payroll withholding correctly
- See `guides/05-carta-handoff.md`

---

## Timeline

| Day | Action |
|---|---|
| Day 0 (hire decision) | Get EIN, register CA EDD, register CA workers' comp |
| Day 1-3 | Set up Gusto account, enter employer profile, configure payroll settings |
| Day 3-5 | Add new employee in Gusto; send Gusto onboarding link to employee (W-4, DE 4, direct deposit) |
| Day 5-7 | Employee completes Gusto onboarding |
| Day 7-10 | Run first payroll test in Gusto; verify employee sees correct take-home |
| Day 10 (first payroll) | Run payroll; confirm ACH deposit |
| Day 14 | Set up ICHRA via PeopleKeep if offering benefits |
| Day 30 | Set up Carta if equity grants are planned |
