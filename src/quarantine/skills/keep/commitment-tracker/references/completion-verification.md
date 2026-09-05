# Completion verification

Harvesting commitments is the easy half. This is the half nobody does: going back and
checking whether the thing actually happened.

The whole guide rests on one distinction, and getting it wrong turns a useful ledger into
an accusatory one:

> **"No evidence it was done" is not "it was not done."**

Absence of evidence in Littlebird's capture means the skill looked in a lossy record and
did not find a trace. Screen capture is periodic. It misses whatever happened between
snapshots, whatever happened on a phone, and whatever happened in a system the user never
opened on the captured machine. Never silently convert an absence into a negative finding
(`evidence-standards.md`, rule 2).

The interpersonal version of the same rule, from the follow-up literature: "just because
someone hasn't responded to your initial request, it doesn't mean their answer is 'no.'"
(`research/distilled-commitment-tracking.md`, section 6).

---

## The four statuses

Every ledger row ends at exactly one of these. There is no fifth.

| Status | Meaning | Requirement |
|---|---|---|
| `Done` | Downstream evidence found that the deliverable exists or the action occurred | At least one receipt, confidence High or Medium |
| `In motion` | Evidence of work toward it, but not of completion | At least one receipt |
| `No evidence` | The skill searched and found nothing either way | The queries run are listed |
| `Overdue, no evidence` | Same as above, but past the stated deadline or past the age threshold | The queries run, plus the age |

`Overdue` is a timing fact, not a verdict on the person. Write it as `Overdue, no
evidence`, never as `Not done` and never as `Missed`.

## What counts as downstream evidence

Verification means searching for the artifact the commitment would have produced. Work
backwards from the deliverable.

| Commitment shape | Evidence to search for |
|---|---|
| "I'll send you the deck" | an attachment or a file name in a message thread, the deck open on screen, a send confirmation |
| "I'll introduce you to X" | a thread containing both names, a calendar invite with X, X appearing in a later meeting roster |
| "I'll get you pricing" | a document, an invoice, a pricing page or quote on screen, a number quoted back in a later meeting |
| "We'll schedule a follow-up" | a calendar event in `LIST_MEETINGS` with a future or past date matching |
| "I'll review the contract" | the document open on screen, redlines, a message referencing the review |
| "I'll set up the account" | a login screen, a welcome email, the tool appearing on screen for the first time |

The pattern: name the artifact first, then search for the artifact. Searching for the
commitment text again just re-finds the meeting where it was made.

## The verification sweep

Run these in order for each open item. Stop as soon as one produces High-confidence
evidence.

### 1. Later meetings, by topic

`LB_INTERNAL_SEARCH_MEETINGS` with `query` set to the deliverable, `start_date` set to the
day after the origin meeting, `end_date` set to today.

The strongest possible closing evidence is somebody confirming completion in a later
meeting summary. It is on the record, it is attributed, and it does not depend on OCR.

Do not filter by `attendees` here. That filter is an OR filter, is best-effort over the
top candidates only, and can miss a matching meeting entirely
(`littlebird-mcp-reference.md`). If the expected meeting does not appear,
reword `query` instead.

### 2. Later instances of the same recurring meeting

Where the commitment came from a standup or a 1:1, call `LB_INTERNAL_LIST_MEETINGS` with
`name` set to that meeting title, windowed after the origin date. Then `GET_MEETING` on
each later instance and check whether the item reappears in its `## Action Items` block.

This is the single highest-value check the skill runs, because it answers the question
nobody else answers: did last week's commitment survive into this week, or did it quietly
disappear?

Three outcomes, three meanings:

- **It reappears with the same owner.** Not done, and everyone in the room knows it. The
  restatement count goes up and the age keeps running from the original date.
- **It stopped appearing and something confirms delivery.** Closed. Cite the confirmation.
- **It stopped appearing and nothing confirms delivery.** This is the interesting one.
  The item did not get done, it got dropped. Surface it explicitly as
  `dropped from the agenda, no completion evidence`. That is a different and more useful
  finding than a plain `No evidence`.

### 3. Screen and message capture

`search_user_context` with parallel narrow queries. Five specific queries beat one broad
query and avoid the oversized-result file dump
(`littlebird-mcp-reference.md`).

Construct queries around the artifact, not the promise:

```
search_queries:          ["<deliverable noun> <counterparty name>",
                          "<project name> <artifact type>",
                          "<tool or system the work happens in>"]
search_queries_messages: ["<counterparty name> <deliverable noun>",
                          "sent <deliverable noun>"]
date_range:              {"start": "<day after origin>", "end": "now"}
```

