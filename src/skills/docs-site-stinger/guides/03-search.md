# Search Configuration

An un-searchable docs site is worse than no docs site. Choose the right search solution and configure it before declaring the site done.

> Source: `research/external/2026-05-20-pagefind-self-hosted-search.md`

---

## Decision tree

```
Is the site open-source AND publicly accessible AND has significant traffic?
├── YES → Apply for Algolia DocSearch (free tier for eligible OSS)
│         └── Approved? → use Algolia DocSearch
│             NOT approved? → fall back to pagefind
└── NO
    ├── Is the platform managed (Mintlify, GitBook, Fern)?
    │   └── YES → use platform's built-in search (AI-powered in Mintlify)
    └── NO (self-hosted: Docusaurus, Starlight, Nextra, MkDocs Material)
        ├── Privacy-sensitive or air-gapped? → use pagefind (local, zero-dependency)
        └── Otherwise → pagefind is the 2026 default for self-hosted sites
```

> TODO: open question: Algolia DocSearch qualification criteria for 2026 not confirmed in research. Verify current eligibility at https://docsearch.algolia.com/ before recommending. Source: `research/research-summary.md` open question #4.

---

## Algolia DocSearch

Algolia's free tier for open-source documentation. Eligibility (verify current requirements):
- Publicly accessible
- Open-source or technical documentation
- Not a commercial product's primary sales page

**Setup:**
1. Apply at https://docsearch.algolia.com/apply.
2. Once approved, receive `appId`, `apiKey`, `indexName`.
3. Configure in the platform:

| Platform | Config location | Key |
|---|---|---|
| Docusaurus | `docusaurus.config.ts` > `themeConfig.algolia` | `appId`, `apiKey`, `indexName` |
| Starlight | `astro.config.mjs` > `starlight({ ... })` > `pagefind: false` + algolia plugin | |
| MkDocs Material | `mkdocs.yml` > `theme.features` + `plugins.search` override | |

**Crawler configuration:** Algolia sends a spider to index the site. Configure `record_css_selector` to exclude navigation, footer, and sidebar from indexed content.

---

## pagefind (recommended for self-hosted)

pagefind is a static site search library that indexes at build time, requires zero server-side infrastructure, and ships the search UI and index as static assets.

**Integration:**

For Docusaurus, Starlight (built-in since v0.12), and Nextra v4 (built-in):
- Starlight: enabled by default, no extra config needed.
- Nextra v4: built-in, enabled by default.
- Docusaurus: add `@pagefind/docusaurus` plugin.

**Manual integration (any static site):**
```html
<!-- After build, add to HTML template: -->
<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js"></script>
<div id="search"></div>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({ element: "#search", showSubResults: true });
  });
</script>
```

**Build integration:**
```bash
npx pagefind --site dist --output-path dist/pagefind
```

**GitHub Actions:**
```yaml
- run: npx pagefind --site dist
```

---

## Built-in platform search

| Platform | Search capability | Notes |
|---|---|---|
| Mintlify | AI-powered semantic search (built-in) | Included in Pro and Enterprise |
| GitBook | Full-text + AI search | Included in all plans |
| Fern | Search (details platform-specific) | Built-in |

---

## Search quality checklist

Before declaring search "done":

- [ ] Search returns the correct page for each platform's 5 most important terms.
- [ ] API reference methods are indexed and findable by method name.
- [ ] Navigation, footer, and sidebar content are excluded from search results.
- [ ] Search works on mobile (test on a real device, not just desktop viewport shrink).
- [ ] `robots.txt` does not block the search crawler (for Algolia).
- [ ] pagefind index is included in the build output and deployed with the site.
