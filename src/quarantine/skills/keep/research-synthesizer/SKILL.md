---
name: research-synthesizer
description: "Research a topic and get the delta, not another wall of reading. Trigger on 'research this topic', 'what do I already know about', 'catch me up on', 'synthesize what I have read', 'is what I think about this still true', 'deep dive on a topic', 'what did I miss on', 'brief me on'. Pulls what the user has already encountered on screen and in messages about the topic, layers a fresh external sweep over it, and returns a synthesis split into what they already had, what is new since then, where the sources disagree, what they appear to believe based on what they actually said, and what is still open. Every external claim carries a URL. Optional recurring mode watches a standing topic and reports only what is new."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan), plus any web search and fetch tools available in the session"
---

# Research synthesizer

Turn ambient reading into an asset. Give it a topic, get back a synthesis that knows what
already crossed your screen.

**The structural insight.** An ordinary research tool starts from zero. It hands back a pile
of material you have partly already read, which wastes your time twice: once reading it the
first time and once reading it again, buried in which is the one thing that actually changed.
This skill knows what you were exposed to and when, so it can lead with the delta. The
already-knew versus new split is the product, not a formatting choice.

It also does something no external tool can: it compares what you have **said** about the
topic against what is true now. A user discovering their working assumption is three months
stale is the best output this skill produces.

## Purpose

Answer one topic question once, deeply, with the internal and external halves fused, and with
the boundary between what the user already had and what is new made explicit and cited.

Three failures it exists to prevent:

1. **Re-reading.** The user spends an hour on a research report to find the two paragraphs
   that were not already in their head.
2. **Silent staleness.** The user's working model of a moving topic is months old and nothing
   in their day surfaces that fact.
3. **Uncheckable synthesis.** A confident, well-formatted answer with no URLs, no dates, and
   no record of what was searched. That is the failure this skill would be most likely to
   commit, because a synthesis reads as authoritative by construction.

## Capability gate

**List the tools actually available in this session and use the real tool names.** Do not
assume a tool exists because it is named in this file or in
`references/littlebird-mcp-reference.md`.

- **Required:** the Littlebird MCP, on a Power or Pro plan. If `search_user_context` is not
  available, the MCP is not connected. Stop and tell the user. Without the internal half this
  skill has no delta to produce and it degrades into an ordinary web search, and the user
  deserves to be told that rather than handed one.
- **Expected:** whatever web search and fetch tools the session carries. Sessions differ.
  List them and use the real names. If none are present, produce the internal half in full,
  mark the external half, the disagreement section and the delta as unrun with the reason,
  and say plainly that the delta is the section that needed both halves.
- **Plan check:** `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` before offering to create a routine,
  to confirm the plan supports another one.

Read `references/evidence-standards.md` before writing any output.

## Littlebird MCP calls used

| Tool | Used for |
|---|---|
| `search_user_context` with `filters.data_source: "snapshots"` | The exposure inventory. What material on this topic was on screen, and when. **Exposure only, never a position** |
| `search_user_context` with `filters.data_source: "messages"` via `search_queries_messages` | What the user actually said about the topic in threads. A message tagged `(From:[user])` is the strongest retrieved evidence of a position |
| `search_user_context` with `filters.data_source: "summaries"` | The cheap compressed sweep, used to locate days worth a narrow re-query |
| `search_user_context` with no `data_source` filter | The deliberate absence pass, to prove the user has no captured exposure to a development the external sweep found |
| `LB_INTERNAL_SEARCH_MEETINGS` | The topic discussed on calls. Topic lookup, not name lookup |
| `LB_INTERNAL_GET_MEETING` | Attribution, from the owner-tagged Decisions and Action Items blocks. Never from raw transcript |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Exact wording only, for a line the summary already located and already attributed |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | The standing-topic routine's own past reports, read before any sweep so the baseline is established |
| `LB_INTERNAL_CREATE_ROUTINE` / `LB_INTERNAL_UPDATE_ROUTINE` / `LB_INTERNAL_GET_ROUTINE_CONFIG` | Offer, create and maintain the standing-topic routine |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Plan check before creating a routine |

There is no Littlebird tool that searches past Littlebird chat conversations.
`search_user_context` is the substitute and this skill says so where it matters.

## Trigger

- "research this topic", "deep dive on", "brief me on", "catch me up on"
- "what do I already know about", "what have I read about", "synthesize what I have read"
- "is what I think about this still true", "am I out of date on"
- "what did I miss on", "what changed with"
- The standing-topic routine fires and the user comes to collect

