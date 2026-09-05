---
source_type: official_docs
url: https://nextjs.org/docs/15/app/guides/mdx
fetched: 2026-05-20
authority: high
relevance: high
topic: mdx_compiler
---

# Guides: MDX | Next.js 15 Official Docs

## Summary
The official Next.js 15 documentation for MDX integration via @next/mdx. Documents the required `mdx-components.tsx` file, App Router configuration in `next.config.mjs`, supported remark/rehype plugins, and the distinction between content MDX and route MDX. Critical reference for stinger-forge when authoring the compiler-selection guide.

## Key quotations / statistics
- "The mdx-components file is required to use @next/mdx with App Router and will not work without it"
- `mdx-components.tsx` must export `useMDXComponents(): MDXComponents`
- Configuration in `next.config.mjs` via `createMDX` wrapper
- `pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"]` needed to treat .mdx files as routes

## Key patterns documented
```mjs
// next.config.mjs
import createMDX from '@next/mdx'
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})
export default withMDX(nextConfig)
```

```tsx
// mdx-components.tsx (REQUIRED at project root for App Router)
import type { MDXComponents } from 'mdx/types'
export function useMDXComponents(): MDXComponents {
  return {}
}
```

## Annotations for stinger-forge
- Informs `guides/01-compiler-selection.md`: @next/mdx section
- Informs `guides/02-remark-rehype-pipeline.md`: plugin configuration entry point for Next.js
- The "mdx-components.tsx is required" point is a common gotcha practitioners hit; add to guide as a callout
- Cross-boundary note: the content of `useMDXComponents` (component map) is owned by `react-worker-bee`, not this stinger
