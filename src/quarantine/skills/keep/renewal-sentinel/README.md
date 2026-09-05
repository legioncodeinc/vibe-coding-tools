# renewal-sentinel

A 90-day calendar of everything about to auto-charge, sorted by the date you have to decide by rather than the date you get billed.

## What it does

Annual renewals hurt. They are invisible for eleven months, land as one large charge, and the notice window that would have let you out closed weeks earlier.

It sweeps captured renewal notices, expiry warnings, registrar dashboards, annual receipts and calendar reminders into one forward calendar, a receipt on every line. Each item gets a decision deadline: renewal date minus notice window, with that window's source shown. Domains and certificates form their own class, ranked by blast radius rather than price.

Decision days remaining is the field worth running it for. An item renewing in 80 days with a 90-day window is more urgent than one renewing in 20 days with none. The calendar sorts that way.

## When to use it

- An annual plan is coming up and you want out before it charges.
- Your domain or certificate is expiring and you are not sure when.
- You want one list of what you must decide this month.

Just ask for it. Trigger phrases include "what is renewing soon", "upcoming renewals", "cancel before it renews", "my domain is expiring", "SSL certificate expiry" and "cancellation window".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Renewal sentinel | Weekly, Monday 07:30 | Watches the 90-day horizon. Reports what entered it and what is inside 14 days. |
| On demand | When you ask | The full calendar, the domain and certificate section, the drafts. |

Run the weekly routine. Deadlines move seven days closer every week and a monthly check can miss a window entirely. It reads its own past reports, so an item on its third week is marked ESCALATED rather than restated. The skill sets it up itself: it shows you the schedule and prompt, you approve.

## What you get

`renewal-calendar-YYYY-MM-DD.md`, opening with deadlines inside 14 days or already passed. One row: decision by with days left, renewal date with `(projected from 2025-11-14 charge)` where inferred, item, class, amount as shown, confidence, window basis, receipt, action.

Then the domain and certificate section, known unknowns naming every vendor you pay for with no renewal date found, and what was searched. Drafts land in `renewal-drafts-YYYY-MM-DD.md`, headed `STATUS: HELD FOR APPROVAL. Not sent.`

## What it needs

- The Littlebird MCP on a Power or Pro plan.
- Two answers up front: the horizon, default 90 days, and personal or business.
- A contract or terms page on screen sharpens the window. Without one it assumes 30 days, flags it Low, and says what a 60 or 90 day window would mean.
- Optional: `money-leak-auditor`, whose ledger is the best roster for known unknowns, and a voice skill so drafts sound like you.

## Limits worth knowing

**A wrong date is worse than no date, so projections announce themselves.** A projected date says so in the same cell, is Medium confidence at best, and is never produced for certificates or for hosting coming off a promotional rate.

**A short calendar is not a complete one.** No notice found is not evidence that nothing is renewing, which is why known unknowns is a mandatory section.

**Deliberate legal care.** There is no federal click-to-cancel rule in force: the FTC's 2024 rule was vacated in July 2025 on procedural grounds, not the merits. So the skill never tells you federal law requires your vendor to make cancelling easy, and no drafted message cites law. United States law only, and not legal advice.

**It drafts and holds. It never sends.** Nothing reaches a vendor.

## Related skills

- [money-leak-auditor](../money-leak-auditor/README.md), for spend that already happened.
- [weekly-review](../weekly-review/README.md), which pulls renewals inside 14 days into your week.
- [littlebird-voice-creator](../littlebird-voice-creator/README.md), for drafts in your own voice.
- [routine-architect](../routine-architect/README.md), for tuning the sentinel.

## Under the hood

`SKILL.md` holds the six phases and the routine prompt. Domain guides: `references/renewal-discovery.md`, `references/cancellation-windows.md`, `references/domain-and-ssl.md`, `references/cancel-and-downgrade-drafts.md` and `references/evidence-standards.md`.

`references/research/` archives 15 primary sources. Every domain and legal claim traces to one, including the conflicts it reports rather than smooths.
