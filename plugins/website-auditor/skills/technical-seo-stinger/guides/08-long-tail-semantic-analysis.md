# 08. Long-tail semantic analysis [subjective, judgment-call methodology]

> **Read this before running any long-tail semantic check.** `references/research/distilled-technical-seo.md` Section 12 states this directly: long-tail semantic analysis methodology is not covered by a dedicated source in this Stinger's research archive. The only adjacent material (Section 10) is Google's own mythbusting list of what is NOT required for AI-generated features - a negative constraint, not a positive scoring methodology. Everything in this guide and in `references/templates/long-tail-semantic-gap-worksheet.md` is this Stinger's own procedure, not a cited standard. Say so every time this checkpoint's output reaches a report.

## Why this exists despite the gap

PRD-008 AC-2 requires long-tail semantic findings to reference specific `content-targets/questions.md` entries by ID, not a generic summary. Same binding-acceptance-criterion logic as guide 07: build a defensible, clearly-labelled procedure rather than skip the checkpoint or invent a citation that does not exist.

## Procedure

See `references/templates/long-tail-semantic-gap-worksheet.md` for the full worked method: a four-way coverage classification per question (Directly answered / Partially covered / Not covered / Covered elsewhere), read against the crawled Markdown in `site-data/`.

## What the adjacent Google guidance does establish (mythbusting only)

Content chunking is not required - Google's systems can parse multi-topic pages and extract the relevant passage without pre-fragmentation. Special AI-only schema or Markdown versions are not required for inclusion in generative AI features. Do not require either as a precondition for scoring a page "Directly answered" on the worksheet; a well-written paragraph that plainly answers the question counts, even embedded in a longer multi-topic page. [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

## Boundary with AEO

This checkpoint reads long-tail intent coverage for traditional search relevance, using the same `content-targets/questions.md` source aeo-audit-stinger draws on for its own subjective topical-alignment read. The two are related but not identical: this Stinger's long-tail read asks "does this page's content answer the question," aeo-audit-stinger's subjective read asks "is this page's content shaped to be extractable and citable by an AI answer engine." Do not merge the two into one finding, they serve different sections of the final report and different sub-audits in the scoring rubric (Search presence's technical-SEO leaf here, technical-AEO/subjective-copy leaves there). See [aeo-audit-stinger's guides/05-subjective-topical-alignment.md](../../aeo-audit-stinger/guides/05-subjective-topical-alignment.md) for that Stinger's own read.

## Reporting requirement

Every long-tail finding in the section report goes under a `[subjective]`-labelled heading, separate from the quantified checkpoint tables, per conduct rule 3. Reference the specific `Q-###` ID from `content-targets/questions.md` in every row.
