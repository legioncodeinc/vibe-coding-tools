# Guide 04: Take-Home Test Ethics and Design

Source: `research/external/2026-05-20-take-home-test-ethics.md`

---

## The landscape in 2026

Take-home assessments have grown to 68% of companies (up 12% year-over-year), while live coding remains the majority practice at 83%. Both are valid; neither is obsolete. The choice depends on role, team context, and what the assessment is actually measuring.

**What take-homes measure well:** Sustained problem-solving, code quality under realistic conditions, working without time pressure, ability to structure a solution independently.

**What live coding measures:** Problem-solving under pressure, communication of thought process, ability to collaborate in real-time, comfort with being observed.

Neither should be framed as the "better" option. The Angel's job is to help the user choose the right format for the role and design it ethically.

---

## The 2-hour threshold

**The empirically grounded cutoff:**

- 68% of candidates find take-home assessments burdensome when they exceed 2-4 hours. (2026 practitioner data)
- 59% of applicants will skip job postings that mention lengthy unpaid take-home work. (Metaintro 2026 survey)
- Unpaid long-form assessments disproportionately favor candidates with free time — no second job, no caregiving duties. This is a structural equity issue, not just a perception problem.

**Default recommendation:**
- Take-homes under 2 hours: unpaid is defensible if the scope is bounded.
- Take-homes over 2 hours: pay the candidate.

**How to scope under 2 hours:** A well-designed take-home assessment specifies "please time-box to 2 hours" and is reviewable in that time. If reviewers regularly take more than 2 hours and the result is a "small app" or "complete feature," the assessment is scoped for 4+ hours of work regardless of what the job posting says.

---

## Pay rate guidance

Research confirmed the ethical framework but did not surface a defensible flat-rate recommendation. The principled formula:

**Pay the pro-rated equivalent of the role's hourly rate for the expected time investment.**

Examples:
- Senior engineer role (base ~$180,000 / year → ~$90/hr): 2-hour take-home → $180 stipend.
- Mid-level engineer role (base ~$120,000 / year → ~$60/hr): 2-hour take-home → $120 stipend.

An alternative that is simpler to administer: a flat **$100-$150 stipend** for a time-boxed 2-hour assessment. This is below the pro-rated equivalent for senior roles but signals respect for the candidate's time and is common at Series A-C tech companies.

> TODO: open question -- no published industry benchmark for take-home stipend rates as of 2026 research. The formula above is practitioner judgment. Flag to hiring-ats-worker-bee that this guidance should be updated when a benchmark source is available.

---

## Anonymous grading

Greenhouse published data showing that anonymous take-home grading (graders cannot see candidate name, profile, or identifying information) increases pass-through rates by 6.5-10% for all candidates. This means traditional take-home grading has measurable unconscious bias embedded in it.

**Recommendation:** Enable anonymous grading whenever the ATS supports it.

**ATS configuration:**
- **Greenhouse:** Supports anonymous scorecards for take-home assessments. Configure under the job's interview plan settings.
- **Ashby:** Confirm current anonymous review support with Ashby documentation before recommending.
- **Workable:** Built-in skill assessments do not natively support full anonymous grading; verify current feature state.

---

## Assessment format comparison

| Format | Validity | Candidate experience | Equity risk |
|---|---|---|---|
| Time-boxed take-home (≤ 2 hrs) | High when structured | Moderate (time investment) | Lower if paid |
| Open-ended take-home (> 2 hrs) | High when structured | Low (high burden) | Higher (free-time bias) |
| Live coding (synchronous) | High when structured | Variable (performance anxiety) | Moderate (observation bias) |
| Portfolio review | High for senior roles | Best (no extra work) | Low |
| Game-based / short assessment | Moderate | Best (4.44/5 satisfaction, 88% 4-5 stars) | Lowest (equitable across backgrounds) |

Game-based assessments (Equalture data from 87,000 experiences): no meaningful experience gap between different candidate backgrounds. Worth mentioning as an emerging third option for teams concerned about both validity and equity. Source: `research/external/2026-05-20-take-home-test-ethics.md`

---

## The conversation to have with stakeholders

When stakeholders resist paying for take-homes, use these data points:

1. **59% candidate skip rate** for lengthy unpaid take-homes — you are filtering out candidates before they apply, not after.
2. **Structural equity impact** — unpaid assessments favor candidates with free time. If the team has D&I goals, this is a direct conflict.
3. **$100-$150 stipend vs hiring cost** — a $150 stipend per candidate who completes the take-home is trivially small against a recruiter's salary and the cost of a bad hire (DoL estimates bad hire = 30% of first-year salary).

---

## Output for take-home ethics requests

When a user asks about take-home test design or ethics:
1. Ask the time investment (actual, not aspirational) and whether it is paid.
2. Apply the 2-hour threshold framework.
3. Recommend anonymous grading if they are not already using it.
4. Suggest the pay rate formula or flat stipend if compensation is needed.
5. Flag the equity dimension if the team has D&I goals.

Do NOT recommend a specific dollar amount as an industry standard — frame as "equivalent to the role's hourly rate" or "a common range is $100-$150 for a 2-hour assessment; verify with your TA lead."
