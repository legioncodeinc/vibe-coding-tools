# Internal exposure retrieval

The half that no ordinary research tool can run. What has this topic looked like from inside
the user's own field of view, and when.

Domain claims trace to `references/research/distilled-research-synthesis-method.md`.
Tool mechanics trace to `references/littlebird-mcp-reference.md`.

## The one thing this guide exists to protect

**Reading is not believing.** What appeared on a screen is evidence of exposure. What the
user said in a message or on a call is evidence of a position. These two things are
retrieved by the same tool, arrive in the same result set, and look similar on the page. Keep
them apart at the moment of extraction, because they cannot be reliably separated later.

Screen OCR captures what the user was viewing, not what they wrote
(`references/littlebird-mcp-reference.md`), and attribution is guilty until proven innocent
(`references/evidence-standards.md`, rule 4).

## The five passes

Run narrow parallel queries rather than one broad one. Five specific queries return
better-scored, more diverse items than one vague query and avoid the oversized-result file
dump (`references/littlebird-mcp-reference.md`). Maximum 7 queries per call.

Every pass is windowed to a block from the scoping interview. Sweep block by block.

### Pass 1. Exposure on screen

```
search_user_context
  search_queries:   [topic term, alias 1, alias 2, alias 3,
                     associated person or company name,
                     topic term plus "guide", topic term plus "vs"]
  standalone_query: "Find material about TOPIC that appeared on the user's screen:
                     articles, documentation, posts, threads, dashboards, product
                     pages, or search results."
  date_range:       {start: block start, end: block end}
  filters:          {data_source: "snapshots"}
```

This is the exposure inventory. Everything here is **exposure only** until proven otherwise.

### Pass 2. What the user said about it in threads

```
search_user_context
  search_queries_messages: [topic term, alias 1, alias 2,
                            topic term plus "I think", topic term plus "we should",
                            topic term plus "the problem with",
                            topic term plus "have you looked at"]
  standalone_query:        "Find messages where the user discussed, argued about,
                            recommended, or dismissed TOPIC."
  date_range:              {start: block start, end: block end}
  filters:                 {data_source: "messages"}
```

**This is the position pass.** A message tagged `(From:[user])` is the user's own words and
is evidence of a position (`references/evidence-standards.md`, rule 4). Everything else in
the thread is somebody else talking, which is exposure.

Message items carry a send time that differs from the collection time, and the send time
governs the timeline (`references/evidence-standards.md`, rule 8).

### Pass 3. What the user said about it on calls

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      one per call: topic term, each alias, "our approach to TOPIC",
              "we decided TOPIC", "the issue with TOPIC"
  start_date: window start
  end_date:   today
  limit:      10
```

Topic lookup uses `SEARCH_MEETINGS`. A lookup by meeting NAME uses `LIST_MEETINGS` with
`name`. Using the wrong one is the most common mistake against this server
(`references/littlebird-mcp-reference.md`).

For every hit, call `LB_INTERNAL_GET_MEETING` and take attribution from the owner-tagged
`## Decisions` and `## Action Items` blocks. **Never take attribution from a raw transcript
chunk.** Chunks are weakly diarized and frequently tagged `[Others]`, which proves someone
said it and not who (`references/littlebird-mcp-reference.md`).

Fetch a transcript only to recover exact wording for a line the summary already located and
already attributed, one meeting at a time.

### Pass 4. The compressed sweep

```
search_user_context
  search_queries: [topic term, alias 1, alias 2, associated name]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "summaries"}
```

The cheapest way to get a compressed view of many days
(`references/littlebird-mcp-reference.md`). Use it to find which days deserve a narrow
re-query. A summary is a paraphrase, so it locates material and never supplies a quote.

### Pass 5. Prove the boundary of the exposure

```
search_user_context
  search_queries: [each alias that returned nothing in pass 1,
                   the topic's newest development term from the external sweep]
  date_range:     {start: window start, end: "now"}
```

Run this **after** the external sweep, using terms for developments the external half found.
A negative result here is the finding that makes the staleness section possible: the user's
capture contains no exposure to a thing that exists.

