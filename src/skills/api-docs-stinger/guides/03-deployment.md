# 03: Deployment

Hosting patterns for API documentation. Read `research/external/github-pages-openapi-deployment.md` before running this guide.

## GitHub Pages (recommended for OSS and small teams)

GitHub Pages hosts the rendered docs for free. Use Scalar or Redoc as the renderer.

### Step 1: Add the workflow file

Use the template at `templates/github-pages-workflow.yml`. Key points:

- Trigger on push to main AND on changes to the OpenAPI spec file.
- Generate static HTML (Redoc) or upload the spec + minimal HTML page (Scalar CDN).
- Deploy to the `gh-pages` branch.

### Step 2: Scalar via GitHub Pages (CDN approach)

```html
<!-- docs/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>API Reference</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      data-url="./openapi.yaml">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>
```

Commit `docs/index.html` and `docs/openapi.yaml`. Point GitHub Pages at the `docs/` folder.

### Step 3: Redoc via GitHub Pages (static bundle)

```bash
npx @redocly/cli build-docs openapi.yaml --output docs/index.html
```

Add this to the GitHub Actions workflow: generates a self-contained `index.html` with all assets inlined.

## Netlify / Vercel (recommended for teams with CI)

Both platforms auto-deploy on git push. Preferred when you already use them for other projects.

**netlify.toml:**
```toml
[build]
  command = "npx @redocly/cli build-docs openapi.yaml --output public/index.html"
  publish = "public"
```

**vercel.json (Scalar):**
```json
{
  "builds": [{ "src": "docs/**", "use": "@vercel/static" }],
  "routes": [{ "src": "/(.*)", "dest": "/docs/$1" }]
}
```

## Self-hosted Docker (recommended for internal APIs behind a firewall)

Use the template at `examples/redoc-self-hosted-docker.md`. The multi-stage Dockerfile:

1. Stage 1: bake the OpenAPI spec into a static HTML file.
2. Stage 2: serve from `nginx:alpine`.

```dockerfile
# Stage 1: generate static docs
FROM node:20-alpine AS builder
WORKDIR /app
COPY openapi.yaml .
RUN npx @redocly/cli build-docs openapi.yaml --output index.html

# Stage 2: serve
FROM nginx:alpine
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
EXPOSE 80
```

## Bump.sh (changelog-first hosting)

Bump.sh is a managed platform focused on API changelog and diff. It works alongside your primary renderer.

```yaml
# .github/workflows/bump.yml
name: Deploy API diff
on:
  push:
    paths: ['openapi.yaml']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: bump-sh/github-action@v1
        with:
          doc: YOUR_DOC_ID
          token: ${{ secrets.BUMP_TOKEN }}
          file: openapi.yaml
```

Every push generates a diff view at `bump.sh/YOUR_DOC_ID/changes`.

## Choosing a hosting target

| Target | Best for | Cost | Setup time |
|---|---|---|---|
| GitHub Pages | OSS projects; free | Free | 15 min |
| Netlify | Teams with existing Netlify usage | Free tier | 10 min |
| Vercel | Teams with existing Vercel usage | Free tier | 10 min |
| Self-hosted Docker | Internal APIs; VPN-gated | Infrastructure cost | 30 min |
| Mintlify | Teams that want zero-ops | $150+/mo | 20 min |
| Bump.sh | Changelog + CI diff gate | Free tier / $149+/mo | 20 min |

*Source: `research/external/github-pages-openapi-deployment.md`, `research/external/bump-sh-changelog-breaking-changes.md`*
