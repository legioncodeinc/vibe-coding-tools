# The Bifrost dashboard (concrete source codebase being ported)
- URL: https://github.com/maximhq/bifrost (ui/ at tag transports/v1.6.11)
- Fetched: 2026-09-04
- Source type: official repo

## Stack facts (ui/package.json)

- node >=22.12.0; Vite build; typecheck `tsc --noEmit`; output copied to `../transports/bifrost-http/ui` (copy-build script)
- `@tanstack/react-router` 1.168.10, `@tanstack/react-table` 8.21.3
- `@reduxjs/toolkit` 2.8.2 (RTK Query for data fetching/caching), `axios` 1.16.1
- ~20 `@radix-ui/react-*` primitives, `class-variance-authority`, `clsx`, `cmdk` (shadcn-shaped; `components.json` present)
- `@monaco-editor/react` (editors), `@xyflow/react` (node graphs), `@dnd-kit/react` (drag), `@phosphor-icons/react`, `date-fns`, `jspdf`/`html2canvas-pro`, `canvas-confetti`, `@bprogress/core` (progress bars), `@number-flow/react` (animated numbers)
- Lint/format: oxlint, oxfmt

## Route surfaces (ui/app/workspace/)

adaptive-routing, alerting, audit-logs, circuit-breaker, cluster, complexity-router, config, custom-pricing, dashboard, docs, governance, guardrails, logs, mcp-auth-config, mcp-logs, mcp-registry, mcp-sessions, mcp-settings, mcp-tool-groups, model-catalog, model-limits, oauth-grants, observability, plugins, prompt-repo, providers, rbac, routing-rules, scim, skills-repo, virtual-keys, webhooks. Top-level: `__root.tsx`, `__error.tsx`, `__notFound.tsx`, `login/`, `oauth/`, `agent/`, `pprof/`, `_fallbacks/`.

## Data flow implications for a port

- RTK Query services define the API contract usage per surface; each workspace folder's data needs are visible in its RTK Query endpoint definitions - extract them per surface when porting.
- Live logs ride a WebSocket to the gateway; a port must decide polling vs WS proxying per deployment.
- Radix composition + cva variants map to shadcn-svelte's Bits UI-based copy-in components nearly 1:1 by component name (see raw/02).
