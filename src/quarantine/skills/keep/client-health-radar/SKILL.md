---
name: client-health-radar
description: 'Per-client health rollup for agencies, consultancies and freelancers. Trigger on "which client is about to churn", "client health check", "am I losing this client", "weekly client review", "is this account at risk", "scope creep on this client", "which client is eating my margin", "client went quiet". Builds a ranked risk view per client from meetings, message threads and captured dashboards: unmet promises in both directions, silence gaps against that client''s own cadence baseline, scope creep with the transcript quote where the ask happened, room and register changes, and payment or renewal signals. Bands with named evidence, never a score. Internal view only, nothing goes to the client.'
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Client Health Radar

## Purpose

Answers one question per client: is this one about to leave, and is this one quietly eating my
margin. Those are different clients and a service business usually has both.

Everything it reports is behavior with a date and a receipt. It does not produce a health score
and it does not produce a sentiment score. The reason is in the research and it is not a style
choice: transcription substitutes the emotion-carrying word in roughly one utterance in six, and
utterances with that error are misclassified at nearly double the rate
(`references/research/distilled-client-health.md`, section 6.2). Meanwhile a client quietly asking
for an asset inventory carries no sentiment lexicon at all, and is one of the strongest exit
signals a service business has (`references/research/distilled-client-health.md`, section 4).

The one finding that shaped every design decision here: when the relationship owner's own read on
an account carries weight in the score, retention rates fall and churn rates rise, because owners
want to believe an account stabilized after one good interaction
(`references/research/distilled-client-health.md`, section 3). The user of this skill IS the
relationship owner and has more financial reason than any employee to believe the account is fine.
So the skill is built to argue with its user, with dated evidence they can check.

## Capability gate

This skill requires the Littlebird MCP on a Power or Pro plan.

Before anything else:

1. List the tools actually available in this session and use the real tool names. Do not assume a
   tool exists because it is named in `references/littlebird-mcp-reference.md`.
2. If no Littlebird MCP tools are present, stop and tell the user the skill needs the Littlebird
   MCP connected. Do not attempt a partial run from memory or from other sources.
3. If routine creation is part of the request, call `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` first to
   confirm the plan supports another routine.

Read `references/evidence-standards.md` before writing any output. Every line in the report is
observed, inferred, external or unknown, and the kind is visible to the reader.

## Littlebird MCP calls used

Real tool names, verified against the live server. List the tools actually available in this
session before calling any of them. Full per-family parameters are in
`references/signal-extraction.md`; the shapes are restated in the retrieval brief below.

