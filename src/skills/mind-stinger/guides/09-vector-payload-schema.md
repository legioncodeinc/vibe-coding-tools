# 09: Vector Payload Schema

> **Alternative stack.** This guide documents Qdrant's payload/index model. For this repo's default (Neon Postgres plus pgvector), the equivalent concern is column and index design on the `chunks` table, owned by `vector-store-stinger`. See `guides/00-selection-and-defaults.md`.

Every payload field on every Qdrant point. Mandatory fields, indexing decisions, and the `strict_mode_config` enforcement.

> **Doc reference:** `library/knowledge/private/ai/vector-payload-schema.md` is canonical.

---

## 1. Design principles

Every field exists for one of three reasons:

1. **Used in a Qdrant filter** → must be **indexed** (`keyword` or `datetime`).
2. **Returned in results, used at app layer** → **stored, not indexed**.
3. **Required for audit / compliance / debugging** → **stored, not indexed**.

**Adding fields later requires re-indexing all existing vectors** if the field is mandatory. Adding an index to an unindexed field can be done at any time without re-indexing (Qdrant builds in background).

**Mandatory fields** are present on every point in every collection. **Optional fields** are present only on specific content types.

---

## 2. Mandatory fields (all collections, all points)

### `tenant_id`
- **Type:** Keyword (indexed)
- **Purpose:** Hard security boundary. Always present in every query filter.
- **Note:** Belt-and-suspenders: collection is already tenant-scoped by name (`knowledge-{tenantId}`), but this payload field ensures cross-tenant protection if collection routing breaks.

### `user_id`
- **Type:** Keyword (indexed)
- **Purpose:** User-level isolation. Most agent queries filter on this.
- **Special value:** `"__system__"` for tenant-wide content (knowledge docs, academy lessons) not owned by any user.

### `session_id`
- **Type:** Keyword (indexed)
- **Purpose:** Links to `AiChatSession.id`. Used by thread-scoped agents to restrict retrieval.
- **Null when:** Non-session content (knowledge docs, semantic facts, media uploaded outside a session).

### `thread_id`
- **Type:** Keyword (indexed)
- **Purpose:** Fine-grained thread scoping. Currently equals `session_id`. Field exists to support multi-thread sessions in the future without schema change.

### `agent_type`
- **Type:** Keyword (indexed)
- **Purpose:** Identifies which coaching agent produced this vector.
- **Valid values:** `main_community`, `onboarding`, `level_1`, `level_2`, `level_3`, `offer_doc`, `special_gift_strategist`, `module_goals`, `module_ideal_client`, `module_offer`, `module_positioning`, `module_referral_strategy`, `orchestrator`, `system`

### `content_type`
- **Type:** Keyword (indexed)

| Value | Description | Collection |
|---|---|---|
| `session_summary` | Compressed summary of a completed session | `conversations` |
| `episodic_summary` | Older compressed memories | `conversations` |
| `semantic_fact` | Distilled long-term fact about the user | `conversations` |
| `message_turn` | A single conversation turn | `conversations` |
| `knowledge_doc` | A chunk from a `KnowledgeDocument` | `knowledge` |
| `academy_lesson` | A chunk from an academy lesson | `academy` |
| `media_attachment` | A processed image description | `media` |
| `video_transcript_chunk` | A chunk from a video transcript | `media` |
| `video_frame_description` | Vision model description of a video keyframe | `media` |
| `video_summary` | Recursive summary of a full video | `media` |

### `timestamp`
- **Type:** Datetime (indexed: Qdrant datetime index)
- **Purpose:** When this content was created or when the event it describes occurred. Used for temporal decay scoring at query time.
- **Format:** ISO 8601: `"2026-03-29T18:00:00Z"`

### `embedding_model_version`
- **Type:** Keyword (stored, not indexed)
- **Purpose:** Records which embedding model produced this vector. Required for migration planning.
- **Current value:** `"cohere-embed-english-v3.0"`

### `source_document_id`
- **Type:** Keyword (**indexed**)
- **Purpose:** Foreign key back to the Postgres source record. Used by `removeKnowledgeDocument()` and `removeLessonContent()` to filter-delete all chunks for a specific document.
- **Maps to:** `KnowledgeDocument.id`, `AiChatSession.id`, `MediaAttachment.id`

---

## 3. Memory tier fields (`conversations-{tenantId}` only)

### `memory_tier`
- **Type:** Keyword (stored, not indexed)
- **Values:** `"working"`, `"episodic"`, `"semantic"`
- **Why not indexed:** Only 3 values. Low-cardinality fields provide minimal speedup as payload indexes.

### `consolidated`
- **Type:** Boolean (stored, not indexed)
- **Default:** `false`. Marks episodic memories processed by the semantic consolidation job.

### `decay_weight`
- **Type:** Float (stored, not indexed)
- **Purpose:** Pre-computed relevance multiplier for debugging. Always recompute from `timestamp` at query time using `applyDecay()`; the stored value may be stale.

---

## 4. Content fields

### `text`
- **Type:** String (stored, not indexed)
- **Purpose:** The content of the vector.
- **Note:** Both `text` and `content` field names appear in legacy payloads. Current indexing always uses `text`. Retrieval handles both: `(payload.text ?? payload.content)`.

### `title`
- **Type:** String (stored, not indexed)
- **Purpose:** Document title for knowledge doc chunks. Used in passage formatting: `--- {title} ---\n{text}`.

### `document_type`
- **Type:** String (stored, not indexed)
- **Purpose:** `KnowledgeDocType` value for knowledge doc chunks.

