---
name: renewal-sentinel
description: "A 90-day radar for everything about to auto-charge. Trigger on what is renewing soon, upcoming renewals, cancel before it renews, domain expiring, SSL certificate expiry, annual subscription about to charge, auto-renewal deadline, renewal calendar, cancellation window. Mines Littlebird capture and calendar for renewal and expiry dates, builds a forward calendar of upcoming auto-charges with cancellation-window deadlines and evidence receipts, treats domains and certificates as their own class, and drafts cancel, downgrade and negotiation messages held for approval."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Renewal sentinel

Everything that is about to charge, for the next 90 days, with the date you actually have to
decide by.

## Purpose

Annual renewals are the ones that hurt. They are invisible for eleven months, then land as
one large charge, and the notice window that would have let the user out of it closed weeks
before the charge appeared. The operative deadline is never the renewal date. It is the
notice deadline, typically 30 days earlier, and a reminder set two weeks before renewal is
already too late to negotiate
[references/research/distilled-renewal-and-expiry-practice.md, section 3].

The value this skill delivers is lead time, not analysis. A renewal date is interesting.
Decision days remaining is actionable.

This works because renewal notices, expiry warnings, registrar dashboards, and annual
receipts all pass across the user's screen and Littlebird captures them without any finance
integration [references/littlebird-mcp-reference.md, Verified capability receipts].

**This is the forward-looking sibling of `money-leak-auditor`.** That skill looks backward at
spend that already happened and asks what is wasted. This one looks forward at what is about
to charge and asks what the user still has time to stop. Do not run a spend audit here.

## Littlebird MCP calls used

| Call | Used for |
|---|---|
| `search_user_context` | The renewal and expiry sweep. `data_source: snapshots` over 120 days for notices, warnings, auto-renew confirmations and dashboards; `data_source: summaries` for compressed daily coverage; `search_queries_messages` for SMS and in-app warnings; a separate 13-month pass for annual receipts |
| `LB_INTERNAL_LIST_MEETINGS` | Upcoming calendar events, called with a FUTURE `end_date`. This is how renewal reminders the user already set for themselves are found. There is no calendar tool [references/littlebird-mcp-reference.md, Meeting tools] |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Capability gate, and the user's own Littlebird renewal date, which is itself a calendar item |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Reading the weekly sentinel's own history before an on-demand run |
| `LB_INTERNAL_LIST_ROUTINES` | Checking whether the weekly sentinel already exists before offering to create it |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the weekly sentinel, after approval |
| `LB_INTERNAL_UPDATE_ROUTINE` | Changing the sentinel's schedule or prompt, after `LB_INTERNAL_GET_ROUTINE_CONFIG` |

## Trigger

Invoke when the user says any of: what is renewing soon, upcoming renewals, what is about to
charge me, cancel before it renews, my domain is expiring, SSL certificate expiry, annual
subscription about to hit, auto-renewal deadline, renewal calendar, cancellation window, what
do I need to decide about this month.

Also invoke after the weekly sentinel routine fires with something in its FLAGGED section.

## Routine cadence

Weekly, plus on demand. The weekly routine observes and notifies. The on-demand session does
the work, drafts, and asks for approvals. See the routine wiring section below.

## Capability gate

This skill requires the Littlebird MCP server on a Power or Pro plan.

1. **List the available tools before calling anything.** Use the real tool names from the
   live server. `references/littlebird-mcp-reference.md` records what was verified on
   2026-08-17 and is a starting point, not a guarantee.
2. If no Littlebird MCP tools are present, **stop** and tell the user this skill needs the
   Littlebird MCP connected. Do not build a renewal calendar from any other source.
3. If tools are present but plan status is in doubt, call
   `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` and report what it says.

## Evidence standards

Read `references/evidence-standards.md` before producing output. The rules that govern this
skill most directly:

- Every claim carries a receipt in the canonical format
  `[Tuesday, August 11, 2026 23:40 EDT | chrome]` (rule 1).
- Every line is observed, inferred, external, or unknown, and which one is visible to the
  reader (rule 2). **A date read off a notice is observed. A date computed from last year's
  charge is inferred and is written as projected, always, with the basis in parentheses.**
- Confidence is stated, and a Low-rated claim never drives an irreversible action (rule 3).
- Capture shows what the user was viewing, not what they bought (rule 4).
- Confirm before encoding, and confirm before sending (rule 6).
- Raw capture never ships (rule 7).
- Sort by event time, not by relevance order (rule 8).
- Empty retrieval ends the run (rule 9).

