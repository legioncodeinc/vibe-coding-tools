# `content-targets/questions.md` template

Copy-ready output template. Per PRD-006 AC-3, this file must contain between 25 and 50 entries
when the run completes, each with a source-tier tag. Same tag legend as
`references/templates/keywords-template.md`; questions use the same four tier tags.

Customer questions differ from keywords in shape (a full question, not a short phrase) but follow
the identical source-priority chain, since the same GSC query data, Trends "Related Queries"
export, AI-inferred FAQ-shaped content, or paid-API "question keywords" filter can all surface
question-shaped search intent, not just short-phrase intent.

## Table

| # | Question | Source tier | Volume | Notes |
|---|---|---|---|---|
| 1 | `{full customer question, e.g. "how much does {product category} cost"}` | `{search-console \| customer-trends \| ai-inference \| paid-api}` | `{number, relative score 0-100, or "volume-unknown"}` | `{provenance detail, same conventions as keywords-template.md}` |
| ... | ... | ... | ... | ... |

## Deriving questions per tier

- **Tier 1 (search-console):** GSC query data naturally includes question-shaped queries (queries
  starting with who/what/where/when/why/how, or containing a question mark). Filter the same
  Search Analytics API pull for these patterns rather than running a second, separate query.
- **Tier 2 (customer-trends):** the "Related Queries" module of a Google Trends export
  (`content-targets/trends-raw/`) often surfaces question-shaped rising queries directly; treat
  these the same way as any other Trends-sourced entry (relative score, never a volume number).
- **Tier 3 (ai-inference):** infer questions from the site's own FAQ sections, product-page Q&A
  blocks, and support/help content, plus generated "a buyer at this ICP's stage would ask..."
  candidates grounded in `02-positioning/` (the ICP and buyer-readiness output this pair reads).
  AI-generated candidate questions not drawn from an on-site source should still be tagged
  `ai-inference` and `volume-unknown`, and should read as genuinely representative buyer questions,
  not generic template filler.
- **Tier 4 (paid-api):** both DataForSEO (Keyword Suggestions via full-text/question search) and
  Ahrefs (`terms` parameter set to questions-only) expose an explicit questions-only filter; use it
  rather than post-filtering a general keyword pull.

## Provenance summary block (required, appended after the table)

Same structure as `keywords-template.md`'s provenance summary block, with `Total keywords`
replaced by `Total questions` and the 25-50 range instead of 75-100.
