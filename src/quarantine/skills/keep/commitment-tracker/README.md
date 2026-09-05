# commitment-tracker

A two-column ledger of what you owe and what you are owed, harvested from your meeting summaries and checked against evidence that the thing actually got done.

## What it does

Every Littlebird meeting summary already ships an Action Items block with an owner tag on each line, plus Decisions and open questions. Nobody harvests it. In the account this was validated against, one 30 minute partnership call produced four action items, two tagged Unassigned, and none of it went anywhere.

This harvests all of it across every recorded meeting in a window and sorts it into two columns: owed by me, owed to me. Then the part nobody does. For each open item it searches your downstream screen and message record for the artifact the commitment would have produced, not the commitment text again.

Then it ages each item and escalates. At 15 days it does not repeat last week's nudge: it changes channel and framing and asks for a date rather than the deliverable, and for things you owe it forces a choice, do it, renegotiate, or drop it and say so. Age runs from the day it was first committed, not the last time a recurring meeting restated it.

## When to use it

- "What did I promise last month and never do?"
- "Who owes me something and has gone quiet?"
- "What fell through the cracks while I was heads down?"

Just ask. Trigger phrases include "what did I promise", "what do people owe me", "who owes me what", "did I follow up", "open action items", "what fell through the cracks", "chase my follow-ups".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Weekly routine | Monday 08:00 local | Harvests 7 days plus carry-forward, ages everything, escalates. A report, no files |
| Deep run | When you ask | Last 30 days, or 90 on a first backfill. The ledger file plus drafted nudges |

Run both. The routine reads its own past reports so it escalates instead of restating; a version without that flagged the same blocked contact 16 days straight. Verification and drafting happen in the deep run, because a routine cannot hold an approval open. The skill creates the routine itself: it shows you the prompt and schedule, you approve.

## What you get

One file, `commitment-ledger-YYYY-MM-DD.md`. Sections: coverage, owed by me, owed to me, unassigned, decisions log, open questions, statistics. A row in the owed-to-me column:

`"Sam sends the revised SOW" | Partner sync, 2026-07-14 | 34 days | restated 3x | no deadline | No evidence | tier 3 nudge drafted below`

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without it, the skill stops.
- Recorded meetings. Calendar events with no recording are not searchable, and the count is reported as a coverage gap.
- A personal voice skill and a messaging connector, both optional. Nudges draft through the voice skill if one is installed; without a connector you get a copy-paste block.

## Limits worth knowing

**No evidence it was done is not the same as it was not done, and the ledger reports the first.** Work in a tool your capture never saw, or confirmed on a call nobody recorded, is still done. Every absence names the queries and window behind it. A nudge on a false negative tells someone they dropped something they actually delivered.

**Attribution comes only from the summary's owner tags.** Raw transcript is weakly diarized and state of the art speaker labelling runs 11 to 13 percent error. An item tagged Unassigned stays Unassigned, in a third list for you to claim, assign or discard.

**It drafts nudges and holds them. It never sends.** You see the item, its age, the evidence behind its status and the full draft text before anything moves. Approving a plan is not approving the words.

## Related skills

- [meeting-scribe](../meeting-scribe/README.md), for a sendable recap of one call rather than the ledger.
- [who-am-i-ghosting](../who-am-i-ghosting/README.md), for unanswered threads where nothing was promised.
- [weekly-review](../weekly-review/README.md), which rolls this ledger into the whole week.
- [routine-architect](../routine-architect/README.md), when the weekly report repeats or goes unread.

## Under the hood

`SKILL.md` holds the full instruction set and the routine prompt. Domain guides in `references/`: `harvesting-commitments.md`, `completion-verification.md`, `escalation-and-nudges.md`, `decisions-log.md`. `references/research/` archives 12 primary sources, and every domain claim traces to one.
