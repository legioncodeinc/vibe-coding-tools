---
source_url: https://github.com/withastro/starlight/releases/tag/%40astrojs/starlight%400.38.0
retrieved_on: 2026-05-20
source_type: changelog
authority: official
relevance: critical
topic: starlight
stinger: docs-site-stinger
---

# Starlight v0.38.0 - Astro v6 Support, Drops Astro v5 (March 2026)

## Summary

Starlight v0.38.0 (March 11, 2026) is a breaking-change release adding Astro v6 support and dropping Astro v5. The repo has 8,256 GitHub stars, 944 forks, 300 contributors, 200K+ weekly npm downloads, and 201 releases since May 2023. Starlight is MIT licensed and TypeScript-first (84.3% of codebase). The latest release as of research date is v0.38.3 (April 7, 2026). The framework provides: site navigation, built-in search, i18n, SEO, code highlighting, dark mode, and supports React/Vue/Svelte/Solid/Markdoc/MDX components alongside the core Astro framework.

## Key quotations / statistics

- Breaking change: "Adds support for Astro v6, drops support for Astro v5." (v0.38.0, March 11, 2026)
- Breaking change: "Drops support for content collections backwards compatibility" (must upgrade to Content Layer API for Astro v6)
- Weekly downloads: 200,400 (npm)
- Stars: 8,256 | Forks: 944 | Contributors: 300
- Latest: @astrojs/starlight@0.38.3 (April 7, 2026)
- "Build beautiful, accessible, high-performance documentation websites with Astro"
- "Brings your own UI components: Extend with React, Vue, Svelte, Solid, and more"
- "Includes: Site navigation, search, internationalization, SEO, easy-to-read typography, code highlighting, dark mode and more"

## Annotations for stinger-forge

- **2026 maturity signal**: 200K+ weekly downloads and 8K stars in March 2026 puts Starlight firmly in production-ready territory. The Command Brief question "Is Starlight now stable enough to recommend over Docusaurus without caveats?" can be answered YES for new projects, with the caveat that v0.x versioning means breaking changes between minor versions.
- The Astro v6 requirement (Starlight v0.38+) is a meaningful ecosystem upgrade decision - document in `guides/07-starlight.md`.
- The Content Layer API migration requirement (from legacy content collections) is a potential friction point for existing Astro projects upgrading to Starlight v0.38+.
- Starlight vs Docusaurus: Starlight wins for Astro-native teams and those wanting framework-agnostic component support. Docusaurus wins for React-heavy teams who want the bigger plugin ecosystem.
- Document in `guides/00-platform-selection.md`: Starlight is the recommendation for new greenfield docs sites as of 2026, unless React ecosystem integration is required.
