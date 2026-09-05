# Multimodal RAG: Image / Video Transcript Indexing

**Source:** the deploying product's own `multimodal-media-pipeline.md` doc; multimodal RAG patterns from public industry posts (2024-2026).
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING** for the deploying product's design. Cited in `guides/14-multimodal-pipeline.md`.
**Numbers tag:** implementation-level numbers (chunk sizes, p-limit values) are tuned internally.

---

## TL;DR

the deploying product's multimodal RAG indexes:

- **Images** (sync): vision-described, embedded, indexed in `media-{tenantId}` with `content_type: "media_attachment"`.
- **Videos** (async): transcript chunks (Deepgram) + frame descriptions (vision model) + recursive summary, all indexed in `media-{tenantId}`.

Coaching context queries `media-{tenantId}` alongside `knowledge-{tenantId}` and `conversations-{tenantId}`. Media context appears as `[RELEVANT MEDIA CONTEXT]` block in the system prompt.

---

## Why text embeddings for vision content (not visual embeddings)

the deploying product uses **text embeddings of vision-generated descriptions**, not visual embeddings (CLIP, etc.). Reasoning:

1. **Cohere `embed-english-v3.0` is the canonical embedder**: adopting CLIP would bifurcate the embedding stack.
2. **Coaching context is text-shaped**: the LLM consumes text in the system prompt, not vision tokens.
3. **OCR + entity extraction** in the description prompt covers most coaching-relevant signals.
4. **Frame relevance** is filtered by the vision model's own `relevance` field (`high|medium|low`), so we don't need visual similarity to dedupe similar frames.

A multimodal embedder (e.g., Voyage's multimodal models, or a CLIP-style embedder) would be considered if visual similarity becomes a primary retrieval signal; currently it isn't.

---

## Three content types in `media-{tenantId}`

Per `guides/09-vector-payload-schema.md §2`:

- `media_attachment`: single image description (from sync image pipeline).
- `video_transcript_chunk`: 512-token chunks from a video transcript.
- `video_frame_description`: vision-model description of a video keyframe.
- `video_summary`: recursive summary of the full video (one point per video).

Each has a `pts_time` (video only) for timestamp alignment.

---

## The `MediaSummarizer` recursive map-reduce

For videos longer than 4,000 chars of transcript:

```
chunks = splitIntoChunks(transcript, 4000)  // paragraph-boundary splits
chunkSummaries = parallel(chunks.map(summarizeChunk))
combined = chunkSummaries.join("\n\n---\n\n")

if combined.length ≤ 4000:
  return summarizeChunk(combined)
else:
  return summarizeTranscript(combined, context)  // recursive — always converges
```

Uses `fast` model (Llama 3.1 8B) at `temperature: 0.2`, `max_tokens: 500` per chunk. Cost-optimized for factual extraction.

---

## Why frame descriptions, not just transcripts

Audio doesn't capture:

- Whiteboard content.
- Slide text (OCR).
- Visual cues the speaker references ("look at this chart").

Including high-relevance frame descriptions alongside transcript chunks lets the coaching agent retrieve and reference visual content that's not in the audio.

p-limit 10 parallel batches of 5 frames each. Vision model context: frame image + transcript utterances within ±30s.

---

## Storage retention

| Data | Retention | Why |
|---|---|---|
| Raw video (DO Spaces) | Deleted after processing | Storage cost |
| Transcript (DO Spaces) | 30 days | Available for download |
| Summary (DO Spaces) | 30 days | Same |
| Qdrant vectors | Until GDPR deletion | Episodic memory tier |
| `MediaAttachment` Postgres | Indefinite | Audit trail |

---

## Limitations of the current design

- **Single-speaker assumption.** Diarization not enabled. Multi-speaker content (panel, interview) gets a single-blob transcript.
- **English-only.** Aligns with the rest of the stack.
- **No real-time streaming.** Async only.
- **Vision model is open-weights (Llama 3.2 11B vision).** For deep visual reasoning (chart numerical extraction), a stronger vision model would lift quality. SA can swap the slot.

---

## Implications

- Adding a multimodal embedder (CLIP, Voyage multimodal) requires substitution policy.
- Adding diarization is a feature flag + Deepgram config change; not a substitution.
- Adding streaming STT is a substitution (out-of-scope today).
- See `guides/14-multimodal-pipeline.md`.
