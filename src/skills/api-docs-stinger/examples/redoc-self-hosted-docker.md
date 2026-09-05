# Example: Redoc Self-Hosted Docker

Multi-stage Dockerfile for serving Redoc-rendered API docs from a container. For internal APIs behind a firewall.

**Demonstrates:** `guides/01-tool-selection.md` (Redoc choice), `guides/03-deployment.md` (self-hosted Docker)

---

## Scenario

An internal API needs docs accessible only on the company VPN. The team already runs Docker for other services.

## Dockerfile

```dockerfile
# Stage 1: Build static HTML from spec
FROM node:20-alpine AS builder
WORKDIR /app
COPY openapi.yaml .
RUN npx --yes @redocly/cli build-docs openapi.yaml \
    --output index.html \
    --title "Internal API Reference"

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
```

## nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

## docker-compose.yaml

```yaml
services:
  api-docs:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api-docs.rule=Host(`docs.internal.company.com`)"
```

## Makefile targets

```makefile
.PHONY: docs docs-build docs-run docs-stop

docs-build:
	docker build -t api-docs .

docs-run:
	docker run -d -p 8080:80 --name api-docs api-docs

docs-stop:
	docker stop api-docs && docker rm api-docs

docs: docs-build docs-run
	@echo "Docs running at http://localhost:8080"
```

## CI: rebuild on spec change

```yaml
# .github/workflows/build-docs-image.yml
on:
  push:
    paths: ['openapi.yaml']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t ghcr.io/${{ github.repository }}/api-docs:latest .
      - run: docker push ghcr.io/${{ github.repository }}/api-docs:latest
```

*References: `guides/01-tool-selection.md`, `guides/03-deployment.md`*
