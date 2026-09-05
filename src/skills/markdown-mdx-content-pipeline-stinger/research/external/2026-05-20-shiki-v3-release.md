---
source_type: official_docs
url: https://shiki.style/blog/v3
fetched: 2026-05-20
authority: high
relevance: high
topic: syntax_highlighting
---

# Shiki v3.0.0 Release Blog Post

## Summary
Official Shiki v3 release post. The primary breaking change was renaming `getHighlighter` to `createHighlighter` to correct naming convention (the function creates a new instance, it doesn't "get" an existing one). No functional change: purely a naming correction. Also documents the singleton pattern for long-lived highlighter instances.

## Key quotations / statistics
- "In Shiki v3.0.0, `getHighlighter` has been renamed to `createHighlighter` as a straightforward find-and-replace change"
- "Correcting the naming to avoid confusion" (not a functional change)
- Highlighter instances "should be long-lived singletons and reused across your application rather than called in hot functions or loops"
- `codeToHtml` is the stable API for generating HTML from code: NOT deprecated in v3

## API pattern (v3+)
```typescript
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
})

// Long-lived singleton — call once at startup
const code = highlighter.codeToHtml('const a = 1', {
  lang: 'javascript',
  theme: 'nord'
})
```

## Annotations for stinger-forge
- Informs `guides/03-syntax-highlighting.md`: the `getHighlighter` → `createHighlighter` migration is the primary "deprecated API" gotcha to document
- The singleton pattern is the performance best practice: warn against creating highlighter instances per request
- `codeToHtml` is NOT deprecated: this is a common misconception from reading the v3 rename; clarify in the guide
- Cross-reference with Shiki v4 notes (separate source) for the complete migration picture
