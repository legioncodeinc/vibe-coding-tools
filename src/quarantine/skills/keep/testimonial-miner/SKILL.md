---
name: testimonial-miner
description: 'Mines the praise you already earned into usable social proof. Trigger on "find my testimonials", "testimonial bank", "do I have any good client quotes", "social proof for the launch", "customer quotes", "can I use this review", "permission to quote a client", "case study quotes", "who has said nice things about us". Sweeps captured DMs, comments, reviews and meeting transcripts for praise, wins and results moments, then banks each as a verbatim quote with attribution, date said, a receipt and a permission tier: public and reusable, private and needs permission, or confidential and do not use. Separates results quotes into their own sub-bank with FTC typicality flags, drafts permission requests held for approval, and reports which client relationships have no captured praise at all. Internal artifact. Nothing is published and nothing is sent.'
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Testimonial Miner

Most people who run a business are sitting on more praise than they can remember. It arrived as a
DM at 11pm, as a line on a call nobody wrote down, as a comment under a post six months ago. None
of it is where anyone can find it, so the website says nothing and the launch page has a blank
space where the proof should be.

This skill finds that material and turns it into a bank: verbatim quote, who said it, their role
and company, the date said, the source and its receipt, and a permission tier.

**The permission tier is the most important field in the skill.** Not the quote, not the score.
The tier, because it is the difference between social proof and a person discovering their private
message on a stranger's landing page.

## Capability gate

This skill requires the Littlebird MCP on a Power or Pro plan.

Before anything else:

1. List the tools actually available in this session and use the real tool names. Do not assume a
   tool exists because it is named in `references/littlebird-mcp-reference.md`.
2. If no Littlebird MCP tools are present, stop and tell the user the skill needs the Littlebird
   MCP connected. Do not attempt a partial run from memory or from other sources.
