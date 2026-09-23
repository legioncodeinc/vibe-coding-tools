# Wiring the Routines-observe, Cowork-acts handoff

Why the split exists, what belongs on each side, and how to write the line that connects
them.

---

## The structural fact everything here follows from

**`LB_INTERNAL_CREATE_ROUTINE` and `LB_INTERNAL_UPDATE_ROUTINE` are not available from inside
a running routine.** A routine cannot create a routine and cannot rewrite itself or any other
routine. Only an interactive session can
[references/littlebird-mcp-reference.md, routine tools].

Two things follow, and both are load-bearing for this skill.

**1. This skill is on-demand, and could not be anything else.** `routine-architect` audits and
rewrites routines. The tools it needs to do the rewriting are absent from the environment a
routine runs in. There is no version of this skill that runs as a routine. This is a hard
structural constraint, not a design preference, and it is why the mode line in SKILL.md says
on-demand without hedging.

**2. It is the same constraint that produces the whole observe-act pattern.** The routine
layer is deliberately narrower than the interactive layer. A routine is an unattended observer
that produces one report in one pass. A Cowork session is the hands: interactive, tool-rich,
able to write files, ask questions, send things, and call other MCP servers
[references/littlebird-mcp-reference.md, the Routines-observe Cowork-acts pattern].

---

## What belongs on each side

| Property | Routine | Cowork session |
|---|---|---|
| Runs without the user present | Yes | No |
| Can ask a question and wait | No | Yes |
| Can produce a file deliverable | No | Yes |
| Can send anything to a third party | No | Yes, with approval |
| Can create or edit routines | No | Yes |
| Can run multi-hour or multi-pass work | No | Yes |
| Cost of running it every day | Low | The user's attention |

**The test for whether work belongs in a routine:** can it finish unattended in one pass, and
is its entire output a report? If either answer is no, it belongs in Cowork
[references/littlebird-mcp-reference.md]. No approvals, no multi-hour research, no file
deliverables.

**The test for whether the split has been done correctly:** the routine names a condition, and
the Cowork skill resolves it. If the routine is trying to resolve, it will fail or fabricate.
If the Cowork skill is doing the watching, it is running on the user's attention instead of on
a schedule, which is the resource the whole design is trying to protect.

---

## Why a handoff line is mandatory and not a nicety

Three independent lines of evidence.

**It is what makes a report a control.** Sub-critical findings can legitimately go into a
daily report rather than an interruption, "but only with clear accountability systems"
[references/research/distilled-routine-prompt-craft.md section 4.4]. A report with no owner
and no named next action is a feed, not a control.

**Actionability is the definition of a valid alert.** "Every page should be actionable; simply
noting 'this paged again' is not an action"
[references/research/distilled-routine-prompt-craft.md section 4.4]. A finding with no named
resolution is the report equivalent of noting that it paged again.

**Graceful transfer of control is a documented agent property.** Agents should have mechanisms
to "gracefully transfer control when it can't complete a task", and failure thresholds are a
named human-in-the-loop trigger
[references/research/distilled-routine-prompt-craft.md section 6]. A routine cannot complete
the task by construction, so the transfer is not an exception path. It is the routine's normal
ending.

**And it is the observed gap.** In the live account, 19 reports name conditions and not one
names what resolves the condition, who does it, or which session to open
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

---

## The handoff line

Two forms. Every reported item ends in one of them.

```
Next: open Cowork and run <skill-name> on <specific target>.
Next: <the single physical action>, roughly <time estimate>.
```

**Rules that make the difference between a real handoff and decoration:**

1. **Name a specific target, never a category.** "Run person-dossier on Ryan Jacobs" is a
   handoff. "Consider researching the contact" is a sentence.
2. **Name a skill the user actually has.** A handoff to a skill they have not installed is
   worse than none: it teaches them the handoff line is generic filler. Check before you write
   it into a prompt.
3. **When no skill applies, name the physical action and estimate the time.** The estimate is
   what converts a finding into something the user can slot into a gap in their day. "Roughly
   10 minutes" gets done at 4:50pm. "Follow up with the vendor" does not.
