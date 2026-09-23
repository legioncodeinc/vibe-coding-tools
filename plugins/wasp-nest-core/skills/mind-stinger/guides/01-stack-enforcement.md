# 01: Stack Enforcement

> **Alternative stack.** This guide documents the Qdrant plus Cohere plus Valkey plus OpenRouter stack in full. It is not this repo's default; for this repo's default retrieval substrate (Neon Postgres plus pgvector) see `guides/00-selection-and-defaults.md`. This guide remains the canonical implementation reference for a project that already runs this stack, or that has a specific, articulated need for it (see the escalation triggers in `guides/00-selection-and-defaults.md`). Everything below this point describes that stack as if it were the only option; read it with that context.

The cognitive layer of a project running this stack runs on an opinionated set of choices. Substitutions away from *this stack, once a project has committed to it,* are findings. This guide is the canonical statement of what's in the stack, what each piece does, and the substitution policy.

> **Doc reference:** `library/knowledge/private/ai/README.md` (model slot table), `library/knowledge/private/ai/coach-architecture.md §3` (LLM provider), `library/knowledge/private/ai/rag-vector-strategy.md` (vector layer).

---

## 1. The stack at a glance

| Layer | Choice | Why this, not that |
|---|---|---|
| LLM gateway | **OpenRouter** (`https://openrouter.ai/api/v1`) via OpenAI-compatible SDK | One baseURL, 450+ models, provider failover. `Portkey` / `LiteLLM` would also work but adopting them now is a substitution finding. |
| Chat model | **Llama 3.3 70B Instruct** (`meta-llama/Llama-3.3-70B-Instruct`) | Best open-weights instruction model for coaching responses at the price point. SA-editable in `PlatformConfig.modelChat`. |
| Fast / classifier model | **Llama 3.1 8B Instruct** | ~10× cost reduction vs 70B for routing, summarization extraction, eval. Routing accuracy at 8B is sufficient (target > 90%). SA-editable in `PlatformConfig.modelFast`. |
| Vision model | **Llama 3.2 11B Vision Instruct** | Open-weights multimodal at OpenRouter; pairs naturally with the rest of the stack. SA-editable in `PlatformConfig.modelVision`. |
| Embedding | **Cohere `embed-english-v3.0`** (1024-dim cosine, two input types) | Top-tier English retrieval quality, batch 96/request, rate 10K texts/min. The English-only constraint is acceptable for the current product. |
| Rerank | **Cohere `rerank-v3.5`** (top-K=20 → top-N=5 in two-stage) | Cross-encoder reranking is non-optional past 1k docs. Cohere's API is fast (~200ms) and pairs with Cohere embeddings. |
| Vector DB | **Qdrant** per-tenant `{type}-{tenantId}` collections, HNSW `m: 16, ef_construct: 200`, cosine, `strict_mode: true`, `on_disk: false` | Best RPS + latency profile in the open-source vector DB tier. Per-tenant collections (not per-user) for memory efficiency at 10K+ users. |
| Working memory | **Valkey** (Redis-compatible OSS fork): `session:working:{sessionId}` TTL 7200s | Millisecond access, no embedding cost, auto-expires. Valkey vs Redis: Valkey is the post-2024 OSS-licensed continuation. |
| Session memory | **Postgres** (`AiChatSession.messages`, `summary`, `status`) | Durable audit log; schema-versioned; tooling-mature. |
| Long-term memory | **Qdrant** `conversations-{tenantId}` for episodic + semantic; **Postgres** `GraphEntity`/`GraphRelationship` for graph (gated) | Postgres recursive CTE handles 2-3 hop traversals; no need for a graph DB at sparse-graph scale. |
| Observability | **`AiTrace` Postgres** populated by `traceAICall()` (fire-and-forget) | Same DB as application data: no extra service. Langfuse integration is planned but NOT built. |
| Eval | **`ai-eval.ts`** (`evaluateRetrievalPrecision` / `evaluateRouting` / `computeAgreementRate`) using `modelFast` as judge | LLM-as-judge calibrated against the deploying product's coaching corpus. RAGAS/DeepEval/Braintrust would also work but adopting them is a substitution finding. |
| STT | **Deepgram `nova-3`** (batch via REST), 5-minute audio chunks, p-limit 5 parallel | Best-in-class English STT. Streaming STT is not in scope today (batch only). |

