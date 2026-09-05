---
name: comment-to-crm-piper
description: "New hand-raisers into the CRM, daily. Trigger on 'who engaged with my post
  today', 'pipe my new comments into the CRM', 'add today's leads to GoHighLevel', 'anyone
  new since yesterday', 'get these commenters into my CRM', 'daily lead drip', 'tag my new
  leads by campaign'. Watches the user's own posts for new public engagement since the last
  run, dedupes each person against the CRM, upserts or produces a correctly shaped import
  file, tags by campaign, and queues a drafted first message. Drafts only. Never sends, and
  never writes private message contents into a CRM."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan). A CRM connector is optional, and the skill degrades to an import file or a copy-paste block without one."
---

# Comment to CRM piper

Somebody commented on your post at 9:40 last night asking how it works. You saw the
notification, you were doing something else, and by the time you remember it is Thursday.

This skill runs every morning, finds only the people who raised a hand SINCE THE LAST RUN,
checks each one against your CRM so you are not creating duplicates, tags them by campaign,
and hands you a drafted first message per person to send by hand.

**It is the daily drip. `lead-harvester` is the post-mortem.** Run `lead-harvester` after a
launch to reconstruct the whole roster. Run this one every day so the roster never has to
be reconstructed. They share the extraction and matching logic, and this skill points at
the sibling's guides rather than duplicating them.

---

## Purpose

Catch new hand-raisers on the user's own content while they are still warm, get them into
the CRM with correct campaign attribution and no duplicates, and queue one drafted first
message per person.

The premise is speed. The evidence for that premise is real but narrower than the industry
sells it, and this skill says so rather than repeating a slogan:

- The foundational study measured leads "captured through a web form, and attempted or
  called at least one time", by phone, across six companies in 2007
  [references/research/raw/piper--speed-to-lead--oldroyd-mit-insidesales-2007.md]. That is
  where 100x contact odds and 21x qualify odds come from.
- A 2025 to 2026 dataset of 939 companies puts the effect at a 32% close rate under five
  minutes against 12% at 24 hours or more, roughly 2.7x
  [references/research/raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md].
- The best available summary of the literature is "strong on direction and rough magnitude,
  and weaker on exact figures"
  [references/research/raw/piper--speed-to-lead--leadsource-evidence-review.md].
- **No source in the research archive isolates outcomes for social hand-raisers.** Every
  figure describes form-fill leads worked by phone or B2B demo requests
  [references/research/raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md]. The
  direction transfers to a Facebook commenter. The magnitudes do not, and quoting them at
  one is dishonest.

One finding does transfer cleanly, because it is about teams rather than buyers: having a
WRITTEN response-time target is associated with hitting it, 54.9% meeting a 15 minute
target with a formal target against 29.5% without
[references/research/raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md]. So the
skill asks the user to name a target and then measures against it.

---

## Littlebird MCP calls used

Real tool names, verified in `references/littlebird-mcp-reference.md`. List the tools
available in the session before using any of them; do not assume the spelling here matches
what your session exposes.

| Tool | Used for |
|---|---|
| `search_user_context` | Every retrieval pass. Notification surfaces, expanded comment threads, reaction lists, message thread lists, request screens. |
| `LB_INTERNAL_LIST_ROUTINES` | Finding this skill's routine and its id. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | **The high-water mark.** Reading the previous runs to establish what has already been handled. This is the skill's spine. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Reading the current routine prompt before any update, because update REPLACES the whole prompt. |
| `LB_INTERNAL_CREATE_ROUTINE` | Offering to create the daily watcher, from an interactive session only. |
| `LB_INTERNAL_UPDATE_ROUTINE` | Closing the loop after a Cowork run pipes a queue. Interactive sessions only. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Explaining a plan gate or a routine count limit. |

Not used, and deliberately: there is no Littlebird tool that searches past Littlebird chat
conversations, and there is no calendar tool. Anything that looks like `search_chats` or
`get_calendar` is not real.

CRM tools are NOT Littlebird tools. GoHighLevel, HubSpot and the rest are separate MCP
servers that may or may not be connected. See `references/crm-tiers-and-import-formats.md`.

---

## Trigger

Fires on: who engaged with my post today, pipe my new comments into the CRM, add today's
leads to GoHighLevel, anyone new since yesterday, get these commenters into my CRM, daily
lead drip, tag my new leads by campaign, did anyone raise their hand overnight.

