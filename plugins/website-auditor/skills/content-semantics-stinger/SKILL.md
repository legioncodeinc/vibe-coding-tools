---
name: "content-semantics-stinger"
description: "Quantified reading-level estimate (Flesch Reading Ease/Grade Level) plus a subjective ICP-relevancy score per crawled page, kept in separate sections. Wave W5."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: content-semantics-wasp-drone
  research-window: "2026-08-18 (single sweep, two clusters: seo-standards, aeo-and-answer-engines)"
  primary-surface: external-website-audit
---

# Content Semantics Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final authorship). Stage 7 (registration/deployment sync) has not run. Every content-quality/AEO claim below traces to `references/research/raw/` via the distillation at `references/research/distilled-content-semantics.md`. One explicit exception, stated wherever it matters: the Flesch Reading Ease / Flesch-Kincaid Grade Level formula this pair uses to satisfy PRD-010 AC-1 is NOT sourced from this Stinger's research archive (that archive has zero readability-formula coverage, confirmed in the distillation's own section 8 gap note); it is a well-established public-domain formula applied as this Stinger's own judgment call, disclosed as such in `references/scripts/reading-level.py`'s docstring and in guide 1.

You are equipping **content-semantics-wasp-drone**, part of the Website
Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria:
[prd-010-content-semantics](../../library/requirements/backlog/prd-010-content-semantics/prd-010-content-semantics-index.md).

## Purpose

Produce the run's `03-seo/content-semantics.md` sub-audit: a quantified,
formula-shown reading-level estimate for every crawled page, and a
separately-labeled `[subjective]` ICP-relevancy score per page against the
ICP `icp-positioning-stinger` already determined. These are two
independent findings about the same page and must never be merged into one
number or one section; a page can be effortlessly readable and completely
off-ICP, or dense and jargon-heavy yet exactly on-ICP for a technical
buyer persona.

## When to use

- Wave W5 of every audit run, reading `site-data/` and `02-positioning/`
  (both read-only)
- Distinguishing a genuinely low-reading-level page from one that is
  merely off-ICP; the two are commonly conflated and this Stinger exists
  specifically to keep them apart
- Judging whether a page clears Google's stated "non-commodity content"
  bar as one input to the ICP-relevancy score

## When not to use

- Technical structure, metadata, indexation, or internal-link-graph
  analysis of the same pages. That is `technical-seo-stinger`'s and
  `internal-linking-stinger`'s scope respectively.
- Determining the site's niche, ICP, or conversion-action taxonomy from
  scratch. That is `icp-positioning-stinger`'s scope; this Stinger applies
  its output, never re-derives it.
- Crawling or fetching a page not already in `site-data/`. This Stinger
  never crawls; that is `site-crawler-wasp-drone`'s job.

## Procedure

1. Run `references/scripts/reading-level.py` against `site-data/*.md` to
   produce the quantified reading-level estimate (word/sentence/syllable
   counts, Flesch Reading Ease, Flesch-Kincaid Grade) per page, stating the
   formula-choice grounding caveat explicitly. See
   `guides/01-reading-level-scoring.md`.
2. Read `02-positioning/`'s ICP and conversion-action taxonomy (do not
   re-derive it) and apply `references/templates/icp-relevancy-scoring-
   rubric-template.md` to score every page's `[subjective]` ICP-relevancy,
   including the non-commodity-content check. See
   `guides/02-icp-relevancy-scoring.md`.
3. Observe and report the supporting content-structure signals (lead-
   paragraph length against both cited ranges, heading structure, schema
   presence) that inform the ICP-relevancy judgment, each with its
   sourcing caveat. See `guides/03-content-structure-signals.md`.
4. Assemble `03-seo/content-semantics.md` from
   `references/templates/content-semantics-report-template.md`, keeping
   the quantified and subjective sections clearly separate, fill the
   findings-register rows, and log any rejected/reframed candidate. See
   `guides/04-report-assembly.md`.

## References map

- `references/research/distilled-content-semantics.md`, load when a claim
  needs verification, or to check section 8's gap list before assuming
  this archive covers something it does not (readability formulas,
  ICP-scoring methodology).
- `references/research/raw/`, load when tracing a distilled claim back to
  its primary source.
- `references/scripts/reading-level.py`, run once per audit against
  `site-data/*.md`; do not hand-count words, sentences, or syllables. Its
  docstring carries the formula-grounding caveat in full.
- `references/templates/content-semantics-report-template.md`, load when
  assembling `03-seo/content-semantics.md`.
- `references/templates/icp-relevancy-scoring-rubric-template.md`, load
  when scoring the `[subjective]` ICP-relevancy checkpoint; bridges the
  build plan's universal zero-to-six scale to this specific checkpoint.
- `guides/01-reading-level-scoring.md` through
  `guides/04-report-assembly.md`, load in order for a full pass; each maps
  to one section of the report template.

## Related drones and stingers

- [icp-positioning-stinger](../icp-positioning-stinger) - owns the ICP,
  niche, and conversion-action taxonomy this Stinger applies to score
  page-level relevancy. Read its output, never duplicate its taxonomy.
- [internal-linking-stinger](../internal-linking-stinger) - sibling
  wave-W5 Stinger over the same `site-data/`, link-structure analysis
  rather than copy quality; runs concurrently, no write contention.
- [technical-seo-stinger](../technical-seo-stinger) - owns the technical
  structure, metadata, and indexation sub-audit for the same page set;
  content quality (this Stinger) and technical structure are scored
  separately per the build plan's weight table.
- [content-semantics-wasp-drone](../../agents/content-semantics-wasp-drone.md) -
  this Stinger's paired Drone.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [icp-positioning-stinger](../icp-positioning-stinger) - ICP and conversion-action taxonomy this Stinger applies but does not own.
  - [internal-linking-stinger](../internal-linking-stinger) - sibling wave-W5 Stinger, link structure rather than copy quality.
  - [technical-seo-stinger](../technical-seo-stinger) - technical structure/metadata sub-audit over the same page set.

## Ship Gate

Ship Gate removed: research-only stinger, produces no committable code.
This Stinger's output is a findings report (`03-seo/content-semantics.md`)
written to the target audit workspace outside this repository; it never
proposes a diff or a commit to this plugin's own tracked source, so the
security-stinger / quality-stinger / github-repo-health-stinger close-out
sequence does not apply.
