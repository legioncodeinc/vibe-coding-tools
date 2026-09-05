# 12: Three-Tier Memory

> **Alternative stack for the tier storage engines.** The three-tier concept (ephemeral working memory, durable session memory, semantic long-term memory) is stack-neutral; see `guides/00-selection-and-defaults.md`. This guide's Valkey working-tier and Qdrant long-term-tier are the alternative stack's engines. For this repo's default, long-term memory retrieval runs on Neon plus pgvector via `vector-store-stinger`; working memory still needs a fast ephemeral store (Valkey remains a reasonable choice even outside the rest of the alternative stack).

Valkey working / Postgres session / Qdrant + graph long-term. `generateSessionSummary()`, temporal decay (`memory-decay.ts`), `MediaSummarizer`. The boundaries are load-bearing.

> **Doc reference:** `library/knowledge/private/ai/memory-summarization.md` is canonical.

---

## 1. The three tiers

```
┌────────────────────────────────────────────────────┐
│  TIER 1: WORKING MEMORY                            │
│  Storage: Valkey (Redis-compatible) — TTL 7200s   │
│  Key:     session:working:{sessionId}             │
│  Content: Full JSON-serialised SessionTurn[]      │
│  Scope:   Current session only                    │
│  Why Valkey: ms access; no embedding cost;        │
│  auto-expires; no semantic search needed          │
└────────────────────────────────────────────────────┘
         │ compaction at 40 turns
         ▼
┌────────────────────────────────────────────────────┐
│  TIER 2: EPISODIC MEMORY                           │
│  Storage: Qdrant conversations-{tenantId}          │
│  content_type: "session_summary"                  │
│  Content:    Structured session summaries         │
│  Retrieval:  Semantic search filtered by user_id │
│  Decay:      0.8× after 7d, 0.6× after 30d       │
└────────────────────────────────────────────────────┘
         │ consolidation (planned worker)
         ▼
┌────────────────────────────────────────────────────┐
│  TIER 3: SEMANTIC MEMORY                           │
│  Storage: Qdrant conversations-{tenantId}          │
│  content_type: "semantic_fact"                    │
│  Content:    Distilled long-term facts            │
│  Retrieval:  Semantic search filtered by user_id │
│  Decay:      0.9× (ages slowly — distilled truths)│
└────────────────────────────────────────────────────┘
```

**What goes to Postgres (not Qdrant):** raw session messages (`AiChatSession.messages`). They remain in Postgres for audit and debugging. `AiChatSession.summary` stores the most recent session summary in plain text.

---

## 2. The boundary rules: load-bearing

| Don't | Why |
|---|---|
| Put session state in working memory | Valkey is ephemeral with TTL. State that needs durability must be in Postgres. |
| Put episodic vectors in Postgres | No semantic search. Postgres is the audit log + structured-summary store. |
| Put raw turns in Qdrant | Postgres is the source of truth for raw conversation history. Qdrant stores summaries + facts only. |
| Index `business_profile` doc into `conversations-*` | It belongs in `knowledge-{tenantId}` (the doc is org-style content, not episodic). |
| Index `KnowledgeDocument` chunks into `conversations-*` | Same as above. |
| Use `applyDecay()` at index time | Decay is computed at QUERY time from `timestamp`. Stored `decay_weight` is for debugging only. |

Each of these is a **must-fix**.

---

## 3. Tier 1: Working memory (Valkey)

### Schema

```typescript
interface SessionTurn {
  role:                "user" | "assistant";
  content:             string;
  timestamp:           string;       // ISO 8601
  fromVoice?:          boolean;      // transcribed from voice
  agentType?:          string;       // which coach produced this
  attachmentFilename?: string;
  attachmentUrl?:      string;
}
```

Stored under `session:working:{sessionId}` as JSON array.

### TTL

`TTL_SECONDS = 7200` (2 hours). On expiry, session transitions to `RESUMED` state and `reconstructSession()` rebuilds context from Postgres + Qdrant.

### API

```typescript
getWorkingMemory(sessionId): Promise<SessionTurn[] | null>   // null on miss
setWorkingMemory(sessionId, turns): Promise<void>             // resets TTL
appendTurn(sessionId, turn): Promise<void>                    // read-modify-write
clearWorkingMemory(sessionId): Promise<void>
```

`appendTurn` is read-modify-write, not atomic. At single-user session scale, race conditions are not a concern. **If you're tempted to add a Lua script for atomic append, validate the use case first.** The current design is intentional.

### Conversation window

`buildConversationWindow(turns, tokenBudget = 12_000)` selects which turns to include in the LLM messages array. Algorithm:

```
MAX_ALWAYS_INCLUDE = 10  // most recent turns always

1. Always include the 10 most recent turns
2. Fill remaining budget with older turns, most-recent-first, until char budget exhausted
3. Return turns in chronological order
```

Heuristic: 4 chars ≈ 1 token. Token-counting libraries (tiktoken etc.) are unnecessary at the precision we need.

---

## 4. Tier 2: Episodic memory (Qdrant + Postgres)

### Generation: `generateSessionSummary()` two-step pipeline

**Step 1: Structured extraction** (`fast` model, `temperature: 0.1`, `response_format: json_object`):

```json
{
  "goals_discussed":     [],
  "decisions_made":      [],
  "commitments_made":    [],
  "blockers_identified": [],
  "next_session_focus":  ""
}
```

