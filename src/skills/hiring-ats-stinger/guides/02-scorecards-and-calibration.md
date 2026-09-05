# Guide 02: Scorecards and Calibration

Source: `research/external/2026-05-20-scorecards-calibration.md`

---

## Why structured scorecards matter

Structured interviews with behaviorally-anchored scorecards have a predictive validity of **0.51** for job performance. Unstructured interviews: **0.20**. That is more than twice as predictive, from the same pool of candidates, purely from adding structure. (Schmidt & Hunter meta-analysis, cited by Treegarden 2026.)

Google's Project Oxygen found that structured interviews were the only interview format that reliably predicted on-the-job performance at scale. Companies using structured interviews are 30% more likely to report high-quality hires and reduce mis-hires by up to 25%.

This is the scientific case. Use it when stakeholders resist the overhead of writing scorecards.

---

## The BARS framework

**BARS = Behaviorally Anchored Rating Scales.** Each point on a rating scale is defined by a concrete observable behavior, not a vague adjective.

### Example: "Communication" competency (4-point scale)

| Score | Anchor behavior |
|---|---|
| 4 - Exceptional | Communicates complex ideas clearly to non-expert audiences; asks clarifying questions before answering; summarizes alignment at the end of each topic |
| 3 - Effective | Explains technical reasoning when asked; responses are organized and easy to follow; minor gaps in tailoring to audience |
| 2 - Developing | Answers the question but without structure; occasionally unclear about assumptions; inconsistently checks for understanding |
| 1 - Insufficient | Difficult to follow; fails to check understanding; technical jargon without explanation to non-technical interviewers |

**Rule:** Every competency on a scorecard must have BARS anchors. "Meets expectations" is not an anchor. If it cannot be defined in observable behavior terms, the competency is too vague to measure.

---

## Debrief-before-submit protocol

The most common calibration failure mode: one interviewer says "I was a strong yes" and every other interviewer adjusts upward without surfacing their own evidence. This is anchoring bias, and it is the default behavior in group debriefs without structural intervention.

**The fix:** Interviewers submit scorecards independently before the debrief is held. The debrief agenda is then:
1. Each person states their overall recommendation (hire / no-hire) without seeing others' scores.
2. Walk through each competency where there is disagreement.
3. Each person presents their behavioral evidence for their score.
4. Scores may be revised after hearing evidence — but not just because someone else scored higher.

**ATS configuration for debrief-before-submit:**
- **Ashby:** Supports locking scorecard visibility until each interviewer has submitted. Enable under job configuration.
- **Greenhouse:** Supports "hide scorecard scores from other interviewers" under the job settings. Enable this per job.
- **Workable:** Scorecard submission is visible to other interviewers by default; configure to hide until all submissions are in if the plan tier supports it.

---

## Calibration session cadence

**Before a new role's first batch:** 30-minute session with the full interview panel to align on what each score anchor means for this specific role. Walk through two or three fictitious candidate scenarios and score them together. Surface and resolve disagreements before they contaminate real interviews.

**During active hiring loops:** When inter-rater reliability degrades (i.e., the same candidate gets a 4 from one interviewer and a 2 from another with no clear evidence discrepancy), run a calibration checkpoint. Signs of drift: scorecard submission rates drop, average scores creep uniformly up, panel members start deferring to each other.

---

## EEOC freeform-field risk

Free-form comment fields in scorecards are the highest legal risk surface in the hiring process. Written interviewer notes are discoverable in EEOC investigations. A comment referencing a protected characteristic (age, family status, national origin, disability, pregnancy, etc.) can expose the company to discrimination claims even if the hiring decision was made on legitimate grounds.

**How to reduce exposure:**
1. Replace "General Impressions" or "Notes" free-form fields with a structured prompt: **"Describe specific behaviors or statements that informed your scores above."**
2. Train interviewers that their written notes are permanent and auditable.
3. Add a "behavioral evidence" prompt to each competency row rather than a single free-form field at the end.
4. Do not include questions about protected characteristics in interview guides (this sounds obvious but "where are you from?" and "do you have kids?" still appear in unvetted guides).

> See `guides/03-di-reporting.md` for the intersection of scorecard data and EEOC adverse impact analysis.

---

## Output

When auditing a scorecard:
1. Check each competency for BARS anchors. Flag any with vague labels (flag as MEDIUM severity).
2. Check for free-form fields. Flag any that are not constrained to behavioral evidence prompts (flag as HIGH severity for EEOC risk).
3. Check whether debrief-before-submit is enforced in the ATS configuration.
4. Check calibration session cadence (ask when the last one was).

Use `templates/scorecard-template.md` to produce a new scorecard for a role. See `examples/02-scorecard-audit.md` for a worked audit example.
