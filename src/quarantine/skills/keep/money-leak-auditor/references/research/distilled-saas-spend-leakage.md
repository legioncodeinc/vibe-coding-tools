# Distilled: SaaS and vendor spend leakage, 2026

Written from a fresh read of `raw/` on 2026-08-17. Every claim below ends in a bracketed
citation to the raw file it came from. Nothing here is authored from training data. Where
sources disagree, both readings appear.

Research window: sources published between 2026-01-21 and 2026-07-21, with one 2025
court decision reported in a 2026 alert. All within twelve months, most within six.

## 1. How much leaks, and the disagreement about it

| Claim | Figure | Source |
|---|---|---|
| Licenses entirely unused or underutilized | 65% as of Q2 2026, up from 62% | [raw/spend--shelfware--vertice-unused-2026.md] |
| Split: shelfware (entirely unused) | 14%, down from 15% | [raw/spend--shelfware--vertice-unused-2026.md] |
| Split: underutilized (under 50% of seats used) | 51%, up from 47% | [raw/spend--shelfware--vertice-unused-2026.md] |
| Average unused licenses | 36% | [raw/spend--saas-waste--zylo-index-2026.md] |
| Average license utilization | 54%, so 46% unused | [raw/spend--saas-waste--zylo-waste-calc-2026.md] |
| Recoverable waste, duplicates plus unused | 15% to 30% of total SaaS budget | [raw/spend--duplicates--coommit-benchmark-2026.md] |
| Overspend from unused entitlements and overlap, projected | 25% by 2027 | [raw/spend--sprawl--bettercloud-stats-2026.md] |

**Conflict, stated plainly.** Zylo publishes 36% unused in its index press release
[raw/spend--saas-waste--zylo-index-2026.md] and 46% unused in its own blog restating the
same index [raw/spend--saas-waste--zylo-waste-calc-2026.md]. Vertice publishes 14%
entirely unused plus 51% underutilized [raw/spend--shelfware--vertice-unused-2026.md]. A
third source restates 51% as "unused" outright
[raw/spend--duplicates--coommit-benchmark-2026.md], which reads as a definitional slip.

**Preferred reading:** Vertice's two-bucket split. It is the only source that defines its
terms, its buckets map onto two different actions (cancel versus downgrade), and it
explains why the headline number moved. The single-number claims are not comparable to
each other because none of them state a denominator.

**Consequence for the skill:** never quote a single industry waste percentage as if it
were settled. Report the observed ledger, and use the ranges only as a sanity check on
the magnitude of what was found.

## 2. Why a capture-based audit finds spend that finance tools cannot

| Claim | Figure | Source |
|---|---|---|
| Expense-based SaaS growth (card-bought, expensed, not procured) | 267% YoY | [raw/spend--saas-waste--zylo-index-2026.md] |
| Spend controlled by business units rather than IT | 81% business units, 15% IT | [raw/spend--saas-waste--zylo-index-2026.md] |
| Share of large-org IT spend classified as shadow IT | 30% to 40% | [raw/spend--sprawl--bettercloud-stats-2026.md] |
| Employees adopting SaaS with no security involvement | 55% | [raw/spend--sprawl--bettercloud-stats-2026.md] |
| IT leaders reporting unplanned charges | 78% | [raw/spend--saas-waste--zylo-index-2026.md] |
| Office workers using public AI, often without IT knowledge | 8 in 10 | [raw/shadow-it--shadow-ai--jumpcloud-2026.md] |

This block is the justification for the whole skill. Between a third and 40% of spend is
outside the system of record in a large organization
[raw/spend--sprawl--bettercloud-stats-2026.md], and a solo operator has no system of
record at all. Billing email, a Stripe receipt, and a vendor dashboard are the primary
sources, and screen capture is the only thing that reads all three.

## 3. Scale expectations for a small operator