| Tool | Used for |
|---|---|
| `LB_INTERNAL_LIST_MEETINGS` | `name` plus `start_date`, `end_date`, `limit`. The recurring client call, one call per known title, which is the correct tool for a recurring meeting and its prior instances. Run again with a future `end_date` to see whether the next instance is even on the calendar. Upcoming events carry no id, no summary and no transcript |
| `LB_INTERNAL_SEARCH_MEETINGS` | `query` plus `attendees`, `start_date`, `end_date`, `limit`. Topic sweeps across a client's meetings, one narrow call per theme. **`attendees` is an OR filter and best-effort over the top candidates only**, so a matching meeting can be missed entirely and it never proves someone attended. Reword `query` rather than trusting it |
| `LB_INTERNAL_GET_MEETING` | `meeting_id`. Where most of the evidence comes from: the linked calendar event's attendee list, `## Action Items` with owner tags, `## Decisions` with the decider, `## Risks / Open Questions`, and `## For You` |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | `meeting_id`, and only to locate the exact wording of an out-of-scope ask or a line the user should read. Never for attribution, because transcript chunks are weakly diarized and often tagged `[Others]` |
| `search_user_context` | Four separate passes, each with its own `data_source` filter: `{"data_source": "messages"}` for the client's side of the relationship, `{"data_source": "snapshots"}` for invoices, billing notices and captured dashboards, `{"data_source": "summaries"}` for the cheap compressed fill between meetings, and one unfiltered pass over the suspected quiet period to prove silence deliberately |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | `routine_id`, `limit: 8`. The band history, the hold counts and the user's overrides. The routine calls it on itself before writing; the deep run calls it before extracting anything |
| `LB_INTERNAL_CREATE_ROUTINE` | `title`, `prompt`, `schedule`, `notifications_enabled`, `email_notifications_enabled`. Creating the weekly observer from an interactive session, with the prompt text below |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` and `LB_INTERNAL_UPDATE_ROUTINE` | Changing the observer later. Read the config first, because `prompt` and `schedule` each replace the whole field |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | No parameters. The plan check before a routine consumes a slot |

There is no Littlebird tool that searches past Littlebird chat conversations, and no calendar
tool. Threads come from `search_user_context` with the messages data source, and upcoming
events come from `LB_INTERNAL_LIST_MEETINGS` with a future `end_date`
(`references/littlebird-mcp-reference.md`).

## Trigger

Trigger phrases: which client is about to churn, client health check, am I losing this client,
weekly client review, is this account at risk, scope creep on this client, which client is
eating my margin, client went quiet, has anyone heard from them, should I worry about this
account, set up my client health routine.

Also run it when the weekly routine has reported a band change, a STUCK client or a scope ask,
and the user opens Cowork to act on it. That is the main path.

Do not trigger for: drafting the actual client message, which stops at the approval gate here
and belongs to the owner of that channel; a deal that has not become a client yet, which is
`deal-pipeline-reconstructor`; or chasing a specific invoice, which is `invoice-chaser`.

## Routine cadence

**Weekly, Monday 07:30, plus the deep dive on demand.** Weekly matches the cadence at which the
signals this skill watches actually move: a silence gap and a missed approval are measured in
days, and a daily version would report the same standing state six times before anything
changed.

**Offer to create it, do not tell the user to go do it.** `LB_INTERNAL_CREATE_ROUTINE` works
from an interactive session and is blocked only from inside a running routine. Check the plan
with `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`, name which slot it takes, show the schedule and the
full prompt text from Routine wiring below, get approval through `AskUserQuestion`, then create
it. Creating a routine immediately generates a first report, so read that first report with the
user while they still remember what they asked for.

| Mode | Trigger | Window | Output |
|---|---|---|---|
| **Weekly routine** | Scheduled, unattended | Last 7 days plus carry-forward from its own past reports | A routine report naming what CHANGED. No files, no approvals |
| **Deep dive** | User asks in Cowork or Claude Code, for the whole roster or one client | 90 days, 180 on a first run for a client | The full report file, plus any drafted outreach held for approval |

The routine observes. The deep dive acts. A routine cannot create or update routines and cannot
hold an approval gate open (`references/littlebird-mcp-reference.md`).

## Process

### 0. Roster first, always

If `client-roster.md` exists in the working directory, read it and skip to step 1. If it does not,
run setup before any retrieval.

The roster is confirmed with `AskUserQuestion`, never inferred from capture. Guessing it turns
prospects into clients, splits one client into three, and misses the client who only ever appears
as a domain on a dashboard.

Full procedure in `references/roster-setup.md`: the six alias kinds to ask for, the orienting
sweep that pre-populates the question, the file format, the status values, staleness prompts, and
how unlisted counterparties are surfaced without being reported on.

### 1. Extract signals, per client

Run the retrieval per client, not once across the roster. Narrow parallel queries score better and
avoid the oversized-result file dump (`references/littlebird-mcp-reference.md`).

Full procedure in `references/signal-extraction.md`: the eight-call retrieval brief, and the five
signal families. Unmet promises in both directions. Silence gaps measured against a cadence
baseline derived from that client's own history. Room composition and register change. Scope
creep. Commercial and payment signals.

The governing extraction rule: attribution comes from the meeting summary's `## Action Items` and
`## Decisions` blocks, which carry owner tags. Raw transcript is quoted for WORDING only, never to
prove who said it, because transcript chunks are weakly diarized and often tagged `[Others]`
(`references/littlebird-mcp-reference.md`).

### 2. Apply the sentiment discipline

Read `references/sentiment-limits.md` before writing anything that characterizes a client's mood,
tone or temperature.

The short version: no sentiment score, in any form. Trajectory is produced as a two-column
comparison of the client's own quoted asks, early third of the window against late third, with a
countable structural observation underneath and an explicit line saying it describes what was
asked rather than how they feel.

The guide contains the measured evidence, the failure phenomena that map onto how professional
clients actually talk, the behavioral signals ranked by how much they survive the transcription
problem, and the limitation note that appears verbatim in every report.

### 3. Detect scope creep

