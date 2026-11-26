# Data and AI Tools

Design data, retrieval, AI runtime, model tooling and agent operations.

Storage, retrieval and AI orchestration form one technical journey. IDE/session tools remain opt-in; TARS retains its Claude-desktop-only prerequisite.

Requires `wasp-nest-core`.

<!-- wasp-pack-guide:start -->
## Choose a capability

This pack contains 12 skills, 12 agents and 3 source commands. The table explains each source skill; open its linked instructions for exact inputs, outputs and limits.

| Skill | What it does and when to use it |
| --- | --- |
| [ai-coding-tools-stinger](skills/ai-coding-tools-stinger/SKILL.md) | Choose, configure or troubleshoot AI coding tools, and write bounded task briefs. Use for tool comparison, prompt context, task scope, acceptance, ownership and verification. |
| [ai-tools-platform-stinger](skills/ai-tools-platform-stinger/SKILL.md) | Choose AI providers, gateways and local models. Use for AI stack setup, retry and spend budgets, feature margin or local hardware fit. |
| [bifrost-stinger](skills/bifrost-stinger/SKILL.md) | Bifrost AI gateway specialist: maximhq/bifrost architecture, admin and inference API surface, virtual keys, semantic cache, .so plugins, tags, fork freeze and upgrade policy. Use for any Bifrost work. |
| [cursor-ide-stinger](skills/cursor-ide-stinger/SKILL.md) | Configure Cursor agents, rules, hooks, MCP, and SDK automation. Use for Cursor integration or IDE productivity issues. |
| [db-stinger](skills/db-stinger/SKILL.md) | Design PostgreSQL data layers. Use for schema, indexes, migrations, query performance, ORM choice, or serverless databases. |
| [deeplake-dataset-stinger](skills/deeplake-dataset-stinger/SKILL.md) | Design and maintain Wasp Nestmind Deep Lake datasets. Use for ColumnDef schemas, healing, versioned writes, or hybrid indexing. |
| [embeddings-runtime-stinger](skills/embeddings-runtime-stinger/SKILL.md) | Picks and runs embedding models: hosted (OpenAI, Cohere, Voyage) vs self-hosted, cost tradeoffs, batching, caching. Use when choosing, swapping, or debugging an embedding model. |
| [mind-stinger](skills/mind-stinger/SKILL.md) | Reviews, audits, and extends the AI cognitive layer: coach routing, prompt cascade, RAG, three-tier memory, observability, evaluation. Use when reviewing AI code or tuning retrieval. |
| [neon-drizzle-stinger](skills/neon-drizzle-stinger/SKILL.md) | Neon Postgres and Drizzle ORM on SvelteKit/Vercel: connections, schema, migrations, branching, query patterns, pgvector, RLS, and migrating off Supabase. Use for any Neon or Drizzle task. |
| [retrieval-stinger](skills/retrieval-stinger/SKILL.md) | Designs and audits retrieval: full-text search, pgvector recall, hybrid RRF fusion, reranking, chunking, recall quality eval. Use when tuning recall or a search query misses. |
| [tars-stinger](skills/tars-stinger/SKILL.md) | Manage Claude Code Desktop sessions. TARS spawns chips through /smoke-it or pest-controller, CASE advises and watches systems, KIPP writes PRDs. |
| [vector-store-stinger](skills/vector-store-stinger/SKILL.md) | Design vector storage. Use for pgvector schemas, HNSW/IVFFlat, hybrid indexes, migrations, or storage choice. |

## Start one task

Required packs: `wasp-nest-core`

Install the selected pack and its prerequisites through the marketplace. For the version 3 layout, purge the previous installation first. Select the skill shown by your client, or paste this request with real paths and scope:

After adding the Wasp Nest marketplace, Claude Code uses these installation instructions:

```text
/plugin install wasp-nest-core@wasp-nest
/plugin install data-and-ai-tools@wasp-nest
```

Other clients use their plugin selection UI or discovered skill selector. Installing a package and invoking a task are separate steps.

```text
Use retrieval-stinger to investigate [search path] with [sample queries and expected results]. Identify misses and propose measurable changes.
```

Expected result: A data or AI review tied to the supplied code and evidence. TARS requires Claude Code desktop and its session surface.



Claude Code plugin command names:

| Command | What it does |
| --- | --- |
| `/data-and-ai-tools:build-rag-feature` ([procedure](commands/build-rag-feature.md)) | Build a bounded RAG feature against an accepted corpus, access contract, and measured retrieval and answer evaluation. |
| `/data-and-ai-tools:design-data` ([procedure](commands/design-data.md)) | Design a source-grounded data model, access boundaries, indexes and a migration proposal without executing database changes. |
| `/data-and-ai-tools:tars` ([procedure](commands/tars.md)) | Make this Claude Code desktop session TARS, the manager. Spawns chips for what you ask, each run through /smoke-it or the pest-controller command, manages every session to done, fields their questions, uses CASE as adviser and read-only systems and CI watcher, and KIPP as the idea factory and PRD writer, runs a real 10-minute tick and a 1-minute CI watch. |

## Agent responsibilities

