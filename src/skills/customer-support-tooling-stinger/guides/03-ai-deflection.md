---
guide: 03-ai-deflection
stinger: customer-support-tooling-stinger
research_sources:
  - research/external/2026-05-20-intercom-fin-ai.md
  - research/external/2026-05-20-ai-deflection-benchmarks.md
---

# AI Deflection — Tier Selection, KB Dependency, Escalation Protocol

## Deflection tier decision

| Tier | Tool | Pricing model | Min KB articles | Avg resolution rate |
|---|---|---|---|---|
| **LLM-agent (autonomous)** | Intercom Fin 2.0 (Fin) | $0.99/resolved conversation | 20+ (60%+ rate needs 50+) | 67% average |
| **LLM-agent (autonomous)** | Freshdesk Ari | Included in Pro | 20+ | 55-65% |
| **Copilot (agent-assist)** | Help Scout AI Assist, Front AI, Pylon AI, Plain AI (beta) | Included in seat | None | N/A (assists, not resolves) |
| **Rule-based FAQ bot** | Crisp Bot, Tidio, Dialogflow | Flat fee or free | 10+ | 25-40% deflection |

Source: `research/external/2026-05-20-ai-deflection-benchmarks.md`

## Pre-condition checklist before enabling Fin or any LLM-agent

- [ ] Knowledge base has >= 20 published articles
- [ ] Articles cover the top 10 most-asked questions (verify against last 90 days of conversation tags)
- [ ] A "Topics" scope list is defined (what Fin will and won't answer)
- [ ] Escalation trigger is configured (confidence below threshold → human handoff)
- [ ] A human agent is available during business hours for immediate escalation
- [ ] Budget approved for outcome-based pricing ($0.99/resolution for Fin)

**Do not enable Fin without passing all six checks.** Source: `research/external/2026-05-20-intercom-fin-ai.md`.

## Fin 2.0 configuration steps (Intercom)

1. **Scope Topics:** In Intercom → Fin → Topics, list the subject areas Fin may address. Topics outside scope route directly to human agents.
2. **Connect Help Center:** Fin indexes all published Articles. Unpublished drafts are NOT indexed. Verify article count and coverage.
3. **Set escalation trigger:** Configure the "confidence threshold" below which Fin hands off. Default: 70% confidence. Increase for conservative setups.
4. **Configure handoff message:** Fin's escalation message should include a conversation summary and links to the articles Fin attempted to use.
5. **Enable test mode first:** Run Fin in "Suggestions only" mode for 1 week to review resolution accuracy before enabling autonomous mode.
6. **Cost monitoring:** Set a monthly Fin spend cap alert in Intercom billing settings. At $0.99/resolution, 10K resolutions = ~$9,900/month.

## Knowledge base bootstrap workflow

For teams enabling AI deflection for the first time:

1. Pull the last 90 days of closed conversations. Filter by tag `how-to`.
2. Group by topic (use reason code tags). Identify the top 20 question themes.
3. Write one help article per theme. Target 200-500 words per article with step-by-step instructions.
4. Publish all 20 articles. Enable Fin in Suggestions mode.
5. After 2 weeks, review Fin's suggestion accuracy. Correct articles where Fin hallucinated. Re-enable autonomous mode.

## Escalation protocol

All AI deflection tiers must have a human escalation path:

1. **Trigger:** Customer explicitly asks for a human OR Fin confidence < threshold OR conversation loop > 3 turns without resolution.
2. **Handoff message to customer:** "I've connected you with a member of our team who'll take it from here."
3. **Handoff context to agent:** Conversation summary + KB articles attempted + customer sentiment signal.
4. **SLA reset:** Escalated conversations start a fresh SLA timer from the moment of human assignment.
5. **Feedback loop:** Agent who resolved the escalated conversation tags it `fin-miss` and links the KB article that was missing or incorrect. This drives the weekly KB review.
