# 04 — JTBD Interview (Five-Act Structure)

How to conduct a Jobs-to-be-Done switch interview using the Five-Act structure.

**Research source:** `research/external/2026-05-20-jtbd-switch-interview-moesta-method.md`, `research/external/2026-05-20-user-interview-script-structure-2026.md`

---

## Why JTBD, not feature-request interviews

Traditional feature-request interviews ("What features do you want?") produce wish lists that reflect users' current mental models and miss the underlying motivation structure. JTBD interviews focus on the **job the customer hired the product to do** — the specific circumstances, triggers, and forces that led to a behavior change.

The insight is motivational: when a customer "hires" a product, they are making progress on a goal that their previous approach failed to accomplish. Understanding the switch — what they were doing before, what triggered the switch, what forces pushed and pulled — gives you the real job, not the surface request.

---

## The Five-Act structure

### Act 1 — Context (3-5 min)
Set the stage. Understand the customer's role, current workflow, and relevant background.
- "Tell me about your role and how you typically [domain area]."
- "How long have you been doing this?"
- DO NOT mention your product or the opportunity you're exploring yet.

### Act 2 — Big-picture questions (3-5 min)
Understand their current approach and pain landscape at a high level.
- "Walk me through how you handle [relevant task area] today."
- "What does a good week look like for [this task]? What does a bad week look like?"
- Listen for language that clusters around unmet desires or recurring frustrations.

### Act 3 — Current-state story / switch story (10-15 min)
This is the core. Anchor to a specific, recent event — the last time they made a relevant decision or behavior change.
- "Think about the last time you [made a decision about X / switched tools / started using Y]. Walk me through what happened, starting from the moment you first thought about it."
- Let them tell the story chronologically. Resist interrupting with interpretation.
- Probe for the **progress-forcing context**: "What was going on in your life or work at that specific moment that made [the switch/decision] feel urgent?"

The goal is to elicit the four forces (Moesta's model):
- **F1 Push:** the frustration or limitation in the current approach that created dissatisfaction.
- **F2 Pull:** the attraction to the new approach (what it promised).
- **F3 Anxiety:** the hesitation or fear about switching.
- **F4 Habit:** the inertia of the current approach (even if imperfect).
(Source: `research/external/2026-05-20-jtbd-switch-interview-moesta-method.md`)

### Act 4 — Mental-model probes (5 min)
Dig into how they think about the problem space.
- "When you were evaluating [options/tools/approaches], what mattered most to you?"
- "If you had to explain to a new colleague how to decide which [approach] to use, what would you say?"
- "What does 'good enough' look like for this?"

### Act 5 — Closing (2-3 min)
Leave space for anything you missed.
- "Is there anything about how you [handle this] that we haven't covered?"
- "If you could change one thing about your current approach, what would it be?"
- Thank them; confirm they're open to a follow-up if questions emerge.

---

## The "walk me through the last time" opener

The single most effective JTBD interviewing technique is anchoring to a **specific recent event**, not a general experience:

- BAD: "How do you usually handle [X]?"
- GOOD: "Think about the last time you [did X]. Walk me through what happened."

The specific-event anchor produces behavioral data ("I did this, then this happened") rather than stated preferences ("I usually like to..."). Stated preferences are unreliable; behavior is evidence.

---

## Common mistakes

| Mistake | Why it fails | Fix |
|---|---|---|
| Asking about hypothetical futures | "Would you use a feature that does X?" is not JTBD | Anchor to past behavior always |
| Jumping to your solution | "When you're doing X, wouldn't a Y be helpful?" | Never mention your product in Act 1-3 |
| Coding themes before hearing the full story | You miss the motivation structure | Let the story complete before probing |
| Interviewing only happy customers | Gives an inflated picture of what's working | Include churned users and non-users |
| < 6 interviews per opportunity cluster | Too small to see patterns | Aim for 5-7 minimum per cluster before saturation |

---

## Output

Write the completed interview notes to: `library/discovery/interview-scripts/<YYYY-MM-DD>-<opportunity-slug>.md`

Use `templates/interview-script.md` which has the Five-Act sections pre-labeled and a notes column for each act.

See `examples/happy-path-saas-onboarding.md` for a sample completed interview note with opportunity hypotheses extracted.
