---
url: https://www.intercom.com/fin
title: "AI Deflection Benchmarks — Fin, Ari, Crisp Bot (2025-2026)"
source_type: industry_report
authority: high
relevance: 5
fetched: 2026-05-20
topic: AI deflection rates, Fin vs Ari vs bots, outcome pricing, knowledge-base dependency
---

# AI Deflection Benchmarks (2025-2026)

## Market overview

Three tiers of AI deflection capability exist in the 2026 support market:

1. **LLM-agent tier (autonomous resolution):** Intercom Fin 2.0 (Fin), Zendesk AI Agents. These use large language models to conduct multi-turn conversations and attempt autonomous resolution. Outcome-based pricing.

2. **Copilot tier (agent-assist):** Help Scout AI Assist, Front AI, Pylon AI, Plain AI (beta). These surface suggested responses to human agents but do not attempt autonomous resolution. Seat-based pricing inclusion.

3. **FAQ bot tier (rule-based deflection):** Crisp Bot, Tidio, custom Dialogflow/Voiceflow bots. These match keywords to pre-written answers. Low cost, low capability.

## Intercom Fin benchmarks

- Average resolution rate: 67% across Intercom's customer base (May 2026)
- Top 10% of deployments: 80-85% resolution (typically SaaS products with > 100 help articles)
- Bottom 25%: < 40% resolution (products with < 20 articles or complex multi-step workflows)
- Outcome pricing: $0.99/resolved conversation
- Languages supported: 45

## Ari (Freshdesk AI)

- Resolution rates: 55-65% reported (Freshdesk blog, Q1 2026)
- Pricing: included in Freshdesk Pro plan ($15/agent/month base + Ari add-on)
- Knowledge-base dependency: same as Fin — requires rich article coverage

## Crisp Bot (rule-based)

- Deflection rate: 25-40% for FAQ-style questions
- Resolution rate (full conversation resolution): < 15% without human handoff
- Pricing: included in Crisp Pro ($25/month flat)
- Best use case: high-volume B2C with well-defined FAQ corpus, cost-sensitive

## Knowledge-base dependency curve

| Articles in KB | Fin Resolution Rate | Crisp Bot Deflection Rate |
|---|---|---|
| < 10 | < 30% | < 20% |
| 10-30 | 40-55% | 25-35% |
| 30-100 | 55-70% | 35-45% |
| > 100 | 70-85% | 40-50% |

## Cost comparison at 10K conversations/month (67% Fin resolution)

- Fin 2.0: 6,700 resolutions × $0.99 = $6,633/month (plus Intercom seat licenses)
- Ari: included in Freshdesk Pro (< $1,500/month for 10-agent team)
- Crisp Bot: $25/month flat (but only resolves ~3,500 conversations, rest go to human)

## Key takeaways

- Fin is the best AI deflection product but the most expensive; justify it for products with > 5K conversations/month and > 50 help articles.
- Ari is the best cost/performance ratio at mid-volume; recommended for Freshdesk-based teams or cost-sensitive Intercom migrations.
- Crisp Bot is viable for B2C FAQ deflection at < 1K conversations/month; avoid for B2B complex workflows.
- Do not enable any AI deflection until the knowledge base has > 20 articles; below this threshold, deflection quality damages customer trust.
- LLM-agent tier (Fin, Ari) requires a knowledge base; copilot tier (Help Scout AI, Pylon AI) helps agents regardless of KB size.
