---
source_type: official_docs
authority: high
relevance: high
topic: platform-selection
url: https://instatus.com/pricing
date_accessed: 2026-05-20
---

# Instatus - Pricing, Features, and SMS Architecture (2026)

## Key findings

- **Pricing tiers (2026, monthly billing)**:
  - Starter (Free): 15 monitors, 2-min checks, email alerts, 5 team members, 2 on-call members, 200 subscribers, public page only, no custom domain.
  - Pro ($20/month monthly, $15/month annual): 50 monitors, 30-sec checks, email + SMS alerts, 50 team members, 20 on-call members, 5,000 subscribers, 1 custom domain, public page.
  - Business ($300/month monthly, $225/month annual): 1,000 monitors, 30-sec checks, SMS + calls, unlimited team members, 50 on-call members, SAML SSO, all page types (public/private/audience-specific), 3+ custom domains, 25,000 subscribers, SCIM, priority support, 99.99% SLA.
  - Enterprise: Custom pricing, multiple SSO connections, custom contracts.
- **No per-member pricing at any tier** - this is Instatus's most significant competitive differentiator. A 50-person team pays the same as a 5-person team.
- **SMS notifications are NOT natively integrated**: Instatus routes SMS through user-provided accounts with supported providers: Twilio, Esendex, Vonage, MessageBird, or AWS SNS. Users must supply their own API credentials. This is a critical distinction from Better Stack and Statuspage which handle SMS delivery internally.
- **Page speed architecture is Jamstack (static site via CDN)**: Pages load significantly faster than hosted alternatives and remain available even during infrastructure outages affecting the monitored services.
- **Subscriber notification channels**: Email, SMS (via BYOC providers above), voice calls (Business+), Slack, Discord, Microsoft Teams, WhatsApp, RSS/Atom feeds, webhooks. This is the broadest channel coverage in the market.
- **30+ built-in languages** for status page localization - no manual translation work required. Unique differentiator vs Better Stack (custom translations only).
- **API for subscriber management**: `POST /v1/:page_id/subscribers` with `autoConfirm: true` (paid feature) to bypass email confirmation; per-component subscriptions supported.
- **Non-profit/open-source discount**: Free Pro account available on request via email.
- **3-month free when paying annually** (25% off effectively).

## Quotes / data points

- Instatus Pro ($15/month): "50 monitors with 30-second check intervals, email and SMS alerts, up to 25 team members, and additional monitoring and status page features."
- Business ($225/month): "1,000 monitors, 50 on-call members, 25,000 subscribers, SAML SSO, all status page types."
- "Flat, predictable pricing that doesn't increase per seat or subscriber as your team scales."
- From Better Stack comparison: Instatus subscriber notification channels include "Email, SMS, voice, Slack, Discord, Teams, WhatsApp, RSS" while Better Stack offers "Email, SMS, Slack, webhook."
- Instatus page load architecture: "Jamstack (static, CDN, faster cold loads)" vs Better Stack "CDN-backed hosting."

## Open questions surfaced

- Does Instatus's SMS routing via BYOC providers (Twilio, Vonage, etc.) mean the user is responsible for Twilio A2P 10DLC registration and carrier compliance independently of Instatus?
- What is the exact pricing jump between Pro private pages ($50/month from comparison data) and Business to access audience-specific pages?
- The Better Stack comparison cited Instatus Pro at $15/month and Business at $225/month, but the Instatus pricing page shows different monthly billing rates. Which is the annual vs monthly figure?
