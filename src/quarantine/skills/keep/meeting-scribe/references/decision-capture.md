# Decision capture

How to turn a decision the summary already recorded into a record that survives a dispute.

## The problem this solves

The built-in `## Decisions` block gives a paraphrase and a decider tag
(`littlebird-mcp-reference.md`). That is enough to remember that something was decided. It
is not enough to settle an argument about what was decided, because the paraphrase is the
summarizer's reading, and the summarizer sometimes fills a gap with an incorrect guess
rather than marking it unclear
(`research/distilled-meeting-followup.md`, section 4).

The foundational complaint about meeting records is exactly this: minutes "are sketchy,
represent only one person's point of view, and usually lack the energy and context of the
conversations they were meant to capture"
(`research/distilled-meeting-followup.md`, section 2). A verbatim quote with a timestamp
does not have a point of view. That is the whole trick.

## The decision entry

Nine fields. The first six are mandatory and an entry missing any of them does not ship.

| # | Field | Rule |
|---|---|---|
| 1 | Decision | Verbatim from the `## Decisions` block. Not tightened, not corrected. |
| 2 | Decided by | The decider tag from the summary. Never from a transcript chunk. |
| 3 | Meeting and date | From the summary header. |
| 4 | Evidence quote | Exact wording from the transcript, the passage where the decision was reached. |
| 5 | Timestamp | The transcript position of that quote. |
| 6 | Status | `standing`, `superseded`, or `contested`. Explicit, never implied. |
| 7 | Context | Why this came up, in value-neutral language. From `## Topics Discussed`. |
| 8 | Alternatives | What was considered and rejected, where the transcript shows it. Otherwise `none recorded`. |
| 9 | In the room | The attendee list from the linked calendar event. |

Fields 6, 7, 8 and 9 are the ones the built-in summary does not give you. Status and
context come from decision record practice, where status carries explicit values of
proposed, accepted, deprecated or superseded, and context is written in value-neutral
language (`research/distilled-meeting-followup.md`, section 2). Alternatives and
contributors come from conventional decision-log field lists, which include both and which
the Littlebird summary omits (`research/distilled-meeting-followup.md`, section 2).

Keep entries short. "Nobody ever reads large documents, either. Those documents are too
large to open, read, or update. Bite sized pieces are easier for all stakeholders to
consume" (`research/distilled-meeting-followup.md`, section 2).

### The one honest caveat about the format

Decision record practice was built for software architecture decisions recorded by the team
that made them, not for business decisions reached verbally with an external party
(`research/distilled-meeting-followup.md`, section 2). The format transfers. The setting
does not. Do not tell the user this is standard practice for their kind of meeting.

## Getting the quote and the timestamp

This is the only routine reason to fetch a transcript.

1. Take the decision text from the summary's `## Decisions` block.
2. Call `LB_INTERNAL_GET_MEETING_TRANSCRIPT` once for the meeting. Once, not per decision.
3. Locate the passage where the decision was reached. Search on the distinctive nouns in
   the decision text, not on the whole sentence, because the summary paraphrased it and the
   sentence will not match.
4. Quote the passage exactly, including the disfluencies. Do not clean it up. A cleaned
   quote is a paraphrase wearing quotation marks, and a reader who checks it will find it
   does not match.
5. Record the timestamp of the passage.

### Attribution, restated

The quote proves the WORDS. The summary's decider tag proves WHO. Raw transcript chunks are
weakly diarized and frequently tagged `[Others]` (`littlebird-mcp-reference.md`), so a chunk
never establishes a speaker.

Write the entry so this is visible. The decider line cites the summary block. The quote line
cites the transcript position. They are two receipts for two different facts, and merging
them into one confident attribution is the defect this file exists to prevent.

### When the quote cannot be found

Three real cases, three different handlings.

| Case | Handling |
|---|---|
| The transcript passage exists but is garbled or partly inaudible | Quote what is legible, mark the gap in the quote, and set confidence Medium (`evidence-standards.md`, rule 3). |
| No passage corresponds to the decision at all | Record the entry with `evidence quote: not located in transcript`, set confidence Low, and tell the user. A decision the summary reports and the transcript does not support is worth a question, because summaries do fabricate (`research/distilled-meeting-followup.md`, section 4). |
| The passage contradicts the summary's rendering | Report both, verbatim, and say they disagree. Do not pick one (`evidence-standards.md`, rule 10). |

A Low-confidence decision entry never goes into an outbound draft. It goes to the user with
the question attached.

## Status, and why the old entry stays

Three values.

**`standing`.** The decision as recorded, not modified since.

**`superseded`.** A later decision replaced it. Keep the old entry and mark it superseded,
with a pointer to the entry that replaced it. Deleting it destroys the fact that a
different decision was once current
(`research/distilled-meeting-followup.md`, section 2), and that is precisely the fact a
later dispute turns on. The record has to hold both: a decision WAS made, and it is no
longer the current one.

**`contested`.** Someone disputed it, in the meeting or afterward. A contested entry carries
both readings verbatim with their receipts and takes no side.

### Detecting supersession within a run

This skill handles one meeting. It sees supersession only when the same meeting reversed
itself, which happens: a decision reached at minute 12 and unwound at minute 40. Check for
it by scanning the transcript after the decision quote for a reversal on the same subject.

Cross-meeting supersession, where a decision made in March is overturned in August, is not
this skill's job. It belongs to the standing decisions log maintained by
`commitment-tracker`. Hand the entry over and let the ledger detect the conflict.

## What a decision record is actually for

The stated purposes are communicating to stakeholders, defending a choice when it is
questioned, reminding a team of the agreed course so it is not re-litigated, and supplying
history for future planning (`research/distilled-meeting-followup.md`, section 2). The
defensibility purpose is the honest one and it is the one this skill optimizes for.

**Be honest about the evidence.** No source in the archive establishes that keeping a
decision log improves outcomes; the claim is asserted rather than tested
(`research/distilled-meeting-followup.md`, sections 2 and 7). The one quantified return in
the archive is a single 1997 software team, self-calculated, reported by the method's own
author (`research/distilled-meeting-followup.md`, section 2). Do not open a decision record
with a statistic about how much decisions cost when they are forgotten. There is no such
statistic in this archive.

## What ships where

A decision entry appears in up to three places, and it is not the same entry in each.

| Destination | What goes | Why |
|---|---|---|
| Internal decisions record | All nine fields, including the quote and the timestamp | This is the durable artifact |
| Outbound draft to attendees | The decision text and who decided, in plain prose | The recipients were there. They do not need a transcript timestamp, and quoting the call back at them is a disclosure event, see below |
| Handoff to `commitment-tracker` | Decision text, decider, date, status | The ledger holds the standing decisions log |

### Quoting the call in an outbound message

Putting a verbatim transcript quote in a message to attendees tells every recipient that the
call was recorded and transcribed. No jurisdiction treats a visible recording bot in the
participant list as sufficient notice on its own
(`research/distilled-meeting-followup.md`, section 6), so a recipient may genuinely not
know.

Before including any verbatim quote in an outbound draft, surface this to the user with
`AskUserQuestion`: including the quote makes the recording explicit to everyone who reads
it. Offer to state the decision in plain prose instead, which is the default.

The skill gives no legal advice, does not determine jurisdiction, and does not tell the user
whether their recording was lawful. The two best sources in the archive disagree about which
states require everyone's agreement, and the disagreement is unresolved
(`research/distilled-meeting-followup.md`, section 6). The skill surfaces the fact and the
user decides.
