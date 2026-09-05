# Research archive for knowledge-base-builder

Domain: technical documentation architecture, decision record practice, requirements
document structure, documentation as context for language models, and documentation
staleness. Swept 2026-08-17 with web search and direct page fetches.

## How to use this folder

Read `distilled-documentation-architecture.md` first. It is the only file the skill's guides
cite directly, and every claim in it ends in a bracketed pointer to a file in `raw/`. If a
domain claim appears anywhere in this skill without a trail through the distillation to a raw
file, that is a defect.

## Window

Sources range from 2011 to 2026. The default 6-month window was deliberately exceeded for
four foundational primaries: Nygard's 2011 ADR article, MADR 4.0 from 2024, and the two
academic papers from 2020 and 2024. Those formats and findings are the stable part of this
domain and nothing newer replaces them. Everything in the AI-ingestion and maintenance
sections is from 2024 or later.

## Contents

| File | Type | What it supports |
|---|---|---|
| `distilled-documentation-architecture.md` | distillation | Every domain claim in the guides |
| `raw/docs-architecture--diataxis--diataxis-official.md` | official-docs | The four modes, the two axes, the boundary-blurring failure |
| `raw/adr--nygard-format--cognitect-2011.md` | primary source | The five ADR sections, immutability, supersession |
| `raw/adr--madr-template--adr-github-2024.md` | official-docs | MADR sections, frontmatter fields, version history |
| `raw/adr--templates-overview--adr-github.md` | official-docs | Y-statement, template landscape, and the named absence of selection guidance |
| `raw/adr--operational-practice--konishi-2026.md` | community | Naming, numbering, lifecycle, index, granularity, seven anti-patterns |
| `raw/prd--structure--shauchenka-2026.md` | community | PRD anatomy, testable criteria, the specificity rule, the non-goals gap |
| `raw/brand--positioning-components--dunford.md` | primary practitioner | The five positioning components and their working order |
| `raw/contradiction--wikicontradict--neurips-2024.md` | academic | The load-bearing citation: models rarely surface conflicts unprompted |
| `raw/contradiction--knowledge-conflict--arxiv-2506-06485.md` | academic, preprint | An unresolved conflict degrades surrounding task performance |
| `raw/retrieval--chunk-context--arxiv-2504-19754.md` | academic, preprint | Self-contained sections retrieve better, and by how little |
| `raw/ai-ingestion--context-engineering--anthropic-2025.md` | official-docs | Context rot, the attention budget, ambiguity, just-in-time loading |
| `raw/ai-ingestion--llms-txt--llmstxt-org.md` | official-docs | The curated-index format, and adoption standing in for evidence |
| `raw/ai-ingestion--markdown-for-agents--cloudflare-docs.md` | official-docs | Predictable three-part layout, per-page token measurement surface |
| `raw/ai-ingestion--llm-friendly-docs--fern-2026.md` | vendor-blog, LOW EVIDENCE | Exhibit A in the evidence audit: eleven recommendations, zero sources |
| `raw/ai-ingestion--agents-md-corpus--github-blog-2026.md` | vendor-blog | 2,500 repositories claimed, no numbers published |
| `raw/glossary--acronyms-rag--shelf-2026.md` | vendor-blog, LOW TRUST | Jargon failure mechanisms; its 70 percent statistic is unsourced |
| `raw/docs-maintenance--practitioner-survey--aghajani-icse-2020.md` | academic | 146 practitioners: clarity outranks completeness, absence outranks error |
| `raw/docs-maintenance--living-docs--falconer-2026.md` | vendor-blog | Staleness signals; its headline numbers are unsupported |

18 raw sources.

## Where sources conflict

**Review cadence.** The ADR practice source prescribes a quarterly review of the whole
collection [raw/adr--operational-practice--konishi-2026.md]. The maintenance vendor argues
quarterly audits find drift months too late and prescribes point-of-change hooks instead
[raw/docs-maintenance--living-docs--falconer-2026.md]. Both readings are stated in section 6
of the distillation. This skill prefers periodic review, because the vendor's alternative
depends on a merge event that does not exist for a pack built from conversation.

## Named gaps

Six, listed in section 8 of the distillation. The two that matter most:

- Nothing in this archive measures document structure against AI task success on private
  project material. Most of the widely repeated "write your docs for AI" advice is convention
  with a plausible mechanism, not a finding, and the distillation marks each item as
  evidenced, measured, or asserted.
- Nothing here covers reconstructing documentation from conversational capture. Every
  documentation source assumes an author who already knows the answer. The reconstruction
  problem is governed by `references/evidence-standards.md`, not by this archive.

## Design decisions taken without archive support

Six, listed in section 9 of the distillation, including the recency-wins rule, the
sensitive-material segregation, and the refresh cadence. None of them are presented anywhere
in this skill as researched practice.
