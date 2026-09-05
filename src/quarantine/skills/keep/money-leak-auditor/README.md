# money-leak-auditor

Rebuilds every software charge you actually pay from what crossed your screen, then proves which of those tools you have not opened in 90 days.

## What it does

Half your spend never reaches a finance tool. It lives in billing emails, receipts, vendor dashboards and card alerts you swipe away. So "what am I paying for" is a question you answer from memory.

This skill reads those surfaces, because you looked at them and Littlebird captured them. It builds a vendor ledger with a receipt on every line, makes you confirm it before pricing anything, sweeps each vendor for usage at 30, 60 and 90 days, then sorts each into cancel, downgrade, consolidate, renegotiate or keep.

The zombie sweep is what you cannot do by hand. Proving a paid tool has not been on screen since May, with the failed queries attached, is different work. So is the cascade trace: twelve failing charges usually turn out to be one unfunded card.

## When to use it

- Your card got declined and you do not know for what.
- You suspect you pay for three things that do the same job.
- You want to cut software costs before a slow month.

Just ask for it. Trigger phrases include "subscription audit", "where is my money going", "cancel unused tools", "find zombie subscriptions" and "why did my card get declined".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Spend sentinel | Monthly, 1st at 08:00 | Watches 35 days for new charges, failures and price rises. Change only. |
| On demand | When you ask | The full audit, the confirmation gate, the drafts. |

Run both. The sentinel reads its own past reports, so it says an item has been open three months instead of repeating itself. The audit needs your confirmations, so it stays interactive. The skill creates the sentinel itself: it shows you the schedule and prompt, you approve.

## What you get

Three dated files. A report with the run rate, the cascade trace, the five action lists, and savings split into confirmed, probable and a negotiation range. A CSV ledger, one row per vendor. A drafts file, each email headed `STATUS: HELD FOR APPROVAL. Not sent.`

One zombie line: vendor, amount with its confidence, the last observation of any kind, then the windows and queries that came back empty.

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without it the skill stops instead of guessing.
- Two answers up front: how far back to sweep, and personal, business, or both.
- Your confirmation of the vendor list before pricing. A pricing page you read puts a vendor and a price into capture with no payment behind it.
- Optional: `renewal-sentinel`, which turns the ledger into a forward calendar.

## Limits worth knowing

**Infrastructure never reaches the cancel list.** APIs, cron jobs, monitoring, backups and payment gateways deliver full value with zero screen time. The skill marks these `background-suspected`, turns them into a question, and never recommends cancelling one. That costs recall deliberately. A subscription kept too long costs a month of money. A gateway cancelled for leaving no screen evidence costs what money does not buy back.

**It writes "no evidence of use in 90 days", not "unused".** Only the first is supportable.

**It quotes no industry waste percentage.** The sources disagree, using 36%, 46% and 51% with no comparable denominator, and ten of the twelve were published by companies selling the fix. The 30, 60 and 90 day windows are conventions too.

**It drafts and holds. It never sends.** Nothing here reaches a vendor.

## Related skills

- [renewal-sentinel](../renewal-sentinel/README.md), when the question is what is about to charge.
- [invoice-chaser](../invoice-chaser/README.md), for the other direction: what clients owe you.
- [weekly-review](../weekly-review/README.md), which rolls the sentinel's reports into your week.
- [routine-architect](../routine-architect/README.md), for tuning the sentinel.

## Under the hood

`SKILL.md` holds the seven phases and the routine prompt verbatim. Domain guides: `references/vendor-ledger-construction.md`, `references/zombie-detection.md`, `references/cascade-tracing.md`, `references/action-pack-and-negotiation.md`, `references/evidence-standards.md`.

`references/research/` archives 12 primary sources. Every domain claim traces to one, including the figures the skill refuses to quote.