3. If routine creation is part of the request, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` first to
   confirm the plan supports another routine.

Read `references/evidence-standards.md` before writing any output. Every line in the bank is
observed, inferred, external or unknown, and the kind is visible to the reader. Rule 10, reporting
on people, and rule 4, the attribution guardrail, govern this skill harder than any other in the
marketplace, because the output is other people's words published under their names.

## Purpose

Convert praise the user already earned into an internal quote bank that is safe to draw on, and
make the permission status of every quote unambiguous before anyone reaches for it.

Three problems it solves, in order of how much damage they do:

1. **The user publishes something they did not have the right to publish.** Usually a warm private
   message, lifted because it was the best line anyone ever wrote about them.
2. **The user publishes a results claim they cannot support.** A quote containing a specific
   outcome carries a legal requirement most people do not know exists. See below.
3. **The user has no idea what praise exists**, so the good material sits in an archive and the
   website carries a placeholder.

## Littlebird MCP calls used

| Tool | Used for |
|---|---|
| `search_user_context` with `filters.data_source: "messages"` | Gratitude, results and referral language in threads. The largest source of tier 2 material |
| `search_user_context` with `filters.data_source: "snapshots"` | Public comments, reviews, recommendations and testimonial pages seen on screen. The largest source of tier 1 material and of false positives |
| `search_user_context` with `filters.data_source: "summaries"` | The cheap compressed sweep, used to locate days worth a narrow re-query. Never a source of quotes, because a summary is a paraphrase |
| `LB_INTERNAL_SEARCH_MEETINGS` | Clients describing outcomes on calls. The best material and the most confidential |
| `LB_INTERNAL_GET_MEETING` | Attribution, from the summary's owner-tagged blocks, plus the attendee list from the linked calendar event |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Exact wording only, for a line the summary already located and already attributed |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Read the monthly routine's own past reports before a deep run, so nothing is re-proposed and no decline is forgotten |
| `LB_INTERNAL_CREATE_ROUTINE` / `LB_INTERNAL_UPDATE_ROUTINE` / `LB_INTERNAL_GET_ROUTINE_CONFIG` | Offer, create and maintain the monthly sweep |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Plan check before creating a routine |

There is no Littlebird tool that searches past Littlebird chat conversations. Where a skill would
want one, `search_user_context` is the substitute.

## Trigger

- "find my testimonials", "build a testimonial bank", "what nice things have clients said"
- "I need social proof for the launch", "quotes for the landing page", "case study quotes"
- "can I use this review", "do I need permission to quote this client"
- "who should I ask for a testimonial"
- The monthly routine fires and the user comes to collect

Two modes:

| Mode | When | Window | Output |
|---|---|---|---|
| **Monthly routine** | Scheduled, unattended | Last 45 days plus carry-forward from its own past reports | A routine report naming new praise found and what changed. No files, no drafts, no approvals |
| **Deep run** | User asks, usually before a launch | 180 days, or 365 on an explicit widen | The full bank file, the results sub-bank, permission-request drafts held for approval, and the gap report |

The routine observes. The deep run does the work. A routine cannot hold an approval gate open and
cannot create routines (`references/littlebird-mcp-reference.md`).

## Routine cadence

**Monthly, on the 1st, 08:00 local.** Monthly rather than weekly because praise arrives at a rate
that makes a weekly report mostly empty, and an empty report trains the user to stop reading.

Plus on demand before a launch, a pitch, a site rebuild, or a proposal, which is when the bank
actually gets spent.

## Process

### 0. Roster and prior state

If `testimonial-bank.md` exists, read it first. It carries granted permissions, declines,
revocations and prior tiers, and re-proposing a quote someone declined is the worst failure this
skill can commit.

Then call `LB_INTERNAL_GET_ROUTINE_REPORTS` on the monthly routine if one exists, and read what it
has already surfaced.

If no client roster exists, build one with `AskUserQuestion`. Do not infer it from meeting titles.
Guessing turns prospects into clients and misses the client who only appears as a domain on a
dashboard.

### 1. Sweep

Full retrieval brief in `references/praise-discovery.md`: the five passes, the ten register
families, the 60-day blocking, and the deliberate gap sweep.

The governing design rule: praise is a register, not a topic, and the registers share almost no
vocabulary. "Thank you so much for turning that around", "we went from four days to under an
hour", and "I told Marcus he needs to call you" are all the same finding and no single query
retrieves all three. Run many narrow parallel queries with deliberately varied phrasing. That is
also what the server rewards (`references/littlebird-mcp-reference.md`).

Run the referral and expansion families even though they contain no praise words. A referral is
invisible to gratitude-shaped queries, and an explicit recommendation is the form the evidence
favors for infrequent purchases like professional services, an extension labeled as an inference
where it appears (`references/research/distilled-testimonial-practice.md`, section 9).

### 2. Verify attribution before banking anything

Full procedure in `references/attribution-verification.md`: the five questions, the bona fide user
check, and the confidence ratings.

Three rules from that guide restated here because they carry the whole skill:

- **Confirm the target of the praise.** Screen capture shows what was on screen. A glowing comment
  might be praise for a competitor the user was researching, for a peer, or for a post the user
  shared but did not write. Adjacency on screen is not a confirmation. Drop or ask
  (`references/evidence-standards.md`, rule 4).
- **Take meeting attribution from the summary, never the transcript.** Raw transcript chunks are
  weakly diarized and frequently tagged `[Others]`, which proves someone said it and not who
  (`references/littlebird-mcp-reference.md`).
- **A summary is a paraphrase and can never become a quote.** It can tell you a quote exists. It
  cannot be the quote.

Verify the person's role and company before any title is printed next to their name. A stale title
is a small but real credibility hit, and printing a title can convert an ordinary consumer
endorsement into an implied expert endorsement with its own requirements
(`references/ftc-compliance.md`). Where a title cannot be verified, publish the name and company
with no title rather than a guessed one.

### 3. Assign the permission tier

Full procedure in `references/permission-tiers.md`.

Assign from the source channel, mechanically, before anyone reads the quote for quality:

| Tier | Said where | Status |
|---|---|---|
| **Public and reusable** | A public comment, review, post or recommendation. Test: could a stranger read this without being given access to anything? | Usable with attribution. Courtesy heads-up is still good practice, and linking back to the public source is better than copying the text |
| **Private, needs permission** | A DM, an email, a private group, a one-to-one thread | **Not usable until the person says yes.** The skill drafts the request |
| **Confidential, do not use** | Under an NDA, about a client's private results, or containing figures the person would not want public | Do not use. **Do not ask.** Asking is its own harm |

**Unknown channel means confidential, not private.** The default on uncertainty is the most
restrictive tier. **Meeting material starts at confidential** and has to be argued down, not up.

Where the permission requirement comes from is worth knowing: not the FTC, which is untroubled by
quoting customers, but state right of publicity law, which contemplates written consent obtained
first (`references/research/distilled-testimonial-practice.md`, section 7).

### 4. Split out the results quotes

Full procedure in `references/ftc-compliance.md`.

A quote containing a specific claimed outcome is the most valuable thing in the bank and the most
legally loaded. It gets pulled into a separate sub-bank and flagged, because an endorsement about
performance is read as representing what customers generally achieve, and a "results not typical"
disclaimer does not fix that. The Guides address that exact wording and say such disclaimers are
unlikely to be effective (`references/research/distilled-testimonial-practice.md`, section 5).

Three flags, one per results quote:

| Flag | Meaning |
|---|---|
| **SUBSTANTIATED** | The user can show this result is typical. Publishable |
| **NEEDS EXPECTED-RESULTS DISCLOSURE** | Atypical, but the user knows what typical is. Publishable only alongside a clear and conspicuous statement of generally expected performance |
| **NOT PUBLISHABLE AS A RESULTS CLAIM** | The user does not know what typical is. Neither option above is available |

Most quotes for a small business land on the third flag. Say so plainly rather than nudging toward
the first. **The skill never assesses whether a result is typical.** It cannot: computing
typicality from a praise bank is circular, because the bank only contains clients happy enough to
say something.

### 5. Draft permission requests, hold them

Full templates in `references/permission-tiers.md`. Three templates: public courtesy, private
permission, and private-with-a-number.

Every draft is held. `HELD FOR APPROVAL. NOT SENT.` at the top of every one.

**No draft offers a benefit.** Not a discount, not a gift card, not a free month. Under 465.4 it is
prohibited to provide compensation or incentives in exchange for reviews expressing a particular
sentiment, and all ten of the FTC's December 2025 warning letters involved incentives tied to
positive reviews (`references/research/distilled-testimonial-practice.md`, sections 3 and 6). The
praise here already exists and is not being purchased, so the ask is not itself the prohibited
conduct. Keeping money out of the message keeps it obviously clean.

Several of these drafts are written as the user. Check whether a personal voice skill is installed
in the session and use it. If none is installed, say so plainly and point at this marketplace's
voice creator skills. Never invent a voice profile.

### 6. Write the gap report

Which client relationships produced no captured praise in the window. That is a prompt to go ask,
not a verdict. Report it as "no captured praise found in this window", never as "this client is
unhappy" (`references/evidence-standards.md`, rule 2).

One caution to include wherever the gap report appears: asking for reviews only from customers
expected to be positive is review gating and the FTC calls it out directly
(`references/research/distilled-testimonial-practice.md`, section 6). Mining only praise is not
gating, because it does not shape who gets asked. Turning the gap report into "only ask the happy
clients for a Google review" is.

## Retrieval brief

The actual calls. Window defaults to 180 days, swept in three 60-day blocks. Full per-family
detail in `references/praise-discovery.md`.

**Praise in threads, one register family per call**

```
search_user_context
  search_queries_messages: [up to 7 phrasings from ONE register family, for example
                            "thank you so much", "I really appreciate",
                            "thanks for turning that around", "grateful for your help",
                            "you saved me"]
  standalone_query:        "Find messages where a client, customer or collaborator expressed
                            satisfaction, gratitude, praise or a concrete result about work the
                            user did for them."
  date_range:              {start: block start, end: block end}
  filters:                 {data_source: "messages"}
