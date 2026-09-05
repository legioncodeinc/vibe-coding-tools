---
name: competitor-watch
description: "Competitive intelligence, competitor tracking, market radar, weekly competitive digest, competitor deep dive, new entrant detection, watchlist. Logs every sighting of a tracked competitor or market shift that crossed your screen (posts, screenshots, demos, community threads, calls), ranks by velocity rather than volume, catches names entering your field of view for the first time, and reconciles that against external research on pricing, positioning, launches, funding, and personnel."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan), plus any web search and fetch tools available in the session"
---

# Competitor watch

Competitive and market intelligence built from what actually crossed your screen, fused
with external monitoring.

**The thing this does that nothing else does.** Every competitive intelligence product in
the category monitors a supplied list of names and URLs, and two of them literally bill per
competitor tracked. That model cannot surface a name nobody typed in, and it cannot tell you
what your market is talking about this week. This skill reads your own field of view. A
competitor that turns up three times in one week across a client call, a community thread,
and a friend's screenshot is a signal no URL monitor produces. That is the spine of the
skill, and the sightings log, the velocity ranking, and the new-entrant detection all exist
to serve it.

It is not another news digest. If the external half is all that runs, say so and say why.

## Purpose

Keep a named set of competitors and market shifts under observation on a weekly beat, built
first from what actually crossed the user's screen and only then from external monitoring, so
the output is what moved in this user's market rather than what a press release said.

Three failures it exists to prevent:

1. **The list nobody can leave.** URL monitors only see names somebody already typed in. A
   competitor entering the field of view for the first time is invisible to them, so
   new-entrant detection is a first-class output here rather than a feature.
2. **Volume mistaken for velocity.** Ten steady mentions is not news. Zero to four is. Ranking
   by raw count produces a digest that reports the same three incumbents forever.
3. **The manufactured week.** A recurring digest that invents analysis to fill a quiet period
   earns its way into the ignored pile. A quiet week gets one line.

## Capability gate

**List the tools available in this session and use the real tool names.** Do not assume the
names in this file are spelled the way your session spells them, and do not assume a tool
exists because it is named here.

- **Required:** the Littlebird MCP, on a Power or Pro plan. If `search_user_context` is not
  available, the MCP is not connected. Stop and tell the user. There is no degraded mode
  worth shipping: without the internal half this is a web search with extra ceremony, and
  the user deserves to be told that rather than handed one.
- **Expected:** whatever web search and fetch tools the session carries. Sessions differ.
  List them and use the real names. If none are present, produce the internal half in full,
  mark the external and reconciliation sections as unrun with the reason, and say plainly
  that reconciliation is the section that needed both halves.
- **Plan check:** `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` when you need to explain a routine
  limit or a capability gate to the user.

## Littlebird MCP calls used

