---
source_url: https://support.google.com/a/answer/14229414
title: "Email sender guidelines FAQ - Google Workspace Admin Help"
source_type: official-docs
authority: official
relevance: critical
fetched_date: 2026-05-20
topics: [deliverability, google-bulk-sender, dmarc, spf, dkim, spam-rate, unsubscribe]
stinger: cold-outreach-stinger
---

# Email Sender Guidelines FAQ - Google Workspace Admin Help

## Summary

Official Google documentation confirming the February 2024 bulk sender requirements. This is the authoritative source for the rules that now govern cold email delivery to Gmail accounts. Key definitions and enforcement behaviors confirmed by Google directly.

A bulk sender is defined as "any email sender that sends close to 5,000 messages or more to personal Gmail accounts within a 24-hour period. Messages sent from the same primary domain count toward the 5,000 limit."

The enforcement table maps non-compliance to consequences:
- From: header and authentication don't align -> Temporary or Permanent Failure codes, or spam foldering
- Messages not authenticated with both SPF and DKIM -> Temporary or Permanent Failure codes, or spam foldering
- Spam rate greater than 0.3% -> Delivery support or mitigations unavailable
- DMARC record missing (minimum p=none) -> Delivery support or mitigations unavailable
- Marketing/promotional messages missing one-click unsubscribe -> Delivery support or mitigations unavailable
- Unsubscribe requests not honored within 48 hours -> Delivery support or mitigations unavailable

Spam rate calculation confirmed: "Spam rate is calculated daily. To help ensure messages are delivered as expected, senders should keep their spam rate below 0.1%." Google explicitly states the 0.3% threshold is when enforcement begins, not the safe target.

Mitigation (support) is unavailable for senders not meeting requirements: "Starting in February 2024, we won't provide mitigation for email delivery issues to senders that don't meet the guidelines."

## Key quotations / statistics

- "A bulk sender is any email sender that sends close to 5,000 messages or more to personal Gmail accounts within a 24-hour period."
- "Senders should keep their spam rate below 0.1% and should prevent spam rates from ever reaching 0.3% or higher."
- "Beginning June 2024, bulk senders with a user-reported spam rate greater than 0.3% will be ineligible for mitigation."
- "Unsubscribe requests must be honored within 48 hours."
- Unsubscribe header requirements: "To comply with the sender guidelines, keep your user-reported spam rate below 0.1% and prevent it from reaching 0.3% or higher."

## Annotations for stinger-forge

- This is the cite-primary source for the Google bulk sender rules in `guides/02-infrastructure-and-deliverability.md`. Always link to this URL in the published stinger.
- The 48-hour unsubscribe processing requirement should be in the deliverability checklist.
- The "5,000 messages from the same primary domain" threshold is why separate sending domains are non-negotiable - the main company domain should never be used for cold outreach.
- The "support unavailable" consequence is a strong motivator: non-compliant senders cannot get Google's help to fix deliverability problems.
- Cross-reference with litemail.ai source for the recommended p=quarantine threshold beyond the minimum p=none.