---

## 5. Chunking fields

### `chunk_index`
- **Type:** Integer (stored, not indexed). Zero-based position within source doc.

### `chunk_total`
- **Type:** Integer (stored, not indexed). Total chunks produced from source doc.

---

## 6. Media-specific fields (`media-{tenantId}` only)

### `media_attachment_id`
- **Type:** Keyword (indexed)
- **Purpose:** FK to `MediaAttachment` Postgres. Indexed for bulk-deletion when a media file is deleted.

### `media_type`
- **Type:** Keyword (stored, not indexed). Values: `"image"`, `"video"`.

### `pts_time`
- **Type:** Float (stored, not indexed). For video keyframe vectors: timestamp within the video (seconds).

### `frame_relevance`
- **Type:** Keyword (stored, not indexed). Values: `"high"`, `"medium"`, `"low"`. Vision model's assessment.

---

## 7. The `COMMON_INDEXES` array

Created idempotently by `ensureCollection()`:

```typescript
const COMMON_INDEXES = [
  { field: "tenant_id",          schema: "keyword"             },
  { field: "user_id",            schema: "keyword"             },
  { field: "session_id",         schema: "keyword"             },
  { field: "thread_id",          schema: "keyword"             },
  { field: "agent_type",         schema: "keyword"             },
  { field: "content_type",       schema: "keyword"             },
  { field: "source_document_id", schema: "keyword"             },
  { field: "timestamp",          schema: { type: "datetime" }  },
];

// media-* collections also get:
{ field: "media_attachment_id", schema: "keyword" }
```

Indexes created with `wait: false` (background build).

**Stored, not indexed:** `memory_tier`, `consolidated`, `decay_weight`, `text`, `title`, `document_type`, `chunk_index`, `chunk_total`, `embedding_model_version`, `pts_time`, `frame_relevance`, `media_type`.

---

## 8. `strict_mode_config: { enabled: true }`

This Qdrant feature **rejects filters on unindexed fields** instead of silently scanning. Without it, a filter on an unindexed field would silently full-scan (50-200ms per query on large collections); with it, you get an explicit error.

**Implication:** adding a filter on a new field REQUIRES adding the index first. Order:

1. Add field to indexing code (so existing points start carrying it).
2. Add to `COMMON_INDEXES` and run `ensureCollection()` for affected collections.
3. Backfill existing vectors with the new field.
4. Only then add the filter to a query.

Skipping any step is a **must-fix**.

---

## 9. Full payload examples

### Session summary vector (`conversations-{tenantId}`)

```typescript
{
  // Mandatory
  tenant_id:               "clx9vy200012vu8kj0",
  user_id:                 "clx9vy200012vu8abc",
  session_id:              "clx9vy200012vu8xyz",
  thread_id:               "clx9vy200012vu8xyz",
  agent_type:              "level_1",
  content_type:            "session_summary",
  timestamp:               "2026-03-15T14:30:00Z",
  embedding_model_version: "cohere-embed-english-v3.0",
  source_document_id:      "clx9vy200012vu8xyz",

  // Memory tier
  memory_tier:    "episodic",
  consolidated:   false,
  decay_weight:   0.85,

  // Content
  text: "Session focused on defining ideal client. Member identified SMB owners...",

  // Chunking (1 chunk per summary)
  chunk_index: 0,
  chunk_total: 1,
}
```

### Knowledge document chunk (`knowledge-{tenantId}`)

```typescript
{
  tenant_id:               "clx9vy200012vu8kj0",
  user_id:                 "__system__",
  session_id:              null,
  thread_id:               null,
  agent_type:              "system",
  content_type:            "knowledge_doc",
  timestamp:               "2026-02-01T09:00:00Z",
  embedding_model_version: "cohere-embed-english-v3.0",
  source_document_id:      "clx9vy200012vu8doc",

  memory_tier:  null,
  consolidated: null,
  decay_weight: null,

  title:         "Dream 100 Methodology Overview",
  text:          "The Dream 100 methodology focuses on identifying the top 100...",
  document_type: "methodology",
  chunk_index:   2,
  chunk_total:   8,
}
```

---

## 10. Schema evolution procedure

When adding a new payload field:

1. Add it to `library/knowledge/private/ai/vector-payload-schema.md` first.
2. Decide: indexed (high cardinality + used in filters) or stored-only.
3. If indexed: add `createPayloadIndex()` call to `COMMON_INDEXES`.
4. Add the field to relevant indexing functions (`knowledge-indexer.ts`, `conversation-indexer.ts`, etc.).
5. Backfill existing vectors with a migration script.

**New fields should always be optional (nullable)** to avoid breaking existing vectors. Never add a required field to an existing collection without a backfill.

---

## 11. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Qdrant query missing `tenant_id` filter | must-fix (security) | this guide §2 |
| Qdrant query missing `user_id` filter where user-scoped | must-fix | this guide §2 |
| Filter on unindexed field (rejected by `strict_mode`) | must-fix | this guide §8 |
| `tenant_id` payload missing on indexed point | must-fix | this guide §2 |
| `embedding_model_version` not set on new points | must-fix | this guide §2 |
| `agent_type` value not in the valid-values list | must-fix | this guide §2 |
| `content_type` value not in the valid-values list | must-fix | this guide §2 |
| `timestamp` not ISO 8601 | must-fix | this guide §2 |
| `decay_weight` used at retrieval (instead of `applyDecay()`) | must-fix | this guide §3 |
| Required field added without backfill | must-fix | this guide §10 |
| New filter field added without index first | must-fix | this guide §8 |
