---
source_url: https://pagefind.app/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: search
stinger: docs-site-stinger
---

# Pagefind - Self-Hosted Static Site Search

## Summary

Pagefind is the modern default for static site search in self-hosted documentation contexts. It generates a chunked search index during the build process, with fragments downloaded on-demand via Web Workers (not a large upfront bundle). Compatible with any static site generator: Hugo, Eleventy, Astro, plain HTML - and is the built-in search engine for both Starlight and Nextra v4. Algolia DocSearch (hosted, free for open-source projects) is the main alternative for high-traffic or non-static sites. Typesense is a self-hosted alternative with DocSearch-compatible API. Client-side libraries (Lunr.js, Fuse.js) work for small sites but have memory/scale limitations.

## Key quotations / statistics

- "Pagefind generates a chunked search index during the build process, with fragments downloaded on-demand via Web Workers rather than loading one large index file."
- "Works with any static site generator (Hugo, Eleventy, Astro, plain HTML)"
- "Keeps initial page loads fast while supporting sites with thousands of pages"
- "Performs well for documentation sites, blogs, and marketing pages with minimal configuration"
- Nextra v4 uses Pagefind as its built-in full-text search
- Starlight uses its own search based on Pagefind approach

## Annotations for stinger-forge

- This source answers the Command Brief question about the search decision tree in `guides/03-search.md`.
- Search recommendation matrix:
  - Pagefind: self-hosted static sites, any size, zero ongoing cost, build-time indexing required
  - Algolia DocSearch: open-source or high-traffic public docs, free if you qualify, hosted (no build step), best relevance tuning
  - Typesense: self-hosted alternative to Algolia for compliance/cost reasons, more setup
  - Built-in (Starlight/Nextra): good default for small to medium docs, zero config
  - Mintlify AI Search: conversational, AI-powered, requires Mintlify platform
- The "zero upfront bundle" architecture of Pagefind makes it safe for large docs sites - this is a key selling point vs Lunr.js.
- Document in `guides/03-search.md`: Pagefind requires a post-build step (`npx pagefind --site dist`), which must be added to CI - give example GitHub Actions snippet.
