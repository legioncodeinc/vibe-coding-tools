---
name: customer-support-tooling-stinger
description: Support stack specialist for SaaS products — selects the right tool from Plain, Pylon, Front, Help Scout, and Intercom; configures shared inboxes; designs AI-deflection flows (Fin 2.0, Ari, Crisp Bot); sets SLA tiers; wires integrations to Slack, Linear, and Notion; and provides a founder-as-support playbook for teams of 1-3. Invoke when choosing a support tool, auditing an existing stack, configuring AI deflection, designing SLA policy, or setting up escalation to Linear. Do NOT invoke for chat widget installation code (live-chat-support-worker-bee), auth SSO (auth-worker-bee), or GDPR/retention audits (security-worker-bee).
---

# customer-support-tooling Stinger

Arsenal for `customer-support-tooling-worker-bee`. Encodes the decision trees, comparison matrices, configuration templates, and integration wiring guides the Angel reads when invoked.

## When this stinger applies

Load when the Angel is asked to:

- Recommend a support tool (Plain vs Pylon vs Help Scout vs Front vs Intercom)
- Configure a shared inbox (routing, assignment, tags, SLA tiers)
- Design or audit an AI-deflection flow (FAQ bot, Fin 2.0, Ari, Crisp Bot)
- Wire integrations (Slack bi-directional, Linear escalation, Notion knowledge-base)
- Design SLA policy (P1/P2/P3 tiers, breach alerts, CSAT collection)
- Produce a founder-as-support triage playbook for teams of <= 3
- Audit an existing support setup for SLA misses, deflection gaps, routing bottlenecks

Do NOT load for:
- Chat widget installation and HMAC verification code → `live-chat-support-worker-bee`
- Authentication and SSO for the support tool → `auth-worker-bee`
- GDPR conversation-history retention audits → `security-worker-bee`
- Billing/subscription issues surfaced through support → `payments-worker-bee`

## First actions when this stinger is loaded

Read in this order:

1. **`guides/00-principles.md`** — scope boundary, B2B vs B2C posture rule, handoff protocol to peer Angels.
2. **`guides/01-tool-selection.md`** — comparison matrix and decision tree (Plain, Pylon, Help Scout, Front, Intercom).
3. **`research/external/2026-05-20-tool-comparison-matrix.md`** — the structured feature/pricing matrix and decision tree from G2 + Capterra 2026.

Then consult the specific guide for the task at hand (see Folder layout below).

## Folder layout

```
customer-support-tooling-stinger/
├── SKILL.md                              (this file — master index)
├── README.md                             (one-page human overview)
├── guides/
│   ├── 00-principles.md                  (scope boundary, B2B/B2C posture rule, peer handoffs)
│   ├── 01-tool-selection.md              (comparison matrix, decision tree, scoring rubric)
│   ├── 02-shared-inbox-config.md         (routing rules, tags, merge/split, SLA tier mapping)
│   ├── 03-ai-deflection.md               (Fin/Ari/Crisp tiers, KB dependency, escalation flow)
│   ├── 04-sla-design.md                  (P1/P2/P3 tiers, breach alerts, CSAT collection)
│   ├── 05-integrations.md                (Slack sync, Linear escalation, Notion KB surfacing)
│   └── 06-founder-as-support.md          (0-to-hire playbook, inbox cadence, triage templates)
├── examples/
│   ├── b2b-plain-linear-slack.md         (worked: B2B SaaS dev-tool using Plain + Linear + Slack)
│   └── b2c-intercom-fin.md               (worked: B2C product using Intercom + Fin 2.0)
├── templates/
│   ├── support-audit-report.md           (skeleton report for existing-stack audits)
│   └── founder-triage-checklist.md       (triage checklist for 1-3 person support teams)
├── reports/
│   └── README.md                         (accumulates past audit reports over time)
└── research/                             (populated by scripture-historian — do not modify)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    └── external/
        ├── 2026-05-20-plain-docs-overview.md
        ├── 2026-05-20-pylon-positioning.md
        ├── 2026-05-20-helpscout-pricing-pivot.md
        ├── 2026-05-20-front-shared-inbox.md
        ├── 2026-05-20-intercom-fin-ai.md
        ├── 2026-05-20-slack-linear-integration.md
        ├── 2026-05-20-sla-tracking-patterns.md
        ├── 2026-05-20-founder-as-support.md
        ├── 2026-05-20-ai-deflection-benchmarks.md
        └── 2026-05-20-tool-comparison-matrix.md
```

## Critical directives (from Command Brief)

- **Never recommend a tool without a comparison table.** Tool selection without explicit trade-off documentation produces vendor lock-in regret and makes the decision unauditable.
- **Always ask for team size and B2B/B2C posture before recommending.** Plain/Pylon are optimal for B2B developer products but a poor fit for high-volume B2C; wrong fit wastes months of migration work.
- **Scope AI deflection to documented FAQs only until the product has > 20 help articles.** LLM-agent deflection on sparse data produces hallucinated answers that erode customer trust faster than slow human responses.
- **Do not configure SLA alerts without first confirming the alerting channel is staffed.** An unmonitored SLA breach alert is worse than no alert — it creates false confidence.
- **Route GDPR deletion requests and data-export concerns to security-worker-bee.** Conversation-history retention is a data-sovereignty concern that crosses into legal liability.

## Open questions (from research)

These were unresolved after the `normal`-depth research sweep. Flag them to the user when relevant:

1. Plain's enterprise pricing (> 200 seats) is not public — requires a sales call before committing at scale.
2. Pylon AI resolution rate benchmarks are not publicly available as of May 2026.
3. ClearFeed / Unthread / Thena Slack-native inbox tools need a follow-on research pass.
4. Notion's integration pattern with Plain and Pylon is not documented natively — use API/webhook workaround.
5. Intercom Fin outcome-based pricing behavior at > 10K resolutions/month is undocumented.

---

*Forged by `stinger-forge` from `customer-support-tooling-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
