---
name: deal-pipeline-reconstructor
description: "Rebuild the sales pipeline that lives in your head. Trigger on 'what deals
  do I have open', 'rebuild my pipeline', 'my CRM is empty', 'who am I about to lose',
  'which deals went cold', 'what did I quote and to whom', 'build my deal board', 'who
  hasn't replied to my proposal'. Reconstructs deals from captured DMs, discovery calls,
  proposals seen on screen, quotes sent and calendar holds into a stage-by-stage board
  with last-touch recency, a ranked going-cold list, and one next action per deal. Every
  stage is an inference and shows its evidence. Internal artifact only. Never contacts a
  prospect."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Deal Pipeline Reconstructor

You sell. You do not maintain a CRM. The CRM is empty, or it has four deals in it from
March and one of them closed.

But the activity is all there. The DM from someone asking if you have capacity. The
discovery call you took on Tuesday. The quote you built in a spreadsheet and pasted into
WhatsApp. The calendar hold with a name you half recognise. The follow-up you meant to
send eleven days ago.

This skill assembles that into the board you never built: every deal placed at a stage,
with the evidence that put it there, how long each one has been silent, and which ones are
dying.

**Every stage on this board is an inference.** The skill shows its reasoning for each
placement and asks you to confirm before the board is treated as real. That is not
timidity. The forecasting literature's consistent finding is that human judgment combined
with mechanical method beats either alone
(`references/research/distilled-b2b-pipeline-management.md`, section 3).

**The board is internal. Nothing here goes to a prospect.**

---

## Purpose

Turn captured sales activity into a stage-by-stage deal board with last-touch recency, a
ranked going-cold list, and one next action per deal, for an operator whose pipeline
currently exists only in their memory.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**.

1. LIST the tools actually available in this session. Do not assume tool names. Use the
   real names you find.
2. If no Littlebird tools are present, stop and tell the user the skill needs the
   Littlebird MCP connected, with a link to https://support.littlebird.ai/docs/mcp/. Do
   not proceed on memory or guesswork.
3. If the tools are present but return plan errors, call the subscription status tool and
   report the plan gate.

Tool surface, parameters, and return shapes are in
`references/littlebird-mcp-reference.md`. Read it before writing any query.

---

## Littlebird MCP calls used

| Tool | Used for |
|---|---|
| `LB_INTERNAL_LIST_MEETINGS` | Sales, discovery and demo calls across the window. Also run with a FUTURE `end_date` to get upcoming prospect holds. There is no separate calendar tool. |
| `LB_INTERNAL_SEARCH_MEETINGS` | Topic search across transcripts and summaries for pricing, scope, proposal and contract discussion |
| `LB_INTERNAL_GET_MEETING` | The structured summary per call: Decisions, Action Items with owners, Risks and Open Questions, For You |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Only where exact wording matters and the summary is insufficient. Expensive, and weakly diarized. |
| `search_user_context` with `data_source: messages` | Prospect threads, inbound enquiries, quotes pasted into chat |
| `search_user_context` with `data_source: snapshots` | Proposals, quotes, contracts, e-signature screens, and any CRM screen on display |
| `search_user_context` with `data_source: summaries` | Cheap compressed day view, for filling gaps in the timeline |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | The capability gate above, and the routine limit check |
| `LB_INTERNAL_CREATE_ROUTINE` | The weekly pipeline watcher, offered with approval. See Routine cadence. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Read the watcher's own past reports before building a board |
| `LB_INTERNAL_LIST_ROUTINES` / `LB_INTERNAL_GET_ROUTINE_CONFIG` / `LB_INTERNAL_UPDATE_ROUTINE` | Check whether the watcher already exists and amend it rather than duplicating |

Anything outside this table is a different MCP server. Gmail, HubSpot, Salesforce,
Pipedrive, GoHighLevel and the rest are separate connectors that may or may not be present.
See `references/board-output-and-export.md`, section 5.

---

## Trigger

Run this when the user says any of: "what deals do I have open", "rebuild my pipeline", "my
CRM is empty", "who am I about to lose", "which deals went cold", "what did I quote and to
whom", "build my deal board", "who hasn't replied to my proposal", "I've lost track of my
deals", "what's in my pipeline".

Also run it on the Monday after the weekly watcher routine posts a report.

---

## Routine cadence

**Weekly, plus on demand.** The routine observes and reports. The Cowork session builds the
board. Offer to create the routine per the Routine wiring section below.

---

## Process

### Step 1: Frame the pipeline. Do not guess.

Ask with `AskUserQuestion`, in one batch:

1. **What do you sell.** One line. It drives every query in step 2.
2. **Typical deal size and typical time from first conversation to signed.** Used to
   calibrate going-cold thresholds. "I don't know" is an acceptable answer and switches the
   skill to the published defaults.
3. **The window.** Default 90 days. Offer 60 and 90, and a custom range. 60 days for a fast
   transactional cycle, 90 for anything with a proposal step.
4. **Any deals you already know about.** Names only. These become seeds that get looked up
   directly, and any deal the retrieval MISSES that the user named is a coverage finding
   worth reporting.
5. **Where the board should be written.** Default: the working directory.

### Step 2: Retrieval brief

Run MULTIPLE NARROW queries, not one broad one. Parallel narrow beats one broad: it scores
better and avoids the oversized-result file dump
(`references/littlebird-mcp-reference.md`, retrieval patterns). Every query is bounded by
the window from step 1. Substitute what the user actually sells.

**A. Calls.** `LB_INTERNAL_LIST_MEETINGS` across the full window, then
`LB_INTERNAL_SEARCH_MEETINGS` for:

1. "discovery call with a prospective client about scope and pricing"
2. "sales call or demo where I described what I do and what it costs"
3. "conversation about budget, timeline, or who else needs to approve"
4. "call where a client asked for a proposal or a quote"
5. "conversation about contract terms, start date, or a discount"

For every meeting that comes back relevant, call `LB_INTERNAL_GET_MEETING` and work from
the structured summary blocks (Decisions, Action Items, Risks and Open Questions, For You).
That summary is the richest and cheapest stage evidence on the whole MCP surface
(`references/littlebird-mcp-reference.md`). Only pull the transcript where exact wording
matters.

**B. Upcoming holds.** `LB_INTERNAL_LIST_MEETINGS` with a FUTURE `end_date`, out 21 days.
These suppress cold flags (`references/recency-and-going-cold.md`, section 4). They carry no
id and no summary and are not searchable, so match them by attendee name and title text and
mark the match as an inference.

**C. Prospect threads.** `search_user_context`, `search_queries_messages` populated,
`filters.data_source: messages`:

1. "message asking whether I have availability or capacity"
2. "message asking how much something costs or what my rates are"
3. "message where I sent a price, a quote, or a scope"
4. "message about a proposal, an estimate, or a contract"
5. "message about scheduling a call to discuss working together"
6. "message where someone said they would get back to me"

**D. Documents and screens.** `search_user_context`,
`filters.data_source: snapshots`:

1. "proposal or statement of work document with a client name on it"
2. "quote or estimate with line items and a total"
3. "contract or agreement or e-signature screen"
4. "invoice or deposit request for a new engagement"
5. "CRM or spreadsheet screen showing a list of deals or leads"

Query D5 matters twice over: it finds any stale CRM the user forgot they had, and a CRM
screen on display is itself capture-visible evidence.

**E. Seeds.** For each name the user gave in step 1, one targeted
`search_user_context` query plus one `LB_INTERNAL_LIST_MEETINGS` call with `name`. A meeting
lookup by NAME uses `LIST_MEETINGS` with `name`; a lookup by TOPIC uses `SEARCH_MEETINGS`
with `query`. Using the wrong one is the most common retrieval mistake against this server
(`references/littlebird-mcp-reference.md`).

**F. Terminal signals.** `search_user_context`, both message and snapshot sources:

1. "message saying we decided to go in a different direction"
2. "message confirming we are moving forward, send the contract"
3. "kickoff or onboarding scheduling for a new client"

Read the relevance scores. Items scored 3 are maybes and do not carry a claim alone
(`references/littlebird-mcp-reference.md`).

### Step 3: Build deal records

Follow `references/deal-identity-and-dedupe.md` exactly. In short:

- A deal is a PERSON plus a COMPANY plus an OPPORTUNITY, not a contact.
- Merge fragments using the matching ladder. Tiers 1 and 2 merge automatically. Tiers 3 and
  below need corroboration or a question.
- **Never merge silently below tier 2.** A bad merge is invisible in the output; a duplicate
  is fixed in five seconds. Bias toward not merging.
- Deduplicate identical OCR lines before counting anything. Sort evidence by EVENT time.
- Record contacts observed as a FLOOR ("at least 2"), never as a total.
- **Do not fabricate deal amounts.** Unknown is a valid and frequent answer. Do not compute
  a weighted pipeline value.

### Step 4: The "is this even a deal" pass

Capture surfaces names, and most of them are not prospects. Classify every candidate as
Prospect, Partner or referrer, Vendor or supplier, Existing client, or Ambiguous, using the
direction-of-sell test: who is being asked to pay whom
(`references/deal-identity-and-dedupe.md`, section 5).