---

## 2. Substitution policy

A push to substitute requires:

1. **Update the corresponding `library/knowledge/private/ai/<doc>.md` first.** The substitution is a doc change, not a code change.
2. **Eval evidence**: show the new component meets or beats the canonical one on the deploying product's metrics (retrieval precision > 0.7, routing accuracy > 90%, sycophancy < 0.6) on a held-out golden set.
3. **Migration plan**: for stateful components (Qdrant, Valkey, Postgres), a phased migration with parallel-running and a measurable cutover date.
4. **Reference-folder demotion of the previous choice**: the canonical alternative goes into `references/` for context.

Without all four, the substitution is a finding (must-fix if it's already in code, should-refactor if it's a proposal in review).

---

## 3. Wiring map: typical file layout

The exact paths are whatever the host repo defines. The "Typical file" column shows the recommended layout; most host codebases settle on something like a `lib/` folder with one file per concern. Reading from this layout is the recommended convention; deviations are not findings on their own, but if the host repo's `library/knowledge/private/ai/` defines a different layout, follow the docs.

| Typical file | Layer | Public surface |
|---|---|---|
| `lib/ai-client.ts` (or equivalent) | OpenRouter client + model slot reader | `getAIClient()`, `getAIModels()`, `getReferralAiConfig()`, `invalidateAIModelsCache()` |
| `lib/cohere-client.ts` | Cohere embedding + rerank | `embed(texts, inputType)`, `embedQuery(text)`, `rerank(query, candidateTexts, topN)` |
| `lib/qdrant-client.ts` | Qdrant client + collection lifecycle | `getQdrantClient()`, `COLLECTION_NAMES`, `ensureCollection()`, `ensureAllCollectionsForTenant()`, `deleteUserVectors()` |
| `lib/session-memory.ts` | Valkey working memory | `getWorkingMemory()`, `setWorkingMemory()`, `appendTurn()`, `clearWorkingMemory()`, `reconstructSession()`, `buildConversationWindow()` |
| `lib/session-compactor.ts` | 40-turn compaction | `appendTurnAndMaybeCompact()`, `triggerCompaction()` (internal) |
| `lib/memory-decay.ts` | Temporal scoring | `applyDecay()` |
| `lib/ai-tracer.ts` | AiTrace writer | `traceAICall()` |
| `lib/ai-eval.ts` | LLM-as-judge | `evaluateRetrievalPrecision()`, `evaluateRouting()`, `computeAgreementRate()` |
| `lib/prompt-versioner.ts` | PromptVersion writer | `recordPromptVersion()`, `recordPromptBlockChanges()` |
| `lib/ai-coach-router.ts` | Routing classifier | `routeToCoach()` |
| `lib/ai-prompt-builder.ts` | 5-layer cascade | `composeSystemPrompt()`, `composeSystemPromptWithMeta()`, `buildGlobalCoachPrompt()`, `getDefaultGlobalPrompt(coachType)` |
| `lib/coaching-llm.ts` | Module path + summary | `buildCoachingPrompt()`, `getCoachingResponse()`, `generateSessionSummary()`, `generateOpeningMessage()` |
| `lib/knowledge-context.ts` | Knowledge retrieval orchestration | `buildKnowledgeContext()`, `buildKnowledgeContextWithMeta()` |
| `lib/knowledge-indexer.ts` | Doc indexing | `indexKnowledgeDocument()`, `indexLessonContent()`, `removeKnowledgeDocument()`, `chunkText()` |
| `lib/context-packet.ts` | Parallel context assembly | `assembleContextPacket()`, `getThreadScope()`, `getDefaultScope()` |
| `lib/agent-orchestrator.ts` | Orchestrator | `runOrchestrator()` |
| `lib/ai-matching.ts` | Matching | `runLLMMatching()` |
| `lib/onboarding-ai.ts` | Onboarding agent | `streamOnboardingChat()`, `buildSystemPrompt()` |
| `lib/media-summarizer.ts` | Recursive summarization | `summarizeTranscript()` |
| `lib/graph-retriever.ts` | GraphRAG retrieval (gated) | `findRelevantEntities()`, `traverseGraph()`, `formatEntityForContext()` |
| `lib/rrf.ts` | RRF fusion | `reciprocalRankFusion()` |
| `lib/referral-ai.ts` | Referral intro generation | `generateIntroMessage()` |
| `api/src/routes/ai-chat.ts` | Main chat handler | `POST /api/ai/chat/message` |
| `api/src/routes/onboarding.ts` | Onboarding SSE handler | `POST /api/onboarding/chat` |

