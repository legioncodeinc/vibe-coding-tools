# references/: generic AI patterns, one flipped for this repo

> **One important exception to "demoted": `generic-vector-db-choice.md` is no longer a demoted reference.** This repo's default retrieval substrate is pgvector on Neon Postgres, which used to be documented in that file as one demoted alternative among several to a canonical Qdrant choice. That framing is inverted now; read the note at the top of `generic-vector-db-choice.md` and `guides/00-selection-and-defaults.md` before treating anything below as settled.

For every other layer, the cognitive layer's alternative stack, documented in full starting at `guides/01-stack-enforcement.md`, is:

- **Gateway:** OpenRouter
- **Models:** Llama 3.3 70B / 3.1 8B / 3.2 11B vision (via OpenRouter, configured in `PlatformConfig`)
- **Embedding:** Cohere `embed-english-v3.0`
- **Rerank:** Cohere `rerank-v3.5`
- **Vector DB:** Qdrant per-tenant (documented as the alternative to this repo's pgvector default; see the exception above)
- **Working memory:** Valkey
- **Session memory:** Postgres `AiChatSession`
- **Long-term memory:** Qdrant `conversations-{tenantId}` + optional `GraphEntity`/`GraphRelationship` graph (gated)
- **Observability:** `AiTrace` Postgres
- **STT:** Deepgram

That alternative stack remains fully supported, not deleted or downgraded, for a project that already runs it or has a specific need past this repo's default. The notes below (excluding the vector-db one) document alternatives to *that* stack. They exist for two reasons:

1. **Substitution-pressure context**: when a contributor or vendor pitches a further substitution, the references explain the tradeoffs already considered.
2. **Future-substitution ground truth**: if a choice ever needs to change, these notes are the starting point for a new evaluation.

---

## Files in this folder

| File | What it documents |
|---|---|
| `generic-vector-db-choice.md` | **Not demoted.** pgvector (this repo's default, via `vector-store-stinger`) versus Qdrant (the alternative stack) versus Pinecone / Weaviate / Milvus / Chroma. See `guides/00-selection-and-defaults.md`. |
| `generic-orchestration-frameworks.md` | Mastra / Vercel AI SDK / LangGraph / Pydantic AI / LlamaIndex / CrewAI as alternatives to the deploying product's homegrown `runOrchestrator()` |
| `generic-embedding-model-choice.md` | BGE-M3 / Voyage / OpenAI text-embedding-3 as alternatives to Cohere `embed-english-v3.0` |
| `generic-llm-gateway-choice.md` | Portkey / LiteLLM as alternatives to OpenRouter |
| `generic-eval-platforms.md` | RAGAS / DeepEval / Langfuse / Braintrust / Helicone as alternatives to the deploying product's homegrown `ai-eval.ts` + `AiTrace` |
| `generic-graph-db-choice.md` | Neo4j as an alternative to the deploying product's Postgres-native graph (`GraphEntity` / `GraphRelationship`) |
| `vectara-naacl-2025-chunking-finding.md` | The Vectara NAACL 2025 paper (load-bearing reference for fixed-size chunking, carried over verbatim from mind-stinger's research, because it's the stack-neutral defense against vendor "semantic chunking" claims and applies to this repo's default substrate exactly as much as the alternative stack) |

New research supporting this repo's pgvector default and the SvelteKit streaming pattern lives in `references/research/raw/` (raw sources) and `references/research/distilled-mind-svelte-neon.md` (synthesis), separate from this folder's demoted-alternatives sources and from the pre-existing `research/2026-04-25-*.md` trail for the alternative stack.

---

## Substitution policy reminder (for the alternative stack layers; the vector-db layer's decision is in `guides/00-selection-and-defaults.md`)

A push to substitute requires (per `guides/01-stack-enforcement.md §2`):

1. Update the corresponding `library/knowledge/private/ai/<doc>.md` first.
2. Eval evidence: show the new component meets or beats the current one on the deploying product's metrics.
3. Migration plan: for stateful components, phased migration with parallel-running.
4. Reference-folder demotion of the previous choice.

Without all four, the substitution is a finding.
