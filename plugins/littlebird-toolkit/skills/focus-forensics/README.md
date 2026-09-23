# focus-forensics

Shows you the structure of your own week: where work held together, where it broke apart, and what changed since last week.

## What it does

Some weeks feel scattered and you have no idea why. The usual answer is a dashboard saying you lost six hours to switching. That number is invented. Littlebird takes periodic snapshots. It is not a time tracker, and nothing between two snapshots is observed.

So it ships what the instrument supports: switches between work contexts, run lengths in consecutive snapshots, fragmentation by hour, topics reappearing next to a stated intention of yours, and real arithmetic on your calendar.

The section that matters most compares this week with last. Two measurements taken the same imperfect way can be compared honestly, because whatever the method distorts it distorts both times. That is more defensible than either week's number, so the report leads with the change.

## When to use it

- The week felt scattered and you want to know whether it was.
- You changed something last week and want to know if it helped.
- Your calendar is eating your mornings.

Just ask for it. Trigger phrases include "how fragmented was my week", "where did my attention go", "focus report", "am I context switching too much" and "rabbit hole check".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Routine | Weekly, Monday 08:00 | The week just ended and what changed. No files, no approvals |
| On demand | Any time, 7 days by default | The file, per-hour detail, the taxonomy you confirm |

Run the weekly routine. Monday is deliberate: it covers the week just ended, before the new one takes shape. Change cannot be computed from one window, so the routine makes the primary section possible. The skill sets it up, showing you the prompt and schedule first.

## What you get

One file per deep run, `focus-forensics-YYYY-MM-DD.md`, dated by window end. Ten sections, fixed headings, so next week's run can parse this week's output. A row reads:

```
Runs of length 1     41 this week, 58 last week    (2,140 vs 2,201 snapshots)
```

Rates carry their sample size, run lengths stay in snapshots not minutes, and your taxonomy persists in `focus-contexts.md` so week two counts what week one did.

## What it needs

- The Littlebird MCP on a Power or Pro plan. Meetings need not be recorded: an unrecorded calendar block counts the same for load arithmetic.
- A few minutes on the first run to confirm the context taxonomy of project and client names.
- Your stated intentions somewhere in capture. Without one, no rabbit hole is named, because the skill will not substitute its own opinion about how you should have spent the week.

## Limits worth knowing

It cannot tell you how many hours you lost, and it will not. No percentage of the day, no productivity score, no focus grade, no cost per switch. Ask for hours and it explains why, then offers structure.

It will not print the "23 minutes to refocus" figure in any framing, including a debunking one. This skill's research sweep fetched the paper it is credited to and confirmed it is not there.

Two points are not a trend. With fewer than four comparable prior reports it describes the change and refuses to name a direction.

It is self-analysis only. It never runs against a colleague or a contractor, compares two people, or produces anything framed for a manager. Health, financial, legal, family and job-search material stays out entirely. The report is private: nothing is sent, posted or shared.

## Related skills

[day-reconstructor](../day-reconstructor/README.md), for what you built rather than how attention moved. [client-health-radar](../client-health-radar/README.md), structure instead of a score. [daily-brief](../daily-brief/README.md), the forward-looking counterpart. [routine-architect](../routine-architect/README.md), when the routine needs reshaping.

## Under the hood

`SKILL.md` carries the retrieval brief, the guardrail and the routine prompt verbatim. The guides under `references/` are `what-snapshots-can-and-cannot-measure.md`, `switch-and-run-detection.md`, `rabbit-hole-identification.md` and `week-over-week-reporting.md`. The arithmetic runs in `scripts/switch_metrics.py`.

`references/research/` holds 14 archived primary sources, including the interruption field studies and the citation audit of the 23 minutes figure. Every domain claim traces to one.
