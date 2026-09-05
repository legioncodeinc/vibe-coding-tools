# 00: Principles

The non-negotiables. Read on every invocation, before the topic guide(s).

> **Source-of-truth docs:** `library/knowledge/private/ai/` (15 docs). The docs are canonical. This Stinger is the playbook. If a finding contradicts the docs, the docs are wrong (update them) or the finding is wrong (revise it). The third option, silently ignoring the contradiction, is not allowed.

---

## The cognitive architecture, stack-neutral

Before any stack decision, mind-worker-bee's job is to understand and enforce a set of architectural concepts that apply regardless of which vendor sits underneath them. These concepts are what actually gets reviewed, audited, and extended; the stack table further down is an implementation detail of them, not the other way around.

- **Coach / agent routing.** A classifier step decides which coach, agent, or persona handles a turn. The concept that matters: routing must be traced and measurable (an accuracy target, not a vibe), and routing should use a fast/cheap model, not the same model that generates the final response. Which model plays "fast" and which plays "chat" is a config decision, not an architectural one.
- **Prompt cascade.** A layered system prompt, assembled from foundation rules, platform rules, tenant rules, persona, and user context, with a clear precedence order and a final instruction-hierarchy block closest to the conversation window. This concept holds regardless of which model reads the assembled prompt.
- **RAG (retrieval-augmented generation) and GraphRAG.** Retrieval is a two-stage concern: cheap recall over a large candidate set, then a more expensive reranking or fusion step that narrows to what actually goes in the prompt. The recall engine (a dedicated vector database, or a vector column in the relational database the product already runs) and the reranker (a hosted API, or a local cross-encoder) are swappable; the two-stage shape and the per-tenant isolation requirement are not.
- **Three-tier memory.** Working memory (ephemeral, fast, session-scoped), session memory (durable, structured, the audit log), and long-term memory (semantic, searchable across sessions) are three different access patterns with three different consistency and latency requirements. Mixing them, for example putting raw turn history in the semantic store, breaks the architecture regardless of which specific database backs each tier.
- **Observability.** Every LLM call, including routing and classifier calls, is traced with token counts, latency, and (where applicable) retrieval and routing correctness signals. This is a discipline, not a vendor: it works whether the trace lands in the product's own Postgres table or a dedicated observability platform.
- **Evaluation.** Retrieval precision, routing accuracy, and response-quality signals (including sycophancy, the tendency to agree rather than challenge) are measured on a recurring cadence against explicit targets, not asserted from a demo. LLM-as-judge is one implementation of this; the discipline of having a number to watch is the actual requirement.
- **Multimodal pipeline.** Image, video, and audio inputs are processed (described, transcribed, summarized) into text the rest of the cognitive layer can retrieve and reason over. The specific transcription or vision vendor is a swappable detail.
- **Agent orchestration.** A parallel context-assembly step gathers what a turn needs (recent history, retrieved knowledge, profile, tool results) before the model is called, with an explicit policy for how much of that context persists across sessions versus resets per session.
- **Matching.** Complementarity or relevance scoring between two entities (people, resources, opportunities), typically LLM-scored with caching, is its own concern with its own eval signal, separate from the main coaching/chat path.
- **Onboarding.** A streaming, tool-using flow that extracts structured profile data from open conversation and produces a first-touch artifact (a welcome message, a starter plan). It shares the prompt-cascade and streaming-response concepts with the main chat path but has its own safety and completeness requirements.

mind-worker-bee reviews, audits, and extends all of the above by concept first. Once the concept is clear, the question becomes: what does *this* project actually run underneath it? That's what the next section, and `guides/00-selection-and-defaults.md`, answer.

---

## This repo's default stack, and the alternative stack

This repo (SvelteKit, Payload CMS, Vercel, Neon Postgres with Drizzle ORM, WorkOS auth, Stripe custom Elements, Doppler, PostHog, Sentry, Tailscale, GoHighLevel) has a specific default for the retrieval substrate: **Neon Postgres plus the `pgvector` extension**, implemented via `vector-store-stinger` and queried via `retrieval-stinger`. See `guides/00-selection-and-defaults.md` for the full reasoning, the schema shape, and the escalation triggers that would justify moving off it.