Full procedure in `references/scope-creep-detection.md`: establishing the scope baseline before
hunting for departures from it, the phrase families that surface asks (the minimizing family is
the highest-yield one), the four buckets, the quote requirement, and the accumulation arithmetic.

Two rules from that guide that matter enough to restate here. **Every flagged item carries the
quote where the ask happened, with meeting name and date. No quote, no item.** And **if no scope
baseline is found, this family reports that gap and stops for that client.** It does not guess
what was in scope.

Look for user-originated scope creep as well as client-originated. The professional body's cause
list splits internal and external roughly evenly
(`references/research/distilled-client-health.md`, section 5), and the work the user volunteered
is the half nobody reports on themselves.

### 4. Band, rank, recommend

Full procedure in `references/scoring-and-reporting.md`: the four bands including Unknown, the
flag thresholds per family, the ranked list capped at five, the one-action rule, the artifact
structure, and the explicit list of numbers this skill is forbidden to produce.

Bands, not a score. Two independent sources name the single-composite failure: a score "trying to
measure everything, but accurately predicting almost nothing"
(`references/research/distilled-client-health.md`, section 3). Nothing in the archive supports
calibrating a number for a project-based services relationship anyway; the entire published health
score literature is written for subscription software
(`references/research/distilled-client-health.md`, section 2).

## Retrieval brief

The actual calls. Substitute the window and the client's aliases from the roster. Full per-family
detail in `references/signal-extraction.md`.

**Recurring client calls, and their prior instances** (name lookup uses `LIST_MEETINGS`, topic
lookup uses `SEARCH_MEETINGS`; using the wrong one is the most common mistake against this server)

```
LB_INTERNAL_LIST_MEETINGS
  name:       the recurring client meeting title, one call per known title
  start_date: window start
  end_date:   today
  limit:      50
```

Run it again with a future `end_date` to see whether the next instance is on the calendar at all.
Upcoming events carry no id, no summary and no transcript
(`references/littlebird-mcp-reference.md`).

**Topic sweeps across the client's meetings** (one narrow call per theme, not one combined query)

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      client name plus one of: scope, invoice, renewal, budget, waiting on,
              procurement, access or export, a competitor name
  attendees:  the client's contact names from the roster
  start_date: window start
  end_date:   today
  limit:      10
```

`attendees` is an OR filter and best-effort over top candidates only, so a matching meeting can be
missed entirely (`references/littlebird-mcp-reference.md`). Never use it alone to prove someone
attended. If an expected meeting does not appear, reword `query` rather than trusting the filter.

**The structured blocks, which are where most of the evidence comes from**

```
LB_INTERNAL_GET_MEETING
  meeting_id: every recorded id from the calls above
```

Take the attendee list from the linked calendar event, every `## Action Items` line with its owner
tag, every `## Risks / Open Questions` line, every `## Decisions` line with its decider, and the
`## For You` section (`references/littlebird-mcp-reference.md`).

**Transcript, only to locate a specific quote**

```
LB_INTERNAL_GET_MEETING_TRANSCRIPT
  meeting_id: the meeting containing the out-of-scope ask or the line the user should read
```

**Threads, for the client's side of the relationship**

```
search_user_context
  search_queries_messages: [client name plus a contact name,
                            project codename plus "update",
                            contact name plus "waiting"]
  standalone_query:        a one sentence statement of what a thread with this client
                           in this window would contain
  date_range:              {start: window start, end: "now"}
  filters:                 {data_source: "messages"}
```

Message items carry a send time that differs from the collection time. The send time governs the
timeline (`references/evidence-standards.md`, rule 8). Only messages tagged `(From:[user])` are
the user's own (`references/evidence-standards.md`, rule 4).

**Dashboards, invoices and billing, from screen capture**

```
search_user_context
  search_queries: [client dashboard identity plus the tool name,
                   client name plus "invoice",
                   client name plus "overdue"]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "snapshots"}
```

Billing notices, failed charge alerts and named vendor amounts appear in ordinary capture with no
finance integration (`references/littlebird-mcp-reference.md`). Deduplicate OCR fragments before
counting anything.

**The cheap compressed pass, to fill gaps between meetings**

```
search_user_context
  search_queries: [client name, project codename]
  date_range:     {start: window start, end: "now"}
  filters:        {data_source: "summaries"}
```

**Prove silence deliberately**

```
search_user_context
  search_queries: [client name, contact names, project codename]
  date_range:     {start: the suspected quiet period, end: "now"}
```

