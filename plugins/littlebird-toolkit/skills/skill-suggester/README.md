# skill-suggester

Finds the work you have done by hand four times this quarter, checks it against the skills you own, and drafts the SKILL.md for the one worth building.

## What it does

You cannot see your own repeated work. Across 401 professionals, self-reported computer use missed logged use by 32% in the average and 47% in the median individual. Two later studies found the same. Capture is the log.

It sweeps your capture across five signatures: repeated setup work, information moved by hand between applications, a document rebuilt from scratch, a periodic task, and the strongest one, you asking for the same output again. Every candidate carries dated receipts.

The dedupe pass against what you own is the part that matters. Its most honest answer is usually not "build this" but "you already have this one, it just needs better triggering", with your own words quoted back so the description gets fixed.

## When to use it

- You keep rebuilding the same report and it annoys you now.
- A client asked for "the usual thing" again and you did it from memory.
- You want to know if a skill already covers this before you build one.

Just ask. Trigger phrases include "what should I automate next", "what skill should I build", "am I doing the same thing over and over", "I keep doing this by hand", and "find my repeated work".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Candidate watch | Monthly, day 1 at 09:00 | Sweeps 90 and 180 days, three candidates maximum, under 300 words. |
| On demand | After a report | Dedupe, build or skip, ranking, the drafted SKILL.md. |

Run both. Monthly is right because the signal is a pattern across weeks; weekly would send three empty reports for every useful one. The routine detects, the session drafts, since a routine cannot write a file or ask for approval.

It sets that routine up itself: it checks your plan, names the slot, shows you the prompt and schedule, and creates it on approval.

## What you get

`skill-proposals-YYYY-MM-DD.md`, opening with the single thing worth building, or the statement that nothing is, then the threshold and window.

Each candidate is a block: the pattern, signatures fired, "at least N occurrences" with dates, size, dedupe verdict, the call, and confidence. Below that: already covered, covered but not firing, improve rather than build, and skips kept visible.

For the top candidate you also get a validated `drafts/<name>/SKILL.md`, ready to edit.

## What it needs

- The Littlebird MCP on a Power or Pro plan. With no Littlebird tools it stops.
- A session that can list your installed skills. If it cannot, you get observations, no proposals.
- Your confirmation before ranking. "I do that by hand on purpose" closes a candidate for good.

## Limits worth knowing

**It never gives you an hour figure.** Snapshots do not measure duration, so effort comes back as steps, applications, handoffs, and a bounded elapsed span.

**Every count is a lower bound.** It writes "at least 4 occurrences", never "4": capture is sampled and long tasks fragment.

**Zero proposals is a complete result, and most months should look like it.** A tool that recommends automating everything is a bad advisor, so every candidate runs against ten reasons to say no. Rejected candidates stay rejected in a ledger, returning only with new evidence and a note of what changed.

**It suggests and never installs.** Nothing is written into your skills, and description rewrites go to you as text first.

## Related skills

- [routine-architect](../routine-architect/README.md), when the answer is a scheduled watch, not a new skill.
- [sop-forge](../sop-forge/README.md), when the work wants a written procedure instead.
- [said-it-already](../said-it-already/README.md), for repetition in what you send and say.
- [content-repurposer](../content-repurposer/README.md), for one piece of work reshaped across channels.

## Under the hood

`SKILL.md` is the full instruction set: eleven stages and the routine prompt verbatim. Domain guides are `references/pattern-signatures.md`, `references/threshold-and-ranking.md`, `references/dedupe-against-existing-skills.md`, `references/when-not-to-automate.md` and `references/skill-md-drafting.md`.

`references/research/` archives 11 primary sources, and every domain claim traces to one. The recurrence threshold is labelled a convention, not a finding.
