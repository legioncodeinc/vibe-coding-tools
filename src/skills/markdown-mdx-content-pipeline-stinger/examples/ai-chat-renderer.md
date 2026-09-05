# Example: Safe AI Chat Markdown Renderer

Render user-authored Markdown (and AI-generated Markdown) safely in a React chat UI. The key constraints: content is user-generated, XSS sanitization is mandatory, no custom JSX components from MDX (trust boundary), and the rendering must be fast (no full MDX compile pipeline per message).

---

## Stack choice

For AI chat rendering, full MDX compilation (`@mdx-js/mdx`) is overkill and introduces unnecessary attack surface (JSX execution from user input). Instead:

- **unified + remark-parse + remark-gfm + remark-rehype + rehype-sanitize + rehype-stringify**: server-side rendering
- **DOMPurify**: client-side fallback for live preview
- **NOT `allowDangerousHtml: true`**: never for user content
- **NOT full MDX compilation**: no JSX execution from user input

---

## Server-side renderer (API route / Server Component)

```typescript
// src/lib/render-chat-markdown.ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { rehypePrettyCode } from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'

// Strict allowlist for user-generated content
const chatSchema = {
  tagNames: [
    'p', 'br', 'hr', 'strong', 'em', 'del', 's',
    'code', 'pre', 'blockquote',
    'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  attributes: {
    a: ['href'],
    img: ['src', 'alt', 'width', 'height'],
    code: ['class'],   // needed for syntax highlighting class names
    '*': ['className'],
  },
  protocols: {
    href: ['https', 'http', 'mailto'],
    src: ['https', 'http'],
  },
  strip: ['script', 'style', 'iframe'],
}

const chatProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeRaw)
  .use(rehypeSanitize, chatSchema)    // MUST be after rehypeRaw
  .use(rehypePrettyCode, { theme: 'github-dark' })
  .use(rehypeStringify)

export async function renderChatMarkdown(markdown: string): Promise<string> {
  const result = await chatProcessor.process(markdown)
  return String(result)
}
```

---

## Server Component usage

```tsx
// src/components/chat-message.tsx
import { renderChatMarkdown } from '@/lib/render-chat-markdown'
import 'rehype-pretty-code/dist/style.css'  // or your own code styles

interface Props {
  content: string
  role: 'user' | 'assistant'
}

export async function ChatMessage({ content, role }: Props) {
  const html = await renderChatMarkdown(content)

  return (
    <div className={`message message-${role}`}>
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
```

---

## Client-side fallback: DOMPurify for live preview

For a live preview editor where the user sees Markdown rendered as they type:

```typescript
// src/lib/client-render.ts
'use client'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'   // lightweight client-side Markdown parser

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'code', 'pre', 'blockquote',
  'ul', 'ol', 'li', 'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]

const ALLOWED_ATTR = ['href', 'src', 'alt', 'class', 'width', 'height']

export function renderClientMarkdown(markdown: string): string {
  // 1. Parse Markdown to HTML (client-side)
  const rawHtml = marked.parse(markdown, { gfm: true }) as string

  // 2. Sanitize with DOMPurify
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPTS: true,
  })
}
```

```tsx
// LivePreview.tsx
'use client'
import { useState } from 'react'
import { renderClientMarkdown } from '@/lib/client-render'

export function LivePreview({ markdown }: { markdown: string }) {
  const html = renderClientMarkdown(markdown)
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

---

## Security checklist for chat renderers

- [ ] `rehypeSanitize` is in the server-side pipeline
- [ ] `rehypeSanitize` comes AFTER `rehypeRaw`
- [ ] `allowDangerousHtml` is NOT set to `true`
- [ ] Protocol allowlist restricts `href` to `https`, `http`, `mailto`
- [ ] Protocol allowlist restricts `src` to `https`, `http` (blocks `data:` URIs)
- [ ] DOMPurify is used for any client-side rendering
- [ ] `ALLOW_DATA_ATTR: false` in DOMPurify (prevents `data-*` XSS via DOM clobbering)
- [ ] `security-worker-bee` has reviewed the full XSS posture beyond this config

---

## Performance note

The unified pipeline is initialized once (`const chatProcessor = unified()...`) and reused across all renders. Do NOT create a new processor per message; it's expensive. The `process()` call itself is lightweight.

For very high request volume, consider caching rendered HTML by content hash (e.g., using Next.js `unstable_cache` or Redis) since the same AI message content is frequently repeated across users.
