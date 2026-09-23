---
name: "blog-content-stinger"
description: "Bonus, conditional blog audit: 10 recent posts, word count, subjective quality read, AI-authorship reported only as a probability band with method and error rate, never a verdict. Wave W6a."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: blog-content-wasp-drone
  research-window: "2026-08-18 (single sweep)"
  primary-surface: external-website-audit
---

# Blog Content Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, Component authorship). Stage 7 (Register: pair registration in `pest-controller-suit`, deploy, sync references) has not run yet. Every claim below traces to `references/research/raw/` or to this repo's own plan/PRD documents, cited inline; two named research gaps carry through (see `references/research/distilled-blog-content.md` section 6) and are flagged wherever they matter rather than silently papered over.

## Purpose

Equips **blog-content-wasp-drone** to run a bonus, conditional audit of a target site's 10 most recent blog posts: a deterministic word count per post, a `[subjective]` semantic/quality read per post, and an AI-authorship-probability analysis per post. The AI-authorship analysis is this Stinger's binding, non-negotiable conduct rule: it is reported strictly as a probability band with the stated detection method and its documented error rate, and never, under any framing, as a flat verdict ("this post was AI-written"). Full scope and acceptance criteria: [prd-018-blog-content](../../library/requirements/backlog/prd-018-blog-content/prd-018-blog-content-index.md).

Every factual claim this skill makes about AI-content detection traces to a downloaded primary source in `references/research/raw/`. This archive is thin by design (two sources, both academic-integrity studies, neither studies blog or marketing content directly), and that thinness is itself load-bearing for why the probability-band discipline exists, see [guides/03-ai-authorship-probability-band-reporting.md](guides/03-ai-authorship-probability-band-reporting.md).

## When to use

- Wave W6a, and ONLY when a blog/content-marketing section was detected during crawl or fingerprinting (a blog-shaped path segment in `site-data/`, or a corroborating signal in `_shared/target-profile.json`). This is a conditional-activation Stinger: if no blog exists, this Drone's checkpoints resolve to 0/N/A and are excluded from the score, not penalized, per PRD-018 AC-1.
- Any request specifically about blog content quality, blog word-count trends, or AI-authorship risk on a target site's blog.

## When not to use

- The site has no blog/content-marketing section. Confirm this first per [guides/01-post-selection-and-word-count.md](guides/01-post-selection-and-word-count.md) Phase 0, then stop, do not run the rest of the procedure speculatively.
- General on-page SEO or AEO analysis of blog pages, that's `technical-seo-stinger`/`aeo-audit-stinger`'s scope, not this Stinger's.
- General site content semantics outside the blog (product copy, landing pages), that's `content-semantics-stinger`'s scope.
- Ecommerce product-page copy or catalog analysis, that's `ecommerce-catalog-stinger`'s scope, this Stinger's sibling in wave W6.

## Procedure

1. Confirm a blog is detected. If not, write the honest N/A branch and stop. See [guides/01-post-selection-and-word-count.md](guides/01-post-selection-and-word-count.md) Phase 0.
2. Run `references/scripts/select-recent-posts.py` against the run's `site-data/` to select the 10 most recent posts and compute each one's word count. See [guides/01-post-selection-and-word-count.md](guides/01-post-selection-and-word-count.md) Phases 1-3.
3. For each selected post, write the `[subjective]` semantic/quality read, labelled and kept separate from quantified fields. See [guides/02-subjective-quality-analysis.md](guides/02-subjective-quality-analysis.md).
4. For each selected post, write the AI-authorship-probability analysis: a probability band, the method, the error rate, and the basis for the estimate, in that shape every time, never as a verdict. See [guides/03-ai-authorship-probability-band-reporting.md](guides/03-ai-authorship-probability-band-reporting.md), this is the step where the AC-3 static check applies.
5. Assemble the run's `11-blog/` output using `references/templates/11-blog-summary-template.md` and `references/templates/post-finding-template.md`, including the verification log and evidence index. See [guides/04-report-and-workspace-output.md](guides/04-report-and-workspace-output.md).
6. Hand off. This Drone does not score or assemble the final customer/auditor report, `audit-scoring-wasp-drone` and `audit-reporting-wasp-drone` consume `11-blog/` downstream.

## References map

- `references/research/distilled-blog-content.md`, load when verifying any AI-content-detection claim fast, or resolving where a figure came from.
- `references/research/raw/`, load when tracing a distilled claim back to its primary source (two files: an arXiv detector-benchmark preprint, a Springer peer-reviewed detector-accuracy study).
- `references/templates/post-finding-template.md`, load when writing any single post's finding, the exact required shape for word count, `[subjective]` read, and AI-authorship band.
- `references/templates/11-blog-summary-template.md`, load when assembling the run-level `11-blog/` output.
- `references/scripts/select-recent-posts.py`, run once per run against `site-data/` to select posts and compute word counts, see `references/scripts/README.md`.
- `guides/01-post-selection-and-word-count.md` through `guides/04-report-and-workspace-output.md`, load in order for a first pass, or individually once familiar with the procedure.

## Related drones and stingers

- [ecommerce-catalog-stinger](../ecommerce-catalog-stinger) - sibling bonus/conditional Stinger, runs in parallel in wave W6b when commerce is detected; no data dependency between the two.
- [content-semantics-stinger](../content-semantics-stinger) - site-wide content-semantics analysis in wave W5; consult when a blog finding needs broader site-content context beyond the 10 sampled posts.
- [ecommerce-catalog-wasp-drone](../../agents/ecommerce-catalog-wasp-drone.md) - this Stinger's sibling Drone; the orchestrator dispatches both in parallel when their respective content types are detected.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [ecommerce-catalog-stinger](../ecommerce-catalog-stinger) - sibling bonus/conditional Stinger, wave W6b.

## Ship Gate decision

Ship Gate removed: research-only Stinger. This Drone never commits, edits, or pushes code, it reads an already-crawled `site-data/` corpus and writes audit findings to the run's own external workspace folder (`11-blog/`), never to this repository's tracked source. `security-stinger`, `quality-stinger`, and `github-repo-health-stinger` gate work that touches this repository's own codebase; this Stinger produces no such diff, so the Ship Gate does not apply.