Also fires when the user opens Cowork after a routine notification from the daily watcher.

Do NOT fire this for a full campaign reconstruction after the fact. That is
`lead-harvester`.

---

## Routine cadence

Daily. Default 08:00 in the user's local timezone, so the queue is waiting when they start
work. Offer 07:00, 08:00, 12:00, and 17:00 as options, and explain the tradeoff: earlier
means the overnight batch is ready first thing, later means the day's engagement is
included.

The routine OBSERVES and writes a report. The Cowork session ACTS and writes to the CRM
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern). The
routine never writes to a CRM, never asks for approval, and never sends anything, because
it runs unattended in one pass.

Exact prompt text is in the routine wiring section below.

---

## Capability gate

**List the tools available in this session and use the real names you find.** Do not assume
a tool exists because it is named in this file.

1. **Required: the Littlebird MCP, on a Power or Pro plan.** If no Littlebird tools are
   present, stop. Tell the user the skill needs the Littlebird MCP connected and point them
   at https://support.littlebird.ai/docs/mcp/. Do not proceed on guesswork.
2. If Littlebird tools are present but return plan errors, call the subscription status
   tool and report the gate.
3. **Optional: a CRM connector.** Its presence or absence selects the tier. Absence is not
   a failure, it is tier 2 or tier 3. See `references/crm-tiers-and-import-formats.md`.
4. **Optional: a personal voice skill.** If one is installed, list the available skills,
   find it, and draft the first messages through it. If none is installed, write plainly and
   say so in the output. Never build a voice profile from screen capture: capture shows what
   the user was viewing, not what they wrote
   (`references/evidence-standards.md`, rule 4). Point the user at this marketplace's voice
   creator skills instead of imitating a voice from nothing.

---

## Process

### 1. Establish the high-water mark. Before any retrieval.

Read `references/high-water-mark.md` in full. It is the skill's spine and the rest of the
process depends on it.

In short: list the routines, find this skill's routine, read its past reports with the
routine reports tool at a limit of at least 7, and scan newest to oldest for the first
`PIPER STATE` block. That block carries `WATERMARK_TIME`, `CAMPAIGN_TAG`,
`PIPED_IDENTITIES`, and `LAST_RUN_STATUS`.

Set the retrieval window to `WATERMARK_TIME` minus 6 hours, through now. The overlap exists
because capture lags the event; the identity list removes the duplicates the overlap
creates.

If there is no mark, branch on which of the three no-mark cases applies. They are not the
same and the guide gives a different behavior for each. On a genuine first run, ASK the user
how far back to sweep rather than defaulting to 24 hours.

### 2. Confirm the campaign frame. Do not infer it.

With `AskUserQuestion`, in one batch, and only for what the state block did not already
answer:

1. **Which posts count.** The user's own content only. If several campaigns are live, which
   one this run covers.
2. **The campaign tag.** Show the exact string. If `CAMPAIGN_TAG` came from the state block,
   confirm it is still right rather than re-deriving it. Casing forks segments permanently.
   See `references/consent-and-tagging.md`.
3. **The platform or platforms.**
4. **The offer.** What was promised. The drafted first message has to deliver it.
5. **The response-time target.** The number the run measures itself against.

### 3. Retrieval brief

Multiple narrow queries, never one broad one. A broad query returns oversized results that
get dumped to a file and it scores worse
(`references/littlebird-mcp-reference.md`, retrieval patterns). Every query is bounded by
the window from step 1. Run in parallel where the harness allows.

**A. Public engagement on the user's own posts.** `search_user_context`,
`filters.data_source: snapshots`, `filters.app: chrome`, plus the platform's native app
where the user works in one:

1. "notification saying someone commented on my post"
2. "expanded comment thread on my own post with commenter names and comment text"
3. "list of people who reacted to my post"
4. "reply under my post asking a question about the offer"
5. The campaign keyword or offer name as its own query, if the campaign uses one.

**B. Inbound requests directed at the user.** `filters.data_source: snapshots`:

1. "friend requests screen with pending request names"
2. "pending LinkedIn invitations with names"
3. "new follower notification"

**C. Direct message ARRIVALS, name and time only.** `search_queries_messages` populated,
`filters.data_source: messages`:

1. "new message request from someone I do not have a thread with"
2. "new direct message received about my post or the offer"

Extract the sender name, the send time, and the fact that a message arrived. **Do not
extract the message body for the CRM.** See the guardrail below and
`references/consent-and-tagging.md`.

