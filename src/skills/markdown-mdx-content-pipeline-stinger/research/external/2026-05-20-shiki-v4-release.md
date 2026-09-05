---
source_type: official_docs
url: https://shiki.style/blog/v4
fetched: 2026-05-20
authority: high
relevance: high
topic: syntax_highlighting
---

# Shiki v4.0.0 Release Blog Post

## Summary
Shiki v4.0.0 released February 27, 2026. Key change: drops Node.js 18 support (Node 18 EOL April 2025), removes a set of deprecated APIs. No core API changes: `codeToHtml`, `createHighlighter`, etc. remain unchanged. Introduces `@shikijs/primitive` and `@shikijs/markdown-exit` packages.

## Key quotations / statistics
- "Released February 27, 2026"
- "Shiki v4 requires Node.js ≥ 20. Node.js 18 reached End-of-Life in April 2025 and is no longer supported"
- Removed deprecated `CreatedBundledHighlighterOptions` → use `CreateBundledHighlighterOptions`
- Removed deprecated `createdBundledHighlighter()` → use `createBundledHighlighter()`
- "If you're on v3.0, you can directly bump to v4.0 since it only drops Node.js 18 support and removes deprecated APIs — no API changes to `codeToHtml` or other core functions are required"
- New packages: `@shikijs/primitive`, `@shikijs/markdown-exit`

## Breaking changes checklist
- Node.js 18 → 20 requirement
- `CreatedBundledHighlighterOptions` → `CreateBundledHighlighterOptions` (rename only)
- `createdBundledHighlighter()` → `createBundledHighlighter()` (rename only)
- CSS class `twoslash-query-presisted` → `twoslash-query-persisted` (typo fix)
- `theme` option in `TwoslashFloatingVue` → `themes`

## rehype-pretty-code compatibility
- rehype-pretty-code v0.14.1+ supports Shiki 3
- rehype-pretty-code v0.14.2+ supports Shiki 4
- Check CHANGELOG for current version compatibility

## Annotations for stinger-forge
- Informs `guides/03-syntax-highlighting.md`: include v3→v4 migration section
- The "direct bump" messaging is important: teams on v3 should upgrade without fear
- Node 20 requirement is a gotcha for teams on legacy CI environments
- @shikijs/markdown-exit may be relevant for the Markdown processing pipeline; worth monitoring
