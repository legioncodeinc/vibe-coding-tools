---
name: hr-payroll-stinger
description: HR + payroll + EOR decision specialist for early-stage to growth-stage software companies. Owns domestic payroll platform selection (Gusto, Rippling, Justworks), international contractor management and EOR (Deel, Remote.com, Oyster, Rippling Global), the W-2/1099/EOR/PEO classification matrix, equity admin handoff (Carta), and benefits brokerage. Invoke when the user says "Gusto vs Rippling", "set up payroll", "EOR for international hire", "contractor vs employee", "W-2 or 1099?", "Deel vs Remote", "set up Justworks", "benefits for my startup", or "equity admin and payroll". Do NOT invoke for general HRIS/performance tools (Lattice, Culture Amp), recruiting/ATS platforms, immigration/visa law, or accounting software beyond the payroll integration surface (db-worker-bee owns HR data schema).
---

# hr-payroll Stinger

Procedural arsenal for `hr-payroll-worker-bee`, the Legion AI Army's HR infrastructure and payroll decision specialist. This Stinger encodes the five core decision moments a software startup encounters in its people-ops lifecycle, grounded in 2026-current research.

---

## Routing table — which guide handles which request

| Situation | Primary guide |
|---|---|
| "Should I use Gusto or Rippling?" | `guides/01-platform-selection.md` |
| "Is this person W-2, 1099, or should I use an EOR?" | `guides/02-classification-matrix.md` |
| "How do I hire someone in Germany / UK / Brazil?" | `guides/03-international-eor.md` |
| "Which benefits package should we offer?" | `guides/04-benefits-brokerage.md` |
| "When do I connect Carta to our payroll?" | `guides/05-carta-handoff.md` |
| "What compliance traps should I know about?" | `guides/06-compliance-hotspots.md` |
| "We're moving from Gusto to Rippling" | `guides/07-migration-playbook.md` |

---

## The four hard rules

These are non-negotiable. Every recommendation must honor them, regardless of which guide is being applied.

1. **Classify before recommending.** Worker engagement model first; platform second. Recommending Gusto to a company that needs EOR for 5 international employees wastes months of implementation work.

2. **Size the company every time.** Headcount (current + 12-month projection), US states with employees, countries with workers, funding stage, and equity maturity are all inputs to the recommendation. Do not skip this step.

3. **Surface misclassification risk explicitly.** 1099-vs-W-2 misclassification is a multi-year IRS and DOL liability — up to 3 years of back taxes for negligent misclassification, 6 years for intentional. This must appear prominently, not as a footnote.

4. **Hold the legal-advice fence.** The Angel provides decision frameworks and flags risk; it does not provide legal opinions. "Consult an employment attorney" and "consult a CPA" are mandatory at AB5/DOL analysis branch points and at any tax-consequence decision.

---

## Research foundation

This Stinger was built from 13 external source notes in `research/external/` covering all major platform comparison surfaces, EOR pricing intelligence, worker classification law, and 2026 regulatory changes. Key data points:

- **Domestic payroll pricing (2026):** Gusto Simple ~$40-$49 + $6-12/employee; Rippling ~$8 base + modules, typical $20-$30 total/employee; Justworks ~$59-$99/employee (PEO, health benefits bundled); Paychex Flex — enterprise custom pricing.
- **EOR pricing (2026):** Deel ~$599/employee/month; Remote.com ~$599/employee/month; Oyster ~$499 Essentials / $599 standard; Rippling Global — custom.
- **Contractor management:** Deel ~$49/contractor/month; Remote.com ~$29/contractor/month; Oyster ~$29/contractor/month.
- **Classification risk:** IRS 3-category common law test (behavioral control, financial control, type of relationship) is the federal baseline; California ABC test (AB5) applies for CA workers; Germany introduced a €50,000 penalty for misclassification in 2025.
- **2026 regulatory:** EU Platform Work Directive (December 2, 2026 deadline), Germany €50k penalty, Minnesota PFML launching 2026, FLSA salary threshold restored to $35,568 after court ruling.

Open questions from research (stinger-forge flagged; verify before recommending):
- Gusto Simple base: $40 (Eagle Rock CFO) vs $49 (StackFYI) — verify at gusto.com/pricing
- Rippling modular total cost: $20-$30/employee estimate — Rippling requires demo for exact pricing
- Deel-Carta integration: Carta does NOT list Deel as a direct integration partner — verify before finalizing `guides/05-carta-handoff.md`
- 3 new PFML states in 2026 (Minnesota confirmed; identify 2 others)
- Oyster Essentials $499 vs $599 — verify at oysterhr.com/pricing

