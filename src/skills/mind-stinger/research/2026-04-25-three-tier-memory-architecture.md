# Three-Tier Memory Architecture for LLM Agents

**Source:** the deploying product's own design documented in `library/knowledge/private/ai/memory-summarization.md` and `library/knowledge/private/ai/context-continuity.md`. Pattern echoes recent (2024-2026) academic work on long-context agents and the MemGPT / generative-agents literature.
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING** for the deploying product's design. Cited in `guides/00-principles.md §9` and `guides/12-three-tier-memory.md`.
**Numbers tag:** implementation-level numbers (40-turn, 2h TTL, decay schedule) are benchmarked internally; the three-tier shape itself is design pattern, not benchmark.

---

## TL;DR

LLM agents in long-running coaching relationships face context overflow + lost-in-the-middle degradation. The three-tier architecture splits memory by access pattern + retention:

| Tier | Storage | TTL / Retention | Access pattern |
|---|---|---|---|
| **Working** | Valkey `session:working:{sessionId}` | 7200s (2h) | Direct read; current session |
| **Session** | Postgres `AiChatSession.messages` + `summary` | Indefinite | Audit; reconstruction source |
| **Long-term** | Qdrant `conversations-{tenantId}` (`session_summary`, `episodic_summary`, `semantic_fact`) | Until consolidated or GDPR-deleted | Semantic search filtered by `user_id` |

---

## Why three tiers (not one, not two)

- **One tier (everything in one store):** either Valkey (no durability), Postgres (no semantic search), or Qdrant (wrong shape for raw transcripts), none satisfy all access patterns.
- **Two tiers (working + long-term):** loses the audit log; reconstruction has no canonical source.
- **Three tiers:** working is fast; session is durable; long-term is semantically searchable. Each tier's storage matches its access pattern.

---

## the deploying product's specific calibration

| Parameter | Value | Source |
|---|---|---|
| Working memory TTL | 7200s (2h) | `session-memory.ts` `TTL_SECONDS` |
| Compaction threshold | 40 turns | `session-compactor.ts` `COMPACTION_THRESHOLD` |
| Compact turns | 30 (turns 1-30 summarized) | `COMPACT_TURNS` |
| Retain turns | 10 (turns 31-40 kept in Valkey) | `RETAIN_AFTER_COMPACT` |
| Compaction lock TTL | 600s (10 min) | `WATCHDOG_TTL` |
| Compaction max retries | 3 | `MAX_RETRIES` |
| Episodic decay (≤ 7d) | 1.0× | `memory-decay.ts` |
| Episodic decay (8-30d) | 0.8× | same |
| Episodic decay (31-90d) | 0.6× | same |
| Episodic decay (> 90d) | 0.4× | same |
| Semantic decay (any age) | 0.9× | same |

Adjusting any of these requires `library/knowledge/private/ai/memory-summarization.md` or `context-continuity.md` update + measured eval pass.

---

## The boundary rules: load-bearing

| Don't | Why |
|---|---|
| Put session state in working memory | Valkey is ephemeral (TTL). State that needs durability → Postgres. |
| Put episodic vectors in Postgres | No semantic search. Postgres is audit + structured-summary store. |
| Put raw turns in Qdrant | Postgres is the source of truth for raw history. Qdrant stores summaries + facts. |
| Use `applyDecay()` at index time | Decay is computed at QUERY time from `timestamp`. Stored `decay_weight` is debugging only. |

Each is **must-fix**.

---

## The 40-turn calibration

40 turns (~20 exchanges) ≈ 6,000-10,000 tokens of raw history. Fits alongside system prompt (~2K tokens) + knowledge context (8K char ~ 2K tokens) within current model windows (Llama 3.3 70B: 128K). Beyond 40 turns, "lost in the middle" attention degradation begins.

The fire-and-forget compaction job runs in the background: turn 41 is accepted and responded to normally while turns 1-30 are summarized into Qdrant.

---

## Implications

- Three-tier boundaries are load-bearing. Mixing tiers is **must-fix**.
- the deploying product's specific calibration (TTLs, thresholds, decay schedule) is documented and tunable but not silently editable.
- See `guides/12-three-tier-memory.md`, `guides/13-context-continuity.md`.
