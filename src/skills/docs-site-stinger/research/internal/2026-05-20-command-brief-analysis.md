---
source_url: internal://ai-tools/command-briefs/docs-site-worker-bee-command-brief.md
retrieved_on: 2026-05-20
source_type: internal
authority: official
relevance: critical
topic: scope
stinger: docs-site-stinger
---

# Command Brief Analysis - docs-site-worker-bee

## Summary

The Command Brief defines docs-site-worker-bee as the Hive's documentation infrastructure specialist. It owns: platform selection, site architecture, docs-as-code discipline, search, and contributor experience. It explicitly does NOT own: OpenAPI spec enrichment (api-docs-worker-bee), internal library/ knowledge-base authoring (library-worker-bee), marketing pages (website-worker-bee), or Next.js SEO strategy (seo-aeo-worker-bee).

## Key decisions from the brief

### Platform scope (seven platforms)
1. Docusaurus v3 (open-source, React, most plugin-rich)
2. Mintlify (managed, AI-native, commercial)
3. GitBook (managed, block editor, commercial)
4. MkDocs Material (open-source, Python, maintenance mode as of Nov 2025)
5. Nextra (Next.js plugin, open-source)
6. Starlight / Astro (open-source, Astro framework)
7. Fern (API-first, SDK+docs, commercial)

### Architecture model (Diataxis-inspired content pyramid)
Four doc types: API reference, how-to guides, tutorials, conceptual overviews. The "one big guide" anti-pattern must be explicitly named and avoided.

### Docs-as-code discipline (critical directive)
PR-gated, lint-checked, preview-deployed. Tools: Vale (prose linter), lychee (dead-link checker), Netlify/Vercel/Cloudflare preview deploy.

### Search configuration
DocSearch for open-source/high-traffic sites, pagefind for self-hosted, built-in for low-traffic.

### Stinger guide structure
- `guides/00-platform-selection.md` - decision tree with score matrix
- `guides/01-content-pyramid.md` - Diataxis-based nav model
- `guides/02-docs-as-code.md` - CI/CD for docs
- `guides/03-search.md` - search configuration
- `guides/04-docusaurus.md` through `guides/09-fern.md` - per-platform playbooks

## Open questions from the brief
1. Has Mintlify shipped a major pricing or feature change in 2026? (ANSWERED: Yes - headless mode for enterprise, Feb 2026; pricing is $0/300/600+ tiers)
2. Is Starlight stable enough to recommend over Docusaurus without caveats? (ANSWERED: Yes for greenfield projects as of April 2026, v0.38.x with 200K+ weekly downloads)

## Annotations for stinger-forge
- Prioritize `guides/00-platform-selection.md` first - it's the entry point for any invocation
- The MkDocs Material maintenance mode is a critical 2026 change that the brief did NOT know about - add to the platform section prominently
- Fern's MCP server auto-generation is a new 2026 capability worth highlighting
