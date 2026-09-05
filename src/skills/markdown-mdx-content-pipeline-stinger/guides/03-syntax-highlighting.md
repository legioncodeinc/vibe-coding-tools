# Syntax Highlighting

The 2026 syntax highlighting landscape for Markdown/MDX pipelines centers on the Shiki family. Prism and Highlight.js are legacy choices for new projects.

---

## Shiki v4 (recommended for most Next.js / Astro / Vite projects)

**Latest stable:** v4.0.0 (released February 27, 2026)
**Node.js requirement:** ≥ 20 (Node 18 EOL April 2025)

Shiki ships TextMate grammars: the same format used by VS Code and Sublime Text. It is the default highlighter in Vite, Astro, and Next.js ecosystems as of 2026.

### v3 → v4 migration

Direct bump: no API changes to core functions. Only breaking changes:
- Node 18 support dropped
- `createdBundledHighlighter()` renamed to `createBundledHighlighter()`
- `CreatedBundledHighlighterOptions` renamed to `CreateBundledHighlighterOptions`
- CSS class `twoslash-query-presisted` → `twoslash-query-persisted` (typo fix)

```typescript
// v3 / v4 core API — unchanged between versions
import { codeToHtml } from 'shiki'

const html = await codeToHtml('const x = 1', {
  lang: 'javascript',
  theme: 'github-dark',
})
```

### Shiki in Cloudflare Workers

- Avoid the full Shiki bundle (exceeds the 1 MiB script limit)
- Use fine-grained bundles with explicit grammar imports
- No `vm` module needed: Shiki uses WASM, compatible with Workers runtime
- Use `loadWasm` from `@shikijs/core` to supply the WASM binary explicitly

---

## rehype-pretty-code (Shiki as a rehype plugin)

`rehype-pretty-code` wraps Shiki as a `rehype` plugin, adding:
- Code block metadata string parsing (line highlighting, word highlighting, filename caption)
- Line number support via `@rehype-pretty/transformers`
- Shiki 3 support from v0.14.1; Shiki 4 support from v0.14.2

**Install:** `npm i rehype-pretty-code @rehype-pretty/transformers`

```javascript
import { rehypePrettyCode } from 'rehype-pretty-code'
import { transformerLineNumbers } from '@rehype-pretty/transformers'

// In the rehype plugin chain:
.use(rehypePrettyCode, {
  theme: 'github-dark',
  transformers: [
    transformerLineNumbers({ autoApply: false }),
  ],
})
```

### Markdown fence metadata

```markdown
```js {1,3-5} showLineNumbers title="example.js"
// This is highlighted on lines 1, 3-5
const x = 1
const y = 2
const z = 3
```
```

- `{1,3-5}`: highlight lines 1, 3, 4, 5
- `showLineNumbers`: show line numbers
- `/word/`: highlight specific word
- `title="..."`: show filename caption in rendered output

---

## expressive-code (recommended for Starlight sites)

`expressive-code` is a feature-rich syntax highlighting framework built on Shiki. It is the default highlighter in Starlight (the Astro docs framework). For non-Starlight Next.js projects, `rehype-pretty-code` is simpler.

**Status:** `@expressive-code/plugin-shiki` v0.41.7 (Feb 23, 2026) depends on Shiki `^3.2.2`.

**Install:** `npm i rehype-expressive-code @expressive-code/plugin-collapsible-sections`

```javascript
// next.config.mjs
import rehypeExpressiveCode from 'rehype-expressive-code'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [rehypeExpressiveCode, {
        plugins: [pluginCollapsibleSections()],
        themes: ['github-dark', 'github-light'],
      }],
    ],
  },
})
```

expressive-code adds beyond plain Shiki:
- Frame rendering (terminal, editor, with filename tabs)
- Copy button
- Collapsible sections
- Word wrap toggle

---

## starry-night (GitHub-fidelity, server-side only)

**Latest:** v3.9.0 (January 19, 2026)
**Use when:** you need GitHub-exact rendering (same grammars GitHub.com uses)

- 600+ TextMate grammars; 46.9K weekly npm downloads
- WASM-based; too heavy for browser bundles: server-side only
- Produces AST objects (not just HTML) enabling flexible rendering
- Companion package: `markdown-tm-language`, provides Markdown/MDX-specific grammars (CommonMark + GFM + frontmatter + directives + MDX)

**vs Shiki:** Shiki is more versatile, lighter, and easier to configure. Use starry-night only when GitHub-exact output is a hard requirement.

---

## Selection guide

| Situation | Pick |
|---|---|
| New Next.js blog or app | `rehype-pretty-code` (Shiki v4 wrapper) |
| Starlight (Astro docs) site | `expressive-code` (platform default) |
| Need collapsible sections, copy button, frame tabs | `expressive-code` |
| Need GitHub-exact output | `starry-night` (server only) |
| Cloudflare Workers | Shiki fine-grained bundle with explicit WASM |
| Legacy project on Prism | Migrate to Shiki; Prism is unmaintained |

---

## Deprecation note: `codeToHtml` vs `createHighlighter`

Both APIs still exist in Shiki v4. `codeToHtml` is a convenience function that creates and disposes a highlighter for each call. For repeated calls (e.g., highlighting many code blocks at build time), use `createHighlighter` and reuse the instance:

```typescript
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: ['javascript', 'typescript', 'bash'],
})

// Reuse across many blocks:
const html = highlighter.codeToHtml(code, { lang, theme: 'github-dark' })
```
