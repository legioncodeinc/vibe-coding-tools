# Edge Case: GitBook → Starlight Migration

**Scenario:** A SaaS company uses GitBook for their docs ($249/month, 3 spaces). They want to migrate to a self-hosted solution to reduce costs and gain more customization control. Content: ~80 pages, API reference + guides.

**Driving concern:** GitBook's per-site pricing became expensive at scale; the team wants to own the deployment.

---

## Step-by-step walkthrough

### 1. Platform selection (guides/00-platform-selection.md)

- Hard filters: budget constraint removes Mintlify Pro.
- Profile A (open-source) doesn't apply; Profile C (deep customization) does.
- **Selected: Starlight**, same search quality, full customization, $0 hosting on Vercel.
- Trade-off: team must manage deployment; GitBook's non-technical editor UX is lost.
- Fallback: Docusaurus v3.10 if the team prefers React over Astro.

### 2. Content inventory

Before migrating, audit what exists in GitBook:
- [ ] List all pages and their GitBook URL slugs.
- [ ] Note any GitBook-specific features in use: synced blocks, API method cards, interactive examples.
- [ ] Note any custom CSS or theming.
- [ ] Export all content: GitBook → Export → Markdown ZIP.

### 3. Content migration

GitBook exports Markdown. Starlight consumes Markdown/MDX. Most content migrates directly:

**GitBook frontmatter:**
```yaml
---
description: Page description here
---
```

**Starlight frontmatter (add title):**
```yaml
---
title: Page Title
description: Page description here
---
```

**Batch rename hint:**
```bash
# Find all .md files missing a title frontmatter line
grep -rL "^title:" src/content/docs/
```

**GitBook-specific blocks to convert:**

| GitBook block | Starlight equivalent |
|---|---|
| `{% hint style="info" %}` | `:::note` admonition |
| `{% hint style="warning" %}` | `:::caution` admonition |
| `{% tabs %}` | MDX `<Tabs>` component |
| `{% code title="..." %}` | Expressive Code `title="..."` attribute |
| Synced blocks | Convert to MDX components or shared partials |

### 4. API reference migration

GitBook renders API reference via API method cards. In Starlight:
- Route OpenAPI spec rendering to `api-docs-worker-bee`.
- For manual reference pages: convert to Starlight reference pages (see `guides/01-content-pyramid.md`, reference section).

### 5. Navigation rebuild (guides/07-starlight.md)

Map GitBook's space structure to Starlight sidebar:

```js
// astro.config.mjs
sidebar: [
  { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
  { label: 'Guides', autogenerate: { directory: 'guides' } },
  { label: 'API Reference', autogenerate: { directory: 'reference' } },
],
```

### 6. Redirect map

Create a `vercel.json` redirect map for old GitBook URLs:

```json
{
  "redirects": [
    { "source": "/getting-started", "destination": "/getting-started/introduction", "permanent": true },
    { "source": "/api-reference", "destination": "/reference/overview", "permanent": true }
  ]
}
```

### 7. Docs-as-code CI (guides/02-docs-as-code.md)

Add the full CI pipeline from `guides/02-docs-as-code.md`. GitBook had no CI gate; this migration is an opportunity to add one.

---

## Output artifact

- Populated `src/content/docs/` directory with migrated content.
- `vercel.json` redirect map.
- `docs/migration-report.md` listing:
  - Pages migrated
  - GitBook blocks converted
  - Any pages that needed manual conversion (synced blocks, interactive API examples)
  - Redirect map coverage

**References:** `guides/00-platform-selection.md`, `guides/01-content-pyramid.md`, `guides/07-starlight.md`, `templates/migration-checklist.md`
