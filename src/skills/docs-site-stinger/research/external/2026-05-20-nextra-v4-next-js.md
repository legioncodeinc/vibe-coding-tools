---
source_url: https://nextra.site/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: medium
topic: nextra
stinger: docs-site-stinger
---

# Nextra v4 - Next.js MDX Documentation Framework

## Summary

Nextra 4 (current as of 2026, not v3 as originally in scope) is a Next.js plugin framework for MDX-based content sites. Built on Next.js App Router (v4+ only), it provides: automatic link/image optimization, Shiki-based syntax highlighting, dark mode, full-text search via Pagefind, i18n support, and hybrid rendering with Server/Client Components + ISR. Nextra v3 (December 2023) introduced MDX 3 and a redesigned i18n system with locale-based folders. Nextra targets Next.js teams who want docs in the same repo/framework as their app.

## Key quotations / statistics

- "Built on Next.js: Works as a plugin on top of Next.js with support for the app router (v4+ only)"
- "Full-text search via Pagefind" (built-in)
- "Hybrid rendering with Server/Client Components and ISR"
- Nextra v3 (Dec 2023): "MDX 3 Support, Redesigned I18n System, Improved Project Structure"
- "Nextra 4.0 is the latest release as of 2025" (current major version)

## Annotations for stinger-forge

- **Scope clarification**: The Command Brief references Nextra; the current version is v4, not v3. Update the guide to v4 and mention the v3 → v4 App Router upgrade.
- Nextra's primary use case is teams already on Next.js who want docs inside the same project. It's the most natural choice for Next.js SaaS companies with an existing Next.js codebase.
- Nextra uses Pagefind for search out of the box - the pagefind integration pattern is worth documenting in both `guides/08-nextra.md` and `guides/03-search.md`.
- Nextra is less feature-rich than Docusaurus (smaller plugin ecosystem) but offers tighter Next.js integration.
- Decision tree signal: Recommend Nextra when the team is already on Next.js and wants documentation co-located with the app, without running a separate Docusaurus/Starlight site.
