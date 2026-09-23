# Math and Diagrams

Embedding math (LaTeX) and diagrams (Mermaid, D2) in Markdown/MDX.

---

## Math: remark-math + rehype-katex

### Setup

```bash
npm i remark-math rehype-katex
```

```javascript
// unified pipeline
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)          // must be BEFORE remarkRehype
  // ...
  .use(remarkRehype)
  .use(rehypeKatex)         // must be AFTER remarkRehype
  .use(rehypeStringify)
```

Also add the KaTeX CSS to your `<head>`:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css"
  crossOrigin="anonymous"
/>
```

### Markdown syntax

```markdown
Inline math: $E = mc^2$

Block (display) math:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### KaTeX vs MathJax

| | KaTeX | MathJax |
|---|---|---|
| Speed | Fast (synchronous) | Slower (async) |
| Coverage | Most common LaTeX | Complete LaTeX |
| Bundle size | Smaller | Larger |
| Recommendation | 2026 default | Only if KaTeX lacks a needed macro |

---

## Mermaid diagrams

Mermaid is the most common diagram-in-Markdown format. The key challenge is SSR safety: the Mermaid JS library requires a browser DOM to render SVGs.

### Strategy A: Client-side via next/script (recommended for Next.js)

Avoid a headless browser dependency entirely. Use `next/script` to load Mermaid.js after the page is interactive, then initialize it on `<pre class="mermaid">` elements.

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          id="mermaid-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              import('https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs')
                .then(m => m.default.initialize({ startOnLoad: true }))
            `,
          }}
        />
      </body>
    </html>
  )
}
```

Write a small remark plugin to wrap ` ```mermaid ` code blocks in `<pre class="mermaid">` tags instead of Shiki-highlighting them.

### Strategy B: rehype-mermaid SSR (build-time rendering)

`rehype-mermaid` v3.x renders Mermaid diagrams at build time using Playwright (headless browser) or a WASM approach.

**Known issue:** `TypeError: import.meta.resolve is not a function` in serverless / Next.js environments. This occurs because rehype-mermaid uses a Playwright integration that requires a real Node.js module resolution context.

**When to use:** Velite prebuild pipeline (runs in Node.js, not serverless) or a separate static build step.

```javascript
import rehypeMermaid from 'rehype-mermaid'

// Strategy options:
// 'inline-svg'  — render SVG and inline it (recommended for build-time)
// 'img-svg'     — render SVG, serve as <img src="...">
// 'img-png'     — render PNG via screenshot
// 'pre-mermaid' — leave as-is (for client-side fallback)

.use(rehypeMermaid, { strategy: 'inline-svg' })
```

**Playwright dependency:**
```bash
npm i @playwright/test
npx playwright install chromium
```

### Recommendation

- Next.js App Router → **Strategy A** (client-side via `next/script`)
- Velite build script or standalone Node.js build → **Strategy B** with `inline-svg`

---

## D2 diagrams

D2 is a newer diagram language with better ergonomics for software architecture diagrams. As of 2026, it does not have a widely-adopted rehype plugin.

**Options:**
1. Pre-render D2 diagrams to SVG at CI time and embed SVG files as static assets
2. Use the `d2` CLI in a Velite hook or prebuild step to render `.d2` files to SVG, then reference in MDX as `<img src="/diagrams/arch.svg">`

No remark/rehype integration is recommended yet.

---

## Callout/admonition directives

Using `remark-directive` for callout blocks (note, tip, warning, danger):

```markdown
:::note Important
This is a note callout.
:::

:::warning Caution
Watch out for this.
:::
```

Plugin to transform directive nodes to styled divs:

```javascript
// remark-callout.mjs
import { visit } from 'unist-util-visit'

export default function remarkCallout() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      const types = ['note', 'tip', 'warning', 'danger', 'info']
      if (!types.includes(node.name)) return
      const data = node.data ?? (node.data = {})
      data.hName = 'div'
      data.hProperties = { className: [`callout callout-${node.name}`] }
    })
  }
}
```

Style in CSS:
```css
.callout { border-left: 4px solid; padding: 1rem; margin: 1.5rem 0; }
.callout-note { border-color: #3b82f6; background: #eff6ff; }
.callout-warning { border-color: #f59e0b; background: #fffbeb; }
.callout-danger { border-color: #ef4444; background: #fef2f2; }
```