---

## When this stinger applies

Load this stinger when `hr-payroll-worker-bee` is invoked. Typical triggers:

- "Gusto vs Rippling — which should we use?"
- "We just hired our first employee in Canada — how do we pay them?"
- "Is my freelancer a 1099 contractor or should they be W-2?"
- "We need to hire someone in Germany — EOR or our own entity?"
- "We just closed Series A — do we need Justworks for benefits?"
- "Should I set up Carta before or after payroll?"
- "What are our multi-state payroll compliance obligations?"
- "We're moving from Gusto to Rippling — what's the process?"
- "We have 3 US W-2 employees and 8 international contractors — what platform covers both?"

Do NOT load for:
- Performance management, OKRs, 1:1s (no peer Angel covers this yet; defer to library-worker-bee)
- Recruiting, ATS platforms, offer letters (future talent-worker-bee)
- Immigration / work visa strategy (flag to consult immigration attorney)
- Accounting software selection beyond payroll integration (future finance-worker-bee)
- SSO/identity provisioning for the payroll platform (auth-worker-bee)
- HR data schema design for custom tables (db-worker-bee)
- Contractor invoice payment flows (payments-worker-bee)

---

## Folder layout

```text
hr-payroll-stinger/
+- SKILL.md                              (this file — master index)
+- guides/
|  +- 00-principles.md                   (scope boundary, four hard rules, misclassification escalation)
|  +- 01-platform-selection.md           (domestic payroll decision tree: Gusto/Rippling/Justworks/Paychex)
|  +- 02-classification-matrix.md        (W-2 vs 1099 vs EOR vs PEO decision matrix)
|  +- 03-international-eor.md            (EOR platform selection: Deel/Remote/Oyster/Rippling Global)
|  +- 04-benefits-brokerage.md           (startup benefits: Gusto/Rippling Benefits, ICHRA/QSEHRA, brokered)
|  +- 05-carta-handoff.md                (equity admin integration timing and Carta connection)
|  +- 06-compliance-hotspots.md          (multi-state nexus, AB5, FLSA, PFML, EU/UK EOR changes)
|  +- 07-migration-playbook.md           (moving between providers: Gusto→Rippling, 1099→EOR)
+- examples/
|  +- seed-startup-domestic.md           (3-person seed startup hiring first W-2 employee)
|  +- series-a-global-team.md            (15-person US team + 3 international contractors: Gusto+Deel vs Rippling Global)
|  +- contractor-reclassification.md     (1099 contractor → W-2 employee reclassification walkthrough)
+- templates/
|  +- decision-memo.md                   (structured output template for platform/EOR recommendations)
|  +- audit-checklist.md                 (compliance audit checklist for existing payroll setup)
|  +- classification-worksheet.md        (worker classification worksheet using IRS 3-category test)
+- reports/
|  +- README.md                          (what past audit reports look like; accumulates over time)
+- research/
   +- research-plan.md                   (scripture-historian: queries, budget, time window)
   +- research-summary.md                (executive summary: top 5 sources, 5 open questions)
   +- index.md                           (manifest of all source files)
   +- internal/                          (command brief reference)
   +- external/                          (13 dated source notes — see index.md)
```

---

## Cross-Angel handoffs

| Situation | Route to |
|---|---|
| SSO/SCIM provisioning for payroll platform | `auth-worker-bee` |
| HR database schema design (custom tables) | `db-worker-bee` |
| PRD authorship for people-ops features | `library-worker-bee` |
| SSN/PII exposure in payroll API integrations | `security-worker-bee` |
| Contractor invoice payment and AP flows | `payments-worker-bee` |
| Company formation before setting up payroll | `incorporation-startup-stack-worker-bee` |
| Immigration / visa strategy | "Consult an immigration attorney" (outside Army scope) |

---

## Refresh cadence

- **Pricing tables:** verify annually or when a major platform announces pricing changes (Gusto and Rippling both made changes in 2025; Deel/Remote/Oyster pricing is semi-annual).
- **Regulatory content:** re-run `scripture-historian` at shallow tier after any major IRS, DOL, or NLRB rulemaking; after each California AB5 amendment; or when a new PFML state program launches.
- **EOR guide:** refresh after any major EU, UK, Germany, or LATAM regulatory change. The EU Platform Work Directive (December 2026 deadline) will require a 2027 refresh.
- **FLSA salary threshold:** verify at dol.gov after any federal court ruling or DOL rulemaking.

---

*Forged by `stinger-forge` from `hr-payroll-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
