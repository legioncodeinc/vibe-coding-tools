# Example 01: ATS Selection for a Series A Company

**Demonstrates:** `guides/00-platform-selection.md` happy path

---

## User input

"We're a 40-person Series A company, engineering-heavy, hiring around 30 people this year (mostly engineers and a few GTM). We're on Rippling for HR and payroll. We don't have an ATS yet — using spreadsheets. Our two technical co-founders do most of the interviewing but we just hired our first recruiter."

---

## Applying the decision tree

**Step 1: Already on Rippling HRIS?**
→ YES. The first question to ask: "Does Rippling Recruiting meet your pipeline requirements?"

Questions to evaluate Rippling Recruiting fit:
- Do you need a highly customizable pipeline with advanced analytics? (Rippling Recruiting is less feature-rich than Ashby for this)
- Do you expect to hire at a pace that requires a dedicated sourcing module? (Rippling Recruiting is lighter on sourcing than Ashby)
- Is the zero-handoff benefit worth simplifying to one platform?

User's response (implied): "We have a single recruiter and are hiring 30/year. The team doesn't have strong opinions on analytics yet. We want to keep things simple."

→ Rippling Recruiting is likely a strong fit. Recommend evaluating it first.

---

## Primary recommendation: Rippling Recruiting

**Rationale:** At 30 hires/year with a 40-person company, a non-dedicated TA team (co-founders + 1 recruiter), and existing Rippling HRIS, Rippling Recruiting eliminates the highest-friction operational point: the ATS-to-HRIS handoff. Every hire flows automatically from the ATS into payroll, IT provisioning, and benefits enrollment without manual data entry.

**The Rippling advantage here:**
- Zero ATS-to-HRIS handoff configuration (same platform)
- Hiring managers and the recruiter see the same system they use for other HR tasks
- Reduces the tech stack for a team that is still building its ops foundation

**Trade-off to disclose:** Rippling Recruiting is less analytically powerful than Ashby. If data-driven recruiting (time-to-hire trends, source-of-hire analysis, funnel conversion by role) becomes a priority as the team scales past 50 hires/year, they may want to revisit Ashby. The migration cost is non-trivial but manageable at that scale.

---

## Alternative: Ashby

**If Rippling Recruiting does not meet their needs** (e.g., they want deeper analytics, more customizable scorecard tooling, or a more sophisticated sourcing module):

Ashby is the natural fit for a data-driven Series A engineering team. At ~$400/month Foundations plus recruiter seats, it fits the budget for a 40-person company. The API-first architecture supports custom integrations. The ATS-to-Rippling handoff will require configuration (see `guides/06-hris-handoff.md`), but Ashby's Webhooks API makes this straightforward.

---

## Output

**Recommendation:** Evaluate Rippling Recruiting first. Schedule a demo focused on the specific pipeline flow: application → recruiter screen → technical assessment → offer → automatic Rippling HRIS handoff. If the pipeline meets the recruiter's workflow needs, adopt it.

**Alternative:** Ashby, if the team wants best-in-class analytics and is willing to configure the Rippling HRIS handoff.

**Three questions to validate before committing:**
1. Does Rippling Recruiting support custom pipeline stages and scorecard templates that the recruiter can configure without engineering involvement?
2. Does Rippling Recruiting support blind screening or anonymous take-home review? (D&I-relevant for a team that wants equity in the process)
3. What is the Rippling Recruiting pricing relative to the current Rippling subscription?

---

*Guide cited: `guides/00-platform-selection.md`*