| Agent | Responsibility | Paired skill |
| --- | --- | --- |
| [ai-coding-tools-wasp-drone](agents/ai-coding-tools-wasp-drone.md) | The vibe-coder's AI coding tool advisor and bounded coding task brief writer, recommends, compares, and configures Cursor, Claude Code, Aider, Cline, Windsurf (Cascade), Continue.dev, Replit Agent, Devin 2.0, and Bolt across four autonomy tiers. | [ai-coding-tools-stinger](skills/ai-coding-tools-stinger/SKILL.md) |
| [ai-tools-platform-wasp-drone](agents/ai-tools-platform-wasp-drone.md) | The vibe coder's AI toolbox specialist: AI gateways (Portkey, OpenRouter), cloud providers (AWS Bedrock, Vertex AI, Azure OpenAI), frontier model selection (Claude, GPT, Gemini), cheap-fallback routes (Haiku, Mini, Flash), local LLMs (Ollama, LM Studio), GPU cloud (Runpod, Modal, Together, Fireworks, Groq), and must-have MCP servers and IDE plugins. | [ai-tools-platform-stinger](skills/ai-tools-platform-stinger/SKILL.md) |
| [bifrost-wasp-drone](agents/bifrost-wasp-drone.md) | Bifrost gateway implementation drone for maximhq/bifrost trees - freeze and upgrade execution, admin API changes, plugin wiring, semantic cache config, contract extraction from docs/openapi. | [bifrost-stinger](skills/bifrost-stinger/SKILL.md) |
| [cursor-ide-wasp-drone](agents/cursor-ide-wasp-drone.md) | Cursor IDE platform specialist: project rules (.cursorrules migration, .cursor/rules/*.mdc authoring), MCP server registration and tool authoring, @cursor/sdk API for programmatic agent automation, custom modes, Agents Window and Cloud Agents, and Cursor productivity patterns. | [cursor-ide-stinger](skills/cursor-ide-stinger/SKILL.md) |
| [db-wasp-drone](agents/db-wasp-drone.md) | PostgreSQL data architecture specialist: schema design, indexing strategy, zero-downtime migrations, ORM choice (Drizzle / Prisma / raw SQL), and serverless DB platform selection (Supabase / Neon / Turso / PlanetScale / CockroachDB / Tiger Data). | [db-stinger](skills/db-stinger/SKILL.md) |
| [deeplake-dataset-wasp-drone](agents/deeplake-dataset-wasp-drone.md) | Deep Lake data architecture specialist for Hivemind - the 7-table ColumnDef schema, `USING deeplake` DDL, FLOAT4[768] embeddings, additive schema healing, append-only version-bump writes, indexing (deeplake_index BM25 / `<#>` vector / hybrid), DeeplakeApi querying, SQL guards, dataset versioning, and BYOC storage selection. | [deeplake-dataset-stinger](skills/deeplake-dataset-stinger/SKILL.md) |
| [embeddings-runtime-wasp-drone](agents/embeddings-runtime-wasp-drone.md) | The embedding model selection and runtime specialist. | [embeddings-runtime-stinger](skills/embeddings-runtime-stinger/SKILL.md) |
| [mind-wasp-drone](agents/mind-wasp-drone.md) | Cognitive-layer specialist for the deploying product, covering coach/agent routing, prompt cascade, RAG/GraphRAG, three-tier memory, observability, evaluation, multimodal pipeline, orchestration, matching, and onboarding as stack-neutral architecture, plus SvelteKit +server.ts streaming LLM responses on Vercel. | [mind-stinger](skills/mind-stinger/SKILL.md) |
| [neon-drizzle-wasp-drone](agents/neon-drizzle-wasp-drone.md) | Neon Postgres + Drizzle ORM specialist for the SvelteKit/Vercel stack migrating off Supabase. | [neon-drizzle-stinger](skills/neon-drizzle-stinger/SKILL.md) |
| [retrieval-wasp-drone](agents/retrieval-wasp-drone.md) | Retrieval specialist for an app - owns Postgres full-text search (tsvector, websearch_to_tsquery, ts_rank), pgvector semantic recall, Reciprocal Rank Fusion hybrid search, optional cross-encoder reranking, chunking strategy, and recall/precision evaluation with golden query sets. | [retrieval-stinger](skills/retrieval-stinger/SKILL.md) |
| [tars-wasp-drone](agents/tars-wasp-drone.md) | TARS, the session manager for the Claude Code desktop app: turns the owner's asks into chips, manages every session to merged and deployed, fields their questions, makes manager-level decisions, launches every chip through /smoke-it or the pest-controller command, uses CASE as adviser and read-only systems and CI watcher, and KIPP as the idea factory and PRD writer, runs a real 10-minute tick and a 1-minute CI poller with a watchdog. | [tars-stinger](skills/tars-stinger/SKILL.md) |
| [vector-store-wasp-drone](agents/vector-store-wasp-drone.md) | Vector and embedding storage specialist - schema and column design, index selection (HNSW vs IVFFlat, distance operators), hybrid lexical+vector search at the storage layer, migrations, and dataset versioning. | [vector-store-stinger](skills/vector-store-stinger/SKILL.md) |

Codex can use the named skill or its generated `source-command-<name>` wrapper where a source command exists. Home installations may expose flat commands. Use the actual selector offered by the host. A pack with no paired agents runs its standalone skills directly; a skill name does not prove that a native agent was launched.

## Prerequisites and boundaries

- `implement provider/backend adapters` also needs `backend-and-desktop-tools`.
- `feature-margin-economics` also needs `software-economics-tools`.

The `/tars` manager team (TARS, CASE and KIPP) requires Claude Code Desktop. It has no Codex, Cursor or Cowork fallback; those clients cannot start the manager team by loading its files.

Core supplies shared routing and review methods. Native Codex role registration requires the explicit installed-plugin registry and trusted Core hook; a marketplace selection alone is not proof of registration. Read the linked skill before work. Missing source, browser, connector, renderer or account access is a reported gap. Installation does not authorize sending, publishing, paid work or live settings changes.
<!-- wasp-pack-guide:end -->