```

Ten families: gratitude, superlative, relief, numeric result, non-numeric result, recommendation
and referral, comparison to alternatives, expansion and renewal, in-the-moment reaction, change
over time. Roughly ten calls per 60-day block. That cost is the point. One sweeping "find praise"
query surfaces the loudest thank-you and misses everything worth banking.

**Public praise on screen**

```
search_user_context
  search_queries:   [business name plus "review", business name plus "stars",
                     user name plus "commented on your post", user name plus "recommends",
                     "endorsed you for", company name plus "testimonials"]
  standalone_query: "Find public comments, reviews, ratings, recommendations or posts praising
                     the user, their company, or their work, as seen on screen."
  date_range:       {start: block start, end: block end}
  filters:          {data_source: "snapshots"}
```

Run as separate calls by surface: review platforms, social, professional, and the user's own owned
pages. Every hit goes through `references/attribution-verification.md` before banking. This is the
highest-volume source of false positives in the skill.

Social and app UIs collapse lists, so any roster of who praised the user built from notification
capture is partial by construction. Report the named set and the size of the unnamed gap
(`references/evidence-standards.md`, rule 5).

**Clients describing outcomes on calls**

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      one topic per call: client name plus "results", "since we started working
              together", "it saved us", "we would not have been able to", "our team loves",
              "I would recommend", "compared to what we had before"
  start_date: window start
  end_date:   today
  limit:      10
```

