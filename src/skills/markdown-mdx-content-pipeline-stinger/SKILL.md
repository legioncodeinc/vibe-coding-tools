---
name: "markdown-mdx-content-pipeline-stinger"
description: "Markdown/MDX processing specialist - MDX 3/compiler selection, remark/rehype plugin pipelines, Shiki v4/expressive-code/starry-night syntax highlighting, GFM, AST manipulation, custom directive plugins, math/Mermaid diagram embedding, and XSS sanitization. Use when building or auditing any content processing pipeline that takes .md/.mdx source to HTML/JSX output."
license: MIT
---

# markdown-mdx-content-pipeline-stinger

Markdown and MDX processing stack: from raw `.md`/`.mdx` file to final HTML/JSX/React output. This stinger encodes the 2026 state of the unified/remark/rehype ecosystem, the Shiki family (Shiki v4, expressive-code, starry-night), compiler selection, plugin authoring patterns, math/diagram embedding, and sanitization.

---

## When to use this skill

Activate when `markdown-mdx-content-pipeline-worker-bee` is invoked, or when the user asks about any of these:

- Selecting a Markdown/MDX compiler for a Next.js, Astro, Vite, or Node.js project
- Auditing or designing a remark/rehype plugin chain
- Implementing or upgrading syntax highlighting (Shiki, expressive-code, starry-night, rehype-pretty-code)
- Writing custom remark or rehype plugins (visitor pattern, AST manipulation)
- Embedding math (KaTeX, MathJax) or diagrams (Mermaid, D2)
- Configuring sanitization for user-authored Markdown (rehype-sanitize, DOMPurify)
- Testing a unified processing pipeline (vitest fixtures, snapshot tests)
- Migrating from Contentlayer, next-mdx-remote, or Prism/Highlight.js to 2026-recommended alternatives

Do NOT activate for:
- Platform selection (Docusaurus, Starlight, Mintlify) → `docs-site-worker-bee`
- React component architecture for MDX (`mdx-components.tsx` internals) → `react-worker-bee`
- Broader XSS audit beyond sanitization config → `security-worker-bee`
- SEO/AEO concerns about rendered pages → `seo-aeo-worker-bee`

---

## Quick reference: canonical 2026 stack

| Layer | Recommended (2026) | Legacy / Avoid |
|---|---|---|
| Compiler (Next.js blog) | Velite + `@next/mdx` | next-mdx-remote (archived), Contentlayer |
| Compiler (route MDX) | `@next/mdx` | none |
| Syntax highlighting | Shiki v4 / rehype-pretty-code | Prism, Highlight.js |
| Highlighting (Starlight) | expressive-code | none |
| GFM | remark-gfm | none |
| Math | remark-math + rehype-katex | MathJax (heavier) |
| Diagrams | Mermaid via `next/script` (CSR) or rehype-mermaid (SSR build) | none |
| Sanitization (server) | rehype-sanitize | none |
| Sanitization (client) | DOMPurify | none |

---

## Guides index

Read each guide before authoring any output in its domain.

- `guides/00-principles.md`: scope boundary, unified AST model (mdast to hast to html/jsx), the four processing layers (parse, transform, compile, render)
- `guides/01-compiler-selection.md`: decision matrix: @next/mdx vs next-mdx-remote v6 vs Velite vs Contentlayer2 vs @mdx-js/mdx direct
- `guides/02-remark-rehype-pipeline.md`: canonical plugin ordering, the `.use()` chain, GFM/frontmatter/directive plugins
- `guides/03-syntax-highlighting.md`: Shiki v3 to v4 migration, expressive-code, starry-night, rehype-pretty-code
- `guides/04-plugin-authoring.md`: unified plugin function signature, unist-util-visit visitor pattern, TypeScript types
- `guides/05-math-diagrams.md`: remark-math + rehype-katex, Mermaid SSR workaround, D2, callout/admonition directive
- `guides/06-sanitization.md`: rehype-sanitize schema design, DOMPurify, allowDangerousHtml safety
- `guides/07-testing.md`: vitest fixtures, snapshot testing MDX output, XSS payload fuzzing

## Examples index

- `examples/next-mdx-blog.md`: full Next.js 15 App Router MDX blog with Velite, remark-gfm, remark-math, rehype-katex, rehype-pretty-code (Shiki v4)
- `examples/ai-chat-renderer.md`: safe rendering of user-authored Markdown in an AI chat UI with DOMPurify + allowlist

## Templates index

- `templates/plugin-boilerplate.ts`: typed TypeScript boilerplate for a unified remark or rehype plugin

---

## Critical directives (always enforce)

1. **Prefer Shiki v4 over Prism or Highlight.js.** Shiki ships TextMate grammars, is the default in Vite/Astro/Next.js in 2026, and supports transformers for line numbers, highlighting, and word highlighting.

2. **Never skip sanitization for user-generated Markdown.** MDX can embed arbitrary JSX; without `rehype-sanitize` or DOMPurify, a malicious `<script>` or event handler in user content executes in the app's origin.

3. **Use Velite for new Next.js content sites.** `next-mdx-remote` is archived (v6.0.0 final release, Feb 2026). Velite is Turbopack-safe, RSC-safe, and outputs inert typed JSON.

4. **rehype-sanitize MUST come after rehype-raw in the chain.** Placing it before `rehypeRaw` produces a false-clean output that raw HTML can still bypass.

5. **Pin plugin versions.** The unified ecosystem releases breaking AST changes without major semver bumps; `"*"` or `"latest"` breaks pipelines silently.

6. **Distinguish MDX compile (server) from MDX render (client/RSC).** Conflating them produces broken CSR/SSR configurations with security implications.

7. **Route platform-selection to docs-site-worker-bee.** This stinger implements the highlighting and plugin config after the platform is decided; crossing the boundary produces contradictory guidance.

---

## Refresh cadence

- **6 months.** The Shiki ecosystem (including expressive-code) releases breaking API changes roughly every two quarters. Verify `@expressive-code/plugin-shiki` Shiki peer-dep range and rehype-pretty-code Shiki compat table on each refresh.
- Re-run `scripture-historian` at `shallow` depth if: Shiki releases v5, expressive-code releases a major, or Next.js App Router changes its MDX integration.
- The sanitization guides are stable; refresh only if a rehype-sanitize schema default changes.

---

*Part of the Hive. Paired Bee: `markdown-mdx-content-pipeline-worker-bee`.*
*Research: 10 external sources (2025-11 to 2026-05), depth tier: normal.*