**D. Confirmation that the post is the user's own.** One query on the post itself. A
commenter on somebody else's post is out of scope and must be excluded.

Read the relevance scores. An item scored 3 is a maybe and does not carry a claim alone
(`references/littlebird-mcp-reference.md`).

### 4. Extract, dedupe rows into people

Follow `lead-harvester/references/signal-extraction-and-dedupe.md`. Do not restate it
and do not invent a second matching ladder. In particular: every signal is a row carrying
display name, signal type, event time, receipt, surface, verbatim, and confidence;
deduplicate identical OCR lines before counting; sort by event time not relevance; merge
rows into people with the matching ladder, where tiers 1 and 2 merge automatically and
tiers 3 through 6 need corroboration or a question; surface ambiguous merges with
`AskUserQuestion` and never merge silently; record every "and N others" as a countable
member of the unnamed gap.

Then apply the high-water-mark identity filter: drop anyone whose name appears in the union
of `PIPED_IDENTITIES` across the reports read in step 1. Anyone surviving with an event
time BEFORE the mark is a late-captured signal, which is exactly what the 6 hour overlap is
for. Keep them and flag them as late-captured in the output.

### 5. Dedupe against the CRM

Follow `references/dedupe-against-crm.md`. This is a different question from step 4, and
confusing the two produces bad output.