The rule specific to this skill: **absence of evidence is not evidence of no renewal.** A
vendor with no captured renewal signal is a vendor whose renewal has not been found yet. That
is why the output carries a known unknowns section and why it is not optional.

## Process

Six phases.

### Phase 1: scope and prior state

Ask the user two things with `AskUserQuestion`:

- Horizon. Default 90 days. Explain that 90 is this skill's convention, derived from the
  renewal work calendar plus the 30-day notice default, and not a measured optimum
  [references/research/distilled-renewal-and-expiry-practice.md, section 7, gap 1].
- Whether this covers personal, business, or both.

Then call `LB_INTERNAL_LIST_ROUTINES`. If the weekly sentinel exists, call
`LB_INTERNAL_GET_ROUTINE_REPORTS` with `limit` 8 and read its history before sweeping. Items
already flagged there start at the top of this run's calendar.

### Phase 2: the sweep

Follow `references/renewal-discovery.md`. Run query families A through G over 120 days back,
then the annual look-back over 13 months for family C only. Run the calendar sweep with
`LB_INTERNAL_LIST_MEETINGS` and a future `end_date`.

Use several narrow parallel queries rather than one broad one. A broad query against this
server returns 70,000-plus characters and gets written to a file instead of returned
[references/littlebird-mcp-reference.md, Oversized results].

Deduplicate before counting anything. A single renewal notice appears in a browser tab, an
email client, and a notification stack [references/littlebird-mcp-reference.md, Known
limitations].

### Phase 3: date and amount, with the basis attached

Follow `references/renewal-discovery.md`, extraction and projection rules.

Every item carries a date basis and an amount basis, and neither is ever blank. A projected
date is written as `2026-11-14 (projected from 2025-11-14 charge)`. The parenthetical is not
optional.

Three classes where projection is prohibited: certificates, because the maximum validity term
itself changed on 2026-03-15; hosting coming off a promotional term, because the renewal runs
2x to 4x the intro rate by design; and anything the user has said they already cancelled
[references/research/distilled-renewal-and-expiry-practice.md, sections 4 and 6].

### Phase 4: cancellation windows

Follow `references/cancellation-windows.md`. This is the phase that produces the field the
skill exists for.

For every item compute `decision_deadline = renewal_date - notice_window_days` and
`decision_days_left`. Record where the window number came from, ranked contract, then vendor
terms page, then user-supplied, then the 30-day benchmark default
[references/research/distilled-renewal-and-expiry-practice.md, section 3].

**Sort the calendar by decision deadline, not by renewal date.** An item renewing in 80 days
with a 90-day window is more urgent than an item renewing in 20 days with no window at all.

Where the assumed window is the default, state in the same line that a 60 or 90 day window
would mean the deadline has already passed. Do not silently pick one reading when the sources
conflict.

### Phase 5: domains and certificates, as their own class

Follow `references/domain-and-ssl.md`. These are ranked by blast radius, never by dollar
amount, because a domain expiry stops mail routing and a user with no mail stops receiving
the renewal notices for everything else they own
[references/research/distilled-renewal-and-expiry-practice.md, section 5].

Read that guide before writing any expiry deadline. The Redemption Grace Period runs 30 days
from **deletion**, not from expiry, and conflating them puts the deadline roughly a month too
late [references/research/distilled-renewal-and-expiry-practice.md, section 5].

### Phase 6: flag, draft, hold

Present the calendar. Ask which items the user wants to act on, with `AskUserQuestion`. Draft
only for those, following `references/cancel-and-downgrade-drafts.md`.

Do not pre-draft the whole calendar. Most renewals are things the user wants.

Run the approval gate per draft, not per batch. Nothing is sent.

## Output

Two files in the working directory, dated with the run date.

**`renewal-calendar-YYYY-MM-DD.md`**, containing in this order:

1. **Decision deadlines inside 14 days**, or already passed. The top of the report.
2. **The 90-day forward calendar**, one row per item, sorted by decision deadline:

   | Column | Contents |
   |---|---|
   | Decision by | The notice deadline, with days remaining |
   | Renewal date | The date, and `(projected from ...)` where inferred |
   | Item | Vendor or domain, as captured |
   | Class | domain, certificate, hosting, API plan, software, other |
   | Est. amount | As shown, or a range, or `not captured` |
   | Confidence | High, Medium, Low, per `references/evidence-standards.md` rule 3 |
   | Window basis | contract, vendor terms, user-supplied, or assumed default |
   | Evidence receipt | Canonical format, per rule 1 |
   | Action | keep, cancel, downgrade, negotiate, investigate |