If the evidence does not answer that question, the candidate is Ambiguous and goes to the
confirmation gate. Every exclusion is recorded with its reason. Never silently drop a
candidate.

### Step 5: Infer stage, and show the reasoning

Follow `references/stage-inference.md`. Six live stages plus a Won and Lost tail: Lead,
Qualified, Proposal, Negotiation, Closing, Won, Lost.

Every placement carries a four-part reasoning line: the stage marked as inferred with a
confidence, the evidence with receipts, the competing reading that was rejected and why, and
what would change the placement.

Bias toward the LOWER stage where evidence is ambiguous. A deal placed too high makes the
user stop working it and count revenue that is not coming. A deal placed too low costs a
moment of correction.

Early-stage placements get lower confidence by default: early-stage outcomes are documented
as harder to predict than later ones
(`references/research/distilled-b2b-pipeline-management.md`, section 3).

### Step 6: Recency and the going-cold list

Follow `references/recency-and-going-cold.md`.

Last touch is the most recent observed INTERACTION with the prospect, in event time, with
its direction recorded. A note the user typed to themselves is not a touch. This is the
skill's edge over a CRM last-modified date, which measures when the seller typed something
rather than when the buyer was contacted.

Thresholds vary BY STAGE, because typical time in stage varies by stage and the two shortest
expected windows are discovery response and proposal reply
(`references/research/distilled-b2b-pipeline-management.md`, section 5). Suppress the cold
flag for any deal with an upcoming hold. Rank by severity, not raw days.

### Step 7: One next action per deal

One line, concrete, executable today, pulled from the meeting summary's Action Items and
For You blocks where one exists. Do not phrase it as a complaint about being ignored: the
"I never heard back" framing is claimed to reduce meetings booked
(`references/research/distilled-b2b-pipeline-management.md`, section 6).

Do not encode a follow-up cadence. The archive carries a direct, unresolved, order-of-
magnitude conflict on tempo between two vendor sources
(`references/research/distilled-b2b-pipeline-management.md`, section 6). Present both
readings if asked and let the user choose.

### Step 8: The confirmation gate

The board is a DRAFT until the user confirms it (`references/evidence-standards.md`, rule
6). Run `AskUserQuestion` in batches, in this order: ambiguous "is this even a deal"
candidates, ambiguous merges, ambiguous stage placements, Low-confidence placements at
Proposal or later, then the thresholds.

Do not ask about High-confidence placements with clean evidence. Asking about everything
trains the user to click through, which destroys the gate.

### Step 9: Write the board

Follow `references/board-output-and-export.md`.

---

## Output

One file: **`pipeline-board-YYYY-MM-DD.md`**, in the user's working directory unless they
name another location. Optionally a companion **`pipeline-board-YYYY-MM-DD.csv`** if they
ask for an export.

Sections, in order:

1. **Header.** Date, window, deal count, and the statement that stages are inferred.
2. **Confirmation status.** Confirmed on DATE with the counts of what changed, or NOT
   CONFIRMED in full.
3. **The board.** Lead, Qualified, Proposal, Negotiation, Closing, Won, Lost. Per stage: deal
   count, sum of KNOWN amounts, count of unknown amounts. Never a weighted value. Per deal:
   opportunity, amount with status, contacts observed, first and last touch, days silent,
   threshold in force, status, four-part stage reasoning, next action, full evidence trail
   sorted by event time, and the merge basis.
4. **Going-cold list.** Ranked across all stages by severity. Columns: rank, deal, stage, days
   silent, threshold, ratio, direction of last touch, next action. Headed by one sentence
   saying this is a work queue, not a write-off list.
5. **Ambiguous stage placements.** Both readings, both evidence sets, resolution if any.
6. **Ambiguous merges.** Both fragments, both receipts, resolution if any.
7. **Excluded candidates.** Every name that did not become a deal, with its bucket and reason.
8. **Waiting.** Deals with an upcoming hold, with the caveat that the hold match is an
   inference.
9. **Method and gaps.** Queries run, window, filters, what came back empty, where the
   thresholds came from, and the statement that the stage-inference mapping is the skill's
   own reasoning with no external validation.
10. **What this board is not.** No win probability, no weighted value, no conversion rates,
    unknown amounts are unknown rather than zero, and "no contact observed" is a statement
    about the capture rather than proof no contact happened.

Raw retrieved capture does not go in the file. Process it in temp space and let it go
(`references/evidence-standards.md`, rule 7).

---

## Empty retrieval

If the searches return nothing for the window, **stop and report the gap. Do not fabricate a
pipeline.**

