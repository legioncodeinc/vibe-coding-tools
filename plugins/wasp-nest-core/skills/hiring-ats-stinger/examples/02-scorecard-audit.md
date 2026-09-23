# Example 02: Scorecard Audit with EEOC Freeform-Field Findings

**Demonstrates:** `guides/02-scorecards-and-calibration.md` edge case — freeform-field EEOC risk

---

## User input

"Here's our current senior engineer scorecard. Can you audit it? We've been getting inconsistent ratings and interviewers aren't always filling it out."

**Submitted scorecard structure:**
1. Technical Skills (1-5, no anchors, labeled "Poor / Below Average / Average / Good / Excellent")
2. Problem-Solving (1-5, same labels)
3. Communication (1-5, same labels)
4. Culture Add (1-5, "Do they fit our culture?")
5. Overall Recommendation (Hire / No Hire / On the Fence)
6. Notes: [Free text field — "Add any notes about the candidate here"]
7. Interviewer confidence: [Free text field — "How confident are you in your scores?"]

---

## Audit findings

### Finding 1: No BARS anchors on any competency (MEDIUM severity)

**Issue:** Every competency uses generic numeric labels ("Poor" to "Excellent"). These labels are not behaviorally anchored — a "4/Good" for Technical Skills means something different to every interviewer. This explains the inconsistent ratings.

**Fix:** Rewrite each competency with BARS anchors. A 4-point scale works better than 5 for binary hire/no-hire decisions (5-point scales produce clustering at 3). Example for Technical Skills:

| Score | Anchor behavior |
|---|---|
| 4 - Exceptional | Writes clean, idiomatic code independently; proactively identifies edge cases and failure modes without prompting; can explain trade-offs between implementation approaches |
| 3 - Effective | Produces working code with minor issues; addresses edge cases when prompted; explains reasoning when asked |
| 2 - Developing | Working code but with significant design issues; misses common edge cases; needs frequent prompting to explain approach |
| 1 - Insufficient | Cannot produce working code for the given problem; unable to explain approach; blocks on problem decomposition |

Apply the same anchor structure to Problem-Solving and Communication.

---

### Finding 2: "Culture Add" competency is undefined (HIGH severity — EEOC risk)

**Issue:** "Do they fit our culture?" is not a competency — it is a freeform judgment that has been shown to correlate with demographic similarity bias. "Culture fit" evaluations where the criteria are undefined are a documented source of adverse impact and are discoverable in EEOC investigations.

**Fix:** Either remove this competency entirely and replace it with concrete behavioral competencies (e.g., "Collaboration", "Learning Orientation") with BARS anchors, OR redefine "culture" as observable behaviors tied to the team's actual working norms (e.g., "Gives and receives direct feedback", "Proactively shares context with teammates").

Do NOT keep a freeform "culture fit" field on the scorecard.

---

### Finding 3: Freeform "Notes" field (HIGH severity — EEOC risk)

**Issue:** "Add any notes about the candidate here" is an unrestricted freeform field. Written notes are discoverable in EEOC investigations. A comment referencing a protected characteristic — even a seemingly innocuous one ("seems young", "interesting accent", "asked about parental leave") — creates legal exposure.

**Fix:** Replace with a behavioral evidence prompt:

> **Behavioral evidence** (required): *Describe the specific statements or behaviors the candidate demonstrated that informed your scores above. Do not include observations unrelated to the competencies being evaluated.*

This reframe is not just legal protection — it produces better data. Reviewers who must describe specific behaviors produce more calibrated and useful feedback than reviewers asked to "add notes."

---

### Finding 4: "Interviewer confidence" freeform field (LOW severity)

**Issue:** A freeform "how confident are you in your scores?" field produces unstructured text that is difficult to act on systematically.

**Fix:** Convert to a structured question: "Was this a sufficient sample? (Yes / Partial — candidate was nervous or the problem was a poor fit / No — insufficient signal)." This is more actionable and limits the range of responses.

---

### Finding 5: Debrief-before-submit not enforced

**Issue:** The scorecard submission process does not mention an independent-submission requirement. Without this, debrief discussions anchor on the first vocal opinion.

**Fix:** Configure the ATS to lock scorecard visibility until each interviewer on a given role has submitted. Ask the user which ATS they are on to provide the specific configuration steps (see `guides/02-scorecards-and-calibration.md`).

---

## Summary table

| Finding | Severity | Action |
|---|---|---|
| No BARS anchors on any competency | MEDIUM | Rewrite with behavioral anchors (4-point scale) |
| Undefined "Culture Add" competency | HIGH | Remove or replace with defined behavioral competencies |
| Unrestricted freeform "Notes" field | HIGH | Replace with behavioral evidence prompt |
| Unstructured "Confidence" field | LOW | Convert to structured options |
| Debrief-before-submit not enforced | MEDIUM | Configure ATS to lock scorecard visibility until all submissions |

---

*Guide cited: `guides/02-scorecards-and-calibration.md`*
*Template cited: `templates/scorecard-template.md`*