Topic lookup uses `SEARCH_MEETINGS`. A lookup by meeting NAME uses `LIST_MEETINGS` with `name`.
Using the wrong one is the most common mistake against this server
(`references/littlebird-mcp-reference.md`).

**Attribution for anything found in a meeting**

```
LB_INTERNAL_GET_MEETING
  meeting_id: every recorded id from the calls above
```

Take the speaker from the owner-tagged `## Decisions` and `## Action Items` blocks and the
attendee list from the linked calendar event. Only then, and only to recover exact wording for a
line the summary already located and already attributed:

```
LB_INTERNAL_GET_MEETING_TRANSCRIPT
  meeting_id: the one meeting containing the line
```

One at a time. Transcripts are long.

**The compressed sweep, to find days worth re-querying**

```
search_user_context
  search_queries: ["client praise", "positive feedback", "thank you note",
                   "good news from a client", "referral"]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "summaries"}
```

**Prove absence deliberately, per client, for the gap report**

```
search_user_context
  search_queries:          [client name plus "thank", client name plus "great",
                            client name plus "result"]
  search_queries_messages: [contact name plus "thanks", contact name plus "happy"]
  date_range:              {start: window start, end: "now"}
```

A negative answer here is a real finding. Record the client, the aliases, the queries and the
window alongside it.

Read the relevance scores. Items below 3 are omitted by the server entirely, and an item scored 3
never carries a quote on its own without corroboration
(`references/littlebird-mcp-reference.md`). Message items carry a send time that differs from the
collection time, and the send time is the date said
(`references/evidence-standards.md`, rule 8).

## Empty retrieval

If all five passes return nothing bankable, report the window, the number of calls run, the
register families covered, and stop. Do not widen the window silently. Do not substitute a
plausible-sounding quote. Do not paraphrase a summary into a quote
(`references/evidence-standards.md`, rule 9).

A run that reports "180 days, 40 queries, no bankable praise found, here is the gap report and
here are three people worth asking" has done its job correctly, and for a user who has never
collected a testimonial it is more useful than four weak quotes would be.

If retrieval returns material but every item fails attribution, that is not an empty run. Report
the Unverified list with the specific resolving action per item. Most of them resolve with one
message to someone the user already knows.

## Output

A deep run writes two files in the working directory, or the directory the user names.

**`testimonial-bank.md`**, persistent across runs. Ten sections in order:

1. Header: date built, window, queries run, and the not-legal-advice line
2. Coverage: which sources were swept and what each returned
3. **Usable now:** public tier plus granted private tier, sorted by strength
4. **Awaiting permission:** private tier, with request status per row
5. **Results sub-bank:** every results quote regardless of tier, each with its flag
6. **Confidential, do not use:** speaker, date and a one-line reason, **without the quote text**
7. **Unverified:** which of the five attribution questions it failed, and the resolving action
8. **Declined and revoked:** so nothing re-proposes them
9. **Gap report:** relationships with no captured praise, and who to ask
10. Method: queries, window, tools

Per-quote columns: `id`, `quote`, `quote_original`, `trim_rules_applied`, `speaker`, `role`,
`company`, `date_said`, `source`, `receipt`, `tier`, `permission_status`, `permission_record`,
`results_claim`, `material_connection`, `confidence`, `staleness`, `objection_answered`,
`strength`, `notes`. Full schema in `references/quote-formatting.md`.

Section 6 carrying no quote text is deliberate. Raw capture does not ship
(`references/evidence-standards.md`, rule 7), and a confidential quote written into a persistent
file is a confidential quote that will eventually be pasted somewhere.

**`permission-requests-YYYY-MM-DD.md`**, drafts held for approval, one per person rather than one
per quote.

Landing page and case study formats are produced only on request, from the bank, per
`references/quote-formatting.md`.

## Guardrail

**Never edit a quote into something better.**

Light trimming for length is acceptable and is defined precisely in
`references/quote-formatting.md`: what may be cut, how each cut is marked, and the eight things
that may never be done. Every trim in the bank carries the rule number that authorized it, and the
untrimmed original is stored alongside. A trim with no rule number is a defect.

Rewriting is fabrication. It is also an FTC problem: endorsements must reflect the honest opinion
of the endorser and cannot convey an implied representation that would be deceptive if the
advertiser made it directly, and the FTC's own summary of the Reviews Rule lists AI-generated fake
reviews among the prohibited categories
(`references/research/distilled-testimonial-practice.md`, sections 4 and 8). A model that improves
a customer's phrasing is generating text and attributing it to a named human. That is the specific
failure this skill is most likely to commit, because improving prose is the thing a language model
does by reflex.

Three cuts that look harmless and are not: removing a qualifier, removing a timeframe, and joining
two things said on different days. "It worked, once we got our own data in order" is not "It
worked" (`references/research/distilled-testimonial-practice.md`, section 8).

**This is not legal advice.** The regulatory material in this skill is a summary of public sources
as of 2026-08-17. Advertising and publicity law varies by jurisdiction and changes. Take anything
consequential to a lawyer. The skill flags and explains. It does not clear.

## Approval gate

**Nothing is published and nothing is sent.** The bank is an internal artifact. Permission requests
are drafts.

Before any drafted text reaches another person, present the person, the quote, the receipt, and
the full draft verbatim rather than a summary of it. Then use `AskUserQuestion` to offer: send as
written, edit first, hold, or drop (`references/evidence-standards.md`, rule 6). Approving the bank
is not approving a publication, and approving the plan to ask is not approving the words.

Where an action would go through another product, Gmail, a CRM, a site builder, those are separate
MCP connectors that may or may not be present. List the available tools first. Where the connector
is absent, produce a copy-paste block or an import-ready file instead. Never assume a connector
exists.

## Routine wiring

Offer to create the monthly sweep. Show the user the exact prompt text and schedule below, get
approval with `AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Creating it generates a
first report immediately, then it runs on schedule. Do not tell the user to go set it up by hand.

```
title:    Monthly testimonial sweep
schedule: {"frequency": "monthly", "time": "08:00", "month_day": 1}
notifications_enabled: true
email_notifications_enabled: true
```

Exact `prompt` text to pass:

```
You are running a monthly sweep for praise this user earned, so it can be turned into
social proof later in an interactive session. You OBSERVE and REPORT. You do not draft
messages, you do not send anything, and you do not publish anything.

