---
source_url: ai-tools/command-briefs/investor-cap-table-worker-bee-command-brief.md
retrieved_on: 2026-05-20
source_type: internal-command-brief
authority: high
relevance: high
topic: meta
stinger: investor-cap-table-stinger
---

# Command Brief: investor-cap-table-worker-bee (Internal Cross-Reference)

## Summary
The command brief was read on 2026-05-20 and sets the full scope, directives, and guide structure for the stinger. Key directives: (1) Never recommend spreadsheets for cap table management beyond single-founder pre-incorporation. (2) Always recommend lawyer review before signing any legal instrument. (3) Use YC post-money SAFE as the default instrument for US startups. (4) Always state dilution impact explicitly. (5) Do not recommend a specific 409A provider without a "verify current pricing and turnaround" caveat. (6) Flag jurisdiction-specific ambiguities explicitly rather than guessing. The stinger is calibrated for US Delaware C-Corps; non-US jurisdictions should be routed to local counsel.

## Key open questions surfaced by the Command Brief
- Q1: Has AngelList Stack changed its pricing model in 2026? **ANSWERED**: AngelList Stack stopped accepting new customers in August 2026 - effectively removed from market.
- Q2: What is the current Carta automated 409A validity window and how does it compare to third-party providers? **PARTIALLY ANSWERED**: Carta 409A costs $1,500-$5,000, turnaround 5-15 business days. The "automated 409A" specific validity window was not confirmed in research - flag for stinger-forge.
- Q3: Are there significant differences in SAFE enforceability for non-US (UK, EU, Australia) founders? **NOT FOUND** in 6-month window. Flag as open question for stinger-forge to note as out-of-scope / jurisdiction gap.
- Q4: What are the current most common investor data-room platforms and their adoption rates? **PARTIALLY ANSWERED**: Carta and DocSend are the two dominant options. Adoption rate statistics not found.

## Proposed guide structure (from brief)
- guides/00-principles.md
- guides/01-platform-selection.md (Carta vs Pulley vs Cake Equity vs Capdesk - note AngelList Stack sunset)
- guides/02-safe-mechanics.md
- guides/03-priced-round-mechanics.md
- guides/04-409a-valuations.md
- guides/05-option-pool-management.md
- guides/06-vesting-schedules.md
- guides/07-data-room-checklist.md
- templates/safe-conversion-model.md
- templates/data-room-folder-structure.md
- templates/option-grant-checklist.md
- examples/happy-path-safe-to-series-a.md
- examples/platform-selection-seed-stage.md

## Annotations for stinger-forge
- The Command Brief explicitly identifies the overlap boundaries with peer stingers: formation (incorporation-startup-stack-worker-bee), legal documents (legal-docs-worker-bee), billing (payments-worker-bee). Do not repeat their content; cross-link instead.
- The "never spreadsheets" directive should be in guides/00-principles.md as the first rule with an explicit enforcement note.
- The 409A Carta "automated" 409A distinction: research found "Carta 409A" service but not specifically an "automated" tier distinct from manual. Stinger-forge should investigate whether Carta still markets an automated/expedited 409A tier in 2026.
