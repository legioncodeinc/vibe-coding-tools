# 02: Psychological Safety: The Safety Gate

*Derived from `research/external/2026-05-20-psychological-safety-retroflow.md` and `research/external/2026-05-20-psychological-safety-agile-kollabe.md`.*

---

## Why safety comes before format

A team that doesn't feel safe won't say what's actually wrong. They'll produce the retro board equivalent of a performance review: technically complete, substantively empty. Psychological safety is not a nice-to-have; it is a load-bearing prerequisite for retro honesty.

The research anchor: 42% higher participation from introverted team members when input is anonymous (source: `research/external/2026-05-20-psychological-safety-retroflow.md`). Safety doesn't just help the nervous: it helps anyone who holds a minority view.

---

## The Edmondson 7-item measurement scale

Amy Edmondson's validated scale for measuring team psychological safety. Run this as an anonymous survey (Typeform, Google Form, or any anonymous polling tool) before the retro or at the session's opening.

Rate each item 1-5 (1 = strongly disagree, 5 = strongly agree):

1. If you make a mistake on this team, it is often held against you. *(reverse-scored)*
2. Members of this team are able to bring up problems and tough issues.
3. People on this team sometimes reject others for being different. *(reverse-scored)*
4. It is safe to take a risk on this team.
5. It is difficult to ask other members of this team for help. *(reverse-scored)*
6. No one on this team would deliberately act in a way that undermines my efforts.
7. Working with members of this team, my unique skills and talents are valued and utilized.

**Scoring:** Average the 7 items (after reversing the reverse-scored items). Maximum score = 5.

**Interpretation:**
- **< 3.0 average:** Low safety. Do NOT run a standard retro. See the mitigation playbook below.
- **3.0: 3.9:** Moderate safety. Use anonymous input tools as default. Brief the team on psychological safety before starting.
- **4.0+:** High safety. Standard retro formats are appropriate. Consider attributed feedback.

---

## The safety gate

Before running any retrospective:

1. Distribute the 7-item survey anonymously (at session start, on screen; or 24 hours before).
2. Calculate the average.
3. Apply the gate:
   - **< 3.0:** Stop. Run a safety-building exercise (see below). The retro's first job is to increase safety, not to surface sprint insights.
   - **3.0 - 3.9:** Proceed with anonymous input tools by default. Do not require attribution.
   - **4.0+:** Proceed with standard format.

---

## Five signals of low psychological safety (observational)

Use these when a formal survey is not practical:

1. Silence during brainstorming that breaks only when a senior person speaks.
2. Action items that are all process-focused (tools, tickets) and none that are people- or culture-focused.
3. Identical themes retro after retro with no improvement.
4. Contributions that cluster around the team lead's preferences.
5. Post-retro, people say privately what they didn't say on the board.

If three or more signals are present, treat it as a low-safety team regardless of survey score.

---

## Mitigation playbook (for low-safety teams)

### Technique 1: Anonymous input (bridge for low-trust teams)

Use a tool that accepts input without attribution during the brainstorm phase:
- **Sync:** FunRetro, EasyRetro, GoRetro (all have anonymous card modes), or Mentimeter.
- **Async:** Parabol, Neatro, or a simple shared Google Doc with a "write your thoughts here" prompt.

Important caveat from `research/external/2026-05-20-psychological-safety-agile-kollabe.md`: anonymity is a bridge technique, not a permanent solution. Anonymous tools can mask culture problems and prevent the team from building the authentic trust that makes retros valuable long-term. Use anonymity to get the team talking, but explicitly set a goal of moving toward attributed feedback as safety improves.

### Technique 2: Pre-mortem framing

Instead of asking "what went wrong?", ask "if a journalist were writing a story about this sprint a year from now, what would they say went wrong?" The hypothetical distance reduces defensiveness.

### Technique 3: Rotating facilitator

When the team lead always facilitates, contributors self-censor to avoid criticizing the facilitator's own decisions. Rotate facilitation so the lead is a participant, not the person holding the marker.

### Technique 4: Safety-building as retro topic

When safety is below 3.0, run a safety-building retro instead of a sprint retro: use Mad/Sad/Glad anonymously, and make the action items about team culture and working agreements rather than process.

---

## The anonymity tradeoff

| Anonymity | Attributed |
|---|---|
| Higher safety for low-trust teams | Builds accountability and trust over time |
| More candid input from introverts | Actions can be followed up with specific contributors |
| Risk: enables one-sided venting without accountability | Risk: self-censorship in low-safety teams |
| Best for: early-stage teams, post-conflict, new team members | Best for: mature teams with established trust |

Recommendation: default to anonymous input for the brainstorm phase and switch to attributed for the action-item phase (since ownership requires attribution).

---

*Cross-reference: `guides/01-formats.md` (Mad/Sad/Glad has specific safety requirements), `examples/happy-path-retro.md` (safety check in context).*
