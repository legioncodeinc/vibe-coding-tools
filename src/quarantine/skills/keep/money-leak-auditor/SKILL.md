---
name: money-leak-auditor
description: "Audit SaaS and vendor spend from Littlebird screen capture. Trigger on
  subscription audit, where is my money going, cancel unused tools, find zombie
  subscriptions, failed payments, SaaS spend review, cut software costs, what am I paying
  for. Reconstructs a receipted vendor ledger from captured billing notices, receipts,
  dashboards and card alerts, proves which paid tools have not been opened in 90 days,
  traces failed-payment cascades back to one root cause, and produces a cancel, downgrade,
  consolidate and renegotiate action pack with cancellation emails drafted and held for
  approval."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Money leak auditor

Rebuild the user's entire software and vendor spend from screen capture, price it, and
find the leaks.

## Purpose

This works because half of a solo operator's or small agency's spend never reaches a
finance tool. It lives in billing emails, Stripe receipts, vendor dashboards, and card
decline alerts. Between 30% and 40% of large-organization IT spend is already outside the
system of record, card-bought expensed software grew 267% year over year, and a
one-person business has no procurement system at all
[references/research/distilled-saas-spend-leakage.md, section 2]. Screen capture reads
all of those surfaces. That is the entire premise.

The skill looks backward at spend that already happened and asks what is wasted: what is
paid for and never opened, what is failing and about to delete data, and what is priced
above what the user would pay today. **The forward-looking half, what is about to charge
and what can still be stopped, belongs to `renewal-sentinel`.** Do not build a renewal
calendar here.

## Littlebird MCP calls used

| Call | Used for |
|---|---|
| `search_user_context` | The whole sweep. Families A through F and H run with `data_source: snapshots` or `summaries`, `date_range` walked one month at a time across the scope agreed in phase 1; family C also runs `search_queries_messages` for SMS and in-app dunning; families D and G set `app: chrome` or the vendor's own application name. Family G repeats at 30, 60 and 90 day windows for the usage sweep. Exact queries in the retrieval brief below |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Capability gate when plan status is in doubt. No parameters |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Reading the monthly spend sentinel's own history before an on-demand audit, `limit` 6, so the audit inherits a change log instead of rebuilding one |
| `LB_INTERNAL_CREATE_ROUTINE` | Creating the monthly spend sentinel after approval, with `title`, `prompt`, `schedule`, and the notification flags given in the routine wiring section |

## Trigger

Invoke when the user says any of: subscription audit, where is my money going, cancel
unused tools, find zombie subscriptions, failed payments, SaaS spend review, cut software
costs, what am I paying for, why did my card get declined, what is this charge.

Also invoke after the monthly spend sentinel fires with anything marked REPEAT or
ESCALATED.

## Routine cadence

Monthly, plus on demand. The monthly sentinel observes and notifies. The on-demand session
does the audit, the drafts, and the approvals.

Routines can be created from an interactive session, so this skill offers to create its own
sentinel rather than telling the user to go set one up by hand. Only a running routine is
blocked from calling `LB_INTERNAL_CREATE_ROUTINE`
[references/littlebird-mcp-reference.md, Routine tools]. See the routine wiring section
below for the exact prompt text and schedule.

## Capability gate

This skill requires the Littlebird MCP server on a Power or Pro plan.

1. **List the available tools before calling anything.** Use the real tool names from the
   live server. Do not assume the names in `references/littlebird-mcp-reference.md` are
   still current; that file records what was verified on 2026-08-17 and is a starting
   point, not a guarantee.
2. If no Littlebird MCP tools are present, **stop** and tell the user this skill needs the
   Littlebird MCP connected. Do not attempt the audit from any other source.
3. If tools are present but plan status is in doubt, call
   `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` and report what it says.

## Evidence standards

Read `references/evidence-standards.md` before producing output. It is not optional
background. The rules that govern this skill most directly:

- Every claim carries a receipt in the canonical format
  `[Tuesday, August 11, 2026 23:40 EDT | chrome]` (rule 1).
- Every line is observed, inferred, external, or unknown, and which one is visible to the
  reader (rule 2).
- **"No evidence of use in 90 days" and "unused" are different claims. Only the first is
  supportable** (rule 2). This governs the entire zombie section.
- Confidence ratings are stated, and a Low-rated claim never drives an irreversible
  action (rule 3).
