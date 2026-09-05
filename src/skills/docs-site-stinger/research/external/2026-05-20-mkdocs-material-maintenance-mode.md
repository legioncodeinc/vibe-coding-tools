---
source_url: https://docsio.co/blog/mkdocs-material
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: mkdocs-material
stinger: docs-site-stinger
---

# Material for MkDocs: Honest 2026 Review (Maintenance Mode)

## Summary

**CRITICAL 2026 CHANGE**: MkDocs Material entered maintenance mode on November 5, 2025. The 9.7.0 release (November 11, 2025) was the LAST feature release. The team is now building Zensical, a next-generation static site generator built from first principles. Critical bug fixes and security updates for MkDocs Material are committed through November 2026 only. The Insiders paid tier is dissolved - all previously-Insiders features (instant previews, prefetching, breadcrumbs, pinned blog posts, custom social cards, footnote tooltips, selectable code ranges) are now freely available in the MIT-licensed 9.7.0 release. The `projects` and `typeset` plugins are deprecated in 9.7.0.

## Key quotations / statistics

- "Material for MkDocs is now in maintenance mode. This is the last release of Material for MkDocs that will receive new features." (November 2025 announcement)
- "Going forward, the Material for MkDocs team focuses on Zensical, a next-gen static site generator built from first principles."
- "We will provide critical bug fixes and security updates for Material for MkDocs until November 2026."
- 9.7.6 release note (March 19, 2026): "Material for MkDocs is in maintenance mode."
- "The Insiders program itself is no longer accepting new sponsors."
- "If you see a tutorial or Stack Overflow answer [saying] 'this requires Insiders,' check the date. If it's before late 2025, the gating is gone."
- MkDocs 2.0 incompatibility warning exists (9.7.5 limits MkDocs version range to <2)
- GitHub: 26K stars

## Annotations for stinger-forge

- **MOST IMPORTANT 2026 FINDING FOR MkDocs SECTION**: This is a platform-level risk signal. Teams that are heavy MkDocs Material users should be aware: no new features, and the ecosystem successor is Zensical (unproven, early stage). Document prominently in `guides/06-mkdocs-material.md` as a caveat/warning.
- For the platform decision tree (`guides/00-platform-selection.md`): MkDocs Material should no longer be recommended for greenfield projects unless the team is Python-native and happy with a frozen feature set. Starlight or Docusaurus are better long-term bets.
- The Insiders dissolution is GOOD news for existing users: they get all premium features free. But new project starts should weigh the maintenance mode status heavily.
- `mike` plugin for versioning still works and is unaffected by the maintenance mode decision.
- Watch for Zensical: the MkDocs Material team may produce a worthy successor, but it's not ready for production recommendation in May 2026.
- MkDocs 2.0 incompatibility: existing MkDocs Material sites should NOT upgrade to MkDocs 2.0 yet (9.7.5 explicitly limits to <2).
