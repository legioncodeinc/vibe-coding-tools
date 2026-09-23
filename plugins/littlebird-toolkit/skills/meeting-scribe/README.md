# meeting-scribe

Turns one recorded Littlebird meeting into a sendable follow-up, a decisions record with the quote behind each decision, and a list of what never landed.

## What it does

Littlebird already writes you a meeting summary, with Decisions, Action Items tagged by owner, and a private For You section. Another summary is worthless. This produces four things that summary does not.

An outbound artifact: a recap written for the recipients, filtered before drafting so the For You block, internal observations and pricing they should not see never leave the building. Forwarding the built-in summary to a client is a mistake with no undo. Decision durability: each decision anchored to the exact wording and timestamp behind it, so a disputed "we agreed X" is settled by evidence. The unresolved list, whose valuable tier is the question that got asked, then talked over, that nobody parked because nobody registered it. And a recipient split when the room held two sides, so the partner and your team get different recaps.

Attribution comes from the summary's structured blocks, never from raw transcript, which is weakly diarized and often tagged Others. An email telling four people a named person promised something they did not is unrecallable.

## When to use it

- The call just ended and you owe someone a recap.
- Two people remember the decision differently and you need the receipt.
- Something got raised on that call and you cannot recall what came of it.

Just ask for it. Trigger phrases include "write the follow-up", "recap that call", "draft the follow-up email", "what did we decide", "send a recap to the client", "what did we not resolve".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Evening sweep | Daily, 18:00 local | Today's meetings, decisions and action items verbatim, and which need a follow-up |
| On demand | Right after a call | Decisions with quotes, the filtered recap held for approval, the unresolved list |

Run both. The sweep escalates a meeting it has flagged three times rather than repeating itself, and drafting happens on demand because a routine cannot hold an approval gate open. The skill creates that routine itself: it shows you the prompt and schedule, you approve.

## What you get

One file, `meeting-followup-YYYY-MM-DD-slug.md`, in your working directory. Seven sections: coverage, decisions, outbound drafts, filter report, unresolved, commitment handoff, gaps. Each decision carries nine fields. Each filter line names the item and the category it matched. A tier 3 row:

`3 | "who is actually signing this off?" | 00:24:31 | Medium | unowned | ask before the next call`

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without it, the skill stops.
- A recorded meeting with a linked calendar event. No event means no attendee list, so the recipient split cannot run. The rest still does.
- A personal voice skill, optional. The recap drafts through it if installed.
- An email connector, optional. Without one, you get a copy-paste block.

## Limits worth knowing

**It drafts and holds. It never sends.** Nothing reaches an attendee without you approving the actual final text, even with a mail connector in the session.

**The talked-over scan is the valuable tier and the one with no established method behind it.** Those rows carry a confidence rating and the weak ones stay out of the draft.

**No legal advice about recording.** A verbatim quote tells recipients the call was recorded, and a visible bot in the participant list is not sufficient notice anywhere. It asks first, and offers plain prose.

## Related skills

- [commitment-tracker](../commitment-tracker/README.md), for the standing ledger across all meetings.
- [pre-call-prep](../pre-call-prep/README.md), the other half of the cycle, before the call.
- [who-am-i-ghosting](../who-am-i-ghosting/README.md), when the question is who is waiting on you.
- [littlebird-voice-creator](../littlebird-voice-creator/README.md), to build the voice the recap drafts through.

## Under the hood

`SKILL.md` carries the full instruction set and the routine prompt. Domain guides in `references/`: `beyond-the-builtin-summary.md`, `decision-capture.md`, `recipient-aware-recaps.md`, `unresolved-detection.md`. `references/research/` archives 13 primary sources, and every domain claim traces to one of them.
