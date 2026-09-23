# Invoice discovery

Phase 2 of the workflow. Build the candidate list of invoices the user SENT, from capture.

This phase finds invoices. It does not decide whether any of them are unpaid. Resist the
pull to conclude anything here. Reconciliation is
`payment-reconciliation.md` and verification is `aging-and-verification.md`.

This file makes no domain claims. Everything in it is Littlebird retrieval mechanics and
this skill's own extraction procedure. Domain figures and legal statements live in
`research/distilled-receivables-collection.md` and are used in the three later phases.

---

## 1. What counts as an invoice-sent artifact

Six surfaces produce them, and they look different from each other.

| Surface | What capture typically shows | Reliability |
|---|---|---|
| Stripe dashboard or invoice page | Invoice number, customer name, amount, status chip (draft, open, paid, uncollectible, void), due date | Highest. Status is stated on the surface. |
| PayPal invoicing | Invoice number, recipient, amount, sent date, status | High |
| GoHighLevel invoices and payments | Invoice list with contact name, amount, status | High |
| QuickBooks, FreshBooks, Wave, Xero, Harvest, Bonsai | Invoice list rows, or a single invoice view | High when the list view is captured, medium from a single invoice view |
| An emailed invoice in the sent folder or a thread | Subject line naming an invoice number, an attachment name, or a payment link | Medium. Sending an email proves an invoice was sent, not that the amount rendered correctly. |
| A message thread where the user says the invoice went out | "just sent invoice 1042", "invoice is in your inbox" | Low on its own. It is a lead, not a line. |

**A quote, estimate, proposal, or contract is not an invoice.** Capture them if they turn
up, and keep them in a separate note, because they are useful context for the follow-up
draft. Never put them on the receivables table.

## 2. The five query families

Run each with `search_user_context`, windowed one month at a time across the 90-day
default. Run families in parallel, several narrow queries at a time rather than one broad
one. A broad query returns 70,000-plus characters and gets dumped to a file
[`littlebird-mcp-reference.md`, Oversized results].

| Family | `filters` | Queries |
|---|---|---|
| **A. Invoice sent confirmations** | `data_source: snapshots` | "invoice sent to", "your invoice has been sent", "invoice was sent successfully", "invoice number amount due", "invoice due date net 30" |
| **B. Processor invoice surfaces** | `data_source: snapshots`, `app: chrome` | "Stripe invoices open paid", "PayPal invoice sent status", "GoHighLevel invoices", "QuickBooks invoice list overdue", "invoice status open due" |
| **C. Emailed invoices** | `data_source: snapshots` | "please find attached invoice", "invoice attached for", "payment is due upon receipt", "here is the invoice for", "view and pay invoice" |
| **D. Client-side payment talk** | `search_queries_messages`, `data_source: messages` | "did you get my invoice", "invoice for last month", "sending the invoice over", client names from the roster |
| **E. Activity digests** | `data_source: summaries` | "invoice", "billed", "sent invoice", "payment terms", client names |

Family B is the highest-value family and deserves the most query budget. A processor
invoice list view is the single best artifact this skill can find: it names the client,
the amount, the date, and the payment status in one capture, from the user's own system of
record.

## 3. Extraction schema

For every candidate, extract exactly these fields. Leave a field `unknown` rather than
guessing it.

| Field | Notes |
|---|---|
| `client` | As written on the artifact. Do not normalize yet. |
| `invoice_ref` | Invoice number or identifier. `unknown` if the capture did not show one. |
| `amount` | As shown, with currency. Never compute, never convert. |
| `issue_date` | Date the invoice was issued, as shown. |
| `due_date` | As shown. If terms are shown instead ("Net 30"), record the terms and mark the due date `derived`. |
| `terms` | Net 15, Net 30, due on receipt, milestone, and so on. |
| `status_shown` | The literal status string on the surface: open, paid, past due, draft, void, uncollectible, sent, viewed. `none` if no status was visible. |
| `source_surface` | Which of the six surfaces in section 1. |
| `receipt` | The canonical evidence receipt [`evidence-standards.md`, rule 1]. |
| `extraction_confidence` | High, Medium, Low. See section 5. |