STEP 1. MEMORY FIRST. Before anything else, call LB_INTERNAL_GET_ROUTINE_REPORTS for this
routine with limit 6 and read every past report. Build a list of every quote you have
already reported, every person you have already named, and every relationship you have
already flagged as having no captured praise. You need all of it in step 5. Do not skip
this step. A report that re-reports last month's quotes is a failed report.

STEP 2. WINDOW. Sweep the last 45 days only. Do not widen it.

STEP 3. GATHER. Run narrow separate queries, never one broad query. Praise is expressed in
many registers that share no vocabulary, so vary the phrasing deliberately.

Call search_user_context with filters data_source messages, once per register family, up
to 7 phrasings per call:
  a. gratitude: thank you so much, I really appreciate, thanks for turning that around,
     grateful, you saved me
  b. superlative: this is amazing, incredible work, best we have worked with, brilliant,
     exactly what we needed
  c. relief: such a relief, weight off my shoulders, finally sorted, one less thing
  d. numeric result: we went from to, cut our time, doubled, saved us, increased by
  e. non-numeric result: we closed the deal, we launched, it is working, we passed
  f. recommendation and referral: I recommended you, I gave them your name, I told them to
     call you, I referred
  g. comparison: better than our last, unlike the previous agency, should have done this
     sooner
  h. expansion: can we do more of this, extend the engagement, what else can you take on
  i. reaction: wow, you nailed it, this is exactly right, love this
  j. change over time: since you started, the difference has been, before you came on

Call search_user_context with filters data_source snapshots for: the business name plus
review, the business name plus stars, the user's name plus commented on your post, the
user's name plus recommends, endorsed you for.

Call LB_INTERNAL_SEARCH_MEETINGS separately for each of: results, since we started working
together, it saved us, our team loves, I would recommend, compared to what we had before.
For any meeting that hits, call LB_INTERNAL_GET_MEETING and take who said what from the
Action Items and Decisions blocks and the attendee list from the linked calendar event. Do
NOT fetch transcripts. Do not quote meeting material in this report at all, for the reason
in the RULES section.

STEP 4. VERIFY BEFORE YOU REPORT ANYTHING. For every candidate, answer all five of these
or drop it:
  a. Who said it, with a receipt. A message tagged From:[user] is the user's own words and
     is not a testimonial. A transcript chunk tagged Others proves someone said it, not who.
  b. Was the praise about THIS user. Screen capture shows what was on screen, so a glowing
     comment may be about a competitor the user was researching, about a peer, or about a
     post the user shared but did not write. Being next to the user's name on screen is not
     a confirmation. If you cannot confirm the target, drop it and say why.
  c. Are these their exact words. A Littlebird summary is a paraphrase and can never become
     a quote.
  d. When did they say it. For messages the send time differs from the collection time. The
     send time is the date said.
  e. Were they actually a client at the time. A prospect who was impressed on a sales call
     is not a testimonial.

STEP 5. TIER EVERY ITEM, from where it was said, not from how good it is:
  PUBLIC if a stranger with no relationship to either party could read it: a public comment,
    review, post or recommendation.
  PRIVATE if it was said in a DM, an email, a private group, or a one to one thread.
  CONFIDENTIAL if it was said on a call, is under an NDA, describes a client's private
    figures, or if you cannot determine the channel.
Unknown channel is CONFIDENTIAL, not PRIVATE. Meeting material is CONFIDENTIAL.

STEP 6. WRITE THE REPORT, in this order:
  NEW PUBLIC QUOTES. Verbatim, with speaker, role if captured, date said, source and
    receipt. These are the ones the user can act on fastest.
  NEW PRIVATE QUOTES. Verbatim, with the same fields, each marked NEEDS PERMISSION.
  RESULTS QUOTES. Any quote containing a number, a before and after, or a claimed business
    outcome, listed separately regardless of tier, each marked NEEDS A TYPICALITY CHECK
    BEFORE PUBLICATION.
  CONFIDENTIAL MATERIAL EXISTS. Name the speaker and the date and one line on why it is
    confidential. Do NOT quote it.
  UNVERIFIED. Anything that failed step 4, with which question it failed and the one action
    that would resolve it.
  GAP. Client relationships with no captured praise in this window, with the queries you
    ran to check.
  ESCALATION. Compare against the past reports from step 1 and apply this exactly:
    A person who has appeared in 2 consecutive reports with praise and still has no
      recorded permission: say so, name the number of months, and recommend the user just
      ask them this month.
    A relationship that has appeared in the GAP section for 3 or more consecutive reports:
      do not repeat the same line. Say how many consecutive months, and change the
      recommendation. If you previously suggested waiting for a natural moment, now
      recommend a direct ask. If you already recommended a direct ask, recommend the user
      decide whether this relationship is one they will ever get a testimonial from, and
      stop reporting it.
    A month with no new quotes at all: say so in one line and do not pad the report.

