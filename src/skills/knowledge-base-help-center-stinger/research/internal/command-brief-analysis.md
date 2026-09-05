# Command Brief Analysis: knowledge-base-help-center-worker-bee

**Source:** `ai-tools/command-briefs/knowledge-base-help-center-worker-bee-command-brief.md`
**Analyzed:** 2026-05-20
**Analyst:** scripture-historian

---

## Scope summary

`knowledge-base-help-center-worker-bee` is a SaaS KB product specialist covering six platforms (Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, Zendesk Guide). Its unique value is treating the KB as a product surface subject to engineering discipline: search-first architecture, version control, CI/CD for content, and the analytics-driven content-gap feedback loop.

## Domain boundaries (from the brief)

| This Angel owns | Explicitly NOT this Angel |
|---|---|
| Platform selection and migration | Support inbox / ticketing (customer-support-tooling-worker-bee) |
| Information architecture and search-first taxonomy | Live chat widget HMAC/routing (live-chat-support-worker-bee) |
| AI deflection "chat-with-your-docs" patterns | Organic keyword strategy (seo-aeo-worker-bee) |
| KB versioning and multi-language | RAG/embedding pipeline implementation (mind-worker-bee) |
| Analytics loop (search-no-results, deflection rate) | |

## Key architectural insight

The brief positions this Angel at the **product layer between four peers**: it decides WHAT KB platform to use and HOW to wire AI deflection, then hands RAG implementation to `mind-worker-bee`. It decides content taxonomy, not organic keywords (that goes to `seo-aeo-worker-bee`). It decides when to create a deflection layer, but not how to route the resulting tickets (that goes to `customer-support-tooling-worker-bee`).

This means `stinger-forge` must encode clear hand-off protocols to all four peer Angels inside `guides/02-ai-deflection.md` and `guides/00-platform-selection.md`.

## Proposed guide structure (from the brief)

The brief has an unusually detailed guide structure pre-planned. This is prescriptive and should be followed:

- `guides/00-platform-selection.md` - scored decision tree, AI deflection maturity check
- `guides/01-information-architecture.md` - category hierarchies, 4 article templates
- `guides/02-ai-deflection.md` - 3 wiring patterns, llms.txt, hand-off to mind-worker-bee
- `guides/03-versioning.md` - branch strategy, release gates, KB changelogs
- `guides/04-multi-language.md` - locale routing, TMS options (Phrase, Crowdin, Lokalise)
- `guides/05-analytics-loop.md` - search-no-results, ticket mapping, weekly triage ritual
- `guides/06-help-scout-docs.md` through `guides/09-readme-dev-hub.md` - per-platform guides

This 10-guide structure is larger than typical for a normal-tier stinger. `stinger-forge` may choose to slim guides 06-09 to concise platform profiles (~1 page each) rather than full-depth treatment, with the bulk of depth in guides 00-05.

## Critical directives analysis

The brief has 5 critical directives. The two most research-dependent are:

1. **"Never recommend a platform without checking its AI deflection maturity."** - Every platform's 2026 AI deflection status must be in the research. The landscape has changed materially: Document360 MCP server, ReadMe GitHub AI Writer, Intercom Fin standalone plan, Help Scout AI Answers.
2. **"Default to search-first architecture."** - Research must surface concrete data on what "search-first" means per platform: API accessibility, custom search indexing, search analytics dashboards.

## Open questions from the brief (for scripture-historian to answer)

| Q# | Question | Status after research |
|---|---|---|
| Q1 | Has Help Scout changed Docs pricing or feature set since 2025? | ANSWERED - Yes: contact-based pricing pivot in 2025; AI Answers at $0.75/resolution on Standard plan |
| Q2 | Is Document360's AI Assistant available on all paid tiers in 2026? | PARTIALLY ANSWERED - AI Writer Suite on Professional+, AI Search Suite on Business+, AI Premium on Enterprise only |
| Q3 | Is Intercom's Fin 2.0 capable of directly reading custom KB articles? | ANSWERED - Yes, Fin reads KB articles natively; standalone Fin plan now available with no seat requirement |
| Q4 | What is the 2026 state of ReadMe Metrics for API docs vs KB usage? | ANSWERED - Metrics API is Enterprise-only; Developer Dashboard tracks page views, top searches, API logs |

## Adjacent Angel boundary analysis

`customer-support-tooling-worker-bee` owns Plain/Pylon/Front/Help Scout/Intercom as **support inbox** tools. This Angel overlaps with Help Scout and Intercom but owns the **KB/Docs layer** of those platforms, not the shared inbox layer. The brief correctly scopes this as the KB product surface.

`stinger-forge` must include a boundary table in `guides/00-platform-selection.md` clarifying: "Help Scout Docs vs Help Scout inbox are different surfaces; this stinger covers the Docs surface only."

## HelpJuice coverage gap

HelpJuice is listed as a platform candidate in the brief but no research was found for it in the Nov 2025 - May 2026 window. `stinger-forge` should note this as a gap and include a placeholder profile in `guides/00-platform-selection.md` with a note that it needs a separate research pass.

## Recommended research prioritization for stinger-forge

1. **Critical (read first):** external/2026-05-20-helpscout-vs-intercom-comparison.md, external/2026-05-20-document360-2026-features.md, external/2026-05-20-llms-txt-standard.md
2. **High:** external/2026-05-20-readme-com-2026-features.md, external/2026-05-20-ai-deflection-patterns.md, external/2026-05-20-kb-analytics-content-gap.md
3. **Medium:** external/2026-05-20-multi-language-kb-localization.md, external/2026-05-20-tms-platform-comparison.md, external/2026-05-20-helpscout-vs-intercom-cost-model.md