| Call | Used for |
|---|---|
| `search_user_context` with `filters: {"data_source": "snapshots"}` | Pass 1, one query per Tier 1 entity: primary name plus strongest alias plus the disambiguation term. Pass 2, category-shaped queries that name no entity, which is what surfaces untracked names |
| `search_user_context` with `filters: {"data_source": "messages"}` via `search_queries_messages` | Pass 3. The same entity names, against what people are telling the user directly |
| `search_user_context` with `filters: {"data_source": "summaries"}` | Pass 5, optional. The compressed day view, used to find windows worth sweeping in detail on a backfill |
| `LB_INTERNAL_SEARCH_MEETINGS` with `query` | Pass 4. Competitor names as topic queries, plus shortlist language: also looking at, who else are you talking to, currently using. Topic lookup, not name lookup |
| `LB_INTERNAL_GET_MEETING` with `meeting_id` | The structured summary for any meeting hit, read before the transcript. Attribution comes from the owner-tagged Decisions and Action Items blocks, never from chunks tagged `[Others]` |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` with `meeting_id` | Wording only, for a line the summary already located and already attributed |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` with `routine_id` and `limit` | The weekly routine's own past reports. Read before any sweep, by the routine and by the on-demand deep dive alike, so neither restates what the user already read |
| `LB_INTERNAL_CREATE_ROUTINE` with `title`, `prompt`, `schedule`, `notifications_enabled`, `email_notifications_enabled` | Creates the weekly digest, from an interactive session, after the user approves the prompt text |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` then `LB_INTERNAL_UPDATE_ROUTINE` with `routine_id` | Editing the routine. `prompt` and `schedule` each replace the whole value, so always read the current config first |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Plan check before offering to create the routine. Routine count is plan-limited |

Every `search_user_context` call carries `date_range`: week by week for the digest, month by
month for a backfill. At most 7 queries per call, split across parallel calls rather than
widened into one.

External monitoring runs on whatever web search and fetch tools the session actually carries.
There is no Littlebird web search tool. List the session's tools and use their real names.

## Trigger

- "competitive intelligence", "what are our competitors doing", "competitor tracking"
- "weekly competitive digest", "what moved in the market this week"
- "deep dive on COMPETITOR", "who else are we up against", "new entrant"
- "add this to the watchlist", "update the watchlist"
- The weekly routine fires and the user comes to collect

Two modes:

| Mode | When | Window | Output |
|---|---|---|---|
| **Weekly routine** | The standing beat | Since the last report | A routine report. Observes only: no files, no external research, no approvals |
| **On-demand deep dive** | One competitor or one question | The full history, swept month by month | The deep-dive file, with the external half and the reconciliation |

## Routine cadence

**Weekly, Monday 07:30 local,** so the week's competitive picture lands before the week's
calls. Confirm the day and time with the user. The research archive supports a weekly beat
but not a specific weekday.

Routines can be created from an interactive session. Offer to create this one, show the user
the exact prompt text and schedule from **Routine wiring** below, get approval with
`AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Do not tell the user to go set it
up by hand. Check `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` first, because routine count is
plan-limited. Creation is blocked only from inside a running routine, which is why the
routine itself never does this.

## Read before running

| File | What it carries |
|---|---|
| `references/watchlist-setup.md` | The setup interview, the watchlist file shape, the propose-never-add rule |
| `references/sighting-extraction.md` | The five retrieval passes, deduplication, the counting convention, velocity math |
| `references/new-entrant-detection.md` | Category-shaped queries, the three-way diff, candidate grading, honest limits |
| `references/external-monitoring.md` | The per-entity checklist, sourcing rules, reconciliation, the so-what rules |
| `references/ethics-and-boundaries.md` | The screen-share rule, the prohibited list, what this skill refuses |
| `references/digest-template.md` | The exact shape of both output artifacts |
| `references/evidence-standards.md` | Receipts, the observed / inferred / external / unknown split, the confirmation gates |
| `references/littlebird-mcp-reference.md` | Verified tool inventory, parameters, and known limitations |
| `references/research/distilled-competitive-intelligence.md` | The cited domain distillation behind every practice claim in this skill |

## Process

### 1. Establish or confirm the watchlist. Before any retrieval.

Read `references/watchlist-setup.md` and run the setup interview with `AskUserQuestion`:
market frame, Tier 1 competitors, Tier 2 adjacent names, aliases and product names and
domains and founder names, tracked topics and shifts, and ambiguity traps.

If a watchlist already exists at `competitor-watch/watchlist.md`, read it, show the user the
current list with its last-confirmed date, and ask what changed. Confirm quarterly at
minimum.

Retrieval without a watchlist degrades into an unbounded sweep, which overflows the result
limit and returns noise. Do not skip this step.

### 2. Run the internal passes.

Read `references/sighting-extraction.md`. Five narrow parallel passes, all windowed:

