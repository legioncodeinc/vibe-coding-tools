# Vendor ledger construction

How to rebuild a complete spend picture out of screen capture, and how to keep it honest.

Read `evidence-standards.md` first. This guide assumes the receipt format, the
observed / inferred / external / unknown split, and the confidence ratings.

## Why capture is the primary source here

Between 30% and 40% of large-organization IT spend is classified as shadow IT and sits
outside the system of record [research/distilled-saas-spend-leakage.md, section 2].
Card-bought, expensed software grew 267% year over year, and 81% of spend is controlled
by business units rather than IT [same]. A solo operator or small agency has no
procurement system at all, so the proportion outside a system of record approaches
everything.

What capture reads that no finance tool reads: the billing email, the Stripe receipt in
the browser, the vendor's own billing dashboard, the card issuer's decline alert, and the
renewal reminder some states require vendors to send. The Littlebird capability receipts
confirm this class of signal appears in ordinary capture with no finance integration
[littlebird-mcp-reference.md, Verified capability receipts].

## Step 1: sweep, narrow and parallel

Run several narrow queries rather than one broad one. Broad queries against this server
return 70,000-plus characters and get dumped to a file
[littlebird-mcp-reference.md, Oversized results].

Run these five families with `search_user_context`. Window each one month at a time,
walking back 12 months, so relevance is not diluted
[littlebird-mcp-reference.md, Retrieval patterns].

**Family A, receipts and invoices.** `filters.data_source: "snapshots"`.

```
"payment receipt from"
"your invoice is available"
"thanks for your payment"
"receipt for your subscription"
"invoice paid amount due"
```

**Family B, renewal and price change.** `filters.data_source: "snapshots"`.

```
"your subscription renews on"
"your plan is changing price"
"we are updating our pricing"
"annual renewal reminder"
"upcoming charge notification"
```

**Family C, failures and dunning.** Covered in detail by `cascade-tracing.md`, but run it
during the ledger sweep too, because a failure alert names a vendor and an amount even
when no successful receipt was ever captured.

```
"payment failed"
"your card was declined"
"action required to keep your account"
"past due balance"
"account will be suspended"
```

**Family D, billing dashboards.** `filters.app: "chrome"` plus
`filters.data_source: "snapshots"`. These are the richest single captures, because a
billing page shows plan, cadence, next charge date, and amount together.

```
"billing and plans current plan"
"manage subscription next billing date"
"usage this billing period"
"payment method on file"
```

**Family E, aggregator surfaces.** Payment processors and app stores bundle many vendors
into one receipt.

```
"Stripe receipt"
"Apple subscriptions receipt"
"Google Play order receipt"
"AWS marketplace charges"
"App Store purchase confirmation"
```

Also run `filters.data_source: "summaries"`. Littlebird's own daily activity digests are
the cheapest compressed view of a day [littlebird-mcp-reference.md, Retrieval patterns],
and they frequently name a vendor and a dollar figure that the underlying snapshot query
missed.

## Step 2: extract candidate lines

For each retrieved item, pull a candidate line only where the capture actually shows the
field. Never fill a field by inference at this stage.

| Field | Rule |
|---|---|
| Vendor | Exactly as it appeared. Keep the raw string. |
| Amount | Exactly as shown, with its currency symbol. Do not convert currency. |
| Cadence | Only if the capture said it. "monthly", "annual", "one-time", or `unknown`. |
| Charge date or renewal date | Only if shown. |
| Payment instrument | Last four digits or card name, only if shown. |
| Evidence timestamp | The receipt, from the item's `[Time collected \| App]` prefix. |
| Source kind | receipt, dashboard, renewal notice, failure alert, card alert. |

Sort by timestamp before you present anything. Retrieval returns relevance order, not
chronological order [littlebird-mcp-reference.md, Known limitations].

## Step 3: deduplicate, aggressively

OCR of a dense billing dashboard repeats lines, interleaves UI chrome, and produces
fragments [littlebird-mcp-reference.md, Known limitations]. Deduplicate before counting
anything.

Collapse in this order:

1. **Exact repeats.** Same vendor, same amount, same charge date, from any number of
   captures. One observation, not N. This is the big one: a user scrolling a billing page
   generates many near-identical snapshots.
2. **Same charge, different surfaces.** A vendor's own receipt, the Stripe receipt for it,
   and the card alert for it are three views of one charge. Collapse to one line and keep
   all three receipts attached, because corroboration across surfaces raises confidence.
3. **Vendor name variants.** "Supabase", "Supabase Inc", "SUPABASE PRO", and
   `supabase.com` are one vendor. Keep the canonical name and record the variants, because
   the variants are the strings the zombie sweep will need.
4. **Parent and child products.** Two line items from one vendor that bill separately stay
   as two lines with a shared parent, not one merged line. Merging hides a duplicate.

Do not collapse the same vendor at two different amounts. Two amounts are either two
products, a plan change, or a proration, and each of those is a finding.
`scripts/ledger_math.py` performs steps 1 and 3 deterministically. Run it rather than
eyeballing a long list.

## Step 4: rate confidence on the amount

This is the rule the skill is graded on. Never assert a price the capture did not show.