---

## 4. The substitution-pressure flowchart

When a contributor proposes a substitution, walk:

1. **Is it documented?** Did the contributor update `library/knowledge/private/ai/<doc>.md` first? If no → **must-fix: docs first**.
2. **Is the substitution justified by an eval?** Without numbers, vendor claims are directional. → **must-fix: show the eval lift on our golden set**.
3. **What's the migration plan?** Stateful component → phased migration with parallel-running window. → **must-fix: produce migration plan**.
4. **What's the rollback story?** If the substitution underperforms on day 30, what's the path back? → **must-fix: rollback documented**.
5. **Has the previous choice been demoted to `references/`?** → **should-refactor: organize the references folder**.

If all five are clean, the substitution is approvable.

---

## 5. Why these specific choices (the non-obvious ones)

**Cohere over OpenAI / Voyage / BGE:** the deploying product is English-only at v1. Cohere's `embed-english-v3.0` is calibrated for English retrieval and pairs with their `rerank-v3.5` cross-encoder. Multi-vendor stacks (e.g., OpenAI embed + Cohere rerank) work but introduce two vendor relationships to manage.

**Qdrant over Pinecone / Weaviate / pgvector:** Qdrant's RPS+latency profile is best-in-class at the open-source tier; HNSW parameters are well-documented; `strict_mode_config` prevents silent full-scans. pgvector becomes attractive only when vectors must live in Postgres for transactional reasons (the deploying product's vectors do not).

**Valkey over Redis:** Valkey is the OSS-licensed fork of Redis (post-March 2024 license change). Linux Foundation-backed, drop-in compatible. Adopting Redis 7.4+ commercial license has cost implications; Valkey is the safe default.

**Llama 3.3 70B over Claude 3.5 Sonnet / GPT-4o / Gemini 2.0 Pro:** Open-weights, available on OpenRouter at competitive price. The platform's persona is consistent across providers; if a closed-weights model demonstrates 15%+ lift on the deploying product's coaching rubric, the SA can switch the slot in one click.

**Llama 3.1 8B for routing / summarization extraction:** ~10× cheaper than 70B; routing accuracy at 8B is sufficient (target > 90%) per the docs. Using `modelChat` for routing is a should-refactor (cost) finding.

**Deepgram over Whisper / AssemblyAI / Gladia:** Production-grade English STT with diarization, paragraphs, batch API stable enough for video-processing pipelines.

**Three-tier memory over a single store:** Each tier has a distinct retrieval profile (TTL working / durable session / semantic long-term). Putting session state in Valkey or episodic vectors in Postgres mixes the access patterns and breaks the architecture's load-bearing properties. See `guides/12-three-tier-memory.md`.

---

## 6. Stack version guarantees

Locked-down dependencies (the canonical stack):

- Cohere SDK: version pinned in `api/package.json`. Verify the SDK supports `rerank-v3.5` and `embed-english-v3.0` input types `search_document` / `search_query`.
- `@qdrant/js-client-rest`: version pinned. Verify it exposes `strict_mode_config` and HNSW config.
- `openai` (used as OpenRouter client): version pinned.
- `@deepgram/sdk`: version pinned. Verify it exposes `nova-3` model + `paragraphs` / `utterances` / `punctuate` features.

When a dep is bumped, the corresponding research note in `research/` is updated. See `research/2026-04-25-qdrant-hnsw-tuning.md`, `research/2026-04-25-cohere-rerank-v3-5.md`, etc.

---

## 7. References folder cross-link

Generic alternatives (Mastra / Vercel AI SDK / LangGraph / Pydantic AI / pgvector / Pinecone / Weaviate / Portkey / LiteLLM / Langfuse / Braintrust / BGE-M3 / Voyage / OpenAI embeddings) are in `references/` as **demoted context**: useful when reading vendor blog posts or evaluating future substitutions, NOT useful as activ