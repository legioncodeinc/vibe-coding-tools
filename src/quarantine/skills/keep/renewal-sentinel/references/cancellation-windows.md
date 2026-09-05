# Cancellation windows

The highest-value field this skill produces. A renewal date is interesting. Decision days
remaining is actionable.

## The arithmetic

```
decision_deadline  = renewal_date - notice_window_days
decision_days_left = decision_deadline - today
```

An item renewing in 40 days with a 30-day notice window has 10 days of decision time left.
That is the number that goes in the calendar, in bold, next to the date. The renewal date
alone hides the real deadline behind a month of false comfort.

The operative deadline is the notice deadline, not the renewal date, and a reminder set two
weeks before renewal is already too late to negotiate
[research/distilled-renewal-and-expiry-practice.md, section 3].

## Where the notice window number comes from

Four sources, in descending order of trust. The source of the number is recorded in the
output next to the number. A window whose provenance is not recorded is not usable.

| Rank | Source of the window | Confidence | How it appears |
|---|---|---|---|
| 1 | The contract or order form itself, seen in capture | High | `30 days (contract, seen 2026-03-04)` |
| 2 | The vendor's own help or terms page, seen in capture | High | `60 days (vendor terms page)` |
| 3 | The user tells you | Medium | `90 days (user-supplied)` |
| 4 | The benchmark default | Low | `30 days (assumed, benchmark default)` |

**The benchmark default is 30 days.** In a corpus of more than 10,000 cloud service
agreements, 85% auto-renew and 84% of those require 30 days notice of non-renewal
[research/distilled-renewal-and-expiry-practice.md, section 3]. That is the only figure in
the archive with a stated dataset behind it, which is why it is the default.

**The sources conflict on the range and the conflict is not resolvable here.** CloudNuro
describes the band as 30 to 90 days and Lapsewise claims 48% of B2B contracts sit at 60 to
90 days with no attribution [research/distilled-renewal-and-expiry-practice.md, section 3].
Common Paper is preferred because it states its dataset. The practical consequence: compute
the deadline at renewal minus 30, and **separately state that a 60 or 90 day window would
mean the deadline has already passed.** Do not silently pick one. An assumed window that is
too short produces a false sense of remaining time, and that is the exact failure this skill
exists to prevent.

## The self-serve exception

The Common Paper corpus is standardized contract paper. A self-serve credit-card plan with
no negotiated agreement often has no notice requirement at all and simply cancels effective
at the end of the current term [research/distilled-renewal-and-expiry-practice.md,
section 3].

So: do not apply a 30-day window to a plan the user bought with a card on a pricing page.
Classify the item first.

| Item type | Default window treatment |
|---|---|
| Self-serve card plan, no contract seen | `cancel anytime before renewal`, window 0, and say the classification is an assumption |
| Contract or order form seen | Use the contract's number |
| Enterprise or negotiated plan, no contract seen | 30 days assumed, flagged Low, with the 60 and 90 day alternative stated |
| Domain | Not a notice window. See `domain-and-ssl.md` |
| Certificate | Not a notice window. See `domain-and-ssl.md` |

## The four window states

Every item gets one. The state drives the sort order of the whole calendar.

| State | Condition | Presentation |
|---|---|---|
| `open` | decision_days_left is more than 14 | Normal entry |
| `closing` | decision_days_left is 1 to 14 | Flagged, sorted above open items regardless of renewal date |
| `today` | decision_days_left is 0 | Top of the calendar |
| `closed` | decision_days_left is negative | Top of the calendar, with the recovery paths below |

**Sort by decision deadline, not by renewal date.** An item renewing in 80 days with a
90-day window is more urgent than an item renewing in 20 days with no window at all. Sorting
by renewal date buries exactly the item that this skill exists to surface.

Retrieval returns items in relevance order, so sort explicitly before presenting
[littlebird-mcp-reference.md, Known limitations].

## When the window has already closed

Do not present this as a dead end. There are three real paths, and the skill offers all
three without promising any of them.

**Path 1: ask anyway.** Many vendors will let a customer out of a renewal they clearly do
not want, especially self-serve ones, and especially inside the first days of a new term.
This costs an email. Draft it (see `cancel-and-downgrade-drafts.md`).

**Path 2: check whether the vendor served the notice they owed.** This is jurisdiction and
contract dependent and it is a question, never a conclusion.

