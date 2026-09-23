# Bifrost API surface notes

Grounded in [raw/01](research/raw/01-repo-layout.md), [raw/04](research/raw/04-virtual-keys-governance.md), [raw/07](research/raw/07-tags-and-changelog.md). Definitive shapes come from `docs/openapi/` in your frozen tree - always extract from the tag you run, not from this file.

## Two API planes

| Plane | Prefix | Auth | Consumers |
|---|---|---|---|
| Inference | `/v1/*`, plus provider-native prefixes | Virtual key headers (`x-bf-vk`, `Authorization: Bearer sk-bf-*`, `x-api-key`, `x-goog-api-key`, `api-key`) | Applications |
| Admin/config + logs | `/api/*` (handlers map below) | Admin credential (Basic auth in self-hosted OSS) | The dashboard, operator tooling |

OSS admin auth is all-or-nothing: anyone with the admin credential sees every provider key, VK, log, and config. There is no per-org or per-user scoping in OSS [raw/04].

## Handler-to-area map (transports/bifrost-http/handlers/ at v1.6.11)

- Governance: `governance.go` (VKs, budgets, teams, customers, routing), `list_models_vk.go`
- Providers: `providers.go`, `provider_keys.go`
- Config/system: `config.go`, `featureflags.go`, `plugins.go`, `session.go` (auth), `health.go`, `webhooks.go`, `integrations.go`
- Cache: `cache.go` (semantic cache / Local Cache)
- Logs: `logging.go` plus `websocket/` + `websocket.go`/`ws_ticket.go` for live streaming
- MCP family: `mcp.go`, `mcpoauth2*.go`, `mcpsessions.go`, `mcpserver.go`, `mcpheaders.go`, `mcpinference.go`
- Prompts/skills: `prompts.go`, `skills.go`, `skills_serving.go`
- Inference: `inference.go`, `asyncinference.go`, `wsresponses.go`, `wsrealtime.go`, `webrtc_realtime.go`, `realtime_*.go`, `temptokens.go`, `ws_ticket.go`
- UI serving: `ui.go`

## Version deltas to watch

- v2.0.0: routing endpoints moved to `/api/routing/rules` and `/api/routing/complexity-analyzer-config` (`/api/governance/*` aliases deprecated); `GET/POST /api/notifications` added; `HTTPTransportPreAuthHook` plugin phase added [raw/07]. Any UI or proxy written against v1 endpoints must be diffed against the frozen tree's `docs/openapi/` before upgrading.

## Multi-tenancy implication

Enforcing tenancy means one of: (a) proxy in front of `/api/*` that authenticates (WorkOS session) and filters requests/responses per org, or (b) in-tree Go changes that add org scope to the admin handlers. Option (a) works without touching the frozen backend; option (b) is the destination once the fork is owned.
