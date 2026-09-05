---
source_type: internal_analysis
url: local://guide-structure
fetched: 2026-05-20
authority: high
relevance: high
topic: pipeline_architecture
---

# Proposed Guide Structure: markdown-mdx-content-pipeline-stinger

## Key Research Findings to Encode

### Compiler Selection (guides/01)

**2026 Compiler Landscape:**
- `@next/mdx` (`@next/mdx` pkg): Best when `.mdx` files are routes; limited customization; built-in Next.js 15 support; requires `mdx-components.tsx` (mandatory for App Router)
- `next-mdx-remote` v6: Archived project but latest version (6.0.0, Feb 2026); disk-backed blogs; RSC mode has issues with Next.js 15.2.x (fatal error); workaround: downgrade to Next.js 15.1.7 or avoid RSC mode; Turbopack needs `transpilePackages: ['next-mdx-remote']`
- `Velite`: **Recommended for new projects**; prebuild step in `next.config.mjs`; Turbopack-safe (avoids VeliteWebpackPlugin); outputs inert JSON; full RSC support; actively maintained
- `Contentlayer2` (timlrx fork): Stop-gap for Contentlayer users; actively maintained (May 2025 latest); not recommended for greenfield projects
- `@mdx-js/mdx` direct: Lowest-level, maximum control; `outputFormat: 'function-body'` for server-compile + client-run pattern; `outputFormat: 'program'` (default) for full program output

**Decision matrix trigger phrases:**
- "blog with frontmatter" → Velite
- "MDX as page route" → @next/mdx
- "dynamic content from database or API" → @mdx-js/mdx + evaluate/run
- "migrating from Contentlayer" → Velite or Contentlayer2

### Plugin Ordering (guides/02)

**Canonical chain:**
```
.use(remarkParse)
.use(remarkFrontmatter)    // remark plugin
.use(remarkGfm)            // remark plugin
.use(remarkMath)           // remark plugin
.use(remarkDirective)      // remark plugin (before custom directive processors)
.use(myCustomRemarkPlugin) // remark plugin (custom)
.use(remarkRehype)         // bridge: mdast → hast
.use(rehypeRaw)            // (optional) allows raw HTML in output
.use(rehypeSanitize)       // ALWAYS after rehypeRaw
.use(rehypeKatex)          // rehype plugin (math)
.use(rehypePrettyCode or rehypeExpressiveCode) // rehype plugin (highlighting)
.use(rehypeSlug)           // rehype plugin
.use(rehypeAutolinkHeadings) // rehype plugin
.use(rehypeStringify)
```

### Shiki v4 Migration (guides/03)

**v3 → v4 migration (Feb 27, 2026):**
- Node.js 20+ required (Node 18 EOL April 2025)
- Removed deprecated `createdBundledHighlighter()` → `createBundledHighlighter()`
- Removed `CreatedBundledHighlighterOptions` → `CreateBundledHighlighterOptions`
- `codeToHtml` still works (not removed in v3→v4)
- Direct v3→v4 bump: only need to drop Node 18 and fix renamed APIs
- New `@shikijs/markdown-exit` and `@shikijs/primitive` packages in v4

**Cloudflare Workers compatibility:**
- Use fine-grained bundles with explicit WASM imports
- Avoid full bundle (exceeds 1 MiB script limit)
- Use `loadWasm` utility from Shiki's ESM approach
- No `vm` module needed - Shiki uses WASM, not `vm`

**expressive-code status (2026):**
- `@expressive-code/plugin-shiki` v0.41.7 (Feb 2026) → depends on Shiki ^3.2.2
- Integration: `rehype-expressive-code` rehype plugin
- For Next.js: add `[rehypeExpressiveCode, options]` to rehypePlugins array in `createMDX`

**starry-night v3.9.0 (Jan 2026):**
- 600+ TextMate grammars; GitHub-fidelity output
- 43M weekly npm downloads (via deps, not direct)
- WASM-based; heavy for browser environments
- Best for: docs sites that need GitHub-exact rendering

### Mermaid SSR (guides/05)

**rehype-mermaid v3.0.0 (Oct 2024, patches through Apr 2026):**
- Requires Playwright + browser for SSR
- Known error: `TypeError: import.meta.resolve is not a function` in serverless/Next.js environments
- Strategies: `'img-png'`, `'img-svg'`, `'inline-svg'`, `'pre-mermaid'`
- Recommended for build-time rendering: use `'inline-svg'` strategy

**Client-side alternative (safer for Next.js):**
- Load mermaid.js via `next/script` with `afterInteractive` strategy
- Use `<pre class="mermaid">` tags in markdown via custom remark plugin
- Avoids headless browser dependency entirely

### Sanitization (guides/06)

**rehype-sanitize schema for iframes (spread pattern):**
```js
import { defaultSchema } from 'rehype-sanitize'
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    iframe: ['src', 'width', 'height', 'allowfullscreen', 'title'],
  }
}
```

**Critical ordering:** `rehypeSanitize` MUST come after `rehypeRaw`

**DOMPurify use case:** client-side fallback when content is rendered in CSR context (AI chat renderer, user-generated content widget)

**allowDangerousHtml in @mdx-js/mdx:** Safe ONLY when source is fully trusted (your own content files). Never for user-authored content.