- Capture shows what the user was viewing, not what they bought (rule 4).
- Confirm before encoding, and confirm before sending (rule 6).
- Raw capture never ships (rule 7).
- Empty retrieval ends the run (rule 9).

The pricing rule specific to this skill: **never assert a price the capture did not
show.** An amount seen once is Medium. An amount seen across three consecutive billing
periods is High.

## Output

The skill writes three files into the working directory, dated with the run date:

| File | Contents |
|---|---|
| `money-leak-audit-YYYY-MM-DD.md` | The report: run rate, findings, cascade trace, the five action lists, projected savings with error bars, and the named gaps. |
| `vendor-ledger-YYYY-MM-DD.csv` | One row per vendor line, in the schema defined in `references/vendor-ledger-construction.md` step 7, including every evidence receipt. |
| `cancellation-drafts-YYYY-MM-DD.md` | Every drafted cancellation and negotiation email, each headed `STATUS: HELD FOR APPROVAL. Not sent.` |

If the user names a different location, use it. If nothing was found, write only the
report, and have it say what was searched and what came back empty.

## Process

Seven phases. Do not skip phase 4.

### Phase 1: scope

Ask the user two things before sweeping, using `AskUserQuestion`:

- How far back to sweep. Default 12 months, walked one month at a time.
- Whether this is personal spend, business spend, or both.

### Phase 2: build the candidate ledger

Follow `references/vendor-ledger-construction.md` steps 1 through 3. Run the five query
families, extract candidate lines, and deduplicate.

Use several narrow parallel queries rather than one broad one. A broad query against this
server returns 70,000-plus characters and gets dumped to a file instead of returned
[references/littlebird-mcp-reference.md, Oversized results].

Run `scripts/ledger_math.py` on the candidate lines rather than deduplicating by eye. OCR
of a billing dashboard repeats lines, and the collapse plus the run-rate arithmetic across
four cadences and three confidence tiers is deterministic work.

### Phase 3: rate confidence

Follow `references/vendor-ledger-construction.md` steps 4 and 5. Rate the amount and the
cadence separately. A vendor with no observed amount stays on the ledger with amount
`unknown`. A vendor with unknown cadence is excluded from the run rate and reported in its
own block.

### Phase 4: confirm the vendor list, before pricing anything

**This gate is mandatory and it comes before any total.**

Capture both misses vendors and invents them. A pricing page the user read, an ad they
scrolled past, or a competitor's dashboard in a screen share all put a vendor name and a
price into the capture with no payment behind it.

Run `AskUserQuestion` presenting three groups: confirmed by a payment artifact, named but
unpaid in capture, and ambiguous. Ask the open question too: what are you paying for that
is not on this list. See `references/vendor-ledger-construction.md` step 6.

Only after this gate: price, total, and proceed.

### Phase 5: zombie detection

Follow `references/zombie-detection.md`. For every confirmed paid vendor, run the three
query families at 30, 60, and 90 days and assign a `usage_verdict`.

Guard the four traps that guide names, especially the third: **infrastructure, APIs,
deliverability, monitoring, backups, gateways, and scheduled automation deliver full value
with zero screen time.** Those are `background-suspected`, they go to a question, and they
never go on a cancel list.

Every zombie finding ships with the sweep that produced it: the windows, the queries, the
filters, and the last observation of any kind.

### Phase 6: cascade tracing

Follow `references/cascade-tracing.md`. Harvest failure signals, build a timeline sorted
by event time, find the common payment instrument, and report **one cause, one fix, and
the exceptions** rather than N separate problems.

Triage by damage, not by dollar amount. Data deletion outranks a large failing charge,
because money is recoverable and data is not.

Cross the cascade against the zombie list. A failing charge on an unused vendor is a
cancellation the vendor already started, not a problem to fix.

### Phase 7: the action pack

Follow `references/action-pack-and-negotiation.md`. Produce five lists: cancel, downgrade,
consolidate, renegotiate, keep. Every vendor lands in exactly one.

Build the downgrade list first. Underutilization is 51% of licenses against 14% entirely
unused, so right-sizing is the larger savings pool and the less painful action
[references/research/distilled-saas-spend-leakage.md, section 1].

Report savings by action with the confidence they inherit, and present three totals:
confirmed, probable, and a negotiation range kept separate and not added in.

Draft the emails. Hold them. Run the approval gate.

