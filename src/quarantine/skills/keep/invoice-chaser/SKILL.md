---
name: invoice-chaser
description: "Trigger on who has not paid me, chase unpaid invoices, accounts receivable,
  overdue invoice, aging report, payment follow up, outstanding invoices, invoice reminder,
  who owes me money, collections, past due. Rebuilds a receipted receivables table from
  Littlebird capture of invoices the user sent, reconciles it against every payment
  observation it can find, buckets what is left by age, forces a verification step before
  calling anything overdue, and drafts a polite-to-firm follow-up ladder per client that is
  held for approval and never sent."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# Invoice chaser

Turn "they have not paid yet" into a sent follow-up, without chasing anyone who already
paid.

## Purpose

A solo operator or small agency invoices from three or four surfaces and reconciles from
none of them. The invoices live in Stripe, PayPal, GoHighLevel, an accounting tool, and the
sent-mail folder. The payments land in a bank account, a processor balance, a payout
summary, and occasionally an envelope. Nothing joins the two, so "who owes me money" is a
question the user answers by memory and guilt.

That matters more than it sounds. 59% of US small businesses report at least some invoices
overdue by 30 or more days, averaging $17.7K outstanding per business, and 39% of owners
say a single late payment made it hard to cover payroll or bills
[references/research/distilled-receivables-collection.md, section 2]. Collection potential
falls from 88.7% at one month past due to 68.9% at three months and 21.4% at twelve
[references/research/distilled-receivables-collection.md, section 1]. Waiting is expensive
in a way that compounds.

Littlebird capture reads every one of those surfaces, because the user looked at them. This
skill joins them.

## The problem this skill is built around

**You cannot prove a negative from screen capture.**

"I never saw a payment" is not "they did not pay". A payment can arrive in a bank account
the user never opened on screen, in a processor dashboard they did not visit that week, as
a check, over Zelle, or into an account a bookkeeper manages. All of those produce the same
signal here: silence.

This is not a rare edge case. A funded AR team with a bank feed and a general ledger still
loses payments, because "ACH and wire transfers move money electronically but often travel
separately from the remittance advice that identifies which invoices the payment covers",
and "Missing remittance is not an edge case: It is standard behavior"
[references/research/distilled-receivables-collection.md, section 7]. This skill has less
information than that team, not more.

The cost of getting it wrong is the highest in this marketplace. In a vendor's own words:
"Calling a customer to demand payment on an invoice they already paid three weeks ago is
one of the most damaging interactions in the AR function", after which the client contact
"becomes less responsive to future outreach because they now associate the AR team with
errors rather than professional account management"
[references/research/distilled-receivables-collection.md, section 7]. A wrong chase costs a
relationship. A missed chase costs a reminder.

**Three design consequences, all mandatory:**

1. **Corroboration before overdue.** An invoice with no payment observation needs two
   independent supports before it is presented as likely outstanding
   [references/payment-reconciliation.md, section 5]. One support or none is not enough.
2. **A verify-first tier.** Anything the skill could not resolve goes to "possibly already
   paid, verify first" with a ninety-second instruction for checking, not to a chase list
   [references/aging-and-verification.md, section 2].
3. **A mandatory verification gate.** No draft is written, shown, or described until the
   user confirms each invoice individually [references/aging-and-verification.md, section 3].

There is no reconciliation state called `UNPAID` in this skill's vocabulary. Capture cannot
produce one. Only the user can.

## Capability gate

This skill requires the Littlebird MCP server on a Power or Pro plan.

1. **List the available tools before calling anything.** Use the real tool names from the
   live server. `references/littlebird-mcp-reference.md` records what was verified on
   2026-08-17. It is a starting point, not a guarantee.
2. If no Littlebird MCP tools are present, **stop** and tell the user this skill needs the
   Littlebird MCP connected. Do not attempt the audit from another source.
3. If tools are present but plan status is in doubt, call
   `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` and report what it says.
4. **Separately, list the session's other connectors.** Stripe, PayPal, QuickBooks and the
   rest are their own MCP servers. Do not assume any of them exists. If one is present, use
   it to reconcile and say so. If none is present, the skill still runs from capture alone,
   every line is labeled capture-derived, and the verification gate carries more weight
   [references/payment-reconciliation.md, section 6].