Facts are extracted from the transcript before narrative generation to prevent hallucination.

**Step 2: Narrative summary** (`chat` model, `temperature: 0.4`):

200-300 word, third-person past tense. Grounded in Step 1's structured output. Falls back to direct transcript summarization if Step 1 fails.

Minimum: 2 user messages. Shorter sessions return `"Session too brief to summarize."`

### Storage

- **Postgres:** `AiChatSession.summary` (latest narrative).
- **Qdrant `conversations-{tenantId}`:** vector with `content_type: "session_summary"`, `memory_tier: "episodic"`, `consolidated: false`.

### Retrieval

```
EPISODIC_CANDIDATES = 10   // ANN candidates
EPISODIC_TOP_N      = 3    // top after Cohere rerank
filter: tenant_id, user_id, content_type IN ["session_summary", "episodic_summary"]
```

Appended to coaching context as `[COACHING HISTORY]` block.

---

## 5. Tier 3: Semantic memory

`content_type: "semantic_fact"`. Distilled long-term facts about the user (e.g., "Member's primary blocker is pricing, not positioning"). Generated by a consolidation worker (currently planned, not active).

`memory_tier: "semantic"` triggers the `0.9×` decay multiplier, slowly aging.

---

## 6. Temporal decay: `applyDecay()`

```typescript
applyDecay(results: QdrantResultWithPayload[], now: Date = new Date()): DecayedResult[]
```

| Age | Multiplier |
|---|---|
| ≤ 7 days | 1.0× |
| 8-30 days | 0.8× |
| 31-90 days | 0.6× |
| > 90 days | 0.4× |
| `memory_tier === "semantic"` (any age) | 0.9× |

Reads `timestamp` and `memory_tier` from payload. Returns sorted by `finalScore = score × multiplier` descending.

**Used at query time, not index time.** The stored `decay_weight` field is for debugging only: always recompute.

Used in `reconstructSession()` and other paths where age matters.

---

## 7. `MediaSummarizer`: recursive map-reduce

`summarizeTranscript()` in `media-summarizer.ts`:

```typescript
if (transcript.length ≤ MAX_CHUNK_CHARS = 4000):
  return summarizeChunk(transcript, context)

chunks = splitIntoChunks(transcript, 4000)  // paragraph-boundary splits
chunkSummaries = await Promise.all(chunks.map(chunk => summarizeChunk(chunk, context)))
combined = chunkSummaries.join("\n\n---\n\n")

if combined.length ≤ 4000:
  return summarizeChunk("Following are summaries of consecutive segments...\n\n" + combined)
else:
  return summarizeTranscript(combined, context)  // recursive — always converges
```

`splitIntoChunks()` splits at paragraph boundaries (`\n\n+`), preserving semantic coherence.

**Model:** `fast` model (`Llama 3.1 8B`) at `temperature: 0.2`, `max_tokens: 500` per chunk. Keeps cost low without compromising factual extraction.

---

## 8. Sycophancy mitigation: measured, not vibed

LLMs become measurably more agreeable over long-running user profiles. For a coaching application, this is an existential quality risk.

**Countermeasures:**

1. **Anti-sycophancy `[COACHING_QUALITY]` block**: hardcoded in `composeSystemPrompt()`, injected every turn.
2. **`computeAgreementRate()`**: scans responses for agreement vs challenge patterns. Returns 0.0-1.0 (higher = more sycophantic). Written to `AiTrace.agreementScore`.

If sycophancy trends up, the lever is the prompt cascade or coach personality, NOT the temperature. See `guides/17-evaluation-discipline.md`.

---

## 9. Storage decision table

| Content | Primary store | Secondary | Retention |
|---|---|---|---|
| Raw session messages | Postgres `AiChatSession.messages` | None | Indefinite (audit) |
| Session summary text | Postgres `AiChatSession.summary` | Qdrant `conversations-*` | Postgres: indefinite; Qdrant: depends on decay |
| Episodic memories | Qdrant `conversations-*` (`session_summary`) | None | Until consolidated or GDPR-deleted |
| Semantic facts | Qdrant `conversations-*` (`semantic_fact`) | None | Indefinite (GDPR-deletable) |
| Knowledge docs | Postgres `KnowledgeDocument` | Qdrant `knowledge-*` | Per-document lifecycle |
| Media transcripts | DO Spaces | Qdrant `media-*` | Spaces: 30 days; Qdrant: 90 days |
| AI traces | Postgres `AiTrace` | None | 30 days active (archive planned) |

---

## 10. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Raw turns indexed into Qdrant | must-fix | this guide §2 |
| Episodic vectors persisted in Postgres (not Qdrant) | must-fix | this guide §2 |
| `applyDecay()` used at index time | must-fix | this guide §6 |
| Decay multipliers drifted from §6 table | must-fix | `memory-summarization.md §6` |
| `generateSessionSummary()` skipping the structured-extraction step | must-fix | this guide §4 |
| Session summary < 200 words or > 300 words consistently | should-refactor | this guide §4 |
| `MediaSummarizer` using `chat` model (instead of `fast`) | should-refactor (cost) | this guide §7 |
| Working memory TTL drifted from 7200s | must-fix | this guide §3 |
| `AiChatSession.summary` not updated after compaction | must-fix | this guide §4 |
