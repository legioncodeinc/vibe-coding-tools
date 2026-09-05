# Compiler Selection

Choose the right MDX compiler before writing any pipeline code. The choice is near-irreversible once a content directory is built around it.

---

## 2026 Compiler Landscape

### @next/mdx

- **Use when:** `.mdx` files are Next.js page routes (rendered as full pages, not content fetched at runtime)
- **Install:** `npm i @next/mdx @mdx-js/loader @mdx-js/react`
- **Config:** wraps `next.config.mjs` via `createMDX()`
- **Required:** `mdx-components.tsx` at project root; mandatory for App Router, will not work without it
- **Plugin entry point:** `remarkPlugins` and `rehypePlugins` arrays inside `createMDX({ options: {...} })`
- **Limitations:** less flexible than Velite for content collections with typed frontmatter schemas

```mjs
// next.config.mjs
import createMDX from '@next/mdx'
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, [rehypePrettyCode, { theme: 'github-dark' }]],
  },
})
export default withMDX(nextConfig)
```

```tsx
// mdx-components.tsx (REQUIRED at project root)
import type { MDXComponents } from 'mdx/types'
export function useMDXComponents(): MDXComponents {
  return {}   // component map owned by react-worker-bee
}
```

---

### Velite (recommended for content collections)

- **Use when:** blog posts, docs pages, any content that needs typed frontmatter schemas and build-time processing
- **Status:** actively maintained; recommended 2026 replacement for Contentlayer and next-mdx-remote
- **Turbopack:** safe: uses a prebuild-step pattern in `next.config.mjs`, avoids VeliteWebpackPlugin (Turbopack-incompatible)
- **Output:** inert typed JSON/JS module strings; full RSC support; renders at build time with zero client-side overhead

```javascript
// next.config.mjs (prebuild pattern — Turbopack-safe)
const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  import('velite').then(m => m.build({ watch: isDev, clean: !isDev }))
}
```

```javascript
// velite.config.js
import { defineConfig, s } from 'velite'
export default defineConfig({
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/*.mdx',
      schema: s.object({
        title: s.string(),
        date: s.isodate(),
        description: s.string().optional(),
        code: s.mdx(),          // compiled MDX function body
      }),
    },
  },
})
```

Plugin chain in velite: configure via `mdx` option in `defineConfig`, same remark/rehype arrays as @next/mdx.

---

### next-mdx-remote v6 (legacy / archived)

- **Status:** archived by Hashicorp as of 2026. v6.0.0 is the final release (February 12, 2026). No future updates.
- **RSC mode:** import from `next-mdx-remote/rsc`. Has a fatal bug with Next.js 15.2.x (`Cannot read properties of undefined (reading 'stack')`). Workaround: downgrade to Next.js 15.1.7.
- **Turbopack:** requires `transpilePackages: ['next-mdx-remote']` in `next.config.js`
- **Use if:** you have an existing next-mdx-remote codebase and cannot migrate yet. For new projects, use Velite.
- **Migration path:** next-mdx-remote → Velite is the recommended 2026 upgrade.

---

### Contentlayer2 (community fork, stop-gap)

- **Status:** community-maintained fork of the abandoned original Contentlayer. Latest release: May 2025.
- **Contentlayer (original):** abandoned since 2023; has compatibility issues with Next.js 14+ and React 19.
- **Contentlayer2:** interim solution for teams already on Contentlayer; not recommended for new projects.
- **Migration path:** Contentlayer → Contentlayer2 (minimal effort, short-term); Contentlayer → Velite (recommended long-term).

---

### @mdx-js/mdx direct

- **Use when:** maximum control is required; dynamic content from a database or API that is compiled at request time (not build time)
- **Key APIs:**
  - `compile(source, options)`: returns a VFile with JavaScript
  - `evaluate(source, options)`: compiles + evaluates; returns `{ default: MDXContent, ... }`
  - `run(code, options)`: runs a pre-compiled function body
  - `outputFormat: 'function-body'`: produces a function body string safe to `eval` in sandboxed contexts
  - `outputFormat: 'program'` (default): full ESM module output

```typescript
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

const { default: Content } = await evaluate(source, {
  ...runtime,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSanitize],
})
```

---

## Decision matrix

| Trigger phrase | Recommended compiler |
|---|---|
| "blog with frontmatter and typed schema" | **Velite** |
| "MDX as Next.js page route" | **@next/mdx** |
| "dynamic content from database / API" | **@mdx-js/mdx** (evaluate) |
| "migrating from Contentlayer" | Velite (long-term) or Contentlayer2 (stop-gap) |
| "migrating from next-mdx-remote" | **Velite** |
| "existing next-mdx-remote, cannot migrate" | next-mdx-remote v6 (maintain, plan migration) |
| "Astro docs site" | Platform's built-in MDX integration |
| "AI chat renderer, user-authored content" | **@mdx-js/mdx** with `function-body` + sanitize |
