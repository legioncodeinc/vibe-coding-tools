---
name: "performance-cwv-stinger"
description: "CDN/caching-header audit plus Core Web Vitals scoring for an external site, from an outside unauthenticated posture. Cross-linked with lighthouse-pagespeed-stinger, not duplicated. Wave W5."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: performance-cwv-wasp-drone
  research-window: "2026-08-18 (single sweep)"
  primary-surface: external-website-audit
---

# Performance Cwv Stinger

> **Forge status:** stages 1-6 of the seven-stage forge pipeline complete (Topic, Research, Distillation, References, Guides, final Skill/Drone authorship). Stage 7 (Register, pair registration in `pest-controller-suit` and deploy) has not run yet. Everything below this line is grounded in this pair's PRD, the build plan, and the two raw sources archived in `references/research/raw/`; every claim traces to one of those, is explicitly labelled as general/uncited HTTP-CDN knowledge, or is an explicit cross-link to `lighthouse-pagespeed-stinger`.

You are equipping **performance-cwv-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-016-performance-cwv](../../library/requirements/backlog/prd-016-performance-cwv/prd-016-performance-cwv-index.md).

## Purpose

Score a site's CDN/edge-delivery presence, caching-header strategy, and Core Web Vitals across three leaves of the "Technical deployment" scoring category (11% of the final grade): CDN presence (3%), caching-header strategy (4%), Core Web Vitals (4%). This Stinger's own research archive covers only what's specific to assessing an external, unauthenticated target with no source access and no CI integration; it explicitly cross-links `lighthouse-pagespeed-stinger` for general Lighthouse/PageSpeed methodology and CWV threshold provenance rather than re-deriving it.

**The distinction to state plainly, every time it's relevant:** `lighthouse-pagespeed-wasp-drone` (a different plugin, `vibe-coding-tools`) runs Lighthouse CI on a repository the customer owns, with source access, deploy rights, and a CI gate. This Stinger assesses CDN/caching strategy and Core Web Vitals for an external site the customer does not necessarily control the infrastructure of, from the outside, once per audit engagement, with no source access and nothing to gate. Same subject matter, genuinely different posture. See `guides/05-external-audit-vs-lighthouse-ci.md`.

## When to use this skill

- Wave W5 of every audit run, after `site-crawler-wasp-drone` has finished and `site-data/` exists.
- Any standalone request specifically about a site's CDN, caching-header strategy, or Core Web Vitals scores from an external, unauthenticated audit posture.
- Deciding whether a performance question belongs here or with `lighthouse-pagespeed-stinger`, see `guides/05-external-audit-vs-lighthouse-ci.md`'s concrete scenario table.

## When not to use this skill

- Before `site-data/` exists.
- For a CI-gated Lighthouse pass on a repository the customer owns. That is `lighthouse-pagespeed-wasp-drone`'s territory; route there instead.
- To assert that a specific caching-header configuration is objectively correct or incorrect for a specific page type. That adequacy judgment is a documented research gap in this Stinger's own archive, see `guides/02-cdn-and-caching-headers.md`.
- To implement a performance fix in a customer's codebase. This Drone has no source access; it diagnoses and reports, it does not remediate.

## Procedure

