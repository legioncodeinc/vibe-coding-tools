# Sighting extraction

A sighting is one appearance of a watchlist entity in the user's field of view, with a
date, a source app, the surrounding context, and a receipt. The sightings log is the
artifact no URL monitor can produce, so the extraction has to be careful enough that the
log is trusted.

Domain claims trace to `references/research/distilled-competitive-intelligence.md`.
Tool behavior traces to `references/littlebird-mcp-reference.md`.

## Why this half of the skill is the valuable half

Every tool in the surveyed competitive intelligence category monitors a supplied set of
external sources, and the unit of configuration is a name or URL the user already entered
(distillation section 3). Only two of eleven surveyed products include field intelligence
at all, and both require the organization to populate it deliberately (distillation
section 3). The recommended industry mechanism for capturing field intelligence is a Slack
channel where people manually post "rumors, screenshots, and emails" (distillation section
2.1). That mechanism only records what someone bothered to post.

Public sources represent controlled information. Field intelligence is unfiltered
(distillation section 2.1). This skill reads the unfiltered half directly.

## The retrieval brief

Run narrow parallel queries, always windowed. A broad query returns 70,000 plus characters
and gets dumped to a file (`references/littlebird-mcp-reference.md`). Window month by month
for a backfill, week by week for the recurring digest.

### Pass 1. Screen sightings, entity queries

`search_user_context` with `filters: {"data_source": "snapshots"}` and a `date_range`
covering the reporting window.

Build `search_queries` from the watchlist. One query per Tier 1 entity, using the primary
name plus its strongest alias. Up to 7 queries per call, so batch across calls by tier.
Add the disambiguation co-occurrence term from the watchlist for any trap name.

Example query shapes, filled from the watchlist rather than invented:

- `Acme Corp AcmeFlow workflow product`
- `Acme pricing plan tiers`
- `Jane Roe Acme founder post`

Include a `standalone_query` naming the job: something like "find every appearance of these
competitor names on screen in this window, including in feeds, screenshots, dashboards, and
shared screens."

### Pass 2. Screen sightings, category queries

Same call shape, different queries. These catch entities under a description rather than a
name, and they feed new-entrant detection (`references/new-entrant-detection.md`).

Query shapes derived from the market frame:

- `alternative to [category] tool comparison`
- `[category] pricing page`
- `switching from [user product category] to`
- `[category] launch announcement`

### Pass 3. Messages

`search_user_context` with `filters: {"data_source": "messages"}` and
`search_queries_messages` carrying the same entity names. This is what people are telling
the user directly: a friend forwarding a link, a client naming a tool, a community thread
argument.

Message items carry a collection time and per-message send timestamps that are different
values. Both matter and both go in the receipt (`references/evidence-standards.md`, rule 1).
The send time governs the timeline (rule 8).

### Pass 4. Meetings

`LB_INTERNAL_SEARCH_MEETINGS` with `query` set to the competitor name, plus the window.
This is a topic lookup, so `SEARCH_MEETINGS` is correct and `LIST_MEETINGS` is not
(`references/littlebird-mcp-reference.md`).

**A competitor named by a client or prospect on a live call is the highest-value sighting
this skill can produce.** The archive supports that ranking twice: buyer-sourced
intelligence exposes the shadow layer of positioning that never appears in public
marketing, while sellers explaining their own losses default to price and features
(distillation section 2.2); and sales calls are listed first, ahead of every public
monitoring source, as the method for finding names you do not already track (distillation
section 6).

For any meeting hit, pull `LB_INTERNAL_GET_MEETING` and read the structured summary before
touching the transcript. Attribution comes from the summary's Decisions and Action Items
blocks, which carry owner tags. Raw transcript chunks are weakly diarized and frequently
tagged `[Others]`, so quote them for wording only, never to prove who said something
(`references/littlebird-mcp-reference.md`).

### Pass 5. Activity summaries, optional

`filters: {"data_source": "summaries"}` gives a compressed view of a day and is the cheapest
way to check whether a window is worth sweeping in detail. Use it for backfills over long
windows, not for the weekly digest.

## Turning results into sightings

