---
source_type: official_docs
url: https://velite.js.org/guide/with-nextjs
fetched: 2026-05-20
authority: high
relevance: high
topic: mdx_compiler
---

# Velite: Integration with Next.js (Official Docs)

## Summary
Official Velite documentation for Next.js integration. Velite is the recommended 2026 replacement for Contentlayer/Contentlayer2. Runs as a prebuild step, outputs typed JSON/JS module strings, fully compatible with Turbopack and App Router RSC. The prebuild-in-next.config.mjs pattern avoids the VeliteWebpackPlugin which is incompatible with Turbopack.

## Key quotations / statistics
- "Turbopack (which Next.js is adopting) is incompatible with the VeliteWebpackPlugin"
- Recommended approach: run Velite as a prebuild step directly in `next.config.mjs`
- "Velite compiles MDX to a function-body string that can be rendered with a custom component"
- 2026 bilingual blog example: processes MDX files through Velite as prebuild, outputs typed JSON to Next.js; chain: rehype-slug → remark-math + rehype-katex → rehype-pretty-code (Shiki)
- "All content rendering resolves at build time with no client-side JavaScript overhead"

## Key pattern
```javascript
// next.config.mjs
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
        code: s.mdx()
      })
    }
  }
})
```

## Annotations for stinger-forge
- Informs `guides/01-compiler-selection.md`: Velite section, this is the primary recommended path for 2026 Next.js MDX content
- The `s.mdx()` schema type is the key API surface to document
- The Turbopack compatibility note is a critical differentiator vs Contentlayer/next-mdx-remote
- Include the prebuild pattern as the canonical code example
- The real-world "bilingual blog with Next.js 16, Velite, MDX" (shinyaz.com) demonstrates the full plugin chain
