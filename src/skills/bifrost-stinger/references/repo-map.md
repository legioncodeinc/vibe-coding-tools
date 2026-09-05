# Bifrost repo map

Grounded in [raw/01](research/raw/01-repo-layout.md) and [raw/06](research/raw/06-ui-stack.md). Paths are relative to the monorepo root.

| Path | What it is | When you touch it |
|---|---|---|
| `core/` | Engine: request lifecycle, provider interface, all shared schemas, 20+ provider clients | Adding a provider, changing shared types |
| `core/schemas/` | ALL shared Go types (41 files); `plugin.go` holds plugin interfaces | Anything a plugin or transport consumes |
| `core/providers/` | Provider implementations; `openai/` is the reference | Provider behavior, request shaping |
| `framework/configstore/` | Config persistence (file, postgres) | Where VK/provider/governance config lives |
| `framework/logstore/` | Log persistence (file, postgres) | Logs queries, retention |
| `framework/vectorstore/` | Vector stores (Weaviate, Qdrant, Redis, Pinecone) | Semantic cache backend work |
| `transports/bifrost-http/` | The HTTP gateway binary and admin/inference API | Any `/api/*` or `/v1/*` behavior |
| `transports/bifrost-http/handlers/` | Per-area handlers; the de facto API surface map | Admin API changes |
| `transports/bifrost-http/websocket/` | Live log websocket (connection, pool, session) | Real-time logs |
| `transports/go.mod` | Transport module; pins core + plugin versions | Dependency alignment |
| `plugins/` | First-party plugins: governance, semanticcache, logging, telemetry, otel, maxim, prompts, compat, modelcatalogresolver | Plugin behavior |
| `ui/` | React dashboard; builds into `transports/bifrost-http/ui` | Dashboard, and as the porting reference |
| `docs/` | Mintlify docs site, versioned with the tree; `docs/openapi/` holds the API spec | Endpoint shapes; always cite the frozen tag |
| `examples/` | Including `examples/plugins/hello-world` referenced by plugin docs | Plugin starter |
| `config.json` | Root sample config | Runtime configuration |

## In-tree docs worth reading before code changes

`AGENTS.md` (contributor context, repo layout with line counts), `docs/architecture/`, `docs/plugins/writing-go-plugin.mdx`, `docs/features/semantic-caching.mdx`, `docs/features/governance/virtual-keys.mdx`, `transports/changelog.md`.
