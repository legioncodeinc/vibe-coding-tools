---
source_url: https://api.slack.com/slack-marketplace/guidelines
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: app-directory-distribution
stinger: slack-app-stinger
---

# Slack Marketplace App Guidelines and Requirements | Slack Developer Docs

## Summary

The official Slack Marketplace guidelines define eligibility requirements, prohibited app behaviors, listing content standards, technical verification criteria, and the review process. As of December 2024, a policy update made explicit that apps intended for commercial distribution at scale must go through Marketplace review, and that using Slack data to train LLMs is prohibited. The review process is functional (not a full code review) but may include penetration testing at Slack's discretion.

## Eligibility requirements

- **Minimum installation threshold:** Installed on at least 5 active workspaces (used in past 28 days).
- **Functional Slack integration:** Must include actual Slack functionality: Sign in with Slack alone is insufficient.
- **Fully tested:** Cannot be in private beta or still in development.
- **Appropriate scopes:** Must use only necessary OAuth scopes; legacy and excessive-access scopes are blocked.

## Prohibited scopes (for Marketplace listing)

`admin.*`, `identity.*`, `search:read`, `workflow.steps:execute`, `triggers:*`

## Categories of apps Slack will NOT accept

- Export/backup of messages or replication of Slack client functionality.
- Financial transactions, cryptocurrency, or NFT handling.
- Destructive actions: bulk message deletion, self-destructing messages.
- Using Slack data to train LLMs (explicitly prohibited as of December 2024 policy update).
- Sharing sensitive personal information.
- Remote code execution.
- Circumventing Slack's product restrictions.
- **Policy clarification (Dec 2024):** Listing in Marketplace while also offering a parallel unlisted/custom version to the same customers that violates Marketplace guidelines is prohibited.

## Listing requirements

- App name: no "Slack" or "Slackbot" references; no trademark infringement.
- Icon: 512px minimum, high quality.
- Short description: 10 words or less.
- "Add to Slack" button on installation page.
- Active customer support link and email.
- Privacy policy URL.

## Review process

The Slack Marketplace team conducts:
- Functionality testing (app works as described).
- TLS verification and request signing verification.
- Testing of all endpoints and user experience flows.
- Data access permission review.
- Listing information and documentation accuracy check.
- **Not a full code review**; penetration testing may occur at Slack's discretion.

## Annotations for stinger-forge

- Maps directly to `guides/06-app-directory.md`.
- The December 2024 LLM data-use prohibition is a brand-new policy constraint that stinger-forge must highlight prominently: many AI-powered Slack apps could inadvertently violate this.
- The "5 active workspaces" threshold is the most common reason apps are rejected prematurely: stinger-forge should include this as a pre-submission checklist item.
- Socket Mode apps (`socket_mode_enabled: true` in manifest) cannot be listed in the Marketplace. Stinger-forge must link this to `guides/00-setup-and-bolt.md` where socket mode is configured.
- Slack does not publish explicit revenue share percentages for paid Marketplace listings in public documentation: stinger-forge should note this gap and direct developers to contact Slack's developer relations team for monetization terms.
- Cross-reference: `external/2026-05-20-dev-policy-update.md` for the December 2024 policy change details.