## Littlebird MCP calls used

| Call | Used for |
|---|---|
| `search_user_context` | Everything. Invoice discovery, payment reconciliation, client payment talk, prior-chase history. Windowed, per client, narrow queries in parallel. |
| `LB_INTERNAL_LIST_MEETINGS` | With a future `end_date`, to find an upcoming meeting with an overdue client. A scheduled call outranks an email in the ladder [references/follow-up-ladder.md, section 4]. |
| `LB_INTERNAL_SEARCH_MEETINGS` | Where a client discussed payment, scope, or a dispute in a recorded call. |
| `LB_INTERNAL_GET_MEETING` | To read the structured summary, especially Decisions and Action Items, for anything agreed about payment. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Read the receivables watch routine's own past reports before every run, so the ladder knows which rung each client is already on. |
| `LB_INTERNAL_CREATE_ROUTINE` | To offer and create the weekly receivables watch. Interactive sessions only. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG`, `LB_INTERNAL_UPDATE_ROUTINE` | To read before changing an existing routine. `prompt` and `schedule` each replace wholesale. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Plan gate, and routine-count headroom. |

There is no Littlebird tool that searches past Littlebird chat conversations. Where this
skill needs prior conversation, it uses `search_user_context` with
`filters.data_source: messages`.

## Trigger

Fires on: who has not paid me, chase unpaid invoices, accounts receivable, AR aging,
overdue invoices, outstanding invoices, payment follow up, invoice reminder, who owes me
money, past due, collections, cash coming in, unpaid client work, follow up on that
invoice.

Also fires when the weekly receivables watch routine flags a bucket crossing and the user
opens Cowork to act on it.

## Routine cadence

**Weekly**, plus on demand. The routine observes and hands off; the interactive session
does the reconciliation, the verification, and the drafting. Wiring is in
[Routine wiring](#routine-wiring-the-receivables-watch) below.

Weekly is the right frequency because the bucket boundaries that change the recommended
approach sit 30 days apart, and a weekly check catches a crossing inside a week of it
happening. Daily produces noise; monthly lets an invoice cross two boundaries unobserved.

## Process

Seven phases. Phase 5 is not optional and has no bypass.

### Phase 1: scope

Ask with `AskUserQuestion`, before sweeping:

- **Window.** Default 90 days, walked one month at a time. Ask whether any invoice older
  than that is still open, since a 120-day invoice sits in the bucket where the archive
  places outside action [references/research/distilled-receivables-collection.md, section 1].
- **Where they invoice from.** Which processors, which accounting tool, whether any
  invoicing happens by plain email.
- **Where money lands.** Which processor balances, which bank, whether they take checks or
  bank transfers. This list becomes the blind-spot list in the confidence note, and it is
  the single most valuable answer in this phase.
- **Known exceptions.** Clients on a payment plan, clients on hold, clients in dispute.

### Phase 2: invoice discovery

Follow `references/invoice-discovery.md`. Run the five query families, extract to the
schema, deduplicate, and separate out the three exclusion lists.

Run `scripts/aging_calc.py` on the candidate rows rather than collapsing duplicates by eye.
OCR of an invoice list repeats rows, and the collapse rules interact in ways that are easy
to get quietly wrong.

Watch the direction trap: an invoice the user RECEIVED looks almost identical in capture to
one they sent, and it is the fastest way to poison this report
[references/invoice-discovery.md, section 6].

### Phase 3: payment reconciliation

Follow `references/payment-reconciliation.md`. Read section 1 before running anything else
in this phase.

Run the six payment query families **per client**, not as one sweep. Assign each invoice
one of four states: `PAID-CONFIRMED`, `PAID-CLAIMED`, `UNRESOLVED`, `DISPUTED`. Count the
independent supports behind every `UNRESOLVED`.

Where a payments connector is available, reconcile against it, and where capture and the
connector disagree, **the connector wins and the disagreement is reported**
[references/payment-reconciliation.md, section 6].

### Phase 4: aging and tiering

Follow `references/aging-and-verification.md` sections 1 and 2. Compute days overdue from
the due date with `scripts/aging_calc.py`, assign buckets, and place every invoice in
exactly one of three tiers: confirmed paid, verify first, likely outstanding.

Present the collectability decay as a shape with its source attributed, never as a forecast.
Never multiply a balance by a decay percentage to produce an expected recovery figure
[references/aging-and-verification.md, section 1].

### Phase 5: the verification gate, mandatory

Follow `references/aging-and-verification.md` section 3.

**No draft is written, shown, or described before this gate passes.**

Present each tier-3 invoice individually with its supports and receipts, each tier-2
invoice with its specific verification instruction, the blind-spot list, the unattributed
cash total, and the open question about who is missing. Only invoices the user confirms
move forward.

Do not compress this into "I found five overdue invoices, shall I draft?" The entire risk
lives in one line being wrong.

### Phase 6: the follow-up ladder

Follow `references/follow-up-ladder.md`. For each confirmed overdue invoice, place the
client on the rung its age and relationship warrant, draft the actual text at that rung and
the next one, and respect the contact-frequency ceiling.

Check prior contacts first. A client on their fifth contact does not get a "just following
up" email that reads as though it were the first
[references/follow-up-ladder.md, section 3].

If a personal voice skill is installed in the session, draft through it. If none is, say so
plainly and point at this marketplace's voice creator skills. Never invent a voice profile.

### Phase 7: report, hold, offer the routine

Write the three artifacts. Hold every draft. Offer to create the weekly receivables watch
if it does not already exist, showing the user the exact prompt and schedule first.

## Output

Three files in the working directory, dated with the run date.

**`receivables-aging-YYYY-MM-DD.md`**, the report. Leads with the reconciliation confidence
note [references/aging-and-verification.md, section 4], then the aging table, then the
tiers, then the prevention notes.

Aging table columns, exactly:

| Column | Contents |
|---|---|
| Client | As written on the artifact |
| Invoice ref | Or `unknown` |
| Amount | As captured, with currency. No conversion, no cross-currency total |
| Issue date | As shown |
| Due date | With basis: `shown` or `derived` from terms |
| Days overdue | From the due date, or `n/a` |
| Bucket | current, 1-30, 31-60, 61-90, 90-plus, or unknown |
| Payment status | PAID-CONFIRMED, PAID-CLAIMED, UNRESOLVED, DISPUTED |
| Tier | confirmed paid, verify first, likely outstanding |
| Supports | Count and list of independent supports |
| Evidence receipt | Every receipt, in the canonical format, sorted by time |

Grouped and subtotaled by bucket, per currency. Followed by:

- **The verify-first tier**, each line with its specific check instruction.
- **Disputes**, listed separately with the objection quoted and its receipt.
- **Blind spots**, every account and payment method never observed on screen in the window.
- **Unattributed cash**, the total of observed payouts that matched no invoice.
- **Named gaps**, what was searched and did not turn up.

**`receivables-aging-YYYY-MM-DD.csv`**, one row per invoice line in the same schema,
machine-readable, receipts included.

**`follow-up-drafts-YYYY-MM-DD.md`**, every drafted message, grouped by client, each headed
`STATUS: HELD FOR APPROVAL. Not sent.`

If the user names a different location, use it. If nothing was found, write only the report
and have it say what was searched and what came back empty.

## Retrieval brief

Every query runs through `search_user_context`, windowed one month at a time across the
scope agreed in phase 1. Parallel narrow queries, never one broad sweep: a broad query
against this server returns 70,000-plus characters and gets dumped to a file instead of
returned [references/littlebird-mcp-reference.md, Oversized results].

**Discovery, 90-day window, five families** [references/invoice-discovery.md, section 2]:

| Family | `filters` | Queries |
|---|---|---|
| A. Invoice sent | `data_source: snapshots` | "invoice sent to", "your invoice has been sent", "invoice was sent successfully", "invoice number amount due", "invoice due date net 30" |
| B. Processor surfaces | `data_source: snapshots`, `app: chrome` | "Stripe invoices open paid", "PayPal invoice sent status", "GoHighLevel invoices", "QuickBooks invoice list overdue", "invoice status open due" |
| C. Emailed invoices | `data_source: snapshots` | "please find attached invoice", "invoice attached for", "payment is due upon receipt", "here is the invoice for", "view and pay invoice" |
| D. Client payment talk | `data_source: messages` via `search_queries_messages` | "did you get my invoice", "invoice for last month", "sending the invoice over", plus client names |
| E. Activity digests | `data_source: summaries` | "invoice", "billed", "sent invoice", "payment terms", plus client names |

**Reconciliation, per client, six families** [references/payment-reconciliation.md,
section 2]. Window extends 14 days before that client's earliest invoice issue date.

| Family | `filters` | Queries |
|---|---|---|
| P1. Payment received | `data_source: snapshots` | "you received a payment from CLIENT", "CLIENT paid your invoice", "payment received CLIENT", "invoice REF paid", "you have been paid" |
| P2. Processor status | `data_source: snapshots`, `app: chrome` | "CLIENT invoice paid", "Stripe payments succeeded CLIENT", "PayPal payment received CLIENT", "invoice status paid CLIENT" |
| P3. Payouts | `data_source: snapshots` | "payout to your bank account", "Stripe payout sent", "PayPal transfer to bank complete", "deposit summary", "balance available" |
| P4. Bank and transfer | `data_source: snapshots` | "deposit from CLIENT", "ACH credit", "wire received", "Zelle payment from CLIENT", "check deposited" |
| P5. Client says paid | `data_source: messages` | "CLIENT sent payment", "paid the invoice", "payment is on the way", "check is in the mail", "processing this week", "ACH went out" |
| P6. Disputes and delays | `data_source: messages` | "hold off on that invoice", "waiting on our client to pay us", "can we push payment", "dispute the amount", "this was not what we agreed", "payment plan" |

**Prior-chase history, per client**: `data_source: messages` plus `data_source: snapshots`
for "following up on invoice", "second reminder", "past due notice", "just checking on the
invoice". This sets the rung and enforces the frequency ceiling.

**Upcoming meetings**: `LB_INTERNAL_LIST_MEETINGS` with a future `end_date`, filtered by
overdue client names.

Two disciplines that matter here specifically:

- **Read the relevance scores.** Items below 3 are omitted entirely, and a single 3-scored
  item does not support a claim without corroboration
  [references/littlebird-mcp-reference.md, Retrieval patterns].
- **Sort by event time before presenting.** Results come back by relevance. For messages,
  the send time governs the timeline and the collection time goes in the receipt
  [references/evidence-standards.md, rule 8]. A client's "payment went out Friday" captured
  three weeks later will otherwise read as fresh news.

## Evidence standards

Read `references/evidence-standards.md` before producing output. The rules that govern this
skill most directly:

- Every claim carries a receipt in the canonical format
  `[Tuesday, August 11, 2026 23:40 EDT | chrome]` (rule 1).
- Every line is observed, inferred, external, or unknown, and which one is visible to the
  reader (rule 2).
- **"No payment observed in 90 days" and "they did not pay" are different claims, and only
  the first is supportable** (rule 2). This is the load-bearing rule of the entire skill.
- Confidence is rated, and a Low-rated claim never drives an irreversible action (rule 3).
  Sending a client a payment demand is irreversible.
- Capture shows what the user was viewing, not what they sent (rule 4).
- Confirm before encoding, confirm before sending (rule 6).
- Raw capture never ships (rule 7). No draft quotes an OCR fragment or a private message.
- Empty retrieval ends the run (rule 9).

**Amount rule specific to this skill:** never assert an amount the capture did not show. An
amount seen once is Medium. An amount seen on the same invoice across three separate
captures is High. An amount that differs between two captures of the same invoice reference
is a conflict, and it goes to the user rather than being averaged or picked.

## Empty retrieval branch

If discovery returns nothing across families A through E, the run ends. Write the report
with:

- The date windows searched, month by month.
- The exact queries and filters run.
- The statement that no invoice-sent evidence was found in that window.
- What would change the outcome: a wider window, a period when the user was actually doing
  billing, a check that Littlebird capture was running, or a payments connector.

Do not reconstruct a plausible client list from what a business of this shape usually
invoices. Do not estimate a receivables balance
[references/evidence-standards.md, rule 9].

The same rule applies at phase 3 with a twist. If reconciliation returns no payment
evidence at all, for any client, including ones the user knows paid, then the sweep is
broken, not the book. Report the malfunction. Do not produce a receivables table where
every line is overdue, because that is the exact output that damages relationships at scale.

## Guardrail

**The false positive here is a chased client who already paid, and it is the most expensive
error in this marketplace.** Every other guardrail in this skill exists to prevent it.

| Rule | Enforcement |
|---|---|
| Absence of a payment observation is never evidence of non-payment | Four reconciliation states, none of which is `UNPAID` [references/payment-reconciliation.md, section 4] |
| Two independent supports before "likely outstanding" | [references/payment-reconciliation.md, section 5] |
| A verify-first tier for everything else | [references/aging-and-verification.md, section 2] |
| A mandatory per-invoice verification gate before any draft | [references/aging-and-verification.md, section 3] |
| Blind spots named in every run | Accounts and methods never seen on screen, checks and bank transfers called out by name |
| The connector wins over capture | [references/payment-reconciliation.md, section 6] |

**The second guardrail is harassment.** The ladder is finite. Seven rungs, then it stops
and recommends a lawyer, an agency, or a write-off
[references/follow-up-ladder.md, section 2]. House ceiling: one contact per invoice in any
five consecutive days, two in any fourteen, nothing at all before a date the client
committed to, and never again on a channel the client asked the user to stop using
[references/follow-up-ladder.md, section 3]. There is no rung 8.

**The third guardrail is client confidentiality.** Client financial data stays internal. No
draft names another client, another client's balance, or another client's situation. No
draft quotes captured material [references/evidence-standards.md, rule 7].

**The fourth guardrail is legal.** This skill does not give legal advice and says so in
every run where debt-collection law, late fees, or interest come up. What the archive
supports: the FDCPA defines "debt" as arising from transactions "primarily for personal,
family, or household purposes", which places B2B invoices outside it, and it excludes a
creditor's own officers and employees collecting in the creditor's name, which places a
business collecting its own accounts outside it separately
[references/research/distilled-receivables-collection.md, section 4]. The federal
seven-calls-in-seven-days limit is written for debt collectors, not for the user
[references/research/distilled-receivables-collection.md, section 4]. But at least one
state, California, extends harassment rules to original creditors, the CFPB notes that
state unfair and deceptive acts and practices laws may apply to debt collection, and no
source in this archive surveys the other 49 states
[references/research/distilled-receivables-collection.md, section 8, gap 3]. So: state the
federal position accurately, do not imply the user is under a regime they are not under,
and send any specific question to a lawyer. Never compute a late fee into a balance
[references/aging-and-verification.md, section 5].

## Draft-never-send

The skill drafts. The user sends. There is no path through this skill that transmits
anything to a client.

Do not call an email tool. Do not open a compose surface and populate it. Do not offer
sending as a convenience. This holds even when a connector is available and even when the
user approved the plan, because approving a plan is not approving the words
[references/evidence-standards.md, rule 6].

Every draft lands in `follow-up-drafts-YYYY-MM-DD.md` headed
`STATUS: HELD FOR APPROVAL. Not sent.` If the user wants them in a sendable form, produce a
copy-paste block or an import-ready file. The transmission is theirs.

## Routine wiring: the receivables watch

The interactive audit is the primary mode. The watch is a cheap weekly observer that
notices bucket crossings and hands off.

Offer to create it with `LB_INTERNAL_CREATE_ROUTINE`. Show the user the prompt and schedule
below, get approval through `AskUserQuestion`, then create it. Do not tell the user to set
it up by hand. Note that a running routine cannot create or edit routines, so this happens
from an interactive session only [references/littlebird-mcp-reference.md, Routine tools].

Before creating, call `LB_INTERNAL_LIST_ROUTINES` to check whether a receivables watch
already exists. If one does, `LB_INTERNAL_GET_ROUTINE_CONFIG` first and offer an update
rather than a duplicate, remembering that `prompt` and `schedule` each replace wholesale.

**Title:** `Receivables watch`

**Schedule:** `{"frequency": "weekly", "week_days": ["MO"], "time": "08:00"}`

**Notifications:** enable push. Enable email if the user wants a copy.

**Prompt text, verbatim:**

```
You are a weekly receivables watch. Your job is to notice CHANGE in what the user is
owed. You do not run a full reconciliation, you do not decide that anyone is unpaid,
and you do not draft anything.

