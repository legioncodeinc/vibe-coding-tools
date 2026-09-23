---
example: b2c-intercom-fin
scenario: B2C consumer SaaS (10K MAU, 5K conversations/month, 2 support agents)
stinger: customer-support-tooling-stinger
guides_demonstrated:
  - guides/01-tool-selection.md
  - guides/03-ai-deflection.md
  - guides/04-sla-design.md
---

# Worked Example — B2C Product with Intercom + Fin 2.0

## Scenario

A B2C consumer SaaS app with 10K monthly active users, 5K support conversations/month, 2 support agents, and a growing knowledge base of 60 published help articles. They want to reduce agent load through AI deflection.

## Tool selection (applying `guides/01-tool-selection.md`)

**Decision tree path:**
1. Primary channel: In-app chat → Q3 (volume)
2. Volume: 5K conversations/month → Intercom or Front
3. AI deflection priority: Yes, autonomous → Intercom + Fin 2.0 (KB has > 20 articles)

**Recommended:** Intercom Starter ($74/agent/month × 2 agents) + Fin 2.0 outcome pricing

**Cost model at 67% deflection:**
- 5K conversations/month × 67% deflection = 3,350 Fin-resolved conversations
- Fin cost: 3,350 × $0.99 = $3,317/month
- Intercom seats: 2 × $74 = $148/month
- **Total: $3,465/month**

**Alternative without Fin:**
- 2 agents × 5K conversations = 2,500 conversations/agent/month = ~125/day → unsustainable.
- Hiring a 3rd agent: $4-6K/month fully loaded.
- **Fin ROI: Positive.** Cost of Fin ($3,317) < cost of 3rd agent ($4K+).

## Fin 2.0 configuration (applying `guides/03-ai-deflection.md`)

**Pre-condition checklist:**
- [x] KB has 60 published articles (>= 20 threshold passed)
- [x] Top 10 most-asked questions covered (verified against 90-day `how-to` tag analysis)
- [x] Topics scope list defined (Fin will NOT answer billing or account-access questions — routes to human)
- [x] Escalation trigger set at 70% confidence threshold
- [x] 2 human agents available during business hours for escalations
- [x] Budget approved: ~$3,500/month Fin estimate

**Fin Topics configured:**
- IN scope: How-to questions, feature explanations, troubleshooting (from help articles)
- OUT of scope: Billing disputes, account access issues, refund requests

**Escalation message to customer:**
> "I've connected you with a member of our team who can help with this directly."

**Escalation context to agent:** Conversation summary, list of Help Center articles Fin attempted, customer sentiment ("frustrated" / "neutral" / "satisfied").

**Test mode plan:** Run Fin in "Suggestions only" for 2 weeks. Review Fin's suggested responses daily. Correct 5 articles that produced inaccurate suggestions. Enable autonomous mode in week 3.

## SLA configuration (applying `guides/04-sla-design.md`)

B2C two-tier SLA (simpler than B2B three-tier):

| Tier | Trigger | First-response | Resolution |
|---|---|---|---|
| P1 | Can't log in, data loss | 15 min | 4 hours |
| P2 | Feature broken, general | 4 hours (biz hours) | 2 business days |

**CSAT:** Intercom auto-sends 1-question CSAT survey on conversation close. Review weekly. Target: > 85% positive.

## Outcome (week 4)

- Fin autonomous deflection rate: 72% (above 67% average — 60 articles is a strong KB).
- Agent conversations/day dropped from 125 each to 34 each (sustainable).
- CSAT: 88% positive.
- Monthly Fin cost: 3,600 resolutions × $0.99 = $3,564. Within budget.
- Cost monitoring alert set at $5,000/month Fin spend cap.