A negative answer is a real finding and it is how a silence gap earns its receipt. Report the
window and the queries run alongside it.

Read the relevance scores on everything. Items below 3 are omitted by the server entirely, and an
item scored 3 is a maybe that never carries a client-level finding on its own
(`references/littlebird-mcp-reference.md`).

## Empty retrieval

If the roster is confirmed but retrieval returns nothing for a client across the window, report
the client, the window, the aliases used and the queries run, and band that client **Unknown**.
Unknown is not green. A client the skill cannot see is a coverage problem, and the recommended
action is to get the next conversation recorded.

If retrieval returns nothing for every client on the roster, report the window and the counts and
stop. Do not widen the window silently, do not substitute plausible examples, do not reason from
what was probably discussed (`references/evidence-standards.md`, rule 9).

## Output

A deep run writes one file:

```
client-health-YYYY-MM-DD.md
```

A single-client deep dive writes `client-health-<client-slug>-YYYY-MM-DD.md`. Both go in the
working directory, or the directory the user names.

Sections, in order: header with the limitation note; coverage per client; **what changed since the
last report**; the ranked risk list capped at five; per-client detail in roster order; possible
unlisted clients; method. Full specification in `references/scoring-and-reporting.md`.

The roster lives separately in `client-roster.md` and persists across runs.

Never open a report with an industry statistic about client churn or retention. Every such figure
found in the research sweep is attributed at second or third hand with no linkable primary, and
the most-cited agency churn benchmark table discloses no methodology at all
(`references/research/distilled-client-health.md`, section 1). The only rates this skill quotes
are the ones it computed from the user's own captured history.

Raw retrieved capture is working data and does not ship in the artifact
(`references/evidence-standards.md`, rule 7).

## Guardrail

Two risks, both specific to this skill, and the second one is its defining design decision.

### 1. This is an internal view, and nothing goes to the client

**Nothing goes to the client.** This skill produces an internal view. Every artifact it writes
is written for the user to read alone: it names accounts as at risk, quotes what a client asked
for and what the user privately did not push back on, and records scope the user gave away. A
client reading their own file is the worst outcome available here, and it is worse than being
wrong, because the file is accurate.

If the user asks for drafted outreach, the draft is marked at the top as HELD FOR APPROVAL, NOT
SENT. Before any drafted text reaches another person, present the client, the signals behind it,
the evidence with receipts, and the full draft text verbatim rather than a summary of it. Then use
`AskUserQuestion` to offer: send as written, edit first, hold, or drop.

The skill does not send. It hands approved text back
(`references/evidence-standards.md`, rule 6). This holds even where a Gmail, Slack or CRM
connector is live in the session, and even where the user already approved the plan. Approving
a plan is not approving the words.

Scope conversations get one extra step: show the dated out-of-scope record first and get the user
to confirm it matches their memory before any language is drafted
(`references/scope-creep-detection.md`).

### 2. It refuses to emit a score, and the refusal is not negotiable

**No health score. No number out of 100. No sentiment score, no temperature, no mood rating, no
weighted composite, in any form, in any artifact, including a private one and including one the
user asks for directly.** Bands and quoted evidence only, and Unknown is a band rather than a
missing value.

The reasoning is in Purpose above and rests on measurement, not taste: transcription substitutes
the emotion-carrying word in roughly one utterance in six and those utterances are misclassified
at nearly double the rate; the exit signal with the highest yield in a service business carries
no sentiment lexicon at all; a single composite is the named failure mode, a score "trying to
measure everything, but accurately predicting almost nothing"; and the published health score
literature is written for subscription software, so nothing in the archive calibrates a number
for a project-based services relationship
(`references/research/distilled-client-health.md`, sections 2, 3, 4 and 6.2).

A number is the specific danger for this skill because of what it invites. A band with three
dated receipts under it gets read; 72 out of 100 gets tracked, compared week over week, and
acted on as though the difference between 72 and 68 meant something it cannot mean. False
precision here does not produce a slightly wrong answer, it produces a confident one.

The full list of numbers this skill is forbidden to produce is in
`references/scoring-and-reporting.md`, and the register-change method that replaces sentiment
scoring is in `references/sentiment-limits.md`, including the limitation note that appears
verbatim in every report. When a user asks for a score directly, say what the skill produces
instead and why, and offer the trajectory comparison. Do not produce the number to be helpful.