Say exactly which queries ran, over which window, with which filters, and that they came
back empty. Then give the user the three things that could fix it:

1. **Check the window.** A 60-day window on a business with a 90-day cycle finds the tail of
   nothing.
2. **Check where the selling happens.** If deals are worked on a phone, in person, or in an
   app Littlebird does not see, capture has nothing to reconstruct from. Ask which apps and
   surfaces the sales conversations actually live in, and re-run scoped to those.
3. **Seed it.** Give three prospect names and the skill will look each one up directly, which
   frequently surfaces the rest of the thread.

A partial result is reported as partial with its coverage gap named. An empty result ends the
run (`references/evidence-standards.md`, rule 9).

Where the user named seed deals in step 1 that retrieval did not find, report that
specifically. It is a measurement of what the capture is missing, and it is more useful to
them than a padded board.

---

## Routine wiring: the weekly pipeline watcher

Offer this whenever the user runs the skill and has more than two live deals. **Routines can
be created from an interactive session.** Show the user the exact prompt text and the
schedule, get approval through `AskUserQuestion`, then call the routine creation tool. Do not
tell them to go set it up by hand.

Check `LB_INTERNAL_LIST_ROUTINES` first so an existing watcher gets amended through
`LB_INTERNAL_UPDATE_ROUTINE` rather than duplicated. Note that `UPDATE_ROUTINE` REPLACES the
whole prompt, so read the current config first
(`references/littlebird-mcp-reference.md`).

Schedule: `{"frequency": "weekly", "time": "08:00", "week_days": ["MO"]}`, in the user's
local timezone. Monday morning, before the week gets away from them.

Routine prompt text to pass, with bracketed values substituted from step 1:

> Read your own previous reports first before writing anything. If a deal you already
> flagged is still silent, escalate it rather than restating it: say how many weeks running
> it has appeared, how many days it has now been silent in total, and raise it above the
> newly flagged items in this report.
>
> Search my captured context from the last 7 days for activity on my sales conversations. I
> sell [WHAT THEY SELL]. Run several narrow searches rather than one broad one. Cover:
> discovery, sales and demo calls held this week; messages where someone asked about
> availability, scope or price; messages where I sent a price, a quote or a scope; proposal,
> quote, contract or e-signature documents that appeared on my screen; and any message where
> a prospect said they would get back to me.
>
> Also list my upcoming calendar events for the next 14 days that look like prospect calls.
>
> Write a short report with five parts.
>
> First, NEW deal signals this week: a named person or company that did not appear in your
> previous reports, with what they did, when, and the receipt in the form
> [Day, Month DD, YYYY HH:MM TZ | app]. Say plainly that you are not sure whether each one is
> a prospect, a partner, a vendor or a friend, and do not assert that it is a deal.
>
> Second, MOVEMENT: any existing deal where something happened this week that suggests it
> advanced, for example a proposal document appearing on screen, a price being sent, or a
> contract or signature screen. Describe the evidence and the receipt. Mark the stage as an
> inference every time. Never state a stage as fact.
>
> Third, GOING QUIET: deals where the last thing you can observe is more than 10 days old.
> For each, give the days since the last observed contact, whether that last contact was from
> me or from them, and what the last thing observed was. Put deals where THEY messaged ME and
> got no reply at the top. Exclude any deal that has a call already on my calendar in the next
> 14 days, and list those separately as waiting.
>
> Fourth, UPCOMING: prospect calls on my calendar in the next 14 days, with the date and who
> is on them.
>
> Fifth, the action line: tell me to open Cowork and run the deal-pipeline-reconstructor
> skill to rebuild the full board with stage reasoning and a ranked going-cold list.
>
> Never invent a deal, a company, an amount or a stage. If you observe no sales activity this
> week, say exactly that and stop. Do not repeat last week's list as if it were new.

Set notifications on so the Monday nudge actually lands.

**Handoff.** When the user opens Cowork and runs this skill, read the watcher's past reports
with `LB_INTERNAL_GET_ROUTINE_REPORTS` BEFORE running step 2. The reports give a week-by-week
movement history that a single retrieval at the end cannot reconstruct, and they show which
deals have been silent across multiple weeks, which is exactly the going-cold signal
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern).

---

## Evidence standards

Every claim in the board follows `references/evidence-standards.md`. The rules that bite
hardest here:

- **Rule 2, observed and inferred.** "A document titled 'Northwind retainer v2' was on screen
  on Jul 22" is observed. "Northwind is at Proposal stage" is inferred. The board marks every
  stage as an inference, every time, without exception.
- **Rule 1, receipts.** Every piece of evidence carries one. For messages the send time and
  the collection time are different values and both appear.