| Pass | Tool and filter | Queries |
|---|---|---|
| 1 | `search_user_context`, `data_source: snapshots` | One per Tier 1 entity: primary name plus strongest alias plus the disambiguation term |
| 2 | `search_user_context`, `data_source: snapshots` | Category shapes from the market frame: alternative to, pricing page, we switched to, launch, raised funding, demo of, has anyone tried, our stack |
| 3 | `search_user_context`, `data_source: messages` via `search_queries_messages` | Same entity names. What people are telling the user directly |
| 4 | `LB_INTERNAL_SEARCH_MEETINGS` | Competitor names as topic queries, plus shortlist language: also looking at, who else are you talking to, currently using |
| 5 | `search_user_context`, `data_source: summaries` | Optional. Backfills over long windows only |

At most 7 queries per call. Separate parallel calls rather than one wide call. Sweep week by
week for the digest, month by month for a backfill.

For any meeting hit, read the structured summary from `LB_INTERNAL_GET_MEETING` before the
transcript. Take attribution from the Decisions and Action Items blocks, never from raw
transcript chunks tagged `[Others]`.

**A competitor named by a client or prospect on a call is the highest-value sighting this
skill produces.** Surface those first.

### 3. Deduplicate, then build the sightings log.

Collapse consecutive captures of the same page, list and detail views of the same thread, a
notification and the item it points to, and the same article in two tabs. Undeduplicated
counting manufactures velocity that does not exist.

Record date, entity, source app, context type, whose screen it was, a one-line summary, a
receipt, and a confidence rating. Sort chronologically. Retrieval returns relevance order,
not time order.

### 4. Count frequency, compute velocity.

Rank by velocity against the trailing baseline, not by raw volume. Zero to four is a bigger
event than ten to eleven, and the digest says so. Where no prior periods exist, report raw
counts and say the baseline is unavailable.

Apply the counting convention in `references/sighting-extraction.md`, and state in the
output that it is a working convention rather than a researched constant. The weak-signals
literature is explicit that no practical formula separates signal from noise, so a skill
that presents a threshold as settled science is lying.

### 5. Detect new entrants.

Read `references/new-entrant-detection.md`. Extract candidate names from the category
passes and the meeting pass, then diff three ways: against the watchlist including aliases,
against the `Declined` list, and against prior periods. Report first appearances and
recurring-but-untracked separately. One bounded external check per candidate that cleared
the threshold.

**Propose. Never add.** Candidates go into `Proposed, awaiting confirmation` with their
evidence and a promote, decline, or defer decision from the user.

### 6. Run the external half.

Read `references/external-monitoring.md`. Per Tier 1 entity: pricing, positioning, product
and launches, funding, personnel, public claims. Tier 2 gets funding, launch, and
positioning only unless it produced internal sightings this period.

Every external claim carries a URL and a date, and a vendor claim is reported as a claim.
On the first run most of this is baseline rather than change, and the digest says so.

### 7. Reconcile.

What they say about themselves against what your market is saying about them. Agreement,
divergence, and the possible readings of each divergence marked as inference. Conflicts stay
conflicts. Do not resolve a disagreement by picking the more interesting reading.

### 8. Write the so-what, fenced off.

Three points maximum, explicitly marked as inference, each naming the observations it rests
on and what would make it wrong. A quiet period gets one line. Manufacturing analysis to
fill the section is how a recurring digest earns its way into the ignored pile.

### 9. Write the artifact.

Per `references/digest-template.md`.

## Output

| Mode | Path | Contents |
|---|---|---|
| Weekly routine digest | `competitor-watch/digests/YYYY-MM-DD-competitor-watch.md` | What moved, new in your field of view, frequency and velocity table, chronological sightings log, what changed externally, internal versus external reconciliation, so-what, gaps, provenance |
| On-demand deep dive | `competitor-watch/deep-dives/YYYY-MM-DD-<entity-or-question>.md` | Short answer, full sighting history, trajectory, external profile, external timeline, reconciliation, where they show up against you, so-what, gaps, provenance |
| Watchlist | `competitor-watch/watchlist.md` | Market frame, Tier 1, Tier 2, topics, proposed, declined |

