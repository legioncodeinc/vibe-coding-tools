# Praise discovery

The retrieval brief. Every call, every filter, every window, and the phrasing families that make
the difference between finding six quotes and finding sixty.

Read `littlebird-mcp-reference.md` before running any of this. Use the real tool names available
in the session.

## The governing problem

Praise is not a topic. It is a register, and people express it in registers that share almost no
vocabulary. "Thank you so much for turning that around" and "we went from four days to under an
hour" and "I told Marcus he needs to call you" are all the same finding, and no single query
retrieves all three.

So the design is many narrow queries with deliberately varied phrasing, run in parallel. That is
also what the server rewards: parallel narrow beats one broad, and a broad query risks the
oversized-result file dump (`littlebird-mcp-reference.md`).

## Window

**Default: 180 days.** Long enough that a quarterly client relationship produces at least one
praise moment, short enough that a job title is probably still current.

Sweep it in three 60-day blocks rather than one 180-day call. Relevance dilutes across a long
unbounded window (`littlebird-mcp-reference.md`), and blocking also gives free recency ordering
for the freshness check in `attribution-verification.md`.

Widen to 365 days only when the user asks for a launch-driven sweep and the 180-day pass came
back thin. Say in the artifact that the window was widened and why.

## Pass 1: messages, where gratitude lives

```
search_user_context
  search_queries_messages: [one register per call, see the table below]
  standalone_query:        "Find messages where a client, customer or collaborator expressed
                            satisfaction, gratitude, praise or a concrete result about work the
                            user did for them."
  date_range:              {start: block start, end: block end}
  filters:                 {data_source: "messages"}
```

Up to 7 entries in `search_queries_messages` per call. Run the register families below as
separate calls of at most 7, not as one 20-item array.

### The register families

| Family | Query phrasings to use |
|---|---|
| **Gratitude** | "thank you so much", "I really appreciate", "thanks for turning that around", "grateful for your help", "you saved me" |
| **Superlative** | "this is amazing", "incredible work", "best we have worked with", "brilliant", "exactly what we needed" |
| **Relief** | "such a relief", "weight off my shoulders", "finally sorted", "I can stop worrying about", "one less thing" |
| **Result, numeric** | "we went from to", "cut our time", "doubled", "saved us dollars", "increased by percent", "down from to" |
| **Result, non-numeric** | "we closed the deal", "we launched", "it is working", "we passed the audit", "the client approved" |
| **Recommendation and referral** | "I recommended you", "I gave them your name", "I told them to call you", "who else should I send to you", "I referred" |
| **Comparison to alternatives** | "better than our last", "unlike the previous agency", "we tried and it did not work", "we should have done this sooner" |
| **Expansion and renewal** | "can we do more of this", "extend the engagement", "sign up for another", "what else can you take on" |
| **Reaction in the moment** | "wow", "you nailed it", "this is exactly right", "love this", "perfect" |
| **Change over time** | "since you started", "the difference has been", "before you came on", "compared to where we were" |

Ten families. At 5 to 6 phrasings each and 7 per call, that is roughly 10 calls per 60-day block.
Three blocks means about 30 message calls for a full sweep. That is the intended cost. A single
sweeping "find praise" query will surface the loudest thank-you and miss every quote worth
banking.

**Run the referral and expansion families even though they contain no praise words.** A referral
is completely invisible to gratitude-shaped queries, and it is the only signal in the set where
the person put their own reputation behind the recommendation. It also matches the one form the
evidence favors for infrequent purchases: an explicit recommendation rather than a statement of
satisfaction (`research/distilled-testimonial-practice.md`, section 9, where the extension of that
finding from retail products to professional services is labeled as an inference).

## Pass 2: snapshots, where public praise lives

```
search_user_context
  search_queries: [see below]
  standalone_query: "Find public comments, reviews, ratings, recommendations or posts praising
                     the user, their company, or their work, as seen on screen."
  date_range:       {start: block start, end: block end}
  filters:          {data_source: "snapshots"}
```

Query set, run as separate calls by surface:

- **Review surfaces:** the user's business name plus "review", plus "stars", plus "rating", plus
  "Google review", plus "left a review"
- **Social surfaces:** the user's name plus "commented on your post", plus "recommends", plus
  "tagged you", plus "shared your post", plus the user's company name plus "congratulations"
- **Professional surfaces:** "recommendation" plus the user's name, "endorsed you for",
  "wrote you a recommendation"
- **Owned surfaces:** "testimonials" plus the company name, "case study" plus a client name,
  "what our clients say"

That last group finds praise the user already published, which matters for two reasons. It shows
what is already in circulation so the bank does not re-propose it as new, and a quote already
public on the user's own site has a permission history the user may have forgotten.

