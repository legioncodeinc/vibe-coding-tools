# Aging and verification

Phase 4 and phase 5. Bucket by age, present the verify-first tier, and run the mandatory
verification gate before any draft is written.

Nothing in this file is legal advice.

---

## 1. Aging buckets

Buckets are computed from the **due date**, not the issue date. Days overdue is the run
date minus the due date. An invoice with no established due date does not get a bucket; it
gets `due date unknown` and it sits in the verify-first tier.

| Bucket | Days past due | Why it is its own bucket |
|---|---|---|
| **Current** | Not yet due | Not overdue. Appears on the table for cash-flow visibility only. Never gets a chase draft. |
| **1-30** | 1 to 30 | Ordinary friction. Collection potential is still high; the CCA of A table puts collection potential at 88.7% one month past due [`research/distilled-receivables-collection.md`, section 1]. Most of these are administrative, not refusals. |
| **31-60** | 31 to 60 | The relationship changes here. Two reminders have gone unanswered and the invoice is now a pattern, not an oversight. |
| **61-90** | 61 to 90 | Approaching the documented action threshold. Collection potential at three months is 68.9% [`research/distilled-receivables-collection.md`, section 1]. |
| **90 plus** | Over 90 | Two independent sources place the outside-action window at 90 to 120 days past due, with the warning that "Waiting too long is to invite a total write-off" [`research/distilled-receivables-collection.md`, section 1]. Collection potential falls to 51.3% at six months and 21.4% at twelve [`research/distilled-receivables-collection.md`, section 1]. |

**How to present the decay honestly.** The curve is a shape, not a forecast for a specific
invoice. The archive does not state when the underlying data was collected, the sample
size, the industry mix, or whether "collection potential" means full or partial recovery
[`research/distilled-receivables-collection.md`, section 8, gap 1], and two vendors citing
the same survey disagree about the twelve-month row
[`research/distilled-receivables-collection.md`, section 1]. Quote the figures with
attribution to Commercial Collection Agencies of America and with that caveat attached.
Never compute an expected recovery amount by multiplying a balance by one of these
percentages. That would dress an undated industry average up as a forecast.

**Bucket by bucket, `scripts/aging_calc.py` does the arithmetic.** Date math across
issue date, terms, due date, and run date is deterministic and it is exactly the kind of
thing to get quietly wrong by hand. Off-by-one on a bucket boundary moves an invoice
between two very different follow-up rungs.

## 2. The three tiers

Every reconciled invoice lands in exactly one tier. The tier, not the bucket, decides
whether a draft is written.

### Tier 1: CONFIRMED PAID

State `PAID-CONFIRMED`. Reported for completeness, removed from the balance, no action.

### Tier 2: POSSIBLY ALREADY PAID, VERIFY FIRST

This tier exists because of the negative-proof problem in
`payment-reconciliation.md` section 1. An invoice belongs here when **any** of the
following is true:

- State is `PAID-CLAIMED`. The client said they paid and nothing corroborates or
  contradicts it.
- State is `UNRESOLVED` with fewer than two independent supports
  [`payment-reconciliation.md`, section 5].
- The processor or account the invoice was issued on was never observed on screen during
  the window. No dashboard visit means no chance to see a payment.
- A payout or deposit was observed whose amount could plausibly cover this invoice, alone
  or in a batch.
- Extraction confidence is Low [`invoice-discovery.md`, section 5].
- The due date could not be established.
- Unattributed cash for the window exceeds this invoice's amount.

**Nothing in this tier gets a draft.** Each line gets a verification instruction addressed
to the user: which account to open, which date range to check, which amount to look for.
The point is to make the check take ninety seconds rather than to make the user rebuild the
reasoning.

If most of the receivables table lands in tier 2, that is the correct output and it is
worth saying so plainly at the top of the report. A skill that produces "here are eleven
invoices I could not resolve and here is exactly how to resolve them in ten minutes" is
doing its job. A skill that guesses to fill the tiers is not.

### Tier 3: LIKELY OUTSTANDING

State `UNRESOLVED`, two or more independent supports, due date established, extraction
confidence Medium or High, and the issuing account was observed on screen during the
window.

These are the only invoices that reach the follow-up ladder, and even they do not reach it
until the gate in section 3 passes.

**DISPUTED invoices are in no tier.** They are listed separately with the objection quoted
and its receipt, and routed to the user as a conversation. A dispute is a scope or quality
problem wearing a payment problem's clothes, and a reminder ladder aimed at it makes it
worse.