Confirm the base directory with the user on first run. All three files are internal working
documents.

## Evidence standards

Apply `references/evidence-standards.md` in full. The rules that bite hardest here:

- **Receipts on every internal claim, URLs on every external claim.** A claim with neither
  is an inference and gets labeled as one.
- **Observed, inferred, external, unknown, and the kind is visible to the reader.** The
  so-what section is entirely inference and is fenced accordingly.
- **Screen capture shows what the user was viewing, not what they wrote.** A sighting proves
  something was on screen. It does not prove the user endorsed it, shared it, or wrote it.
- **Partial rosters reported as partial.** Collapsed UI lists produce incomplete sets by
  construction.
- **Absence is absence.** "No sightings of X in this window" is supportable. "X went quiet"
  is not.

## Empty retrieval

If the passes return nothing for the window: report the gap and stop. Name the window, the
passes run, and the entities searched. "No sightings of any tracked entity between DATE and
DATE across snapshots, messages, and meetings" is a correct and useful output.

Do not pad from training data, do not substitute plausible examples, and do not convert
silence into a claim that the market was quiet. If the external half also returns nothing,
say the period produced no evidence in either direction and offer to widen the window.

## Guardrail

**The risk this skill carries is the line between competitive awareness and taking something
you were not entitled to have, and the skill sits close enough to that line to need it stated
in the body rather than filed in a guide.**

Read `references/ethics-and-boundaries.md` before the first run. The line: intelligence from
what you legitimately saw in the ordinary course of business is normal competitive
awareness, and every enforcement case in the research archive involves somebody taking,
accessing, or buying material they were not entitled to have, never somebody drawing a
conclusion from something they saw. Deliberately mining a partner's or client's screen share
for their confidential data is the other thing, and this skill refuses it. Material under
NDA or shared in confidence stays out entirely. **Third-party content is theirs, not yours:
screen capture of another person's post, dashboard, or screen share is competitive input,
the intelligence derived from it stays internal, and nothing captured from another person's
screen gets republished, quoted publicly, or shared outward.**

## Routine wiring

The weekly digest runs as a Littlebird routine. Offer to create it, show the user the exact
schedule and prompt text below, get approval with `AskUserQuestion`, then call
`LB_INTERNAL_CREATE_ROUTINE`. Creating it generates a first report immediately, then it runs
on schedule. Do not tell the user to go set it up by hand. A routine cannot create or rewrite
routines, so this step never happens from inside a running routine.

**Schedule:** `{"frequency": "weekly", "time": "07:30", "week_days": ["MO"]}`. Monday
morning, so the week's competitive picture lands before the week's calls. Confirm the day
and time with the user; the archive supports a weekly beat but not a specific weekday.

**Title:** `Competitor watch weekly`

**Prompt text, pass verbatim:**

