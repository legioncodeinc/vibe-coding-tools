# International EOR — Hiring Outside the US

Use this guide when the company has or is planning to hire employees in countries where it does not have a legal entity. Output: EOR platform recommendation + onboarding timeline.

---

## What is an EOR?

An Employer of Record (EOR) is a third-party company that becomes the legal employer of your worker in a foreign country. The EOR:
- Establishes a local legal entity in the worker's country
- Manages local employment contracts, payroll tax filings, social contributions, and termination compliance
- Passes the worker's compensation through to you as a service fee

You retain day-to-day control of the worker's work (tasks, performance, priorities). The EOR handles everything the local labor law requires of a legal employer.

**EOR vs PEO:** EOR is for international workers where you have no local entity. PEO (Justworks, TriNet) is a US co-employment structure for bundled benefits. They are different products for different problems.

---

## When to use EOR vs. form your own entity

| Situation | Recommendation | Rationale |
|---|---|---|
| 1-4 workers in a country | EOR strongly preferred | Entity formation costs $10-50k+; EOR at $600/employee/month pays back at ~18 months |
| 5+ workers in one country (long-term) | Entity formation analysis | At 5+ workers, entity cost is often lower than EOR cost over 3 years |
| Testing a new market | EOR | Fast (3-10 days vs. 30-90 days for entity); easy to exit if the market test fails |
| Worker wants equity (options/RSAs) | EOR with equity workaround OR entity | EOR complicates equity grants; see guides/05-carta-handoff.md |
| Worker in a country with EOR restrictions | Entity required | Some countries (Germany, Israel, China) have rules that limit or prohibit EOR arrangements |

---

## EOR platform comparison (2026)

> **Pricing note:** Verify current pricing at each platform before quoting. EOR pricing shifts semi-annually.

| Platform | EOR price | Contractor price | Country coverage | Key strength | Key weakness |
|---|---|---|---|---|---|
| **Deel** | ~$599/employee/mo | ~$49/contractor/mo | 150+ countries | Largest network, fastest onboarding, contractor-to-EOR conversion | Uses partner entities in many countries (not always own entity), pricing can add up at scale |
| **Remote.com** | ~$599/employee/mo | ~$29/contractor/mo | 180+ countries | Owns all its entities (no third-party EOR partners), strong compliance team | Slower in some markets, fewer integrations than Deel |
| **Oyster HR** | ~$499-599/employee/mo | ~$29/contractor/mo | 180+ countries | Competitive pricing, good UX, carbon-neutral hiring | Smaller compliance team than Deel/Remote, fewer country-specific nuances |
| **Rippling Global** | Custom (demo required) | Included in Rippling | 160+ countries | Best if already on Rippling (unified platform), IT+HR sync | Requires full Rippling commitment; cannot use Rippling Global without Rippling HR/Payroll |
| **Justworks International** | Partnership with Remote.com | N/A | Via Remote partnership | Easy if already on Justworks PEO | Pass-through — Justworks routes to Remote.com; no native global payroll |

---

## EOR selection decision tree

```
Q1: Is the company already on Rippling?
├── YES → Rippling Global is the default; quote against Deel/Remote to validate
└── NO → continue

Q2: How many countries will the company hire in?
├── 1-3 countries → any of Deel/Remote/Oyster can cover this; evaluate on price + compliance depth
└── 4+ countries → favor Deel (breadth) or Remote.com (own-entity depth)

Q3: Is compliance/entity-ownership a priority (e.g., regulated industry, sensitive employee data)?
├── YES → Remote.com (owns all entities, no partner risk) or Rippling Global
└── NO → Deel or Oyster (both competitive on price and speed)

Q4: Is the company price-sensitive?
├── YES → Oyster ($499 Essentials) or Remote.com contractor ($29/mo) for contractors
└── NO → Deel for broadest coverage and contractor-to-EOR conversion flexibility

Q5: Does the company need fast hiring (< 10 days to onboard)?
├── YES → Deel (typically 3-10 days)
└── NO → any platform; Remote.com and Oyster both compete on onboarding speed
```

---

## Country-specific callouts (2026)

### Germany
- Germany has strict employment protection rules; EOR is permitted but "Arbeitnehmerüberlassung" (temporary employment agency license) rules apply in some contexts
- Germany introduced a €50,000 penalty per misclassified worker in 2025
- German workers have strong termination protection; EOR exit requires following German statutory notice periods (up to 7 months for long-tenured employees)
- Rippling and Remote.com have own entities in Germany; Deel uses a German partner entity

### United Kingdom
- Post-Brexit employment rules apply; UK IR35 rules can create deemed-employer status for contractors
- EOR is well-established and legally clear in the UK
- All major EOR providers have UK entities

### European Union (post-EU Platform Work Directive, December 2026)
- The EU Platform Work Directive reverses the burden of proof: platforms/companies must prove a worker is NOT an employee if the worker asserts employee status
- Five control criteria trigger the presumption of employment; failing just two is sufficient for the presumption to apply
- Compliance deadline: December 2, 2026 for EU member states
- Impact: any EU-based worker who is currently being paid as a contractor should be reviewed before December 2026

### Brazil
- Brazil has mandatory profit-sharing (PLR) and 13th-month salary requirements for W-2-equivalent employees
- EOR can be complex due to CLT (Consolidation of Labor Laws) requirements
- Favor Remote.com or Deel for Brazil due to legal complexity

### China
- True EOR is legally restricted in China; most EOR providers use a "representative office" or licensed staffing company model
- At any meaningful headcount (3+), a WFOE (Wholly Foreign-Owned Enterprise) is strongly preferred
- Consult a China-specialized employment attorney before hiring in China via EOR

---

## Key risk: Permanent Establishment (PE)

If a foreign worker has authority to sign contracts on behalf of the company, the company may be deemed to have a "permanent establishment" (PE) in the worker's country, triggering corporate tax obligations in that country. EOR mitigates but does not eliminate this risk.

**Always ask:** Does the worker have signing authority or contract negotiation authority? If yes, escalate to "consult a tax attorney."

---

## Contractor-to-EOR conversion

When an existing international contractor should be converted to an EOR employee:

1. Determine the correct new arrangement (EOR vs local entity) using the matrix above
2. Review existing contractor agreement for any exclusivity, IP, or restrictive covenants that must carry forward
3. Issue EOR employment agreement through the platform (Deel and Remote.com both have built-in agreement templates by country)
4. Plan the transition date — beginning of a month is cleanest for payroll
5. Issue final contractor invoice from the old relationship; start EOR payroll on transition date
6. Consider termination risk: in some countries (Germany, France), converting a contractor to an employee triggers local employment protections immediately