## 4. Deduplicate before counting

OCR of a dense invoice list repeats rows, interleaves UI chrome, and captures the same
list on several days [`littlebird-mcp-reference.md`, Known limitations].

Collapse rules, applied in order:

1. **Same invoice_ref and same client** collapse to one line. Keep every receipt, sorted
   by timestamp, and keep the LATEST observed status.
2. **Same client, same amount, issue dates within 2 days, one has an invoice_ref and one
   does not** collapse. Keep the ref.
3. **Same client, same amount, different invoice_ref** do NOT collapse. A retainer client
   billed the same amount monthly is the normal case, and collapsing those understates the
   balance. Check the issue dates.
4. **Same invoice_ref, different amount** do NOT collapse. Flag it. Either the invoice was
   revised or one OCR read is wrong, and the user has to say which.

Keeping every receipt matters beyond provenance: an invoice seen on five separate days
with status `open` on each is far better evidence than an invoice seen once.

`scripts/aging_calc.py` performs the collapse and the aging arithmetic. Use it rather than
doing this by eye.

## 5. Extraction confidence

| Rating | When |
|---|---|
| **High** | A processor or accounting surface showed client, amount, and a status string together, and the same invoice appeared in two or more captures. |
| **Medium** | One clear capture of a full invoice line, no corroboration. Or a full line assembled from two captures of the same surface. |
| **Low** | An OCR fragment, an amount without a client, a client without an amount, a single item the retrieval scored 3, or an invoice known only because a message mentioned it. |

A Low-confidence invoice never reaches a follow-up draft without the user confirming it
exists [`evidence-standards.md`, rule 3]. It can appear on the table, marked Low, in the
verify-first tier.

## 6. Traps

- **Invoices the user RECEIVED are not receivables.** A vendor's bill to the user looks
  almost identical in capture. Check the direction: who is the "bill to" and who is the
  "from". If the direction is unclear, the line is `direction: unknown` and it is excluded
  from the table with a note. This is the most common way to poison this skill's output.
- **Draft and void are not sent.** A Stripe invoice in `draft` was never delivered.
  A `void` invoice was cancelled. Both are excluded from receivables, and a draft that is
  weeks old is worth mentioning to the user separately, on the judgment that an invoice
  which was never sent has no due date and therefore no aging clock at all. That is a
  design call, not a sourced claim.
- **A screen share is not the user's system.** Capture from a client's screen, a
  bookkeeper's screen in a Zoom call, or a competitor demo puts invoice data on screen that
  belongs to somebody else [`evidence-standards.md`, rule 7]. Check the app and the context.
  If the capture came from a meeting screen share, exclude it.
- **A template or sample invoice is not an invoice.** Invoice generators, help articles,
  and product tours all render fake invoices with plausible names and amounts.
- **Currency.** Record the symbol as shown. Never convert. A mixed-currency table is
  reported as mixed, with subtotals per currency and no grand total.
- **Recurring subscriptions are not invoices.** A Stripe subscription that charges
  automatically produces receipts, not receivables. If it failed to charge, that is a
  dunning problem, not a collections problem, and it belongs to a different workflow.

## 7. Output of this phase

A candidate invoice list with the section 3 schema, deduplicated, each line carrying its
receipts and its extraction confidence, plus three side lists:

- **Excluded, direction unknown.** Count and why.
- **Excluded, draft or void.** Named, because unsent drafts matter to the user.
- **Leads without lines.** Message mentions of invoices that produced no invoice artifact.
  These become targeted per-client queries in `payment-reconciliation.md` section 2.

Report the count of each. A discovery phase that found 4 invoices for a business that
invoices weekly did not find the invoices; it found some of them. Say so.