The same discipline governs rates: the only rates this skill quotes are ones it computed from
the user's own captured history, never an industry churn or retention benchmark
(`references/research/distilled-client-health.md`, section 1).

## Routine wiring

Create the weekly observer with `LB_INTERNAL_CREATE_ROUTINE`. Creating it generates a first report
immediately, then it runs on schedule.

```
title:    Weekly client health radar
schedule: {"frequency": "weekly", "time": "07:30", "week_days": ["MO"]}
notifications_enabled: true
email_notifications_enabled: true
```

Exact `prompt` text to pass:

```
You are running a weekly client health radar for a service business. Your job is to
report what CHANGED about each client this week, not to restate the standing state.

STEP 1. MEMORY FIRST. Before anything else, call LB_INTERNAL_GET_ROUTINE_REPORTS for
this routine with limit 8 and read every past report. Build a table: every client you
have reported on, the band you gave them in each report, the top signal you named, and
how many consecutive reports they have held their current band. You need all of this in
step 5. Do not skip this step. A report that restates last week's standing state is a
failed report.

STEP 2. ROSTER. The client roster is not something you infer. Take the client names and
aliases from the most recent past report that lists them. If no past report lists a
roster, say that the roster has not been set up, name the Cowork skill that sets it up,
and stop. Do not guess who the clients are from meeting titles.

STEP 3. GATHER, PER CLIENT. For each client on the roster, run narrow separate queries,
never one broad query. Call LB_INTERNAL_LIST_MEETINGS with the name parameter for each
known recurring client meeting title over the last 14 days, and again with an end_date
one week in the future to see whether the next instance is even on the calendar. Call
LB_INTERNAL_SEARCH_MEETINGS with the client name plus each of these separately: scope,
invoice, renewal, budget, waiting on, procurement, access or export. Call
LB_INTERNAL_GET_MEETING on every recorded meeting id and take the attendee list from the
linked calendar event, the Action Items block with its owner tags, the Risks and Open
Questions block, and the For You section. Do not fetch transcripts. Call
search_user_context with data_source messages for the client name and contact names over
the last 14 days, and again with data_source snapshots for invoice and billing evidence.

STEP 4. SIGNALS. For each client determine, with a date and a receipt on every one:
  a. Open items the client owes the user, especially approvals, access, assets and
     payment, with the age counted from when the item was FIRST committed, not last
     restated.
  b. Open items the user owes the client, same aging rule.
  c. Days since the last substantive captured contact, and the client's own normal gap
     computed as the median gap between their previous contacts. Report both numbers and
     say how many intervals the median came from. If fewer than four intervals exist, say
     the baseline is not derivable rather than inventing one.
  d. Any change in who attended: a regular person missing across two instances, a new
     name appearing, or client-side headcount dropping. Take attendees from the calendar
     event, never from a transcript.
  e. Any explicit request for account access, exports, source files, asset inventories or
     documentation not previously needed. Quote it.
  f. Any commercial signal: a late invoice, a budget or pause discussion, a renewal
     inside 60 days, or a renewal conversation postponed.
  g. Any out-of-scope ask. Quote the actual line. If you cannot locate the line, do not
     report the item.

STEP 5. BAND AND COMPARE. Give each client a band: GREEN for no flagged signals, AMBER
for one flagged signal or two watch-level ones, RED for two or more flagged signals or
any escalation, UNKNOWN when there were fewer than two recorded meetings and fewer than
three thread exchanges this window. UNKNOWN is not GREEN. Then compare every band against
the past reports from step 1 and apply this rule exactly:

  Moved worse this week: report it first, name the previous band, and name the single
    new signal that moved it.
  Moved better this week: report it, and say specifically what resolved.
  Held the same band for 1 or 2 reports: one line each, no elaboration.
  Held the same band for 3 or more reports: do NOT repeat the same signal and the same
    recommendation you already gave. Open the report with these under a heading called
    STUCK, state how many consecutive weeks the client has been there, and change the
    recommendation. If you have already recommended a written follow-up, recommend a live
    conversation instead. If you have already recommended a live conversation, recommend
    a decision: renegotiate the engagement, escalate to a senior contact on their side,
    or accept the risk and stop spending attention on it.
  Green and unchanged: one combined line listing the names. Do not give them sections.

STEP 6. WRITE. Report in this order: STUCK clients first if any exist. Then moved worse.
Then moved better. Then a ranked list of at most five at-risk clients, each with one
recommended action naming a person and a channel. Then one line for the green clients.
Then coverage, meaning per client how many meetings were recorded, how many calendar
events went unrecorded, and which clients you could not see at all.

RULES.
Do not produce a health score, a number out of 100, or a sentiment score of any kind.
Bands and quoted evidence only.
Do not characterize how a client feels. Report what they did, what they asked for, and
what changed. Quote their words and let the reader judge the tone.
Absence of evidence is not evidence of absence. Write no captured contact in N days,
never write they have gone silent.
Every claim carries a receipt: the meeting name and date, or the thread and the send
date.
Take who said what from the Action Items and Decisions blocks, never from a transcript
chunk, because transcript chunks are weakly diarized and are often tagged Others.
Do not quote any industry churn statistic, retention benchmark or published average. The
only rates you may use are ones you computed from this user's own history.
Do not draft or send any message to anyone. Recommend, and stop there.
If retrieval returns nothing for the whole window, say the window was empty and stop. Do
not widen the window and do not invent clients or signals.
End with one line naming the deep run that resolves the report: open Cowork and run
client-health-radar for the full per-client report, the scope creep record with quotes,
and any drafted outreach.
```

