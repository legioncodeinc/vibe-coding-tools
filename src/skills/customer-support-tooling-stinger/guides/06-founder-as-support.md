---
guide: 06-founder-as-support
stinger: customer-support-tooling-stinger
research_sources:
  - research/external/2026-05-20-founder-as-support.md
---

# Founder-as-Support — 0-to-First-Hire Playbook

Source: `research/external/2026-05-20-founder-as-support.md`

## When this guide applies

Use this guide when team size is <= 3 people (engineers, founders) with no dedicated support headcount. At > 50 tickets/week or ARR > $100K, prioritise hiring a first support person and use this guide as the handoff documentation.

## Inbox cadence (sustainable)

Do NOT keep the inbox open all day. Constant monitoring kills deep work.

**Recommended cadence:**
- Morning triage: 9am, 20 min max
- Afternoon triage: 3pm, 20 min max
- Total daily support time: <= 40 min

**P1 exception:** Configure a P1 alert directly to your phone (Slack DM or SMS) for production-down situations outside triage windows.

## Reason-code tagging discipline

Tag every thread with a reason code before closing. This data becomes your product roadmap signal.

| Tag | Meaning | Action |
|---|---|---|
| `bug` | Reproducible defect | Create Linear issue |
| `feature-request` | Enhancement ask | Add to roadmap tracker |
| `how-to` | Usage question | Write a help article |
| `billing` | Payment / subscription | Resolve or escalate |
| `account` | Access, SSO, permissions | Resolve or hand to auth-worker-bee |

Review reason-code distribution weekly. If `bug` > 30% of volume, it's a product quality problem. If `how-to` > 40%, invest in docs.

## Response templates

**Bug acknowledgment:**
> "Thanks for flagging this — I've reproduced it and opened a bug internally. I'll keep this thread updated as we work through it. Expected timeline: [X]."

**Feature request:**
> "Really appreciate this — adding to our roadmap. I'll let you know when it ships. In the meantime, [workaround if any]."

**How-to (with article link):**
> "[Direct answer]. I've also documented this at [help article URL] so the next person who asks gets it instantly."

**P1 acknowledgment:**
> "I see you're experiencing [issue]. I've escalated this internally and we're working on it right now. I'll update you every 30 minutes until resolved."

## Knowledge base build-while-you-support

Every `how-to` answer should generate a help article. Rule: if you answer the same question twice, document it.

Workflow:
1. Answer the customer thread.
2. Draft a help article from your answer (> 200 words, step-by-step).
3. Publish the article. Link it in the thread reply.
4. After 20 articles, evaluate enabling AI deflection (see `guides/03-ai-deflection.md`).

## Engineering escalation criteria

| Situation | Action |
|---|---|
| Customer cannot access account/data | Create P1 Linear issue; reply with 30-min ETA |
| Bug reproduced with steps | Create P2 Linear issue; link in thread |
| Feature request from 3+ customers | Add to roadmap; no immediate eng action |
| Customer threatening churn | Loop in co-founder within 1 hour |
| Data integrity question / GDPR request | Escalate to `security-worker-bee` |

## First support hire handoff checklist

Before handing support to a first hire, ensure:
- [ ] Inbox is in a shared tool (Plain, Help Scout, etc.) — NOT founder's personal email
- [ ] At least 30 help articles written from past `how-to` threads
- [ ] Saved replies for the top 10 question types
- [ ] SLA policy documented (even if informal)
- [ ] Linear integration configured for bug escalations
- [ ] Reason-code tag taxonomy documented
- [ ] One week of shadowing time budgeted for the new hire
- [ ] Weekly CSAT review process handed off with example cadence

## Tool recommendation for founder-as-support phase

For the founder-as-support phase specifically:
- **Plain Starter ($50/month)** is the default. GraphQL API for custom automation, Slack Connect inbox, native Linear integration. Low overhead.
- **Help Scout Free (up to 100 contacts)** if the team is not yet ready to pay for a tool and volume is very low.
- **Avoid Intercom at this phase** — the seat license cost ($74+/agent/month) plus Fin charges are disproportionate for < 500 conversations/month.
