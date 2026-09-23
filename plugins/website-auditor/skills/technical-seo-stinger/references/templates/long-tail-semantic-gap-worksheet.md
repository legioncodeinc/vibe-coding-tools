# Long-tail semantic analysis worksheet

> **Honest grounding note, read before using this template.** `references/research/distilled-technical-seo.md` Section 12 states plainly: long-tail semantic analysis methodology is **not covered by a dedicated source in this archive**. The only adjacent material is the round 1/2 mythbusting table (Section 10), which establishes what Google says is *not* required for AI-generated features (exhaustive long-tail keyword-variation coverage, content chunking, special AI-only page versions) - that is a negative constraint, not a positive scoring methodology. This worksheet is this Stinger's own clearly-labelled judgment call, built to satisfy PRD-008's AC-2 (long-tail findings must reference specific `content-targets/questions.md` entries by ID), not a cited standard. Treat every row's coverage verdict as `[subjective]`.

## Method (this Stinger's own, not sourced)

1. For each question entry in `content-targets/questions.md` (format assumed as `Q-###` sequential IDs, same reconciliation caveat as the keyword worksheet), read the crawled Markdown in `site-data/` for the page(s) most likely to answer it (use the page(s) already assigned by keyword-intelligence-stinger's or icp-positioning-wasp-drone's output where that mapping exists; otherwise do a plain-language topical read of `site-data/*.md`).
2. Classify coverage as one of: **Directly answered** (the page states the answer in terms a reader would recognize as answering the question, not just adjacent-topic content), **Partially covered** (the topic is present but the specific question is not directly answered), **Not covered** (no page addresses it), **Covered elsewhere** (a different page than the one keyword-intelligence-stinger assigned answers it better - note the actual page).
3. Do not require content chunking, a dedicated FAQ block, or an AI-only content version as a precondition for "Directly answered" - Google's own documented position is that none of those are required for its systems to extract a relevant passage (distillation Section 10). A well-written paragraph that plainly answers the question counts.
4. Record every "Not covered" and "Partially covered" verdict as a content-gap candidate; this is the raw material blog-content-stinger or icp-positioning-wasp-drone would use downstream, this Stinger's job stops at identifying and evidencing the gap, not writing the fix.

## Worksheet table

```markdown
| Question ID (Q-###) | Question text | Best-matching page | Coverage | Evidence excerpt | Notes [subjective] |
|---|---|---|---|---|---|
| Q-001 | "how long does example widget installation take" | /products/example | Partially covered | Page mentions "quick install" with no time figure | Add an explicit time estimate; classic long-tail intent match without a direct answer |
```

## What NOT to claim

- Do not assert a numeric "semantic coverage score" as a disclosed industry standard; this archive has none for that specific metric. If a rollup percentage is useful for the report, label it explicitly as this audit's own tally (count of Directly-answered / total questions), not an externally validated score.
- Do not penalize a page for lacking exhaustive keyword-variation phrasing of the question; that specific practice is the one Google mythbusting point this archive does cover directly (distillation Section 10, "AI-specific long-tail rewriting").