## Retrieval brief

The actual queries. Run each family with `search_user_context`, windowed one month at a
time and walked back across the scope agreed in phase 1.

| Family | `filters` | Queries |
|---|---|---|
| A. Receipts and invoices | `data_source: snapshots` | "payment receipt from", "your invoice is available", "thanks for your payment", "receipt for your subscription", "invoice paid amount due" |
| B. Renewal and price change | `data_source: snapshots` | "your subscription renews on", "your plan is changing price", "we are updating our pricing", "annual renewal reminder", "upcoming charge notification" |
| C. Failures and dunning | `data_source: snapshots` plus `search_queries_messages` | "payment failed", "your card was declined", "action required to keep your account", "past due balance", "account will be suspended", "your data will be deleted" |
| D. Billing dashboards | `app: chrome`, `data_source: snapshots` | "billing and plans current plan", "manage subscription next billing date", "usage this billing period", "payment method on file" |
| E. Aggregator surfaces | `data_source: snapshots` | "Stripe receipt", "Apple subscriptions receipt", "Google Play order receipt", "AWS marketplace charges", "App Store purchase confirmation" |
| F. Activity digests | `data_source: summaries` | "invoice", "subscription", "payment", "billing", vendor names from the ledger |
| G. Per-vendor usage sweep | `app: chrome`, and `app` set to the vendor's own application name | Vendor domain, plus at least one string from the product's working interface. 30 / 60 / 90 day windows. See `references/zombie-detection.md`. |
| H. Card and issuer alerts | `data_source: snapshots` | "transaction declined", "card declined alert", "insufficient funds", "your card ending in", "card expired update payment" |

Two retrieval disciplines that matter here specifically:

- **Read the relevance scores.** Items scoring below 3 are omitted entirely, and a single
  3-scored item does not support a claim without corroboration
  [references/littlebird-mcp-reference.md, Retrieval patterns].
- **Sort by timestamp before presenting anything.** Results come back in relevance order,
  not chronological order [references/littlebird-mcp-reference.md, Known limitations].

## Empty retrieval branch

If the sweep returns nothing across families A through E, the run ends. Write the report
with:

- The date windows searched, month by month.
- The exact queries and filters run.
- The statement that no billing or vendor spend evidence was found in that window.
- What would change the outcome: a wider window, a period when the user was actually doing
  billing, or a check that Littlebird capture was running.

Do not reconstruct a plausible stack from what a business of this shape usually buys. Do
not fill the ledger from training data. A report saying "I found nothing for this window"
is the correct output [references/evidence-standards.md, rule 9].

The same rule applies at phase 5: if usage sweeps return nothing even for tools the user
uses daily, the sweep is broken, not the stack. Report the malfunction rather than
declaring the stack dead.

## Guardrail

**The cancel list is the dangerous output. Everything else in this report is reversible.**

A subscription kept one month too long costs one month of money, and money comes back. A
service cancelled because it left no screen evidence can cost DNS, mail deliverability,
backups, monitoring, a payment gateway, or a scheduled automation that nothing was watching.
That damage does not come back. The asymmetry governs the rules:

- **Infrastructure, APIs, deliverability, monitoring, backups, gateways and scheduled
  automation deliver full value with zero screen time.** They are `background-suspected`,
  they become a question to the user, and they never reach a cancel list
  [references/zombie-detection.md, trap 3].
- **"No evidence of use in 90 days" and "unused" are different claims, and only the first is
  supportable** [references/evidence-standards.md, rule 2]. Write the one you can defend.
- Every zombie finding ships with the sweep that produced it, so the user can see the
  windows, the queries and the filters that failed to find usage rather than a bare verdict.
- A Low-rated claim never drives an irreversible action
  [references/evidence-standards.md, rule 3].
- The phase 4 confirmation gate is mandatory and comes before any total, because capture
  invents vendors as readily as it misses them. A pricing page read, an ad scrolled past, or
  a competitor's dashboard seen in a screen share puts a vendor name and a price into capture
  with no payment behind it [references/vendor-ledger-construction.md, step 6].

**The second guardrail is other people's billing.** Capture reads whatever crossed the
screen, which includes a client's billing dashboard in a screen share, a colleague's invoice,
and a vendor portal belonging to someone else. That is not the user's spend. It never enters
the ledger as theirs, it never appears in an output file, and it never appears in a draft
[references/evidence-standards.md, rules 4 and 7]. No draft quotes raw capture, names other
vendors, or describes the user's stack beyond the account being cancelled.

