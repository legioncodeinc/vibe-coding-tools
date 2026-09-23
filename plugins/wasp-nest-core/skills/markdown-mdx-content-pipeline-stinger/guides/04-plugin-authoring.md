# Plugin Authoring

Write typed remark and rehype plugins using the unified visitor pattern.

---

## The unified plugin function signature

A unified plugin is a function that returns a transformer. The transformer receives the tree (mdast or hast) and the vfile, and optionally returns a Promise.

```typescript
import type { Plugin, Transformer } from 'unified'
import type { Root } from 'mdast'   // or 'hast' for rehype plugins

const myRemarkPlugin: Plugin<[], Root> = () => {
  const transformer: Transformer<Root> = (tree, file) => {
    // mutate tree here
  }
  return transformer
}

export default myRemarkPlugin
```

For plugins with options:

```typescript
interface MyOptions {
  prefix?: string
}

const myPlugin: Plugin<[MyOptions?], Root> = (options = {}) => {
  const { prefix = 'note' } = options
  return (tree, file) => {
    // use prefix
  }
}
```

---

## Visiting nodes: unist-util-visit

`unist-util-visit` traverses the tree and calls a visitor function for each matching node type.

**Install:** `npm i unist-util-visit`

```typescript
import { visit } from 'unist-util-visit'
import type { Root, Paragraph, Text } from 'mdast'

const addPrefixPlugin: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'paragraph', (node: Paragraph) => {
    // node.children is an array of PhrasingContent
    const first = node.children[0]
    if (first.type === 'text') {
      (first as Text).value = `[PREFIX] ${first.value}`
    }
  })
}
```

### Visitor signatures

```typescript
// Simple: visit all nodes of a type
visit(tree, 'code', (node) => { /* ... */ })

// With index and parent (for replacing or removing nodes):
visit(tree, 'code', (node, index, parent) => {
  if (parent && index !== null) {
    parent.children.splice(index, 1, replacementNode)
    return [SKIP, index]   // SKIP avoids re-visiting the replacement
  }
})
```

Import `SKIP`, `CONTINUE`, `EXIT` from `unist-util-visit` to control traversal.

---

## Writing a remark plugin: custom callout/admonition

A callout is a `:::note Title` directive block. After installing `remark-directive`, the plugin transforms directive nodes into custom hast elements.

```typescript
// remark-callout.ts
import type { Plugin } from 'unified'
import type { Root, BlockContent } from 'mdast'
import { visit } from 'unist-util-visit'
// ContainerDirective is from 'mdast-util-directive'
import type { ContainerDirective } from 'mdast-util-directive'

const remarkCallout: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'containerDirective', (node: ContainerDirective) => {
    if (!['note', 'tip', 'warning', 'danger'].includes(node.name)) return

    // Transform to a custom HTML element via hast properties
    const data = node.data ?? (node.data = {})
    data.hName = 'div'
    data.hProperties = {
      className: [`callout callout-${node.name}`],
    }
  })
}

export default remarkCallout
```

Usage in Markdown:
```markdown
:::note My Title
Content inside the callout.
:::
```

---

## Writing a rehype plugin: add data attributes to code blocks

```typescript
// rehype-code-meta.ts
import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

const rehypeCodeMeta: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'code') return
    const meta = (node.data as { meta?: string } | undefined)?.meta ?? ''
    if (meta) {
      node.properties = node.properties ?? {}
      node.properties['data-meta'] = meta
    }
  })
}

export default rehypeCodeMeta
```

---

## TypeScript types reference

| Type | Package | Use for |
|---|---|---|
| `Root`, `Paragraph`, `Heading`, `Code` | `mdast` | remark plugin node types |
| `Root`, `Element`, `Text` | `hast` | rehype plugin node types |
| `Node`, `Parent`, `Literal` | `unist` | generic AST base types |
| `ContainerDirective`, `LeafDirective` | `mdast-util-directive` | remark-directive node types |
| `Plugin`, `Transformer` | `unified` | plugin function signatures |

Install: `npm i -D @types/mdast @types/hast @types/unist`

---

## Testing plugins

Isolate the plugin and test against known input/output pairs:

```typescript
// my-plugin.test.ts
import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import myPlugin from './my-plugin'

describe('myPlugin', () => {
  it('transforms a paragraph', async () => {
    const result = await unified()
      .use(remarkParse)
      .use(myPlugin)
      .use(remarkStringify)
      .process('Hello world')
    expect(String(result)).toMatchSnapshot()
  })
})
```

See `guides/07-testing.md` for the full testing guide.

---

## Common pitfalls

1. **Mutating the tree while visiting it**: use `return [SKIP, index]` after splice operations to prevent double-processing.
2. **Forgetting the plugin is synchronous by default**: if you need async work inside a plugin, return a `Promise<void>` from the transformer.
3. **Wrong plugin position**: remark plugins that depend on `remarkMath` or `remarkDirective` nodes must come after those plugins in the chain.
4. **Accessing `node.data.hProperties` in remark plugins**: this is the bridge to rehype; it works, but be explicit about the hast property names (kebab-case for attributes, camelCase for DOM properties).
