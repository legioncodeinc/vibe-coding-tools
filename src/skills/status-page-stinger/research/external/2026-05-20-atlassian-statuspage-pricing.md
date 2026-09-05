---
source_type: official_docs
authority: high
relevance: high
topic: platform-selection
url: https://www.atlassian.com/software/statuspage
date_accessed: 2026-05-20
---

# Atlassian Statuspage - Pricing, Features, and Ecosystem (2026)

## Key findings

- **Pricing tiers (2026, public pages)**:
  - Free: 100 subscribers, 25 components, 2 team members, 2 metrics, email + Slack + Teams notifications, REST API.
  - Hobby: $29/month - 250 subscribers, 5 team members, 5 metrics, email + Slack + Teams, basic customization, custom domain.
  - Startup: $99/month - 1,000 subscribers, 10 team members, 10 metrics, email/SMS/webhook, Slack, Teams, custom domain, Team member SSO (Atlassian Guard), custom CSS.
  - Business: $399/month - 5,000 subscribers, 25 team members, 25 metrics, all notifications, component subscriptions, RBAC, custom CSS/HTML/JS.
  - Enterprise: $1,499/month - 25,000 subscribers, 50 team members, 50 metrics, all features, yearly PO/invoicing.
- **Private pages** are sold separately (not included in above tiers):
  - Private Starter: $79/month (50 authenticated subscribers).
  - Private Growth: $249/month (300 authenticated subscribers).
  - Private Corporate: $599/month (1,000 authenticated subscribers).
  - Private Enterprise: $1,499/month (5,000 authenticated subscribers).
- **Audience-specific pages** start at $300/month (25 team members, 10 groups, 500 users minimum).
- **SMS available from Startup ($99/month) and above only**. The Hobby plan ($29/month) does NOT include SMS or webhook notifications. Webhook also requires Startup+.
- **No built-in uptime monitoring**: Statuspage is a communication layer only. Teams must use a separate monitoring tool (Datadog, PagerDuty, New Relic, etc.) to detect incidents.
- **PagerDuty integration is the deepest in the market**: Can degrade components on PagerDuty incident trigger; create incidents from templates; support Mustache templating with PagerDuty webhook data; combine multiple PagerDuty incidents into one Statuspage incident; and ignore PagerDuty incidents during active maintenance windows.
- **Email delivery via multiple providers** (Mailgun, SendGrid, Twilio, Plivo) for redundancy - if one provider has an issue, Statuspage switches automatically.
- **Component subscriptions** (allow users to subscribe to specific components) available only on Business ($399/month) and above.
- **150+ third-party components** can be surfaced on your page (e.g., Stripe, Mailgun, Shopify, PagerDuty status) with automatic syncing.
- **Subscriber management**: Rate limiting for SMS subscriptions at 10 per IP per 4 hours (anti-spam). US SMS via short-code with double opt-in (reply YES). Non-US via long-code with link confirmation.
- **SMS behavior limitation**: SMS is only sent on incident/maintenance creation and resolution - NOT on intermediate updates. Email notifications are sent for all updates.

## Quotes / data points

- "Pricing jumps quickly. The Hobby plan starts at $29/month for a single page with 250 subscribers. The Startup plan jumps to $99/month and still caps you at 1,000 subscribers. The Business plan at $499/month [now $399] raises that to 5,000." (InventiveHQ, March 2026)
- "Atlassian Statuspage remains the incumbent for engineering teams already embedded in the Atlassian and PagerDuty ecosystem. The PagerDuty integration is the deepest documented integration in this review." (AugmentCode, May 2026)
- "SMS requires a paid Statuspage plan. The Hobby tier at $29/mo includes email, Slack, and Microsoft Teams notifications, but not SMS or webhook notifications." (AugmentCode, May 2026)
- "The most common reasons teams leave Statuspage are: cost (pricing scales steeply with subscribers), lack of built-in monitoring..." (APIStatusCheck, April 2026)
- "Atlassian acquired StatusPage.io in 2016 for $125M. Since then, many users feel the product has been under-invested relative to its pricing." (APIStatusCheck, April 2026)
- Statuspage free tier: "100 subscribers, 25 components" - the lowest free tier subscriber count among the major platforms.

## Open questions surfaced

- Is the Atlassian Guard SSO requirement for team member SSO on Statuspage an additional cost beyond the Statuspage subscription?
- The pricing page shows both "old" and "new" pricing structures - has Statuspage recently repriced? The Business plan appears at $399/month in official docs but $399/month in some sources and $499/month in others.
- How does the post-mortem linking feature work in the Statuspage API - is there a dedicated `postmortem_body` field in incident records?
