# research-plan.md: mind-stinger

The search queries executed against vendor docs and primary sources during the initial stinger forge. Each query → one dated `2026-04-25-<slug>.md` note. Plus the Vectara NAACL 2025 chunking note as carried-over universal research.

---

## Search queries executed during the initial stinger forge

| # | Query | Note |
|---|---|---|
| 1 | "Qdrant HNSW tuning 2026 best practices m ef_construct" | `2026-04-25-qdrant-hnsw-tuning.md` |
| 2 | "Qdrant strict_mode_config payload index production" | `2026-04-25-qdrant-strict-mode.md` |
| 3 | "Qdrant per-tenant collection scaling 10000 tenants" | `2026-04-25-qdrant-per-tenant-scaling.md` |
| 4 | "Cohere rerank-v3.5 two-stage retrieval performance benchmark" | `2026-04-25-cohere-rerank-v3-5.md` |
| 5 | "Cohere embed-english-v3.0 production patterns" | `2026-04-25-cohere-embed-english-v3.md` |
| 6 | "OpenRouter Llama 3.3 70B production patterns rate limits" | `2026-04-25-openrouter-llama-production.md` |
| 7 | "Llama 3.1 8B classification temperature 0 routing" | `2026-04-25-llama-3-1-8b-routing.md` |
| 8 | "Llama 3.2 11B vision prompt format multimodal" | `2026-04-25-llama-3-2-vision.md` |
| 9 | "Three-tier memory architecture LLM agent 2026" | `2026-04-25-three-tier-memory-architecture.md` |
| 10 | "Reciprocal Rank Fusion hybrid retrieval Qdrant" | `2026-04-25-reciprocal-rank-fusion.md` |
| 11 | "Microsoft GraphRAG Qdrant Neo4j hybrid retrieval" | `2026-04-25-microsoft-graphrag.md` |
| 12 | "Vectara NAACL 2025 fixed-size chunking benchmark" | `2026-04-25-vectara-naacl-2025-chunking.md` (carried over) |
| 13 | "Anthropic contextual retrieval implementation 2026" | `2026-04-25-anthropic-contextual-retrieval.md` |
| 14 | "LLM-as-judge calibration LLama 3.1 8B" | `2026-04-25-llm-as-judge-calibration.md` |
| 15 | "Sycophancy detection LLM coaching agent 2026" | `2026-04-25-sycophancy-detection.md` |
| 16 | "Deepgram STT batch vs streaming production" | `2026-04-25-deepgram-stt-batch.md` |
| 17 | "Valkey vs Redis 2026 working memory TTL" | `2026-04-25-valkey-vs-redis.md` |
| 18 | "Multimodal RAG image video transcript indexing 2026" | `2026-04-25-multimodal-rag.md` |

---

## Carried over from retired mind-stinger

- `2026-04-25-vectara-naacl-2025-chunking.md`: load-bearing finding for fixed-size chunking. Verbatim copy of the original with product-specific notes appended.

---

## How research notes are structured

Each note includes:

- **Source:** primary URL (vendor docs preferred; vendor blogs flagged as `vendor-directional`).
- **Retrieved:** date.
- **Status:** `load-bearing` (cited as a hard rule in `guides/00-principles.md` or a stack-enforcement decision) OR `informational` (context only).
- **TL;DR.**
- **Key facts.**
- **Numbers tag:** `benchmarked` (paper / dataset / reproduction available) OR `vendor-directional` (vendor blog claim, treat as hypothesis to verify).
- **Implications for the deploying product / mind-stinger guides.**
- **Caveats / what the source does NOT say.**

---

## Open questions (gaps)

- See `research/open-questions.md` and `research/gaps.md`.
