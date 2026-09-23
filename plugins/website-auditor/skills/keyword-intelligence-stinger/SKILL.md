---
name: "keyword-intelligence-stinger"
description: "Compiles 75-100 keywords + 25-50 questions via a strict 4-tier source chain: Search Console MCP, then customer Trends export, then EXA/Firecrawl inference, then paid API. Degrades gracefully."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: keyword-intelligence-wasp-drone
  research-window: "2026-08-18 (round 2 sweep: tiers 1-2; round 3 deeper sweep: tiers 3-4, same day)"
  primary-surface: external-website-audit
---

# Keyword Intelligence Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final
> Skill/Drone authorship). Stage 7 (Register: pest-controller-suit roster entry, deploy, cross-repo
> reference sync) has not run yet. Every factual claim below traces to
> `references/research/raw/` via `references/research/distilled-keyword-intelligence.md`, or is
> flagged explicitly as a judgment call. See `guides/03-tier-3-ai-inference.md` in particular for a
> binding sequencing note (Tier 3 cannot read `site-data/`, which does not exist yet at this wave)
> that neither PRD states outright but follows directly from the two PRDs' own wave numbers.

You are equipping **keyword-intelligence-wasp-drone**, part of the Website Auditor by Legion Code
Inc. plugin. Full scope and acceptance criteria: [prd-006-keyword-intelligence](../../library/requirements/backlog/prd-006-keyword-intelligence/prd-006-keyword-intelligence-index.md).

## Purpose

Compiles 75-100 keywords and 25-50 customer questions under `content-targets/`, using a strict
4-tier source-priority chain, in order: (1) a connected Google Search Console MCP that returns
query data for the domain, (2) a customer-supplied Google Trends export, (3) EXA/Firecrawl-style AI
or statistical inference from the site's own content, (4) a paid keyword API as last resort. Every
output entry is tagged with the tier that actually produced it, so the report can disclose data
provenance, and the chain degrades gracefully through unavailable tiers with no user-visible error.

## When to use

- Wave W3, sync, immediately after the ICP gate (`icp-positioning-wasp-drone`) passes
- Any re-run where a Search Console MCP connection newly became available mid-project (re-run to
  upgrade previously Tier 3/4-sourced keywords to Tier 1 provenance where possible)
- Auditing which source tier actually produced a given keyword, for provenance disclosure in the
  customer-facing report

## When not to use

- Not for deriving the site's niche, ICP, or buyer-readiness framing. That is
  `icp-positioning-stinger`, which this pair reads from (`02-positioning/`) and never re-derives.
- Not for crawling the site page-by-page. That is `site-crawler-stinger`, which this pair does NOT
  depend on (it runs one wave later, W4) and must not be treated as a Tier-3 data source; see
  `guides/03-tier-3-ai-inference.md`.
- Not for the actual SEO/AEO technical audit of how these keywords perform on-page. That is
  `technical-seo-stinger` and `aeo-audit-stinger`, which read `content-targets/` as an input in a
  later wave.

## Procedure

1. Read `02-positioning/` for ICP, niche, and buyer-readiness context. Do not re-derive it.
2. Check Tier 1 (Search Console MCP connected and has data). If satisfied, use it exclusively.
3. Else check Tier 2 (customer-supplied Trends export present). If satisfied, use it, and archive
   the raw file(s) unmodified under `content-targets/trends-raw/` per PRD-006 AC-4.
4. Else fall through to Tier 3: independently fetch the site's own key pages and infer candidates.
   Never mark inferred candidates with a fabricated volume; use `volume-unknown`.
5. If the running count is below PRD-006's required minimum (75 keywords / 25 questions) and a
   paid-API budget is approved, escalate to Tier 4 to fill the gap only. If no budget is approved,
   stop and flag the gap rather than fabricate candidates.
6. Write `content-targets/keywords.md` (75-100 entries) and `content-targets/questions.md`
   (25-50 entries), each tagged with source tier, per `references/templates/keywords-template.md`
   and `references/templates/questions-template.md`.
7. Append the provenance summary block to both files, and record tier skips in the run ledger
   (never as a user-visible error).

Full decision logic: `guides/05-fallback-chain-and-provenance.md`. Deterministic implementation:
`references/scripts/fallback-chain-decision.py`.

## References map

- `references/templates/keywords-template.md`, load when writing or reviewing
  `content-targets/keywords.md`.
- `references/templates/questions-template.md`, load when writing or reviewing
  `content-targets/questions.md`.
- `references/templates/trends-raw-readme-template.md`, load whenever Tier 2 is used, to file the
  `content-targets/trends-raw/README.md` manifest.
- `references/scripts/fallback-chain-decision.py`, run before finalizing output, to get an
  auditable tier decision instead of reasoning it out fresh each time.
- `references/research/distilled-keyword-intelligence.md`, load when a tier-mechanics claim needs
  verification or a dispute needs settling.
- `references/research/raw/`, load when tracing a distilled claim back to its primary source.
- `guides/01-tier-1-search-console.md` through `guides/05-fallback-chain-and-provenance.md`, load
  per-tier as described in each guide's own heading.

## Related drones and stingers

- [icp-positioning-stinger](../icp-positioning-stinger) - upstream dependency, writes
  `02-positioning/`, this pair's binding ICP/niche input.
- [stack-fingerprint-stinger](../stack-fingerprint-stinger) - runs before this pair (W1a); not a
  direct read dependency, but relevant if platform context is needed for Tier 3 page selection.
- [site-crawler-stinger](../site-crawler-stinger) - runs one wave AFTER this pair (W4), so this
  pair must NOT depend on `site-data/`. See `guides/03-tier-3-ai-inference.md` for the sequencing
  note this creates.
- [technical-seo-stinger](../technical-seo-stinger) - downstream reader of `content-targets/` in a
  later wave.
- [aeo-audit-stinger](../aeo-audit-stinger) - downstream reader of `content-targets/` in a later
  wave.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [keyword-intelligence-wasp-drone](../../agents/keyword-intelligence-wasp-drone.md) - this Stinger's paired Drone.
  - [icp-positioning-stinger](../icp-positioning-stinger) - upstream dependency, read first for ICP/niche context.

## Ship Gate

Ship Gate not applicable to this Stinger's own runtime procedure. This Stinger's output
(`content-targets/`) is written into the external customer's audit workspace
(`www.<domain>-audit/content-targets/`), not into this plugin repository's own tracked source, so a
keyword-intelligence run produces no committable code inside this repo for security-stinger,
quality-stinger, or github-repo-health-stinger to gate. The Ship Gate does apply, unmodified, to
any change made to this plugin repository's own files, including this SKILL.md, its guides, its
references, and `references/scripts/fallback-chain-decision.py`, before that change is committed
and pushed.
