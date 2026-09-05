---
source_type: official_docs
authority: high
relevance: high
topic: subscriber-notifications
url: https://support.atlassian.com/statuspage/docs/enable-subscribers
date_accessed: 2026-05-20
---

# Subscriber Notification Channels - Setup, Behavior, and Architecture (2026)

## Key findings

- **Email is the universal baseline**: All major platforms (Statuspage, Better Stack, Instatus, Cachet) support email subscriber notifications. Email uses confirmed double opt-in on all SaaS platforms - subscriber must click a confirmation link (Statuspage: expires after 90 days).

- **SMS delivery architecture varies significantly by platform**:
  - **Statuspage**: SMS handled internally via Mailgun, SendGrid, Twilio, and Plivo for redundancy. US subscribers via SMS short-code with double opt-in (reply YES). Non-US via long-code with link confirmation. SMS only fires on incident CREATE and RESOLVE - not intermediate updates. Rate limit: 10 SMS subscriptions per IP per 4 hours (anti-spam).
  - **Better Stack**: SMS included with responder subscription ($29/month per responder, unlimited SMS). No separate SMS billing per message.
  - **Instatus**: BYOC (bring your own carrier) model. User must connect Twilio, Esendex, Vonage, MessageBird, or AWS SNS with their own account credentials. Pro plan and above only.
  - **Cachet**: Email only for subscriber notifications (v2.x). Webhooks added in v3 January 2025 update, but subscriber SMS not yet implemented in v3.

- **Webhook notifications**: All major SaaS platforms support webhook subscribers. Statuspage webhooks are HTTP POST requests requiring 2xx response within 30 seconds (3xx counts as failure). Webhooks fire on component status changes AND incident updates. Payload includes unsubscribe URL, page metadata, and full incident/component state.

- **Slack integration is separate from webhook**: Slack-specific subscription flows exist on Statuspage and Better Stack. Statuspage explicitly notes: "Slack webhooks are not supported. You can use Slack subscriptions instead."

- **Component-level subscriptions** (allow users to subscribe to specific services only, reducing notification fatigue):
  - Statuspage: Available on Business ($399/month) and above only.
  - Instatus: Available at all paid tiers (`components` array in subscriber API).
  - Better Stack: Supported.

- **Unsubscribe mechanisms**:
  - Email: unsubscribe link in footer of every notification (required by CAN-SPAM and GDPR).
  - SMS: reply STOP (note: some international carriers don't support STOP - Statuspage requires admin unsubscription for those numbers).
  - Webhook: management link sent to provided email address.

- **Bulk import of subscribers**: Statuspage, Better Stack, and Instatus Pro all support CSV import. Instatus's API allows `autoConfirm: true` on paid plans to bypass confirmation emails for programmatically added subscribers.

- **Per-component vs. whole-page subscriptions**: Allowing users to subscribe to only the components they care about is critical for reducing alert fatigue. Without per-component subscriptions, a user monitoring only the API gets notified about CDN issues irrelevant to them.

## Quotes / data points

- Atlassian on multi-provider email delivery: "We've taken the time to integrate with multiple email and SMS providers including Mailgun, Sendgrid, Twilio, and Plivo to ensure high deliverability for your notifications. If one of our service providers ever has an issue, we can easily use a separate provider."
- "SMS notifications are only sent when: An incident/maintenance is created; When an incident/maintenance is resolved; When a maintenance begins. 'Updates' to an incident or maintenance do NOT trigger SMS notifications." (Atlassian official docs)
- Instatus SMS help: "Select either Twilio, Esendex, Vonage, MessageBird or SNS as your service" - requires user's own account credentials.
- Better Stack comparison on Instatus subscriber channels: "Email, SMS, voice, Slack, Discord, Teams, WhatsApp, RSS" - broadest in market.

## Open questions surfaced

- For Instatus BYOC SMS: does Twilio's A2P 10DLC registration requirement (for US business messaging) fall on the Instatus user, or does Instatus handle carrier compliance on behalf of users?
- Is there a documented maximum subscriber count for Statuspage's internal SMS delivery infrastructure before they throttle delivery speed?
- Does Better Stack's webhook subscriber model support per-component subscriptions or only whole-page subscriptions?
