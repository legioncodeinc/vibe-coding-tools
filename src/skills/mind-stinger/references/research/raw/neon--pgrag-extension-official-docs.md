# Neon pgrag extension: full RAG pipeline in SQL

**Title:** pgrag - Neon Docs
**URL:** https://neon.com/docs/extensions/pgrag
**Fetched:** 2026-08-14
**Source type:** Official Neon documentation
**Covers:** Neon's experimental `pgrag` extension: text extraction, chunking, local embedding/reranking, and chat completion, all callable from SQL, layered on top of pgvector

## What the page says

`pgrag` is an experimental Postgres extension (status: experimental, requires `SET neon.allow_unstable_extensions='true'` and a dedicated Neon project) that runs an end-to-end RAG pipeline in SQL. It depends on `pgvector` for storage (`create extension rag cascade` pulls in `vector` automatically). Functions provided:

- **Text extraction:** `rag.text_from_pdf(bytea)`, `rag.text_from_docx(bytea)`, `rag.markdown_from_html(text)`.
- **Chunking:** `rag.chunks_by_character_count(text, max_chars, overlap)`, `rag_bge_small_en_v15.chunks_by_token_count(text, max_tokens, overlap)`.
- **Local embedding (no external API call):** `rag_bge_small_en_v15.embedding_for_passage(text) -> vector(384)` and `.embedding_for_query(text) -> vector(384)`, running a 33M-parameter `bge-small-en-v1.5` model locally on the Postgres server via `ort`/`fastembed`.
- **Remote embedding (via API):** `rag.openai_text_embedding_3_small(text) -> vector(1536)`.
- **Local reranking:** `rag_jina_reranker_v1_tiny_en.rerank_distance(text, text) -> real`, a 33M-parameter `jina-reranker-v1-tiny-en` model, also running locally.
- **Chat completion (remote API call from SQL):** `rag.openai_chat_completion(json) -> json`.

The documented end-to-end query pattern chains vector recall, local rerank, and a chat completion into one SQL statement:

```sql
with ranked as (
  select id, doc_id, chunk,
    embedding <=> rag_bge_small_en_v15.embedding_for_query(:'query') as cosine_distance
  from embeddings
  order by cosine_distance limit 10
),
reranked as (
  select *, rag_jina_reranker_v1_tiny_en.rerank_distance(:'query', chunk)
  from ranked
  order by rerank_distance limit 5
)
select rag.openai_chat_completion(json_object(
  'model': 'gpt-4o-mini',
  'messages': json_array(
    json_object('role': 'system', 'content': '...'),
    json_object('role': 'user', 'content': '...' || string_agg(chunk, E'\n\n') || '...')
  )
)) -> 'choices' -> 0 -> 'message' -> 'content' as answer
from reranked;
```

## Why this matters for this stinger

`pgrag` is explicitly experimental and Neon-specific, so it is not the recommended default retrieval path in this stinger's guides (the default remains: application-layer embedding call + pgvector storage + application-layer rerank, matching the pattern already documented in `vector-store-stinger`'s `pgvector-*` guides). It is documented here as a fact worth knowing about, not a recommendation, because it demonstrates that Neon Postgres now supports local (in-database) embedding and reranking models as a genuine option, which materially changes the "you always need an external embedding/rerank API call" assumption baked into the old Qdrant+Cohere guide. Any future decision to move embedding/rerank in-database for cost or latency reasons should read this extension first.

## Relevance to this stinger

Cited in `guides/00-selection-and-defaults.md` as a forward-looking note (not the default path), and as a fact-check against blanket claims that vector retrieval always requires an external embedding/rerank vendor call.