| Rating | Condition |
|---|---|
| **High** | The same amount observed on three or more consecutive billing periods, or one unambiguous primary artifact such as a paid invoice showing vendor, amount, and date together. |
| **Medium** | The amount observed once, on a clear artifact, with no corroboration. |
| **Low** | The amount comes from an OCR fragment, a partially rendered page, an item the retrieval scored 3, or a figure read off a screenshot of an older screen. |

A vendor with no amount observed at all is not dropped. It goes on the ledger with amount
`unknown`, which is one of the four evidence kinds and is a legitimate output
[evidence-standards.md, rule 2].

Never annualize a Medium or Low amount into a headline savings figure without saying the
figure inherits that confidence.

## Step 5: rate confidence on the cadence

Cadence drives the run rate, so it gets its own rating and its own honesty.

- **Observed cadence.** The capture said "billed monthly" or "renews annually". High.
- **Inferred from repetition.** The same amount appeared in three consecutive months.
  That is High for monthly, and it is the only clean way to infer cadence.
- **Inferred from a single dated renewal.** "Renews on 2027-03-14" seen once in March 2026
  implies annual. Medium.
- **Unknown.** One receipt, no stated cadence, no repetition. Mark it `unknown` and
  exclude it from the run rate total. Report it as a separate "uncosted vendors" block
  with its observed one-time amounts.

Inflating the run rate by assuming everything is monthly is the most likely way this
skill produces a wrong headline number.

## Step 6: confirm the vendor list before pricing anything

Stop here. Do not compute a total yet.

Capture both misses vendors and invents them. A user who read a review of a tool, saw it
in an ad, or watched a competitor's pricing page in a screen share will have that vendor's
name and price in their capture without ever paying for it. The attribution guardrail
applies directly: capture shows what was viewed, not what was bought
[evidence-standards.md, rule 4].

Use `AskUserQuestion`. Present the deduplicated vendor list in three groups:

1. **Confirmed by a payment artifact.** A receipt, a paid invoice, or a card charge.
   Ask the user only to flag anything that is wrong.
2. **Named but unpaid in capture.** Seen on a dashboard, a renewal notice, or a pricing
   page, with no payment artifact. Ask: do you pay for this?
3. **Ambiguous.** A single fragment, a Low-rated read. Ask: is this real, and is the name
   right?

Also ask the open question: what are you paying for that is not on this list? Capture has
holes, and the user closes them faster than another sweep will.

Only after this gate do you price, total, or draft anything
[evidence-standards.md, rule 6, confirm before you encode].

## Step 7: the ledger schema

One row per vendor line. This is the artifact everything downstream reads.

| Column | Contents |
|---|---|
| `vendor` | Canonical name |
| `variants` | Other strings observed for the same vendor |
| `product` | Specific product or plan where the capture named one |
| `amount` | As observed, with currency |
| `amount_confidence` | High / Medium / Low / unknown |
| `cadence` | monthly / annual / quarterly / one-time / unknown |
| `cadence_confidence` | High / Medium / Low |
| `monthly_equivalent` | Computed, blank where cadence is unknown |
| `next_charge` | Date, where observed |
| `instrument` | Card or account, where observed |
| `first_seen` | Earliest evidence timestamp |
| `last_seen` | Latest evidence timestamp |
| `evidence` | Every receipt, in the canonical format |
| `evidence_kind` | observed / inferred / external / unknown |
| `usage_verdict` | Filled by `zombie-detection.md` |
| `status` | active / failing / cancelled / unknown |
| `user_confirmed` | yes / no / corrected |
| `discount_revert_date` | Where a negotiated rate is known to expire |

`discount_revert_date` exists because a negotiated rate has an expiry, and that date is
when the negotiation has to happen again
[research/distilled-saas-spend-leakage.md, section 7].

## Step 8: run rate and its error bars

Compute two totals, never one.

- **Confirmed monthly run rate.** Sum of `monthly_equivalent` across rows where
  `amount_confidence` is High and `cadence_confidence` is High.
- **Full monthly run rate.** The above plus Medium and Low rows, reported as a range and
  labelled with how much of it rests on Medium or Low evidence.

Annualize by multiplying by 12, and carry the same two-number structure through. A single
confident-looking annual figure built on one Medium observation is the failure mode.

Report alongside the total:

- Count of vendors with `amount` unknown.
- Count of vendors with `cadence` unknown, excluded from the run rate.
- The window swept, and the months inside it that returned nothing.

## Step 9: sanity-check the count

A median company runs 25 active subscriptions, and the top 10% run 49 or more
[research/distilled-saas-spend-leakage.md, section 3]. If the confirmed ledger has
substantially fewer than 25 lines for an operating business, treat that as evidence the
sweep was thin rather than evidence the user is lean, and say so in the report.

Do not apply the dollar waste benchmarks from the research to a small operator. The
archive explicitly warns that the small-band dollar averages are dominated by the top of
their range [research/distilled-saas-spend-leakage.md, section 3]. Use percentages for
calibration, never the dollar figures.

## Empty retrieval

If the sweep returns nothing across all five families, report the gap and stop. Name the
windows searched, the queries run, and the filters applied. Do not reconstruct a plausible
stack from what a business like this usually buys
[evidence-standards.md, rule 9].