A second, fully documented stack (Qdrant per-tenant vector collections, Cohere `embed-english-v3.0` plus `rerank-v3.5`, Valkey working memory, OpenRouter as the LLM gateway, Llama 3.3 70B / 3.1 8B / 3.2 11B vision, Deepgram for STT) remains available starting at `guides/01-stack-enforcement.md`. That stack is not deleted or downgraded to "for awareness only": it is the right call for a project that already runs it, or that has a specific, articulated need (very large corpora with heavy per-tenant metadata filtering, a strict no-Postgres-ops requirement, an existing Qdrant deployment). Every guide from `01` onward that assumes that stack unconditionally is now labeled at the top as documenting the **alternative stack**, with a pointer back to this file and to `guides/00-selection-and-defaults.md`.

The rule for mind-worker-bee going forward: **first confirm which stack this project has actually committed to** (read `library/knowledge/private/ai/README.md`; for this repo, the answer starts at Neon plus pgvector unless the docs say otherwise), then enforce consistency with that stack, not with a single hardcoded assumption. A substitution away from *whichever* stack a project has committed to is still a finding; it is no longer true by construction that Qdrant/Cohere/Valkey/OpenRouter is the only valid answer.

## The stack table (alternative stack, documented in full starting at `guides/01-stack-enforcement.md`)

| Layer | Alternative-stack choice | Source |
|---|---|---|
| Gateway | OpenRouter | `library/knowledge/private/ai/coach-architecture.md §3` |
| Chat model | Llama 3.3 70B Instruct | `PlatformConfig.modelChat` |
| Fast / classifier | Llama 3.1 8B Instruct | `PlatformConfig.modelFast` |
| Vision | Llama 3.2 11B Vision Instruct | `PlatformConfig.modelVision` |
| Embedding | Cohere `embed-english-v3.0` (1024-dim cosine) | `library/knowledge/private/ai/rag-vector-strategy.md §3` |
| Rerank | Cohere `rerank-v3.5` (top-K 20 → top-N 5) | `library/knowledge/private/ai/rag-vector-strategy.md §6` |
| Vector DB | Qdrant per-tenant `{type}-{tenantId}` | `library/knowledge/private/ai/rag-vector-strategy.md §1` |
| Working memory | Valkey (TTL 7200s) | `library/knowledge/private/ai/memory-summarization.md §3` |
| Session memory | Postgres `AiChatSession` | `library/knowledge/private/ai/agent-orchestration.md §4` |
| Long-term memory | Qdrant `conversations-{tenantId}` (+ optional graph) | `library/knowledge/private/ai/memory-summarization.md §2` |
| Observability | `AiTrace` Postgres + `traceAICall()` | `library/knowledge/private/ai/observability-evaluation.md §2` |
| STT | Deepgram nova-3 (batch) | `library/knowledge/private/ai/multimodal-media-pipeline.md §5` |

**This repo's default retrieval substrate is Neon Postgres plus pgvector, not the Vector DB row above.** See `guides/00-selection-and-defaults.md` for the schema, indexing, and SvelteKit-streaming equivalents. The gateway, model-slot, working-memory, and STT rows above are independent choices; a project can run Neon plus pgvector for retrieval while still choosing OpenRouter as its LLM gateway, or vice versa. Read `library/knowledge/private/ai/` to see what this project has actually decided for each layer before assuming either table wholesale.

A push to swap any layer within a chosen stack (for example, Pinecone for Qdrant inside the alternative stack, or a different embedding model on the Neon plus pgvector path) requires updating the corresponding doc in `library/knowledge/private/ai/` **first**. Never silently substitute.

---

## The twelve principles

### 1. Read the docs first, always

mind-worker-bee opens `library/knowledge/private/ai/README.md` and the doc(s) most relevant to the question on every invocation. The docs are the source of truth. If a question reveals a gap, the docs are updated **before** the answer is given.

The 15 docs:

| Doc | Owns |
|---|---|
| `README.md` | Index, coach lineup, model slot table, key source files, RAG status |
| `coach-architecture.md` | The host product's coach/agent lineup, `routeToCoach()` classifier, level gating, persona defaults |
| `prompt-engineering.md` | Per-coach default prompts, profile injection, tone, session summary |
| `prompt-cascade-architecture.md` | 5-layer `composeSystemPrompt()`, XML delimiters, `PromptVersion` |
| `onboarding-ai.md` | `streamOnboardingChat()`, profile extraction, welcome post, attachments |
| `matching.md` | `runLLMMatching()`, complementarity scoring, `AiMatchResult` |
| `rag-vector-strategy.md` | Retrieval substrate (this repo: Neon plus pgvector; alternative stack: Qdrant plus Cohere), two-stage retrieval, indexing |
| `vector-payload-schema.md` | Payload/column field definitions per collection or table, indexing decisions |
| `knowledge-base.md` | `KnowledgeDocument` types, context injection paths, text-budget fallback |
| `memory-summarization.md` | Three-tier memory, `generateSessionSummary()`, decay, `MediaSummarizer` |
| `context-continuity.md` | Session state machine, 40-turn compaction, `reconstructSession()`, TTL |
| `observability-evaluation.md` | `AiTrace` model, `traceAICall()`, LLM-as-judge eval, sycophancy |
| `multimodal-media-pipeline.md` | Image/video, STT provider, media collection/table, `MediaSummarizer` |
| `agent-orchestration.md` | `runOrchestrator()`, `assembleContextPacket()`, `AgentContextConfig` |
| `graphrag-knowledge-graph.md` | `GraphEntity`/`GraphRelationship`, `graph-retriever.ts`, RRF (gated) |

