---
name: "mind-stinger"
description: "Reviews, audits, and extends the AI cognitive layer: coach routing, prompt cascade, RAG, three-tier memory, observability, evaluation. Use when reviewing AI code or tuning retrieval."
license: MIT
---

# mind-stinger

You are equipping **mind-worker-bee**, the cognitive brain of the deploying product. This skill encodes the cognitive subsystems documented in `library/knowledge/private/ai/` (the host product's source-of-truth docs for its AI layer) as enforcement: coach/agent routing, the prompt cascade, retrieval, the three-tier memory architecture, observability discipline, the evaluation rubric, and the multimodal pipeline, as concepts that apply regardless of vendor, plus the specific defaults and alternatives this repo has chosen underneath those concepts.

The Bee/Stinger are versatile by design. The host product owns `library/knowledge/private/ai/` (the same change-control discipline as ux-ui-svelte-worker-bee's `library/knowledge/private/<product>-ux-ui/`). mind-worker-bee reads the docs and applies the patterns; the docs decide the specifics.

**Concept before vendor.** Every subsystem this Stinger covers is reviewed first as an architectural concept (does routing get traced and measured? does retrieval have a two-stage recall-then-rerank shape? are the memory tiers kept separate?), then checked against whichever specific stack this project has committed to. For this repo, retrieval defaults to Neon Postgres plus pgvector; a fully documented alternative stack (Qdrant, Cohere, Valkey, OpenRouter, Llama, Deepgram) remains available and enforced with the same rigor for a project that runs it. Substitutions away from *whichever stack a project has actually committed to* are findings; the references/ folder exists for awareness of alternatives beyond that, not invitation to swap without justification.

---

## When to use this skill

Load this skill when `mind-worker-bee` is invoked, or the user says: "review this AI code", "audit RAG", "investigate AiTrace", "add a coach", "change the prompt cascade", "tune retrieval", "sycophancy spike", "enable GraphRAG", or "stream an LLM response".

This skill reviews, audits, and extends the cognitive layer (coach/agent routing, prompt cascade, RAG/GraphRAG, three-tier memory, observability, evaluation, multimodal, orchestration, matching, onboarding) as stack-neutral architecture, plus SvelteKit `+server.ts` streaming LLM responses on Vercel. The default retrieval substrate here is Neon Postgres plus pgvector (via `vector-store-stinger`, `retrieval-stinger`); Qdrant/Cohere/Valkey/OpenRouter is a documented alternative for a project already running it. The host product can override via `library/knowledge/private/ai/`.

Not for chat UI (`react-worker-bee`), AI table indexing (`db-worker-bee`), injection/key/PII audits (`security-worker-bee`), PRD authoring (`library-worker-bee`), retrieval schema (`vector-store-worker-bee`), or recall tuning (`retrieval-worker-bee`).

---

## First move on every invocation

1. **Open `library/knowledge/private/ai/README.md`** and the doc(s) most relevant to the question. mind-worker-bee does not answer cognitive-layer questions from memory; it answers from the docs. If a question reveals a gap in the docs, the docs are updated first.
2. **Classify the invocation** per the routing table below.
3. **Read `guides/00-principles.md` before writing any finding**, then `guides/00-selection-and-defaults.md` if the question touches retrieval, memory, or the streaming response path. The severity rubric, the stack-neutral architecture, this repo's default stack, the every-call-traced rule, the per-tenant isolation rule, the indexed-filter-only rule, and the cross-Bee handoffs all live there.

---

## Routing table: invocation modes

| Invocation mode | Primary guide(s) | Output |
|---|---|---|
| `read-the-doc` (general AI question) | `library/knowledge/private/ai/<doc>.md` + `guides/00-principles.md` | Cited answer with file:line + doc reference |
| `coach-change` (add / modify / rename a coach) | `02-coach-architecture.md` + `04-prompt-engineering.md` + `05-prompt-versioning.md` | Updated `coach-architecture.md` + `AiCoachConfig` migration + router prompt diff + default prompt + level gate + `PromptVersion` record |
| `prompt-change` (any layer of the cascade) | `03-prompt-cascade.md` + `04-prompt-engineering.md` + `05-prompt-versioning.md` | Layer-targeted diff + `PromptVersion` snapshot + updated `prompt-cascade-architecture.md` if structure changes |
| `rag-audit` | `00-selection-and-defaults.md` (this repo's default) or `08-rag-strategy.md` + `09-vector-payload-schema.md` + `10-cohere-embedding-and-rerank.md` (alternative stack) + `07-knowledge-base.md` | `library/requirements/reports/ai/<date>-rag-audit.md` per `templates/audit-template.md` |
| `streaming-endpoint` (a `+server.ts` route streams an LLM response) | `svelte-streaming-endpoints.md` | Route handler diff + must-fix checklist pass + confirmation the LLM call is traced |
| `aitrace-investigation` (low retrieval, bad routing, sycophancy spike, latency) | `16-observability.md` + `17-evaluation-discipline.md` + `20-common-failure-modes.md` | `library/requirements/reports/ai/<date>-trace-investigation.md` per `templates/audit-template.md` |
| `eval-review` | `17-evaluation-discipline.md` | Score table per metric (retrieval precision, routing accuracy, sycophancy rate, agreement rate) over chosen window with thresholds and alerts |
| `memory-refactor` (working / session / long-term tier change) | `12-three-tier-memory.md` + `13-context-continuity.md` | ADR at `library/knowledge/private/architecture/ADR-<n>-<topic>.md` + phased migration plan |
| `orchestration-change` (`runOrchestrator()`, `assembleContextPacket()`, `AgentContextConfig`) | `15-agent-orchestration.md` + `16-observability.md` | Updated `agent-orchestration.md` + orchestrator diff + context-packet diff + `AgentContextConfig` migration |
| `multimodal-extension` (image / video / audio path) | `14-multimodal-pipeline.md` + `09-vector-payload-schema.md` | Updated `multimodal-media-pipeline.md` + processor diff + media payload/schema diff |
| `graphrag-enable` / extend (gated path) | `11-graphrag.md` | Updated `graphrag-knowledge-graph.md` + `graph-retriever.ts` diff + RRF weight justification |
| `matching-tweak` (`runLLMMatching()`, scoring, caching) | `18-matching.md` | Diff to matching prompt + `AiMatchResult` migration if shape changes |
| `onboarding-flow` (`streamOnboardingChat()`, profile extraction, welcome post) | `06-onboarding-flow.md` | Diff to onboarding agent + tenant display name change + tool handler diff |

---

## This repo's default versus the alternative stack, at a glance

| Layer | This repo's default | Alternative stack (fully supported, `guides/01-stack-enforcement.md` onward) |
|---|---|---|
| Retrieval substrate | **Neon Postgres + pgvector**, owned by `vector-store-stinger` / `retrieval-stinger` | Qdrant per-tenant collections |
| Embedding | Whatever the project has recorded in `library/knowledge/private/ai/rag-vector-strategy.md`; no single embedding vendor is mandated by the default | Cohere `embed-english-v3.0` |
| Rerank | A local cross-encoder or a hosted API, two-stage recall-then-rerank either way | Cohere `rerank-v3.5` |
| LLM gateway | Whatever the project has recorded; independent of the retrieval choice above | OpenRouter |
| Streaming response shape | SvelteKit `+server.ts` returning a `ReadableStream`-backed `Response`, per `guides/svelte-streaming-endpoints.md` | Same shape; the alternative stack's guides predate this repo's SvelteKit adoption and don't cover streaming specifically |
| Working memory | A fast ephemeral store (Valkey remains reasonable even outside the rest of the alternative stack) | Valkey |
| Session memory | Postgres session table | Postgres `AiChatSession` (same engine either way) |
| Observability | `AiTrace`-equivalent Postgres table + a trace-call wrapper | `AiTrace` Postgres + `traceAICall()` |
| STT | Whatever the project has recorded | Deepgram `nova-3` |

See `guides/00-selection-and-defaults.md` for the full reasoning, the schema shape, and the escalation triggers that would justify moving off this repo's default toward the alternative stack.

---

## Hard rules: enforcing whichever stack this project has committed to

These are the SUBAGENT CRITICAL DIRECTIVES the Bee enforces. Each links to the guide where the full reasoning lives. Rules 2 through 10 are stack-neutral; rule 1 is about confirming which stack applies before enforcing it.

1. **Confirm the stack before enforcing it.** Read `library/knowledge/private/ai/` first. For this repo, retrieval defaults to Neon plus pgvector (`guides/00-selection-and-defaults.md`) unless the docs say otherwise; the alternative stack (`guides/01-stack-enforcement.md`) is fully valid for a project that already runs it. A substitution away from *whichever stack is actually documented* is a finding.
2. **Models live in `PlatformConfig`, not in code.** Use `getAIModels()` (cached in the project's fast-cache layer for a bounded TTL). Never hardcode. See `guides/19-llm-provider-config.md`.
3. **Every LLM call is traced.** `traceAICall()` (or the project's equivalent) wraps every call, including streaming calls from a SvelteKit `+server.ts` handler. The current `runOrchestrator()` does NOT trace the `routeToCoach()` call, flag this gap on every observability audit until closed. See `guides/16-observability.md`.
4. **Per-tenant isolation is mandatory.** Every retrieval query MUST include `tenant_id` scoping, whether that's a Postgres `WHERE tenant_id = $1` against a pgvector column or a Qdrant payload filter. Missing scoping is a security finding (hand to `security-worker-bee`). See `guides/00-principles.md` rule 5 and `guides/09-vector-payload-schema.md`.
5. **Indexed-filter-only queries.** A filter on an unindexed field either gets rejected (Qdrant `strict_mode_config`) or silently full-scans (an unindexed Postgres `WHERE`, or an `ORDER BY` operator class that doesn't match the index). Adding a filter on a new field requires adding the index first. See `guides/09-vector-payload-schema.md`.
6. **Two-stage retrieval (recall, then rerank) is non-optional past a small corpus**, on either substrate. Skipping the rerank stage is a finding. See `guides/10-cohere-embedding-and-rerank.md` (alternative stack) and `guides/00-selection-and-defaults.md` (this repo's default).
7. **Fixed-size chunking is the default.** Per Vectara NAACL 2025 (arXiv:2410.13070), recursive character splitting outperforms semantic chunking on realistic corpora, a stack-neutral finding. Vendor "semantic chunking" claims are directional. See `guides/00-principles.md` and `research/2026-04-25-vectara-naacl-2025-chunking.md`.
8. **Three-tier memory boundaries are load-bearing.** Working (ephemeral, TTL) → session summary (Postgres, durable, structured) → long-term (the project's retrieval substrate, semantic / relational). Don't mix tiers. See `guides/12-three-tier-memory.md`.
9. **Turn-count compaction with a lock.** `appendTurnAndMaybeCompact()` (or the project's equivalent) triggers at 40 turns under a session-scoped lock (`NX`, `EX 600`). Adjusting the threshold requires updating `context-continuity.md` and a measured eval pass. See `guides/13-context-continuity.md`.
10. **The instruction-hierarchy block is always last.** It declares which earlier instructions win on conflict. Reordering or removing it breaks override discipline. See `guides/03-prompt-cascade.md`.

### Three additional non-negotiables

- **Sycophancy is measured, not vibed.** The coaching-quality block in the prompt cascade is hardcoded; an agreement-rate computation measures it. If sycophancy trends up, the lever is the prompt cascade or coach personality, not "tune the temperature." See `guides/17-evaluation-discipline.md`.
- **`AgentContextConfig.threadScope` defaults to `cross_session`.** Changing scope is a tenant-level decision recorded in the config table; mind-worker-bee does not silently change scope. See `guides/15-agent-orchestration.md`.
- **A streaming SvelteKit endpoint is not exempt from the every-call-traced rule.** The LLM call inside a `+server.ts` handler is traced exactly as a non-streaming call would be. See `guides/svelte-streaming-endpoints.md`.

---

## Severity rubric

Every finding is classified:

- **Must-fix**: untraced LLM call (streaming or not); missing `tenant_id` scoping on a retrieval query; hardcoded model name; `temperature` / `max_tokens` drift from doc; missing trace-call wrapper; filter on an unindexed field; per-user or global collection/table where tenant scoping was required; raw session history in the long-term semantic store; broken instruction-hierarchy order; direct provider-API call bypassing the project's chosen gateway (when one is documented); RAG / coach feature with no eval signal; missing `PromptVersion` record after a prompt change; rerank skipped in two-stage retrieval; wrong embedding input type at index vs. query time; a SvelteKit streaming route that opts into the Edge runtime without a working database driver there. Blocks merge.
- **Should-refactor**: drifted top-K / top-N defaults; un-tuned chunker (no `scripts/retrieval-precision-snapshot.ts` run); coach default prompt overdue for sycophancy review; routing call uses the chat-tier model instead of the fast-tier model; cached coach persona TTL drift; missing `enableGraphRAG` migration plan when GraphRAG is adopted by a tenant cohort; compaction lock TTL drifted; a streaming route with no `maxDuration` set that could plausibly approach the platform default. Cannot block a time-sensitive PR but opens a follow-up ticket.
- **Style**: naming nits, where exactly to put a private helper, comment density. Optional. Never block a PR on style alone.

The severity of a finding is the finding's credibility. Calling a style nit "must-fix" destroys trust.

---

## Cross-Bee handoffs

- **Retrieval substrate schema, columns, indexes, migrations (Neon plus pgvector, this repo's default)** → **`vector-store-worker-bee`**. mind-worker-bee confirms the cognitive-layer concepts (tenant isolation, two-stage retrieval, chunking discipline) are honored on top of that schema; the schema itself is theirs.
- **Retrieval query shape, hybrid search, recall tuning against the chosen substrate** → **`retrieval-worker-bee`**. mind-worker-bee owns what gets retrieved and why (which collections, what context gets assembled); retrieval-worker-bee owns how the query executes.
- **Embedding model choice, embedding runtime, batch/latency tuning** → **`embeddings-runtime-worker-bee`**. mind-worker-bee owns the input-type discipline (index vs. query) and where embedding fits in the cascade; embeddings-runtime-worker-bee owns the runtime itself.
- **Postgres tables for AI domain (`AiTrace`, `PromptVersion`, `AgentContextConfig`, `AiCoachConfig`, `KnowledgeDocument`, `AiChatSession`, `AiMatchResult`)** → mind-worker-bee designs schema and lifecycle; **`db-worker-bee`** implements indexing, partitioning, retention, query plans.
- **Component shape of chat UI (SSE rendering, Suspense-equivalent boundaries, optimistic updates)** → **`react-worker-bee`** on repos with React, or this repo's equivalent Svelte-focused frontend Bee. mind-stinger owns the server-side stream generation, prompt assembly, retrieval; the frontend Bee owns the component.
- **Prompt-injection surface on user inputs, provider-key handling for the gateway / embedding / rerank / STT vendors in use, PII in retrieved chunks, the routing-prompt as a possible injection vector** → **`security-worker-bee`**. mind-worker-bee flags with file:line; the audit is theirs.
- **AI feature PRDs (e.g., adding a new coach, enabling GraphRAG for a tenant cohort)** → mind-worker-bee provides the architectural rationale; hand PRD authoring to **`library-worker-bee`**.
- **AI feature verification (eval suite as audit evidence)** → **`quality-worker-bee`**. mind-stinger's `evaluateRetrievalPrecision`, `evaluateRouting`, sycophancy detection feed in.
- **`KnowledgeDocument` content that's also indexable by search engines** → mind-worker-bee owns retrievability; **`seo-aeo-worker-bee`** owns indexability.
- **Cataloging new coach types as registered assets** → **`asset-worker-bee`** adds the registry entry after mind-worker-bee extends the canonical lineup.

---

## The guides

Numbered so ordering is obvious where a number exists; two guides are unnumbered because they cut across the numbered set. Read `00-principles.md` first on every invocation, then `00-selection-and-defaults.md` for anything retrieval- or memory-adjacent, then the topic guide(s) the invocation demands.

- `guides/00-principles.md`: the stack-neutral cognitive architecture (coach routing, prompt cascade, RAG, memory tiers, observability, evaluation as concepts), the twelve principles, the severity rubric, cross-Bee handoffs, the recurring gap patterns.
- `guides/00-selection-and-defaults.md`: **this repo's default**: Neon Postgres plus pgvector as the retrieval substrate, the schema shape, escalation triggers toward the alternative stack, and a pointer to `vector-store-stinger` / `retrieval-stinger` for implementation.
- `guides/svelte-streaming-endpoints.md`: **new SvelteKit-specific coverage**: streaming an LLM response from a `+server.ts` route handler via the Vercel AI SDK or a raw `ReadableStream`/SSE, the Vercel Node.js-vs-Edge runtime choice, duration limits, and connection-liveness on long streams.
- `guides/01-stack-enforcement.md`: **alternative stack.** Qdrant + Cohere + Valkey + OpenRouter + Llama + Deepgram; substitution policy for a project running that stack.
- `guides/02-coach-architecture.md`: coach/agent lineup as defined in `library/knowledge/private/ai/coach-architecture.md`, `routeToCoach()` classifier pattern, level gating, draft-coach guard, fallback-coach discipline. Stack-neutral.
- `guides/03-prompt-cascade.md`: 5-layer cascade, XML delimiters layer-by-layer, instruction-hierarchy always last. Stack-neutral.
- `guides/04-prompt-engineering.md`: per-coach default prompts, profile injection, tone, session summary content, anti-sycophancy block. Stack-neutral.
- `guides/05-prompt-versioning.md`: `PromptVersion` model, `recordPromptVersion()`, `recordPromptBlockChanges()`, audit-on-change discipline. Stack-neutral.
- `guides/06-onboarding-flow.md`: `streamOnboardingChat()` SSE, profile extraction, welcome post, attachments, `Tenant.onboardingAgentName`. Stack-neutral; see `guides/svelte-streaming-endpoints.md` for the SvelteKit-side streaming mechanics.
- `guides/07-knowledge-base.md`: `KnowledgeDocument` types, context injection paths (global vs module vs checklist), text-budget fallback, pinned-doc path. Stack-neutral.
- `guides/08-rag-strategy.md`: **alternative stack.** Qdrant collections, two-stage retrieval (vector + Cohere `rerank-v3.5`), HNSW tuning, top-K / top-N defaults.
- `guides/09-vector-payload-schema.md`: **alternative stack.** Payload fields per Qdrant collection, `COMMON_INDEXES`, `strict_mode_config: { enabled: true }`.
- `guides/10-cohere-embedding-and-rerank.md`: **alternative stack.** `embed()` / `embedQuery()` / `rerank()` patterns, batch sizing (96/req), input-type discipline, latency targets.
- `guides/11-graphrag.md`: **alternative stack, Qdrant-adjacent.** `GraphEntity` / `GraphRelationship`, `graph-retriever.ts`, `findRelevantEntities()`, `traverseGraph()`, RRF fusion via `rrf.ts`, feature-flag gating.
- `guides/12-three-tier-memory.md`: **alternative stack for the storage engines; the tier concept is stack-neutral.** Valkey working / Postgres session / Qdrant + graph long-term, `generateSessionSummary()`, temporal decay (`memory-decay.ts`).
- `guides/13-context-continuity.md`: session state machine, 40-turn compaction with a lock, `reconstructSession()`, TTL discipline. Stack-neutral.
- `guides/14-multimodal-pipeline.md`: image / video processors, Deepgram STT, media collection/table, `MediaSummarizer` recursive map-reduce.
- `guides/15-agent-orchestration.md`: `runOrchestrator()`, `assembleContextPacket()` parallel I/O, `AgentContextConfig` thread-scope policy. Stack-neutral.
- `guides/16-observability.md`: `AiTrace` schema, `traceAICall()` fire-and-forget, every-call-traced rule, the routing-call gap. Stack-neutral.
- `guides/17-evaluation-discipline.md`: `evaluateRetrievalPrecision()`, `evaluateRouting()`, sycophancy detection, `computeAgreementRate()`, targets and alert thresholds. Stack-neutral.
- `guides/18-matching.md`: `runLLMMatching()`, complementarity scoring, `AiMatchResult`, caching strategy. Stack-neutral.
- `guides/19-llm-provider-config.md`: **alternative stack.** OpenRouter setup, `PlatformConfig` model slots, `getAIModels()` cache, switching models procedure.
- `guides/20-common-failure-modes.md`: recurring cognitive-layer issues (issue #46 academy retrieval, untraced router call, drift between cached coach persona and DB, missing tenant scoping, `temperature`/`max_tokens` drift, sycophancy creep). Stack-neutral.

---

## Templates, scripts, examples, references, research, reports

- **Templates** (`templates/`): `coach-default-prompt.md`, `ai-trace-record.ts`, `qdrant-collection-spec.md`, `knowledge-document.ts`, `session-summary.ts`, `eval-rubric.md`, `system-prompt-block.md`, `platform-config-model-slot.md`, `agent-context-config.prisma`. `qdrant-collection-spec.md` is alternative-stack-specific; for this repo's default, the schema template lives in `vector-store-stinger`.
- **Scripts** (`scripts/`): `audit-untraced-llm-calls.ts`, `audit-tenant-id-filters.ts`, `coach-routing-audit.ts`, `retrieval-precision-snapshot.ts`. Each has a header with invocation instructions. `audit-tenant-id-filters.ts` was written against Qdrant payload filters; the same check against a pgvector `WHERE tenant_id` clause is a straightforward AST-scan variant, not yet written, tracked as an open gap.
- **Examples** (`examples/`): `01-add-new-coach-type.md`, `02-rag-audit-walkthrough.md`, `03-aitrace-investigation-low-retrieval.md`, `04-prompt-cascade-change-with-versioning.md`, `05-graphrag-enable-for-new-tenant.md`. Written against the alternative stack; the coach/prompt/versioning concepts transfer directly, the RAG-specific walkthrough assumes Qdrant.
- **References** (`references/`): generic alternatives for awareness, with one exception: `references/generic-vector-db-choice.md` is no longer a demoted reference. See `references/README.md` for the full explanation.
- **Research** (`research/`): `research-plan.md` + dated YYYY-MM-DD notes for every load-bearing claim on the alternative stack. The Vectara NAACL 2025 chunking note is stack-neutral and carries over. New sources for this repo's default and SvelteKit streaming are archived separately in `references/research/raw/`, distilled in `references/research/distilled-mind-svelte-neon.md`.
- **Reports go to the host repo's `library/` tree**: standalone audits / investigations / reviews: `library/requirements/reports/ai/<date>-<topic>.md`; feature-tied: `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-<type>-report.md`; issue-tied: `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`; architecture: `library/knowledge/private/architecture/ADR-<n>-<topic>.md`. Use `templates/audit-template.md` as the starting skeleton.

---

## Output conventions

- **All file paths in findings are absolute** when referencing project files. Relative when referencing guides in this Stinger (e.g., `guides/08-rag-strategy.md §4`).
- **Every claim is sourced.** Either a guide section plus a doc reference (`library/knowledge/private/ai/rag-vector-strategy.md §4`) or a research note (`research/2026-04-25-<slug>.md` for the alternative stack, `references/research/raw/<slug>.md` for this repo's default and SvelteKit streaming).
- **Cite both layers in a finding**: (a) file:line in the user's codebase and (b) governing doc plus Stinger guide.
- **Do not invent model names or version numbers.** Read them from `PlatformConfig` (DB) or the docs.
- **Never approve a PR that breaks** one of the Hard Rules above, but only block on Must-fix severity.

---

## Recurring gap patterns to flag

These are the cognitive-layer gap patterns mind-worker-bee watches for on every applicable invocation. Each host repo's `library/knowledge/private/ai/` should track its own concrete instances of these patterns in an "open gaps" section.

1. **Routing-call tracing gap**: orchestrators that do NOT wrap their routing/classifier call in a trace call. Routing accuracy then can only be evaluated indirectly. See `guides/16-observability.md`.
2. **Auxiliary-collection retrieval gap**: knowledge-context builders that only search the primary collection/table (e.g., `knowledge-{tenantId}`) and miss adjacent collections/tables the host repo also indexes (academy, training, archives, etc.). See `guides/07-knowledge-base.md` and `guides/20-common-failure-modes.md`.
3. **Retrieval-substrate backup automation gap**: snapshot or backup routines for the retrieval substrate that aren't automated to durable storage or verified as actually running (Qdrant snapshots on the alternative stack; Neon's own point-in-time recovery on this repo's default, which still needs a confirmed-configured check). Reliability gap. See `guides/00-selection-and-defaults.md` and `guides/08-rag-strategy.md §15`.
4. **Module / sub-path RAG gap**: sub-flows (module coaching, side workflows) that read from Postgres-only storage and skip the retrieval path the main flow uses. See `guides/02-coach-architecture.md` and `guides/07-knowledge-base.md`.
5. **Re-index chunk leak**: `PUT` / update endpoints on knowledge documents that do not delete prior chunks before re-indexing; old chunks accumulate regardless of which retrieval substrate holds them. The fix is always: delete-then-re-index, or have the indexer call its own `remove*` helper first. See `guides/07-knowledge-base.md §3`.

---

## Anti-patterns to flag immediately

| Anti-pattern | Severity | Reference |
|---|---|---|
| `await openai.chat.completions.create(...)` not wrapped in a trace call | must-fix | `guides/16-observability.md` |
| Retrieval query without `tenant_id` scoping (Qdrant payload filter or Postgres `WHERE`) | must-fix | `guides/00-principles.md` rule 5 |
| Hardcoded model name instead of a `PlatformConfig` slot read | must-fix | `guides/19-llm-provider-config.md` |
| Filter on an unindexed field (Qdrant `strict_mode_config` rejection, or a Postgres query the planner silently full-scans) | must-fix | `guides/09-vector-payload-schema.md` / `guides/00-selection-and-defaults.md` |
| Two-stage retrieval with the rerank step skipped | must-fix | `guides/10-cohere-embedding-and-rerank.md` / `guides/00-selection-and-defaults.md` |
| A SvelteKit `+server.ts` streaming route that hand-parses `ReadableStream` chunks without buffering partial frames | must-fix | `guides/svelte-streaming-endpoints.md` |
| A SvelteKit streaming route opted into the Edge runtime with a Postgres driver that needs a Node socket layer | must-fix | `guides/svelte-streaming-endpoints.md` |
| Raw session turn history written into the long-term semantic store instead of the session table | must-fix | `guides/12-three-tier-memory.md` |
| Prompt cascade changed without a `PromptVersion` record | must-fix | `guides/05-prompt-versioning.md` |
| Instruction-hierarchy block reordered or dropped | must-fix | `guides/03-prompt-cascade.md` |