FIRST, before searching, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with
limit 8 and read your own previous reports. You need them to tell new from repeated, to
know which invoices you have already flagged, and to escalate correctly. Do not skip
this step.

Then search the user's captured context for the last 10 days, using several narrow
queries rather than one broad one, covering:

1. NEW INVOICES SENT. Queries: "invoice sent to", "your invoice has been sent",
   "invoice number amount due", "please find attached invoice", "invoice status open
   due". Record client, invoice reference, amount, and due date exactly as shown. An
   invoice is NEW only if it does not appear in any previous report you just read.

2. PAYMENTS OBSERVED. Queries: "you received a payment from", "paid your invoice",
   "payment received", "payout to your bank account", "deposit summary", "invoice
   status paid". Also search message threads for "payment is on the way", "check is in
   the mail", "paid the invoice", "ACH went out". Match these against invoices in your
   previous reports and say which ones now look settled.

3. PAYMENT FRICTION. Queries in message threads: "can we push payment", "hold off on
   that invoice", "waiting on our client to pay us", "dispute the amount", "payment
   plan". These change the approach entirely and must be surfaced.

Write a report with exactly these four sections:

NEW INVOICES
Each newly observed invoice: client, reference, amount as shown, issue date, due date,
and the evidence receipt in the form [Weekday, Month D, YYYY HH:MM TZ | app]. Never
state an amount the capture did not show.

