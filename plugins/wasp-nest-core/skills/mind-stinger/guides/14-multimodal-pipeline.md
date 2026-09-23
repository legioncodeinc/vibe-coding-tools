# 14: Multimodal Pipeline

Image / video processors, Deepgram STT, `media-{tenantId}` collection, `MediaSummarizer` recursive map-reduce. Synchronous image path; asynchronous video path.

> **Doc reference:** `library/knowledge/private/ai/multimodal-media-pipeline.md` is canonical.

---

## 1. Processing strategy at a glance

| Media | Processing | Timing | Context injection |
|---|---|---|---|
| **Image** | Vision model describes → embed description | Sync (< 3s) | Injected into current session working memory immediately |
| **Video** | ffmpeg + Deepgram + vision + recursive summary → embed | Async (2-15 min) | Available in next coaching session; placeholder shown immediately |

Upload contexts (all flow through the same pipeline):

| Context | Example | Processing |
|---|---|---|
| `coaching_chat` | Member shares pitch deck screenshot mid-session | Sync image; immediate context injection |
| `profile_asset` | Member uploads intro video to profile | Async video; indexed in member's episodic memory |
| `knowledge_base` | Admin uploads methodology training video | Async video; indexed in `knowledge-{tenantId}` (tenant-wide) |
| `feed_post` | Member attaches image to a win post | Sync image; stored for future coaching retrieval |

---

## 2. Vision provider: OpenRouter

All image and video frame description uses `modelVision` from `PlatformConfig`, routed through OpenRouter. Same API key + base URL as everything else.

Default: `meta-llama/llama-3.2-11b-vision-instruct`. SA can swap to any vision-capable model on OpenRouter (e.g., `anthropic/claude-3-5-haiku`, `google/gemini-2.0-flash`).

```typescript
const { vision: visionModel } = await getAIModels();

await openai.chat.completions.create({
  model: visionModel,
  messages: [{
    role: "user",
    content: [
      { type: "image_url", image_url: { url: doSpacesPresignedUrl } },
      { type: "text",      text: descriptionPrompt },
    ],
  }],
  response_format: { type: "json_object" },
});
```

---

## 3. Schema: `MediaAttachment`

```prisma
model MediaAttachment {
  id              String      @id @default(cuid())
  tenantId        String      @map("tenant_id")
  userId          String      @map("user_id")
  mediaType       MediaType   @map("media_type")          // "image" | "video"
  status          MediaStatus @default(queued)             // queued | processing | processed | failed
  spacesKey       String      @map("spaces_key")
  originalName    String?     @map("original_name")
  fileSizeBytes   Int?        @map("file_size_bytes")
  durationSeconds Int?        @map("duration_seconds")    // video only
  uploadContext   String      @map("upload_context")      // coaching_chat | profile_asset | knowledge_base | feed_post
  sessionId       String?     @map("session_id")
  processingError String?     @map("processing_error")
  processedAt     DateTime?   @map("processed_at")
  transcriptUrl   String?     @map("transcript_url")
  summaryUrl      String?     @map("summary_url")
  qdrantPointIds  Json?       @map("qdrant_point_ids")   // array of Qdrant point IDs
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([tenantId, userId])
  @@index([tenantId, status])
}
```

---

## 4. Image processing pipeline (sync)

```
User uploads image (JPEG, PNG, WebP, GIF, HEIC — max 20MB)
  → Upload to DO Spaces: media/{tenantId}/{userId}/{timestamp}-{filename}
  → Create MediaAttachment (status: "processing")
  → Generate DO Spaces presigned URL (15-min TTL)
  → Call vision model via OpenRouter (modelVision):
      input: presigned URL + context-aware description prompt
      output: structured JSON { description, entities, ocr, type, relevance, coaching_insight }
  → Embed description (Cohere embed-english-v3.0, "search_document")
  → Upsert to Qdrant media-{tenantId}:
      content_type: "media_attachment", memory_tier: "episodic"
  → Inject description into current session Valkey working memory
      → Immediately available to coaching agent in this turn
  → Update MediaAttachment.status = "processed"
```

Total: < 3 seconds for typical images.

### Description prompt (context-aware)

```typescript
{
  "description":      "detailed visual description",
  "entities":         ["people, logos, products, places visible"],
  "ocr":              "any text visible, or null",
  "type":             "screenshot|photo|document|whiteboard|chart|other",
  "relevance":        "high|medium|low",
  "coaching_insight": "what this reveals about the person's business, or null"
}
```

For `coaching_chat` uploads, the prompt adds context about the coaching topic and member's business.

---

## 5. Video processing pipeline (async)