## Never draft-and-send

The skill drafts. The user sends. There is no path through this skill that transmits
anything to a vendor.

Do not call an email tool. Do not open a compose surface and fill it. Do not offer to send
as a convenience. Every draft goes into `cancellation-drafts-YYYY-MM-DD.md` headed
`STATUS: HELD FOR APPROVAL. Not sent.` and the run stops at the approval gate
[references/evidence-standards.md, rule 6].

No draft quotes raw capture, names other vendors, or describes the user's stack beyond the
account being cancelled [references/evidence-standards.md, rule 7].

## Routine wiring: the monthly spend sentinel

The on-demand audit is the primary mode. The sentinel is a cheap monthly observer that
watches for change between audits and hands off when it finds something.

**Offer to create it.** Show the user the exact title, schedule and prompt text below, get
approval with `AskUserQuestion`, then call `LB_INTERNAL_CREATE_ROUTINE`. Do not tell the user
to go set it up by hand. This works from an interactive session; only a running routine is
blocked from creating or editing routines
[references/littlebird-mcp-reference.md, Routine tools].

**Title:** `Spend sentinel`

**Schedule:** `{"frequency": "monthly", "month_day": 1, "time": "08:00"}`

**Notifications:** enable push. Enable email if the user wants a copy.

**Prompt text, verbatim:**

```
You are a monthly spend sentinel. Your job is to detect CHANGE in the user's software
and vendor spend. You do not run a full audit and you do not draft anything.

FIRST, before searching, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with
limit 6 and read your own previous reports. You need them to tell new from repeated and
to escalate correctly. Do not skip this step.

Then search the user's captured context for the last 35 days, using several narrow
queries rather than one broad one, covering:

1. NEW CHARGES. Queries: "payment receipt from", "thanks for your payment", "your
   subscription has started", "welcome to your new plan", "receipt for your
   subscription". A vendor is NEW only if it does not appear in any previous report you
   just read.

2. FAILED CHARGES. Queries: "payment failed", "your card was declined", "action
   required to keep your account", "past due balance", "account will be suspended",
   "your data will be deleted", "transaction declined", "insufficient funds". Also
   search message threads for the same, since these arrive as SMS and in-app alerts.

3. PRICE INCREASES. Queries: "we are updating our pricing", "your plan is changing
   price", "your subscription renews on", "annual renewal reminder", "price increase
   effective". Report the old and new amounts only where the capture shows both.

Write a report with exactly these four sections:

NEW THIS MONTH
Each new vendor, with the amount as shown, the date, and the evidence receipt in the
form [Weekday, Month D, YYYY HH:MM TZ | app]. Never state an amount the capture did not
show. If no amount was captured, say the vendor name and "amount not captured".

FAILING NOW
Each failing charge, with vendor, amount, escalation stage, and receipt. If two or more
vendors are failing, check whether the notices name the same card or the same last four
digits, and say so. Do not diagnose the root cause in detail; that is the on-demand
skill's job. State the pattern and hand off.

PRICE MOVED
Each observed price change, with old amount, new amount, and receipt. Flag any increase
above 5 percent, which exceeds the buyer-protective norm, and call out any increase
above 12 percent, which exceeds even the typical vendor ask.

UNCHANGED AND NOTABLE
Anything you expected to see and did not, in one or two lines.

ESCALATION RULE. Compare against the previous reports you read at the start.
- An item appearing for the SECOND consecutive month: mark it REPEAT and say how long
  it has been open.
- An item appearing for the THIRD consecutive month or more: mark it ESCALATED, move it
  to the top of the report, and state plainly that the passive approach is not working
  and it needs a decision, not another notification.
- An item that has resolved since the last report: say so in one line and stop tracking
  it.
Never report the same item in the same words two months running. If nothing about it
has changed, say that nothing has changed and how many months it has now been open.

HANDOFF. End every report with this line, adjusted for what you found:
"Open Cowork and run money-leak-auditor for the full audit. This month's priority: X."
Where X is the single highest-damage item, ranked by data loss first, then service
shutdown, then dollar amount.

If the searches return nothing, say so plainly, name the window you searched, and stop.
Do not fill the report from what you would expect a business like this to be paying
for.
```

