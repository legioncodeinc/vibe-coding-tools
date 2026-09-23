# Guide 00: ATS Platform Selection Decision Matrix

Source: `research/external/2026-05-20-ats-platform-comparison.md`, `research/external/2026-05-20-lever-pinpoint-comparison.md`, `research/external/2026-05-20-ashby-review-2026.md`

---

## The three questions you must ask first

Never recommend a platform without answers to these three:

1. **Headcount tier:** How many hires per year? (< 20 / 20-100 / 100-300 / 300+)
2. **Integration surface:** Which HRIS, sourcing tools, and calendar/scheduling tools are already deployed?
3. **TA team profile:** Dedicated TA team or hiring managers doing their own recruiting?

These determine which platforms are even on the table before you discuss features.

---

## Platform comparison table (2026)

| Platform | Best fit | Pricing range | Standout trait |
|---|---|---|---|
| **Ashby** | Series A-C tech startups, 50-1,000 employees, data-driven TA teams | ~$400/mo Foundations; recruiter seats $350-750/mo; verify with vendor | Analytics "5-10 years ahead" of competitors; API-first architecture; highest G2 rating in segment |
| **Greenhouse** | Enterprise, dedicated TA teams, compliance-heavy environments | Custom pricing only; de facto inaccessible to teams without a dedicated TA budget | Structured hiring frameworks, deep compliance tooling, strong ecosystem; Hire Link for Workday (March 2026) |
| **Workable** | SMBs (1-100 employees), hiring generalists, budget-conscious | $149-$599/mo (only major platform with published transparent pricing); verify with vendor | AI sourcing + video interviews + assessments built in at no add-on cost |
| **Lever** | Mid-market to enterprise, collaborative hiring stakeholders | Custom; scales well per-user at volume | Broad job board integrations, established ecosystem, confirmed LinkedIn RSC support |
| **Pinpoint** | Mid-market in-house TA teams (5-50 in team), bias-reduction focus | $600-$2,000/mo range; verify with vendor | Blind screening, built-in structured interview tools, modern pipeline UI |
| **Rippling Recruiting** | Companies already on Rippling HRIS | Bundled with Rippling platform; verify with vendor | Zero ATS-to-HRIS handoff friction (same platform); unified onboarding |

> **Note:** All pricing ranges are from 2026 practitioner reviews, not vendor sources. Always direct users to request a vendor demo and pricing quote. Do not quote numbers as authoritative.

---

## Decision tree

```
Is the team already on Rippling HRIS?
  → YES: Evaluate Rippling Recruiting first. Does it meet your pipeline requirements?
      → YES: Use Rippling Recruiting. Skip the handoff problem entirely.
      → NO: Proceed to headcount tier below.
  → NO: Proceed to headcount tier below.

Headcount tier: how many hires per year?
  → < 20: Workable (budget-conscious, SMB, generalists). Ashby if the team is data-driven.
  → 20-100: Ashby (data-driven, Series A-B) or Lever (mid-market, collaborative).
  → 100-300: Ashby or Lever. Greenhouse if compliance/enterprise tooling is a hard requirement.
  → 300+: Greenhouse or Lever. Rippling if you want to consolidate to one people-ops platform.

Does the team have bias-reduction as a primary requirement?
  → YES: Evaluate Pinpoint (blind screening built in).

Is the team's TA team profile generalist hiring managers (no dedicated TA)?
  → YES: Workable (simplest UX, AI-assisted sourcing built in).
```

---

## Key differentiators

### Ashby
- Reporting and analytics consistently rated "5-10 years ahead" in practitioner reviews (The Daily Hire, G2 consensus)
- API-first architecture: custom integration needs are well-supported
- Strong fit for TA teams that will act on data (funnel analytics, time-to-hire, source quality)

> TODO: open question -- Ashby's LinkedIn RSC support status is not confirmed in LinkedIn's March 2026 partner documentation. Verify with Ashby before recommending for LinkedIn Recruiter-heavy teams. See `research/research-summary.md` Q1.

### Greenhouse
- **Time-critical:** Harvest API v1/v2 is deprecated and unavailable after **August 31, 2026**. Any existing Greenhouse integrations on v1/v2 must migrate to Harvest API v3 by this date. Source: `research/external/2026-05-20-greenhouse-api-updates.md`
- Hire Link for Workday launched March 2026 — the Greenhouse-native HRIS handoff path for Workday shops
- Custom pricing only: de facto inaccessible to small teams and early-stage startups without dedicated TA budget

### Workable
- The only major ATS with published transparent pricing — valuable for budget-constrained decisions
- AI sourcing, video interviews, and assessments included at higher tiers without add-on cost

### Rippling Recruiting
- Eliminates the ATS-to-HRIS handoff entirely — the single most compelling argument when the team is already on Rippling

> TODO: open question -- Rippling Recruiting's native D&I and EEOC funnel reporting capabilities are not well-documented in public sources. Verify with Rippling before advising on D&I requirements. See `research/research-summary.md` Q2.

### Lever
- Confirmed LinkedIn RSC 1.0 partner (Pinpoint RSC status is not confirmed; verify with vendor if LinkedIn RSC is a hard requirement)

---

## Anti-patterns in ATS selection

- **Choosing Greenhouse because "it's what enterprise uses"** without checking whether the team has the budget and dedicated TA capacity to operate it effectively.
- **Choosing Workable for a 200+ hires/year program** because it was the first ATS used at the company — Workable's UX optimizes for generalists at lower velocity.
- **Evaluating platforms before knowing the HRIS** — the ATS-to-HRIS handoff is the highest-friction operational point. The HRIS choice constrains the ATS choice, not the other way around.
- **Choosing the best-featured platform without testing the actual job-posting-to-offer flow** — always demo with a real role scenario before committing.

---

## Output for ATS selection requests

When producing a platform recommendation, use `templates/ats-audit-report.md` (Platform Selection section) and include:
1. The user's stated constraints (headcount, HRIS, team profile, integration requirements)
2. The recommended platform with a two-to-three-sentence rationale
3. One alternative with the trade-off it represents
4. The three questions to validate before committing (pricing call, integration confirmation, reference check)

See `examples/01-ats-selection-series-a.md` for a worked example.
