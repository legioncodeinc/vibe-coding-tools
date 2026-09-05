# Example: Contractor Reclassification

This example walks through the process of discovering a misclassified 1099 contractor and converting them to a W-2 employee.

---

## Scenario

- **Company:** 10-person Series A SaaS startup in California
- **Situation:** "Alex" has been working as a 1099 contractor for 26 months. Alex works exclusively for the company, receives task assignments daily from the CTO, works set hours (9-6 PT), and uses company-provided equipment. Alex has no other clients and invoices the company bi-weekly.
- **Question:** Is this arrangement correct?

---

## Step 1: Apply the classification matrix

Using `guides/02-classification-matrix.md` and the IRS 3-category test:

| Factor | Finding | Points toward |
|---|---|---|
| Behavioral: Work instructions | CTO assigns daily tasks | Employee |
| Behavioral: Schedule | Fixed 9-6 PT hours | Employee |
| Behavioral: Equipment | Company-provided laptop and SaaS tools | Employee |
| Financial: Exclusivity | No other clients | Employee |
| Financial: Investment | No significant personal investment in tools | Employee |
| Financial: Fixed payment | Bi-weekly invoice (functionally a salary) | Employee |
| Relationship: Duration | 26 months, ongoing | Employee |
| Relationship: Integration | Core product development work | Employee |

**Finding:** All factors point toward W-2 employee. This is a textbook misclassification.

**California AB5 additional finding:** Under the ABC test, Alex is a California worker performing work integral to the company's core business (software development for a software company). AB5 Prong B fails — Alex must be W-2 in California.

---

## Step 2: Quantify the exposure

Using IRS Section 3509 rates for inadvertent misclassification:

- Total payments to Alex: $130,000/year × 2.17 years = $282,100
- IRS Section 3509 rate for employee tax withholding (no W-2 filed): 20% of employee FICA + 20% of income tax withholding = approximately 3% of wages
- Federal exposure estimate: $282,100 × 3% = ~$8,463 in back payroll taxes
- California SDI and SUI additional exposure: estimated $2,000-4,000
- Penalty interest on unpaid taxes: ~8% annually

**Total exposure estimate: $10,000-$15,000** (ballpark; requires CPA for exact calculation)

This is a manageable but real exposure that warrants consultation with an employment attorney.

---

## Step 3: Consult counsel

Before taking any action, the startup should consult an employment attorney for two reasons:
1. **Section 530 safe harbor analysis:** If the startup had a reasonable basis for contractor classification (e.g., relied on the written contractor agreement and prior industry practice), Section 530 of the Revenue Act of 1978 may protect against back taxes.
2. **California-specific advice:** California's LWDA (Labor and Workforce Development Agency) and the EDD have separate enforcement authority; an attorney can assess whether voluntary disclosure or quiet reclassification is the better path.

---

## Step 4: Reclassification

**Assuming counsel advises reclassification (not Section 530):**

1. **Set the transition date:** First of next month (cleanest for payroll)
2. **Issue a formal employment offer letter** to Alex, with salary, benefits eligibility, equity (if relevant), and start date
3. **Complete standard onboarding:**
   - Collect W-4 (federal withholding)
   - Collect DE 4 (California withholding)
   - Complete I-9 (even though Alex has been working for 26 months — a new W-2 employment relationship requires a new I-9)
   - Set up direct deposit
4. **Issue final 1099-NEC** for the contractor period of the current tax year
5. **Add Alex to Gusto/Rippling** as a W-2 employee starting on the transition date
6. **Enroll Alex in benefits** (employment start = qualifying life event for immediate health insurance enrollment)
7. **File state new-hire report** within 20 days

---

## Step 5: Post-reclassification documentation

- Document the reclassification decision and the legal analysis
- Retain the employment attorney's memo
- Update the contractor agreement archive to flag this file as reclassified
- If the startup has other contractors in similar arrangements, apply the same classification test now — do not wait for a second incident
