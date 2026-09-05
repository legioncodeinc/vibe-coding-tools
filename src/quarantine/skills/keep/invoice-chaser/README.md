# invoice-chaser

Turns "they still have not paid" into a drafted follow-up, without ever chasing a client who already paid you.

## What it does

You invoice from three or four surfaces and reconcile from none. Invoices sit in Stripe, PayPal and your sent mail; payments land in a bank account, a processor balance, sometimes an envelope. Nothing joins them, so "who owes me money" is a question you answer from memory and guilt.

Littlebird captured those surfaces because you looked at them. This skill joins them: it rebuilds the invoices you sent, reconciles each against every payment observation it finds, ages what is left, then drafts a follow-up ladder.

What separates it from a spreadsheet is what it refuses to conclude. Capture can prove a payment was seen. It can never prove one was not received: money arrives in accounts you never opened that week. So there is no state called UNPAID anywhere in this skill, only confirmed paid, claimed paid, unresolved and disputed.

## When to use it

- You have no idea what is outstanding and cash is tight.
- A client keeps saying the payment went out and you cannot tell.

Just ask for it. Trigger phrases include "who has not paid me", "chase unpaid invoices", "accounts receivable", "AR aging" and "who owes me money".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Receivables watch | Weekly, Monday 08:00 | New invoices, payments seen, anything that crossed an aging boundary. Never concludes non-payment. |
| On demand | When you ask | Reconciliation, the verification gate, the drafts. |

Weekly is right: the bucket boundaries that change the approach sit 30 days apart, so a weekly check catches a crossing within a week, where monthly lets an invoice cross two unseen. The skill sets the watch up itself, shows you the prompt, and creates it on your approval.

## What you get

Three dated files. `receivables-aging-YYYY-MM-DD.md` opens with a reconciliation confidence note, then the aging table by bucket. One row: client, invoice reference, amount as captured, due date with its basis, days overdue, bucket, payment status, tier, supports, and every receipt sorted by time.

Then the verify-first tier with a check instruction per line, disputes with the objection quoted, blind spots, and unattributed cash. A CSV carries the same schema. `follow-up-drafts-YYYY-MM-DD.md` holds every draft under `STATUS: HELD FOR APPROVAL. Not sent.`

## What it needs

- The Littlebird MCP on a Power or Pro plan.
- Four answers up front. The key one is where money actually lands, which becomes the blind-spot list printed every run.
- Optional: a Stripe, PayPal or QuickBooks connector, which wins over capture where they disagree. Without one, every line is marked capture-derived.
- Optional: a voice skill, so drafts sound like you.

## Limits worth knowing

**Verification is mandatory, with no bypass.** Chasing a client who paid three weeks ago is the most expensive mistake in this marketplace: a wrong chase costs a relationship, a missed chase costs a reminder. So nothing is called likely outstanding without two independent supports, unresolved items go to a verify-first tier with a ninety-second check, and no draft exists until you confirm each invoice individually.

**The ladder terminates.** Seven rungs, then it stops and recommends a lawyer, an agency or a write-off. There is no rung 8. Ceiling: one contact per invoice in five days, two in fourteen.

**It drafts and holds. It never sends.** Not with a connector live, and not after you approved the plan. A plan is not the words.

**Not legal advice.** It never computes a late fee into a balance, and sends specific questions to a lawyer.

## Related skills

- [money-leak-auditor](../money-leak-auditor/README.md), for the money leaving instead.
- [client-health-radar](../client-health-radar/README.md), when an overdue client needs a conversation rather than a rung 6 notice.
- [weekly-review](../weekly-review/README.md), which rolls the outstanding total into your week.

## Under the hood

`SKILL.md` holds the seven phases and the routine prompt. Domain guides: `references/invoice-discovery.md`, `references/payment-reconciliation.md`, `references/aging-and-verification.md`, `references/follow-up-ladder.md`, `references/evidence-standards.md`. Aging runs in `scripts/aging_calc.py`.

`references/research/` archives 16 primary sources. Every claim traces to one, including the collectability curve, presented as a shape and never a forecast.