RULES.
Never invent, improve, smooth or complete a quote. Report the exact captured words or
report nothing. Improving a customer's phrasing is fabrication and it is also an FTC
problem.
Never quote confidential or meeting material in this report. Routine reports are stored and
notified, and a client's private figures do not belong in a stored artifact.
Never trim a quote in this report. Report it whole. Trimming happens later with rules.
Do not draft a permission request and do not draft any message to anyone.
Do not state or estimate whether a claimed result is typical. You cannot know that.
Every quote carries a receipt: the thread and the send date, or the source and the date
seen.
Absence of evidence is not evidence of absence. Write no captured praise found in this
window, never write this client is unhappy.
If the window is empty, say the window was empty and stop. Do not widen it and do not
invent quotes or people.
End with one line naming the deep run that resolves the report: open Cowork and run
testimonial-miner for the full bank, the permission tiers, the results sub-bank with its
disclosure flags, and the drafted permission requests.
```

Four properties of that prompt are load-bearing and must survive any edit. It reads its own past
reports before writing. It verifies attribution before reporting anything. It never quotes
confidential material into a stored report. And it escalates by changing the recommendation rather
than repeating it, which is the specific failure observed in production where a routine flagged the
identical top item day after day with no change in approach
(`references/littlebird-mcp-reference.md`).

`UPDATE_ROUTINE` replaces the whole prompt and the whole schedule. Always call
`LB_INTERNAL_GET_ROUTINE_CONFIG` first (`references/littlebird-mcp-reference.md`).

### Handoff to Cowork

The routine ends by naming this skill. The deep run calls `LB_INTERNAL_GET_ROUTINE_REPORTS` before
sweeping, so it inherits the months of quotes already surfaced, the escalation counts, and
anything the user already declined. A quote the user declined to use, or a person who said no, is
never silently re-proposed.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `client-health-radar` | Reads the same relationships for risk. A client with warm praise and a red band is a specific, useful contradiction worth looking at |
| `said-it-already` | Prevents republishing something the user already said. Run it before pushing bank material into public copy |
| `routine-architect` | Owns routine design across the marketplace. Use it if the monthly cadence needs reshaping |
| The voice creator skills in this marketplace | Supply the voice for permission-request drafts. Without one installed, say so rather than imitating a voice from nothing |

## Reference map

| File | Read it for |
|---|---|
| `references/praise-discovery.md` | The five retrieval passes, the ten register families, blocking, and the gap sweep |
| `references/attribution-verification.md` | The five questions, target-of-praise confirmation, the bona fide user check, role and title verification, confidence ratings |
| `references/permission-tiers.md` | The three tiers, assignment table, the three request templates, consent recording, revocation |
| `references/ftc-compliance.md` | The two instruments, penalty exposure, the enforcement record, typicality and the three results flags, material connections, the incentive tripwire |
| `references/quote-formatting.md` | The trimming rules, the bank schema, the strength signals, the artifact shapes, landing page and case study formats |
| `references/littlebird-mcp-reference.md` | Tool names, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, the four kinds, confidence ratings, confirmation gates, reporting on people |
| `references/research/distilled-testimonial-practice.md` | Every domain claim in this skill, cited to a raw source |
| `references/research/README.md` | The archive index, window exceptions, the honest headline, and the named gaps |
