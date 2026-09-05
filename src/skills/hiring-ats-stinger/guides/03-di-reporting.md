# Guide 03: D&I Reporting and EEOC Compliance

Source: `research/external/2026-05-20-di-reporting-eeoc.md`

---

## What you need to measure

Diversity and inclusion reporting in the ATS context means: measuring the funnel diversity metrics that tell you whether qualified candidates from underrepresented groups are advancing at the same rate as others, and whether the process (not just the pipeline) is contributing to disparities.

**The four funnel metrics:**

| Metric | Formula | Why it matters |
|---|---|---|
| **Application rate by group** | Count of applicants by self-ID group / total applicants | Is the top of the funnel diverse? |
| **Screen-to-advance rate by group** | Candidates advanced from screen / candidates screened, by group | Is the recruiter screen filtering out certain groups? |
| **Interview-to-offer rate by group** | Offers extended / interview completions, by group | Is the technical/on-site stage the bottleneck? |
| **Offer-to-hire rate by group** | Hires / offers extended, by group | Are offer terms causing drop-off from specific groups? |

These four together tell you where in the funnel a disparity is introduced. Without stage-level data, "we're diverse at the top but not at the bottom" is not actionable.

---

## EEOC adverse impact: the four-fifths rule

The EEOC Uniform Guidelines define adverse impact using the **four-fifths rule**: if the selection rate for any protected group is less than 80% of the selection rate for the group with the highest selection rate, adverse impact is indicated.

**Formula:**
```
Selection rate for Group A = (# Group A hired) / (# Group A applied)
Adverse impact ratio = (Lower selection rate) / (Higher selection rate)
Adverse impact indicated if ratio < 0.80
```

**Example:**
- White candidates: 40 hired / 200 applied = 20% selection rate
- Black candidates: 8 hired / 80 applied = 10% selection rate
- Ratio: 10% / 20% = 0.50 → adverse impact indicated (below 0.80 threshold)

ATS platforms surface this differently. Ashby and Greenhouse have built-in adverse impact analysis in their analytics modules. Workable requires data export. Rippling Recruiting's EEOC reporting depth is not confirmed in public documentation (verify with Rippling).

---

## Voluntary self-identification setup

EEOC self-ID data must be collected on a voluntary basis. The following setup rules apply across all ATS platforms:

1. **Voluntary = the candidate can decline to answer.** Include a "prefer not to say" option for every self-ID category.
2. **Collect at application stage,** not after an offer. Data collected post-offer is suspect (and in some jurisdictions, prohibited from use in selection decisions).
3. **Firewall self-ID data from hiring managers and interviewers.** Only TA ops and HR analytics roles should see aggregate reporting. The EEOC categories should never appear in a hiring manager's scorecard view.
4. **Use the EEOC's five race/ethnicity categories** (or OFCCP's expanded seven categories for federal contractors): Hispanic/Latino, White (non-Hispanic), Black/African American, Asian, Native Hawaiian/Other Pacific Islander, American Indian/Alaska Native, Two or More Races.

---

## ATS platform D&I reporting comparison

| Platform | Native D&I funnel reporting | EEOC category support | Notes |
|---|---|---|---|
| Ashby | Yes — built-in funnel analytics with demographic breakdowns | Yes | Best-in-class analytics; adverse impact analysis available |
| Greenhouse | Yes — compliance module with EEOC reporting | Yes | Strongest enterprise compliance tooling |
| Workable | Limited; primarily via export to BI tool | Partial | Standard EEOC categories in self-ID forms; analysis requires export |
| Lever | Via integration with analytics add-ons | Yes | Base product does not include adverse impact analysis |
| Pinpoint | Built-in blind screening (hides demographic info from screeners) | Verify with vendor | Blind screening is the primary D&I tool; aggregate reporting may be limited |
| Rippling Recruiting | Not confirmed in public documentation | Verify with vendor | Check current product docs; HRIS analytics may be separate |

---

## Automated Employment Decision Tools (AEDT)

Some ATS platforms use AI-powered screening or scoring. NYC Local Law 144 (the first AEDT law) requires annual bias audits for AI tools used in hiring decisions. Similar regulations are emerging in other jurisdictions in 2026.

> **This is a rapidly evolving legal area.** Do NOT give specific jurisdiction-by-jurisdiction guidance. Recommend users verify current AEDT requirements with legal counsel for the states and countries where they hire. Source: `research/external/2026-05-20-di-reporting-eeoc.md`

---

## Output for D&I reporting requests

When a user asks about diversity reporting:
1. Ask which ATS platform they are on and whether they have self-ID collection configured.
2. Identify which of the four funnel metrics they can currently produce.
3. Surface any stage where the data collection gap blocks analysis.
4. Recommend ATS configuration changes (self-ID setup, firewall settings, reporting module access).
5. Flag AEDT considerations if the platform uses AI screening.

Flag EEOC freeform-field scorecard risk (from `guides/02`) if the user mentions scorecard data in the context of D&I reporting.