"No evidence of X in the last 180 days" and "X did not happen" are different claims and only
the first is supportable (`references/evidence-standards.md`, rule 2). Record the queries,
the aliases, and the window alongside every negative.

## Classifying every retrieved item, at the moment you extract it

Four buckets. Assign before anything else happens to the item.

| Bucket | Test | What it can support |
|---|---|---|
| **Exposure** | It was on screen. An article, a doc page, a post, a thread the user was reading, a dashboard | "The user encountered this material on DATE." Nothing about what they think |
| **Utterance** | The user wrote it or said it. A message tagged `(From:[user])`, a line attributed to the user in a meeting summary's owner-tagged blocks | "The user stated this position on DATE." This is the only bucket that supports a belief claim |
| **Ambient** | Somebody else's words in the user's capture. A colleague's message, another speaker on a call, a comment under a post | "This was said to or near the user on DATE." Context, not position |
| **Unclear** | Cannot determine which of the above | Drop it, or ask. Never promote it |

**Unclear defaults to drop, not to exposure.** A misfiled item in the exposure inventory is
noise. A misfiled item in the belief section is the skill telling the user they think
something they do not think, which is the worst output this skill can produce.

## Deduplicate before counting anything

Collapse:

- Consecutive captures of the same page as the user scrolled
- A list view and a detail view of the same thread
- A notification and the item it points to
- The same article open in two tabs, or on two days
- An article and its syndicated copy on another domain

OCR of dense UI produces fragments, duplicate lines, and interleaved chrome, so treat
repeated identical lines as one observation (`references/littlebird-mcp-reference.md`).

Undeduplicated counting invents a pattern of sustained attention where there was one long
reading session.

## Reading the scores

Items scoring below 3 are omitted by the server entirely, and an item scored 3 is a maybe
that never carries a claim on its own without corroboration
(`references/littlebird-mcp-reference.md`). A single 3-scored snapshot is not sufficient
evidence that the user read something.

## The completeness statement, and it is mandatory

The internal half is bounded by what was captured, not by what the user knows. They read
things on a phone, in print, in a meeting, and years before capture began. They also forget
things they read.

**Every output states this plainly in the internal section itself, not in a footnote.**
Suggested wording, adapt but do not soften:

> This covers what Littlebird captured on screen and in messages between DATE and DATE. It
> is not a map of what you know. Anything you read on a phone, in print, before capture
> began, or outside these windows is invisible here.

Two things in the archive support making this explicit rather than implied. A single-pass
screening approach falsely excludes roughly 13 percent of relevant material even in a
disciplined review process (distillation section 2), and every abbreviation in a rapid review
is legitimate only when declared and documented rather than hidden (distillation section 2).

## The did-not-act observation

The brief for this skill calls for naming what the user read and evidently did not act on.
This is genuinely useful and it is also the easiest place in the skill to overreach.

Rules:

1. **State it as absence of captured evidence, never as inaction.** "You read three pieces on
   this in March and nothing in the capture since then references it" is supportable. "You
   did not act on this" is not (`references/evidence-standards.md`, rule 2).
2. **Check for action before claiming its absence.** Run a narrow query for the obvious
   follow-through: the tool being used, the term appearing in a message the user sent, the
   topic appearing on a call agenda. Report what you checked.
3. **Do not editorialize.** No "worth revisiting", no "this seems like a missed
   opportunity". Report the shape and stop. The user knows what they did.
4. **Cap it.** Three items maximum, the ones with the most exposure and the least
   follow-through. A long list of things the user did not do is a scolding, not a synthesis.

## Empty internal retrieval

If the passes return nothing on the topic: say so, name the window, the passes run, and every
alias searched. Then offer two branches, with `AskUserQuestion`:

- Widen the window and re-run
- Run the external half alone, clearly labelled as a plain research report with no delta,
  because with no internal half there is no already-knew versus new split and the user should
  be told they are getting an ordinary literature scan

Never pad the internal half from training data and never treat the external findings as
though the user had not seen them (`references/evidence-standards.md`, rule 9).