Three properties of that prompt are load-bearing and must survive any edit. It reads its own past
reports before writing. It reports change rather than standing state. And it escalates by changing
the recommendation rather than repeating it, which is the specific failure observed in production
where a routine flagged the identical top item day after day with no change in approach
(`references/littlebird-mcp-reference.md`).

`UPDATE_ROUTINE` replaces the whole prompt and the whole schedule. Always call
`LB_INTERNAL_GET_ROUTINE_CONFIG` first (`references/littlebird-mcp-reference.md`).

### Handoff to Cowork

The routine ends by naming this skill. The deep run calls `LB_INTERNAL_GET_ROUTINE_REPORTS` on the
radar routine before extracting anything, so it inherits the band history, the hold counts, and
anything the user already marked as a false positive or overrode. Bands the user overrode are
never silently re-applied (`references/roster-setup.md`).

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | The boundary |
|---|---|
| `commitment-tracker` | Owns the promise ledger across everyone, in both directions, and owns the nudge draft. This skill takes only the client-scoped slice of it, because an unmet promise in either direction is one of the strongest churn signals a service business has: what the client owes the user is the leading edge of disengagement, and what the user owes the client is the leading edge of a fair complaint. Reach for `commitment-tracker` when the question is what is outstanding everywhere; stay here when the question is which account it is costing. |
| `meeting-scribe` | Owns the single meeting: the summary, the decisions, the action items that this skill later reads as signal. Reach for it right after a call. Come here when the question spans a client's meetings rather than one of them. |
| `invoice-chaser` | Owns receivables, the chase sequence and the payment draft. Payment signals cross both ways: a late invoice is a health signal here and a collection item there. This skill reports the signal with its date and hands the chasing over rather than drafting it. |
| `deal-pipeline-reconstructor` | Owns the relationship before it is a client, and the stage history. The handoff point is the roster: someone on `client-roster.md` is this skill's, someone still in the pipeline is theirs. A prospect banded as a client is the roster error `references/roster-setup.md` exists to prevent. |
| `weekly-review` | Composes the week from the siblings' own reports and takes band changes from this one. It never re-derives per-client detail; when its scorecard names a client, the detail is here. |

## Reference map

| File | Read it for |
|---|---|
| `references/roster-setup.md` | The setup conversation, the six alias kinds, the roster file format, staleness and maintenance |
| `references/signal-extraction.md` | The per-client retrieval brief and the five signal families, including cadence baseline derivation |
| `references/sentiment-limits.md` | What this can and cannot detect about mood, the measured evidence, and the register-change method that replaces sentiment scoring |
| `references/scope-creep-detection.md` | Scope baseline, ask detection, the quote requirement, the four buckets, accumulation arithmetic |
| `references/scoring-and-reporting.md` | The four bands, flag thresholds, ranking, the artifact spec, and the forbidden numbers |
| `references/littlebird-mcp-reference.md` | Tool names, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, the four kinds, confidence ratings, confirmation gates |
| `references/research/distilled-client-health.md` | Every domain claim in this skill, cited to a raw source |
| `references/research/README.md` | The archive index, the window exceptions, and the named gaps |
