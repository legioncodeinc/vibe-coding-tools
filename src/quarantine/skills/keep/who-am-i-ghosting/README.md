# who-am-i-ghosting

Finds the conversations you left hanging, ranked by what the silence actually costs rather than by how old it is, with a drafted line for each and permission to drop the dead ones.

## What it does

Sorting unread messages by date gives a list topped by newsletters, cold outbound and a recruiter from March. This ranks on three things instead: how directly the person addressed you, how much the relationship is worth judged from a year of history, and what they were waiting for. Days cold picks the form of the message, not its place in the list.

That is deliberate. More than 90 percent of replies land within a day, so a nine day old thread is already an extreme outlier and a 30 day old one is not meaningfully more of one. The extra 21 days carry almost no information.

You get three lists. What you owe, capped at seven. What you are owed, because half of what feels like ghosting is you waiting on them. And a write-off list, one line each, telling you nothing is owed and you can stop carrying it.

## When to use it

- "Who have I left hanging?"
- "Did I forget to get back to anyone this month?"
- Before you decide you are bad at email.

Just ask. Trigger phrases include "who am I ghosting", "who am I leaving hanging", "what have I not replied to", "unanswered messages", "who is waiting on me", "cold threads", "unreplied DMs".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Weekly routine | Monday 07:30 local | Sweeps 45 days, gates hard, ranks, reports at most five items plus write-offs |
| Deep run | When you ask | Relationship enrichment over 12 months, the full seven-item list, drafted lines |

Weekly, not daily: a daily run would resurface the same items with a one day age change and be ignored inside a fortnight. Enrichment and drafting happen in the deep run, because a routine cannot hold an approval open. The skill creates it for you: it shows the prompt and schedule, you approve.

## What you get

One file, `ghosting-review-YYYY-MM-DD.md`. Eight sections: coverage, you owe them, ball in their court, write off, upcoming, ambiguous, suppressed, method note. Each owed item shows its arithmetic, so you can argue with a number rather than the list:

`Dana Reyes | Slack DM | last message 2026-07-22 | 26 days | Directness 3, Relationship 3, Stake 3 = 9 | draft below`

Suppressed is counts and reasons only, no names. A run that suppressed 79 items and surfaced 5 did its job.

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without it, the skill stops.
- A mail connector, optional but a real upgrade. With Gmail or Outlook connected, real unreplied threads are the spine and capture enriches them.
- A personal voice skill, optional. Re-engagement lines draft through it.

## Limits worth knowing

**The list is a floor, not a census.** Capture sees threads as they appeared on your screen, so one you never opened may be invisible entirely. That caveat goes in every report.

**It is tuned for precision and it will miss things.** Four gates run before scoring and a failing item is dropped, not downgraded. Seven is a cap, not a target. Once you have dismissed the same wrong item three weeks running, you stop opening the report.

**Two hard exclusions.** Newsletters and automated mail never appear. Neither does any thread you are not a participant in, which matters because capture picks up other people's inboxes during a screen share. That one is privacy, not relevance.

**It will not tell you how anyone feels, and it never sends.** No "they are probably annoyed": silence does not support that. Every draft is shown in full, with send, edit, hold, or write off.

## Related skills

- [commitment-tracker](../commitment-tracker/README.md), for promises made in meetings rather than threads.
- [said-it-already](../said-it-already/README.md), to check what you already asked before asking again.
- [client-health-radar](../client-health-radar/README.md), for account-level health, which the owed list feeds.
- [routine-architect](../routine-architect/README.md), when the weekly report repeats or goes unread.

## Under the hood

`SKILL.md` holds the instruction set and the routine prompt. Domain guides in `references/`: `owed-response-detection.md`, `importance-ranking.md`, `natural-close-detection.md`, `re-engagement-drafting.md`. `references/research/` archives 13 primary sources, and every domain claim traces to one.