Two modes:

| Mode | When | Window | Output |
|---|---|---|---|
| **On demand** | The default. One topic, answered once, deeply | 180 days internal by default, swept in blocks | The full synthesis file |
| **Standing topic** | The user wants a topic watched | Since the last report | A routine report naming only what is new. No files, no approvals |

The routine observes. The on-demand run does the work. A routine cannot hold an approval gate
open and cannot create routines (`references/littlebird-mcp-reference.md`).

## Routine cadence

**On demand is the primary mode.** This skill answers a question; it is not a beat.

Where the user wants a standing topic watched, the default is **weekly, Wednesday, 08:00
local**. Weekly rather than daily because a topic that produces something worth reporting
every day is a topic the user is already living inside. Mid-week rather than Monday so it does
not compete with the operational briefs in this marketplace.

Offer monthly instead for a slow-moving topic. A routine that reports "nothing new" three
weeks running should be moved to monthly, and the routine prompt below says so.

## Process

### 1. Scope the topic. Before any retrieval.

Read `references/topic-scoping.md` and run the interview with `AskUserQuestion`: the question
behind the topic, scope boundaries, the alias and vocabulary list, the exposure window, what
the user thinks they already know, and whether this is a standing topic.

**The alias list is the highest-value answer.** Captured material is indexed by the words that
were actually on screen. A topic stated in the user's abstract vocabulary retrieves nothing if
the screen said something else.

**The stated position is the second highest.** It is the strongest possible evidence of a
belief and the one form that needs no attribution caveat. Capture it verbatim.

Rapid review guidance puts stakeholder involvement before the protocol
(`references/research/distilled-research-synthesis-method.md`, section 2). This step is that.

### 2. Run the internal passes.

Read `references/internal-exposure-retrieval.md`. Five passes, all windowed, run as narrow
parallel queries rather than one broad one:

| Pass | Tool and filter | What it gets |
|---|---|---|
| 1 | `search_user_context`, `snapshots` | The exposure inventory. Topic term plus every alias plus associated names |
| 2 | `search_user_context`, `messages` | What the user said about it in threads |
| 3 | `LB_INTERNAL_SEARCH_MEETINGS` | What the user said about it on calls |
| 4 | `search_user_context`, `summaries` | The compressed sweep, to find days worth re-querying |
| 5 | `search_user_context`, unfiltered | The absence pass. Run AFTER the external sweep, using terms for what the external half found |

Classify every item at the moment of extraction into exposure, utterance, ambient, or
unclear. Unclear defaults to drop. Deduplicate before counting anything.

### 3. Run the external sweep.

Read `references/external-sweep-and-source-grading.md`. Primary and official sources first,
then independent coverage, then vendor material, then community.

**Run the criticism query on every topic without being asked.** A sweep that only runs the
topic term returns the material with the strongest search-optimized incentive behind it, and
non-publication of unfavourable findings is documented behaviour rather than suspicion
(`references/research/distilled-research-synthesis-method.md`, section 5).

**Open every URL before citing it.** Do not cite a link a search result showed you and you did
not fetch. If it will not resolve, drop the claim.

### 4. Grade every source.

Type and reliability, stated rather than assumed. Primary, official documentation,
independent research, journalism, practitioner writing, vendor content, community,
aggregator. Check who funded it. Report a vendor claim as a claim.

Where the available material is dominated by parties with a commercial interest, **say so as a
finding in the source list header**, not as a caveat at the end.

Grade unfamiliar sources laterally: leave the page and look up the publication, the funding
organization, the author. Domain expertise does not substitute for this. In the founding
study the PhD historians lost to fact checkers who left the page first
(`references/research/distilled-research-synthesis-method.md`, section 4).

### 5. Run the absence pass.

Now that the external half has produced a list of developments, go back and check the
internal record for exposure to each one. A negative is what makes the staleness flags
possible.

### 6. Write the synthesis.

Read `references/synthesis-and-delta.md`. Seven sections, in order, with every observation
section finished before a single interpretive line is written.

The order is the method: preliminary synthesis before exploring relationships, and robustness
assessed as a separate step after the synthesis exists
(`references/research/distilled-research-synthesis-method.md`, section 3).

## Output

**One file per run:** `research-synthesis/YYYY-MM-DD-<topic-slug>.md`. Confirm the base
directory with the user on the first run.

Seven sections, in this order:

