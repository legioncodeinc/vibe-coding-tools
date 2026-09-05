# Worker Classification Matrix

The W-2 vs 1099 vs EOR vs PEO decision is the most important classification a startup makes in its people-ops lifecycle. Getting it wrong creates multi-year IRS and DOL liability. Use this guide to determine the correct engagement model before recommending any platform.

---

## Step 1: Apply the IRS 3-category common law test

The IRS uses three categories of evidence to determine whether a worker is an employee or independent contractor. This test applies for federal tax purposes in all 50 states.

### Category 1: Behavioral control
Does the company control how the worker performs their work?

| Factor | Points toward employee (W-2) | Points toward contractor (1099) |
|---|---|---|
| Work instructions | Company tells worker how to do the work | Worker determines own methods |
| Training | Company requires specific training | Worker uses own methods/tools |
| Schedule | Company sets the schedule | Worker sets own hours |
| Work location | Company requires work at a specific location | Worker chooses where to work |

### Category 2: Financial control
Does the company control the economic aspects of the worker's job?

| Factor | Points toward employee (W-2) | Points toward contractor (1099) |
|---|---|---|
| Investment | Company provides all tools/equipment | Worker has significant own investment |
| Services available | Worker works exclusively for company | Worker offers services to multiple clients |
| Profit/loss | Worker cannot profit or lose | Worker can profit or realize a loss |
| Payment | Worker paid regular wages (hourly/salary) | Worker paid a flat fee per project |

### Category 3: Type of relationship
How do the parties perceive their relationship?

| Factor | Points toward employee (W-2) | Points toward contractor (1099) |
|---|---|---|
| Written contracts | Employment contract; benefits, vacation, pension | Independent contractor agreement |
| Employee benefits | Company provides health insurance, 401k, vacation | No employee benefits |
| Permanency | Indefinite relationship | Specific project/time period |
| Business integral | Worker's services are key to regular business | Worker provides ancillary service |

**Scoring:** If the majority of factors across all three categories point toward employee, the worker should be W-2. No single factor is determinative — the IRS weighs the totality.

---

## Step 2: Check state law (priority for California workers)

### California AB5 (ABC test)
California workers are presumed to be employees under AB5 unless the hiring company can prove ALL THREE of these conditions (the ABC test):

- **A.** The worker is free from the company's control and direction in performing the work
- **B.** The work is performed outside the usual course of the company's business
- **C.** The worker is customarily engaged in an independently established trade, occupation, or business

**Critical:** The "B" prong is extremely difficult to meet. If the worker performs work within the company's core business (e.g., a software engineer working for a software company), they almost certainly fail the ABC test and must be W-2 in California. See `guides/06-compliance-hotspots.md` for the full AB5 analysis.

---

## Step 3: Classify the engagement model

```
Q1: Is the worker in the United States?
├── YES → continue to Q2
└── NO → go to Q4 (international classification)

Q2: Do the worker's activities primarily point toward employee under the IRS 3-category test?
├── YES (clearly employee) → W-2 employee; use domestic payroll platform (guides/01)
├── BORDERLINE → surface misclassification risk per guides/00-principles.md Rule 3; recommend W-2 + counsel
└── NO (clearly independent contractor) → 1099; continue to Q3

Q3: Is the contractor primarily performing work integral to your core business?
├── YES + California location → HIGH misclassification risk under AB5; recommend reclassification to W-2 or counsel
├── YES + non-California → medium risk; recommend legal review before continuing
└── NO → proceed as 1099 contractor; collect W-9, issue 1099-NEC at year end

Q4: Does the company have a legal entity in the worker's country?
├── YES (own entity) → employ locally; likely local payroll (Rippling Global can administer)
├── NO → continue to Q5

Q5: How many workers in this country?
├── 1-4 workers → EOR strongly preferred (entity setup costs $10-50k+; EOR is faster and cheaper)
├── 5+ workers → entity formation analysis warranted; EOR still preferred for speed (guides/03)
└── Unsure timeline → default to EOR; reassess at 5 workers

Q6: Is the company in the US and wants to outsource HR administration and benefits?
├── YES → PEO (Justworks, TriNet) — co-employment structure, bundled benefits
└── NO → standard payroll platform (Gusto, Rippling)
```

---

## Classification decision matrix

| Scenario | Recommended model | Primary risk |
|---|---|---|
| US hire, ongoing, integral to business | W-2 employee | IRS/DOL misclassification if using 1099 |
| US hire, short project, non-core | 1099 contractor | AB5 risk if CA; annual 1099-NEC required |
| US hire, ambiguous control factors | W-2 recommended | Misclassification exposure; seek counsel |
| International hire, no local entity | EOR | Permanent establishment (PE) risk if not using EOR |
| International hire, 5+ in one country | Entity formation analysis | EOR cost vs entity cost; EOR wins short-term |
| International hire, want to test a market | EOR | Fastest, least commitment |
| Company wants bundled US benefits, co-employment acceptable | PEO (Justworks) | Mid-year PEO exit resets tax wage bases |
| Company wants full employer control | W-2 + standard payroll | Full compliance responsibility |

---

## Worker classification worksheet

See `templates/classification-worksheet.md` for the interactive version.

Key fields:
- Worker name/role
- Work location(s)
- Weekly hours
- Duration of engagement
- Who controls work schedule / methods / location?
- Does the worker have other clients?
- Does the worker supply their own tools/equipment?
- Is the work integral to the company's core business?
- Is there a written agreement? What does it say?

---

## Reclassification from 1099 to W-2

If the analysis reveals an existing 1099 relationship that should be W-2:

1. **Assess exposure:** Calculate potential back taxes using IRS Section 3509 rates (1.5% of wages for inadvertent misclassification, 3% if no W-2 was filed).

2. **Consult counsel:** Before reclassifying, consult an employment attorney. The Section 530 safe harbor may provide relief if the company had a reasonable basis for contractor classification.

3. **Reclassify prospectively:** Set a transition date (beginning of next quarter is cleanest). Issue final 1099-NEC for the contractor-period payments. Begin W-2 payroll on the transition date.

4. **Update the engagement:** Issue a new employment agreement. Collect W-4. Set up in the payroll platform. Begin withholding FICA.

5. **Consider benefits:** Reclassified employees may be eligible for benefits. Review plan documents for any lookback provisions.

See `examples/contractor-reclassification.md` for a worked walkthrough.
