# Guide 03: Subscriber Notifications

*Source: `research/external/2026-05-20-subscriber-notifications-channels.md`, `research/external/2026-05-20-gdpr-canspam-compliance.md`*

---

## Channel overview by platform

| Channel | Statuspage | Better Stack | Instatus |
|---|---|---|---|
| Email | Yes (included) | Yes (included) | Yes (included) |
| SMS | Yes (included, internal; CREATE + RESOLVE only) | Yes ($29/mo per responder, unlimited) | Yes (BYOC: Twilio/Vonage/SNS) |
| Webhook | Yes | Yes | Yes |
| Slack | Yes | Yes | Yes |
| Discord | No | No | Yes |
| Microsoft Teams | No | No | Yes |
| WhatsApp | No | No | Yes (Business plan) |
| RSS/Atom | Yes | Yes | Yes |
| Voice call | No | No | Yes (Business plan) |

---

## Email notifications

Email is the default subscription channel and the most reliable delivery method. Every platform handles email internally: no external configuration needed.

**What to configure:**
- Custom "From" domain: Always set up a custom sender domain (e.g., `status@yourdomain.com`). Platform-default sender addresses lower deliverability and reduce brand recognition. All four major platforms support custom sender domains.
- Notification frequency: Some platforms (Instatus, Better Stack) let subscribers set their own notification frequency preferences. Enable this to reduce unsubscribe rates.

**Deliverability baseline:** All four major platforms use Mailgun, SendGrid, or Postmark under the hood with dedicated IP pools for status page notifications. Deliverability is generally high. Custom domain configuration remains a best practice regardless.

---

## SMS notifications

### Statuspage SMS
- SMS is included in paid plans (not free tier)
- Handled internally via Mailgun/Twilio/Plivo multi-provider redundancy
- **Critical limitation:** SMS only fires on incident CREATE and incident RESOLVE. No SMS fires on intermediate status updates. Teams that need SMS for update acknowledgment must use webhooks + their own SMS sender.
- No per-message cost above the subscription tier

### Better Stack SMS
- Included at $29/month per responder (not per-message)
- SMS fires on all incident updates, not just create/resolve
- Best model for high-update-frequency incidents

### Instatus SMS (BYOC)
- User must supply their own Twilio, Vonage, or Amazon SNS account credentials
- **Compliance responsibility:** When using BYOC, the team owns all carrier compliance:
  - A2P 10DLC registration (US): required before sending bulk business SMS
  - STOP keyword handling: must respond to STOP with an unsubscribe confirmation
  - Quiet hours rules per-carrier
  - DLT registration (India, if applicable)
- See `research/external/2026-05-20-gdpr-canspam-compliance.md` for the full compliance checklist

---

## Webhook notifications

Webhooks deliver incident updates as JSON payloads to a URL you specify. Use cases:
- Posting incident updates to an internal Slack channel
- Triggering custom automation (PagerDuty incident creation, Jira ticket update)
- Feeding a custom notification pipeline (e.g., internal mobile push notifications)

**Webhook best practices:**
- Always verify the payload signature. All three major platforms include an HMAC signature header.
- Return `200` quickly: offload processing to a queue. Most platforms retry up to 3 times on non-200 responses.
- Log every webhook payload for debugging; status page incident webhooks are not re-deliverable on all platforms.

**Payload shape (Statuspage example):**
```json
{
  "page": { "id": "...", "status_description": "..." },
  "incident": { "id": "...", "status": "investigating", "body": "...", "updated_at": "..." },
  "component_update": null
}
```

---

## GDPR and CAN-SPAM compliance

> These are legal requirements, not optional best practices.

### GDPR (EU) requirements
- **Lawful basis:** Subscribers must actively opt in to notifications. Pre-checked boxes do not constitute consent.
- **Double opt-in:** Recommended (not legally required by GDPR, but reduces abuse and demonstrates consent intent). All major platforms support double opt-in.
- **Right to erasure:** When a subscriber requests deletion, their email and phone must be removed from the platform. All four major platforms provide subscriber management APIs for this.
- **Data processor agreement:** When using Statuspage, Better Stack, or Instatus, the platform acts as a data processor. Verify their DPA (Data Processing Agreement) is signed, especially for Business/Enterprise tiers.
- **Platform migration:** If migrating platforms, you cannot automatically transfer subscriber consent. You must run a re-opt-in campaign. Importing the old subscriber list and sending from the new platform without fresh consent violates GDPR.

### CAN-SPAM (US) requirements
- **Unsubscribe mechanism:** Every notification email must include a visible, functional unsubscribe link.
- **10-day opt-out processing:** Unsubscribe requests must be honored within 10 business days.
- **Physical mailing address:** Your organization's physical mailing address must appear in the email footer. All major platforms include this field in their email template configuration.
- **No deceptive subject lines:** Subject lines for incident notifications must accurately reflect the content.

### One-click unsubscribe (2024+ requirement)
Google and Yahoo's bulk sender requirements (enforced from February 2024) require one-click `List-Unsubscribe` headers for bulk senders over 5,000 messages/day. If your subscriber list is large, verify your platform includes this header in all outgoing notifications. Statuspage and Better Stack do; verify with Instatus for BYOC email configurations.

---

## Subscription management setup checklist

Before going live with subscriber notifications:

- [ ] Custom sender domain configured and DKIM/SPF records verified
- [ ] Double opt-in workflow tested (subscribe, receive confirmation email, click confirm link)
- [ ] Unsubscribe flow tested end to end
- [ ] Subscriber data included in your GDPR/privacy policy
- [ ] DPA signed with the platform provider (if EU-based users)
- [ ] SMS compliance verified if SMS is enabled (A2P 10DLC for US, carrier-specific for EU/UK)
- [ ] STOP keyword response tested (for SMS channels)
- [ ] Webhook signature verification implemented (if using webhooks)

*See `examples/happy-path-setup.md` for a worked subscriber configuration alongside a full Instatus setup.*
