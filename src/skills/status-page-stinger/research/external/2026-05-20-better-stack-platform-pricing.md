---
source_type: official_docs
authority: high
relevance: high
topic: platform-selection
url: https://betterstack.com/pricing
date_accessed: 2026-05-20
---

# Better Stack Status Pages - Pricing and Features (2026)

## Key findings

- **Free tier** includes 1 status page, 10 monitors (3-min check intervals), email + Slack alerts, and 1,000 subscribers. No credit card required. This is the most generous free tier in the market for status pages as of 2026.
- **Paid status page add-ons** stack on top of the base responder subscription ($29/month per responder on annual billing):
  - Additional public status page: $12/month (annual)
  - Custom CSS/JS: $15/page/month (annual)
  - White-label: $208/page/month (annual)
  - Password authentication: $42/page/month (annual)
  - IP allowlisting: $208/page/month (annual)
  - Single Sign-On: $208/page/month (annual)
  - Custom email domain: $208/page/month (annual)
  - Additional 1,000 subscribers: $40/month
- **Enterprise-level features compound quickly**: white-label + SSO + IP allowlisting = $624/page/month before custom email domain. Total cost for a fully-featured private enterprise page can exceed $800/month in add-ons alone.
- **Built-in monitoring is a key differentiator**: Better Stack's status pages are directly connected to uptime monitoring, incident management, on-call scheduling, and the full observability stack (logs, metrics, traces). When a monitor detects downtime, the status page updates automatically.
- **Subscriber notifications**: Email, SMS, Slack, webhook. SMS is included via responder subscription (unlimited phone/SMS per responder). Voice calls and Discord/Telegram are NOT supported natively.
- **Terraform provider available**: Status pages can be managed as infrastructure-as-code.
- **SMS via short-code** (US); non-US via long-code. 1,000 subscribers included, overage at $40/1,000/month.
- **Integration depth with observability stack**: Datadog, New Relic, Prometheus, Grafana, Zabbix, AWS, GCP for monitoring; Jira, Trello, Asana for ticketing; Zendesk, Front, Intercom for customer service bridge.

## Quotes / data points

- "1 status page included" in all paid plans; additional public pages at $15/month ($12/month annual).
- Better Stack 3-year TCO for 5-person on-call + 50 monitors + 1 status page (status/monitoring/incident only, no full observability): ~$6,858.
- Instatus equivalent 3-year TCO for same configuration: ~$540 (flat-rate Pro plan).
- Better Stack pricing model: "volume-based + per responder" vs Instatus "flat rate, no per-member fees."
- Free tier comparison (from Better Stack's own comparison): Better Stack (10 monitors, 1 status page) vs Instatus (15 monitors, 200 subscribers): Instatus has a slightly more generous free status page tier.

## Open questions surfaced

- Does the 60-day money-back guarantee apply to status-page add-on charges or only the base subscription?
- Is the $40/1,000 overage subscriber charge applied monthly regardless of whether subscribers were active or inactive during the billing period?
- Does the Better Stack Terraform provider support all status-page add-on configuration or only core page settings?