```
User uploads video (MP4, MOV, WebM, AVI, MKV — max 500MB)
  → Validate format, size, duration (≤ 120 min recommended)
  → Multipart upload to DO Spaces
  → Create MediaAttachment (status: "queued")
  → LPUSH media:queue {mediaAttachmentId, userId, tenantId, spacesKey}
  → Return: { status: "queued", message: "Your video is being analyzed..." }

  ─────── ASYNC JOB WORKER (video-processor.ts) ─────────

Stage 1: Download video from DO Spaces to /tmp/media/{id}/
Stage 2: Extract audio (ffmpeg -vn -ab 128k -ar 44100 → mp3)
         Split into 5-minute chunks: ffmpeg -f segment -segment_time 300 chunk_%03d.mp3
Stage 3: Transcribe (Deepgram nova-3, p-limit 5 parallel)
         features: punctuate, utterances, paragraphs
         merge: offset timestamps by chunk_index × 300 seconds
Stage 4: Extract keyframes (ffmpeg scene-change threshold 0.1)
         vf: select='gt(scene,0.1)',showinfo
         records: [{n, pts_time, imagePath}]
Stage 5: Describe keyframes (modelVision, 5 frames/batch, p-limit 10)
         include: frame image + transcript utterances within ±30s of frame
Stage 6: Recursive summarization (media-summarizer.ts summarizeTranscript())
         input: video metadata + full transcript + frame descriptions interleaved
Stage 7: Chunk, embed, index in Qdrant media-{tenantId}:
         a. video summary → 1 point (content_type: "video_summary")
         b. transcript chunks → 512-token chunks, 50-token overlap
            (content_type: "video_transcript_chunk", pts_time per chunk)
         c. high-relevance frame descriptions → 1 point each
            (content_type: "video_frame_description", pts_time = frame timestamp)
Stage 8: Upload artifacts to DO Spaces; DELETE raw video
Stage 9: Update MediaAttachment.status = "processed"; set transcriptUrl, summaryUrl
         Create notification: "Your video has been analyzed..."
```

---

## 6. Deepgram STT discipline

- **Model:** `nova-3`.
- **Mode:** Batch (REST). Streaming STT is NOT in scope today.
- **Features:** `punctuate: true, utterances: true, paragraphs: true`.
- **Chunking:** 5-minute audio chunks. p-limit 5 parallel.
- **Timestamp merging:** offset by `chunk_index × 300 seconds`.

A push to streaming STT requires the substitution policy (`guides/01-stack-enforcement.md §2`).

---

## 7. Async job queue

| Key | Type | Purpose |
|---|---|---|
| `media:queue` | List | Main job queue (LPUSH add, BRPOP consume) |
| `media:job:{id}` | String (EX 3600) | In-progress lock: prevents duplicates |
| `media:dlq` | List | Dead letter queue: failed jobs after 3 retries |

Worker loop:

1. `BRPOP media:queue 30`: block up to 30s.
2. Set `media:job:{id}` with NX to prevent duplicates.
3. Process video pipeline.
4. Success → `DEL media:job:{id}`.
5. Failure → increment retry; re-queue if < 3, else push to DLQ + mark `failed`.

---

## 8. How media reaches coaching agents

```typescript
// Image (sync): injected directly into Valkey working memory
// → available in current coaching turn

// Video (async): indexed to Qdrant after processing
// → available in next session via semantic search
```

`buildVectorContextWithChunks()` queries `media-{tenantId}` along with knowledge + conversation collections. Media context appears as `[RELEVANT MEDIA CONTEXT]` block in the system prompt after knowledge + episodic history.

For videos, until processing completes, the coaching agent can acknowledge the upload but cannot discuss its contents.

---

## 9. Storage retention

| Data | Retention | Why |
|---|---|---|
| Raw uploaded video (DO Spaces) | Deleted after processing | Storage cost |
| Processed transcript (DO Spaces) | 30 days | Available for download |
| Processed summary (DO Spaces) | 30 days | Same |
| Qdrant vectors (`media-*`) | Until GDPR deletion | Episodic memory tier |
| `MediaAttachment` Postgres | Indefinite | Audit trail |

---

## 10. File format limits

| Type | Max | Formats |
|---|---|---|
| Image | 20 MB | JPEG, PNG, WebP, GIF, HEIC |
| Video | 500 MB | MP4, MOV, WebM, AVI, MKV |
| Audio | 100 MB | MP3, M4A, WAV, OGG |

Max video duration: 120 min recommended. Presigned upload URL TTL: 15 min.

---

## 11. Common findings

| Finding | Severity | Reference |
|---|---|---|
| Vision call hardcoding `meta-llama/llama-3.2-11b-vision-instruct` (instead of `getAIModels().vision`) | must-fix | this guide §2 |
| Deepgram batch chunk size drifted from 5 minutes | should-refactor | this guide §6 |
| Video processor not deleting raw video after processing | should-refactor (cost) | this guide §5 |
| `MediaAttachment` payload missing `media_attachment_id` index | must-fix (GDPR deletion) | `guides/09-vector-payload-schema.md` |
| Image processing path adopting async without doc update | must-fix | this guide §1 |
| Streaming STT introduced without substitution policy | must-fix | this guide §6 |
| `media-{tenantId}` collection not queried in coaching context | must-fix | this guide §8 |
| Frame description without `pts_time` | must-fix | this guide §5 |
| `MediaSummarizer` using `chat` model instead of `fast` | should-refactor (cost) | `guides/12-three-tier-memory.md §7` |
