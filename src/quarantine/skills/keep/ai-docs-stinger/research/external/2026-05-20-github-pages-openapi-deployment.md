---
source_url: https://dev.to/kengo_hakomori_1116/publishing-oas-based-api-doc-on-github-pages-2gb6
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: deployment
stinger: api-docs-stinger
---

# Publishing OAS-Based API Doc on GitHub Pages — DEV Community

## Summary

Published March 2026. Step-by-step walkthrough for publishing an OpenAPI spec as a static HTML page on GitHub Pages using Docker + Nginx for local preview. Covers the full workflow: local preview with docker-compose, activating GitHub Pages via API, and the complete `index.html` + `nginx.conf` + `docker-compose.yml` setup for a single-spec deployment.

## Key quotations / statistics

- Free plan limitation: "In a free plan account, we cannot publish GitHub Pages from a private repository."
- GitHub Pages activation endpoint: `POST https://api.github.com/repos/$OWNER/$REPO/pages`
- Required `build_type: "legacy"` for branch-based deployment
- Nginx serves both the `index.html` preview page and the raw `openapi.yml` file as static assets

## Directory structure for self-hosted preview

```
.
├── docker
│   ├── .env
│   └── docker-compose.yml
├── index.html        # Swagger UI / Scalar CDN embed
├── nginx.conf
└── openapi
    └── openapi.yml
```

## Docker Compose pattern for local preview

```yaml
services:
  nginx:
    image: nginx:1.28.2
    ports:
      - "${HOST_PORT}:80"
    volumes:
      - ../index.html:/usr/share/nginx/html/index.html:ro
      - ../openapi:/usr/share/nginx/html/openapi:ro
      - ../nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

## GitHub Pages activation via curl

```bash
curl -L -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $PERSONAL_ACCESS_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/$OWNER/$REPO/pages" \
  -d '{"build_type": "legacy", "source": {"branch": "$BRANCH", "path": "/"}}'
```

## Annotations for stinger-forge

- Primary source for the Docker + Nginx local preview pattern in `guides/03-deployment.md` and `examples/redoc-self-hosted-docker.md`.
- The directory structure is the canonical shape to use in the template.
- Note the free-tier constraint (public repos only) in `guides/03-deployment.md` under the GitHub Pages section.
- The `nginx:1.28.2` pinned version is a useful reference for the Dockerfile template.
- Multi-spec sites work with the same pattern (article notes this explicitly).
- Compare with the GitHub Actions workflow approach (deploy on push) — this article covers the curl activation path, not the Actions path; both belong in the deployment guide.
