# Docusaurus v3.10: Setup and v4-Ready Configuration

Docusaurus v3.10 (April 2026) is the final v3.x release. v4 is incoming and will require React 19. Start all new Docusaurus projects in v4-ready mode.

> Source: `research/external/2026-05-20-docusaurus-v3-react19-v4-roadmap.md`

---

## New project setup

```bash
npx create-docusaurus@latest my-docs classic --typescript
cd my-docs
npm run start
```

## Enable v4 flags immediately

In `docusaurus.config.ts`, add:

```ts
const config: Config = {
  future: {
    experimental_faster: true,   // Rspack bundler (enabled by default in v4)
    v4: {
      removeLegacyPostcssConfig: true,
      useSassVariables: false,
    },
  },
  // ... rest of config
};
```

## Monorepo integration

Place docs in a `docs/` workspace at the repo root. Configure `docusaurus.config.ts`:

```ts
export default {
  url: 'https://docs.example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',   // ALWAYS throw; never warn
  onBrokenMarkdownLinks: 'throw',
  // ...
};
```

Run `docusaurus.config.ts` from the `docs/` workspace; reference `../../packages/` for cross-workspace content if needed.

## Versioning

Docusaurus versioning creates a snapshot of current docs:

```bash
npm run docusaurus docs:version 1.0.0
```

This creates `versioned_docs/version-1.0.0/`. Only version when you have a released version that users are actively running. Do NOT create versions speculatively.

## Key plugins (2026 ecosystem)

| Plugin | Purpose |
|---|---|
| `@docusaurus/plugin-content-docs` | Included in classic preset |
| `@docusaurus/plugin-content-blog` | Changelog / blog |
| `docusaurus-plugin-openapi-docs` | OpenAPI reference rendering (route to `api-docs-worker-bee` for spec authorship) |
| `@docusaurus/plugin-ideal-image` | Image optimization |
| `@docusaurus/plugin-search-local` | Offline search fallback; prefer pagefind for production |
| `remark-mermaid` | Diagram rendering in MDX |

## Deployment

| Target | Method |
|---|---|
| Vercel | Zero-config (framework detected automatically) |
| Netlify | Zero-config |
| GitHub Pages | `npm run deploy` with `deploymentBranch: 'gh-pages'` in config |
| CloudFront + S3 | `npm run build` → sync `build/` to S3 bucket |

## v3 → v4 migration notes

When v4 ships:
1. Update React to v19 (`npm install react@19 react-dom@19`).
2. Remove any direct `@docusaurus/core` peer dep hacks.
3. Rspack is enabled by default: remove any Webpack plugin customizations.
4. Remove `removeLegacyPostcssConfig` from `future` (it's the default in v4).

See Docusaurus v4 migration guide when released at https://docusaurus.io/docs/migration.
