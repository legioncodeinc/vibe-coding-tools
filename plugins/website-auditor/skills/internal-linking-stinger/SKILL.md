---
name: "internal-linking-stinger"
description: "Internal link-graph analysis: orphan-page detection, click-depth via BFS, four-dimension anchor-text scoring plus cannibalization detection, internal-PageRank-style equity flow. Wave W5."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: internal-linking-wasp-drone
  research-window: "2026-08-18 (three research rounds; round 3 closed the original link-graph-mechanics gap)"
  primary-surface: external-website-audit
---

# Internal Linking Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final authorship). Stage 7 (registration/deployment sync) has not run. Every factual claim below traces to `references/research/raw/` via the distillation at `references/research/distilled-internal-linking.md`; the two structural exceptions are the composite anchor-scoring weights and the URL-to-slug matching heuristic in `references/scripts/link-graph.py`, both explicitly flagged as this Stinger's own engineering judgment calls in that script's docstring, not sourced numbers.

You are equipping **internal-linking-wasp-drone**, part of the Website
Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria:
[prd-011-internal-linking](../../library/requirements/backlog/prd-011-internal-linking/prd-011-internal-linking-index.md).

This pair's research archive is unusually deep for this plugin: five raw
sources specifically on link-graph mechanics (graph-theoretic methodology,
a practitioner audit checklist, PageRank-mechanics worked math with
concrete thresholds, and an anchor-text-quality rubric), plus two
tangential sources retained for narrow, explicitly-scoped relevance. Use
that depth. Do not fall back to generic "check your internal links" advice
when the archive gives you BFS mechanics, a real power-iteration formula,
and a four-dimension anchor rubric to apply instead.

## Purpose

Build a directed internal link graph from `site-data/` (already crawled,
read-only) and produce the run's `03-seo/internal-linking.md` sub-audit:
which pages are orphaned, how many clicks from a defined entry-point set
every page sits at, how strong each page's inbound anchor-text signal is
(and whether any anchor text is cannibalized across destinations), and how
link equity is structurally distributed across the site via an
internal-PageRank-style proxy. Also produces a short deep-linking handoff
summary for `technical-seo-wasp-drone` so that Drone does not re-derive the
graph.

## When to use

- Wave W5 of every audit run, once `site-crawler-wasp-drone` has finished
  writing `site-data/`
- Any time a downstream Drone (`technical-seo-wasp-drone`,
  `audit-scoring-wasp-drone`) needs a link-graph fact and should read this
  Stinger's output rather than re-deriving it
- Diagnosing why an important page is not ranking or not getting indexed
  when the cause might be structural (buried too deep, orphaned, starved
  of equity) rather than a content problem

## When not to use

- Crawling the site or fetching a page not already in `site-data/`. This
  Stinger never crawls; that is `site-crawler-wasp-drone`'s job
  (PRD-007). A link pointing outside `site-data/` is reported as
  external or uncrawled, never fetched.
- Judging copy quality, reading level, or ICP relevancy of a page's
  content. That is `content-semantics-stinger`'s scope.
- Judging external backlink profile or off-site authority. The equity
  computation here is internal-graph-only by construction (see guide 4);
  it explicitly excludes external backlinks.
- Re-deriving the full internal link graph inside `technical-seo-wasp-drone`'s
  deep-linking sub-check. Read this Stinger's handoff summary instead.

## Procedure

1. Confirm `site-data/` is populated (read-only), then build the graph and
   compute every metric in one deterministic pass via
   `references/scripts/link-graph.py`. See
   `guides/01-graph-construction-and-orphan-detection.md`.
2. Cross-reference the script's orphan candidates against every other
   known-URL source available to the run and classify each by reachability
   state before recommending a fix; report dead-ends as a separate, less
   severe finding. See `guides/01-graph-construction-and-orphan-detection.md`.
3. Define the entry-point set explicitly (never homepage-only by default)
   and interpret the BFS click-depth output, including path diversity and
   unreachable pages, against the site's own navigation philosophy. See
   `guides/02-click-depth-bfs.md`.
