---
name: knowledge-base-help-center-stinger
description: Customer-facing knowledge bases — Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, Zendesk Guide — search-first design, AI deflection (chat-with-your-docs), versioning, multi-language, the analytics-driven content-gap loop. Use when the user says "pick a KB platform", "set up a help center", "migrate Zendesk Guide", "add AI deflection to our docs", "fix our search no-results", "localize our KB", or invokes `knowledge-base-help-center-worker-bee`. Do NOT use for support inbox/ticketing (customer-support-tooling-worker-bee), live chat widget wiring (live-chat-support-worker-bee), organic SEO keyword strategy (seo-aeo-worker-bee), or RAG/embedding pipeline implementation (mind-worker-bee).
---

# knowledge-base-help-center Stinger

Opinionated playbook for `knowledge-base-help-center-worker-bee`. Equips the Angel to select, set up, architect, and continuously improve customer-facing self-service knowledge bases in 2026.

## 2026 Platform Landscape at a Glance

| Platform | AI Deflection | Versioning | Multi-language | MCP (2026) | Pricing |
|---|---|---|---|---|---|
| **Help Scout Docs** | AI Answers ($0.75/res) | Basic article history | Partial; no native multi-locale | No | Transparent, contact-based |
| **Intercom Articles** | Fin ($0.99/res; **standalone plan, no seats required**) | None | Fin: 45 languages; Articles: TMS workflow | No | Per-seat + usage; opaque total cost |
| **Document360** | Eddy AI (Business+ tier) | **Full branch versioning** (parallel v2+v3 simultaneously) | **50+ languages, auto-translate** (Business+) | **Yes** (v12.3.1, Mar 2026) | Quote-based (opaque; no self-serve pricing) |
| **ReadMe.com** | AI Agent + vector search | Git-backed version control | Partial | **Yes** (Apr 2026) | Tiered; Metrics API: Enterprise only |
| **Zendesk Guide** | Answer Bot / Copilot AI | Basic; no branching | Native path-based locale routing; RTL | No | Per-agent seat |
| **HelpJuice** | Unknown (2026 data gap) | Unknown | Unknown | Unknown | Contact sales |

> **Critical 2026 findings:**
> - **Intercom Fin is now available as a standalone plan** ($0.99/resolution, no Intercom seat purchase required). This reshapes the AI deflection decision for all platforms — you can pair Fin's AI deflection with any KB platform via URL/PDF ingestion.
> - **llms.txt gained Google Lighthouse validation on May 20, 2026.** Add an `llms.txt` and `llms-full.txt` to every KB setup as a Day-1 step for AI assistant discoverability.
> - **Document360 launched an MCP server in v12.3.1 (Mar 2026)** — Claude, ChatGPT, and Copilot can now read and write the KB directly via MCP protocol.

Sources: `research/external/2026-05-20-ai-deflection-patterns.md`, `research/external/2026-05-20-document360-mcp-release-notes.md`, `research/external/2026-05-20-llmstxt-standard.md`.

## Entry point for any invocation

1. Read `guides/00-platform-selection.md` — the scored decision tree. Always run this first when the platform is undecided or when a migration is proposed.
2. Read `guides/01-information-architecture.md` — taxonomy, article templates, search tagging.
3. Read `guides/02-ai-deflection.md` — the three AI deflection patterns and the hand-off protocol to `mind-worker-bee`.
4. Read the platform-specific guide for the chosen tool (`guides/06-` through `guides/09-`).
5. Read `guides/05-analytics-loop.md` last — wire the feedback loop after setup is complete.

## Folder layout

```text
knowledge-base-help-center-stinger/
├── SKILL.md                                 (this file — master index)
├── README.md                                (one-page human overview)
├── guides/
│   ├── 00-platform-selection.md             (scored decision tree; run first)
│   ├── 01-information-architecture.md       (taxonomy, article templates, search tagging)
│   ├── 02-ai-deflection.md                  (3-pattern taxonomy; llms.txt; mind-worker-bee hand-off)
│   ├── 03-versioning.md                     (version-branching, release-gate review, article changelog)
│   ├── 04-multi-language.md                 (locale routing, TMS options: Phrase/Crowdin/Lokalise)
│   ├── 05-analytics-loop.md                 (CRAVA framework, no-result queries, weekly triage)
│   ├── 06-help-scout-docs.md                (Help Scout Docs setup, Beacon, Article Ratings)
│   ├── 07-intercom-articles.md              (Intercom Articles, Fin standalone, Messenger Home)
│   ├── 08-document360.md                    (Document360, MCP server, Eddy AI, branch versioning)
│   └── 09-readme-dev-hub.md                 (ReadMe.com developer hub, CLI, AI Agent)
├── examples/
│   ├── greenfield-help-scout.md             (zero to AI deflection with Help Scout Docs)
│   └── migration-zendesk-to-help-scout.md   (Zendesk Guide → Help Scout Docs migration)
├── templates/
│   ├── platform-selection-matrix.md         (scored matrix stub)
│   ├── kb-setup-checklist.md                (launch checklist)
│   └── content-gap-triage.md                (weekly search-no-results triage)
├── reports/
│   └── README.md                            (how past-run reports accumulate)
└── research/                                (populated by scripture-historian — DO NOT MODIFY)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── external/  (17 source notes)
    └── internal/  (2 source notes)
```

## Critical directives

- **Run the decision tree before recommending a platform.** Platform selection without scoring against the team's actual constraints (content volume, authoring persona, versioning, AI deflection need, budget) produces the wrong answer. See `guides/00-platform-selection.md`.
- **Always name the concrete trade-off.** "Use Document360" without naming the quote-only pricing and the sales-call barrier produces buyer's regret. "Use Intercom Articles" without naming the per-seat + per-resolution cost stack produces bill shock. Source: `research/external/2026-05-20-helpscout-vs-intercom-cost-model.md`.
- **Default to search-first architecture.** A KB that cannot surface the right article in two clicks fails its primary job. Wire search analytics before any AI deflection layer.
- **Flag the llms.txt step on every new KB setup.** Google Lighthouse now validates llms.txt (May 20, 2026). It is a 10-minute Day-1 step with permanent AI assistant discoverability benefit.
- **Route embedding/RAG pipeline implementation to `mind-worker-bee`.** The three deflection patterns specify the architecture boundary; `mind-worker-bee` implements the vector retrieval side. Do not cross that boundary. See `guides/02-ai-deflection.md`.
- **Flag HelpJuice as a 2026 research gap.** No current data was found on HelpJuice AI deflection maturity, versioning, or pricing. Treat it as a placeholder in the platform matrix and direct users to helpjuice.com/whats-new before committing. See `research/research-summary.md` OQ-1.