Normalise before comparing. Search the CRM on exact email, then exact phone, then exact
name, then fuzzy name. Auto-decide only at the top confidence band. Everything in the
middle goes to the user. A "new" verdict that rests on a name-only search is recorded as
`new (name-only search)`, because most social hand-raisers arrive with a display name and
nothing else, and deterministic matching alone misses an estimated 30 to 40% of real
duplicates [references/research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

If an existing contact carries a DND or opt-out marker: skip them entirely, queue nothing,
and say why in the dedupe report.

### 6. Draft one first message per person

Follow `lead-harvester/references/first-touch-drafting.md` for the message shape. Short,
casual, specific to what the person actually did, delivering the thing they asked for, no
pitch.

One message per person. **Not a sequence.** Enrolling a commenter in a nurture sequence is
a different processing purpose with a different reasonable expectation attached, and this
skill does not do it (`references/consent-and-tagging.md`).

### 7. Select the tier and produce the output

Read `references/crm-tiers-and-import-formats.md`. List the tools, pick the tier, say which
tier and why.

- **Tier 1, connector present.** Show the user the exact records to be created, per person,
  with field values and the dedupe verdict beside each. Get approval with
  `AskUserQuestion`. Then upsert. Then report what actually happened including failures.
- **Tier 2, no connector, CRM takes an import.** Emit the CSV with the header row
  `First Name,Last Name,Email,Phone,Contact Source,Tags,Notes`, plus the short import
  instruction. Never emit a custom-field column the user has not confirmed exists.
- **Tier 3, neither.** Emit the copy-paste table and state plainly what was not automated.

### 8. Approval gates, then write the state block

Two gates, both `AskUserQuestion` (`references/evidence-standards.md`, rule 6):

- **Before encoding.** Ambiguous merges, uncertain names, and anything about to become a
  durable fact on a person's record.
- **Before writing.** The literal records for tier 1, the literal file contents for tier 2,
  and the literal draft text in every tier. Approval attaches to text and payloads, never to
  a plan.

Then append the `PIPER STATE` block to the artifact, and close the routine loop by updating
the routine prompt with an `ALREADY PIPED THROUGH` date, per
`references/high-water-mark.md`. Say in the output which loop-closing method was used.

---

## Output

One artifact per run: **`piper-queue-YYYY-MM-DD.md`**, dated to the run date, in the user's
working directory unless they name another location. Where tier 2 applies, a second file
sits beside it: **`piper-import-YYYY-MM-DD.csv`**.

Sections, in this order:

1. **Run frame.** Window covered, from the high-water mark to now, stated as actual
   timestamps. The campaign tag used. The tier selected and why. The response-time target.
2. **New hand-raisers.** One row per person:

   | Column | Contents |
   |---|---|
   | Name | Display name exactly as captured |
   | Signal type | comment, reaction, DM arrival, friend request, connection request, follow |
   | Event time | The event time, not the capture time, sorted ascending |
   | Receipt | Canonical form per `references/evidence-standards.md`, rule 1 |
   | Campaign tag | The exact tag string |
   | Dedupe status | new, new (name-only search), existing (enriched), existing (opted out, skipped), ambiguous, or collision |
   | Elapsed | Time from event to this run, measured against the target |
   | Drafted first message | Full text, marked approved or pending |
   | Confidence | High, Medium, Low |

3. **Dedupe report.** The counts block from `references/dedupe-against-crm.md`, including
   the search-quality line naming how many verdicts rest on a name-only search.
4. **Unnamed gap.** Every "and N others" and "N people reacted" string, with its number,
   surface, and receipt. Never present the named list as complete
   (`references/evidence-standards.md`, rule 5).
5. **Ambiguous and blocked.** Merges the skill did not resolve, and any CRM collisions where
   nothing was written.
6. **Excluded.** Opted-out contacts, engagement on other people's posts, organisation pages,
   hostile rows. Named with reasons. Never silently dropped.
7. **What was and was not automated.** Explicit. Records upserted, or a file produced, or
   neither. Nothing sent to anyone, in every case.
8. **Method and gaps.** Which queries ran, which returned nothing, what could not be
   determined.
9. **The `PIPER STATE` block**, verbatim in the shape given in
   `references/high-water-mark.md`.

Raw retrieved capture does not go in this file. Process it in temp space and let it go
(`references/evidence-standards.md`, rule 7).

---

## Guardrail

**Only public engagement on the user's own content gets piped, and a private message's
contents never become a CRM note.**

That is this skill's specific risk. It runs unattended every day, it writes into a durable
third-party database, and it is one careless retrieval away from filing a private
conversation in a marketing system. The other skills in this marketplace produce a document
a human reads once. This one writes records that persist and get marketed to.

What follows from it:

- A direct message is recorded as a SIGNAL: sender name, send time, receipt, and the fact
  that a message arrived. The note says "Message contents not recorded. Read the thread on
  the platform." The body is never copied, paraphrased, or summarised into the CRM.
- Engagement on somebody else's post is excluded. The person did not raise a hand at the
  user. Piping them is scraping a stranger's audience.
- Public availability is not permission. The UK regulator states that a person seeking a
  large audience for a social post does not thereby make their personal information
  available for direct marketing
  [references/research/raw/piper--consent--ico-collect-information-and-generate-leads.md].
  The governing test is reasonable expectation, and the skill stays inside it by fulfilling
  the specific request the person made and enrolling nobody in a sequence.
- The source goes on the record, because recording the source of indirectly obtained data
  is a regulatory disclosure obligation, not CRM hygiene
  [references/research/raw/piper--consent--ico-collect-information-and-generate-leads.md].
- An existing contact with DND set is skipped entirely. Objection to direct marketing is
  absolute and immediate
  [references/research/raw/piper--consent--usercentrics-gdpr-legitimate-interest.md].
- **Never auto-send.** Every first message is queued as a draft for the user to send by
  hand, in every tier, including tier 1 where a connector might technically allow it. The
  platform prohibitions on automated messaging are documented in
  `lead-harvester/references/platform-rules.md`; read that rather than a restatement here.
  The consent
  research adds a second, independent reason: CAN-SPAM penalties attach per email, up to
  $53,088 each
  [references/research/raw/piper--consent--ftc-can-spam-compliance-guide.md], so an
  automated blast off a partly verified roster multiplies the exposure by the row count.
- Jurisdiction is surfaced, never decided. The US default is opt-out under CAN-SPAM
  [references/research/raw/piper--consent--ftc-can-spam-compliance-guide.md]; the UK default
  for email to individual subscribers is consent or the soft opt-in
  [references/research/raw/piper--consent--ico-choosing-lawful-basis-direct-marketing.md].
  Say which is in play. Do not give legal advice.

Full treatment in `references/consent-and-tagging.md`.

---

## Empty retrieval

If the searches return nothing for the window, **stop and report the gap. Do not fabricate a
roster** (`references/evidence-standards.md`, rule 9).

Say which queries ran, over which window, with which filters, and that they came back
empty. Then, critically:

**Do not advance the high-water mark.** Write `LAST_RUN_STATUS: empty-retrieval` and carry
the previous `WATERMARK_TIME` forward unchanged. Advancing the mark on a failed retrieval
permanently loses everyone who raised a hand in that window.

Distinguish two cases and say which one applies:

| Case | Meaning | Watermark |
|---|---|---|
| Nothing happened | Retrieval ran, returned items, none were new hand-raisers | Quiet day. Advance the mark. `LAST_RUN_STATUS: quiet` |
| Nothing was retrieved | Retrieval returned nothing at all, or errored | Possible failure. Hold the mark. `LAST_RUN_STATUS: empty-retrieval` |

The most common cause of the second case is that the user never had the post or the
notification surface on screen while Littlebird was watching. The fix is
`lead-harvester/references/capture-protocol.md`: open the thread, scroll it slowly for
sixty seconds, let capture read it. Point at that guide; do not restate it.

---

## Routine wiring

Offer this. Do not tell the user to go set it up by hand. `LB_INTERNAL_CREATE_ROUTINE`
works from an interactive session and is only blocked from inside a running routine
(`references/littlebird-mcp-reference.md`, routine tools).

Show the user the exact prompt text and the schedule, get approval with `AskUserQuestion`,
then call the routine creation tool. Creating one immediately generates a first report.
Note the plan-based limit on routine count, and check it with the subscription status tool
if creation fails.

Schedule: `{"frequency": "daily", "time": "08:00"}` in the user's local timezone, unless
they pick another from the options in the routine cadence section.

**Routine prompt text**, with bracketed values substituted from step 2:

> Read your own previous reports first, before writing anything and before searching.
> Find the most recent block in them labelled PIPER STATE. It contains WATERMARK_TIME,
> CAMPAIGN_TAG, PIPED_IDENTITIES, and LAST_RUN_STATUS. WATERMARK_TIME is the latest event
> time you have already reported. Set your search window to start 6 hours BEFORE
> WATERMARK_TIME and run through now. The 6 hour overlap is deliberate: capture lags the
> event, so a late-captured signal would otherwise be lost. If LAST_RUN_STATUS on the most
> recent report is empty-retrieval, use the watermark from the report before it instead,
> because that run did not advance the mark. If there is no PIPER STATE block anywhere, use
> the last 24 hours and say in your report that you had no watermark to work from.
>
> Search my captured context in that window for NEW public engagement on MY OWN posts for
> the [PLATFORM] campaign [CAMPAIGN NAME]. Run several narrow searches rather than one broad
> one. Cover: notifications naming people who commented on my post, expanded comment threads
> with names and comment text, reaction lists, pending friend and connection requests and
> new followers, and the ARRIVAL of new direct messages and message requests about the post
> or the offer.
>
> For direct messages, record only the sender name, the send time, and the fact that a
> message arrived. Do not quote, paraphrase, or summarise the contents of a private message
> anywhere in your report. Only public engagement on my own content gets reported in detail.
>
> Exclude anyone whose name appears in PIPED_IDENTITIES in any previous report. They have
> already been handled. If someone appears whose event time is earlier than WATERMARK_TIME
> and who is NOT in PIPED_IDENTITIES, include them and label them late-captured.
>
> Write a short report with five parts.
>
> First, the new hand-raisers you can NAME, each with the signal type, the event time (not
> the capture time), and the receipt in the form [Day, Month DD, YYYY HH:MM TZ | app]. Sort
> by event time, earliest first. For each one, state how many hours have passed between the
> signal and now.
>
> Second, the UNNAMED gap: every "and N others" or "N people reacted" string you saw, with
> the number, the surface it came from, and its receipt. Never present the named list as if
> it were complete.
>
> Third, anyone who has now given a SECOND distinct signal, for example someone who
> commented earlier and has now also sent a direct message or a friend request. Put these at
> the top and call them the hottest.
>
> Fourth, the action line: tell me to open Cowork and run the comment-to-crm-piper skill to
> dedupe these people against my CRM, tag them [CAMPAIGN TAG], and draft the first messages.
> If anyone has been waiting longer than [TARGET], say so explicitly and put it first.
>
> Fifth, the state block, formatted exactly like this and nothing else:
>
> --- PIPER STATE, DO NOT EDIT ---
> WATERMARK_TIME: the latest event time among the people in this report, in my local
> timezone
> CAMPAIGN_TAG: [CAMPAIGN TAG]
> PIPED_IDENTITIES:
> - one line per person named in this report
> UNNAMED_GAP: the total from part two
> LAST_RUN_STATUS: queued-for-cowork
> --- END PIPER STATE ---
>
> If nobody new raised a hand, say exactly that in ONE line, do not restate yesterday's
> people, do not invent anyone, and still write the state block with the previous
> WATERMARK_TIME carried forward unchanged, an empty PIPED_IDENTITIES list, and
> LAST_RUN_STATUS: quiet.
>
> If your searches return nothing at all, or error, say so and write the state block with
> the previous WATERMARK_TIME carried forward unchanged and LAST_RUN_STATUS:
> empty-retrieval. Do not advance the watermark on a failed search.

Set notifications on. The whole premise is that the user acts while the lead is warm, and a
report nobody sees is a report that did not happen.

**The escalation rule.** The prompt's third part IS the escalation: a person giving a second
distinct signal is promoted to the top. The fourth part adds a second escalation on elapsed
time against the target. A routine with no escalation rule flags the identical item every
day forever; observed in production
(`references/littlebird-mcp-reference.md`, the Routines-observe Cowork-acts pattern).

**Handoff to Cowork.** When the user opens Cowork and runs this skill, step 1 reads the
routine's past reports. That gives you the day-by-day timeline, the names captured while the
threads were fresh, the running unnamed gap, and the watermark, which is strictly better
than reconstructing everything from one retrieval. After piping, close the loop by updating
the routine prompt with an `ALREADY PIPED THROUGH yyyy-mm-dd` line. Read the current prompt
with the routine config tool first, because update REPLACES the whole prompt
(`references/littlebird-mcp-reference.md`, routine tools).

**Deleting the routine deletes the state.** The watermark lives in the report history. Tell
the user that before they delete anything.

---

## Evidence standards

Every claim follows `references/evidence-standards.md`. The rules that bite hardest here:

- **Rule 1, receipts.** Every signal carries one. For messages the send time and the
  collection time are different values and both appear.
- **Rule 2, observed and inferred.** "Dani commented on the Aug 14 post" is observed. "Dani
  is not in your CRM" is a search result whose strength depends on what you could search
  ON. Record `new (name-only search)` rather than `new`. Never convert an absence into a
  clean negative.
- **Rule 3, confidence.** A Low-rated row never drives an irreversible action. Creating a
  CRM record is close to irreversible in practice, and messaging a misidentified person is
  fully irreversible.
- **Rule 4, attribution.** Capture shows what the user was viewing. The user's own replies
  and a comment bot's public replies are not hand-raiser signals.
- **Rule 5, partial rosters.** The unnamed gap is a required section. A roster with no gap
  count implies a completeness it does not have.
- **Rule 6, confirmation.** Ambiguous merges before encoding. Actual records and actual
  draft text before writing or sending.
- **Rule 7, raw capture never ships.** Especially here: the artifact is a CRM feed, and raw
  capture must not ride into a third-party database.
- **Rule 8, timelines.** Sort by event time. Retrieval returns relevance order.
- **Rule 10, reporting on people.** Purpose-bound to the campaign. Provenance on every line.
  Sensitive categories stay out even when the capture contains them.

---

## Related skills

| Skill | Relationship |
|---|---|
| `lead-harvester` | The sibling. Campaign post-mortem: run it after a launch to reconstruct the full roster with scoring and segmentation. This skill is the daily drip that keeps the roster from needing reconstruction. It reuses lead-harvester's `signal-extraction-and-dedupe.md` matching ladder, `capture-protocol.md` scroll instructions, `first-touch-drafting.md` message shapes, and `platform-rules.md` platform prohibitions rather than duplicating any of them. |
| `routine-architect` | Use it if the user wants the daily watcher tuned, rescheduled, or merged with other routines. |
| A personal voice skill | If installed, drafts go through it. If not, this skill writes plainly and says so. |

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## References

| File | What it covers |
|---|---|
| `references/high-water-mark.md` | How "since last run" works, the state block, the three no-mark cases, the overlap arithmetic, closing the Cowork loop |
| `references/crm-tiers-and-import-formats.md` | The three tiers, the GoHighLevel upsert path and its hazards, the exact CSV header row and import instruction, the copy-paste fallback |
| `references/dedupe-against-crm.md` | Normalisation, the CRM search ladder, confidence bands, survivorship on enrichment, the split-record collision, the required dedupe report |
| `references/consent-and-tagging.md` | Public versus private, the reasonable-expectation test, lawful basis by channel and jurisdiction, opt-out at intake, the tag naming convention and why it is strict |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, confidence, attribution, partial rosters, confirmation gates |
| `references/research/distilled-lead-capture-and-crm-intake.md` | Cited distillation of the domain research |
| `references/research/README.md` | Archive contents, source mix, conflicts carried forward, named gaps |
