# Sanitization

XSS sanitization is non-negotiable for any pipeline that processes user-authored Markdown. MDX can embed arbitrary JSX: without sanitization, a malicious `<script>` or event handler in user content executes in the application's origin.

---

## When sanitization is required

| Source of Markdown | Sanitize? |
|---|---|
| Your own content files (controlled repo) | Optional (trust the source) |
| CMS where editors are trusted staff | Situational (align with security team) |
| User-generated content (comments, forums) | **Always** |
| AI chat renderer (user-authored messages) | **Always** |
| Anonymous API input | **Always** |

---

## rehype-sanitize (server-side)

`rehype-sanitize` is a rehype plugin that strips unsafe HTML from the hast tree. It must be placed AFTER `rehypeRaw` in the pipeline.

```bash
npm i rehype-sanitize
```

### Default schema

```javascript
import rehypeSanitize from 'rehype-sanitize'

.use(rehypeSanitize)   // uses defaultSchema — conservative allowlist
```

The `defaultSchema` allows standard HTML elements (headings, paragraphs, lists, links, images, code blocks) and strips script, iframe, style, and event handler attributes.

### Custom schema: allow iframes

For docs sites that embed videos or third-party content:

```javascript
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

const docsSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    iframe: ['src', 'width', 'height', 'allowfullscreen', 'title', 'loading'],
    // src should be further validated — see 'allowedUrls' approach below
  },
}

.use(rehypeSanitize, docsSchema)
```

> Allowing `<iframe src>` without validating the `src` URL re-opens XSS for malicious `javascript:` URLs. Validate the src against an allowlist of trusted domains.

### Custom schema: user-generated content (strict)

```javascript
import { defaultSchema } from 'rehype-sanitize'

const ugcSchema = {
  tagNames: [
    'p', 'br', 'strong', 'em', 'code', 'pre', 'blockquote',
    'ul', 'ol', 'li', 'a', 'img',
  ],
  attributes: {
    a: ['href'],          // href only; target/rel controlled below
    img: ['src', 'alt'],  // src should be validated against CDN allowlist
    code: ['class'],      // needed for syntax highlighting class names
  },
}
```

---

## Critical ordering: rehypeSanitize AFTER rehypeRaw

```javascript
// CORRECT:
.use(rehypeRaw)       // parse raw HTML nodes from markdown
.use(rehypeSanitize)  // sanitize AFTER raw HTML is parsed

// WRONG — raw HTML bypasses sanitization:
.use(rehypeSanitize)  // sanitizes before rehypeRaw runs → raw HTML still passes through
.use(rehypeRaw)
```

---

## allowDangerousHtml in @mdx-js/mdx

```javascript
import { compile } from '@mdx-js/mdx'

// Safe ONLY when source is fully trusted (your own content files):
const result = await compile(source, {
  allowDangerousHtml: true,
})

// For user-authored content: use rehypeSanitize INSTEAD of allowDangerousHtml:
const result = await compile(source, {
  allowDangerousHtml: false,   // default; do not set to true
  rehypePlugins: [rehypeSanitize],
})
```

Never set `allowDangerousHtml: true` for user-authored content. It allows raw `<script>` tags in the source to execute.

---

## DOMPurify (client-side fallback)

Use DOMPurify when Markdown is rendered client-side (AI chat renderer, live preview editor) and a rehype pipeline is not available.

```bash
npm i dompurify
npm i -D @types/dompurify
```

```typescript
import DOMPurify from 'dompurify'

// After rendering Markdown to HTML (e.g., via marked or a lightweight renderer):
const rawHtml = renderMarkdown(userInput)
const safeHtml = DOMPurify.sanitize(rawHtml, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'blockquote',
                 'ul', 'ol', 'li', 'a', 'img'],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'class'],
  ALLOW_DATA_ATTR: false,
})

// Render to DOM:
element.innerHTML = safeHtml
```

In React, use `dangerouslySetInnerHTML` only with the sanitized string:

```tsx
<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

### DOMPurify in SSR (Next.js)

DOMPurify requires a DOM. In SSR environments, use `isomorphic-dompurify` or guard with `typeof window !== 'undefined'`:

```typescript
import DOMPurify from 'isomorphic-dompurify'
const safeHtml = DOMPurify.sanitize(rawHtml, config)
```

---

## Link href validation

Even with sanitization, `href="javascript:..."` on anchor elements is an XSS vector. Explicitly block it:

```javascript
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      // Use a validator function to block javascript: URIs:
    ],
  },
  protocols: {
    href: ['http', 'https', 'mailto', 'tel'],  // whitelist safe protocols
    src: ['http', 'https'],
  },
}
```

`rehype-sanitize` supports `protocols` in the schema to restrict allowed URL schemes.

---

## Sanitization checklist

- [ ] `rehypeSanitize` is in the plugin chain
- [ ] `rehypeSanitize` comes AFTER `rehypeRaw`
- [ ] `allowDangerousHtml` is NOT set to `true` for user-authored content
- [ ] iframe src values are validated against a domain allowlist
- [ ] `href` protocols are restricted to `http`, `https`, `mailto`
- [ ] DOMPurify is used for any client-side rendering of user content
- [ ] `security-worker-bee` has reviewed the full XSS posture beyond this config
