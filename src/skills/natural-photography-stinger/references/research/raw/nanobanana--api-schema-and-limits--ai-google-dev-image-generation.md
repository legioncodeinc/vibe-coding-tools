# Image generation with Gemini (Nano Banana) — Gemini API docs
- URL: https://ai.google.dev/gemini-api/docs/image-generation
- Fetched: 2026-08-17
- Source type: official-docs

## Model IDs (as of Aug 2026 the docs list four "Nano Banana" models)
| Marketing name | Model ID | Notes |
|---|---|---|
| Nano Banana Pro | `gemini-3-pro-image` | premium / professional; the model behind "Nano Banana Pro" |
| Nano Banana 2 | `gemini-3.1-flash-image` | versatile workhorse |
| — | `gemini-3.1-flash-lite-image` | fastest / cheapest; 1K only |
| Nano Banana (original) | `gemini-2.5-flash-image` | legacy |

NOTE: at launch (Nov 2025) the preview ID was `gemini-3-pro-image-preview`; the GA ID is `gemini-3-pro-image`.

## Resolutions
- Supported image sizes: **512px (0.5K), 1K, 2K, 4K**.
- The Lite model supports 1K only.

## Aspect ratios (verbatim list)
`1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`

## Configuration parameters (current docs / `interactions` API)
- `response_format` — output type, MIME type, **aspect ratio**, **image size**
- `generation_config` — includes `thinking_level` with values `minimal` or `high`
- `tools` — array supporting `{"type": "google_search"}` with optional `search_types`
- Multi-turn conversational iteration via `previous_interaction_id`

Endpoint: `POST https://generativelanguage.googleapis.com/v1beta/interactions`

(Earlier/legacy `generateContent` form used `generationConfig.imageConfig.aspectRatio` and
`generationConfig.imageConfig.imageSize`, plus `responseModalities: ["TEXT","IMAGE"]`. Third-party
bug reports show `imageConfig` being silently ignored by some SDK/proxy paths — see litellm issues
#17075, #18656, #21070 and googleapis/js-genai #1461.)

## Reference-image limits per model (verbatim table)
| Model | Objects | Characters | Style references |
|---|---|---|---|
| 3.1 Flash Lite | 14 | N/A | N/A |
| 3.1 Flash | 10 | 4 | N/A |
| **3 Pro (Nano Banana Pro)** | **6** | **5** | **3** |

## Features
- Text rendering: legible, stylized text generation.
- Google Search grounding: web search and image search.
- Video-to-image: 3.1 Flash only; accepts YouTube URLs or uploaded files.
- Interleaved content: 3 Pro generates combined text + image responses.
- **Thinking mode: default enabled; generates interim "thought images."**
- SynthID watermark applied to all generated images.

## Editing capabilities documented
- Text-to-image generation
- Image editing (add / remove / modify elements)
- Inpainting via **semantic masking** (no mask file required — describe the region)
- Style transfer
- Multi-turn conversational iteration

SDK coverage: Python (`google-genai`), JavaScript, REST.