- For a business buying service, maintenance, or repair under New York law, GOL 5-903 makes
  an auto-renewal provision unenforceable against the buyer unless the vendor served written
  notice at least fifteen and not more than thirty days before the renewal, personally or by
  certified mail [research/distilled-renewal-and-expiry-practice.md, section 2]. Whether it
  reaches a software subscription is unresolved in the archive and the contract's
  choice-of-law clause governs whether it applies at all
  [research/distilled-renewal-and-expiry-practice.md, section 2].
- California's Automatic Renewal Law mandates annual reminders and a same-medium
  cancellation path, but it is a consumer statute and a business account frequently falls
  outside it [research/distilled-renewal-and-expiry-practice.md, section 2].

The output line for this path reads like a question for a lawyer, because that is what it is:
"The vendor may have owed you a renewal notice. Worth asking your attorney whether NY GOL
5-903 applies here." Never write "you are not bound by this renewal."

**Path 3: set the next one.** A closed window on an annual item means the decision moves to
next year. Record the next decision deadline now and put it on the calendar, which is the one
outcome fully within the user's control.

## What the law does NOT give the user

State this plainly whenever a user asks why they cannot just click cancel.

**There is no federal click-to-cancel rule in force.** The FTC's 2024 revised Negative Option
Rule was vacated in its entirety by the Eighth Circuit in *Custom Communications, Inc. v.
Federal Trade Commission* on 2025-07-08, on the procedural ground that the Commission had not
performed the required preliminary regulatory analysis
[research/distilled-renewal-and-expiry-practice.md, section 1]. A replacement is at
advance-notice-of-rulemaking stage: the ANPRM was announced 2026-03-11 and comments closed
2026-04-13, so there is no proposed rule text and no compliance date
[research/distilled-renewal-and-expiry-practice.md, section 1]. The Negative Option Rule that
does remain in force dates from 1973 and is limited to prenotification plans such as
product-of-the-month clubs; it does not reach a SaaS auto-renewal
[research/distilled-renewal-and-expiry-practice.md, section 1]. The FTC still enforces under
ROSCA and Section 5 of the FTC Act, both fully operative
[research/distilled-renewal-and-expiry-practice.md, section 1].

Three errors to avoid, each of which would be a real defect:

1. Do not say the click-to-cancel rule is in effect. It was vacated.
2. Do not say it was struck down as unlawful in substance. It was vacated on procedure, and
   the court did not reach the merits of the requirements
   [research/distilled-renewal-and-expiry-practice.md, section 1].
3. Do not predict what the replacement will require. The archive contains no basis for a
   prediction and section 1 of the distillation makes none.

Where real cancellation-ease obligations exist, they come from state law, principally
California, or from the vendor's own contract
[research/distilled-renewal-and-expiry-practice.md, sections 1 and 2].

## Price escalators inside the window

An auto-renewal frequently carries a built-in increase. In the benchmark corpus, 21% of
agreements have an automatic fee increase on renewal, most commonly 5% to 8%
[research/distilled-renewal-and-expiry-practice.md, section 3].

That is the projection basis when no amount is captured for a renewing contract: last year's
amount plus 5% to 8%, presented as a range and marked estimated. It is not last year's amount
flat, and it is not the 12% to 18% enterprise figure, which comes from a vendor blog with no
stated sample [research/distilled-renewal-and-expiry-practice.md, section 4].

For a consumer-facing vendor, a captured price-change email implies the change lands inside
roughly one month, since California requires notice between 7 and 30 days before a fee change
takes effect [research/distilled-renewal-and-expiry-practice.md, section 2]. The sources
disagree on whether those are business days, so do not quote the exact count
[research/distilled-renewal-and-expiry-practice.md, section 2].

## The negotiation clock, for items the user wants to keep

The window is not only a cancellation deadline. It is also the last point at which the user
has leverage, because a vendor discounts a renewal that might not happen.

| Days before renewal | What is still available |
|---|---|
| 120 and earlier | Inventory and planning |
| 90 to 120 | Usage analysis, competitor quotes |
| 60 to 90 | Formal vendor engagement, quote requests |
| 30 to 60 | Active negotiation, typically 2 to 4 rounds |
| 0 to 30 | Approvals and signature only |

All rows [research/distilled-renewal-and-expiry-practice.md, section 3].

This is why the horizon is 90 days. At 90 days out every stage above is still available. At
30 days out the negotiation stage has started or passed and a 30-day notice window closes
that day [research/distilled-renewal-and-expiry-practice.md, section 3].

The 90-day horizon is this skill's reasoned convention, derived from that table plus the
30-day notice default. No source in the archive measures the optimal lead time
[research/distilled-renewal-and-expiry-practice.md, section 7, gap 1]. Present it as a
convention and let the user move it.
