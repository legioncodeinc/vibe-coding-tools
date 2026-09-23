# 05. External audit vs. Lighthouse CI

This is the guide that carries this pair's central non-duplication requirement, per this pair's PRD non-goal: "Does not re-derive Lighthouse/PageSpeed methodology from scratch; cross-links `lighthouse-pagespeed-wasp-drone`'s research archive for the CWV threshold research, this Drone's own archive covers only what's specific to an external, unauthenticated audit context." Read this guide before writing any finding that touches Lighthouse, PageSpeed Insights, or CI-based performance tooling.

## The distinction, stated explicitly

`lighthouse-pagespeed-wasp-drone` (from the `vibe-coding-tools` plugin, a different plugin from this one) is a Lighthouse + PageSpeed Insights specialist for **a repository the customer owns**. It runs Lighthouse locally or in CI (LHCI, GitHub Actions), sets score and performance budgets that gate deploys, authors custom Lighthouse plugins, and reconciles lab scores against CrUX field data, all as part of an ongoing development workflow with full source access and deploy rights.

`performance-cwv-wasp-drone` (this pair) assesses CDN/caching strategy and Core Web Vitals for an **external site the customer does not necessarily control the infrastructure of**, from the outside. No source access. No deploy rights. No CI integration, this Drone runs once per audit engagement, not on every pull request. No guarantee of RUM/CrUX coverage, and no ability to set a budget that gates anything, this Drone reports a snapshot, it does not enforce a gate.

Same subject matter at the metric level (LCP, INP, CLS, the same published thresholds), genuinely different posture. This is the same "new pairs, not re-registrations" reasoning the build plan applies across the whole plugin (section 0).

## What to cross-link instead of duplicate

- **CWV threshold research and general Lighthouse/PageSpeed measurement methodology:** owned by `lighthouse-pagespeed-stinger`. If a finding needs to explain, in general terms, how Lighthouse scores performance or how LHCI budgets work, link to that Stinger rather than re-explaining it here.
- **What THIS Stinger's own archive covers, and nothing else does:** the CDN/caching-header audit specific to an unauthenticated external target (`guides/02-cdn-and-caching-headers.md`), and the external-audit constraint on INP diagnosis, no RUM access, PSI/CrUX as the only field-data channel (`guides/04-inp-diagnosis.md`).

## How to phrase the cross-link in a finding

When a finding touches something `lighthouse-pagespeed-stinger` already covers in depth, name it and stop rather than re-deriving it: "General Lighthouse/PSI methodology and CWV threshold provenance: see `lighthouse-pagespeed-stinger`. This finding covers only what's specific to assessing `[domain]` from the outside with no source access." Do not copy that Stinger's guide content into this one; if a specific claim genuinely needs restating here, it needs its own primary-source citation in this Stinger's own `references/research/raw/`, not a borrowed one.

## A concrete scenario, to make the boundary unambiguous

- "This site's LCP threshold is 2.5 seconds at p75" -> general CWV fact, this Stinger's own archive already grounds it (`guides/03-core-web-vitals-thresholds.md`), no cross-link needed, cite this Stinger's own raw sources.
- "How to configure `lighthouserc.json`'s `numberOfRuns` and `aggregationMethod`" -> that is `lighthouse-pagespeed-stinger`'s territory (CI configuration on an owned repo). This Drone has no CI to configure; if the customer asks about setting up their own CI-gated Lighthouse pass, route them to that Drone, don't answer it here.
- "Does this site's CDN send a `CDN-Cache-Control` header" -> this Stinger's own scope (`guides/02-cdn-and-caching-headers.md`), `lighthouse-pagespeed-stinger`'s archive does not cover this at all.