**How the handoff works.** The routine observes and notifies. It cannot approve, draft, or
write files. The user opens Cowork, invokes this skill, and the skill reads the sentinel's
own history with `LB_INTERNAL_GET_ROUTINE_REPORTS` before sweeping, which gives the audit a
change log it would otherwise have to reconstruct
[references/littlebird-mcp-reference.md, The Routines-observe, Cowork-acts pattern].

**When invoked after a sentinel alert**, read the last 6 sentinel reports first. Vendors
already flagged REPEAT or ESCALATED go to the top of the action pack.

## Illustrative receipt

What ordinary capture already yields, before any dedicated sweep. On a real account, a
general-purpose daily routine that was not designed for spend auditing surfaced an
infrastructure vendor failing repeatedly at $700.19 with a shutdown warning, an AI coding
tool at $216 and again at $90, an email infrastructure vendor at $499, a data API at $95, a
code review tool at $73.75, a media editor at $65, an AI gateway at $49, a proxy service at
$30, plus a secrets manager, a writing tool, an affiliate platform, and an audience tool
threatening data deletion. All of it traced to one unfunded business card.

Two things follow. A dedicated sweep will find considerably more than an incidental one.
And that daily routine reported twelve problems where a cascade trace reports one cause,
one fix, and one exception.

## Calibration and honesty notes

- A median company runs 25 active subscriptions and the top 10% run 49 or more
  [references/research/distilled-saas-spend-leakage.md, section 3]. A confirmed ledger far
  under 25 lines for an operating business is evidence of a thin sweep, not a lean stack.
  Say so.
- Do not quote a single industry waste percentage as settled. The sources disagree, using
  36%, 46%, 51%, and a 14% plus 51% split, and none of them state a comparable denominator
  [references/research/distilled-saas-spend-leakage.md, section 1].
- Do not apply enterprise dollar waste averages to a solo operator. The archive explicitly
  warns those band averages are dominated by the top of their range
  [references/research/distilled-saas-spend-leakage.md, section 3].
- The 30 / 60 / 90 day zombie windows are this skill's operating convention, not researched
  thresholds. No source in the archive establishes how long a paid tool must go unopened
  before cancellation is justified
  [references/research/distilled-saas-spend-leakage.md, section 9, gap 4]. Present them as
  conventions and let the user move them.
- Ten of the twelve archived sources are published by companies selling SaaS management,
  spend control, or dunning tooling, and each has a commercial interest in a large waste
  number [references/research/distilled-saas-spend-leakage.md, section 9, gap 5]. Quote
  their figures as vendor estimates.

## Related skills

| Skill | Relationship |
|---|---|
| `renewal-sentinel` | The forward-looking sibling. It builds a 90-day calendar of what is about to auto-charge, with the cancellation-window deadline attached. Reach for it when the question is what can still be stopped rather than what has already been wasted. This skill's confirmed vendor ledger is the best roster to hand it |
| `invoice-chaser` | The other direction of the same money. It rebuilds receivables from capture of invoices the user sent. Reach for it when the problem is money owed to the user rather than money leaving |
| `routine-architect` | For tuning the monthly spend sentinel's prompt and schedule once it has a few reports behind it |

## Reference map

| File | Read it when |
|---|---|
| `references/vendor-ledger-construction.md` | Phases 2, 3, 4. Sweeping, extracting, deduplicating, confidence rating, the ledger schema, run rate. |
| `references/zombie-detection.md` | Phase 5. Usage sweeps, the four traps, verdict values, reporting the sweep. |
| `references/cascade-tracing.md` | Phase 6. Failure harvest, timeline, root cause, damage triage. |
| `references/action-pack-and-negotiation.md` | Phase 7. The five lists, renewal timing, negotiation levers, cancel-flow tactics, draft structure, approval gate. |
| `references/evidence-standards.md` | Before writing any output. Every phase. |
| `references/littlebird-mcp-reference.md` | Before calling any Littlebird tool. Parameters, return shapes, known limitations. |
| `references/research/distilled-saas-spend-leakage.md` | Any time a domain figure is about to be quoted. |
| `references/research/raw/` | To check a citation back to its source. |
| `scripts/ledger_math.py` | Phase 2 and 3. Deduplication and run-rate arithmetic. |

Ship Gate removed, research-only skill, produces no committable code.