3. **Domain and certificate section**, ranked by blast radius with the lifecycle deadlines
   spelled out per item.
4. **Known unknowns**, listing every vendor the user confirmed they pay for where no renewal
   date was found, each with the windows and queries swept, the last observation of any kind,
   and the one action that would close the gap.
5. **What was searched**, the windows, the query families, and the filters, so a reader can
   judge the sweep.

**`renewal-drafts-YYYY-MM-DD.md`**, one drafted message per flagged item, each headed
`STATUS: HELD FOR APPROVAL. Not sent.`

If the user names a different location, use it. If nothing was found, write only the calendar
file and have it say what was searched and what came back empty.

## Empty retrieval branch

If families A through E return nothing across the whole window, the run ends. Write the
calendar file with the date windows searched, the exact queries and filters run, the statement
that no renewal or expiry evidence was found in that window, and what would change the
outcome: a wider window, a period when the user was actually doing billing, or a check that
Littlebird capture was running.

Do not reconstruct a plausible renewal calendar from what a business of this shape usually
buys [references/evidence-standards.md, rule 9].

If the sweep returns nothing even for items the user has just named as annual subscriptions,
suspect the sweep, not the stack. Check the date window and the filter values and report the
malfunction.

## Guardrail

**A wrong renewal date is worse than no renewal date, and this skill generates dates by
inference.**

A user who trusts a projected date and finds it was a month early loses nothing. A user who
trusts a projected date that was a month late has already been charged, and they stopped
watching because this skill told them they had time. That asymmetry governs every design rule
here:

- A projected date always says it is projected, in the same cell as the date.
- A projected date is Medium confidence at best, and Low from a single OCR fragment.
- Where the notice window is assumed rather than known, the entry states what a longer window
  would mean, because the failure mode is always an assumed window that was too short.
- Certificates and promotional-term hosting are never projected at all.
- The known unknowns section exists so that a short calendar is never mistaken for a complete
  one.

The second guardrail, on the legal side: **there is no federal click-to-cancel rule in
force.** The FTC's 2024 revised Negative Option Rule was vacated in its entirety by the Eighth
Circuit in *Custom Communications, Inc. v. Federal Trade Commission* on 2025-07-08, on the
procedural ground that the Commission had not performed the required preliminary regulatory
analysis. A replacement is at advance-notice-of-rulemaking stage, announced 2026-03-11 with
comments closed 2026-04-13, so there is no proposed rule text and no compliance date. The
Negative Option Rule that does remain in force dates from 1973 and covers prenotification
plans such as product-of-the-month clubs, not SaaS auto-renewals. Federal enforcement runs
through ROSCA and Section 5 of the FTC Act
[references/research/distilled-renewal-and-expiry-practice.md, section 1].

Never tell a user federal law requires their vendor to make cancellation easy. Never say the
rule was struck down on the merits; it was vacated on procedure and the court did not reach
the substance. Never predict what the replacement will require. Real cancellation-ease
obligations come from state law, principally California, or from the vendor's own contract
[references/research/distilled-renewal-and-expiry-practice.md, sections 1 and 2]. No drafted
message cites any of it [references/cancel-and-downgrade-drafts.md].

## Never draft-and-send

The skill drafts. The user sends. There is no path through this skill that transmits anything
to a vendor.

Do not call an email tool. Do not open a compose surface and fill it. Do not offer to send as
a convenience. Every draft goes into `renewal-drafts-YYYY-MM-DD.md` headed
`STATUS: HELD FOR APPROVAL. Not sent.` and the run stops at the approval gate
[references/evidence-standards.md, rule 6].

Gmail, Outlook, helpdesks and the rest are separate MCP servers that may or may not be
connected here. List available tools before assuming any of them exists, and when none is
present produce the copy-and-paste drafts file, which is the normal case and costs nothing.

## Voice

Drafts are written as the user. Check whether a personal voice skill is installed in this
session and use it if present. If none is installed, say so plainly in the drafts file and
write in plain, direct business prose. Never invent a voice profile from capture; point the
user at this marketplace's voice creator skills instead.

## Routine wiring: the weekly renewal sentinel

