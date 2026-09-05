# Principles: Scope, AST Model, and Processing Layers

## Scope boundary

`markdown-mdx-content-pipeline-worker-bee` owns everything **between** a raw `.md`/`.mdx` source file and its final HTML/JSX/React output. It does NOT own:

| Domain | Owner |
|---|---|
| Documentation platform selection (Starlight, Docusaurus, Mintlify) | `docs-site-worker-bee` |
| `mdx-components.tsx` component map internals | `react-worker-bee` |
| Broader XSS audit beyond sanitization config | `security-worker-bee` |
| SEO/AEO of the rendered page | `seo-aeo-worker-bee` |
| Astro platform-level MDX configuration | `docs-site-worker-bee` |

**Practical handoff point:** When a user asks "which docs platform should I use?", route to `docs-site-worker-bee`. After platform is decided and it's time to configure remark/rehype plugins or the syntax highlighter, this stinger picks up.

---

## The unified AST model

Every Markdown/MDX processing pipeline in the unified ecosystem flows through a tree of abstract syntax tree (AST) nodes:

```
Source text (.md / .mdx)
        ↓
  [remark] mdast (Markdown AST)
        ↓ remarkRehype bridge
  [rehype] hast (Hypertext AST)
        ↓
  HTML string / JSX function body
```

### mdast (Markdown Abstract Syntax Tree)

- Defined by `@types/mdast` from the `@mdast` npm scope
- Node examples: `Root`, `Paragraph`, `Heading`, `Code`, `Link`, `Image`, `Math` (remark-math)
- Operated on by **remark plugins**: always run BEFORE `remarkRehype`

### hast (Hypertext Abstract Syntax Tree)

- Defined by `@types/hast` from the `@hast` npm scope
- Node examples: `Element`, `Text`, `Comment`, `DocType`
- Operated on by **rehype plugins**: always run AFTER `remarkRehype`

### The bridge

`remark-rehype` (and its configuration option `allowDangerousHtml`) converts mdast to hast. Plugin ordering relative to this bridge is the single most common source of bugs.

---

## The four processing layers

### 1. Parse

- Input: raw text
- Tool: `remark().parse()`: converts Markdown text to mdast
- Key plugins at this stage: none (parsing is a single step)

### 2. Transform (remark)

- Input: mdast
- Tool: remark plugins attached via `.use(remarkPlugin)`
- Run BEFORE `remarkRehype`
- Examples: `remark-gfm`, `remark-math`, `remark-frontmatter`, `remark-directive`, `remark-mdx`

### 3. Transform (rehype)

- Input: hast (after `remarkRehype` bridge)
- Tool: rehype plugins attached via `.use(rehypePlugin)`
- Run AFTER `remarkRehype`
- Examples: `rehype-sanitize`, `rehype-katex`, `rehype-pretty-code`, `rehype-slug`, `rehype-autolink-headings`

### 4. Compile/Render

- Input: hast
- Tool: `rehype-stringify` (HTML), `@mdx-js/mdx` compile step (JSX), Velite's `s.mdx()` schema type
- Output: HTML string, JavaScript function body, or React component

---

## MDX-specific notes

MDX adds a fifth layer: JSX embedding. In MDX, components in the component map (`mdx-components.tsx`) replace specific HTML elements with React components at render time. The **compile** step (server, build-time) is separate from the **render** step (server or client component).

- `allowDangerousHtml: true` in `@mdx-js/mdx` config: safe ONLY for fully trusted source files. Never for user-authored content.
- `outputFormat: 'function-body'` → server compiles, client evaluates. Used in AI chat renderers.
- `outputFormat: 'program'` (default) → full ESM module output. Used in build pipelines.
