---
source_url: https://docusaurus.io/blog/releases/3.10
retrieved_on: 2026-05-20
source_type: changelog
authority: official
relevance: critical
topic: docusaurus
stinger: docs-site-stinger
---

# Docusaurus 3.10 - Last v3 Release, v4 Preparation (April 2026)

## Summary

Docusaurus 3.10 (released April 7, 2026) is the final release in the v3.x line. It serves as a preparation release for Docusaurus v4. Key 2026 developments: React 19 support was added in v3.7 (January 2025) and the monorepo upgraded to React 19 in v3.10. Docusaurus v4 will require React 19 (dropping v18). "Docusaurus Faster" (Rspack-based build system) is now stable and enabled by default on new v3 sites, and will be default in v4. New v4 future flags in v3.10 allow incremental opt-in to v4 breaking changes. TypeScript 6.0 support added.

## Key quotations / statistics

- "This will be the last release in the v3.x line, and it helps you prepare for Docusaurus v4." (April 7, 2026)
- "Docusaurus Faster is stable + v4 future flag turns it on by default" (#11802)
- "We'll drop support for React 18 in Docusaurus v4" (from upgrade notes)
- "In #11843, we now use TypeScript 6.0 for newly initialized sites"
- v3.7 changelog (Jan 3, 2025): "feat: Add React 19 support to Docusaurus v3 (#10763)"
- v3.10 changelog: "chore(monorepo): upgrade React packages to v19 (#11698)"
- Future flags in 3.10: `future.v4.mdx1CompatDisabledByDefault`, `future.v4.siteStorageNamespacing`, `future.v4.fasterByDefault`

## Annotations for stinger-forge

- **KEY FINDING**: Docusaurus v4 is coming after v3.10 (last v3). Teams starting new projects in mid-2026 should plan for v4 migration. Document in `guides/04-docusaurus.md`.
- React 19 is now supported in v3 (v3.7+) and will be *required* in v4 - this matters for monorepo projects upgrading React.
- Docusaurus Faster (Rspack) is a significant build speed improvement - mention in the tooling section of `guides/04-docusaurus.md`.
- The `future.v4.*` flags are the recommended migration path - give a tip in the guide to enable them on existing v3 sites now.
- Monorepo support is built-in and well-documented in official Docusaurus docs.
