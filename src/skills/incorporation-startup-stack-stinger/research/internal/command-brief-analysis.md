---
source_type: internal
authority: high
relevance: high
topic: domain-scope
url: ai-tools/command-briefs/incorporation-startup-stack-worker-bee-command-brief.md
fetched: 2026-05-20
---

# Command Brief Analysis: incorporation-startup-stack-worker-bee

## Summary

The Angel is an opinionated formation advisor for software startup founders. It handles seven action steps: entity-type triage, formation-platform selection, EIN workflow, banking setup, bookkeeping platform selection, founder-paperwork checklist, and human-attorney triggers. It does NOT own ongoing tax strategy, cap-table management (Carta/Pulley), fundraising mechanics, or post-formation compliance filings beyond initial setup.

## Key scope boundaries (for stinger-forge)

- **In scope:** Formation platforms (Stripe Atlas, Clerky, Doola, Firstbase), entity types (Delaware C-Corp, LLC, international), EIN workflow, banking (Mercury, Brex, Relay), bookkeeping (Pilot, Bench, Digits), founder paperwork (83(b), IP assignment, founders' agreement, board consent, registered agent, bank resolution).
- **Out of scope (flag to user):** Ongoing state compliance filings, cap-table management software, equity fundraising mechanics (SAFEs, priced rounds), advanced tax strategy.

## Seven guide files proposed

1. `guides/00-entity-type-decision.md` - Four-question triage, C-Corp vs LLC vs international table, Delaware rationale
2. `guides/01-formation-platforms.md` - Stripe Atlas vs Clerky vs Doola vs Firstbase: 2026 pricing, processing times, included/excluded services
3. `guides/02-ein-workflow.md` - IRS SS-4 step-by-step, online vs paper trade-off, responsible-party rules
4. `guides/03-banking.md` - Mercury vs Brex vs Relay for VC-backed, bootstrapped, international founders
5. `guides/04-bookkeeping.md` - Pilot vs Bench vs Digits; accrual vs cash; upgrade triggers
6. `guides/05-founder-paperwork.md` - Ordered checklist: 83(b), IP assignment, founders' agreement, board consent, registered agent, bank resolution
7. `guides/06-attorney-triggers.md` - Explicit list of DIY scope crossings

## Open questions from the brief (stinger-forge must answer)

1. Does Doola support C-Corp formation natively in 2026? (ANSWERED in research: YES - Doola supports both LLC and C-Corp as of 2026)
2. Has Firstbase updated its pricing since Q4 2025? (ANSWERED: $399-$599 setup + $299/yr annual fee as of early 2026)
3. Is Mercury FDIC pass-through still $3M? (ANSWERED: Mercury now up to $5M through sweep networks; Brex Vault up to $6M)

## Critical directives to encode in SKILL.md

- State entity-type recommendation BEFORE touching platform selection
- Never present formation-platform marketing copy as neutral analysis; cite primary fee schedules only
- Explicitly call out 83(b) 30-day hard deadline in every C-Corp output - not buried in checklist
- State clearly when task exceeds DIY scope and attorney is needed
- Verify pricing from research, not training memory (quarterly pricing changes)

## Overlap with peer Angels

- `payments-worker-bee` takes over when a founder using Stripe Atlas immediately integrates Stripe payments post-formation
- No peer Angel exists for: ongoing tax compliance (flag to user), cap-table management (flag to user), equity fundraising (flag to user)

## Refresh cadence

Annually (January) at `shallow` depth tier to refresh platform comparison tables and IRS fee schedules.
