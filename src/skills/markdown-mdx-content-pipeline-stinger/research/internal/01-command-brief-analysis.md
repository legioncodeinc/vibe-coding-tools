---
source_type: internal_analysis
url: local://command-brief
fetched: 2026-05-20
authority: high
relevance: high
topic: compiler_selection
---

# Command Brief Analysis: markdown-mdx-content-pipeline-worker-bee

## Bee Identity Summary

`markdown-mdx-content-pipeline-worker-bee` owns everything between a raw `.md` or `.mdx` source file and its final HTML/JSX/React output. It does NOT own: documentation platform selection (`docs-site-worker-bee`), React component architecture (`react-worker-bee`), broader security audits (`security-worker-bee`), or SEO/AEO concerns (`seo-aeo-worker-bee`).

## Six Processing Layers

The stinger must encode playbooks for these six layers, each as its own guide:

1. **Compiler selection** - @mdx-js/mdx vs next-mdx-remote vs Velite vs Contentlayer2 vs Astro built-in
2. **remark/rehype pipeline** - plugin ordering (mdast → hast), unified `.use()` chain, GFM, frontmatter, directives
3. **Syntax highlighting** - Shiki v3/v4, expressive-code, starry-night, rehype-pretty-code; theme selection; Cloudflare Workers compat
4. **AST manipulation** - unist-util-visit visitor pattern, mdast/hast TypeScript types, custom plugin authoring, testing
5. **Math and diagrams** - remark-math + rehype-katex, Mermaid embed (SSR safety), D2, callout/admonition directive
6. **Sanitization** - rehype-sanitize schema design, DOMPurify fallback, allowDangerousHtml trust boundary, iframe allowlisting

## Critical Directives to Encode

1. **Always prefer Shiki v3/v4 over Prism or Highlight.js for new projects** (TextMate grammars, Vite/Astro/Next.js default in 2026)
2. **Never skip sanitization for user-generated Markdown** (MDX can embed arbitrary JSX = critical XSS vector)
3. **Distinguish MDX compilation from rendering** (compile step on server, render step client/server; conflating = broken CSR/SSR config)
4. **Pin plugin versions and test after upgrades** (unified ecosystem releases breaking AST changes without major semver bumps)
5. **Route platform-selection questions to docs-site-worker-bee** (pipeline ≠ platform)

## Open Questions from Brief

- Q: Does Shiki v3/v4's `highlightCode` API work in Cloudflare Workers (no `vm` module)? → Research says: YES, with fine-grained bundles + WASM loading, but requires specific configuration
- Q: Is rehype-mermaid SSR-safe with Playwright in 2026? → Research says: YES but requires browser installation; known environment errors in serverless (import.meta.resolve issue); alternatives: client-side rendering via next/script

## Stinger Guide Structure (from Brief)

- `guides/00-principles.md`: scope boundary, unified AST model (mdast to hast to html/jsx), four-layer processing model
- `guides/01-compiler-selection.md`: decision matrix per target runtime
- `guides/02-remark-rehype-pipeline.md`: canonical plugin ordering, .use() chain, GFM, frontmatter, directives
- `guides/03-syntax-highlighting.md`: Shiki v3/v4 createHighlighter, expressive-code, starry-night, rehype-pretty-code
- `guides/04-plugin-authoring.md`: unified plugin signature, unist-util-visit, TypeScript types, testing
- `guides/05-math-diagrams.md`: remark-math + rehype-katex, Mermaid SSR workaround, D2, callout/admonition
- `guides/06-sanitization.md`: rehype-sanitize schema, DOMPurify, iframe allowlisting, allowDangerousHtml
- `guides/07-testing.md`: vitest fixtures, snapshot testing, XSS fuzzing

## Scope Boundary Overlaps

- `docs-site-worker-bee` → owns platform selection (Starlight, Docusaurus, Mintlify) and may recommend expressive-code for Starlight
- `react-worker-bee` → owns `mdx-components.tsx` component map wiring
- `security-worker-bee` → owns broader XSS audit beyond what this Bee configures
