# Distilled: Bifrost architecture, API surface, plugins, versioning
- Research window: 2026-09-04 (frozen-tree sweep at tag transports/v1.6.11 + live docs)
- Raw archive: `references/research/raw/01` through `07`
- Every claim cites its raw file by number.

## 1. What Bifrost is

High-performance AI gateway unifying 20+ LLM providers behind a single OpenAI-compatible API; ~11us overhead at 5,000 RPS; also an MCP gateway/client/server [raw/01][raw/05].

## 2. Architecture

- Monorepo: `core/` (engine + all shared schemas + providers), `framework/` (configstore/logstore/vectorstore/streaming), `transports/` (HTTP gateway binary `bifrost-http`; also a Go SDK transport), `plugins/` (first-party), `ui/` (React dashboard), `docs/` (Mintlify site), `cli/`, `npx/` [raw/01].
- Flow: request -> plugin/middleware layer -> governance/routing -> provider with failover and load balancing [raw/05].
- Vector store abstraction supports Weaviate, Qdrant, Redis, Pinecone; config/log stores support file and postgres [raw/01].

## 3. Governance

- Virtual keys are the primary governance entity; auth via `x-bf-vk`, `Authorization: Bearer sk-bf-*`, `x-api-key`, `x-goog-api-key`, or `api-key` headers; budgets/rate limits at VK, team, customer levels [raw/04][raw/05].
- OSS has NO tenant isolation: admin API is god-mode; RBAC/SCIM/clustering/guardrails are Enterprise [raw/04][raw/05]. Any multi-tenant product must supply identity and scoping itself.

## 4. Admin API surface

The handler files in `transports/bifrost-http/handlers/` are the de facto surface: config, governance, providers, provider_keys, cache, logging, plugins, prompts, skills, mcp (+oauth2/sessions/server), featureflags, webhooks, session (auth), health, integrations, inference, websocket [raw/01]. The OpenAPI spec ships in-tree under `docs/openapi/`. v2.0.0 moves routing endpoints to `/api/routing/*` (deprecating `/api/governance/*` aliases) and adds `/api/notifications` [raw/07].

## 5. UI

React + Vite + TanStack Router 1.168 + TanStack Table + Redux Toolkit/RTK Query + axios + Radix (shadcn-shaped, has components.json); node >=22.12; built output is copied into `transports/bifrost-http/ui` and served by `handlers/ui.go` [raw/06]. Live log monitoring uses WebSockets [raw/06]. Workspace surfaces include logs, virtual-keys, providers, governance, plugins, config, dashboard, observability, MCP family, plus Enterprise-looking folders (cluster, rbac, scim, guardrails, audit-logs) that ship in the OSS tree [raw/06].

## 6. Plugins

Go plugins are `main` packages built as .so with a matching Go toolchain version, Linux/macOS only; WASM is the portable alternative [raw/02]. Plugin interfaces (LLMPlugin, MCPPlugin, HTTPTransportPlugin, ObservabilityPlugin) live in `core/schemas/plugin.go` [raw/01]. v2.0.0 adds an `HTTPTransportPreAuthHook` phase [raw/07]. The .so ABI constraints in [[go-stinger]] apply verbatim.

## 7. Semantic cache

Two paths: direct (normalized hash, no embeddings) and semantic (embedding similarity); can run together or direct-only; streaming replay supported; same plugin `semantic_cache`; UI label is "Local Cache" [raw/03].

## 8. Versioning and the freeze

Namespaced tags (`core/vX.Y.Z`, `transports/vX.Y.Z`); image tags track transports tags; module version numbers are independent between core and transports [raw/07]. Reference points verified 2026-09-04: transports/v1.6.11 (v1 line tip, go 1.26.5, core v1.7.10) and transports/v2.0.0 (first stable 2.0, go 1.27.0, explicit breaking changes with a migration guide) [raw/07].

## 9. Known gaps in this archive

- Per-endpoint request/response shapes: not archived here (extract from `docs/openapi/` in the frozen tree per project).
- Middleware/auth chain internals (`middlewares.go`, `session.go`): not archived; read the frozen tree before asserting.
- Config schema details beyond `config.schema.json` existence: read the frozen tree.
- Enterprise feature internals: deliberately not archived.
