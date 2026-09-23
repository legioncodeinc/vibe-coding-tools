# daily-brief

One screen every morning covering your day, built around the field that earns the open: what changed since yesterday.

## What it does

Daily digests are the most-abandoned category of recurring automation there is. A brief that restates your calendar is deleted within a week, so every design decision here exists to earn the open again tomorrow.

You get the schedule at a clause per meeting, the commitments actually due today, what went cold, threads where someone made a dated ask, one highest-leverage action with its reasoning shown, and the delta against yesterday. The ceiling is 220 words and the first block stops at 110, because a scanning reader takes in half the information only on pages of 111 words or fewer. Over the limit, it deletes whole items rather than stripping receipts.

Its best feature is composition. Rather than redoing what your other routines already did, it reads their latest reports and takes their findings, keeping each hedge and naming the source. Install more of this marketplace and the brief gets better without getting longer.

## When to use it

- First thing, before the day starts making decisions for you.
- "What changed since yesterday?"
- "What should I do first?"

Just ask. Trigger phrases include "morning brief", "daily digest", "brief me on my day", "what's on today", "what changed since yesterday", "what should I do first".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Daily routine | 45 minutes before your first real decision | One report, 220 words or fewer, notification on |
| On demand | When you ask | The same brief plus an appendix, written to a file |

Morning of, not the night before: the delta earns the open and a night-before run cannot see the overnight window. The evening slot is already `pre-call-prep`'s, because a per-meeting brief needs slack to fix a forgotten commitment.

There is no universal best hour, so it asks when you make your first real decision and schedules 45 minutes earlier. It shows you the prompt and schedule, you approve, it creates the routine.

## What you get

A report titled `Daily brief for Thursday, August 20, 2026`. Eight parts: bottom line, schedule, the one thing, due today, went cold, needs a reply, changed since yesterday, and a stalled section that appears only at seven runs. On demand you also get `daily-brief-2026-08-20.md`.

The one thing is three lines, and the last is mandatory:

```
The one thing: send Acme the revised SOW, 09:30 to 10:15.
Why: Priya is blocked on it, Partner sync 2026-08-14, Action Items.
Beat: the Q3 forecast, because nobody is waiting on it today.
```

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without it, it stops.
- Sibling routines, optional but this is where it gets good. With `commitment-tracker` and `client-health-radar` running it reads their reports; without them it runs reduced queries.
- A free routine slot. At your plan's limit it names which routine to replace.

## Limits worth knowing

**A quiet day gets two lines and no invention.** A daily routine has an implicit quota unless told that nothing to report is a complete answer. A brief with no quiet day in twenty runs is manufacturing findings.

**Precision over recall.** One wrong urgent item costs more trust than three missed real ones. A missed item is recoverable; a brief you have stopped opening cannot be corrected, because the correction arrives inside the brief.

**The rollup can amplify a sibling's mistake.** If commitment-tracker misreads something, this can promote that misreading to the top of your day. So every rolled-up line names the sibling and its report date, and is never stated more confidently than the sibling did.

**It drafts and holds. It never sends,** even with Gmail, Slack or a CRM connected. Health, financial detail, legal history and protected characteristics stay out.

## Related skills

- [pre-call-prep](../pre-call-prep/README.md), which owns per-meeting depth. The brief gives a clause and points here.
- [commitment-tracker](../commitment-tracker/README.md), for the full ledger and anything needing a chase.
- [client-health-radar](../client-health-radar/README.md), which feeds the went-cold section.
- [routine-architect](../routine-architect/README.md), when the brief repeats or auto-pauses.

## Under the hood

`SKILL.md` holds the instruction set and routine prompt. Domain guides in `references/`: `earning-the-open.md`, `the-one-thing.md`, `rollup-composition.md`, `brief-format-and-ceiling.md`. `references/research/` archives 14 primary sources, and every domain claim traces to one.
