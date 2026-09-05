# Starlight (Astro): v0.38+ Setup

Starlight is the **recommended greenfield choice for 2026**. Built on Astro v6, 8K+ GitHub stars, 200K+ weekly npm downloads, 300+ contributors. The v0.x semver means breaking changes per minor release: pin your versions.

> Source: `research/external/2026-05-20-starlight-astro-v6-stable.md`

---

## New project setup

```bash
npm create astro@latest my-docs -- --template starlight
cd my-docs
npm run dev
```

## Project structure

```
my-docs/
├── astro.config.mjs       # site config
├── src/
│   ├── content/
│   │   └── docs/          # all .md and .mdx files here
│   │       ├── index.mdx  # home page
│   │       ├── getting-started/
│   │       │   └── quickstart.md
│   │       └── reference/
│   │           └── configuration.md
│   └── assets/
│       └── logo.svg
└── public/
    └── favicon.svg
```

## `astro.config.mjs` minimal config

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      logo: { src: './src/assets/logo.svg' },
      social: {
        github: 'https://github.com/org/repo',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Quickstart', slug: 'getting-started/quickstart' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
      // Search: pagefind is built-in and enabled by default
      // To disable: pagefind: false
    }),
  ],
});
```

## Content collections

Starlight uses Astro content collections. Frontmatter for each page:

```yaml
---
title: My Page Title
description: One-sentence description for SEO.
sidebar:
  order: 1           # optional: manual ordering
  badge:
    text: New
    variant: tip     # default | note | tip | caution | danger
---
```

## Custom components

Starlight allows component overrides in `astro.config.mjs`:

```js
starlight({
  components: {
    SiteTitle: './src/components/CustomSiteTitle.astro',
    Head: './src/components/CustomHead.astro',
  },
})
```

Available override slots: `Footer`, `Header`, `Hero`, `MarkdownContent`, `MobileMenuFooter`, `MobileMenuToggle`, `PageFrame`, `PageSidebar`, `PageTitle`, `Pagination`, `Sidebar`, `SiteTitle`, `SocialIcons`, `ThemeProvider`, `ThemeSelect`, `TwoColumnContent`.

## Expressive Code (syntax highlighting)

Starlight ships with Expressive Code for beautiful syntax highlighting with diff marks, file names, and frame styles:

```md
```ts title="src/example.ts" {3-5}
const x = 1;
const y = 2;
// highlighted lines
const z = x + y;
```
```

## Deployment

| Target | Method |
|---|---|
| Vercel | Zero-config (Astro framework detected) |
| Netlify | Zero-config |
| Cloudflare Pages | Zero-config |
| GitHub Pages | `output: 'static'` in astro.config.mjs + GitHub Actions |

**GitHub Pages setup:**
```yaml
# .github/workflows/deploy.yml
- uses: withastro/action@v3
  with:
    node-version: 20
```

## Version pinning (important)

Starlight uses v0.x semver: minor version bumps CAN contain breaking changes.

```json
{
  "dependencies": {
    "@astrojs/starlight": "0.38.x",
    "astro": "^6.0.0"
  }
}
```

Review the [Starlight changelog](https://github.com/withastro/starlight/blob/main/packages/starlight/CHANGELOG.md) before upgrading minor versions.

---

> TODO: open question: Starlight configuration reference at https://starlight.astro.build/reference/configuration was flagged for deeper scraping in `research/research-summary.md`. Additional config options (internationalization, custom CSS, plugin API) can be found there.