Set `filters.data_source` deliberately: `messages` for anything that would have been sent,
`snapshots` for anything that would have been worked on, `summaries` for the cheapest
compressed view of a day (`littlebird-mcp-reference.md`).

Read the relevance scores. Anything scoring 3 is a maybe, and a single 3-scored item never
closes a commitment on its own (`littlebird-mcp-reference.md`).

### 4. Prove absence, deliberately

Where the deliverable would live in a specific application, run a query with
`filters.app` set to that application across the window since the origin date. A negative
answer to "did this application appear on screen at all since the commitment" is a real,
reportable finding (`littlebird-mcp-reference.md`).

Report it as an absence, with the filter used, so the reader can judge it:

```
No evidence. Searched screen capture for "invoice" and "billing portal" filtered to
chrome, 2026-07-14 through 2026-08-17, plus message threads mentioning Ofer and invoice.
Nothing returned above score 3.
```

That paragraph is the whole point of the skill. It shows the work, which is what makes the
absence credible and keeps it from reading as an accusation.

## Confidence, applied to closure

Rate every `Done` (`evidence-standards.md`, rule 3):

| Rating | What closes an item at this level |
|---|---|
| **High** | A later meeting summary confirms it, or an unambiguous primary artifact exists (an invoice, a calendar invite, a sent attachment) |
| **Medium** | One clear screen or message observation with no corroboration |
| **Low** | A single item the retrieval scored 3, an OCR fragment, or ambiguous UI |

**A Low-confidence observation never closes an item.** Leave it at `No evidence` and note
the weak signal underneath, so the user can confirm it in one glance rather than trusting
it silently. A Low-rated claim never drives an irreversible action
(`evidence-standards.md`, rule 3), and marking someone's commitment complete on
a fragment is exactly how a ledger loses the user's trust.

## The attribution guardrail, applied to evidence

Screen capture shows what the user was **viewing**, not what they **wrote**
(`evidence-standards.md`, rule 4). This bites hard here.

- Seeing a document on screen proves the user looked at it. It does not prove the user
  wrote it, sent it, or finished it.
- A message tagged `(From:[user])` is the user's. Everything else in the thread is not.
- Seeing the counterparty's deliverable on screen is good evidence they delivered it,
  because receipt is the thing being verified. This direction is safer than the other.
- A draft in a compose box is not a sent message. Do not close an item on a draft.

## Aging buckets

Age runs from the origin date, which for a merged recurring item is the earliest
appearance, not the most recent restatement (`harvesting-commitments.md`, step 6).

| Bucket | Age | Treatment |
|---|---|---|
| Fresh | 0 to 7 days | List it. No action prompted. Below the observed 3 to 5 business day first-follow-up interval. |
| Aging | 8 to 14 days | List it. Prompt a first nudge for the owed-to-me column. |
| Escalate | 15 days and older | Different channel, different framing. See `escalation-and-nudges.md`. |

The bucket boundaries derive from the observed follow-up intervals of 3 to 5 business days
for a first touch and 7 to 14 days for a second
(`research/distilled-commitment-tracking.md`, section 6). Those figures come
from cold-outreach data and are weak evidence for colleague follow-up, which is why the
buckets are coarse and why the 14-day line triggers a change in approach rather than a
precise scheduled action.

An item with a stated deadline uses the deadline instead of the age threshold. A deadline
that passed yesterday is `Overdue, no evidence` even at three days old.

## Computing the one statistic the skill is allowed to quote

Report a completion rate only from the user's own ledger:

```
Window: 2026-07-20 to 2026-08-17
Meetings recorded: 11 of 14 (3 calendar events were not recorded)
Items harvested: 34 (owed by me 19, owed to me 11, unassigned 4)
Closed with evidence: 12 (High 8, Medium 4)
In motion: 5
No evidence: 17
```

Never open the report with an industry statistic about how many action items get
forgotten. Every circulating figure for that claim traces back to unsourced content
marketing (`research/distilled-commitment-tracking.md`, section 1). The user's
own numbers have receipts. Nobody else's do.

## When verification finds nothing at all

If the verification sweep returns nothing for every open item, that is a legitimate
result, not a failure to try. Report the items, mark them all `No evidence`, list the
queries run, and say that the window produced no downstream signal. Do not manufacture
partial credit (`evidence-standards.md`, rule 9).
