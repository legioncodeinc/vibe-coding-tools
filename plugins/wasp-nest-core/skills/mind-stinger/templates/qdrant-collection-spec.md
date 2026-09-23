# Template: Qdrant Collection Spec

Use this shape when proposing a new Qdrant collection or when reviewing an existing one in a RAG audit.

---

## Identification

- **Collection name pattern:** `{type}-{tenantId}` (always, never global, never per-user)
- **Where defined:** `COLLECTION_NAMES` in `lib/qdrant-client.ts`
- **Created by:** `ensureAllCollectionsForTenant(tenantId)` at server startup + new-tenant creation

---

## Vector configuration

| Property | Value |
|---|---|
| `size` | 1024 (Cohere `embed-english-v3.0`) |
| `distance` | `Cosine` |
| `hnsw_config.m` | 16 |
| `hnsw_config.ef_construct` | 200 |
| `on_disk` | `false` |

---

## Strict mode + optimizers

| Property | Value |
|---|---|
| `strict_mode_config.enabled` | `true` |
| `optimizers_config.default_segment_number` | 4 (match Qdrant node CPU count) |

---

## Payload index list

| Field | Schema | Required? | Why indexed |
|---|---|---|---|
| `tenant_id` | keyword | yes | Hard security boundary |
| `user_id` | keyword | yes | User isolation |
| `session_id` | keyword | yes | Thread-scoped retrieval |
| `thread_id` | keyword | yes | Future multi-thread support |
| `agent_type` | keyword | yes | Agent-aware retrieval |
| `content_type` | keyword | yes | Content-type filtering |
| `source_document_id` | keyword | yes | Bulk deletion by source doc |
| `timestamp` | datetime | yes | Temporal range queries |
| (media-* only) `media_attachment_id` | keyword | yes (media only) | Bulk deletion by media file |

**Stored, not indexed:** `memory_tier`, `consolidated`, `decay_weight`, `text`, `title`, `document_type`, `chunk_index`, `chunk_total`, `embedding_model_version`, `pts_time`, `frame_relevance`, `media_type`.

---

## Required mandatory payload fields (every point)

```typescript
{
  tenant_id:               string,        // INDEXED — hard security boundary
  user_id:                 string,        // INDEXED — "__system__" for tenant-wide content
  session_id:              string | null, // INDEXED — links to AiChatSession.id
  thread_id:               string | null, // INDEXED — currently equals session_id
  agent_type:              string,        // INDEXED — coach type or "system"
  content_type:            string,        // INDEXED — see content_type table
  timestamp:               string,        // INDEXED (datetime) — ISO 8601
  embedding_model_version: string,        // STORED — "cohere-embed-english-v3.0"
  source_document_id:      string,        // INDEXED — FK to Postgres source
}
```

---

## Collection creation checklist

- [ ] Create with HNSW (`m: 16, ef_construct: 200, strict_mode: true`).
- [ ] Add to `COLLECTION_NAMES` in `qdrant-client.ts`.
- [ ] Add payload indexes via `ensureCollection()` (or extend `COMMON_INDEXES`).
- [ ] Add to `ensureAllCollectionsForTenant()` parallel call.
- [ ] Add to `deleteUserVectors()` GDPR procedure.
- [ ] Document in `library/knowledge/private/ai/rag-vector-strategy.md §2` collection inventory.
- [ ] Add `content_type` value(s) for this collection to `library/knowledge/private/ai/vector-payload-schema.md §2`.

---

## Sample collection creation call

```typescript
await client.createCollection(`{type}-${tenantId}`, {
  vectors: {
    size:        VECTOR_SIZE,           // 1024
    distance:    "Cosine",
    hnsw_config: { m: 16, ef_construct: 200 },
    on_disk:     false,
  },
  strict_mode_config: { enabled: true },
  optimizers_config:  { default_segment_number: 4 },
});

// Then create indexes (idempotent, wait: false)
for (const idx of COMMON_INDEXES) {
  await client.createPayloadIndex(`{type}-${tenantId}`, {
    field_name:   idx.field,
    field_schema: idx.schema,
    wait:         false,
  });
}
```

---

## Filter shape: every query MUST include `tenant_id`

```typescript
// User-scoped query (most common):
filter: {
  must: [
    { key: "tenant_id", match: { value: tenantId } },
    { key: "user_id",   match: { value: userId   } },
  ],
}

// Tenant-wide query (knowledge / academy):
filter: {
  must: [
    { key: "tenant_id", match: { value: tenantId } },
  ],
}

// Add content_type filter when narrowing to specific types:
filter: {
  must: [
    { key: "tenant_id",    match: { value: tenantId } },
    { key: "user_id",      match: { value: userId } },
    { key: "content_type", match: { any: ["session_summary", "episodic_summary"] } },
  ],
}
```

**Filtering on a field that's not in the index list above is rejected by `strict_mode_config: { enabled: true }`.** Add the index first.