### Deduplicate first, count second

OCR of dense UI produces fragments, duplicate lines, and interleaved chrome
(`references/littlebird-mcp-reference.md`). Treat repeated identical lines as one
observation. Collapse the following into a single sighting:

- The same page captured in consecutive snapshots minutes apart
- A thread visible in a list view and again in the open view
- A notification and the item it points to
- The same article open in two tabs

**This is not cosmetic.** Frequency and velocity are the output. An undeduplicated log
turns one long reading session into six mentions and manufactures a trend that does not
exist.

### Record each sighting

| Field | Content |
|---|---|
| Date | Event date. For messages, the send date, not the collection date |
| Entity | The watchlist name matched, plus which alias matched |
| Source app | From the item prefix, for example chrome, messenger, zoom |
| Context type | One of: feed post, shared screenshot, demo or screen share, community thread, message, call mention, article, ad, search result, review site, own research |
| Whose screen | User's own activity, or content another person put in front of them |
| Summary | One line, what was actually visible |
| Receipt | Canonical form from `references/evidence-standards.md` |
| Confidence | High, Medium, Low per the evidence standards |

### The context-type field is what makes the log worth reading

"Competitor mentioned 4 times" is a number. "Competitor named by a prospect on a discovery
call, then in a community thread two days later, then in a screenshot a partner posted"
is intelligence. Sort chronologically, since retrieval returns relevance order rather than
time order (`references/evidence-standards.md`, rule 8).

### The "whose screen" field drives the ethics gate

Mark every sighting as either the user's own activity or content another person put in
front of them. `references/ethics-and-boundaries.md` keys its rules off this field. Do not
skip it.

## Signal versus noise: the counting convention

**State this to the user every time it is applied, and state it as a convention.** The
weak-signals literature is explicit that "there is no practical formula for distinguishing
and assessing intuition" between noise and weak signals (distillation section 5.4). No
source in the archive supplies a numeric threshold (distillation section 5.4, named gap).

The convention this skill uses:

| Pattern | Classification |
|---|---|
| One sighting, user's own research or reading | **Not a market signal.** The user read an article. Log it, do not count it toward velocity |
| Two or more sightings in one context type, same session or same source | **One observation.** Deduplicate |
| Three or more sightings across three independent contexts inside the window | **Signal.** Independent means different people, different apps, and different origins |
| Any mention by a client or prospect on a call | **Signal regardless of count.** Buyer-sourced intelligence outranks volume (distillation section 2.2) |
| First appearance ever in the record | **New entrant candidate.** See `references/new-entrant-detection.md` |

The three-context rule is a working convention chosen so that a single burst of the user's
own reading cannot manufacture a trend. It is not a researched constant. Say so in the
output, in one line, every time.

Independence test, applied before counting three: two sightings are not independent if one
caused the other. A community thread and the screenshot someone posted of that same thread
are one context. An article and the user's own re-reading of it are one context.

## Frequency and velocity

Velocity is the output that matters. Ansoff's phase model makes movement the observable
event: knowledge progresses through successive information waves, and each phase carries
increasingly specific response options (distillation section 5.2). Steady-state presence
carries no new response option.

For each tracked entity, report:

| Metric | Definition |
|---|---|
| This period | Deduplicated sighting count in the window |
| Prior period | Same count from the previous report |
| Trailing baseline | Mean per period over the prior three periods where available |
| Velocity | Direction and magnitude of change against the baseline |
| Context spread | How many independent context types this period |

Rank the digest by velocity, not by volume. Zero to four is a bigger event than ten to
eleven. Say that plainly in the output so the reader understands the ordering.

Where the prior periods do not exist yet, say the baseline is unavailable and report raw
counts only. Do not compute a velocity against an imagined baseline.

## Empty retrieval

If the passes return nothing for the window, report it as a finding and stop that section.
"No sightings of any tracked entity between DATE and DATE across snapshots, messages, and
meetings" is a correct and useful output. Do not pad it from training data, and do not
convert it into "the market was quiet", which is a different and unsupported claim
(`references/evidence-standards.md`, rules 2 and 9).