**Screen capture shows what was on the screen.** A five-star review visible in a browser tab may
be a review of a competitor the user was researching, a review of a supplier, or a review someone
sent them for reference. Every snapshot hit goes through `attribution-verification.md` before it
is banked. This is the single highest-volume source of false positives in the whole skill.

Social and app UIs collapse lists: "and 4 others", "12 people reacted"
(`littlebird-mcp-reference.md`). Any roster of who praised the user built from notification
capture is partial by construction. Report the named set and the size of the unnamed gap
(`evidence-standards.md`, rule 5).

## Pass 3: meetings, where the best and most dangerous material lives

This is where clients describe outcomes out loud, in their own words, with specifics they would
never type. It is also where NDAs, private figures and other clients' confidential results live.
Treat everything from this pass as confidential until proven otherwise.

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      one topic per call, see below
  start_date: window start
  end_date:   today
  limit:      10
```

Topic queries, one call each:

- client name plus "results"
- client name plus "difference it made"
- "since we started working together"
- "it saved us"
- "we would not have been able to"
- "our team loves"
- "I would recommend"
- "the ROI"
- "compared to what we had before"
- "we are seeing"

Topic lookup uses `SEARCH_MEETINGS`. A lookup by meeting NAME uses `LIST_MEETINGS` with `name`.
Using the wrong one is the most common mistake against this server
(`littlebird-mcp-reference.md`).

Then, for every meeting id that surfaced:

```
LB_INTERNAL_GET_MEETING
  meeting_id: each id
```

**Take attribution from the summary, never from the transcript.** The structured summary carries
`## Executive Summary`, `## Topics Discussed`, `## Decisions` tagged with who decided, and
`## Action Items` tagged with an owner. Raw transcript chunks are weakly diarized and are
frequently tagged `[Others]`, which proves someone said it and not who
(`littlebird-mcp-reference.md`, `evidence-standards.md` rule 4).

Only then, and only to recover exact wording for a quote the summary already told you exists and
already told you who said:

```
LB_INTERNAL_GET_MEETING_TRANSCRIPT
  meeting_id: the one meeting containing the line
```

Transcripts are long. Fetch one at a time, for a located line, not speculatively.

## Pass 4: the cheap compressed sweep

```
search_user_context
  search_queries: ["client praise", "positive feedback", "thank you note", "good news from a
                   client", "referral"]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "summaries"}
```

The daily activity summaries Littlebird writes itself are the cheapest way to get a compressed
view of a period (`littlebird-mcp-reference.md`). Use this pass to find days worth going back to
with a narrow query, not as a source of quotes. A summary is Littlebird's paraphrase, not the
person's words, and a paraphrase can never be banked as a quote.

## Pass 5: the gap sweep

For every client relationship the user names, run one deliberately targeted call:

```
search_user_context
  search_queries:          [client name plus "thank", client name plus "great", client name plus
                            "result"]
  search_queries_messages: [contact name plus "thanks", contact name plus "happy"]
  date_range:              {start: window start, end: "now"}
```

A negative answer here is a real finding and it is what populates the gap report. Record the
client, the aliases used, the queries run, and the window. Report it as "no captured praise found
in this window", never as "this client is unhappy" (`evidence-standards.md`, rule 2).

If no client roster exists, build one with `AskUserQuestion` before this pass. Do not infer the
roster from meeting titles: that turns prospects into clients and misses the client who only ever
appears as a domain.

## Reading the results

- Relevance scores below 3 are omitted by the server entirely. An item scored 3 is a maybe and
  never carries a quote on its own without corroboration (`littlebird-mcp-reference.md`).
- Message items carry a send time that differs from the collection time. **The send time is the
  date said and it is the date that goes in the bank** (`evidence-standards.md`, rule 8).
- OCR of dense UI produces fragments, duplicate lines and interleaved chrome. Deduplicate before
  counting anything (`littlebird-mcp-reference.md`).
- Results are relevance-ordered, not chronological. Sort by the date said before presenting
  anything (`evidence-standards.md`, rule 8).

## Empty retrieval

If all five passes come back with nothing bankable, report the window, the number of calls run,
the register families covered, and stop. Do not widen the window silently. Do not substitute a
plausible-sounding quote. Do not paraphrase a summary into a quote
(`evidence-standards.md`, rule 9).

A run that reports "180 days, 40 queries, no bankable praise found, here is the gap report and
here are three people worth asking" has done its job correctly and is arguably more useful than
one that finds four weak quotes.

## Raw capture does not ship

Everything retrieved here is working data. Process it, produce the bank, delete the raw
(`evidence-standards.md`, rule 7). Another client's confidential numbers, mentioned in passing on
a call, do not end up in a file just because the retrieval returned them.
