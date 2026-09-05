---
url: https://plain.support.site/article/slas-service-level-agreements
title: "SLAs | Plain Help Center"
source_type: official-docs
authority: official
relevance: high
fetched: 2026-05-20
topic: sla-tracking
---

# SLA Tracking in Plain, Intercom, and Help Scout (Cross-Platform Summary)

## Summary

Web search retrieved authoritative docs from Plain, Intercom, and Help Scout for SLA configuration. This file synthesizes the three official sources into a cross-platform comparison for stinger-forge.

---

### Plain SLA Configuration (plain.support.site)

Plain supports SLA tracking on Horizon plans and above ($269/mo base). Key capabilities:

- **SLA types:** First Response Time and Next Response Time
- **Warning thresholds:** Proactive alerts fire before breach (e.g., 30 minutes before breach trigger)
- **Notification channels:** Workspace notifications, email, or webhook
- **Priority-based SLAs:** Different response time targets per customer tier or priority level
- **Business hours:** Configurable -- SLA timer pauses outside defined working hours
- **Tier-based routing:** SLAs can be mapped to customer segment / support tier

**Critical limitation:** Plain's SLA feature is gated behind the Horizon plan ($269/mo base + $89/seat). On the Foundation plan ($35/seat), SLAs are not available. Teams that need SLA tracking from day one should either start on Horizon or evaluate Pylon or Intercom.

---

### Intercom SLA Configuration (intercom.com/help)

Intercom offers SLA tracking through its Workflows builder (Advanced and Expert plans only). Key capabilities:

- **SLA types:** First Response Time and Time to Resolution targets
- **Conditional logic:** Faster SLAs applied to priority customers via conditional branching in Workflows
- **Reporting dashboard:** Comprehensive -- metrics include conversation SLA miss rate, count of conversations with missed SLAs, SLA performance over time visualization
- **Custom reports:** Available on Advanced+ -- build custom SLA charts

**Availability note:** SLA management is in the Advanced plan ($85/seat) and above. Essential plan ($29/seat) does not include SLA management.

---

### Help Scout SLA Configuration (docs.helpscout.com)

Help Scout offers SLA policies on Pro plans ($75/mo unlimited users). Key capabilities:

- **SLA types:** First Response Time and Time to Resolution targets
- **Time measurement:** Calendar hours or office hours (configurable)
- **Policy count:** Unlimited SLA policies on Pro
- **Conditions:** Rules can be based on company, customer properties, and custom fields
- **Reporting:** Time-to-reply reporting capability

**Availability note:** SLA policies appear to require the Plus or Pro plan; Standard plan (entry $50/mo) may not include SLA tracking -- confirm at helpscout.com.

---

## Cross-Platform SLA Comparison

| Feature | Plain | Intercom | Help Scout |
|---|---|---|---|
| Available on entry plan | No (Horizon+, $269/mo) | No (Advanced+, $85/seat) | No (Pro, $75/mo) |
| First Response Time | Yes | Yes | Yes |
| Time to Resolution | Via webhooks | Yes (Workflows) | Yes |
| Breach warning alerts | Yes (pre-breach threshold) | Via Workflows | Limited |
| Webhook/API alerts | Yes | Via Workflows | No |
| Business hours pause | Yes | Via Workflows | Yes (office hours) |
| Priority-based SLAs | Yes | Yes (Workflows conditional) | Yes (conditions) |
| Reporting dashboard | Basic | Comprehensive | Time-to-reply reports |

## Key takeaways

- No major support tool includes SLA tracking on its lowest-tier entry plan -- teams expecting SLA tracking from day one should budget for mid-tier plans
- Plain's webhook-based breach alerts are the most developer-friendly for custom escalation automation
- Intercom has the most comprehensive SLA reporting dashboard for operations teams
- Help Scout's unlimited SLA policies at Pro tier are competitive for multi-tier support operations
- For the founder-as-support phase (small team, no dedicated ops), SLA alerting via webhook to a Slack channel is the minimal viable implementation