| # | Section | Contents |
|---|---|---|
| 1 | **Already in your context** | Chronological exposure table: date, what, where, kind (exposure / utterance / ambient), receipt. Plus the compression paragraph, the mandatory completeness statement, and up to three did-not-act observations |
| 2 | **New since then** | Table: date, finding, source with type and URL, relation to your exposure (postdates / extends / contradicts / predates and uncaptured). Contradictions first. Staleness flags where exposure predates a significant change |
| 3 | **Where your sources disagree** | Internal against external, and external against external. Both positions with URLs, the kind of disagreement, who has an interest, the preferred reading and why, or an explicit statement that it is unsettled |
| 4 | **What you appear to believe** | Only from utterances. The quoted words, the date, the receipt, what the sweep says now with a URL, and the gap stated flatly. Empty by design where there are no utterances, and it says so |
| 5 | **Open questions** | Each with why it is open and what specifically would resolve it. No question ships without a resolving action |
| 6 | **Source list** | Title, URL, date, type, interest, one-line reliability note. Headed by the composition summary |
| 7 | **Method** | The scope block, every query verbatim with tool and window, sources reviewed against kept, and what was not covered |

The file is an internal working document.

## Evidence standards

Apply `references/evidence-standards.md` in full. The rules that bite hardest here:

- **Receipts on every internal claim, URLs on every external claim.** A claim with neither is
  an inference and is labelled as one.
- **Observed, inferred, external, unknown, and the kind is visible to the reader.** Sections
  1, 2, 3 and 6 are observation. Interpretation lives on its own marked lines.
- **Screen capture shows what the user was viewing, not what they wrote.** This governs
  section 4 completely.
- **Absence is absence.** "No captured exposure to X in this window" is supportable. "You did
  not know about X" is not.
- **Confirm before you encode.** Anything the synthesis is about to record as a durable fact
  about the user's position gets confirmed with the user first
  (`references/evidence-standards.md`, rule 6).

## Empty retrieval

If the internal passes return nothing on the topic: say so, name the window, the passes run,
and every alias searched. Then offer two branches with `AskUserQuestion`: widen the window and
re-run, or run the external half alone **clearly labelled as an ordinary literature scan with
no delta**, because with no internal half there is no already-knew versus new split.

If the external sweep returns nothing that postdates the exposure: apply the quiet-topic rule.
One line saying nothing found changes the picture, plus the method section, and stop.

Never pad from training data. If it was not retrieved or fetched, it is not a finding
(`references/evidence-standards.md`, rule 9).

## Guardrail

**Reading is not believing, and this skill is the one most likely to break that rule.**

A user reading three critiques of an approach is not evidence they hold that view. It is
evidence they were exposed to the argument, which is compatible with agreeing, disagreeing,
being assigned to evaluate it, or clicking a link and closing the tab. Only what the user
**said** in a message or on a call supports a claim about what they think
(`references/evidence-standards.md`, rule 4).

The specific failure to guard against: section 4 is the most compelling part of the output,
which creates pressure to fill it. Filling it from exposure produces a document that tells the
user what they believe on the basis of what a feed showed them. That is worse than an empty
section by a wide margin. An empty section 4 with one honest line is the correct output when
there are no utterances.

Two supporting rules:

- **The internal half is never presented as a complete picture of what the user knows.** It is
  bounded by what was captured. The completeness statement is mandatory and goes in section 1,
  not in a footnote.
- **Nothing captured from another person's screen gets republished.** Same boundary as
  `competitor-watch`. The full rule, the prohibited list, and the two-question test live in
  that skill's ethics and boundaries guide and are not restated here. The short
  version: material that was on the user's screen because somebody else put it there is input,
  the synthesis derived from it stays internal, and nothing under NDA or shared in confidence
  enters the document at all.

## Approval gate

**Nothing is sent, posted, or published.** The synthesis is an internal file.

Where the user wants any part of it to go outward, a summary to a colleague, a post, a
recommendation to a team, present the actual final text verbatim rather than a summary of it
and use `AskUserQuestion` to offer send as written, edit first, hold, or drop. Approving the
synthesis is not approving a message, and approving a plan is not approving the words
(`references/evidence-standards.md`, rule 6).

Where an action would go through another product, email, a doc tool, a chat connector, those
are separate MCP connectors that may or may not be present. List the available tools first.
Where the connector is absent, produce a copy-paste block or an import-ready file instead.
Never assume a connector exists.

Where any drafted text is written as the user, check whether a personal voice skill is
installed in the session and use it. If none is installed, say so plainly and point at this
marketplace's voice creator skills. Never invent a voice profile.

## Routine wiring