| Claim | Figure | Source |
|---|---|---|
| Median company active subscriptions | 25 | [raw/spend--smb-benchmarks--cledara-2026.md] |
| Top 10% of companies | 49 or more | [raw/spend--smb-benchmarks--cledara-2026.md] |
| Startup around 10 people | roughly $150 per employee per month | [raw/spend--smb-benchmarks--cledara-2026.md] |
| 50 to 500 people | $250 to $350 per employee per month | [raw/spend--smb-benchmarks--cledara-2026.md] |
| Average apps per company (larger orgs) | 106 in 2024, down from 112 | [raw/spend--sprawl--bettercloud-stats-2026.md] |
| Average apps per enterprise | 305 | [raw/spend--duplicates--coommit-benchmark-2026.md] |
| Annual waste, 1 to 500 employee band | $3.8M | [raw/spend--saas-waste--zylo-waste-calc-2026.md] |

**Caution recorded in the archive:** the $3.8M figure for the 1-to-500 band is a band
average dominated by the top of that range and must not be applied to a solo operator
[raw/spend--saas-waste--zylo-waste-calc-2026.md]. Use the percentage findings for small
operators, never the dollar findings.

**Usable calibration:** a reconstructed ledger of roughly 25 lines is normal for a small
company [raw/spend--smb-benchmarks--cledara-2026.md]. A ledger far below that is
evidence the capture sweep was thin, not evidence the user is lean.

## 4. Duplicate clusters: where overlap concentrates

Categories most commonly duplicated, verbatim from the source
[raw/spend--duplicates--coommit-benchmark-2026.md]:

1. Communication: Slack, Teams, Zoom, Meet, Loom, Discord
2. AI assistants: ChatGPT, Claude, Copilot, Gemini, Perplexity
3. Project management: Asana, Notion, Jira, Linear, ClickUp, Monday
4. Note-taking and meeting AI: Otter, Fathom, Fireflies, Granola, native tools
5. Whiteboards and canvas: Miro, FigJam, Mural, Lucid, Excalidraw

Supporting figures:

- Overlapping apps are 30% to 40% of an enterprise stack
  [raw/spend--duplicates--coommit-benchmark-2026.md].
- 15% of spend sits on duplicate subscriptions
  [raw/spend--duplicates--coommit-benchmark-2026.md].
- 63% of organizations report too many unused or overlapping apps, which is driving
  consolidation [raw/spend--sprawl--bettercloud-stats-2026.md].
- Organizations without centralized AI governance carry up to 5 times more redundant AI
  subscriptions [raw/shadow-it--shadow-ai--jumpcloud-2026.md].
- AI share of new purchases moved from 8.8% in April 2025 to 26.4% in March 2026
  [raw/spend--smb-benchmarks--cledara-2026.md].

**The AI-bundling trap.** Around 70% of employee AI interaction now happens through
features embedded in already-approved SaaS
[raw/shadow-it--shadow-ai--jumpcloud-2026.md]. A user can be getting AI value from a
bundled feature while still paying for a standalone AI tool. Capture will show the
bundled surface in use and the standalone tool idle. That pattern is a duplicate, and it
is the highest-yield duplicate to look for in 2026.

## 5. Failed payments: the mechanism behind the cascade

| Claim | Figure | Source |
|---|---|---|
| Share of subscription churn that is involuntary | 20% to 40% | [raw/spend--failed-payments--dunningcompare-2026.md] |
| Credit card transaction failure rate | 3.9% | [raw/spend--failed-payments--dunningcompare-2026.md] |
| ACH failure rate | 2.1% | [raw/spend--failed-payments--dunningcompare-2026.md] |
| Natural recovery with no intervention | 15% | [raw/spend--failed-payments--dunningcompare-2026.md] |
| Recovery with retry plus dunning plus card updater | 70% | [raw/spend--failed-payments--dunningcompare-2026.md] |
| Card updater reduces expiry-related churn | 40% to 60% | [raw/spend--failed-payments--dunningcompare-2026.md] |
| Annual billing reduces involuntary churn versus monthly | 12x | [raw/spend--failed-payments--dunningcompare-2026.md] |