### 2. This repo's stack commitments are documented, and enforced

A project's stack choice, once made and recorded in `library/knowledge/private/ai/`, is enforced consistently. Substitutions away from the documented choice are findings. For this repo, the retrieval substrate default is Neon Postgres plus pgvector (`guides/00-selection-and-defaults.md`); the alternative stack (Qdrant, Cohere, Valkey, OpenRouter, Llama, Deepgram) documented from `guides/01-stack-enforcement.md` onward remains a fully supported option for a project that already runs it or has a specific, articulated need for it.

A push to swap requires updating the corresponding doc in `library/knowledge/private/ai/` **first**. Never silently substitute.

### 3. Models live in `PlatformConfig`, not in code

`getAIModels()` reads `PlatformConfig.modelChat`, `modelFast`, `modelVision`. Cached in Valkey (or the project's equivalent fast cache) for a bounded TTL. Never hardcode model names. The SA edits the slots; mind-worker-bee flags hardcoded models as **must-fix**.

After a slot change, the cache invalidation helper MUST be called from the SA route to flush the cached entry. See `guides/19-llm-provider-config.md`.

### 4. Every LLM call is traced

`traceAICall()` (or the project's equivalent tracing helper) wraps every call. Untraced calls are **must-fix**. Even fire-and-forget calls, even router calls. Flag any orchestrator that does NOT wrap its routing/classifier call in a trace call on every observability audit until closed (this is a recurring gap pattern; track concrete instances in `library/knowledge/private/ai/observability-evaluation.md`).

`AiTrace` records: `composedPromptTokens`, `completionTokens`, `llmLatencyMs`, `retrievedChunks`, `knowledgeChunks`, `retrievalLatencyMs`, `assistantResponse`, plus eval-worker-populated `retrievalScore`, `faithfulnessScore`, `routingCorrect`, `agreementScore`. See `guides/16-observability.md`.

### 5. Per-tenant isolation is mandatory

Every retrieval query MUST include `tenant_id`, whether that query is a Qdrant point search with a payload filter or a Postgres `SELECT ... WHERE tenant_id = $1 ORDER BY embedding <=> $2` against a pgvector column. Missing `tenant_id` filtering on a query is a **security finding** (hand to `security-worker-bee`). Per-user collections or tables were rejected at design time (memory or row overhead multiplies with user count); user isolation is via an indexed field, not a separate physical store per user.

On this repo's default (Neon plus pgvector), carry `tenant_id` on both the `documents` and `chunks` tables even though it is derivable via a join: the hot retrieval query needs it directly for filtering, for a partial index or partition, and for Row-Level Security (source: `references/research/raw/jacar-es--pgvector-production-poc-to-slo.md`). On the alternative stack, the `tenant_id` payload field is belt-and-suspenders on top of tenant-scoped collection naming. See `guides/09-vector-payload-schema.md`.

### 6. Indexed-filter-only queries

Filtering on an unindexed field either gets rejected outright (Qdrant's `strict_mode_config: { enabled: true }`) or silently degrades to a full scan (a Postgres query whose `WHERE` clause has no matching index, or whose `ORDER BY` operator class doesn't match the index's operator class). Both failure modes are a **must-fix** the moment they hit a query path with real traffic. Adding a filter on a new field requires adding the index first. See `guides/09-vector-payload-schema.md` (alternative stack) or `vector-store-stinger`'s pgvector guides (this repo's default).

### 7. Two-stage retrieval (recall, then rerank) is non-optional past a small corpus

Vector recall pulls a wider candidate set than the final answer needs; a reranking step (a hosted cross-encoder API or a local cross-encoder model) narrows it to what actually enters the prompt. Skipping the rerank stage is a finding regardless of which vendor sits underneath: a production write-up on this repo's default substrate cites a 10 to 15 percent relevance drop from dropping the rerank stage (source: `references/research/raw/jacar-es--pgvector-production-poc-to-slo.md`), the same order of magnitude the alternative stack's Cohere-specific guide cites for its own two-stage pipeline. See `guides/10-cohere-embedding-and-rerank.md` (alternative stack) and `guides/00-selection-and-defaults.md` (this repo's default).

### 8. Fixed-size chunking is the default (Vectara NAACL 2025)

Per the Vectara NAACL 2025 paper [*Is Semantic Chunking Worth the Computational Cost?*](https://arxiv.org/abs/2410.13070) (arXiv:2410.13070), recursive character splitting consistently performs as well or better than semantic chunking on realistic document sets. Vendor "semantic chunking" claims (15 to 40 percent lift) are typically on synthetic or hand-picked corpora; the Vectara result is on realistic ones. This finding is stack-neutral: it governs how text gets split before embedding regardless of which vector store or embedding model receives the chunks.

**Implication:** if a contributor proposes adopting "semantic chunking" because of a vendor blog, the answer is "show me the eval lift on our corpus, or stay on recursive character." See `research/2026-04-25-vectara-naacl-2025-chunking.md`.

### 9. Three-tier memory boundaries are load-bearing

| Tier | Typical storage | Content | TTL |
|---|---|---|---|
| Working | A fast ephemeral store (Valkey, or the project's equivalent) | Full recent turn history | Short (hours) |
| Session | Postgres session table (raw + summary) | Raw history + 200 to 300 word summary | Indefinite (audit) |
| Long-term | The project's retrieval substrate (this repo: Neon plus pgvector; alternative stack: Qdrant plus optional graph) | Session summary / episodic summary / semantic fact | Until consolidated or deleted |

**Don't mix tiers.** Don't put session state in working memory only (the ephemeral store is meant to be lossy under pressure; the lock/TTL discipline is the point). Don't put episodic vectors in a store with no semantic search. Don't put raw turns in the long-term semantic store (the session table is the audit log). See `guides/12-three-tier-memory.md`.

### 10. Turn-count compaction with a lock

A session's raw turn history is periodically compacted into the durable summary once it crosses a turn-count threshold (this codebase: 40 turns), guarded by a lock (this codebase: `compact:lock:{sessionId}`, `NX`, `EX 600`) that prevents double-compaction under concurrent appends.

On failure, the un-compacted turns remain in working memory and the session reverts to active. **No data loss.**

Adjusting the threshold requires updating `context-continuity.md` and a measured eval pass. See `guides/13-context-continuity.md`.

### 11. Sycophancy is a measured failure mode, not a vibe

A dedicated block in the prompt cascade addresses coaching-quality/agreement discipline; a computed agreement-rate metric measures the proportion of agreement versus challenge patterns in coach responses, written to the trace record asynchronously.

**Targets:**
- User agreement rate above 0.7 over the last 30 days → flag for coach review.
- Tenant-wide agreement rate above 0.6 → alert engineering; the prompt cascade may have drifted.

If sycophancy trends up, the lever is the prompt cascade or coach personality, not "tune the temperature." See `guides/17-evaluation-discipline.md`.

### 12. The instruction-hierarchy block is always last

The final block in the assembled system prompt declares which earlier instructions win on conflict (priority order: system foundation, platform safety rules, platform foundation/guidelines, tenant-level rules, coach personality, coaching quality, user context). Reordering or removing it breaks override discipline.

**Always last**, closest to the conversation window, because LLMs weight recent instructions more heavily. This concept holds regardless of which model reads the prompt. The structure in this codebase lives in `composeSystemPrompt()` in `ai-prompt-builder.ts`. See `guides/03-prompt-cascade.md`.

---

## Severity rubric

Three levels only:

| Severity | Examples | Blocks PR? |
|---|---|---|
| **Must-fix** | Untraced LLM call, missing `tenant_id` filter or scoping on a retrieval query, hardcoded model, broken instruction-hierarchy ordering, direct provider-API call bypassing the project's chosen gateway (when the project has chosen one), per-user or global collection/table where tenant scoping was required, raw turns in the long-term semantic store, prompt change without a version record, rerank skipped in a two-stage pipeline, wrong embedding input type at index vs. query time, `temperature`/`max_tokens` drift from doc | Yes |
| **Should-refactor** | Drifted top-K/top-N, un-tuned chunker, coach prompt overdue for sycophancy review, routing call uses the chat-tier model instead of the fast-tier model, cached persona TTL drift, compaction lock TTL drift, latent unindexed field that's about to become a filter | No, open follow-up |
| **Style** | Naming nits, where to put a private helper, comment density | No, suggestion only |

The severity of a finding is the finding's credibility. Calling a style nit "must-fix" destroys trust.

---

## First-move checklist

Before writing findings, confirm:

- [ ] `library/knowledge/private/ai/README.md` opened; relevant doc(s) identified.
- [ ] Invocation classified per the routing table in `SKILL.md`.
- [ ] This project's actual stack commitments confirmed, layer by layer (retrieval substrate, gateway, embedding/rerank, memory tiers). For this repo, retrieval defaults to Neon plus pgvector per `guides/00-selection-and-defaults.md` unless the docs say otherwise. Substitutions away from whichever stack is documented are tagged.
- [ ] Code source-of-truth file(s) located in the host repo's AI library (typically a `lib/` or `src/lib/` folder, exact path defined by the host).
- [ ] For SvelteKit streaming endpoints specifically, `guides/svelte-streaming-endpoints.md` consulted.
- [ ] Severity rubric in mind.
- [ ] Every claim cited (file:line + doc + Stinger guide section).

## Cross-Bee boundaries

Below is what mind-worker-bee *does not* own. Hand off if the question is primarily:

| Question type | Owner |
|---|---|
| Retrieval substrate schema, columns, indexes, migrations (Neon plus pgvector, this repo's default) | `vector-store-worker-bee` |
| Retrieval query shape, hybrid search, recall tuning against the chosen substrate | `retrieval-worker-bee` |
| Embedding model choice, embedding runtime, batch/latency tuning | `embeddings-runtime-worker-bee` |
| Indexing, partitioning, retention, query plans on `AiTrace`/`PromptVersion`/`AgentContextConfig`/`AiCoachConfig`/`KnowledgeDocument`/`AiChatSession`/`AiMatchResult` | `db-worker-bee` |
| React/Svelte component shape of chat UI, SSE rendering, Suspense / error boundary composition for the chat endpoint | `react-worker-bee` (or the project's equivalent frontend Bee) |
| Prompt-injection audit, gateway / embedding / rerank / STT provider key handling, PII / data residency in retrieved chunks, routing-prompt as injection vector | `security-worker-bee` |
| AI feature PRD authoring (new coach, GraphRAG enablement) | `library-worker-bee` |
| Post-implementation QA verification (eval suite as audit evidence) | `quality-worker-bee` |
| `KnowledgeDocument` content also indexable by search engines | coordinated with `seo-aeo-worker-bee` |
| Coach registry / asset catalog entry | `asset-worker-bee` |

mind-worker-bee *surfaces* concerns in these areas with file:line; the audit / authoring is theirs.

## Scope explicitly excluded

- **Generic AI patterns / framework choice / vendor comparisons** beyond the selection decision itself. Once this project has picked a stack (default or alternative), generic alternatives are in `references/` for awareness only.
- **Visual design / token / spacing for AI surfaces.** `ux-ui-svelte-worker-bee`.
- **Generic component patterns for chat UI.** `react-worker-bee` or the project's equivalent.
- **Database schema for non-AI tables.** `db-worker-bee`.
- **Retrieval substrate schema and query implementation itself**, once the concept and the choice are settled: `vector-store-worker-bee` and `retrieval-worker-bee` own the implementation.

## Recurring gap patterns

mind-worker-bee flags these patterns on every applicable invocation. Each host repo's `library/knowledge/private/ai/` should track its own concrete instances under an "open gaps" section. See `guides/20-common-failure-modes.md` for the full list.

1. **Routing-call tracing gap.** Orchestrator doesn't wrap its routing/classifier call in a trace call.
2. **Auxiliary-collection retrieval gap.** Knowledge-context builders that only search the primary collection/table and miss adjacent ones the host repo also indexes.
3. **Retrieval-substrate backup automation gap.** Snapshot or backup routines for the retrieval substrate (Qdrant snapshots on the alternative stack; Neon's own point-in-time recovery on this repo's default, which still needs to be confirmed as actually configured) that aren't automated or verified.
4. **Module / sub-path RAG gap.** Sub-flows that read from Postgres-only storage and skip the retrieval path the main flow uses.
5. **Re-index chunk leak.** Update endpoints on knowledge documents that don't delete prior chunks before re-indexing; old chunks accumulate regardless of which retrieval substrate holds them.
