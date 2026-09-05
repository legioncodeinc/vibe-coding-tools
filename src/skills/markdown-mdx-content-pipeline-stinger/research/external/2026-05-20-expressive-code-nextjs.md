---
source_type: official_docs
url: https://expressive-code.com/installation/
fetched: 2026-05-20
authority: high
relevance: high
topic: syntax_highlighting
---

# Expressive Code: Installation & Next.js Integration

## Summary
Official installation documentation for Expressive Code, a feature-rich syntax highlighting framework built on Shiki. Covers Next.js integration via the `rehype-expressive-code` rehype plugin. As of Feb 2026, `@expressive-code/plugin-shiki` v0.41.7 depends on Shiki ^3.2.2, confirming Shiki v3 compatibility. Used as the default syntax highlighter in Starlight (Astro docs framework).

## Key quotations / statistics
- `@expressive-code/plugin-shiki` v0.41.7 published Feb 23, 2026; depends on Shiki ^3.2.2
- Integration: `npm i rehype-expressive-code`
- Configuration via `rehypeExpressiveCodeOptions` object passed as second element in tuple
- Supports plugins like `@expressive-code/plugin-collapsible-sections`

## Key pattern for Next.js
```javascript
// next.config.mjs
import createMDX from '@next/mdx'
import rehypeExpressiveCode from 'rehype-expressive-code'

const rehypeExpressiveCodeOptions = {
  // theme, plugins, etc.
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [
      [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
    ],
  },
})
export default withMDX(nextConfig)
```

## Adding plugins
```javascript
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

const rehypeExpressiveCodeOptions = {
  plugins: [pluginCollapsibleSections()],
}
```

## Annotations for stinger-forge
- Informs `guides/03-syntax-highlighting.md`: expressive-code section
- The rehype plugin pattern (`rehype-expressive-code`) is how it integrates with the remark/rehype pipeline
- expressive-code is the recommended choice when Starlight is the platform (docs-site-worker-bee domain handoff)
- After platform decision, this stinger implements the highlighting config
- Upgrade: `npm i rehype-expressive-code@latest`
