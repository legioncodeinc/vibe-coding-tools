# Payment reconciliation

Phase 3. Match each candidate invoice against evidence of payment, and be precise about
what a failure to match does and does not mean.

Read this whole file before running it. The reasoning in section 1 is the reason the rest
of the skill is shaped the way it is.

---

## 1. The negative you cannot prove

A funded AR team with a bank feed, a processor API, and a general ledger still loses
payments. "ACH and wire transfers move money electronically but often travel separately
from the remittance advice that identifies which invoices the payment covers," and
"Missing remittance is not an edge case: It is standard behavior for companies paying by
ACH across high invoice volumes"
[`research/distilled-receivables-collection.md`, section 7].

This skill has strictly less than that team has. It sees only what the user actually
opened on screen. A payment can land in:

- A bank account the user has not opened in this window.
- A processor dashboard the user did not visit.
- A check in the mail, or a check deposited by phone.
- Zelle, Venmo, Wise, a wire, cash.
- An account belonging to a partner, a bookkeeper, or an accountant.
- The right processor, correctly, on a day the capture missed.

Every one of those produces exactly the same signal in this skill: silence.

The cost of getting it wrong is documented. "Calling a customer to demand payment on an
invoice they already paid three weeks ago is one of the most damaging interactions in the
AR function," and afterward "the customer's AP contact becomes less responsive to future
outreach because they now associate the AR team with errors rather than professional
account management" [`research/distilled-receivables-collection.md`, section 7].

**Therefore the rule, and it is absolute:**

> Absence of a payment observation is never treated as evidence of non-payment. It is
> treated as absence of information, and it produces a verification task, not a chase.

This is the house rule stated generally in [`evidence-standards.md`, rule 2]: "no evidence
of X in the last 90 days" and "X did not happen" are different claims, and only the first
is supportable. In this skill that distinction is the difference between a useful report
and a damaged client relationship.

No source in the archive gives a rate for how often payments go unapplied, so this skill
cannot even quote its own false-positive probability
[`research/distilled-receivables-collection.md`, section 8, gap 6]. It can only refuse to
assert what it did not verify.

## 2. Per-client narrow queries, not one broad sweep

Reconciliation is run per client, not as a single receivables-wide search. Three reasons:

1. A per-client query can use the client's actual name, which is the highest-signal token
   available and the one a broad query cannot include.
2. Broad financial queries return oversized results that get dumped to a file
   [`littlebird-mcp-reference.md`, Oversized results].
3. Relevance scoring is per query. A payment notice for a small client will never outrank
   a large client's dashboard in a shared result set.

For each client on the candidate list, run these families with `search_user_context` over
the same 90-day window, extended to cover 14 days before the earliest invoice issue date
for that client.

| Family | `filters` | Queries |
|---|---|---|
| **P1. Payment received notices** | `data_source: snapshots` | "you received a payment from CLIENT", "CLIENT paid your invoice", "payment received CLIENT", "invoice INVOICE_REF paid", "you have been paid" |
| **P2. Processor status** | `data_source: snapshots`, `app: chrome` | "CLIENT invoice paid", "Stripe payments succeeded CLIENT", "PayPal payment received CLIENT", "invoice status paid CLIENT" |
| **P3. Payout and settlement** | `data_source: snapshots` | "payout to your bank account", "Stripe payout sent", "PayPal transfer to bank complete", "deposit summary", "balance available" |
| **P4. Bank and transfer surfaces** | `data_source: snapshots` | "deposit from CLIENT", "ACH credit", "wire received", "Zelle payment from CLIENT", "check deposited" |
| **P5. Client says they paid** | `search_queries_messages`, `data_source: messages` | "CLIENT sent payment", "paid the invoice", "payment is on the way", "check is in the mail", "processing this week", "ACH went out" |
| **P6. Client disputes or delays** | `search_queries_messages`, `data_source: messages` | "hold off on that invoice", "waiting on our client to pay us", "can we push payment", "dispute the amount", "this was not what we agreed", "payment plan" |

Families P5 and P6 are the ones most often skipped and they are the ones that most often
change the answer. A client who said "sent it Friday" in a WhatsApp thread has already
answered the question, and chasing them anyway is worse than not chasing at all.

## 3. Payout summaries are corroboration, not proof

A payout summary showing $8,400 landing in the bank on the 12th is strong evidence that
money arrived. It is weak evidence about which invoice it settled unless the payout detail
view was also captured with line items.