The on-demand run is the primary mode. The weekly routine is a cheap observer that watches
the horizon between runs and hands off when something enters it.

**Offer to create it.** Routines can be created from an interactive session; only a running
routine is blocked from creating them [references/littlebird-mcp-reference.md, Routine
tools]. Show the user the exact prompt text and schedule below, get approval with
`AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Do not tell the user to go set it
up by hand.

Call `LB_INTERNAL_LIST_ROUTINES` first. If a sentinel already exists, do not create a second
one; call `LB_INTERNAL_GET_ROUTINE_CONFIG` and offer an update instead, remembering that
`prompt` and `schedule` each replace the whole field
[references/littlebird-mcp-reference.md, Routine tools].

**Title:** `Renewal sentinel`

**Schedule:** `{"frequency": "weekly", "week_days": ["MO"], "time": "07:30"}`

**Notifications:** enable push. Enable email if the user wants a copy.

**Prompt text, verbatim:**

```
You are a weekly renewal sentinel. Your job is to watch the next 90 days for anything about
to auto-charge or expire. You do not run a full sweep, you do not draft anything, and you do
not contact any vendor.

FIRST, before searching, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 8
and read your own previous reports. You need them to tell a new item from a repeated one and
to escalate correctly. Do not skip this step.

Then do two retrievals.

RETRIEVAL 1. Search the user's captured context for the last 14 days, using several narrow
queries rather than one broad one, covering:
- Renewal notices: "your subscription renews on", "your plan will automatically renew",
  "annual renewal reminder", "we will charge your card on", "your next payment is scheduled
  for".
- Expiry warnings: "your domain is expiring", "domain expiration notice renew now", "your
  certificate expires on", "SSL certificate expiring in days", "your plan expires on".
- Price changes: "we are updating our pricing", "your plan is changing price", "price
  increase effective".
- Trial conversions: "your trial ends and you will be charged", "credits expire on".
Also search message threads for "subscription renewing", "card will be charged", "domain
expires".

RETRIEVAL 2. Call LB_INTERNAL_LIST_MEETINGS with a start date of today and an end date 90
days in the future. Read the event titles for renewal reminders the user set for themselves.
Upcoming events carry no summary and no transcript, so read the titles directly.

Write a report with exactly these five sections.

DECIDE THIS WEEK
Any item whose cancellation deadline falls inside the next 14 days, or has already passed.
For each: item, renewal date, the deadline, days remaining, and the evidence receipt in the
form [Weekday, Month D, YYYY HH:MM TZ | app]. Where you do not know the notice window, say
you assumed 30 days and say plainly that a 60 or 90 day window would mean the deadline has
already passed. This section goes first even when it is empty; if it is empty, say "nothing
inside 14 days".

NEW ON THE HORIZON
Renewals and expiries that entered the 90-day window since your last report. An item is NEW
only if it does not appear in any previous report you just read. Give the item, the date, the
amount if the capture showed one, and the receipt. Never state an amount the capture did not
show; write "amount not captured" instead.

DOMAINS AND CERTIFICATES
These are separate and they are ranked by what breaks, not by price. A domain expiry stops
email as well as the website, which means the user stops receiving every other renewal notice
too. A certificate expiry is an instant full outage. List any domain or certificate expiry
inside 90 days first, then anything inside 120 days as an early warning. Do not project a
certificate expiry from a previous year: the maximum certificate validity period changed on
2026-03-15 from 398 days to 200 days, so last year's date does not predict this year's.

PRICE MOVED
Any observed price change on something that renews, with old and new amounts only where the
capture showed both, and the receipt.

STILL UNKNOWN
Anything you expected to see and did not, in one or two lines. Absence of a renewal notice is
not evidence that nothing is renewing.

ESCALATION RULE. Compare against the previous reports you read at the start.
- An item appearing for the SECOND consecutive week: mark it REPEAT and say how many days of
  decision time have been lost since you first raised it.
- An item appearing for the THIRD consecutive week or more: mark it ESCALATED, move it to the
  top of the report, state how many days remain, and say plainly that notification is not
  working and this needs a decision now.
- An item whose deadline has PASSED since your last report: mark it MISSED, say what it will
  now cost, and stop tracking it after one more report.
- An item that resolved since the last report: say so in one line and stop tracking it.
Never report the same item in the same words two weeks running. If nothing has changed, say
nothing has changed and give the new days-remaining number, which has changed by seven.

