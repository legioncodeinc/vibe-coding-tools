---
name: "site-crawler-stinger"
description: "Platform-aware crawl to depth 100, raw HTML+MD storage in site-data/, which nine Wave-5 Drones then read read-only with zero write contention."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: site-crawler-wasp-drone
  research-window: "2026-08-18 (single sweep)"
  primary-surface: external-website-audit
---

# Site Crawler Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final
> Skill/Drone authorship). Stage 7 (Register: pest-controller-suit roster entry, deploy, cross-repo
> reference sync) has not run yet. Every factual claim below traces to
> `references/research/raw/` via `references/research/distilled-site-crawler.md`, or is flagged
> explicitly as a judgment call where that archive is thin. See the honesty notes throughout,
> especially in `guides/02-platform-traversal-strategies.md` and
> `guides/04-storage-and-manifest-convention.md`, both of which name specific claims this
> archive does not ground.

You are equipping **site-crawler-wasp-drone**, part of the Website Auditor by Legion Code Inc.
plugin. Full scope and acceptance criteria: [prd-007-site-crawler](../../library/requirements/backlog/prd-007-site-crawler/prd-007-site-crawler-index.md).

## Purpose

Runs a platform-aware crawl of the audited site, up to 100 pages, storing raw HTML and a Markdown
extraction per page under `site-data/<slug>.html` / `<slug>.md`, plus a `site-data/manifest.json`
index. This Stinger's output is the shared, write-once data layer that every one of the nine
Wave-5 audit Drones (technical-seo, aeo-audit, content-semantics, internal-linking, visual-funnel,
accessibility-audit, web-security-posture, analytics-stack, performance-cwv) reads read-only, with
zero write contention between them, per PRD-007's shared workspace contract.

## When to use

- Wave W4, sync, immediately after `stack-fingerprint-wasp-drone` has written
  `_shared/target-profile.json` (this Drone's stack-type dependency, per the build plan's dependency
  graph and PRD-007's `Depends on: prd-003`)
- Any re-crawl after a mid-engagement site restructure is suspected (full re-crawl, not a patch,
  see `guides/05-politeness-and-scope-limits.md`)
- Never invoke this Stinger for a single-page check; that is `stack-fingerprint-stinger`'s scope

## When not to use

- Not for classifying the site's technology stack. That is `stack-fingerprint-stinger`, which runs
  first and writes the `target-profile.json` this Stinger reads.
- Not for analyzing what was crawled (SEO, AEO, accessibility, security, performance, content,
  linking, funnel, or analytics findings). This Stinger only fetches and stores; every Wave-5 Drone
  owns its own analysis of `site-data/`.
- Not for crawling authenticated or gated areas, submitting forms, or exceeding 100 pages without
  an explicit user-approved re-run. See PRD-007's Non-Goals.

## Procedure

1. Confirm `_shared/target-profile.json` exists with non-null `platform`, `rendering`, and
   `confidence`. If missing, stop and hand back to the orchestrating agent.
2. Read the platform value and select the seed-path strategy for it
   (`guides/02-platform-traversal-strategies.md`).
3. Run `shared/scripts/crawl-extract.py` (or its algorithm) to crawl up to 100 same-domain pages,
   breadth-first, respecting `robots.txt` and rate limits
   (`guides/01-crawl-procedure.md`, `guides/05-politeness-and-scope-limits.md`).
4. Store each page as `site-data/<slug>.html` + `site-data/<slug>.md` using the deterministic
   slugify algorithm, and write `site-data/manifest.json` as the single index
   (`guides/04-storage-and-manifest-convention.md`).
5. Record every unreachable URL in the manifest's `unreachable[]` array with a reason; never retry
   into a block (`guides/03-fetching-and-rendering.md`).
6. Write a short run summary into this engagement's `_shared/run-ledger.json` entry for this Drone
   (pages fetched, pages unreachable, platform strategy used). Do not write into this plugin
   repository's own `library/`.

## References map

- `references/templates/manifest-schema.md`, load when building or consuming `manifest.json` and
  the exact field contract is needed.
- `references/templates/site-data-manifest.example.json`, load as a worked example of the manifest
  shape before writing or parsing one.
- `references/research/distilled-site-crawler.md`, load when a fetching/rendering/platform-
  detection claim needs verification or a dispute needs settling.
- `references/research/raw/`, load when tracing a distilled claim back to its primary source.
- `references/scripts/README.md` and `shared/scripts/crawl-extract.py`, load/run to actually
  execute the crawl.
- `guides/01-crawl-procedure.md` through `guides/05-politeness-and-scope-limits.md`, load per-verb
  as described in each guide's own heading.

## Related drones and stingers

- [stack-fingerprint-stinger](../stack-fingerprint-stinger) - runs before this Stinger in wave
  W1a, writes `_shared/target-profile.json`, this Stinger's binding platform-classification input.
- [technical-seo-stinger](../technical-seo-stinger) - one of nine Wave-5 Drones reading `site-data/`
  read-only; consult when a manifest or storage-convention question is actually a technical-SEO
  scope question instead.
- [aeo-audit-stinger](../aeo-audit-stinger) - another Wave-5 reader of `site-data/`.
- [content-semantics-stinger](../content-semantics-stinger) - another Wave-5 reader of
  `site-data/`, the primary consumer of the `.md` extraction quality caveats in
  `guides/03-fetching-and-rendering.md`.
- [internal-linking-stinger](../internal-linking-stinger) - another Wave-5 reader of `site-data/`,
  and the most likely consumer of `manifest.json`'s `unreachable[]` array as evidence.
- [visual-funnel-stinger](../visual-funnel-stinger), [accessibility-audit-stinger](../accessibility-audit-stinger), [web-security-posture-stinger](../web-security-posture-stinger), [analytics-stack-stinger](../analytics-stack-stinger), [performance-cwv-stinger](../performance-cwv-stinger) - the remaining four of the nine Wave-5 Drones reading `site-data/` read-only.
- [keyword-intelligence-stinger](../keyword-intelligence-stinger) - runs one wave earlier (W3, not
  W4) and does NOT read `site-data/`, since it has not been written yet at that point in the
  sequence; see that Stinger's `guides/03-tier-3-ai-inference.md` for how it independently sources
  content instead.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [site-crawler-wasp-drone](../../agents/site-crawler-wasp-drone.md) - this Stinger's paired Drone.
  - [stack-fingerprint-stinger](../stack-fingerprint-stinger) - upstream dependency, writes `target-profile.json`.

## Ship Gate

Ship Gate not applicable to this Stinger's own runtime procedure. This Stinger's output
(`site-data/`) is written into the external customer's audit workspace
(`www.<domain>-audit/site-data/`), not into this plugin repository's own tracked source, so a
site-crawler run produces no committable code inside this repo for security-stinger,
quality-stinger, or github-repo-health-stinger to gate. The Ship Gate does apply, unmodified, to
any change made to this plugin repository's own files, including this SKILL.md, its guides, its
references, and `shared/scripts/crawl-extract.py`, before that change is committed and pushed.