Use payouts this way:

- **A payout dated after the invoice, of an amount that matches the invoice within
  rounding, from the processor the invoice was issued on**: treat as corroboration, one
  tier of support, not a match on its own.
- **A payout whose total matches the sum of two or more open invoices for the same
  client**: flag as probable batch settlement, and route to verification. Do not silently
  clear both invoices.
- **A payout with no invoice-level detail**: record it as unattributed cash. Report the
  total of unattributed cash on the report. If unattributed cash exceeds the total the
  skill is about to call overdue, say that plainly at the top of the report, because it
  means the reconciliation is not trustworthy and the whole run is advisory.

## 4. The four reconciliation states

Every candidate invoice ends in exactly one.

| State | Definition | What it drives |
|---|---|---|
| **PAID-CONFIRMED** | A processor or accounting surface showed this invoice with a paid status, OR a payment-received notice named this client and this amount, OR the client stated payment and a payout corroborates it. | Remove from receivables. Report as confirmed paid. |
| **PAID-CLAIMED** | The client said they paid, or a payment is in flight, with no corroborating observation. | Never chase. Goes to a "check your account" line addressed to the user, not to the client. |
| **UNRESOLVED** | No payment evidence of any kind was found, and the invoice's own surface either showed an open status or showed no status. | Verification tier. See `aging-and-verification.md`. Never a chase without verification. |
| **DISPUTED** | The client raised an objection to the amount, the scope, the deliverable, or the timing. | Never enters the follow-up ladder. Routed to the user as a conversation, not a collection. |

Note what is missing from that table: there is no state called `UNPAID`. This skill does
not have the evidence to produce one from capture alone. `UNPAID` only exists after the
user verifies, in `aging-and-verification.md` section 3.

## 5. Corroboration requirement before an invoice can be called overdue

An `UNRESOLVED` invoice needs **at least two independent supports** before the report
presents it as likely outstanding rather than merely unverified. Independent means from
different surfaces or different times, not the same capture read twice.

Qualifying supports:

1. The invoice's own surface showed a status of `open`, `sent`, `past due`, or
   `outstanding`, dated after the due date.
2. The invoice appeared with the same open status in two or more captures on different
   days.
3. A processor's overdue or unpaid filter view showed this client.
4. The user's own message traffic referenced chasing this invoice already.
5. An accounting surface aging report showed a balance for this client.
6. The client acknowledged the invoice is outstanding.

**One support or zero supports** means the invoice is presented as "no payment observed,
status not established" and it sits in the verify-first tier with no draft attached.

This corroboration requirement is not in the archive. It is this skill's own design rule,
adopted because the archive documents the consequence of getting it wrong but gives no
rate to calibrate against [`research/distilled-receivables-collection.md`, section 8, gap 6].
Present it as a house rule, and let the user relax it deliberately if they have a reason.

## 6. When a payments connector is available

Stripe, PayPal, QuickBooks, and the rest are separate MCP servers that may or may not be
connected in a given session. They are not Littlebird.

**Always list the session's available tools before assuming any of them exists.** If a
payments connector is present:

1. Use it to pull the authoritative invoice and payment state for the window.
2. Reconcile capture-derived lines against it. Where they agree, promote the line to
   High confidence and note both sources.
3. **Where they disagree, the connector wins and the disagreement is reported.** A capture
   line the connector does not know about is either an invoice raised elsewhere or an OCR
   artifact, and the user has to say which.
4. State on the report which processors were reconciled by connector and which were
   reconciled from capture only. That distinction is the single most useful line in the
   confidence note.

**If no payments connector is available, the skill still runs.** It runs from capture,
every line is capture-derived, the confidence note says so at the top, and the
verification gate in `aging-and-verification.md` becomes correspondingly more important.
Degrading gracefully means producing a smaller, honestly labeled result, not producing the
same result with less evidence behind it.

Never assume a connector exists. Never fail because one does not.

## 7. Output of this phase

Each candidate invoice tagged with:

- Its reconciliation state from section 4.
- Its supports from section 5, listed, each with a receipt.
- The queries run for that client and the windows searched, so a reader can see what was
  looked for and did not turn up.

Plus two totals that go on the report:

- **Unattributed cash**: payouts and deposits observed that could not be matched to an
  invoice.
- **Coverage note**: which processors and accounts were observed in capture at all during
  the window. An account never seen on screen in 90 days is a blind spot, and the report
  names it as one.
