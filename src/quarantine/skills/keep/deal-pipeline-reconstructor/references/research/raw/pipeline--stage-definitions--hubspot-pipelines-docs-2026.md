# Set up and manage object pipelines (HubSpot Knowledge Base)

- **Title:** Set up and manage object pipelines
- **URL:** https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines
- **Fetched:** 2026-08-17
- **Source type:** official-docs (HubSpot, product documentation)
- **Page last updated (as stated on page):** August 12, 2026

## Why this source

The single most widely deployed default pipeline shape in the SMB market. It supplies a
named stage ladder and, unusually, a published win probability per stage. That gives the
skill a defensible default board layout and a caution about weighted-amount math.

## Extracted content

**Default Sales Pipeline stages, with the win probability HubSpot ships for each:**

| Stage | Default probability |
|---|---|
| Appointment scheduled | 20% |
| Qualified to buy | 40% |
| Presentation scheduled | 60% |
| Decision maker bought-in | 80% |
| Contract sent | 90% |
| Closed won | 100% (Won) |
| Closed lost | 0% (Lost) |

**On stage probability, quoted:**

"each stage has an associated probability that indicates the likelihood of closing deals
in that stage"

"Stage probability is used to determine the weighted amount shown in board view, which is
calculated by multiplying the total amount in each stage by the stage probability."

**On the Won and Lost tail, quoted:**

"for deals, to ensure all sales reports, custom deal or revenue reports, and sales
analytics tools process your deals correctly, you must include stages for both Won and
Lost under Deal probability."

## What this source does NOT say

The page does not state what specifically moves a deal from one stage to the next. There
are no exit criteria in the official documentation. The stage names are the entire
definition. This absence is itself a finding: the market-leading SMB CRM ships stage
labels without ever defining them.

## Claims this source supports

1. A default six-plus-tail stage ladder exists and is widely deployed, with names that
   are activity-shaped ("appointment scheduled", "contract sent") rather than
   outcome-shaped.
2. Stage-to-probability mapping in mainstream CRM is a fixed lookup table, not a fitted
   model, and it is used directly to compute weighted pipeline value.
3. A Won and Lost tail is a required part of a board, not an optional extra.
4. Official CRM documentation supplies stage NAMES but not stage ENTRY or EXIT criteria.
