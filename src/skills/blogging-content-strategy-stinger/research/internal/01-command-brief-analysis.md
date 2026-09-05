---
source_url: internal://command-briefs/blogging-content-strategy-worker-bee-command-brief.md
retrieved_on: 2026-05-20
source_type: internal-brief
authority: official
relevance: critical
topic: stinger-scope
stinger: blogging-content-strategy-stinger
---

# Command Brief Analysis: blogging-content-strategy-worker-bee

## Summary

The Command Brief defines an opinionated editorial blogging specialist that owns the complete content strategy and execution layer for a blog. It does NOT own technical SEO (canonical, robots, schema, CWV — those belong to `seo-aeo-worker-bee`) or website structure (that belongs to `website-worker-bee`). The stinger must encode 8 distinct ACTION items, each mapping to a specific guide or template.

## Action items stinger-forge must build guides for

| Action | Guide | Description |
|---|---|---|
| 1. Audit / architect topical authority | `guides/01-cluster-pillar-architecture.md` | Map existing content into cluster-pillar; find gaps and cannibalization |
| 2. Calibrate post length by intent | `guides/02-post-length-by-intent.md` | Intent-driven word count with reasoning trace; never generic "2000 words" |
| 3. Author / audit titles and meta descriptions | `guides/03-title-meta-description.md` | Title formula matrix + 58-char meta discipline + CTR/AEO alignment |
| 4. Scope keyword research | `guides/04-keyword-research.md` | Three-tier methodology (head + supporting + question-intent long-tail); tool-agnostic |
| 5. Format post for AEO | `guides/05-aeo-formatting.md` | Six-point AEO checklist: H1, definition block, H2/H3 hierarchy, paragraph discipline, numbered steps, summary/FAQ schema |
| 6. Write / audit the CTA | `guides/06-cta-copywriting.md` | Conversion-without-manipulation framework; specific dark pattern naming |
| 7. Run content review checklist | `templates/content-review-checklist.md` | Fill-in template with pass/fail per item + blocking/non-blocking flag |
| 8. Produce / audit editorial calendar | `guides/07-editorial-calendar.md` | Cluster-first sequencing; solo founder: 12-post quarterly plan, not 52-post wish list |

## Critical directives stinger-forge must encode

1. **Never give generic length advice** ("aim for 2000 words"). Post length must be calibrated to intent.
2. **Always produce a keyword set, not just a primary keyword.** Supporting terms + question-intent variants drive AEO and semantic depth.
3. **Scope editorial calendar to real capacity.** Sustainable cadence beats burst-and-quit.
4. **Do not recommend paid keyword tools without first asking.** Free tools (GSC, Answer The Public, Keyword Surfer) are sufficient for most stage 0-1 founders.
5. **Every CTA audit must name the specific dark pattern it avoids.** Vague directives produce vague copy.
6. **Handoff technical SEO findings to `seo-aeo-worker-bee` explicitly.** Name the handoff.

## IDEAS from Command Brief for stinger-forge to act on

- `guides/00-principles.md` should anchor: "depth-of-answer beats word count" and "sustainable cadence beats burst"
- `guides/01-cluster-pillar-architecture.md` should include a worked example: 3-cluster SaaS product blog with 5 supporting posts per cluster
- `guides/04-keyword-research.md` should include free-tier toolchain (GSC + Keyword Surfer + AnswerThePublic) AND paid-tier toolchain (Ahrefs + Semrush) with decision points
- `guides/05-aeo-formatting.md` must distinguish: Featured Snippet targeting (definition blocks, concise paragraphs) vs. LLM citation readiness (structured data, authoritative tone, E-E-A-T signals)
- `templates/content-review-checklist.md` must be a fill-in template, NOT a prose guide
- `examples/audit-existing-blog.md` — fictional SaaS blog audit with specific findings per checklist item
- `examples/greenfield-blog-setup.md` — full workflow from "no blog" to "12-post quarterly plan + first post outlined"
- The Angel should handle "should I start a blog at all?" with a gating question (3 signals: organic search viable GTM, team has time, brand needs authority-building)

## Annotations for stinger-forge

- The Command Brief explicitly calls out the "depth-of-answer beats word count" principle as one of two "load-bearing beliefs" — this must appear prominently in `guides/00-principles.md`
- The 58-character meta-description discipline referenced in ACTION #3 differs from the 150-160 character standard for full meta descriptions — this likely means 58 chars is a specific display constraint to verify (or it may refer to a title-tag character limit; cross-reference with CTR research in `external/03-title-meta-description-ctr.md`)
- The Angel must defer to `seo-aeo-worker-bee` for: canonical tags, hreflang, robots.txt, Core Web Vitals, schema markup (technical implementation)
- The Angel explicitly OWNS: editorial structure, heading hierarchy, content formatting for AEO (the conceptual layer, not the JSON-LD implementation)
