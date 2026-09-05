# Decisions log

The quiet half of the ledger. Commitments answer "who owes what". Decisions answer "what
did we already settle", which is the question that gets re-litigated in month three of
every project.

`LB_INTERNAL_GET_MEETING` returns a `## Decisions` block, each entry tagged with who
decided (`littlebird-mcp-reference.md`). Harvesting it costs nothing extra
because the summary is already fetched for the commitment pass.

---

## What a decision log entry contains

| Field | Rule |
|---|---|
| Decision text | Verbatim from the `## Decisions` block. Never paraphrased. |
| Decided by | The tag on the entry. Never inferred from the transcript. |
| Meeting | Name. |
| Date | Meeting date. This is the timestamp that settles arguments. |
| Attendees | From the calendar event returned by `GET_MEETING`, so the reader can see who was in the room. |
| Supporting quote | Optional. A raw transcript line, quoted for wording only. |
| Status | `standing`, `superseded`, or `contested`. |
| Receipt | `[Meeting name, YYYY-MM-DD, Decisions]` |

## The one place raw transcript is allowed

A decision entry may carry one supporting quote pulled from
`LB_INTERNAL_GET_MEETING_TRANSCRIPT`, because the exact phrasing of a decision sometimes
matters more than the summary's compression of it.

The rule that governs it is the same one that governs everything else here: the quote
proves **wording**, never **who said it**. Attribution stays on the `Decisions` tag.
Diarization error runs at 11 to 13 percent, so a transcript line saying who decided
something is a line that is wrong roughly one time in eight
(`research/distilled-commitment-tracking.md`, section 4).

Present a supporting quote like this, with the attribution deliberately absent from the
quote line:

```
Decision: Ship the partner integration before the pricing change.
Decided by: Ofer  [Partnership sync, 2026-08-03, Decisions]
Wording from transcript: "we do the integration first and then we touch pricing,
otherwise nobody knows what they bought"  (transcript wording only, speaker not verified)
```

That parenthetical is not decoration. Without it a reader will assume the quote is
attributed, and the transcript layer cannot support that.

## Detecting supersession

A decision log is worth keeping only if it stays current. On every run, compare new
decisions against the standing log.

Two decisions conflict when they cover the same subject and prescribe different outcomes.
When that happens:

- Mark the **older** entry `superseded`, with the date and meeting of the decision that
  replaced it.
- Keep the superseded entry in the log. Do not delete it. The history of a reversal is
  frequently the thing being argued about.
- Where the newer decision was made by a different person or a different set of
  attendees, say so plainly. A decision reversed by people who were not in the original
  room is a fact worth surfacing, and it is not the skill's job to editorialize about it.

Where the conflict is genuinely ambiguous, mark **both** entries `contested` and present
both readings. Do not resolve it by picking the more recent one, and do not resolve it by
picking the more interesting one (`evidence-standards.md`, rule 10).

## Decisions with no follow-on action

Compare the `## Decisions` block against the `## Action Items` block for the same meeting.
A decision that changes something but produced no action item is a gap worth naming.

This maps to a documented extraction pattern: decisions with an explicit stated follow-on
action extract cleanly, and follow-ups that nobody said out loud produce nothing at all,
even though "implicit actions are often the consequential ones"
(`research/distilled-commitment-tracking.md`, section 5).

So the skill flags it and asks rather than inventing the missing item:

```
Decision with no action item: "Move the launch to September."
[Partnership sync, 2026-08-03, Decisions]
No corresponding entry in Action Items for this meeting.
Question for you: did this need a follow-up that nobody named in the room?
```

Never fabricate the missing action item. The skill harvests what the summary recorded, it
does not detect commitments nobody stated
(`harvesting-commitments.md`, step 8).

## Open questions

The `## Risks / Open Questions` block gets the same light treatment
(`littlebird-mcp-reference.md`). An open question is a decision that has not
happened yet, and it ages the same way a commitment does.

Carry each open question with its meeting, date, and age. An open question past 14 days
either got answered somewhere the skill did not look, or it is quietly blocking something.
Either way it belongs in front of the user, framed as a question rather than as a problem.

## What the decisions log is for

Two uses, both mechanical:

1. **Settling "we agreed X".** A decision with a verbatim quote, a decider, a date, and a
   room roster is checkable. The argument ends or moves on to whether the decision was
   right, which is the better argument to be having.
2. **Grounding a nudge.** A tier 2 nudge that cites the decision the deliverable came from
   lands differently than one that cites only the promise
   (`escalation-and-nudges.md`).

## What it is not for

It is not a performance record. Do not compute per-person decision reversal counts, do not
rank people by how often their decisions get overturned, and do not carry decisions about
people rather than about work. Purpose-bound collection applies here as everywhere
(`evidence-standards.md`, rule 10), and sensitive categories stay out of the
log even where the capture contains them.
