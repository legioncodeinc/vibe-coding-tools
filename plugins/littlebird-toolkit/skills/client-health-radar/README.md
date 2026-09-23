# client-health-radar

Tells you which client is about to leave and which is quietly eating your margin, in bands backed by dated quotes, never a score.

## What it does

Two different clients, and a service business usually has both. The one leaving stopped answering and just asked to export their assets. The one eating your margin likes you and adds a small thing each call.

It reads your meetings, threads and captured dashboards per client and pulls five signal families: unmet promises both directions, silence against that client's own normal gap, scope creep with the quote where the ask happened, changes in the room, payment signals.

It is built to argue with you. When the relationship owner's own read carries weight in an account score, retention falls and churn rises: owners want to believe the account stabilized. You are that owner, so every line is behavior with a date and a receipt.

## When to use it

- A client has gone quiet and you are not sure how long it has been.
- A project feels heavier than you quoted and you want the record.

Just ask for it. Trigger phrases include "which client is about to churn", "client health check", "am I losing this client", "scope creep on this client" and "client went quiet".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Client health radar | Weekly, Monday 07:30 | What changed per client: bands, band moves, STUCK clients, coverage. |
| Deep dive | When you ask | 90 days, or 180 on a first run, per client or roster. |

Weekly matches the pace these signals move at. A silence gap is measured in days, so a daily version would report the same standing state six times over. The routine escalates by changing its recommendation rather than repeating it: three weeks in one band and it asks for a decision, not another email. The skill sets it up itself, shows you the prompt, and creates it.

## What you get

`client-health-YYYY-MM-DD.md`: the limitation note, coverage per client, what changed since last time, a ranked risk list capped at five, per-client detail, and method. The roster persists in `client-roster.md`.

A scope item is the quote itself, with meeting name and date. No quote, no item. Silence is days since the last captured contact against that client's own median gap.

## What it needs

- The Littlebird MCP on a Power or Pro plan.
- A roster you confirm once, never inferred. Guessing turns prospects into clients and misses the one who only appears as a domain on a dashboard.
- Recorded meetings. An unrecorded call is invisible here; coverage says how many.
- Optional: `invoice-chaser`, which owns the chasing when a payment signal appears.

## Limits worth knowing

**It will not emit a health score, and the refusal is the point.** No number out of 100 and no sentiment score, even when you ask directly. Transcription substitutes the emotion-carrying word in 17.6% of utterances, and those get misclassified at nearly double the rate. Meanwhile the strongest exit signal, a client asking for an asset inventory, carries no sentiment word at all. A band with three dated receipts gets read. 72 out of 100 gets tracked as though the gap to 68 meant something it cannot.

**Four bands, and Unknown is one.** A client with fewer than two recorded meetings and three thread exchanges is Unknown, not green. A client it cannot see is a coverage problem, and the fix is recording the next call.

**It is an internal view.** It names accounts at risk and records scope you gave away. Any drafted outreach is held with the full text shown first, and it never sends.

## Related skills

- [commitment-tracker](../commitment-tracker/README.md), for the full promise ledger.
- [invoice-chaser](../invoice-chaser/README.md), which owns receivables when an invoice runs late.
- [deal-pipeline-reconstructor](../deal-pipeline-reconstructor/README.md), for relationships not yet clients.
- [weekly-review](../weekly-review/README.md), which takes band changes weekly.

## Under the hood

`SKILL.md` holds the process and routine prompt. Guides: `references/roster-setup.md`, `references/signal-extraction.md`, `references/sentiment-limits.md`, `references/scope-creep-detection.md`, `references/scoring-and-reporting.md`, `references/evidence-standards.md`.

`references/research/` archives 12 primary sources. Every domain claim traces to one, including the transcription measurements behind the refusal.