- **Rule 3, confidence.** Every stage placement is rated. A Low-rated placement never drives
  an irreversible action, and at Proposal stage or later it goes to the confirmation gate.
- **Rule 4, attribution.** Capture shows what the user was VIEWING. A proposal document on
  the user's own screen does not prove it was sent. Flag that ambiguity rather than resolving
  it silently.
- **Rule 5, partial rosters.** Contacts per deal are reported as "at least N", never as a
  total. App UIs collapse lists.
- **Rule 6, confirmation.** The board is a draft until the user confirms it. Confirm before
  encoding, and confirm the actual text before anything is ever sent.
- **Rule 8, timelines.** Sort by event time. Retrieval returns relevance order.
- **Rule 9, empty retrieval.** An empty result ends the run.
- **Rule 10, reporting on people.** Purpose-bound to the pipeline. Provenance on every line.
  Sensitive categories stay out even when the capture contains them, and the board contains
  candid notes about people who have not replied, so it stays internal.

---

## Guardrail

**The specific risk this skill carries is a confidently wrong stage.** A deal shown at
Negotiation that is actually at Lead makes the user stop selling to a prospect who has not
been sold to, and count revenue that is not coming. That is the failure mode, and it is
worse than the empty CRM the skill replaces, because an empty CRM does not tell you anything
false.

Five controls, all mandatory:

1. **Every stage is marked as an inference and shows its evidence, its rejected alternative,
   and what would change it.** No placement is ever asserted bare.
2. **Ambiguity resolves DOWN.** Where two stages fit the evidence equally, the deal goes in
   the lower one and gets flagged.
3. **The user confirms before the board is real.** Nothing is treated as a pipeline until it
   passes the gate.
4. **No amount is ever invented, and no weighted pipeline value is ever computed.** On a
   reconstructed board both inputs would be manufactured, and multiplying two guesses
   produces a number that looks like revenue and is not.
5. **No contact observed is not proof of no contact.** The user may have called them from a
   phone Littlebird never saw. Every cold flag is worded as an observation about the capture
   and invites the correction.

Second-order risk: the going-cold list reads as a list of people who rejected you, which is
demoralising and wrong. Every documented cause of a prospect going quiet is about the buyer's
own bandwidth and internal situation, not a decision against the seller
(`references/research/distilled-b2b-pipeline-management.md`, section 6). Present the list as
a work queue and say so in the file.

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## Related skills

| Skill | Relationship |
|---|---|
| `lead-harvester` | Runs UPSTREAM. It turns a campaign's hand-raisers into a ranked roster; this skill turns the ones that became conversations into deals. |
| `pre-call-prep` | Runs on a single deal before a call. Feed it a row from this board. |
| `commitment-tracker` | Overlaps on the promises inside a deal. Where that skill tracks what was promised, this one tracks where the deal stands. |
| `comment-to-crm-piper` | Pipes new hand-raisers into a CRM daily. If that skill is in use, some of this board's Lead-stage rows will already exist there. Reconcile rather than duplicate. |
| `client-health-radar` | Picks up after Won. This skill ends at the close; that one watches the relationship after it. |
| `invoice-chaser` | Picks up after Won on the money side. A deal marked Won here with no payment observed is that skill's problem, not this one's. |
| `routine-architect` | If the user wants the weekly watcher tuned, or has hit their routine limit, hand off there. |
| A personal voice skill | Not used here. This board is internal and nothing in it is written as the user. If the user asks to draft an actual follow-up message, that is a separate act needing approval of the final text. |

---

## References

| File | What it covers |
|---|---|
| `references/deal-identity-and-dedupe.md` | What a deal is, the matching ladder, company matching, the "is this even a deal" pass, contacts per deal, and why amounts are never invented |
| `references/stage-inference.md` | The six stages, the evidence-to-stage table, meeting-summary mining, confidence, the four-part reasoning format, and what this skill refuses to compute |
| `references/recency-and-going-cold.md` | Last touch, per-stage thresholds, upcoming-hold suppression, severity ranking, what silence means, and the next-action line |
| `references/board-output-and-export.md` | The artifact shape, the confirmation gate, listing connectors before offering an export, the CSV fallback, and the re-run delta |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, retrieval patterns, known limitations |
| `references/evidence-standards.md` | Receipts, observed versus inferred, confidence, attribution, partial rosters, confirmation gates |
| `references/research/distilled-b2b-pipeline-management.md` | Cited distillation of the domain research, with conflicts kept as conflicts |
| `references/research/README.md` | Archive contents, source mix, access limitations, and named research gaps |
