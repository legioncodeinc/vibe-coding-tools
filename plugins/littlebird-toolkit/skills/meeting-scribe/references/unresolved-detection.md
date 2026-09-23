# Unresolved detection

Finding what was raised and never landed.

## What the built-in summary already gets

`## Risks / Open Questions` captures the questions the summarizer recognized as open
(`littlebird-mcp-reference.md`). Those are the easy ones: a question the room acknowledged
as unanswered, usually because someone said out loud that it was unanswered.

Reproducing that block is not a deliverable. The valuable move is the tier the summary
misses.

## Three tiers

| Tier | What it is | Where it comes from | Detection cost |
|---|---|---|---|
| **1. Acknowledged open** | The room knew it was open | `## Risks / Open Questions` | Free, already in the summary |
| **2. Explicitly parked** | Deferred on purpose, "let's take that offline" | Summary plus a transcript scan | Cheap |
| **3. Talked over** | Asked, not acknowledged, buried by the next topic | Transcript only | Expensive, and this is the one that matters |

Tier 3 is where things quietly die. Nobody parked it, because nobody registered it. It is
not in the summary, because the summarizer had nothing to register either.

The framing that makes tier 2 and tier 3 the same object: a deferred item is a live
obligation, and deferral without a return path is a social cost rather than a neutral act.
"Parking lots should offer outlines for future discussion, research, or meetings. If they do
not inform future action, they become only a way to kindly tell someone that their
contribution is worthless" (`research/distilled-meeting-followup.md`, section 3).
Independently, the organizational memory literature lists the open questions among the
things that must be captured alongside a decision rather than filed separately
(`research/distilled-meeting-followup.md`, section 3). Two fields, three decades apart, both
treating the unresolved item as first-class.

## Tier 1: harvest

Take `## Risks / Open Questions` verbatim from the summary. Split it, because that block
mixes two different things:

- **Risks.** Statements about what could go wrong. Many are internal-only and get stripped
  from any outbound draft (`recipient-aware-recaps.md`).
- **Open questions.** Actual unanswered questions. These carry forward.

Keep the verbatim wording. Do not tidy a question into a cleaner question; the user has to
recognize it.

## Tier 2: explicitly parked

Fetch the transcript once (`LB_INTERNAL_GET_MEETING_TRANSCRIPT`) and scan for deferral
language. The signal phrases, and they are reliable because they are formulaic:

- "let's take that offline"
- "we'll come back to that"
- "park that"
- "let's put a pin in it"
- "that's a separate conversation"
- "we'll deal with that next time"
- "I'll follow up on that separately"

For each hit, capture the subject being deferred, the exact deferral phrase, and the
timestamp.

Then check whether the room actually came back. Scan the remainder of the transcript for the
subject's distinctive nouns. If it reappears and resolves, it is not unresolved. If it never
reappears, it is a tier 2 item.

Cross-check against the summary's action items. A parked topic that produced an action item
is handled and drops out of this list. A parked topic that produced nothing is the finding.

## Tier 3: talked over

This is a heuristic scan of the transcript, and it is the part with no documented method
behind it.

**State the limitation up front, in the output.** The research archive covers items a
facilitator explicitly parked and contains nothing on the question that was asked and never
acknowledged (`research/distilled-meeting-followup.md`, sections 3 and 7). What follows is
engineering judgment applied to a transcript. It will miss things and it will produce false
positives. The output says so.

### The scan

1. **Find the questions.** Locate interrogatives in the transcript: lines ending in a
   question mark, and lines opening with who, what, when, where, why, how, can we, should
   we, do we, is there, what about, what happens if.
2. **Read forward from each one.** Take roughly the next 8 to 12 exchanges.
3. **Classify what happened next.**

| Pattern in the following exchanges | Classification |
|---|---|
| A substantive response addressing the question's subject | Answered. Drop it. |
| An explicit deferral phrase | Tier 2, not tier 3. Move it. |
| A topic change with no response to the question's subject | **Tier 3 candidate.** |
| Another speaker starting mid-question, then the subject never returning | **Tier 3 candidate, strong.** |
| A partial response that addresses a nearby but different subject | **Tier 3 candidate, weak.** Flag as partial. |

4. **Confirm the subject never returns.** Scan the rest of the transcript for the question's
   distinctive nouns. Reappearance and resolution later in the call removes it.
5. **Rate confidence** per `evidence-standards.md`, rule 3. A clean topic change immediately
   after a direct question is Medium. A partial or ambiguous response is Low.

### The two failure modes, both worth naming

**False positives.** Rhetorical questions, questions the speaker answers themselves in the
next breath, and questions answered nonverbally by a nod or a shared screen that the
transcript did not capture. Transcripts do not record agreement that was not spoken.

**False negatives.** The scan needs a recognizable interrogative. A concern raised as a
statement, "I'm not sure the timeline works," is exactly the kind of thing that gets talked
over and it will not match. The scan misses it. Say so.

### The attribution constraint

Tier 3 items come from raw transcript, which is weakly diarized and frequently tagged
`[Others]` (`littlebird-mcp-reference.md`).

Therefore: **a tier 3 item is reported as a question the meeting did not answer, never as a
question a named person asked.** Quote the wording. Do not name the asker. If the user wants
to know who asked, they can open the recording, and the item tells them the timestamp so
they can.

This also means tier 3 items are weak candidates for an outbound draft. Sending "someone
asked X and it never got answered" to four attendees, when the skill cannot say who asked,
is thin. Default to holding tier 3 items internally and offering them to the user as things
to raise, rather than putting them in the recap.

## Output shape

One list, three tiers, in order. Each row:

| Field | Rule |
|---|---|
| Tier | 1, 2, or 3 |
| Item | Verbatim wording, question or topic |
| Timestamp | Transcript position, for tiers 2 and 3 |
| Deferral phrase | Tier 2 only, verbatim |
| Confidence | Tier 3 only, Medium or Low |
| Owner | Only where the summary assigned one. Otherwise `unowned` |
| Suggested next step | One line: who should answer it, and by when |

The owner and the next step are the point. Deferred items get an owner and a timeline using
the who-does-what-when frame, and items carry into the follow-up so accountability survives
the meeting (`research/distilled-meeting-followup.md`, section 3). An unresolved list with
no owners is a second parking lot, which is the failure this file exists to prevent.

Where an item has no owner, say `unowned` and offer it to the user as a decision: claim it,
assign it, or drop it deliberately. Do not guess an owner
(`beyond-the-builtin-summary.md`).

## What goes outbound

| Tier | Default |
|---|---|
| 1, open questions | Include in the outbound draft. The room already knows these are open. |
| 1, risks | Strip. Internal risk framing is not a recap (`recipient-aware-recaps.md`). |
| 2 | Include, as "we said we would come back to X," with a proposed owner and date. This is the strongest use of the whole list: it converts a soft deferral into a scheduled item. |
| 3 | Hold internally by default. Offer to the user as things to raise. Include only where the user explicitly approves the specific item, and never with an asker named. |

## Empty result

A meeting with no open questions, no deferrals, and no talked-over candidates is a real
outcome and a good one. Report it as such: state the three scans that ran and that each came
back empty. Do not manufacture an item to fill the section
(`evidence-standards.md`, rule 9).
