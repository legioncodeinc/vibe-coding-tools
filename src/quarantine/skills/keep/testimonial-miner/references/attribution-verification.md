# Attribution verification

Attribution is guilty until proven innocent (`evidence-standards.md`, rule 4). Nothing enters the
quote bank until every one of the five questions below has an answer with a receipt.

A quote bank is the one artifact in this marketplace where a wrong attribution gets published
under a real person's name. That is why this gate is heavier here than anywhere else.

## The five questions

Every candidate quote answers all five. A candidate that fails any one of them goes to the
Unverified list, not to the bank.

| # | Question | Fails when |
|---|---|---|
| 1 | **Who said it?** | Speaker cannot be identified with a receipt |
| 2 | **Was it about the user?** | The praise may be about someone else |
| 3 | **Were these their exact words?** | The text is a paraphrase, a summary, or an OCR fragment |
| 4 | **When did they say it?** | Only a collection date is available, not a send or utterance date |
| 5 | **What is their role and company, today?** | The title is stale, unverified, or inferred |

## Question 1: who said it

**Messages.** A message tagged `(From:[user])` is the user's own and is not a testimonial. Every
other message in the thread is someone else's, but "someone else in this thread" is not an
attribution. The thread name gives a counterparty, and message items are prefixed
`[Time collected || app || thread name]` (`littlebird-mcp-reference.md`). In a one-to-one thread
the thread name is usually sufficient. In a group thread it is not, and the speaker must be
identified from the message content itself or the candidate is dropped.

**Snapshots.** OCR of a comment shows a display name adjacent to text. Adjacency is not identity:
UI chrome interleaves, and a reply thread nests. Require the name and the praise text to appear
in the same captured block with a visible structural relationship, not merely on the same screen.

**Meetings.** Take the speaker from the meeting summary's `## Decisions` or `## Action Items`
blocks, which carry owner tags, or from an unambiguous self-identification inside the summary.
A raw transcript chunk tagged `[Others]` proves someone said it and not who
(`littlebird-mcp-reference.md`, `evidence-standards.md` rule 4). A meeting compliment with no
summary support and no clear in-transcript context is dropped, no matter how good the line is.

Cross-check the attendee list from the linked calendar event returned by `GET_MEETING`. If the
person you are attributing to was not in the room, the attribution is wrong.

## Question 2: was it about the user

**This is the failure mode the design notes call out, and it is real.** Screen capture shows what
was on the screen. A glowing comment in a captured feed might be:

- praise for a competitor the user was researching
- praise for a peer, a partner, or a supplier
- praise for a post the user shared but did not write
- praise for a mutual client's own announcement
- a template, a testimonial page belonging to someone else, or an ad

Confirm the target before banking. Acceptable confirmations:

| Confirmation | Strength |
|---|---|
| The praise names the user, their company, or their product | High |
| The praise is a direct reply in a thread whose subject is the user's work, and the thread is captured with enough surrounding context to show that | High |
| A meeting summary attributes the outcome to work the user did, and the quote sits inside that topic | High |
| The praise appears under a post the user is confirmed to have authored | Medium, confirm authorship separately |
| The praise is adjacent on screen to the user's name | **Not a confirmation.** Drop or ask. |

Where the target is ambiguous and the quote is strong enough to be worth the interruption, take it
to the user with `AskUserQuestion`, showing the captured text, the receipt, and the two or more
readings. Do not resolve it by choosing the more useful reading
(`evidence-standards.md`, rule 10).

**Praise for the user's team member is not praise for the user, and is not the user's to publish
without that person in the loop.** Flag it, name who it is actually about, and hand it to them.

## Question 3: were these their exact words

The bank stores verbatim text. There are exactly three sources of verbatim text:

1. The message body, as returned
2. The captured comment or review text, as returned, after deduplicating OCR fragments
3. The meeting transcript, as returned

There is one source that is **never** verbatim: a Littlebird activity summary or meeting summary.
Those are paraphrase. A paraphrase can tell you a quote exists and can tell you who said it. It
can never become the quote (`littlebird-mcp-reference.md`).

OCR-specific checks before accepting a snapshot quote:

- Deduplicate repeated identical lines. Treat them as one observation
  (`littlebird-mcp-reference.md`).
- Reject text with interleaved UI chrome that cannot be cleanly separated from the sentence.
  Removing "Like Reply 2h" from the middle of a sentence is reconstruction, not transcription.