PAYMENTS SEEN
Each payment observation, with client, amount, date, and receipt. Say which previously
tracked invoice it appears to settle, and mark that as apparent rather than confirmed.

CROSSED A LINE THIS WEEK
Invoices from your previous reports that crossed an aging boundary since the last
report: past due, past 30 days, past 60 days, past 90 days. State the boundary crossed
and the days overdue. This is the most important section. The 90-day crossing is the
most urgent because collection potential falls sharply with age.

FRICTION AND DISPUTES
Any client who asked to delay, disputed an amount, or raised a problem. Quote the
request briefly with its receipt.

CRITICAL RULE ON WHAT YOU CANNOT KNOW. You are reading screen capture. You see a
payment only if the user happened to have the relevant screen open. A payment can land
in a bank account, a processor dashboard, or a check that never appears in capture at
all. Therefore you NEVER write that a client has not paid. Write "no payment observed"
and nothing stronger. Every invoice in CROSSED A LINE THIS WEEK carries the phrase "no
payment observed, not verified". Do not rank clients by how bad they are. Do not
suggest anyone is avoiding payment.

ESCALATION RULE. Compare against the previous reports you read at the start.
- An invoice appearing for the SECOND week: mark it REPEAT and say how many weeks it
  has been open.
- An invoice appearing for the FOURTH week or more with no payment observed: mark it
  ESCALATED, move it to the top, and state plainly that weekly observation is not
  resolving it and it needs a decision, not another notification.
