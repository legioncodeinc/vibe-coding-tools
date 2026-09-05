# Guide 04: Prioritization Frameworks

RICE and ICE are the two most widely adopted numerical prioritization frameworks for feature backlogs. This guide explains each framework, the scoring rubric for each component, when to use which, and how to combine them with MoSCoW for quarterly planning.

> **Survey data (2026):** RICE is used by 38% of product teams (survey of 94 teams). It is the most popular single prioritization framework.

## RICE

**Formula:** `(Reach × Impact × Confidence) / Effort`

### Components

| Component | Definition | Scale |
|-----------|-----------|-------|
| **Reach** | How many users affected per quarter | Estimated number (e.g., 500 users) |
| **Impact** | How much it moves the needle for each user | 3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal |
| **Confidence** | How confident you are in your Reach and Impact estimates | 50%=some qualitative signal, 80%=user research data, 100%=strong prior evidence |
| **Effort** | Total person-months to build | Person-months (e.g., 2 = 2 person-months) |

**Score:** `(Reach × Impact × Confidence%) / Effort`

Higher score = higher priority.

### RICE scoring rubric

**Impact scale (fixed to prevent inflation):**
- 3 = Massive — affects the core value proposition; would meaningfully change trial-to-paid conversion
- 2 = High — removes a significant pain point for a large segment
- 1 = Medium — a meaningful improvement; noticeable to users
- 0.5 = Low — a nice-to-have; users request it but work around it fine
- 0.25 = Minimal — cosmetic or preference-level change

**Confidence scale:**
- 100% = Strong prior evidence (shipped similar feature, A/B test data)
- 80% = User research data (interviews, usability tests)
- 50% = Qualitative signal only (support tickets, informal customer conversations)
- No lower than 50% for any scored item — if confidence is below 50%, do a discovery sprint first.

**Effort:** Estimate in person-months as a team (not individually). One person working for one month = 1. Include design, development, and QA.

### When to use RICE

- You have **analytics data** to estimate Reach reliably.
- Your team is **5+ people** with dedicated PM capacity.
- You are running **quarterly planning** and need to rank a large backlog objectively.

## ICE

**Formula:** `Impact × Confidence × Ease`

### Components

| Component | Definition | Scale |
|-----------|-----------|-------|
| **Impact** | How much it moves the metric you care about | 1-10 |
| **Confidence** | How confident you are in Impact | 1-10 |
| **Ease** | How easy it is to implement (inverse of effort) | 1-10 |

**Score:** `Impact × Confidence × Ease`

Higher score = higher priority.

### When to use ICE

- You do **not have reliable analytics data** for Reach.
- Your team is **2-20 people** moving fast with limited PM bandwidth.
- You need to score a backlog in **minutes per item** (ICE: 1-3 min/item vs RICE: 5-15 min/item).
- You are at an **early stage** where data is sparse.

## RICE vs ICE: choose based on data availability

| Dimension | RICE | ICE |
|-----------|------|-----|
| Reach component | Yes — requires real usage data | No — replaced by Ease |
| Complexity | Medium | Low |
| Data needed | Usage data, effort estimates | Estimates only |
| Time to score | 5-15 min/item | 1-3 min/item |
| Team size fit | 5-50+ | 2-20 |
| **Key difference** | Use when you know how many users are affected | Use when you're moving fast without reliable reach data |

## Framework evolution path

Teams typically evolve through:

1. **Impact/Effort matrix (early stage)** — Quick 2x2. Is this high impact AND low effort? Build it. Simple, no numbers needed.
2. **ICE (growth stage)** — Add confidence. Score 1-10 on three axes.
3. **RICE (scale stage)** — Add Reach as a measured component. Requires analytics.

## Combining frameworks: MoSCoW + RICE

The most effective quarterly planning pattern:

1. **MoSCoW** to scope the quarter: Which items are **Must** (committed, critical path), **Should** (high value, fits the quarter), **Could** (nice-to-have if capacity remains), **Won't** (explicitly out of scope)?
2. **RICE** to rank within the "Must" and "Should" buckets.

This gives you a hard scope boundary (MoSCoW) plus an objective rank within scope (RICE).

## De-duplication before scoring

**RICE and ICE scores are meaningless on duplicates.** De-duplicate your backlog using `guides/02-deduplication-discipline.md` before running any scoring session. A merged "Export to CSV" canonical request with 70 votes scores very differently than 14 separate variants with 5 votes each.

## Applying voting data to RICE Reach

Feedback platforms that track voter MRR, plan tier, and account type allow you to weight Reach by customer value. Example:

- 50 voters on free plan → Reach weight: 50 × 0.2 = 10 (low commercial value)
- 20 voters on enterprise plan → Reach weight: 20 × 3.0 = 60 (high commercial value)

This avoids the "mass B2C voting on enterprise features" distortion. Check whether your platform exposes MRR/plan data per voter.

For a worked example with 5 real-world requests scored end-to-end, see `examples/rice-scoring-worked.md`.
For a blank scoring sheet, see `templates/rice-scoring-sheet.md`.