1. Load `site-data/` and build the sampled page set.
2. Capture CDN and caching headers with `references/scripts/cdn-header-scan.py` (fresh, read-only requests, since `site-data/`'s crawl capture does not preserve response headers).
3. Collect Core Web Vitals: lab data via the shared `cwv-collect.py` script, field data via PageSpeed Insights/CrUX where coverage exists.
4. Score the three leaves on the plugin-wide zero-to-six scale, every score with a numeric value, an evidence pointer, and a one-line justification.
5. Cross-link `lighthouse-pagespeed-stinger` rather than re-deriving its methodology, per `guides/05-external-audit-vs-lighthouse-ci.md`.
6. Log rejected/reframed candidates to the run's verification log.
7. Write `09-performance/performance-findings.md` from `references/templates/performance-findings-template.md`, per `guides/06-report-format.md`.

Full step-by-step detail lives in `guides/01-audit-procedure.md`, read it first on every invocation.

## References map

Load on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `guides/01-audit-procedure.md` | Every invocation, read first, full end-to-end sequencing |
| `guides/02-cdn-and-caching-headers.md` | Scoring the 3% CDN-presence leaf and the 4% caching-header-strategy leaf; carries the archive-grounding notice for this half of the Stinger's scope |
| `guides/03-core-web-vitals-thresholds.md` | Scoring the 4% Core Web Vitals leaf, the three published thresholds and 2026 pass-rate context |
| `guides/04-inp-diagnosis.md` | Any INP-specific finding, the metric with the most audit-relevant nuance |
| `guides/05-external-audit-vs-lighthouse-ci.md` | Any finding that touches Lighthouse, PSI, or CI-based performance tooling, and the non-duplication boundary with `lighthouse-pagespeed-stinger` |
| `guides/06-report-format.md` | Writing the final report and evidence index entries |
| `references/templates/performance-findings-template.md` | The copy-ready output written to `09-performance/performance-findings.md` |
| `references/templates/cdn-header-checklist.md` | The full CDN/caching-header list and what each one indicates (general HTTP/CDN knowledge, flagged as such) |
| `references/scripts/cdn-header-scan.py` | Read-only HTTP header capture against the sampled page set |
| `references/scripts/README.md` | Script inventory and the boundary with the shared, not-yet-implemented `cwv-collect.py` |
| `references/research/distilled-performance-cwv.md` | Verifying any claim fast, or resolving where a fact came from, including this archive's stated gap (section 7, CDN/caching-header audit is unresearched) |
| `references/research/raw/` | Tracing a claim to its primary source |

## Quality bar

A pass through this Stinger is done when: `guides/01-audit-procedure.md` ran in order, every factual claim used traces to `references/research/raw/` or is explicitly labelled general/uncited HTTP-CDN knowledge or `[subjective]`, every score has all three mandatory fields, any Lighthouse/PSI-adjacent question is cross-linked to `lighthouse-pagespeed-stinger` rather than re-derived, rejected/reframed candidates are logged, and `09-performance/performance-findings.md` was written per `guides/06-report-format.md`.

## Related drones and stingers

- [performance-cwv-wasp-drone](../../agents/performance-cwv-wasp-drone.md) - this Stinger's paired Drone.
- `lighthouse-pagespeed-stinger` (a different plugin, `vibe-coding-tools`, not this repo, no resolvable relative path from here) - internal-repo CWV/Lighthouse specialist, run on a repository the customer owns via CI. Consult for general Lighthouse/PageSpeed methodology and CWV threshold provenance; this pair covers only the external-audit-specific delta. Do not duplicate its guides here.
- [site-crawler-stinger](../site-crawler-stinger) - upstream, produces `site-data/`, this Stinger's one declared read.
- [web-security-posture-stinger](../web-security-posture-stinger) - sibling in wave W5; consult when a caching or CDN header finding overlaps a security-header finding (e.g. the same response headers, different scoring lens).
- [audit-scoring-stinger](../audit-scoring-stinger) - consumes this Stinger's three leaf scores into the "Technical deployment" category rollup (11% of the final grade).

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [performance-cwv-wasp-drone](../../agents/performance-cwv-wasp-drone.md) - this Stinger's paired Drone.
  - `lighthouse-pagespeed-stinger` (a different plugin, `vibe-coding-tools`, not this repo, no resolvable relative path from here) - internal-repo CWV/Lighthouse specialist; consult for threshold research and general methodology, this pair covers only the external-audit-specific delta.

## Ship Gate decision

Does not apply to a per-run audit. This Stinger's output is a set of findings written into the customer's audit workspace (`09-performance/performance-findings.md`), not a code change to this plugin's own repository, so the security-stinger, quality-stinger, github-repo-health-stinger Ship Gate defined for repo-improvement Drones is not triggered by running an audit. The Ship Gate does apply, per the build plan's Question 22, before any change to this plugin's own source (this file, the paired Drone, shared scripts) is committed and pushed, that is a plugin-development-time gate, not an audit-run-time gate. Do not conflate the two.
