# Nextra v4: Next.js App Router Docs

Nextra v4 (2025/2026) moved to Next.js App Router. Built-in pagefind search. Best for teams with a Next.js monorepo who want docs alongside their application code.

> Source: `research/external/2026-05-20-nextra-v4-next-js.md`

---

## When to choose Nextra v4

- Team is already on Next.js and wants docs in the same repo.
- MDX components need to share code with the application (e.g., live component previews).
- SSR or ISR is required for docs content.
- Team comfort: they know React/Next.js better than Astro.

## New project setup

```bash
npx create-next-app my-docs
cd my-docs
npm install nextra nextra-theme-docs
```

## `next.config.mjs`

```js
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})

export default withNextra({
  // standard Next.js config
})
```

## `theme.config.jsx`

```jsx
export default {
  logo: <span>My Docs</span>,
  project: {
    link: 'https://github.com/org/repo',
  },
  docsRepositoryBase: 'https://github.com/org/repo/blob/main',
  footer: {
    text: 'MIT 2026',
  },
}
```

## Content structure

```
pages/          (or app/ for App Router)
└── docs/
    ├── _meta.json        # sidebar ordering
    ├── index.mdx         # docs home
    ├── getting-started.mdx
    └── api-reference/
        ├── _meta.json
        └── endpoints.mdx
```

**`_meta.json` example:**
```json
{
  "index": "Introduction",
  "getting-started": "Getting Started",
  "api-reference": {
    "title": "API Reference",
    "type": "page"
  }
}
```

## v3 → v4 migration notes

Nextra v4 is an App Router rewrite. Key breaking changes from v3:
- `pages/` directory still works but `app/` is recommended.
- `getStaticProps`-based MDX data fetching is replaced by App Router conventions.
- Theme config API changed: review https://nextra.site/docs for the v4 theme config reference.

> TODO: open question: Nextra v3 → v4 migration friction not fully characterized in research. Verify breaking changes at https://nextra.site/docs before recommending a migration from v3 to v4. Source: `research/research-summary.md` open question #5.

## Deployment

Nextra v4 is a Next.js application; deploy anywhere Next.js runs:
- Vercel (native, zero-config)
- Netlify (`@netlify/plugin-nextjs`)
- Docker with `next start`
