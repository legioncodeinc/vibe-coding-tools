---
guide: 01-tool-selection
stinger: customer-support-tooling-stinger
research_sources:
  - research/external/2026-05-20-tool-comparison-matrix.md
  - research/external/2026-05-20-plain-docs-overview.md
  - research/external/2026-05-20-pylon-positioning.md
  - research/external/2026-05-20-helpscout-pricing-pivot.md
  - research/external/2026-05-20-front-shared-inbox.md
  - research/external/2026-05-20-intercom-fin-ai.md
---

# Tool Selection — Comparison Matrix and Decision Tree

Source: `research/external/2026-05-20-tool-comparison-matrix.md`

## Pre-selection questions (always ask before recommending)

1. **Team size:** How many people handle support today?
2. **B2B or B2C posture:** Enterprise named accounts or broad consumer user base?
3. **Primary support channel:** Email, Slack Connect, in-app chat, or multi-channel?
4. **Monthly conversation volume:** Current and projected 12-month.
5. **AI deflection priority:** Is autonomous deflection a requirement, or copilot-only?
6. **Integration requirements:** Linear/Jira for escalations? Notion for knowledge base? Slack for alerts?

## Feature matrix (May 2026)

| Feature | Plain | Pylon | Help Scout | Front | Intercom |
|---|---|---|---|---|---|
| **Best fit** | B2B SaaS dev-first | B2B Slack-heavy | SMB email-first | Multi-channel SMB | B2C/growth-stage |
| **Starting price** | $50/agent/mo | ~$75/agent/mo | $50/mo (1K contacts) | $19/agent/mo | $74/agent/mo |
| **Email inbox** | Yes | Secondary | Yes (primary) | Yes (primary) | Yes |
| **Slack Connect inbox** | Yes (best-in-class) | Yes (primary) | No | No | No |
| **In-app chat widget** | Yes (embed) | No | Yes | Yes | Yes (Messenger) |
| **AI deflection** | No (beta) | Copilot only | Copilot only | Copilot only | Fin 2.0 (autonomous) |
| **Linear integration** | Native (best) | Native (basic) | Via Zapier | Via Zapier | Via Zapier |
| **SLA tracking** | Yes | Yes | Plus/Pro only | Yes (sophisticated) | Yes |
| **CSAT collection** | No (integration) | No (integration) | Yes (Pro) | Yes (built-in) | Yes (built-in) |
| **API quality** | Excellent (GraphQL) | Good (REST) | Good (REST) | Good (REST) | Good (REST) |

## Decision tree

```
Q1: Primary support channel?
├── Slack Connect (enterprise customers in shared Slack channels)
│   ├── Need strong Linear integration? → Plain
│   └── All-Slack, minimal Linear needs? → Pylon
├── Email (primary)
│   ├── < 1K contacts in DB, team < 5 → Help Scout (Starter, free)
│   ├── B2B SaaS, need Linear integration → Plain
│   └── Multi-channel needed, team 5-50 → Front (Growth)
├── In-app chat (primary)
│   ├── AI deflection priority, > 2K conversations/month → Intercom + Fin 2.0
│   └── Cost-sensitive, < 2K conversations/month → Help Scout or Plain (add widget)
└── Multi-channel (email + chat + SMS)
    └── → Front (Growth tier)

Q2: AI deflection priority?
├── Yes, autonomous (LLM-agent)
│   ├── Has > 20 help articles? Yes → Intercom + Fin 2.0
│   └── Has < 20 articles? → Build KB first, defer Fin setup
├── Yes, copilot (agent-assist)
│   └── → Help Scout AI Assist, Front AI, Pylon AI, or Plain AI (beta)
└── No → Pick tool on channel/integration criteria above
```

## Scoring rubric (when the decision is close)

Score each tool 1-5 on:

| Criterion | Weight |
|---|---|
| Primary channel support quality | 30% |
| Linear integration depth | 20% |
| AI deflection capability | 20% |
| Total cost of ownership (12-month) | 15% |
| API quality | 10% |
| CSAT/reporting built-in | 5% |

## Price model traps to flag

- **Help Scout:** Contact-based pricing since 2025 — evaluate total contact database size, not agent count. Source: `research/external/2026-05-20-helpscout-pricing-pivot.md`.
- **Intercom:** Seat license PLUS $0.99/Fin-resolved conversation. At high deflection volumes, Fin adds $5-10K/month. Source: `research/external/2026-05-20-intercom-fin-ai.md`.
- **Plain enterprise:** Pro plan pricing for > 20 agents requires a sales call; no public rate card.