- An invoice that now shows a payment: say so in one line and stop tracking it.
Never report the same invoice in the same words two weeks running. If nothing has
changed, say that nothing has changed and how many weeks it has been open.

HANDOFF. End every report with this line, adjusted for what you found:
"Open Cowork and run invoice-chaser to reconcile and draft follow-ups. This week's
priority: X."
Where X is the single invoice that most needs a human decision, ranked by aging bucket
first and amount second.

If the searches return nothing, say so plainly, name the window you searched, and stop.
Do not estimate what the user is owed. Do not fill the report from what a business like
this would typically have outstanding.
```

**How the handoff works.** The routine observes and notifies. It cannot verify, draft, or
write files, and it is explicitly forbidden from concluding non-payment. The user opens
Cowork, invokes this skill, and the skill reads the watch's own history with
`LB_INTERNAL_GET_ROUTINE_REPORTS` before sweeping, which gives it a change log and a record
of which clients have already been contacted
[references/littlebird-mcp-reference.md, The Routines-observe, Cowork-acts pattern].

**When invoked after a watch alert**, read the last 8 watch reports first. Invoices marked
REPEAT or ESCALATED go to the top of the verification gate, not to the top of a chase list.

## Calibration and honesty notes

- **Do not quote the collectability curve as a forecast.** The archive does not state when
  the underlying data was collected, the sample size, or whether "collection potential"
  means full recovery, and two vendors citing the same survey disagree about the
  twelve-month row [references/research/distilled-receivables-collection.md, section 8,
  gap 1]. Attribute it to Commercial Collection Agencies of America and present it as a
  shape.
- **Do not say late payment is getting better or worse.** Platform data shows US average
  days late falling to 7.8, while survey data shows the share of businesses carrying
  30-plus-day overdue invoices rising from 47% to 59%. These are different measures and
  both can be true [references/research/distilled-receivables-collection.md, section 2].
- **The reminder ladder is convention, not evidence.** No source in the archive quantifies
  reminder effectiveness at any rung, and both cadence sources sell software that automates
  the cadence they recommend [references/research/distilled-receivables-collection.md,
  section 8, gap 2].
- **Do not promise that any prevention practice will speed up payment.** The figures quoted
  alongside those recommendations are market-wide trends and correlations with no causal
  test [references/research/distilled-receivables-collection.md, section 6].
- **Ten of sixteen archived sources sell collection services, AR automation, or invoicing
  software**, each of which profits from a large late-payment number and a long reminder
  ladder [references/research/distilled-receivables-collection.md, section 8, gap 7]. Quote
  their figures as vendor estimates.
- **A receivables table where every line is overdue is a broken sweep, not a broken book.**
  Say so and stop.

## Related skills

| Skill | Relationship |
|---|---|
| `money-leak-auditor` | The other direction of the same ledger. That one finds money leaving; this one finds money not arriving. Run both for a full cash picture. |
| `client-health-radar` | A client 60 days overdue is a health signal. Cross-reference before escalating: a client in trouble on delivery gets a conversation, not a rung 6 notice. |
| `commitment-tracker` | Catches "I will pay by Friday" as a commitment. Where both are installed, this skill's date-committed pause and that skill's tracking are the same fact. |
| `pre-call-prep` | When the ladder recommends a phone call or a scheduled meeting is the right channel, prep the call there. |
| Personal voice skills | If installed, all drafts route through the user's voice skill. If absent, drafts are plain professional English and the report says so. |

## Reference map

| File | Read it when |
|---|---|
| `references/invoice-discovery.md` | Phase 2. Surfaces, query families, extraction schema, collapse rules, the direction trap. |
| `references/payment-reconciliation.md` | Phase 3. The negative-proof problem, per-client queries, payout handling, the four states, the corroboration rule, connector degradation. |
| `references/aging-and-verification.md` | Phases 4 and 5. Buckets, the three tiers, the mandatory gate, the confidence note, late fees. |
| `references/follow-up-ladder.md` | Phase 6. Rungs, the stop rung, contact frequency, relationship calibration, drafting rules, prevention notes. |
| `references/evidence-standards.md` | Before writing any output. Every phase. |
| `references/littlebird-mcp-reference.md` | Before calling any Littlebird tool. Parameters, return shapes, known limitations. |
| `references/research/distilled-receivables-collection.md` | Any time a domain figure or a legal statement is about to be made. |
| `references/research/README.md` | To find which raw file backs a claim. |
| `references/research/raw/` | To check a citation back to its source. |
| `scripts/aging_calc.py` | Phases 2 and 4. Collapse, due-date derivation, days overdue, buckets, per-currency totals. |

Ship Gate removed, research-only skill, produces no committable code.