4. Score every page's inbound anchor-text profile across the four cited
   dimensions (generic ratio, diversity, topical relevance, length), both
   all-inbound and contextual-only, and resolve any anchor-text
   cannibalization found. See `guides/03-anchor-text-scoring.md`.
5. Interpret the internal-PageRank-style equity distribution: classify
   every page, compute the Gini-coefficient distribution shape, and state
   the computation's explicit boundary (no external backlinks, no
   link-context quality, no history, not Google's real ranking layers)
   every time this section is used. See `guides/04-link-equity-pagerank.md`.
6. Assemble `03-seo/internal-linking.md` from
   `references/templates/internal-linking-report-template.md`, fill the
   findings-register rows with the mandatory numeric value, evidence
   pointer, and one-line justification per row, log any
   rejected/reframed candidate, and produce the deep-linking handoff
   summary for `technical-seo-wasp-drone`. See
   `guides/05-report-assembly-and-handoff.md`.

## References map

- `references/research/distilled-internal-linking.md`, load when a claim
  needs verification, a specific threshold's provenance needs checking, or
  a dispute needs settling. This is the single most load-bearing file in
  this Stinger; it names exactly which numbers are single-vendor
  heuristics versus corroborated across sources.
- `references/research/raw/`, load when tracing a distilled claim back to
  its primary source, or when the distillation's citation feels thin and
  you want the original context.
- `references/scripts/link-graph.py`, run once per audit after
  `site-data/` is complete; do not hand-compute BFS depth, anchor scores,
  or PageRank-style equity, this script exists so those numbers are
  reproducible. Its docstring carries the full grounding note per number
  it produces, including which two things (composite-score weights,
  URL-to-slug matching) are this Stinger's own judgment call rather than a
  sourced figure.
- `references/templates/internal-linking-report-template.md`, load when
  assembling `03-seo/internal-linking.md`; mirrors the script's JSON
  output field for field.
- `references/templates/edge-record-template.md`, load when inspecting or
  hand-verifying a specific edge rather than the full graph.
- `references/templates/deep-linking-handoff-summary-template.md`, load
  when producing the summary `technical-seo-wasp-drone` reads instead of
  re-deriving the graph.
- `guides/01-graph-construction-and-orphan-detection.md` through
  `guides/05-report-assembly-and-handoff.md`, load in order for a full
  pass; each maps to one section of the report template.

## Related drones and stingers

- [content-semantics-stinger](../content-semantics-stinger) - Subjective
  copy interpretation and reading-level scoring for the same crawled page
  set. Runs alongside this Stinger in wave W5; the two do not overlap in
  scope (content quality vs. link structure) and neither duplicates the
  other's output.
- [technical-seo-stinger](../technical-seo-stinger) - Owns the run's
  broader technical-SEO sub-audit, including a deep-linking sub-check that
  reads this Stinger's handoff summary rather than re-deriving the graph.
- [icp-positioning-stinger](../icp-positioning-stinger) - Owns the run's
  ICP and conversion-action taxonomy, referenced (not duplicated) when
  this Stinger judges which under-served pages are "important per
  strategy" in the equity-flow section.
- [site-crawler-stinger](../site-crawler-stinger) - Produces the
  `site-data/` this Stinger reads read-only. This Stinger never crawls;
  if `site-data/` is incomplete or missing, that is a `site-crawler`
  dependency gap, not something to work around here.
- [internal-linking-wasp-drone](../../agents/internal-linking-wasp-drone.md) -
  this Stinger's paired Drone.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [technical-seo-stinger](../technical-seo-stinger) - Deep-linking sub-check consumer of this Stinger's handoff summary.
  - [content-semantics-stinger](../content-semantics-stinger) - Sibling wave-W5 Stinger, subjective copy quality rather than link structure.
  - [icp-positioning-stinger](../icp-positioning-stinger) - ICP and conversion-action taxonomy referenced when judging "important per strategy" pages.

## Ship Gate

Ship Gate removed: research-only stinger, produces no committable code.
This Stinger's output is a findings report (`03-seo/internal-linking.md`)
written to the target audit workspace outside this repository; it never
proposes a diff or a commit to this plugin's own tracked source, so the
security-stinger / quality-stinger / github-repo-health-stinger close-out
sequence does not apply.
