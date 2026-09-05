---
source_type: official_docs
url: https://rehype-pretty.pages.dev/
fetched: 2026-05-20
authority: high
relevance: high
topic: syntax_highlighting
---

# Rehype Pretty Code: Official Documentation

## Summary
rehype-pretty-code is a Shiki wrapper as a rehype plugin. It provides a higher-level API over Shiki for code block rendering in unified pipelines. Supports line numbers via `@rehype-pretty/transformers`, line highlighting, word highlighting, and code block metadata strings. Currently at v0.14.x with Shiki 3 and 4 support.

## Key quotations / statistics
- "rehype-pretty-code version 0.14.1 and later support Shiki 3"
- "Version 0.14.2 added support for Shiki 4"
- `@rehype-pretty/transformers` provides `transformerLineNumbers` for line numbers
- `transformerLineNumbers` accepts `autoApply: boolean` (default: true)
- Previously had deprecation issue with `getHighlighter` → now migrated to `getSingletonHighlighter` / `createHighlighter`

## Key pattern
```javascript
import { rehypePrettyCode } from 'rehype-pretty-code'
import { transformerLineNumbers } from '@rehype-pretty/transformers'

// In unified .use() chain:
.use(rehypePrettyCode, {
  theme: 'github-dark',
  transformers: [
    transformerLineNumbers({ autoApply: false })
  ]
})
```

## Metadata string features (in markdown fence)
- `` ```js {1,3-5} ``: highlight lines 1, 3-5
- `` ```js showLineNumbers ``: show line numbers
- `` ```js /word/ ``: highlight word
- `` ```js title="filename.js" ``: show filename in caption

## Annotations for stinger-forge
- Informs `guides/03-syntax-highlighting.md`: rehype-pretty-code section
- The metadata string feature (line highlighting, word highlighting, titles) is a practitioner-facing feature to document with examples
- @rehype-pretty/transformers is a separate package: document as an optional add-on
- Contrast with direct Shiki usage: rehype-pretty-code adds the metadata parsing layer; direct Shiki is lower-level
