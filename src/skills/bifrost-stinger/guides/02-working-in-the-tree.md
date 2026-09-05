# Guide: working inside the Bifrost codebase

Verb: "add an endpoint", "change the log schema", "add a provider", "wire the semantic cache", "where does X live".

## Finding the right layer

1. Start at `references/repo-map.md`, then `AGENTS.md` in the tree (contributor context with per-file line counts and responsibilities).
2. Route by question:
   - Shared types, plugin interfaces, provider interface -> `core/schemas/` (all 41 files; nothing else defines cross-boundary types)
   - Request lifecycle, queuing, fallbacks -> `core/bifrost.go`, `core/inference.go`
   - Provider behavior -> `core/providers/<name>/` (read `openai/` first; it is the reference implementation)
   - HTTP endpoints, middleware, auth -> `transports/bifrost-http/handlers/` (map in `references/admin-api-surface.md`)
   - Persistence -> `framework/configstore/`, `framework/logstore/`, `framework/vectorstore/`
   - Governance (VKs, budgets, teams, customers) -> `plugins/governance/` plus `handlers/governance.go`
   - Semantic cache -> `plugins/semanticcache/` plus `framework/vectorstore/` and `handlers/cache.go`
   - Live logs -> `transports/bifrost-http/websocket/` and `handlers/websocket.go`/`ws_ticket.go`
   - Dashboard -> `ui/` (React/TanStack/RTK; see `references/research/raw/06-ui-stack.md`)
3. Exact endpoint shapes: extract from `docs/openapi/` in the tree you are running. Never quote shapes from memory or from the live docs site when a frozen tree exists; the site tracks upstream latest, your deployment runs the pin.

## Change discipline in a frozen fork

- Local changes are commits on the fork with a NOTICE-of-changes entry (Apache 2.0 obligation).
- One concern per commit, upstream-attributable style preserved: when in doubt mirror the surrounding file's idioms; the fork will be merged against upstream tags later.
- Database-touching changes: check the changelog section "Database Migrations" pattern; upstream calls out migrations per release, and your fork must own its own migration path alongside upstream's.
- Tests: `go test ./...` per module; handler changes come with `handlers/*_test.go` in the same package - follow that placement.

## Plugin work

- New middleware logic that must not fork core: write it as a plugin first (`examples/plugins/hello-world` is the doc's reference). Interfaces in `core/schemas/plugin.go`.
- v1.6.11-era plugin phases vs v2.0.0's `HTTPTransportPreAuthHook`: check the tree's `core/schemas/plugin.go` for the phases that exist at your pin before using one.
- Build per [[go-stinger]] `guides/02-cgo-plugin-build.md`.