LEGAL ACCURACY. Do not tell the user that federal law requires a vendor to make cancellation
easy. There is no federal click-to-cancel rule in force: the FTC rule was vacated in July
2025 and its replacement is at advance-notice-of-rulemaking stage. Do not cite it.

HANDOFF. End every report with this line, adjusted for what you found:
"Open Cowork and run renewal-sentinel for the full calendar and drafts. This week's priority:
X." Where X is the single item with the least decision time remaining, with domain and
certificate expiries outranking dollar amounts.

If the searches return nothing, say so plainly, name the window you searched, and stop. Do
not fill the report from what you would expect a business like this to be renewing.
```

**How the handoff works.** The routine observes and notifies. It cannot approve, draft, or
write files. The user opens Cowork, invokes this skill, and phase 1 reads the sentinel's own
history with `LB_INTERNAL_GET_ROUTINE_REPORTS`, which gives the on-demand run a change log it
would otherwise have to rebuild [references/littlebird-mcp-reference.md, The
Routines-observe, Cowork-acts pattern].

**When invoked after a sentinel alert**, read the last 8 reports first. Items marked REPEAT or
ESCALATED go to the top of the calendar regardless of their decision deadline.

## Calibration and honesty notes

- The 90-day horizon is this skill's convention. No source in the archive measures the optimal
  renewal lead time [references/research/distilled-renewal-and-expiry-practice.md, section 7,
  gap 1]. Present it as a convention and let the user move it.
- The 30-day notice default rests on the only archived figure with a stated dataset, 84% of
  auto-renewing cloud service agreements in a corpus of more than 10,000
  [references/research/distilled-renewal-and-expiry-practice.md, section 3]. Other sources
  put the band at 30 to 90 days. The conflict is reported, not smoothed.
- Do not apply the 30-day window to a self-serve credit-card plan. Those frequently have no
  notice requirement and cancel effective at the end of the term
  [references/research/distilled-renewal-and-expiry-practice.md, section 3].
- Use 5% to 8% as the escalator projection basis, not 12% to 18%. Only the first has a stated
  dataset behind it [references/research/distilled-renewal-and-expiry-practice.md,
  sections 3 and 4].
- Every quantitative source in the archive describes enterprise or mid-market buyers, and the
  dollar figures explicitly describe contracts of $30,000 to $120,000. Nothing in the archive
  calibrates a one-person business
  [references/research/distilled-renewal-and-expiry-practice.md, section 7, gap 2]. Do not
  quote those dollar figures to a solo operator.
- Nine of fifteen archived sources sell renewal tracking, SaaS management, certificate
  automation, contract tooling, or hosting, and each has a commercial interest in these
  problems looking large [references/research/README.md]. Quote their figures as vendor
  estimates.
- Everything legal in this archive is United States law. A user with a European or United
  Kingdom vendor relationship gets nothing from it
  [references/research/distilled-renewal-and-expiry-practice.md, section 7, gap 7]. Say so
  rather than generalising.

## Related skills

| Skill | Relationship |
|---|---|
| `money-leak-auditor` | The backward-looking sibling. It audits spend that already happened, proves which paid tools go unopened, and traces failed-payment cascades. Its confirmed vendor ledger is the best available roster for building this skill's known unknowns list. Run it first if the user does not know what they pay for |
| `routine-architect` | For tuning the weekly sentinel's schedule and prompt once it has run a few times |

Ship Gate removed, research-only skill, produces no committable code.

## Reference map

| File | Read it when |
|---|---|
| `references/renewal-discovery.md` | Phases 2 and 3. The two data windows, the seven query families, the calendar sweep, extraction, deduplication, projection rules, known unknowns |
| `references/cancellation-windows.md` | Phase 4. The arithmetic, where the window number comes from, the four window states, the closed-window paths, the legal position, the negotiation clock |
| `references/domain-and-ssl.md` | Phase 5. The domain lifecycle with day counts, registrar notice obligations, the certificate validity schedule, hosting price behavior, severity ranking |
| `references/cancel-and-downgrade-drafts.md` | Phase 6. Draft types and structure, what a draft never contains, voice, connectors, the approval gate |
| `references/evidence-standards.md` | Before writing any output. Every phase |
| `references/littlebird-mcp-reference.md` | Before calling any Littlebird tool. Parameters, return shapes, known limitations |
| `references/research/distilled-renewal-and-expiry-practice.md` | Any time a domain figure or a legal statement is about to be made |
| `references/research/raw/` | To check a citation back to its source |
