---
source_url: https://newsletter.supply/blog/substack-to-beehiiv-migration-checklist
title: "How to Migrate From Substack to Beehiiv: A Step-by-Step Checklist"
source_type: blog
authority: practitioner
relevance: critical
topic: migration
stinger: newsletter-platform-stinger
fetched: 2026-05-20
---

# Substack to Beehiiv Migration: Step-by-Step Checklist (2026)

## Summary

Detailed migration guide from newsletter.supply covering the complete Substack-to-Beehiiv migration flow. Covers content import, subscriber CSV migration, paid Stripe subscription transfer, and the critical ordering of operations to avoid subscriber double-billing.

## Key quotations / statistics

- "Create your Beehiiv template before importing posts, because imported styling is much easier to fix before the migration than after it."
- "If you have paid content or a mix of free and paid content, you will need your Substack export file." (the zip must stay zipped; Safari auto-unzips by default)
- Recommended Beehiiv subscriber CSV fields: `name`, `start date`, `subscriber country`, `subscription source (free)`, `activity`
- "I would also add a tag to this whole import, such as `substack-migration-2026`"
- For paid subscribers: "Connect Stripe to Beehiiv. Create paid tiers in Beehiiv that mirror your Substack tiers. Keep the same currency wherever possible."
- "Pause Substack billing so subscribers are not charged twice."

## Migration checklist (ordered)

1. Open Beehiiv account, create publication
2. Set default post template in Beehiiv
3. Decide: free content only, paid only, or both
4. Export Substack archive (if paid/mixed content)
5. Export Substack subscriber CSV
6. Clean subscriber CSV before importing
7. Import free and/or paid content into Beehiiv
8. Import free subscribers into Beehiiv
9. If paid subscribers: create matching paid tiers in Beehiiv
10. Copy customer payment data through Stripe, complete paid subscriber mapping
11. Pause Substack billing (CRITICAL - avoid double billing)
12. Check imported posts, paywalls, subscriber counts, tags, custom fields, test sends
13. Send a short migration note to readers

## Gotchas from TierGauge (tiergauge.com, April 2026)

- "Substack export gives email + name only. Tier (free/paid) and signup date don't carry over cleanly."
- "Active paid subscribers re-subscribe through beehiiv's Stripe; communicate the cutover date with a clear deadline."
- "For a list under 10,000 subscribers, a clean migration is one focused week: domain setup and verification, list import, automation rebuild, test broadcast, announcement, cutover."
- "The constraint is rarely the import itself; it's the deliverability warm-up and the time to rebuild flows you actually depend on."
- "Send your last broadcast from Substack announcing the new sender domain and what to expect. Cut over DNS and sending from beehiiv on the same day, not staggered. A dual-send week creates more confusion than it prevents."

## Annotations for stinger-forge

- This source is the backbone for `guides/04-migration.md`.
- The ordered checklist maps directly to a migration plan document.
- The Stripe paid subscriber migration is the most complex step - requires: (a) create matching tiers, (b) copy Stripe customers, (c) map Substack products to Beehiiv tiers, (d) pause Substack billing.
- The domain warmup gotcha is critical: "Provision beehiiv, Set sender identity, and verify your sending domain (DKIM, SPF, DMARC). Do this before importing the list; sending from an unverified domain is the single fastest way to land in spam at the moment of cutover."
- Beehiiv's content import tool supports: Substack, WordPress, Ghost, and Mailchimp (as of 2026).
