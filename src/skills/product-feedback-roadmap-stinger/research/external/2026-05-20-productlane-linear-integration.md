---
source_url: https://productlane.com/docs/integrations/linear
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: integrations-crm
stinger: product-feedback-roadmap-stinger
---

# Productlane: Linear Integration (Official Docs)

## Summary
Official documentation for Productlane's core Linear integration - described as "at the core of Productlane." Covers two-way sync of issues, projects, customers, and customer requests. Confirms the key claim in the Command Brief that Productlane's roadmap automatically mirrors Linear projects and that changelog drafts are auto-generated when a project completes in Linear.

## Key quotations / statistics
- **Positioning:** "The Linear integration is at the core of Productlane. It keeps everything in sync, so your support, requests, and changelog always reflect what's actually happening in Linear."
- **What gets synced (two-way):**
  - Linear issues and projects → always up to date in Productlane
  - Customers → synced two-way
  - Customer requests → auto-created from users
  - Public roadmap → automatically mirrors Linear projects
  - Changelog drafts → instantly generated when you complete a project in Linear
- **Setup:** Connect via Linear account (Admin rights recommended for full functionality). Select which Linear teams are visible in Productlane.
- **Customer Requests integration (Dec 2024 changelog):** "Linear's latest launch of customer requests allows you to display customers and their feedback from Productlane directly in Linear, making the feedback way more impactful and visible for your product team."
- **Bi-directional Linear Customer sync:** Linear supports customer properties like stage, tier, or revenue. Productlane natively integrates these - edit and create from within thread and company view.
- **Public roadmap importance button:** After upvoting a feature, users are asked if this feature should be marked as important - requires context text, which appears as an "important request" in Linear.
- The combination of Linear + Productlane is described as producing "significantly more impact on your actual roadmap, compared to using any separate tool for your feature requests."

## Annotations for stinger-forge
- **Primary source for `guides/06-integration-wiring.md`** Productlane + Linear section.
- The "auto-generated changelog drafts when Linear project completes" feature is a key selling point - closes the loop automatically without manual work.
- The public roadmap mirroring Linear projects means Productlane's roadmap is not a separate artifact to maintain - it IS Linear's project list.
- The importance button (post-upvote context required) is a deduplication and signal-quality mechanism - important votes require users to write context.
- Productboard importer and CSV upload are migration paths that should be noted in the integration guide for teams switching from Productboard.
