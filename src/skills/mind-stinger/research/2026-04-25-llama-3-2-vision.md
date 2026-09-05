# Llama 3.2 11B Vision: Multimodal Format

**Source:** Meta Llama 3.2 model card; OpenRouter vision-model docs
**Retrieved:** 2026-04-25
**Status:** Informational: referenced in `guides/14-multimodal-pipeline.md §2`.
**Numbers tag:** vendor-directional on quality; the OpenAI multimodal message format is standardized.

---

## TL;DR

Llama 3.2 11B Vision Instruct is the deploying product's `modelVision` slot default. Used for image and video frame description through OpenRouter's standard multimodal message format.

---

## Multimodal message format (OpenAI-compatible)

```typescript
await openai.chat.completions.create({
  model: visionModel,                      // from getAIModels().vision
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

Key points:

- **`image_url`** can be a public URL (e.g., DO Spaces presigned, 15-minute TTL) OR a base64 data URI (`data:image/jpeg;base64,...`). For the deploying product, presigned URL is the canonical path.
- **Order matters**: image before text in the content array.
- **`response_format: json_object`** for structured output (the deploying product's image description is structured JSON).

---

## image description prompt

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

## Limits

- **Image formats:** JPEG, PNG, WebP, GIF, HEIC.
- **Max size:** 20 MB (host limit).
- **Image dimensions:** Llama 3.2 11B Vision handles up to ~1120×1120 (downscaled if larger).

---

## Why 11B (not 70B) for vision

- **11B Vision** is a mid-tier vision model: sufficient for description and entity extraction, far cheaper than 70B vision counterparts.
- For deep visual reasoning (e.g., chart analysis with numerical extraction), a stronger model (Claude 3.5 Sonnet, Gemini 2.0 Pro) might lift quality. The SA can swap the slot via `PlatformConfig.modelVision`.

---

## Video frame batching

For video processing (per `guides/14-multimodal-pipeline.md §5 Stage 5`):

- Keyframes extracted via ffmpeg (scene-change threshold 0.1).
- Each frame described in batches of 5 (with transcript context within ±30s).
- p-limit 10 parallel batches.

---

## Implications

- Hardcoding the vision model literal (instead of `getAIModels().vision`) is **must-fix**.
- The standardized OpenAI multimodal format means swapping the slot to a different vision model (e.g., Claude vision) is config-only.
- See `guides/14-multimodal-pipeline.md §2`.