## 3. The verification gate, mandatory

**No draft is written, shown, or described before this gate passes. There is no path
through this skill that reaches a draft without it.**

Run `AskUserQuestion`. Present, in this order:

1. **Tier 3, the invoices about to be chased.** For each: client, invoice reference,
   amount, due date, days overdue, bucket, the supports that put it here, and the receipt
   for each support. Ask the user to confirm each one is genuinely unpaid.
2. **Tier 2, verify first.** For each: what to check and where. Ask which ones the user can
   resolve now.
3. **The blind spots.** Accounts and processors never observed on screen in the window,
   and the unattributed cash total. Ask whether payment could have arrived somewhere the
   skill cannot see.
4. **The open question.** Who else is overdue that is not on this list. Capture misses
   invoices, and the user knows their own book.

The gate has two acceptable outcomes: the user confirms specific invoices as unpaid, or
the user does not. Only confirmed invoices move to `follow-up-ladder.md`. An invoice the
user skips stays in tier 2 and is reported as unverified.

**Do not soften the gate into a summary.** "I found five overdue invoices totaling $12,400,
shall I draft?" is not this gate. The user has to see and confirm each invoice
individually, because the whole risk lives in one line being wrong
[`evidence-standards.md`, rule 6].

## 4. The reconciliation confidence note

Every run produces this, and it goes near the top of the report, not buried at the bottom.
It answers one question: how much should the reader trust this table?

Required contents:

| Element | What it states |
|---|---|
| **Method** | Whether reconciliation used a payments connector, capture only, or a mix. Name which processors were connector-reconciled and which were capture-only. |
| **Confirmed paid** | Count and total of tier 1, and how each was confirmed. |
| **Never saw a payment** | Count and total of tier 2 plus tier 3, stated in exactly those words. Not "unpaid". |
| **Blind spots** | Every account, processor, or payment method the user takes money through that was NOT observed on screen during the window. Checks and bank transfers get named explicitly, because neither produces a screen artifact by default. |
| **Unattributed cash** | The total of observed payouts and deposits that could not be matched to an invoice. |
| **Window and queries** | The date range swept and the query families run, so the reader can see what was looked for. |
| **Coverage sanity check** | Whether the invoice count found is plausible for this business. A business that invoices weekly and produced four invoices in 90 days had a thin sweep, not a thin book. Say so. |

Required sentence, or a close paraphrase, in every run:

> This skill can confirm that a payment was seen. It cannot confirm that a payment was not
> received. Every line below marked "no payment observed" means exactly that and nothing
> more.

## 5. Late fees and interest

If the user asks whether to add a late fee, this is what the archive supports, and it is
not legal advice.

- A late fee generally has to be agreed in writing before credit is extended; without
  written terms a creditor falls back to state default rates, which are typically much
  lower [`research/distilled-receivables-collection.md`, section 5].
- Commercial convention runs 1.5% to 2% per month, which is 18% to 24% annualized
  [`research/distilled-receivables-collection.md`, section 5].
- Consumer and commercial contexts are treated very differently, with commercial terms
  getting more deference between sophisticated parties
  [`research/distilled-receivables-collection.md`, section 5].
- A fee that punishes rather than compensates risks being unenforceable as a penalty: it
  "should reasonably approximate the cost of late payment, not punish the debtor"
  [`research/distilled-receivables-collection.md`, section 5].
- State caps vary widely and some do not apply commercially at all
  [`research/distilled-receivables-collection.md`, section 5].

**Operating rules that follow:**

1. **Never compute a late fee into a balance.** The receivables table shows the invoice
   amount. Interest is not added.
2. **Never assert a fee applies.** Ask whether the contract or the invoice terms provide
   for one. If the capture shows invoice terms carrying a late fee clause, quote the clause
   with its receipt and let the user decide.
3. A draft may reference a fee only if the user confirms the contract provides for it, and
   only in the terms the contract states.
4. Say plainly that the archive here is one vendor blog, that usury law is state-specific
   and moves, and that this is a question for the user's lawyer
   [`research/distilled-receivables-collection.md`, section 8, gap 4].

## 6. Timeline discipline

Retrieval returns items by relevance, not by date [`littlebird-mcp-reference.md`, Known
limitations]. Sort every per-invoice history by event time before presenting it. For
messages, the send time governs the timeline and the collection time appears in the receipt
[`evidence-standards.md`, rule 8]. This matters here specifically: a client's "payment went
out Friday" message that was captured three weeks after it was sent will otherwise appear
to be recent news.
