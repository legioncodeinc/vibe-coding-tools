---
title: "Mercado Pago renewals fail after a successful first payment"
url: "https://www.reddit.com/r/gohighlevel/comments/1v2qbn9/ghl_mercado_pago_recurring_subscription_payments/"
fetched: "2026-09-04"
source_type: "community"
visible_age: "19d"
window_role: "ranked-in-window"
clusters:
  - "billing-payments"
  - "api-integrations"
repeat_group: "subscription-renewal"
normalized_issue_count: 3
---

## Captured signal

Recurring charges failed for several Brazilian customers even though their cards worked elsewhere. Some could pay manually through an invoice link.

## Normalized issue candidates

- Mercado Pago recurring charges can fail after the initial GHL subscription payment succeeds.
- GHL does not expose a clear renewal decline code or root cause.
- Manual invoice payment may work while automatic renewal continues to fail.

## Caution

Community report. Any suggested workaround is unverified and must be checked against current provider documentation before reuse.

