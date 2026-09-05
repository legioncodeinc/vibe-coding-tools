---
name: "embeddings-runtime-stinger"
description: "Picks and runs embedding models: hosted (OpenAI, Cohere, Voyage) vs self-hosted, cost tradeoffs, batching, caching. Use when choosing, swapping, or debugging an embedding model."
---

# embeddings-runtime Stinger

You are the playbook for `embeddings-runtime-worker-bee`. Every invocation produces one concrete artifact: a model or provider recommendation, an on/off decision, a model-swap plan, a batching or caching fix, a daemon-lifecycle fix, or a configuration snippet. Every claim is backed by the ground truth in `references/research/` (the new provider-selection sourcing), `research/` (the original Hivemind/local-daemon research trail), and, where applicable, the actual Hivemind source under `src/embeddings/`.

## Scope in one sentence

Embedding model selection and runtime, generally: hosted providers (OpenAI, Cohere, Voyage AI) and self-hosted local models, dimension/cost/latency tradeoffs, batching, caching, and the dim-must-match-schema constraint against whichever vector store is in play. The local-daemon (nomic-embed-text-v1.5) material is one fully documented implementation of the self-hosted path, not the whole scope.

## When to use this skill

Use when the user says: "which embedding model should I use", "OpenAI vs Cohere vs Voyage", "should I turn embeddings on", "swap the embedding model", "cache embeddings", "batch embedding calls", "the embed daemon is stuck", "change the embedding dimension", or "local vs hosted embeddings".

