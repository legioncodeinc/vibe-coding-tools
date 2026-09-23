# Subjective topical-alignment worksheet [subjective]

Grounded in `references/research/distilled-aeo-audit.md` Section 5. Everything on this worksheet is explicitly a content-shape judgment, not a binary technical pass/fail - per PRD-009 AC-2, every row here must carry the `[subjective]` label and live in a report section fully separate from the technical llms.txt/AI-crawler-access findings (`references/templates/llms-txt-validation-checklist.md`, `references/templates/ai-crawler-access-checklist.md`).

```markdown
## Subjective AEO alignment - <page path>, mapped to Question ID <Q-###>

| Signal | This archive's read | Observed on page | Notes [subjective] |
|---|---|---|---|
| Definitional first paragraph | Ranki.io: 30-90 words directly answering the page topic in plain English. The AEO Report: narrower 40-60 word general target, with per-engine variance from a 300-page internal test - ChatGPT ~50-60 words, Perplexity ~40-50, Claude ~60-80, Gemini ~40 (then truncates mid-sentence if grammar does not break cleanly). Present both ranges, do not pick one as definitive. | | |
| Answer-style H2/H3 headings | Ranki.io signal #7 of 15: phrased as the literal question a user would type. The AEO Report cites a 34% higher Perplexity citation rate for pages with proper H2/H3 nesting vs. flat bolded-text pages, from a single internal 200-page test, May 2026 - a single-source, self-reported statistic with no independent corroboration in this archive; present it as attributed, not as an established rate. | | |
| Structured tables for comparisons/specs | Ranki.io signal #8 of 15, content-shape tier | | |
| Author byline | Ranki.io signal #6 of 15 (author microdata or rel="author"); The AEO Report treats it as a required Article-schema sub-field rather than a standalone item - a framing difference, not a factual disagreement, cross-check against `references/templates/schema-signals-checklist.md`'s Article row rather than double-counting | | |
```

## Mapping to content-targets/questions.md

Per PRD-009 AC-2, every subjective finding needs to be traceable, and per the Overview, this Stinger's subjective read assesses alignment to the AEO-relevant topics implied by `content-targets/questions.md`. Reference the specific `Q-###` ID (same ID convention assumed by technical-seo-stinger's worksheets, pending keyword-intelligence-stinger's own final schema) for every row rather than writing a page-level narrative with no traceable anchor.

## What NOT to claim

- Do not assert a citation-rate outcome ("this page will get cited by ChatGPT X% more often"). Neither source in this archive is a controlled, reproducible study; the closest thing to a citation-rate number here (The AEO Report's 34% Perplexity figure) is explicitly a single vendor's single internal test, not a generalizable prediction.
- Do not blend a row from this worksheet into the technical llms.txt/AI-crawler-access sections of the report. PRD-009 AC-2 requires the separation; keep it structural, not just a label.
- Do not present Ranki.io's or The AEO Report's tiering/weighting model as an industry-agreed standard - both are explicitly self-described heuristics (distillation Section 6: "the ones that actually move citation rates," "I rebuilt mine after a year of running real-page scans").
