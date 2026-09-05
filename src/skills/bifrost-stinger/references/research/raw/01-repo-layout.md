# Bifrost repo layout (maximhq/bifrost at tag transports/v1.6.11)
- URL: https://github.com/maximhq/bifrost (tree at tag transports/v1.6.11, checked out 2026-09-04)
- Fetched: 2026-09-04
- Source type: official repo (in-tree AGENTS.md and directory listing)

## What it is (from AGENTS.md)

"Bifrost is a high-performance AI gateway that unifies 20+ LLM providers behind a single OpenAI-compatible API with ~11us overhead at 5,000 RPS. It also serves as an MCP (Model Context Protocol) gateway, turning static chat models into tool-calling agents."

## Root tree (tag transports/v1.6.11)

```
cli/  cmd/  community/  config.json  core/  docs/  examples/  framework/
helm-charts/  nix/  npx/  plugins/  pulse.yaml  recipes/  scripts/
tests/  transports/  ui/
```

## core/ (the engine, per AGENTS.md)

- `core/bifrost.go` - main struct, request queuing, provider lifecycle (~3.4K lines)
- `core/inference.go` - inference routing, fallbacks, streaming dispatch (~1.9K lines)
- `core/mcp.go` - MCP integration entry point
- `core/schemas/` - ALL shared Go types (41 files): `bifrost.go` (BifrostConfig, ModelProvider enum, context keys), `provider.go` (Provider interface, 30+ methods), `plugin.go` (LLMPlugin, MCPPlugin, HTTPTransportPlugin, ObservabilityPlugin), `context.go` (BifrostContext), plus chatcompletions/responses/embedding/images/batch/files/mcp/trace/logger
- `core/providers/` - 20+ provider implementations; `openai/` is the reference; `anthropic/` non-OpenAI-compatible example; `bedrock/` AWS event-stream; `gemini/` Google shape; `groq/` delegates to openai; `utils/` HTTP client, SSE parsing, error handling, scanner pool
- `core/pool/` - generic Pool[T], prod sync.Pool wrapper vs `-tags pooldebug` tracking build
- `core/mcp/` - agent loop, client manager, tool manager, health monitor, starlark code-mode sandbox
- `core/internal/llmtests/`, `core/internal/mcptests/` - integration test infra

## transports/ (HTTP transport)

`transports/bifrost-http/` contains: `main.go`, `handlers/`, `server/`, `lib/`, `integrations/`, `profiling/`, `websocket/`, `tests/`.
`transports/go.mod` at this tag: `module github.com/maximhq/bifrost/transports`, `go 1.26.5`, requires `core v1.7.10`, `framework v1.5.10`, plugins: compat v0.1.36, governance v1.6.14, logging v1.6.10, maxim v1.6.37, modelcatalogresolver v1.0.18, otel v1.4.9, prompts v1.0.37, semanticcache v1.5.37, telemetry v1.5.37.
UI build output is copied to `transports/bifrost-http/ui` by the UI build script (`copy-build`) and served by `handlers/ui.go`.

## handler map (transports/bifrost-http/handlers/, the de facto API surface)

Inference + health: inference.go, health.go, list_models_vk.go, asyncinference.go, websocket.go, wsresponses.go, wsrealtime.go, webrtc_realtime.go, realtime_*.go, temptokens.go, ws_ticket.go, ssestreaming_test.go
Admin/config: config.go, governance.go, providers.go, provider_keys.go, cache.go, logging.go, plugins.go, prompts.go, skills.go, mcp.go + mcpoauth2* + mcpsessions.go + mcpserver.go, featureflags.go, webhooks.go, session.go, integrations.go, pricing_override_test.go
UI serving: ui.go; middlewares.go for auth/middleware chain.

## framework/ (persistence + streaming, per AGENTS.md)

- `framework/configstore/` - config storage backends (file, postgres)
- `framework/logstore/` - log storage backends (file, postgres)
- `framework/vectorstore/` - vector storage (Weaviate, Qdrant, Redis, Pinecone)
- `framework/streaming/` - accumulator (~24KB), delta copying, response marshaling

## plugins/ (first-party plugins, from transports go.mod)

compat, governance, logging, maxim, modelcatalogresolver, otel, prompts, semanticcache, telemetry.