**Why this matters for tracing.** Every subscription vendor runs its own smart-retry and
staged dunning sequence [raw/spend--failed-payments--dunningcompare-2026.md]. One dead
payment instrument therefore produces N independent-looking alert streams, each retrying
on its own schedule, each escalating to its own suspension or deletion warning. The
alerts are N; the cause is one.

**The statistical argument.** The per-transaction card failure baseline is 3.9%
[raw/spend--failed-payments--dunningcompare-2026.md]. Simultaneous failures across many
unrelated vendors are far outside that baseline, which is what justifies looking for a
common instrument rather than treating each failure as independent.

**Gap:** the archive contains no source on standard grace-period or
suspension-to-deletion timelines by vendor. Those observed timelines have to come from
the capture itself, not from this archive.

## 6. Renewal, notice periods, and price increases

| Claim | Figure | Source |
|---|---|---|
| Standard auto-renewal notice period | 30 days, roughly 84% of standardized SaaS agreements per Common Paper | [raw/contracts--auto-renewal--bindlegal-2026.md] |
| Buyer-protective negotiated target | 60 days | [raw/contracts--auto-renewal--bindlegal-2026.md] |
| Aggressive, seller-favorable | 90 days | [raw/contracts--auto-renewal--bindlegal-2026.md] |
| Buyer-protective price cap | lesser of 5% or CPI, applied once | [raw/contracts--auto-renewal--bindlegal-2026.md] |
| Typical annual increase vendors seek | approximately 12% | [raw/contracts--auto-renewal--bindlegal-2026.md] |
| When to begin renewal conversations | 90 to 120 days before expiration | [raw/contracts--auto-renewal--bindlegal-2026.md] |
| When to negotiate a small self-serve subscription | 5 to 10 days before renewal | [raw/negotiation--price-reduction--subspend-2026.md] |

**Apparent conflict, resolved by segment.** One source says begin 90 to 120 days out
[raw/contracts--auto-renewal--bindlegal-2026.md]; another says 5 to 10 days out
[raw/negotiation--price-reduction--subspend-2026.md]. These are not contradictory: the
first addresses negotiated contracts with notice periods and an account manager, the
second addresses self-serve subscriptions, where the buyer has bargaining power only in
the moment before the card is charged. Route by contract type, not by preference.

**Threshold this gives the sentinel.** An increase above roughly 5% exceeds the
buyer-protective norm and is worth surfacing; an increase above 12% exceeds even the
typical vendor ask [raw/contracts--auto-renewal--bindlegal-2026.md].

Structural advice from the same source: prefer fixed annual renewals over evergreen
clauses and multi-year re-locks, and raise renewal-pricing protection before discussing
discount [raw/contracts--auto-renewal--bindlegal-2026.md].

## 7. What is actually obtainable when you ask

Levers and realistic ranges for an individual buyer
[raw/negotiation--price-reduction--subspend-2026.md]:

| Lever | Range | Best for |
|---|---|---|
| Percentage discount | 10% to 50%, typically 15% to 30% | consumer and prosumer SaaS |
| Free months | 1 to 3 added | annual plans |
| Tier downgrade | $5 to $12 per month | services with a lower tier |
| Annual prepay | roughly 15% to 20%, about 2 months free | software and productivity tools |

**Caution from the archive:** that sample is consumer-weighted, so the $5 to $12
downgrade range is low for B2B tooling and should not be presented as a B2B expectation
[raw/negotiation--price-reduction--subspend-2026.md].

From the seller side, which is a map of what the cancel flow will offer
[raw/negotiation--cancel-flows--userpilot-2026.md]:

- Cancellation flows recover 10% to 34% of users who explicitly try to cancel.
- 25% of would-be churners pause instead of canceling where pause is offered.
- The flow structure is survey first, then segment, then a personalized offer matched to
  the stated reason.