```
Weekly competitive intelligence sweep for the last 7 days.

FIRST, BEFORE ANY SEARCHING: read your own previous reports with
LB_INTERNAL_GET_ROUTINE_REPORTS, limit 8. Build a list of every entity, new-entrant
candidate, and external change you have already reported, with the date you first
reported each one. You are reporting what is NEW and what is ACCELERATING this week.
You are not restating the standing competitive landscape. Anything you already
reported and that has not moved does not get repeated.

Then read the watchlist at competitor-watch/watchlist.md if it is available to you. If it
is not, use the tracked entity names carried in your previous reports and say in the
report that you worked from report history rather than the current watchlist.

Then run these searches, all bounded to the last 7 days:

1. search_user_context with filters data_source snapshots, one query per tracked
   entity using its name plus its strongest alias. Maximum 7 queries per call, split
   across calls if needed.
2. search_user_context with filters data_source snapshots, category-shaped queries
   that do not name any entity: alternative to, pricing page, we switched to, launch
   announcement, raised funding, has anyone tried, our stack.
3. search_user_context with filters data_source messages, same entity names, using
   search_queries_messages.
4. LB_INTERNAL_SEARCH_MEETINGS with each tracked entity name as the query, plus
   shortlist language: also looking at, who else are you talking to, currently using.
   A competitor named by a client or prospect on a call is the most important sighting
   you can find. Report those first.

Deduplicate before counting anything. Consecutive captures of the same page, a list
view and a detail view of one thread, a notification and the item it points to, and
the same article in two tabs are ONE sighting. Undeduplicated counting invents trends.

Then write the report in this order:

WHAT MOVED. Maximum three items, ranked by change against the prior weeks in your
report history, not by raw count. Something going from zero mentions to four is a
bigger finding than something steady at ten. One line each, with a receipt.

NEW IN YOUR FIELD OF VIEW. Names appearing for the first time across all your prior
reports, separated from names that appeared before but were never added to the
watchlist. Each with its first sighting, source app, context, and receipt. Propose
them for the watchlist. Do NOT treat them as tracked. Do not re-propose a name the
user already declined.

SIGHTINGS LOG. Chronological. Date, entity, source app, context type, one-line
summary, receipt.

STILL RUNNING. One line per item you have now reported in three or more consecutive
weeks with no change. Name it, give the week count, and say the standing read has not
moved. Do not re-explain it. If any such item has now appeared for four or more
consecutive weeks, escalate it: state plainly that it has been open for that long, that
weekly observation is not resolving it, and name the specific decision or deep dive the
user should run in Cowork with the competitor-watch skill.

QUIET WEEK RULE. If nothing is new and nothing accelerated, write exactly one line
saying so, plus the sightings log if there were any sightings at all, and stop. Do not
manufacture analysis. Do not restate the landscape. A one-line report is the correct
output for a quiet week.

EVIDENCE RULES. Every internal claim carries a receipt in the form
[Day, Month DD, YYYY HH:MM TZ | app]. Screen capture shows what was VIEWED, not what
the user wrote or endorsed. Collapsed UI lists ("and 4 others") make any roster partial,
so report the named set and the size of the unnamed gap. If the searches return nothing,
say so and stop. Never fabricate to fill a section.

BOUNDARIES. Content that was on the user's screen because another person put it there
is competitive input and the intelligence stays internal. Never quote or reproduce
another party's confidential material, screen share contents, dashboards, or anything
shared under NDA. Report the market fact, not the other party's private data.

Close with one line naming what the user should open in Cowork if anything here needs
work: the competitor-watch skill, for a deep dive on a named entity or to update the
watchlist.
```

**Notifications:** enable push. Email is the user's call.

**Handoff to Cowork.** The routine observes and reports; it does not write files, run
external research, or ask for approvals. When the routine surfaces a new-entrant candidate,
an escalated repeat item, or a divergence worth chasing, the user opens Cowork and runs this
skill on demand. The on-demand run reads the routine's own past reports via
`LB_INTERNAL_GET_ROUTINE_REPORTS` before doing anything else, so the deep dive starts from
what the routine already established rather than from scratch.

**Updating the routine.** `LB_INTERNAL_UPDATE_ROUTINE` replaces the whole prompt and the
whole schedule. Always read `LB_INTERNAL_GET_ROUTINE_CONFIG` first and edit from the current
text.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `research-synthesizer` | The same internal-plus-external fusion, but one topic answered once and deeply, where this tracks named entities on a recurring beat |
| `content-repurposer` and `brand-voice-guardian` | The market-facing side. A positioning finding here becomes outbound material there, and nothing captured from another person's screen crosses that boundary |
| `weekly-review` | The operational weekly beat. This one is the market beat that sits alongside it |
| `routine-architect` | Owns routine design across the marketplace. Use it if the weekly cadence needs reshaping |
