# routine-architect

Scores your routines against nine failure modes, proves what is broken by quoting your own reports back, and shows the replacement prompt before changing anything.

## What it does

You set a routine up months ago. It still runs and you stopped opening it. Or it flags the same item every morning and you scroll past it, so the morning it flags something new you scroll past that too.

It reads your routines through the Littlebird MCP, flags the stale and dead, and scores each out of 18 against nine failure modes drawn from alert-fatigue research. Where the audit earns it, it writes the replacement prompt and gives every reported item a named next action.

The trick: it diagnoses from your report history, not your prompt text. Six of the nine failures are invisible in a prompt. The case it was built on: a good routine wrote "It's been the #1 item for three days straight", then next day "four straight days", same recommendation. Awareness with no escalation rule just produces volume.

## When to use it

- Your daily report has flagged the same thing four days running.
- You stopped reading a routine and cannot decide whether to fix it or kill it.
- A routine went quiet and you do not know if it paused itself.

Just ask. Trigger phrases include "audit my routines", "why does my routine keep repeating itself", "fix my routine prompt", "my daily report is useless", and "set up a routine".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand | When a routine annoys you | Scores, diagnoses with receipts, rewrites, new routines. |
| Monthly review | A reminder you set | The same run, over a month of drift. |

**It cannot run as a routine itself, and the reason is structural.** The tools it needs to fix anything are unavailable inside a running routine, and no routine can hold an approval gate open.

It does create other routines, in session: it checks your plan, names the slot, shows you the prompt and schedule, waits for approval, then reads the first report with you.

## What you get

One file, `routine-audit-YYYY-MM-DD.md`. It opens with the highest-value change in one sentence, then your slot budget: running, dead, limit, free.

Then the audit table, worst first. A row is title, schedule, report count, last run, score out of 18, top failure, recommendation. Anything under 15 gets a block below it: what it does well, each failure with a quoted report line and date, then the fix.

## What it needs

- The Littlebird MCP on a Power or Pro plan. With no Littlebird tools it stops rather than guessing.
- Routines with history. Under three reports, repetition is undetectable and those criteria go unscored.
- Your answer when it cannot tell whether a finding was wrong or just unactioned.

## Limits worth knowing

**It never silently rewrites your automation.** An update replaces the whole prompt, so you get the current text, the full replacement, and a change list naming what was added, removed and kept. "Leave it as is" is a real option, and deleting a dead routine is a recommendation it makes, never an action it takes.

**It errs toward removing alerts rather than adding them**, because a routine you stopped opening cannot be tuned. Slots are plan-limited, so it kills before it adds.

**Three parts of it are design decisions rather than researched practice**, and say so: the escalation threshold, the taxonomy, and the library patterns.

## Related skills

- [skill-suggester](../skill-suggester/README.md), when you need a workflow you do not have yet.
- [weekly-review](../weekly-review/README.md), the biggest reader of routine reports and first to spot a stale one.
- [daily-brief](../daily-brief/README.md), whose failures surface fastest, since a daily cadence streaks fast.
- [sop-forge](../sop-forge/README.md), when the work wants a written procedure, not a watch.

## Under the hood

`SKILL.md` is the full instruction set: five stages, nine failure modes, and the gate in front of every write. Domain guides are `references/failure-modes.md`, `references/audit-rubric.md`, `references/prompt-rewriting.md`, `references/routine-library.md` and `references/observe-act-wiring.md`.

`references/research/` archives 14 primary sources, and every domain claim traces to one of them.
