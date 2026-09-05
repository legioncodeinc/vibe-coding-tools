# Remark/Rehype Plugin Pipeline

The plugin ordering is the single most common source of bugs in unified pipelines. This guide defines the canonical order and explains why each position matters.

---

## Canonical plugin chain (2026)

```javascript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeKatex from 'rehype-katex'
import { rehypePrettyCode } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'

const processor = unified()
  // ── remark (mdast) plugins ──────────────────────────────────
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml', 'toml'])  // extract frontmatter before GFM
  .use(remarkGfm)                            // tables, strikethrough, task lists
  .use(remarkMath)                           // $inline$ and $$block$$ math
  .use(remarkDirective)                      // :::callout custom directives
  .use(myCustomRemarkPlugin)                 // custom plugins go here
  // ── bridge ───────────────────────────────────────────────────
  .use(remarkRehype, { allowDangerousHtml: false }) // mdast → hast
  // ── rehype (hast) plugins ────────────────────────────────────
  .use(rehypeRaw)                            // parse raw HTML nodes (if needed)
  .use(rehypeSanitize, schema)               // MUST come after rehypeRaw
  .use(rehypeKatex)                          // render math nodes → KaTeX HTML
  .use(rehypePrettyCode, { theme: 'github-dark' }) // syntax highlighting
  .use(rehypeSlug)                           // add id to headings
  .use(rehypeAutolinkHeadings)               // add # links to headings
  .use(rehypeStringify)                      // hast → HTML string
```

> **Critical rule:** `rehypeSanitize` MUST come after `rehypeRaw`. Placing it before allows raw HTML nodes to survive sanitization in the next step.

---

## Remark plugin (mdast) ordering rules

1. `remarkParse` always first; it produces the mdast tree.
2. `remarkFrontmatter` before `remarkGfm`; frontmatter parsing must happen before GFM processes lines.
3. `remarkGfm`: GitHub Flavored Markdown: tables, strikethrough, autolinks, task lists.
4. `remarkMath`: must be BEFORE `remarkRehype`; adds `math` and `inlineMath` mdast nodes.
5. `remarkDirective`: must be BEFORE any custom directive processor plugins.
6. Custom remark plugins: after the above, before `remarkRehype`.

## Rehype plugin (hast) ordering rules

1. `rehypeRaw`: parses raw HTML nodes from mdast into the hast tree (only needed if source contains literal HTML).
2. `rehypeSanitize`: immediately after `rehypeRaw`. This is non-negotiable for user-authored content.
3. `rehypeKatex`: processes `math` hast nodes; requires `remarkMath` upstream.
4. `rehypePrettyCode` / `rehypeExpressiveCode`: syntax highlighting; must come before `rehypeStringify`.
5. `rehypeSlug`: assigns `id` attributes to heading elements.
6. `rehypeAutolinkHeadings`: injects anchor links; must come after `rehypeSlug`.
7. `rehypeStringify`: always last; produces the HTML string.

---

## Common plugin packages (pinned to latest stable)

| Plugin | Package | Notes |
|---|---|---|
| remark-gfm | `remark-gfm@4` | GFM: tables, strikethrough, task lists |
| remark-frontmatter | `remark-frontmatter@5` | YAML/TOML frontmatter extraction |
| remark-math | `remark-math@6` | LaTeX math syntax |
| remark-directive | `remark-directive@3` | Custom directive syntax `:::` |
| remark-mdx | bundled in @mdx-js/mdx | MDX JSX syntax; auto-included in MDX compilers |
| rehype-sanitize | `rehype-sanitize@6` | XSS sanitization |
| rehype-katex | `rehype-katex@7` | KaTeX rendering |
| rehype-pretty-code | `rehype-pretty-code@0.14.x` | Shiki v3/v4 wrapper |
| rehype-slug | `rehype-slug@6` | Heading IDs |
| rehype-autolink-headings | `rehype-autolink-headings@7` | Heading anchor links |

> **Pin versions.** Never use `"*"` or `"latest"`. The unified ecosystem releases breaking AST changes without major semver bumps.

---

## Configuration for Next.js @next/mdx

```mjs
// next.config.mjs
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { rehypePrettyCode } from 'rehype-pretty-code'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [rehypePrettyCode, { theme: 'github-dark' }],
    ],
  },
})
export default withMDX(nextConfig)
```

---

## Frontmatter extraction

`remark-frontmatter` marks the YAML block as a `yaml` node in mdast but does NOT parse it. To extract frontmatter values, add `remark-extract-frontmatter` or access `vfile.data.matter` after using `vfile-matter`:

```javascript
import remarkFrontmatter from 'remark-frontmatter'
import { matter } from 'vfile-matter'

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(() => (_, file) => { matter(file) })  // populates file.data.matter
  // ...
```

In Velite, frontmatter is extracted via the schema definition: no extra plugin needed.

---

## GFM: what it adds

`remark-gfm` adds support for:

- **Tables**: `| col | col |` syntax
- **Strikethrough**: `~~text~~`
- **Task lists**: `- [ ] item`, `- [x] done`
- **Autolinks**: bare URLs become links
- **Footnotes**: `[^1]` syntax

Without `remark-gfm`, tables render as plain text.