Covers choosing and calling a hosted provider (OpenAI text-embedding-3, Cohere embed-v3/v4, Voyage AI) or running a self-hosted local model (transformers.js), dimension and cost tradeoffs, batching, caching to avoid re-embedding identical text, and the dim-must-match-schema constraint against pgvector (this stack's default) or Deep Lake. The local-daemon material (nomic-embed-text-v1.5, 768-dim, q8, Unix-socket IPC) is kept as one documented self-hosted implementation.

Do NOT use for the vector column/index/schema mechanics themselves (`vector-store-stinger`), API key security (`security-worker-bee`), or PRD authorship (`library-worker-bee`).

## Invocation modes (routing table)

Read the user's request and match to one mode. Most requests match one primary mode with one supporting mode.

| Mode | Trigger phrases | Primary guide |
|---|---|---|
| `selection` | "which embedding model", "OpenAI vs Cohere vs Voyage", "local or hosted", "what should I use for embeddings" | `guides/00-selection-matrix.md` |
| `hosted-openai` | "text-embedding-3", "OpenAI embeddings", "dimensions parameter" | `guides/hosted-01-openai.md` |
| `hosted-cohere` | "embed-v4", "Cohere embeddings", "input_type", "search_document vs search_query" | `guides/hosted-02-cohere.md` |
| `hosted-voyage` | "Voyage AI", "voyage-4", "voyage embeddings" | `guides/hosted-03-voyage.md` |
| `batching` | "batch embedding calls", "rate limit", "bulk embed", "backfill embeddings" | `guides/01-batching.md` |
| `caching` | "cache embeddings", "avoid re-embedding", "duplicate embedding calls" | `guides/02-caching.md` |
| `local-daemon-lifecycle` | "embed daemon stuck", "warmup", "daemon won't start", "first embedding is slow" | `guides/local-daemon-01-lifecycle.md` |
| `local-daemon-ipc` | "socket protocol", "NDJSON", "client can't reach daemon", "unix socket path" | `guides/local-daemon-02-ipc-protocol.md` |
| `local-daemon-model-selection` | "swap the embedding model" (on the Hivemind local daemon), "nomic vs other" | `guides/local-daemon-03-model-selection.md` |
| `local-daemon-quantization` | "q8 vs fp32", "footprint", "quantization quality" (local daemon) | `guides/local-daemon-04-quantization-and-footprint.md` |
| `local-daemon-on-vs-off` | "should I turn embeddings on", "is 600MB worth it", "BM25 fallback" (Hivemind) | `guides/local-daemon-05-embeddings-vs-bm25.md` |
| `local-vs-hosted-hivemind` | "run embeddings locally or hosted" (Hivemind specifically) | `guides/local-daemon-06-local-vs-hosted.md` |
| `schema-and-dim` | "change the dimension", "dim mismatch", "schema event", "EMBEDDING_DIMS" | `guides/local-daemon-07-schema-and-columns.md` (Deep Lake) or `vector-store-stinger` (pgvector) |

## First action on every invocation

1. Read `guides/00-principles.md`, the non-negotiables that govern every output regardless of provider or runtime.
2. Match the request to the routing table above. If no store or provider has been chosen yet, start at `guides/00-selection-matrix.md` rather than assuming.
3. Open the relevant guide(s) before producing any output.

## Folder layout

```text
embeddings-runtime-stinger/
├── SKILL.md                                     (this file, master index)
├── guides/
│   ├── 00-principles.md                         (stack-neutral non-negotiables, severity rubric, cross-Bee handoffs)
│   ├── 00-selection-matrix.md                   (hosted vs self-hosted; OpenAI vs Cohere vs Voyage; quick decision table)
│   ├── 01-batching.md                           (batch sizing, rate limits/backoff, discounted async batch lanes)
│   ├── 02-caching.md                            (cache key design, TTL vs event-driven invalidation, cold-start/single-flight)
│   ├── hosted-01-openai.md                      (text-embedding-3-small/large: dims, pricing, dimensions param, no input_type)
│   ├── hosted-02-cohere.md                      (embed-v3/v4: required input_type, output_dimension, embedding_types)
│   ├── hosted-03-voyage.md                      (voyage-4 family: input_type, Matryoshka + quantization, open-weight voyage-4-nano)
│   ├── local-daemon-01-lifecycle.md             (self-hosted: warmup, batching, shared install, crash recovery)
│   ├── local-daemon-02-ipc-protocol.md          (self-hosted: Unix-socket NDJSON protocol; framing; handshake; failure modes)
│   ├── local-daemon-03-model-selection.md       (self-hosted: Hivemind-scoped model rubric, worked example of 00-selection-matrix)
│   ├── local-daemon-04-quantization-and-footprint.md (self-hosted: q8 vs fp16/fp32 weight quantization for the CPU daemon)
│   ├── local-daemon-05-embeddings-vs-bm25.md     (self-hosted: the on-vs-off decision; BM25/ILIKE lexical fallback)
│   ├── local-daemon-06-local-vs-hosted.md        (self-hosted: Hivemind-specific worked example of local vs hosted)
│   └── local-daemon-07-schema-and-columns.md     (self-hosted: EMBEDDING_DIMS=768; FLOAT4[] columns; Deep Lake schema event)
├── examples/
│   ├── daemon-warmup-and-ipc.md                 (warm the local daemon, send a batch over the socket, read NDJSON back)
│   ├── embedding-model-comparison.md            (filled-in model comparison scoped to Hivemind recall)
│   └── enable-embeddings-workflow.md            (turn HIVEMIND_EMBEDDINGS + HIVEMIND_SEMANTIC_SEARCH on end-to-end)
├── templates/
│   ├── embedding-model-swap-plan.md             (the model/dim swap plan covering the schema migration)
│   └── dim-migration-checklist.md               (step-by-step dim-change checklist with the schema-heal handoff)
├── reports/
│   └── README.md                                (describes how past recommendation/audit reports accumulate)
├── references/
│   └── research/
│       ├── distilled-embeddings-runtime.md      (synthesis of the hosted-provider + batching/caching sourcing below)
│       └── raw/                                 (9 archived sources: OpenAI, Cohere, Voyage, transformers.js, caching, batching)
└── research/                                    (the original Hivemind/local-daemon research trail, unchanged)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── internal/
    │   └── command-brief-notes.md
    └── external/
        ├── nomic-embed-text-v1.5.md
        ├── q8-quantization-tradeoffs.md
        ├── transformers-js-runtime.md
        ├── deeplake-vector-columns.md
        ├── embedding-model-landscape.md
        └── local-vs-hosted-embeddings.md
```

## Canonical defaults

Two default tables: one for the self-hosted local-daemon implementation (unchanged from the original Hivemind scope), one for hosted-provider selection on this repo's general stack.

### Self-hosted local-daemon defaults (Hivemind implementation)

| Decision | Recommended default | Rationale |
|---|---|---|
| Embeddings engine | **@huggingface/transformers ^3** (optional dep) | Pure JS/WASM runtime; runs in-process via a daemon; no native build needed |
| Embedding model | **nomic-ai/nomic-embed-text-v1.5** | Strong retrieval quality at 768 dim; the dim the Hivemind schema is built around |
| Quantization | **q8** | Best footprint/latency/quality balance for CPU inference; ~600MB on-disk install |
| Dimension | **768** (`EMBEDDING_DIMS`) | Locked to the Deep Lake `FLOAT4[]` columns; changing it is a schema event |
| Default state | **OFF** | `HIVEMIND_EMBEDDINGS` and `HIVEMIND_SEMANTIC_SEARCH` both off; recall falls back to BM25/ILIKE |
| Daemon transport | **Unix-socket NDJSON IPC** | `protocol.ts` + `client.ts`; one warm process, batched requests |

See `guides/local-daemon-*.md` for the full detail.

### Hosted-provider defaults (general, this repo's stack)

| Decision | Recommended default | Rationale |
|---|---|---|
| Starting point | **A hosted provider** (OpenAI or Voyage) | Zero ops burden, minutes to first call; see `guides/00-selection-matrix.md` |
| Provider to start with | **OpenAI `text-embedding-3-small`** | Simple symmetric call shape (no `input_type` discipline to get wrong), competitive pricing |
| Move to self-hosted when | A **measured** high-volume, predictable workload makes per-token cost a real line item, or text cannot leave the machine | Not a hunch; see the escape-hatch framing in `guides/00-selection-matrix.md` |
| Dimension | **Match the target column, prefer Matryoshka truncation over a different model** | All three hosted providers and nomic-embed-text-v1.5 support request-time or post-hoc truncation |
| Batching | **Batch to the provider's per-call limit for bulk work; use the discounted async batch lane for backfills** | Network round-trip, not inference, dominates embedding-call latency |
| Caching | **Always, for any pipeline that re-processes overlapping content** | Embeddings are a pure function of `(model, version, text)`; caching is safe and close to free to add |

## Severity rubric

Used to classify findings when auditing an existing embeddings setup, on any provider or runtime. Full version in `guides/00-principles.md`; summary:

- **Must-fix:** embedding dimension does not match the target column/collection width; embeddings written with one model then queried as if from another; a dimension change shipped without the schema migration path; a hosted-provider asymmetric `input_type` (Cohere `search_document`/`search_query`, Voyage `document`/`query`) used inconsistently between write and query paths.
- **Should-refactor:** embeddings turned on with no measured recall lift over the lexical fallback; a self-hosted daemon spawned per-request instead of warmed once; a hosted API called per-item instead of batched; no embedding cache on a pipeline that repeatedly re-processes overlapping content; quantization or footprint heavier than justified.
- **Style / nice-to-have:** no crash-recovery or retry handling on the embedding call path; warmup or rate-limit backoff not surfaced as an expected cost; model or provider choice undocumented.

## Cross-Bee handoffs

Surface these explicitly rather than attempting them inline:

- **`vector-store-stinger` / `vector-store-worker-bee`** for the actual schema/column mechanics when a dimension change forces a migration (pgvector column resize on this repo's default stack, or Deep Lake schema-heal on a Hivemind-style project). This Bee decides the dimension and writes the swap plan; `vector-store-worker-bee` executes the schema event.
- **`security-worker-bee`** if a hosted embedding provider is considered and an API key or data-egress review is needed.
- **`library-worker-bee`** for PRD authorship when turning embeddings on, or a model/provider swap, needs to be documented as a feature requirement.

---

*Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
