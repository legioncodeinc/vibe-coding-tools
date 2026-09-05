# Example: Scalar + GitHub Pages Setup

End-to-end setup for a TypeScript API using Scalar as the renderer and GitHub Pages for hosting.

**Demonstrates:** `guides/01-tool-selection.md` (Scalar choice), `guides/03-deployment.md` (GitHub Pages), `guides/02-examples.md` (CDN approach)

---

## Scenario

A TypeScript Express API has an `openapi.yaml` at the repo root. The team wants public API reference docs at `https://org.github.io/repo/`.

## Step 1: Create docs/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My API Reference</title>
    <style>
      body { margin: 0; }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="./openapi.yaml"
      data-configuration='{
        "theme": "default",
        "layout": "modern",
        "darkMode": true
      }'>
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>
```

## Step 2: Add the GitHub Actions workflow

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy API Docs

on:
  push:
    branches: [main]
    paths:
      - 'openapi.yaml'
      - 'docs/**'

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Copy OpenAPI spec to docs
        run: cp openapi.yaml docs/openapi.yaml

      - uses: actions/configure-pages@v4

      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/

      - id: deployment
        uses: actions/deploy-pages@v4
```

## Step 3: Configure GitHub Pages

In the repo settings → Pages → Source: set to "GitHub Actions".

## Step 4: Add Makefile target for local preview

```makefile
docs-preview:
	cd docs && python3 -m http.server 8080
	@echo "Docs preview at http://localhost:8080"
```

## Result

- Docs live at `https://org.github.io/repo/`
- Every push to `main` that changes `openapi.yaml` triggers a redeploy
- Local preview with `make docs-preview`
- No per-month cost

*References: `guides/01-tool-selection.md`, `guides/03-deployment.md`, `research/external/github-pages-openapi-deployment.md`*
