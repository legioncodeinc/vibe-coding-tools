# History retrieval

Pulling the last conversation, the open loops, and the prior objections out of the
record. This is the part of the brief that no calendar and no CRM can produce, and it is
the named gap in the current AI prep tool category
[research/distilled-call-preparation.md section 8].

## The one retrieval mistake that matters most

**A meeting lookup by NAME uses `LB_INTERNAL_LIST_MEETINGS` with `name`. A meeting lookup
by TOPIC uses `LB_INTERNAL_SEARCH_MEETINGS` with `query`. Using the wrong one is the most
common retrieval mistake against this server** [littlebird-mcp-reference.md].

A recurring meeting's prior instance shares the TITLE. It is found by name, not by topic.
Searching `SEARCH_MEETINGS` for "Weekly sync" returns transcript chunks about the word
sync from unrelated calls, ranked by relevance rather than date
[littlebird-mcp-reference.md], and will silently miss the actual prior
instance. Get this one right.

## Step 1: the prior instance, by title

For every upcoming meeting, run this first:

```
LB_INTERNAL_LIST_MEETINGS
  name:       "<exact upcoming meeting title>"
  start_date: <today minus 180 days>
  end_date:   <today>
  limit:      10
```

Returns reverse-chronological [littlebird-mcp-reference.md], so entry one is
the most recent prior instance.

If the exact title returns nothing, retry once with the title's distinctive substring,
dropping instance markers such as a date, a week number, or a sequence number. "Q3
Planning Sync (Week 6)" retries as "Q3 Planning Sync". Do not retry with a single generic
word.

Entries WITH an id are recorded and carry a summary and transcript. Entries WITHOUT an id
are calendar events that were never recorded [littlebird-mcp-reference.md].
Both matter. A prior instance that exists on the calendar but was never recorded is a
real finding and the brief says so:

```
**Last instance:** 2026-08-10, on the calendar but not recorded. No transcript or summary
available. Nothing quotable from it.
```

## Step 2: per-attendee history, by topic and person

For each attendee resolved to High or Medium confidence
(see `attendee-resolution.md`):

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      "<person name> <company name>"
  start_date: <today minus 365 days>
  end_date:   <today>
  limit:      10
```

Run a second, narrower pass scoped to the subject matter the upcoming title implies:

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      "<the substantive nouns from the upcoming meeting title>"
  start_date: <today minus 365 days>
  end_date:   <today>
  limit:      10
```

Results are relevance ordered, not chronological. Sort by timestamp yourself before
presenting anything as a sequence [evidence-standards.md].

## Step 3: mine the summary, not the transcript

`LB_INTERNAL_GET_MEETING` on the most recent relevant meeting id returns a structured
summary with these observed headings [littlebird-mcp-reference.md]:

| Section | What the brief takes from it |
|---|---|
| `## Executive Summary` | One line of "what that call was about" |
| `## For You` | The user's own commitments. This is the primary source for the user's open loops. |
| `## Topics Discussed` | Objection and concern candidates |
| `## Decisions` | Each tagged with who decided. Anything decided is a thing not to relitigate. |
| `## Action Items` | Checkbox list, each tagged with an owner or `Unassigned`. **This is the open loops engine.** |
| `## Risks / Open Questions` | The concerns section of the brief, close to verbatim |

Build on this structure rather than re-deriving it from raw transcript. It is cheaper,
more reliable, and already carries owner attribution
[littlebird-mcp-reference.md].

Pull the transcript with `LB_INTERNAL_GET_MEETING_TRANSCRIPT` only when the brief needs
an exact quote for wording. Transcripts can be very long
[littlebird-mcp-reference.md] and are weakly diarized, frequently tagged
`[Others]` rather than by name [littlebird-mcp-reference.md]. **Quote the
transcript for WORDING only. Never use it to prove who said something.** Take speaker
attribution from the summary's Action Items and Decisions blocks.

## Step 4: what was said last time, quoted, with the date

The brief carries at most two quotes per meeting. Format:

```
**Last time (2026-07-29, "Northgate integration review"):**
> "we would need the SSO piece done before we could put it in front of our security team"
Attribution: taken from the Action Items block, owned by Priya Raman.
```

Rules:

- Always carry the date of the source meeting. A quote without a date is a claim about
  the present, and it is usually wrong.
- Where the quote came from the transcript, say the attribution came from the summary,
  or do not name a speaker at all.
- Trim to the shortest span that carries the meaning. The reader has 90 seconds
  [research/distilled-call-preparation.md section 2].
- Never edit inside the quotation marks. Trim at the ends only.

## Step 5: open loops, both directions

This is the section that saves the call. Practitioner guidance says to review "previous
interaction key points and agreements" before a call
[research/distilled-call-preparation.md section 3], and the named gap in existing tools
is precisely the failure to tie prior call history into one page
[research/distilled-call-preparation.md section 8].

Build the table from the prior meeting's `## Action Items` and `## For You` blocks, which
carry owner tags [littlebird-mcp-reference.md]:

| Owner | Commitment | Evidence it happened | Status |
|---|---|---|---|
| The user | Verbatim from `For You` or an owned Action Item | See the evidence sweep below | Done / No evidence / Unknown |
| Them | Verbatim from an Action Item owned by them | Same | Done / No evidence / Unknown |
| Unassigned | Verbatim | Same | Never assigned |

**The evidence sweep.** For each commitment, run one narrow query over the window from
the prior meeting date to now:

```
search_user_context
  search_queries:          ["<3 to 6 distinctive words from the commitment>"]
  search_queries_messages: ["<same words>", "<person name> <the deliverable noun>"]
  standalone_query:        "Evidence that <commitment> was completed after <prior meeting date>"
  date_range:              {"start": "<prior meeting date>", "end": "now"}
```

Three outcomes, and the wording of each is load bearing:

- **Done.** A dated observation showing it happened. Carries a receipt.
- **No evidence found.** The sweep ran and returned nothing. This is NOT the same as "it
  did not happen" [evidence-standards.md]. Write it as "no evidence in the
  record since 2026-07-29", never as "they did not do it".
- **Unknown.** The commitment is too vague to search, or the sweep hit an oversized result
  and was not completed. Say which.

The status column is where a brief earns its keep. Being asked for something the user
forgot is the specific failure this section exists to prevent.

## Step 6: objections and concerns they raised, and how the user handled them

Sources, in order of reliability:

1. `## Risks / Open Questions` from the prior meeting summary. Closest to a clean list.
2. `## Topics Discussed` entries that read as a concern.
3. A transcript quote, for wording only, with no speaker claim.

For each objection, record the response if the record contains one. If it does not, say
the response is not in the record. Do not reconstruct what the user probably said. The
attribution guardrail applies: capture shows what the user was viewing, not necessarily
what they wrote or said [evidence-standards.md].

Format:

```
**Raised last time:** pricing tied to seat count, called out as a problem for a team
that flexes seasonally. [Northgate integration review, 2026-07-29, Risks / Open Questions]
**How it was handled:** the record does not contain a response. Expect it again.
```

**Honesty note to carry.** No source in the research archive gives frequency data on how
often a specific objection recurs across calls with the same account, and the search for
it came up empty twice [research/distilled-call-preparation.md section 9]. Surfacing
prior objections rests on practitioner guidance, not on measured evidence. That is enough
to justify a line in a brief. It is not enough to justify a claim about win rates, and
the skill makes no such claim.

## Step 7: what changed on their side, external

The trigger event step: funding, leadership changes, product launches, public activity
[research/distilled-call-preparation.md section 3].

**List available web tools first. Do not assume a specific one exists.** Depending on the
environment, a web search tool, a web fetch tool, or a third party research MCP may or may
not be present. Enumerate what is available, pick one, and if none exists, write:

```
**What changed on their side:** no external research tool available this run. Internal
record only.
```

That line is an acceptable brief. Fabricating company news is not.

When a tool is available, run at most three queries per company and cap the section at
three lines:

1. `"<company name>" funding OR acquisition OR launch` scoped to the window since last
   contact
2. `"<company name>" "<person name>"` for public activity by the specific attendee
3. `"<company name>"` general, most recent first

Every external line is marked **External** and carries its URL
[evidence-standards.md]. An external claim is reported as "their site says X",
never as "X" [evidence-standards.md].

Where external evidence contradicts the internal record, present both and say they
disagree. Do not resolve it by picking the more interesting one
[evidence-standards.md].

## Step 8: empty retrieval

If steps 1 through 3 all come back empty for a meeting, that meeting is a first meeting
and gets the first meeting shape (see `brief-formats-by-meeting-type.md`). If they come
back empty for a meeting whose title clearly implies history, say so as a gap:

```
**History:** nothing found in the record for this title or these attendees in the last
365 days, despite the title implying a prior instance. Either the earlier calls were not
recorded or the title changed.
```

Empty retrieval ends that line of inquiry. Do not pad from training data, do not reason
from what "would probably" be there, do not substitute plausible examples
[evidence-standards.md].

## Query budget

A day with five calls, briefed at full depth, is a lot of retrieval. Cap it:

| Per meeting | Budget |
|---|---|
| Prior instance by name | 1 call, plus at most 1 retry |
| Meeting search by person and by topic | 2 calls |
| `GET_MEETING` on the most relevant prior meeting | 1 call, 2 at most |
| `GET_MEETING_TRANSCRIPT` | 0 by default, 1 only when a quote is needed and the summary does not carry it |
| Open loop evidence sweeps | 1 `search_user_context` call per commitment, capped at 4 commitments |
| External | 3 queries per distinct company, deduplicated across meetings on the same day |

Deduplicate across the day. Two meetings with the same company share one external sweep.

If a `search_user_context` call returns an oversized result written to a file
[littlebird-mcp-reference.md], do not read the whole file to fill one line.
Narrow the query and rerun, or mark the item Unknown and move on.