The standing-topic mode runs as a Littlebird routine. Offer to create it, show the user the
exact prompt text and schedule below, get approval with `AskUserQuestion`, then call
`LB_INTERNAL_CREATE_ROUTINE`. Creating it generates a first report immediately, then it runs
on schedule. Do not tell the user to go set it up by hand. Routine creation works from an
interactive session and is blocked only from inside a running routine
(`references/littlebird-mcp-reference.md`).

Check `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` first. Routine count is plan-limited.

```
title:    Standing topic watch: TOPIC
schedule: {"frequency": "weekly", "time": "08:00", "week_days": ["WE"]}
notifications_enabled: true
email_notifications_enabled: false
```

Substitute the real topic into the title. Confirm the day and time with the user.

Exact `prompt` text to pass, with TOPIC, ALIASES and BASELINE DATE substituted from the
scoping block:

```
You are watching a standing research topic for this user and reporting ONLY what is new
since your last report. You OBSERVE and REPORT. You do not write files, you do not draft
messages to anyone, and you do not ask for approvals.

TOPIC: [topic]
ALIASES AND RELATED TERMS: [full alias list from scoping]
BASELINE: the user's captured exposure on this topic ran through [baseline date].

STEP 1. MEMORY FIRST. Before any searching, call LB_INTERNAL_GET_ROUTINE_REPORTS for this
routine with limit 8 and read every past report. Build a list of every finding, source and
open question you have already reported, with the date you first reported it. You are
reporting what is NEW since those reports. Anything you already reported and that has not
moved does not get repeated. A report that restates last week's findings is a failed
report. If there are no past reports, say so, and treat this run as the baseline.

STEP 2. WINDOW. Search the period since your last report only. If this is the first run,
use the last 30 days. Do not widen it.

STEP 3. INTERNAL. Run these, all bounded to the window:
  a. search_user_context with filters data_source snapshots, one query per alias, up to 7
     per call. This is what crossed the user's screen on the topic. It is EXPOSURE ONLY.
  b. search_user_context with filters data_source messages using search_queries_messages,
     same aliases plus: I think, we should, the problem with, have you looked at. A message
     tagged From:[user] is the user's own words. Everything else in a thread is somebody
     else talking.
  c. LB_INTERNAL_SEARCH_MEETINGS with the topic term and each alias as separate queries.
     For any hit, call LB_INTERNAL_GET_MEETING and take who said what from the Decisions
     and Action Items blocks and the attendee list. Do NOT fetch transcripts.

STEP 4. EXTERNAL. List the web search and fetch tools you actually have in this session and
use their real names. Do not assume a specific tool exists. If you have none, say so, report
the internal half only, and state that the delta needed both halves.
  Run, per alias: the term alone, the term plus a recency marker, and the term plus
  criticism or problems with. Run the criticism query every time even if nothing prompts it.
  OPEN EVERY URL BEFORE YOU CITE IT. Do not cite a link a search result showed you and you
  did not fetch. If a URL will not resolve, drop the claim. Cite the original publication,
  not a syndicated copy.

STEP 5. CLASSIFY. Every item is exactly one of:
  EXPOSURE, it was on screen. Supports "the user encountered this on DATE" and nothing about
    what they think.
  UTTERANCE, the user wrote it or said it. The only kind that supports a claim about what
    the user believes.
  AMBIENT, somebody else's words in the user's capture. Context, not position.
  UNCLEAR, drop it.
  Reading is not believing. A user reading a critique is not evidence they hold that view.

STEP 6. WRITE THE REPORT, in this order:
  NEW SINCE LAST REPORT. Maximum five items. Each: one line, the date, the source with its
    type, and the URL you opened. Nothing here without a URL.
  STALENESS. Any external change that postdates the user's captured exposure on this topic
    and bears on it directly. One line each with the exposure date, the change date and the
    URL. This is the most valuable thing in the report. Frame it as information, never as a
    criticism of the user.
  WHAT YOU SAID ABOUT THIS. Only utterances from step 5, with the quoted words, the date and
    the receipt, and only where the external half now bears on it. If there are no
    utterances this period, write one line saying so. Never infer a position from reading
    history.
  DISAGREEMENTS. Where sources conflict, give both positions with both URLs, say which side
    has a commercial interest, and do not resolve it by picking the more interesting one.
  SOURCE NOTE. One line on the composition of what you found. If most of the substantial
    sources are published by parties selling into the category, say that plainly. It is a
    finding.
  OPEN. Anything you could not settle, each with the one specific thing that would settle it.

QUIET PERIOD RULE. If nothing new was found externally and nothing crossed the user's screen
on the topic, write exactly this and stop:
  "Nothing new on [topic] this period. Queries run: [list them]."
One line plus the queries is the correct and complete output for a quiet period. Do not
manufacture analysis. Do not restate the topic's fundamentals as though they were news. Do
not repeat findings from earlier reports to fill space.

ESCALATION. Compare against the past reports from step 1 and apply this exactly:
  If you have written the quiet-period line for 3 consecutive reports, add one line saying
    the topic has been quiet for that many periods and recommending the user move this
    routine to monthly, or retire it.
  If the same open question has appeared in 3 or more consecutive reports, do not repeat it
    unchanged. Say how many periods it has been open and name a different resolving action
    than the one you named before.
  If a staleness flag you raised has appeared in 2 consecutive reports with no captured
    exposure to the change since, say so and name the specific decision it bears on.

EVIDENCE RULES. Every internal claim carries a receipt in the form
[Day, Month DD, YYYY HH:MM TZ | app]. Every external claim carries a URL you opened. Screen
capture shows what was VIEWED, not what the user wrote, endorsed or believes. Report a
vendor claim as a claim: "their page as of DATE says X", not "X". Absence of evidence is not
evidence of absence: write "no captured exposure in this window", never "the user does not
know about this". If the searches return nothing, say so and stop. Never fabricate a source,
a URL or a date to fill a section.

BOUNDARIES. Content that was on the user's screen because another person put it there is
input, and the reading derived from it stays internal. Never quote or reproduce another
party's confidential material, screen share contents, dashboards, or anything shared under
NDA. Report the topic fact, not the other party's private data.

Close with one line naming what to open in Cowork if anything here needs work: the
research-synthesizer skill, for the full synthesis with the exposure history, the source
grading and the method record.
```