4. **One line per item, not one per report.** A handoff at the bottom of a report applies to
   nothing in particular.
5. **The handoff changes when the escalation rule fires.** At three occurrences the tactic
   changes, so the handoff must change too. If the same handoff line survives an escalation,
   the escalation did not happen.

---

## Matching findings to skills

The mapping the routine library uses. Adapt it to what the user has installed.

| Finding shape | Cowork skill | What the skill needs from the report |
|---|---|---|
| Someone is waiting on the user; a commitment is open | `promise-keeper` | The person, the thread, and what was promised |
| A meeting is coming and the user needs context | `pre-call-brief` | The meeting name and date |
| The user needs to know who they are dealing with | `person-dossier` | The person's name and where they came from |
| Recurring spend, failed charges, unused tools | `money-leak-auditor` | The vendor and the amount |
| Work done twice that should be documented | `sop-forge` | The date and session where it was done best |
| New contacts worth pursuing appeared | `lead-harvester` | The source and the window |
| The routine layer itself is the problem | `routine-architect` | Nothing. The audit starts from the routine list |

The last row is the loop closing. A routine can observe that a routine is failing, because
reading routine configs and reports is available from anywhere. It cannot fix it. That is this
skill's job, and it only runs when the user is present.

---

## Designing the pair together

When adding a routine, design both halves in the same conversation. A routine designed alone
produces findings nobody has a path to resolve.

1. **Name the condition.** What specifically is the user trying not to miss? One sentence.
2. **Name the resolution first, before writing the routine prompt.** What does a person do
   when it happens, and which skill or action is that? If nothing resolves it, the routine
   should not exist. That is the honest answer, and it saves a slot.
3. **Check the condition is observable in one unattended pass.** If it needs a question
   answered, a file produced, or several hours, split it: the routine watches for the trigger
   and the Cowork skill does the work.
4. **Write the routine prompt** to the seven-part shape in `prompt-rewriting.md`, with the
   handoff line from step 2 baked in.
5. **Check the slot budget** before creating anything (`audit-rubric.md` part 5). Slot scarcity
   is a standard product pattern, not a Littlebird quirk
   [references/research/distilled-routine-prompt-craft.md section 8].
6. **Read the first report with the user.** Creation immediately generates one
   [references/littlebird-mcp-reference.md, routine tools]. It is a free test of the prompt
   against real data while the user still remembers exactly what they wanted.

---

## The reverse direction: Cowork reading routine reports

The handoff runs both ways, and this direction is the more underused of the two.

A Cowork skill invoked off the back of a routine finding should call
`LB_INTERNAL_GET_ROUTINE_REPORTS` and read the routine's history before starting
[references/littlebird-mcp-reference.md]. The report history contains context the user will
not repeat: how long the item has been open, what was already recommended, and what did not
work.

Concretely, a skill that opens with "this has been flagged for 16 consecutive days and the
recommendation has not changed once" is starting from a materially better position than one
that opens with the item alone
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

Note the asymmetry, because it is easy to get backwards: reading routine reports is available
from anywhere, including from inside another routine. Writing routines is not
[references/littlebird-mcp-reference.md, routine tools].

---

## What not to do

**Do not put approval steps in a routine prompt.** There is nobody there. The routine will
either skip the step or invent an answer.

**Do not ask a routine to produce a file.** It produces a report. A prompt asking for a
document will produce a report that looks like a document and lands nowhere.

**Do not ask a routine to create or modify routines.** The tools are not available to it
[references/littlebird-mcp-reference.md]. A prompt that asks for it will fail silently or
produce a report describing the routine it wishes it had made.

**Do not build a routine whose handoff is always "decide what to do about this".** That is
not a handoff, it is the absence of one, written in the shape of one.

**Do not run two routines that watch the same condition on different schedules.** That doubles
interrupt volume without adding information, and interrupt volume is the thing that damages
the channel [references/research/distilled-routine-prompt-craft.md section 7.5].
