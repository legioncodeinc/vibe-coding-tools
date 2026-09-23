# 01: Tool Selection

Choosing the right API documentation renderer. Read `research/external/scalar-vs-swagger-redoc-comparison.md` and `research/external/managed-platform-comparison-mintlify-readme-stoplight.md` before running this guide.

## The comparison matrix

| Renderer | Hosting model | Customization | Interactive console | SDK gen built-in | Price | Best for |
|---|---|---|---|---|---|---|
| **Scalar** | Self-hosted or Scalar Cloud | Excellent (React, CSS vars) | Yes (built-in Try-it-out) | No | Free (OSS); Cloud paid | New projects 2026; rich theming; React integration |
| **Redoc** | Self-hosted or Redocly | Good (CSS, config) | No (Redocly Pro only) | No | Free (OSS); Pro $125+/mo | Enterprise; stable three-panel layout; Redocly platform users |
| **Swagger UI** | Self-hosted | Limited (CSS overrides) | Yes (built-in) | No | Free (OSS) | Legacy compatibility; widest ecosystem |
| **Mintlify** | Managed only | Excellent (MDX, themes) | Via external link | No | $150/mo (Hobby) | Teams that want managed + narrative + reference combined |
| **Stoplight** | Managed | Good (design-first) | Yes (mock server) | No | Contact sales | Design-first teams; mock-driven development |
| **Bump.sh** | Managed | Limited | No | No | Free (1 doc); $149+/mo | API changelog as primary value; CI diff gate |

## Decision tree

Answer these questions in order. Stop at the first matching branch.

### Q1: Is changelog diffing and CI-gated breaking-change detection your primary need?

→ **Yes:** Use **Bump.sh** alongside any renderer. Bump.sh is a changelog tool first; pair it with Scalar or Redoc for rendering.
→ **No:** Continue.

### Q2: Do you need a managed platform (no self-hosting, marketing site included, narrative + reference unified)?

→ **Yes:** Use **Mintlify** if budget allows ($150/mo). For design-first teams with mock server needs, use **Stoplight**.
→ **No:** Continue.

### Q3: Are you starting a new project in 2026 or choosing a self-hosted renderer?

→ **Yes:** Default to **Scalar**. It has the best interactive console, React component integration, and theming flexibility. It is the 2026 community consensus for new projects. See `research/external/scalar-vs-swagger-redoc-comparison.md`.
→ **No (migrating an existing Redoc setup):** Stay on **Redoc** unless the migration cost is justified. Redoc is production-proven and has no rough edges for existing deployments.

### Q4: Do you have a legacy Swagger UI deployment you don't want to migrate?

→ **Yes:** Keep **Swagger UI**. Do not migrate for migration's sake. Invest the effort in spec quality and example coverage instead.
→ **No:** Use **Scalar**.

## Configuration starting points

### Scalar

```html
<!-- CDN embed (fastest to prototype) -->
<script id="api-reference" data-url="/openapi.json"></script>
<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
```

Full config file: see `templates/scalar-config.ts`.

### Redoc

```yaml
# redoc-config.yaml (minimal)
openapi: /openapi.yaml
title: My API Reference
theme:
  colors:
    primary:
      main: "#0066cc"
```

Full config file: see `templates/redoc-config.yaml`.

### Swagger UI (Docker)

```yaml
# docker-compose.yaml snippet
swagger-ui:
  image: swaggerapi/swagger-ui
  environment:
    SWAGGER_JSON_URL: /openapi.yaml
  volumes:
    - ./openapi.yaml:/openapi.yaml
```

## Migration cost estimate

| Migration path | Effort | Risk |
|---|---|---|
| Swagger UI → Scalar | Low (drop-in CDN) | Low |
| Swagger UI → Redoc | Low (config file) | Low |
| Redoc → Scalar | Low (config rewrite) | Low |
| Any self-hosted → Mintlify | Medium (content migration, MDX) | Medium |
| Mintlify → self-hosted | High (export, rebuild) | High |

*Source: `research/external/scalar-vs-swagger-redoc-comparison.md`, `research/external/managed-platform-comparison-mintlify-readme-stoplight.md`*