Five properties of that prompt are load-bearing and must survive any edit. It reads its own
past reports before writing. It classifies exposure separately from utterance and refuses to
infer belief from reading. It requires a URL to have been opened before it is cited. It has a
quiet-period rule that produces one line rather than manufactured analysis. And it escalates
by changing the recommendation rather than repeating it, which is the specific failure
observed in production where a routine flagged the identical top item day after day with no
change in approach (`references/littlebird-mcp-reference.md`).

`LB_INTERNAL_UPDATE_ROUTINE` replaces the whole prompt and the whole schedule. Always call
`LB_INTERNAL_GET_ROUTINE_CONFIG` first and edit from the current text
(`references/littlebird-mcp-reference.md`).

### Handoff to Cowork

The routine ends by naming this skill. An on-demand run on a topic that has a routine calls
`LB_INTERNAL_GET_ROUTINE_REPORTS` before sweeping, so the deep run inherits the baseline the
routine already established rather than starting from scratch, and does not re-report findings
the user has already seen in a weekly report.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `competitor-watch` | The same internal-plus-external fusion, on a recurring beat against named entities. This skill answers a topic question once, deeply. Its ethics and boundaries guide is the canonical statement of the third-party screen boundary for both |
| `said-it-already` | Checks whether the user has already published a take on this. Run it before turning a synthesis into anything public |
| `daily-brief` | Operational, daily, what happened. This is deep, on demand, what is true |
| `routine-architect` | Owns routine design across the marketplace. Use it if the standing-topic cadence needs reshaping |
| The voice creator skills in this marketplace | Supply the voice for anything drafted as the user. Without one installed, say so rather than imitating a voice from nothing |

## Reference map

| File | Read it for |
|---|---|
| `references/topic-scoping.md` | The six-question interview, the three question shapes, the alias list, window defaults, and the scope block |
| `references/internal-exposure-retrieval.md` | The five passes with exact call shapes, the four-bucket classification, deduplication, the completeness statement, and the did-not-act rules |
| `references/external-sweep-and-source-grading.md` | Sweep order, query construction, URL verification, the source type ladder, lateral reading, and the commercial-interest checks |
| `references/synthesis-and-delta.md` | The seven sections in order, the belief-section evidence rule, the disagreement patterns, and the quiet-topic rule |
| `references/evidence-standards.md` | Receipts, the four kinds, confidence ratings, the attribution guardrail, the confirmation gates |
| `references/littlebird-mcp-reference.md` | Verified tool inventory, parameters, return shapes, known limitations |
| `references/research/distilled-research-synthesis-method.md` | Every domain claim in this skill, cited to a raw source |
| `references/research/README.md` | The archive index, window exceptions, the honest headline, and the named gaps |
