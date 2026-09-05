# Live Littlebird routine layer, observed

- **Source:** Littlebird MCP, Pro account, read-only calls to
  `LB_INTERNAL_LIST_ROUTINES`, `LB_INTERNAL_GET_ROUTINE_CONFIG`,
  `LB_INTERNAL_GET_ROUTINE_REPORTS`, and `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`
- **Fetched:** 2026-08-17
- **Source type:** primary observation (live production account, no writes performed)
- **Why archived:** The failure modes in this skill's rubric are not hypothetical. This file
  is the evidence they occur in a real, competently written routine. Personal detail is
  reduced to what the teaching point requires; third-party names and dollar amounts are
  omitted per `references/evidence-standards.md` rules 7 and 10.

## Account state

Pro Monthly plan, active. Two routines total.

| Routine | Schedule | Reports | Latest | State |
|---|---|---|---|---|
| Safety-net daily (id 41875) | daily 08:00 | 19 | 2026-08-16 | active |
| Daily email recap (id 24318) | daily 18:00 | 12 | 2026-05-18 | paused |

## Routine A, the dead one

Created 2026-05-08. Paused. Last report 2026-05-18, three months before observation. Twelve
reports produced, then nothing. Auto-pause when reports go unread was **on**, and it fired.

Its full prompt, verbatim, is 31 words:

> "Please scan my emails every day and let me know if there are any critical to-dos,
> meeting requests, and things I need to be aware of. Ignore all marketing emails and
> potential spam."

Observable defects: "critical" is never defined; there is no output ceiling; there is no
instruction to read prior reports; there is no escalation rule; there is no statement of
what to do if nothing is found; there is no named next action for anything it finds. The
only discrimination rule present is a negative one, ignoring marketing and spam.

It occupies a plan slot and produces nothing.

## Routine B, the good-but-incomplete one

Created 2026-07-30. Active, daily 08:00, agent mode max, push notifications on, auto-pause
off. 19 reports. Its prompt is genuinely well written and contains:

- An explicit scoping rule that the report is about the user, not about activity around
  them, with worked negative cases: a group message where the user was not singled out does
  not count, and a CC where someone else is the primary recipient does not count.
- An explicit false-positive target: "I want zero false positives - only flag things you're
  highly confident are genuinely waiting on me."
- Three numbered questions, each with its own scope rule.
- An output ceiling: "Keep the total output under 200 words."
- An anxiety clause: "If everything's under control, just tell me that - don't manufacture
  anxiety."

What the prompt does **not** contain: any instruction to read its own past reports, and any
rule for what to do when an item recurs.

## What the reports show

Observed across the six most recent reports (2026-08-11 through 2026-08-16):

1. **The same number-one recommendation on four consecutive days.** The Aug 16 report says
   so in its own words: "This has been the #1 item for four straight days and it's now at
   the point of actual data loss." Aug 15 says "It's been the #1 item for three days
   straight."

2. **A single blocked contact flagged for 16 consecutive days.** The Aug 16 report records
   "No reply since Jul 31. Now 16 days. He's blocked." The same contact appears in the Aug
   13, 14, and 15 reports, with the Aug 15 report noting "This is the 4th consecutive day
   flagged."

3. **Escalating language, unchanged tactic.** The recommendation is the same action, stated
   more urgently each day. Across the four days the section heading escalates to
   "Overdue - CRITICAL". At no point does the report change channel, change the recipient,
   propose a different approach, or state plainly that the previous approach is not
   working.

4. **Inconsistent memory.** Some reports reference earlier ones ("Still open from previous
   reports", "flagged yesterday, still open") and some do not. Nothing in the prompt asks
   for this, so it happens or does not happen run to run. Memory that is not instructed is
   not reliable.

5. **The output ceiling was not held.** The 200-word ceiling is stated once in the prompt.
   The Aug 16 report runs past it. A ceiling stated once and never restated in the output
   contract is a wish, not a constraint.

6. **No handoff anywhere.** Nineteen reports name conditions. Not one names what resolves
   the condition, who does it, or which skill or session to open. Every finding terminates
   at the user's attention.

## The teaching contrast

Routine B is a better prompt than most routines anyone writes. It has scope, false-positive
discipline, a length ceiling, and an explicit anti-anxiety clause. It still repeats itself
for sixteen days, because a good prompt is not the same thing as a complete prompt. The two
missing pieces are memory and escalation, and their absence is fully visible in the report
history and completely invisible in the prompt text.
