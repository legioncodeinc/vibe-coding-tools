# Deepgram STT: Batch (REST) for Video Processing

**Source:** Deepgram docs: https://developers.deepgram.com/docs/, https://developers.deepgram.com/docs/nova-3
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING** for the multimodal pipeline. Cited in `guides/14-multimodal-pipeline.md §6`.
**Numbers tag:** benchmarked (Deepgram model card); operational details from production usage.

---

## TL;DR

Deepgram `nova-3` is the canonical STT model for the deploying product's video processing. Batch mode via REST. Configuration:

- `punctuate: true`
- `utterances: true`
- `paragraphs: true`
- 5-minute audio chunks
- p-limit 5 parallel chunk submissions
- Timestamp offset = `chunk_index × 300 seconds`

---

## Why batch (not streaming)

the deploying product's video processing pipeline is **asynchronous**. Videos upload → queue → worker processes → indexes results. There's no real-time streaming need. Batch mode:

- Higher quality (full-pass diarization, paragraph detection).
- Cheaper per minute than streaming.
- Simpler architecture (REST call, not websocket).

Streaming STT is **out of scope** today. A push to adopt streaming STT requires `guides/01-stack-enforcement.md §2` substitution policy.

---

## Why `nova-3`

Per Deepgram docs, `nova-3` is their flagship English model. Best-in-class WER on conversational audio.

Alternatives:

- `nova-2-general`: previous generation; replaced by nova-3.
- `enhanced-general`: older tier, not recommended.
- `whisper-large` (via Deepgram): multilingual but slower; for English-only deployments, nova-3 is faster and equal/better quality.

---

## Chunking strategy

Audio is split into 5-minute (300-second) chunks via ffmpeg:

```bash
ffmpeg -i input.mp3 -f segment -segment_time 300 chunk_%03d.mp3
```

Why 5 minutes:

- Deepgram's batch API has time limits per request (~2 hours hard, but practical limit lower for parallelism).
- 5 minutes balances request count vs latency.
- p-limit 5 parallel chunks → ~10 minutes wall-clock for a 50-minute video.

**Timestamp merging:** offset each chunk's transcript timestamps by `chunk_index × 300 seconds`. Critical: without this, video frame ↔ transcript alignment breaks.

---

## Features

| Feature | Why |
|---|---|
| `punctuate: true` | Sentence boundaries for paragraph detection and downstream chunking |
| `utterances: true` | Speaker turn detection: useful even in single-speaker for natural breaks |
| `paragraphs: true` | Pre-segmented paragraphs for the recursive summarizer |

Diarization (multi-speaker labels) is optional: the deploying product's videos are typically single-speaker (member's intro video, training video). Adding diarization for multi-speaker content (panel discussions, interviews) is a future enhancement.

---

## Failure handling

- Chunk fails → retry up to 3 times with exponential backoff.
- All retries fail → push to `media:dlq` with `processingError` populated.
- Partial success (some chunks succeed) → proceed with partial transcript; flag in `MediaAttachment.processingError` for visibility.

The video processor preserves partial output rather than losing the entire transcription.

---

## Implications

- Hardcoding `nova-3` (instead of a config-driven slot) is acceptable today (single canonical model). When/if the deploying product adds multilingual support, this becomes config-driven.
- Streaming STT introduced without substitution policy is **must-fix**.
- Chunk size drift from 5 minutes is **should-refactor** (operational tuning).
- See `guides/14-multimodal-pipeline.md §5-6`.
