---
name: investor-cap-table-stinger
description: Cap-table management and fundraising paperwork specialist for startup founders -- Carta, Pulley, Cake Equity, Capdesk (AngelList Stack sunset August 2026), SAFEs (YC post-money standard), priced rounds (Series A+ term sheets), 409A valuations, option pool sizing and refresh, vesting schedules (4-year/1-year cliff, double-trigger), and investor data-room preparation. Use when the user says "set up a cap table", "Carta vs Pulley", "SAFE mechanics", "409A valuation", "option pool", "vesting schedule", "data room for Series A", "term sheet provisions", or "fundraising paperwork". Do NOT use for company formation (incorporation-startup-stack-worker-bee), ongoing bookkeeping (out of scope), securities law advice (always defer to counsel), or Stripe billing (payments-worker-bee).
---

# investor-cap-table Stinger

Procedural arsenal for `investor-cap-table-worker-bee`. Covers the full equity lifecycle for startup founders: cap-table platform selection, SAFE mechanics, priced-round term sheet interpretation, 409A valuations, option pool management, vesting schedules, and Series A data-room preparation.

**Critical context from research (2026-05-20):**
- AngelList Stack stopped accepting new customers in August 2026. Do not recommend it for new startups. Platform selection is now Carta vs Pulley as the primary choice, with Cake Equity and Capdesk as international alternatives.
- 83% of SAFEs issued in 2024 use the post-money structure. YC removed the pre-money SAFE from its website in 2018. Always default to post-money.
- A **signed term sheet invalidates a current 409A**. Granting options between a signed term sheet and a new 409A exposes employees to 20% federal penalty taxes. This is the single most dangerous 409A gotcha.

Source: [`research/research-summary.md`](research/research-summary.md)

---

## When this stinger applies

Load this stinger when `investor-cap-table-worker-bee` is invoked. Primary triggers:

- "Set up our cap table" / "which cap table platform should we use?"
- "Carta vs Pulley" / "how do I pick between cap table tools?"
- "How does a SAFE work?" / "SAFE conversion mechanics" / "post-money vs pre-money SAFE"
- "What's in a term sheet?" / "explain this term sheet provision" / "liquidation preference"
- "When do I need a 409A?" / "409A valuation timing" / "Carta 409A"
- "How big should our option pool be?" / "option pool refresh" / "ESOP dilution"
- "Vesting schedule" / "cliff vesting" / "double-trigger acceleration"
- "Data room for Series A" / "due diligence checklist" / "what investors want to see"

Do NOT load for company formation (that is `incorporation-startup-stack-stinger`), subscription billing mechanics (that is `payments-stinger`), or legal document drafting (that is `legal-docs-stinger`).

---

## First action when this stinger is loaded

1. Read `guides/00-principles.md` -- the non-negotiables: no spreadsheets, always recommend counsel, post-money SAFE as default, and the jurisdiction scope (US Delaware C-Corps; flag non-US for local counsel).
2. Identify the founder's stage and specific question.
3. Navigate to the relevant guide:
   - Platform selection → `guides/01-platform-selection.md`
   - SAFE mechanics → `guides/02-safe-mechanics.md`
   - Priced round / term sheet → `guides/03-priced-round-mechanics.md`
   - 409A valuations → `guides/04-409a-valuations.md`
   - Option pool → `guides/05-option-pool-management.md`
   - Vesting schedules → `guides/06-vesting-schedules.md`
   - Data room → `guides/07-data-room-checklist.md`

---

## Guide index

| Guide | What it covers |
|---|---|
| `guides/00-principles.md` | Non-negotiables: no spreadsheets, lawyer caveat, post-money SAFE default, jurisdiction scope |
| `guides/01-platform-selection.md` | Carta vs Pulley vs Cake Equity vs Capdesk decision matrix; AngelList Stack sunset |
| `guides/02-safe-mechanics.md` | Post-money SAFE anatomy, conversion math, multiple-SAFE dilution, pre/post-money distinction |
| `guides/03-priced-round-mechanics.md` | Term sheet anatomy: valuation, option pool shuffle, liquidation preferences, anti-dilution, pro-rata |
| `guides/04-409a-valuations.md` | Trigger events, validity windows, provider selection, the signed-term-sheet danger zone |
| `guides/05-option-pool-management.md` | Initial sizing, refresh triggers, dilution math, ISO vs NSO overview |
| `guides/06-vesting-schedules.md` | 4-year/1-year cliff, monthly vesting, double-trigger vs single-trigger acceleration |
| `guides/07-data-room-checklist.md` | Series A data room folder structure, per-folder document checklist, the 5-item investor speed test |

## Examples

| Example | What it demonstrates |
|---|---|
| `examples/happy-path-safe-to-series-a.md` | Two SAFEs converting at a Series A; cap table at each stage |
| `examples/platform-selection-seed-stage.md` | Seed-stage founder choosing between Pulley and Carta |

## Templates

| Template | What it provides |
|---|---|
| `templates/safe-conversion-model.md` | SAFE conversion dilution table with worked numbers |
| `templates/data-room-folder-structure.md` | Canonical 7-category Series A data room folder tree |
| `templates/option-grant-checklist.md` | Pre-grant checklist: 409A validity, board approval, platform update |

---

## Critical directives

- **Never recommend spreadsheets for cap-table management** beyond a single-founder, pre-incorporation scenario. Spreadsheets have no audit trail, no e-signature workflow, no 409A integration, and are rejected by institutional investors at due diligence.
- **Always recommend qualified lawyer review** before signing any legal instrument. The Angel interprets financial and cap-table mechanics; it does not provide legal advice.
- **Default to the YC post-money SAFE** for US startups unless the user explicitly names a different instrument. Deviating requires specific justification.
- **State dilution impact explicitly** any time you discuss issuing shares, options, or SAFEs. Founders systematically underestimate dilution.
- **Flag the jurisdiction boundary.** This stinger is calibrated for US Delaware C-Corps. For UK, EU, Australia, or other jurisdictions, flag the gap and recommend local counsel.

---

## Research trail

All primary sources are in [`research/`](research/). See [`research/index.md`](research/index.md) for the full manifest and [`research/research-summary.md`](research/research-summary.md) for the executive summary and open questions.

Researched by `scripture-historian` on 2026-05-20 at normal depth (6-month window, 13 queries, 20 source files).

---

*Forged by `stinger-forge` from `ai-tools/command-briefs/investor-cap-table-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