**The operative insight:** the offer is selected from the reason the buyer gives
[raw/negotiation--cancel-flows--userpilot-2026.md]. A price reason routes to a discount.
A usage reason routes to a downgrade or a pause. This is a controllable input.

**Follow-up discipline:** record the discounted rate, its duration, and its revert date.
The revert date is when the negotiation has to happen again
[raw/negotiation--price-reduction--subspend-2026.md].

**When the vendor declines:** cancel for real
[raw/negotiation--price-reduction--subspend-2026.md].

## 8. Legal reality of canceling in 2026

- The Eighth Circuit vacated the FTC Click-to-Cancel Rule in full in 2025
  [raw/legal--click-to-cancel--jonesday-2026.md].
- The FTC opened an Advance Notice of Proposed Rulemaking around 2026-03-10, comments
  closed 2026-04-13 with roughly 100 submissions
  [raw/legal--click-to-cancel--jonesday-2026.md].
- No federal rule is in force requiring cancellation to be as easy as signup. The FTC
  enforces under Section 5 and ROSCA instead
  [raw/legal--click-to-cancel--jonesday-2026.md].
- Roughly 30 states have auto-renewal or negative-option statutes, but most are
  consumer-only, so B2B protection comes from negotiated terms
  [raw/legal--click-to-cancel--jonesday-2026.md],
  [raw/contracts--auto-renewal--bindlegal-2026.md].
- California's Automatic Renewal Law requires annual renewal reminders disclosing price
  and available cancellation mechanisms [raw/legal--click-to-cancel--jonesday-2026.md].
- B2B auto-renewal statutes named: New York General Obligations Law 5-903, Wisconsin
  Section 134.49, Colorado extended to B2B effective 2026-02-16
  [raw/contracts--auto-renewal--bindlegal-2026.md].

**Practical consequence:** expect friction. Phone-only cancellation and retention
gauntlets remain legal in most B2B contexts
[raw/legal--click-to-cancel--jonesday-2026.md]. Do not promise the user a fast path.

**Capture opportunity:** the California ARL annual reminder is exactly the kind of
artifact that lands in email and gets captured, and it carries both a price and a
renewal date [raw/legal--click-to-cancel--jonesday-2026.md].

## 9. Named gaps in this archive

State these as gaps rather than filling them:

1. **No solo-operator waste benchmark.** Every waste percentage in the archive comes from
   organizations with employees and seats. Nothing measures a one-person business
   [raw/spend--saas-waste--zylo-waste-calc-2026.md],
   [raw/spend--shelfware--vertice-unused-2026.md].
2. **Seat-based definitions do not transfer.** Vertice defines underutilized as under 50%
   of purchased seats in use [raw/spend--shelfware--vertice-unused-2026.md]. A single-seat
   operator has no seat dimension, only a tier dimension. The archive contains no
   tier-utilization benchmark.
3. **No grace-period or suspension-timeline data.** How long after a failed charge a
   vendor suspends or deletes data is not in any archived source. Take it from the
   capture, or from the vendor's own notice.
4. **No usage-frequency threshold research.** No source in this archive establishes how
   long a paid tool must go unopened before cancellation is justified. The 30, 60, and 90
   day windows the skill uses are operational conventions, not researched thresholds, and
   the skill must present them that way.
5. **Vendor-published data throughout.** Ten of the twelve archived sources are published
   by companies that sell SaaS management, spend control, or dunning tooling. Each has a
   commercial interest in a large waste number. The exceptions are the law firm alert
   [raw/legal--click-to-cancel--jonesday-2026.md] and the practitioner guide
   [raw/negotiation--price-reduction--subspend-2026.md]. No independent academic
   measurement of SaaS waste was located in this sweep.
6. **One stale figure.** The 595% AI traffic growth statistic covers April 2023 to
   January 2024 and is not current [raw/shadow-it--shadow-ai--jumpcloud-2026.md].
