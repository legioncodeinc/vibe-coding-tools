# Happy Path: Greenfield Starlight Docs Site

**Scenario:** An open-source TypeScript library team wants to launch developer docs from scratch. Budget: $0. Team: JS/TS developers. Content: getting-started guide, API reference, concepts. No versioning yet.

**Platform selected:** Starlight (Astro), per `guides/00-platform-selection.md` Profile A.

---

## Step-by-step walkthrough

### 1. Platform selection (guides/00-platform-selection.md)

Running the decision tree:
- Hard filters: MkDocs Material eliminated (maintenance mode). GitBook eliminated ($0 budget).
- Scoring: Starlight scores highest on cost (free), platform health (5), and customization (5).
- Result: **Starlight** recommended.
- Trade-off named: v0.x semver, pin versions.
- Fallback: Docusaurus v3.10 if React component integration proves necessary.

### 2. Content structure (guides/01-content-pyramid.md)

Mapping to Diátaxis four kinds:
```
src/content/docs/
├── getting-started/
│   └── quickstart.md          <- Tutorial
├── guides/
│   ├── installation.md         <- How-to
│   └── configuration.md        <- How-to
├── reference/
│   ├── api.md                  <- Reference (or link to api-docs-worker-bee output)
│   └── config-options.md       <- Reference
└── concepts/
    └── architecture.md         <- Explanation
```

### 3. Site setup (guides/07-starlight.md)

```bash
npm create astro@latest my-lib-docs -- --template starlight
cd my-lib-docs
npm run dev
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'my-lib',
      social: { github: 'https://github.com/org/my-lib' },
      sidebar: [
        { label: 'Getting Started', items: [{ label: 'Quickstart', slug: 'getting-started/quickstart' }] },
        { label: 'Guides', autogenerate: { directory: 'guides' } },
        { label: 'Reference', autogenerate: { directory: 'reference' } },
        { label: 'Concepts', autogenerate: { directory: 'concepts' } },
      ],
    }),
  ],
});
```

### 4. Docs-as-code CI (guides/02-docs-as-code.md)

```yaml
# .github/workflows/docs.yml
name: Docs CI
on: [pull_request]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx astro build          # build check
      - uses: lycheeverse/lychee-action@v2
        with:
          args: --verbose --no-progress "**/*.md"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 5. Search (guides/03-search.md)

Starlight has pagefind built-in. Search is active by default: no extra configuration needed. Verify:
- [ ] Run `npx astro build` locally and confirm `dist/pagefind/` directory exists.
- [ ] Open `dist/index.html` locally and test search returns correct results.

### 6. Deployment

Vercel: connect repo → Astro framework detected → deploy. Done.

---

## Output artifact

A populated `docs/docs-site-plan.md` confirming:
- Platform: Starlight v0.38.x, pinned
- Content structure: 4-section Diátaxis model
- CI: lychee dead-link check + Astro build
- Search: pagefind (built-in)
- Deployment: Vercel
- Trade-off documented: v0.x semver; versions pinned

**References:** `guides/00-platform-selection.md`, `guides/01-content-pyramid.md`, `guides/02-docs-as-code.md`, `guides/03-search.md`, `guides/07-starlight.md`