- Reject truncated text ending in an ellipsis the platform inserted, or in "See more". A platform
  truncation is not a quote. Go back for the full text or drop it.
- Where a single word is uncertain, do not guess it. Either the sentence survives a trim that
  removes it under the rules in `quote-formatting.md`, or the candidate is dropped.

Transcript-specific check: transcription substitutes words. Where a transcript line carries a
number, a company name, or a superlative that would change the meaning if misheard, mark the
quote Medium confidence at best and confirm the wording with the speaker as part of the permission
request.

## Question 4: when did they say it

The **date said** is the event time, not the collection time. For messages these are different
values and both appear in the item (`littlebird-mcp-reference.md`,
`evidence-standards.md` rule 8). Bank the send date. Put the collection time in the receipt.

Where only a collection date is available, the quote is banked with the date marked
"collected DATE, said on or before that date" and its confidence drops one level. Never present a
collection date as the date said.

**Age matters commercially, not just for accuracy.** A quote about a product version that no
longer exists, or from a person who has since left the company, is a credibility risk rather than
an asset. Flag every quote older than 18 months as stale in the bank, and say what specifically
may have changed.

## Question 5: role and company, today

A stale title next to a name is a small but real credibility hit, and printing a job title can do
more than that: it can convert an ordinary consumer endorsement into an implied expert
endorsement, which carries its own requirement that the person's qualifications actually give them
the expertise represented (`research/distilled-testimonial-practice.md`, section 4, on 255.3).

Procedure:

1. Take the role and company as captured, with a receipt and its date.
2. Check for anything more recent in the window that contradicts it: a signature block, a calendar
   invite, a profile page in a snapshot, an introduction on a call.
3. Where internal capture and an external source disagree, present both and say they disagree. Do
   not pick the more impressive one (`evidence-standards.md`, rule 10).
4. **Confirm the final title with the person as part of the permission request.** This is the
   cheapest verification available and it removes the problem entirely. The permission templates in
   `permission-tiers.md` include the title line for exactly this reason.
5. Where a title cannot be verified, publish the quote without a title rather than with a guessed
   one. A name and a company with no title is credible. A wrong title is not.

Attributing a quote to a company rather than to the named individual who said it implies an
organizational endorsement, which the Guides say must be "reached by a process sufficient to
ensure that the endorsement fairly reflects the collective judgment of the organization"
(`research/distilled-testimonial-practice.md`, section 4, on 255.4). One person's enthusiasm is
not their employer's position. Attribute to the person.

## The bona fide user check

Part 255 requires that where an ad represents that the endorser uses the product, "the endorser
must have been a bona fide user of it at the time the endorsement was given"
(`research/distilled-testimonial-practice.md`, section 4).

So: **was this person actually a client at the time they said it?**

- A paying client, a pro bono client, or someone who completed an engagement: yes.
- A prospect who was impressed on a sales call: no. That is not a testimonial and it does not go
  in the bank. Note it separately as sales feedback.
- A peer praising the user's public content rather than work done for them: not a customer
  testimonial. It can still be useful social proof, but it is banked in a separate category and
  never presented as a client result.
- An employee, contractor, family member or business partner: their praise carries a material
  connection that must be disclosed, and the FTC treats listing an employer on a profile page as
  insufficient disclosure (`research/distilled-testimonial-practice.md`, section 6). Flag the
  relationship on the record. Officers and managers have their own express disclosure duty under
  the Reviews Rule.

## Confidence ratings for the bank

| Rating | Criteria |
|---|---|
| **High** | Named speaker with a receipt, unambiguous target, verbatim text from message or transcript, an event date, and a role confirmed or unpublished |
| **Medium** | One clear observation with a gap: a transcript-only wording, an unconfirmed title, or a collection-only date |
| **Low** | A single item the retrieval scored 3, an OCR reconstruction, or a target confirmed only by adjacency |

**A Low-rated quote is never proposed for publication.** It goes to the Unverified list with the
specific thing that would resolve it. A Medium-rated quote may be proposed only where the
permission request will resolve the gap, and the request must ask about the gap explicitly.

## What the Unverified list is for

It is not a rejection pile. It is a to-do list. Each entry carries: the text as captured, the
receipt, which of the five questions it failed, and the one concrete action that would resolve it.
Most entries resolve with a single message to a person the user already knows.
