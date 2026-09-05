# Write LLM-friendly docs (Fern)

- **Title:** Write LLM-friendly docs in March 2026
- **URL:** https://buildwithfern.com/post/how-to-write-llm-friendly-documentation
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (documentation platform vendor)

**Archived primarily as an exhibit in the evidence audit.** This is a representative, well
written example of the "write your docs for AI" genre, and almost none of it is sourced.

## Recommendations and their evidence status

| Recommendation | Evidence offered |
|---|---|
| Structure with clear heading hierarchies | none |
| Keep sections under a heading self-contained | none |
| Explicit type definitions in API specs | none |
| Complete error response schemas | none |
| Serve markdown by content negotiation | none |
| Publish llms.txt at site root | points at the spec, not at a result |
| Use llms-only and llms-ignore markers | none |
| Do not spread one concept across sections | none |
| State relationships explicitly rather than implying them | none |
| Generate docs from API definitions | none |
| Version control the docs | none |

## The two numbers in the article

- Quoted: "Converting documentation pages from HTML to markdown typically reduces token
  consumption by over 90%." No source, no methodology, no sample. Note this is directionally
  consistent with Cloudflare exposing per-page token deltas, but the specific figure here is
  unbacked.
- A Gartner 2024 forecast that over 30 percent of the increase in API demand by 2026 would
  come from AI and LLM tools. This one is attributed. It is also a market forecast and says
  nothing about document quality.

## Reading

The advice is not obviously wrong. Several items have a plausible mechanism behind them and
one, self-contained sections, is independently supported by retrieval research on chunk
context. The honest position is that this genre is convention rather than evidence, and a
skill that repeats it should say so rather than presenting it as findings.
