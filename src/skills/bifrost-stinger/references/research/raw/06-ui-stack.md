# Bifrost UI stack
- URL: https://github.com/maximhq/bifrost (ui/README.md and ui/package.json at tag transports/v1.6.11)
- Fetched: 2026-09-04
- Source type: official repo

## What it is (ui/README.md)

"A modern, production-ready web interface for the Bifrost AI Gateway - providing real-time monitoring, configuration management, and comprehensive observability for your AI infrastructure."
"A React + Vite + TanStack Router web dashboard that serves as the control center for your Bifrost AI Gateway."

Key features: real-time log monitoring (live streaming dashboard with WebSocket integration), provider management (15+ providers), MCP integration, plugin system, analytics dashboard (request metrics, success rates, latency, token usage), dark/light mode, documentation hub.

The UI "is designed to work with the Bifrost HTTP transport backend."

## Stack (ui/package.json at the tag)

- engines: node >=22.12.0
- Build: vite; scripts: `dev`, `build` = `vite build && tsc --noEmit && copy-build` where copy-build does `rm -rf ../transports/bifrost-http/ui && cp -r out ../transports/bifrost-http/ui` (the gateway embeds/serves the built UI from `transports/bifrost-http/ui`)
- Lint/format: oxlint, oxfmt
- Router: `@tanstack/react-router` 1.168.10; tables: `@tanstack/react-table` 8.21.3
- State/data: `@reduxjs/toolkit` 2.8.2 (RTK Query), `axios` 1.16.1
- Components: ~20 `@radix-ui/react-*` packages (accordion, alert-dialog, dialog, dropdown-menu, select, switch, tabs, tooltip, etc.), `class-variance-authority` 0.7.1, `clsx`, `cmdk` 1.1.1 (shadcn-shaped; ui/ has `components.json`)
- Extras: `@monaco-editor/react`, `@xyflow/react` (node graphs), `@dnd-kit/react`, `@phosphor-icons/react`, date-fns, jspdf/html2canvas-pro, canvas-confetti

## Route surfaces (ui/app/workspace/ at this tag)

adaptive-routing, alerting, audit-logs, circuit-breaker, cluster, complexity-router, config, custom-pricing, dashboard, docs, governance, guardrails, layout.tsx, logs, mcp-auth-config, mcp-logs, mcp-registry, mcp-sessions, mcp-settings, mcp-tool-groups, model-catalog, model-limits, oauth-grants, observability, plugins, prompt-repo, providers, rbac, routing-rules, scim, skills-repo, virtual-keys, webhooks.
Top-level app routes: `__root.tsx`, `__error.tsx`, `__notFound.tsx`, `__updating.tsx`, `_fallbacks/`, `agent/`, `login/`, `oauth/`, `pprof/`, `clientLayout.tsx`, `main.tsx`.
Same workspace surface list exists at v2.0.0 (verified by tree comparison 2026-09-04); v2.0.0 adds the same list unchanged at this granularity.
