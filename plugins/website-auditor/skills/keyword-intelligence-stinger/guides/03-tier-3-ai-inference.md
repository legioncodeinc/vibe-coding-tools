# 03. Tier 3: EXA/Firecrawl-style AI/statistical inference

Grounded in `references/research/distilled-keyword-intelligence.md` section 3
(`raw/github-com-divyambhutani-crawl-core.md`, `raw/serpwise-ai-docs-content-analysis.md`), with
one binding architectural note this archive alone does not surface.

## Critical sequencing note: `site-data/` does not exist yet at this point

keyword-intelligence-wasp-drone runs in wave **W3**. site-crawler-wasp-drone, which writes
`site-data/`, runs in wave **W4**, one wave later (per both PRDs' `Execution wave` fields and the
build plan's dependency graph). PRD-006's Shared workspace contract confirms this Drone's only read
input is `02-positioning/`; it does not list `site-data/` as a read dependency, because it cannot:
that folder has not been written yet when this Drone runs.

**Consequence for Tier 3:** "inferred from crawled site content" cannot mean "read
`site-data/`." This Drone must independently fetch or search the site's own content itself (via
EXA/Firecrawl-style tools, or a direct `WebFetch` of the landing page and a handful of
`02-positioning/`-referenced key pages) rather than depending on site-crawler-wasp-drone's output.
This is a judgment call, not stated explicitly in either PRD, but it follows directly and
unambiguously from the two PRDs' own wave numbers and shared-workspace contracts; flagged here so
no future maintainer "fixes" this Drone by pointing it at `site-data/` and silently breaks it on any
engagement where wave ordering is enforced strictly.

## Two real-world precedents for the inference method (neither is EXA/Firecrawl by name)

Neither raw source in this Stinger's archive is an EXA or Firecrawl product document; both are
real, working precedents for the same underlying job (infer distinctive keywords from a page's own
content when no first-party search data exists):

- **`crawl_core`'s 4-tier local extraction cascade**: JSON-LD structured data first, then spaCy
  noun-chunk extraction, then Open Graph tags, then YAKE (statistical, unsupervised
  keyword-extraction) as the final fallback when nothing else yields terms. Its cloud alternative
  is a single LLM call (Gemini 2.5 Flash) that classifies and extracts inline, at roughly
  $0.001/request. Either shape is a valid Tier-3 implementation pattern: a graduated local cascade,
  or a single well-prompted model call over fetched page content.
- **Serpwise's TF-IDF extraction**, computed per-page against the rest of the same domain's pages,
  explicitly framed for "verifying pages target their intended topics and for spotting content
  gaps," i.e. diagnostic, not a search-demand signal. Its discriminative power specifically comes
  from weighting a page's terms against other pages on the SAME domain, so it works better with
  more pages fetched, not fewer. Given this tier cannot yet read `site-data/` (see above), this
  Drone's own direct-fetch pass should pull at least the pages `02-positioning/` already identifies
  as most relevant (home, pricing/product, about, and any page the ICP analysis cites as
  conversion-relevant) rather than a single landing page, to give either extraction method enough
  material to be genuinely discriminative.

## Coverage gap, stated plainly

Neither raw source is EXA's or Firecrawl's own documentation. If a specific EXA or Firecrawl API
call shape, rate limit, or pricing detail is needed at implementation time, that is unresearched in
this archive and should be pulled fresh rather than assumed. Use EXA/Firecrawl's own MCP tool
descriptions (available at runtime via tool discovery) as the authoritative shape for the actual
call, and treat this guide's "cascade vs. single-call" framing as the methodology precedent, not
the API contract.

## The binding rule: never fabricate volume

Per PRD-006's Non-Goals: "does not fabricate search-volume numbers when only tier-3... data
exists; unquantified keyword candidates are still included but explicitly marked as
volume-unknown." Every Tier-3 entry is tagged `ai-inference` with Volume literally set to
`volume-unknown` in `content-targets/keywords.md`/`questions.md`. Do not estimate, round, or imply
a number, even a hedged one ("low", "moderate") in the Volume column itself; qualitative framing
belongs in the Notes column if it is genuinely evidence-based (e.g. "appears in 4 of 6 fetched
pages' headings"), not a disguised volume guess.
