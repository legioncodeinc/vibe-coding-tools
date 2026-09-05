# Docs-as-Code: CI Pipeline

Documentation without a CI gate drifts. The goal: every docs PR goes through the same quality gate as code PRs.

> Source: `research/external/2026-05-20-docs-as-code-vale-lychee-ci.md`

---

## The four CI checks for docs PRs

### 1. Prose linting (Vale)

Vale checks style rules against markdown content. Use it to enforce:
- Consistency (Oxford comma policy, heading capitalisation, verb tense)
- Accessibility (passive voice frequency, sentence length)
- Brand terms (product name spelling, forbidden jargon)

**Minimal `.vale.ini`:**
```ini
StylesPath = .vale/styles
MinAlertLevel = suggestion

[*.md]
BasedOnStyles = Vale, Microsoft
```

**GitHub Actions step:**
```yaml
- uses: errata-ai/vale-action@reviewdog
  with:
    files: docs/
    separator: ","
    filter_mode: added
    fail_on_error: true
```

> TODO: open question: Vale configuration reference should be scraped from https://vale.sh/ before adding platform-specific rule examples. Current guidance is sufficient for the minimal setup.

### 2. Dead link checking (lychee)

lychee is the 2026 recommended dead-link checker, faster than markdown-link-check and actively maintained.

**GitHub Actions step:**
```yaml
- name: Check links
  uses: lycheeverse/lychee-action@v2
  with:
    args: >
      --verbose
      --no-progress
      --exclude-all-private
      "**/*.md"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**`lychee.toml` for common false positives:**
```toml
exclude = [
  "localhost",
  "127.0.0.1",
  "example.com",
  "your-domain.com"
]
timeout = 20
max_retries = 3
```

### 3. Preview deploy

Every PR should deploy a preview of the docs site. Use the platform's native preview deploy:

| Platform | Preview deploy | Method |
|---|---|---|
| Starlight/Docusaurus/Nextra | Vercel or Netlify | Connect repo, auto-preview |
| Mintlify | Built-in (Mintlify dashboard) | Automatic on push |
| GitBook | Built-in (GitBook spaces) | Automatic on push |
| MkDocs Material | Netlify or GitHub Pages | `mkdocs build` in CI |
| Fern | Fern hosted | Automatic |

### 4. Build check

Run the platform's production build in CI to catch MDX/configuration errors before merge.

| Platform | Build command |
|---|---|
| Docusaurus | `npm run build` |
| Starlight | `npx astro build` |
| Nextra v4 | `next build` |
| MkDocs Material | `mkdocs build --strict` |
| Fern | `fern generate --preview` |

---

## Full CI workflow template

```yaml
name: Docs CI
on: [pull_request]

jobs:
  docs-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build          # build check
      - uses: errata-ai/vale-action@reviewdog  # prose lint
        with:
          files: docs/
          filter_mode: added
          fail_on_error: true
      - uses: lycheeverse/lychee-action@v2     # dead links
        with:
          args: --verbose --no-progress "**/*.md"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Contribution guidelines template

Include a `CONTRIBUTING.md` for docs contributors with:
1. How to run the site locally (`npm run start` / `mkdocs serve`).
2. Where to put new pages (per content pyramid kind from `guides/01-content-pyramid.md`).
3. The Vale style rules that are enforced.
4. How to fix broken links.
5. Preview deploy URL structure.

See `templates/docs-site-setup-checklist.md` for the launch checklist that includes contribution guidelines.
