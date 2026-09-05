# Guide 12: Model Selection and API

## What this guide is for

Choosing between the two image platforms that matter for natural photography work (OpenAI `gpt-image-2` and Google Nano Banana Pro / `gemini-3-pro-image`), and then actually calling them correctly: every parameter, every constraint, the Replicate path, the official Replicate MCP server, pricing, capacity handling, and a troubleshooting table.

## Load this when

- The user names a model, or names something that sounds like a model but is not one.
- You are about to issue a generation or edit call and need exact parameter names, enums, size rules, or reference-image caps.
- A call failed and you need the symptom-to-cause table.
- You need to decide which platform to send a given job to, or you need a hybrid plan.
- You are driving generation through the Replicate MCP server rather than a direct vendor API.

---

## 1. CORRECTION BLOCK: read this before accepting a model name

### 1.1 "Sol 5.6 ULTRA" is not a real image model

There is no image model called "Sol 5.6 ULTRA". Do not look for it, do not pretend to call it, and do not silently substitute something else without saying so.

What actually exists [distilled-image-models.md]:

| Claim | Reality |
|---|---|
| "Sol 5.6 ULTRA generates images" | `gpt-5.6-sol` is a **text-only reasoning model**. Its model page describes it as "Frontier model for complex professional work." Input: text and images. **Output: text only. It does not generate images.** |
| "gpt-5.6-sol-ultra" is the model ID | **No such ID exists.** The real IDs are `gpt-5.6-sol` (primary) and `gpt-5.6` (alias). No variants or snapshots are listed. |
| "ULTRA" is an effort tier | The `reasoning.effort` enum is `none`, `low`, `medium` (default), `high`, `xhigh`, `max`. **There is no "ultra" level.** The top tiers are literally `xhigh` and `max`. A leaked-system-prompt file circulating as `gpt-5.6-sol-extra-high.md` is the most likely origin of a garbled "ULTRA". |

`gpt-5.6-sol` specs, for completeness: context window 1,050,000 tokens; max output 128,000 tokens; knowledge cutoff February 16, 2026; pricing per 1M tokens $5.00 input, $0.50 cached input, $30.00 output [distilled-image-models.md].

No primary source anywhere uses the string "Sol 5.6 ULTRA" in connection with image generation [distilled-image-models.md].

### 1.2 The real identifiers you should use instead

| Consumer / marketing name | API model ID | Notes |
|---|---|---|
| ChatGPT Images 2.0 | **`gpt-image-2`** | Same April 2026 release. Three names for one thing. Launched 2026-04-21, available same day in the API and in Codex. |
| (none) | **`chatgpt-image-latest`** | API **alias** pointing at whatever image model ChatGPT currently serves. Closest real ID to a colloquial "ChatGPT Image". Shuts down 2026-12-01. |
| Nano Banana Pro / Gemini 3 Pro Image | **`gemini-3-pro-image`** | GA ID. The Nov 2025 launch preview ID was `gemini-3-pro-image-preview`. |

There is **no** `chatgpt-image-2` identifier and no model literally named "ChatGPT Image 2" in the API surface [distilled-image-models.md]. Access to any GPT Image model may require completing OpenAI's API Organization Verification [distilled-image-models.md].

### 1.3 The legitimate equivalent: plan-then-generate

The workflow the phrase "Sol 5.6 ULTRA" gestures at is real, it just is not a product. It is the documented **"Thinking mode"** pattern [distilled-image-models.md]:

1. A reasoning model (for example `gpt-5.6-sol` at `high`, `xhigh`, or `max` effort) plans the shot and writes the prompt.
2. That plan is handed to `gpt-image-2`, either via the raw Image API or via the Responses API `image_generation` tool.

OpenAI's own launch post describes it as "Thinking mode for richer workflows", meaning "integration with reasoning models so image generation can be planned in context before rendering" [distilled-image-models.md].

**This is a pipeline, not a product name.** Say so plainly when the user asks for the nonexistent model, then offer the pipeline.

**Caution on the pipeline.** In the mainline Responses API path the model "will automatically revise your prompt for improved performance," exposing the rewrite in `revised_prompt`. Your literal prompt is **not** necessarily what reaches the image model. The raw Image API (`POST /v1/images/generations`) does not apply this rewriting layer in the same way, giving more deterministic control over photographic language. For natural-photography work where exact optical wording is the whole point, prefer the raw Image API [distilled-image-models.md].

---

## 2. SELECTION MATRIX

Drive the choice from the task, not from brand preference.

### 2.1 By task type

| Task | Choose | Why |
|---|---|---|
| Photorealistic human skin, natural-light portrait | **`gemini-3-pro-image`** | Skin texture, subsurface scattering in lips, individual hair strands catching window light; "looks like a frame from a real camera" versus GPT Image 2.0's "strong digital painting" [PRACTITIONER] |
| Phone-camera / UGC / candid look | **`gemini-3-pro-image`** | Captured fisheye, hard overhead LED reflection, slight sensor noise; GPT output was "too clean, too evenly lit" [PRACTITIONER] |
| Un-over-processed color grading | **`gemini-3-pro-image`** | "Produces naturally balanced results without over-processing" [PRACTITIONER] |
| Any named or prominent real person | **`gpt-image-2`** | Nano Banana Pro **hard-refuses**: "This prompt might violate our policies about generating prominent people." Do not rely on it for press, political satire, biographical content, recruiting flyers, editorial illustration, podcast cover art [PRACTITIONER] |
| Diagrams, infographics, charts, posters, comics | **`gpt-image-2`** | Vendor-stated "stronger structured generation"; positioned for output that is "accurate, readable, on-brand, localized, formatted for the destination surface" |
| Transparent background required | **`gpt-image-2`** | `background: "transparent"` is a documented parameter. No equivalent appears in the Google or Replicate schemas |
| Mask-precise inpainting with a supplied alpha mask | **`gpt-image-2`** via `/v1/images/edits` with `mask` | Google uses **semantic masking, no mask file**; you describe the region in prose instead |
| Real-world grounded facts inside the image | **`gemini-3-pro-image`** with `tools: [{"type":"google_search"}]` | Search grounding is a first-class feature on the Gemini side only |
| Cheap batch drafts | `gemini-3.1-flash-image` ($0.067 per 1K image), or `gpt-image-1-mini` until 2026-12-01 | Price and stated positioning |

### 2.2 By hard constraint

| Constraint | `gpt-image-2` | `gemini-3-pro-image` | Winner |
|---|---|---|---|
| **Reference image count** | Up to **16** images on `/v1/images/edits`, 20 MiB each | **14 total**, split 6 objects / 5 characters / 3 style | GPT for raw count |
| **Character consistency across a series** | No documented per-category character budget; identity carried by multi-image input plus explicit preserve-list prompting | **Up to 5 individuals** with "consistent resemblance", a documented first-class capability | **Gemini**, and this is the single strongest reason to pick it for a photo series |
| **Resolution** | Max edge **< 3840 px**, total pixels 655,360 to 8,294,400, advertised "up to 2K" | **512px (0.5K), 1K, 2K, 4K** | **Gemini** for true 4K |
| **Text in image** | Contested. One 10-prompt head-to-head had GPT 2.0 render clean dialogue bubbles and legible Japanese while NBP garbled kanji and produced gibberish text blocks | Contested. A separate comparison ranked NBP top for dense infographics and editorial column flow | **Unsettled. Test both.** Treat text-rendering rank as prompt- and language-dependent, not a fixed ordering |
| **Editing versus generation** | Both, with a real alpha `mask` for surgical inpainting; multi-turn via `previous_response_id` | Both, semantic masking only; multi-turn via `previous_interaction_id`; camera-angle change, color grading, scene relighting, depth-of-field change all documented editing verbs | **GPT** for pixel-precise regions, **Gemini** for described regions and relighting |
| **Cost per image** | **Unknown.** Only per-1M-token pricing is published ($8 input / $2 cached / $30 output). No tokens-per-image figure exists, so cost per render cannot be computed | **Published: $0.134 per 1K/2K image, $0.24 per 4K image** | **Gemini** for budget predictability |
| **Capacity and fallback** | No documented fallback mechanism | On Replicate, `allow_fallback_model` falls back to `bytedance/seedream-5` when NBP is at capacity | See section 7 |
| **Explicit likeness-fidelity knob** | **Disabled** on `gpt-image-2`. Available as `input_fidelity: "high"` on `gpt-image-1.5` / `gpt-image-1` / `gpt-image-1-mini`, all of which shut down **2026-12-01** | Not applicable | Neither, after 2026-12-01 |

### 2.3 The hybrid play

For work that needs both photographic base plate and clean typography: use **Nano Banana Pro for the photographic base plate, `gpt-image-2` for the typography pass**, and a compositor (Photoshop, Affinity, or a canvas layer) to stack the two [PRACTITIONER, distilled-image-models.md]. This sidesteps the unsettled text-rendering ranking entirely.

---

## 3. `gpt-image-2` parameter reference

### 3.1 Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /v1/images/generations` | Text-to-image |
| `POST /v1/images/edits` | Edits, multi-reference conditioning, inpainting |
| `POST /v1/images/variations` | DALL-E 2 only, effectively dead since the 2026-05-12 DALL-E shutdown |
| Responses API `image_generation` tool | Mainline reasoning model calls image gen as a tool |

Responses-API tool shape: `{ type: "image_generation", action: "auto|generate|edit", partial_images: number }`. `action` is `"auto"` (model decides), `"generate"` (force new), `"edit"` (force edit). Output is a base64 image in the `result` field, plus optional `revised_prompt`. Multi-turn editing via `previous_response_id`, or by including prior image-generation call outputs in the context array [distilled-image-models.md].

### 3.2 `/v1/images/generations`

| Parameter | Type | Values / range | Notes |
|---|---|---|---|
| `prompt` | string, **required** | **max 32,000 chars** on GPT image models (1,000 on DALL-E 2, 4,000 on DALL-E 3) | This budget is what makes a long structured photographic brief viable in one call |
| `model` | string, optional | Reference-page enum: `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`, `dall-e-3`, `dall-e-2`. Default `dall-e-2` **unless** a GPT-specific parameter is used | **The enum lags.** `gpt-image-2` is current and callable; the reference page has not caught up. Pass `gpt-image-2` explicitly |
| `size` | string, optional | `auto`, `1024x1024`, `1536x1024`, `1024x1536`, **or custom `WIDTHxHEIGHT` where each dimension is divisible by 16, up to 3840x2160** | See 3.4 for the full constraint set |
| `quality` | string, optional | `auto` (default), `high`, `medium`, `low` | Raises polish, **not grit**. It will not give you texture |
| `output_format` | string, optional | `png`, `jpeg`, `webp` | GPT image models only |
| `background` | string, optional | `transparent`, `opaque`, `auto` (default `auto`) | GPT only |
| `style` | **does not exist** | `vivid` / `natural` were **DALL-E 3 only** | **No `style` parameter exists on GPT image models.** Photorealism must be carried entirely by prompt text |
| `n` | number, optional | **1 to 10** | DALL-E 3 supported `n=1` only |
| `stream` | boolean, optional | default `false` | GPT only |
| `partial_images` | number, optional | **0 to 3** | Streaming only |
| `output_compression` | number, optional | **0 to 100 (%)**, default `100` | webp/jpeg only. Below 100 introduces artifacts that read as "digital", **not** as film grain |
| `response_format` | string | `url` or `b64_json`, **DALL-E 2/3 only** | **GPT image models always return base64.** URLs (legacy) were valid 60 minutes |
| `moderation` | string, optional | `low`, `auto` (default `auto`) | GPT only |
| `user` | string, optional | End-user identifier for abuse monitoring | |
| `input_fidelity` | not on this endpoint | It is an **edit** endpoint parameter | See 3.5 |

### 3.3 `/v1/images/edits`

| Parameter | Type | Values / range | Notes |
|---|---|---|---|
| `image` | image(s) | **Up to 16 images** for GPT image models. Each as `file_id` (File API ID of an uploaded image) or `image_url` (fully qualified URL or base64 data URL). **Max 20971520 bytes (20 MiB) per image** | This is the documented reference-conditioning mechanism. **No "reference strength" or IP-Adapter-style weight parameter exists** |
| `mask` | image, optional | `file_id` or `image_url` (one is required if you supply a mask) | Inpainting. See 3.6 for alpha semantics |
| `prompt` | string, **required** | **1 to 32000 characters** | |
| `model` | string | Listed: `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`, `chatgpt-image-latest` | Same lagging-enum caveat. Pass `gpt-image-2` |
| `input_fidelity` | string, optional | `"high"` or `"low"` | **Disabled on `gpt-image-2`.** See 3.5 |
| `background` | string, optional | `transparent`, `opaque`, `auto` | |
| `quality` | string, optional | `low`, `medium`, `high`, `auto` | GPT image models only |
| `size` | string, optional | `auto`, `1024x1024`, `1536x1024`, `1024x1536` | **Narrower than generate.** No custom `WIDTHxHEIGHT` is documented on the edit page. Whether `gpt-image-2` accepts custom sizes here is **unresolved**: the cookbook says it supports "any size meeting constraints" |
| `output_format` | string, optional | `png`, `jpeg`, `webp` | |
| `output_compression` | number, optional | 0 to 100 | JPEG/WebP output only |
| `n` | number, optional | **1 to 10** | |
| `stream` / `partial_images` | boolean / number | `partial_images` 0 to 3 | Streams partial image results as events |
| `moderation` | string, optional | `low`, `auto` | |
| `user` | string, optional | Abuse-monitoring identifier | |

### 3.4 Size constraints (exact)

| Constraint | Value |
|---|---|
| Max edge | **< 3840 px** |
| Edge granularity | both edges must be **multiples of 16** |
| Aspect ratio cap | **<= 3:1** (equivalently, 3:1 wide through 1:3 tall) |
| Total pixel count | **655,360 to 8,294,400** |
| Experimental zone | treat anything above **2560x1440** as experimental |
| Advertised ceiling | "up to 2K resolution" via the API |

All from the cookbook constraints table [distilled-image-models.md]. The "<= 3:1" cap and the press framing "3:1 to 1:3" describe the same limit from opposite ends (ratio magnitude in either orientation).

### 3.5 `input_fidelity` is disabled on `gpt-image-2`, and its host models die 2026-12-01

Verbatim from the cookbook: "Disabled. `input_fidelity` does not work for this model because output is already high fidelity by default." [distilled-image-models.md]

| Model | Quality settings | `input_fidelity` | Resolutions | Status |
|---|---|---|---|---|
| `gpt-image-2` | low, medium, high | **Disabled** | Any meeting the 3.4 constraints | Recommended default for new builds. **The only image model with no announced end-of-life** |
| `gpt-image-1.5` | low, medium, high | low, high | 1024x1024, 1024x1536, 1536x1024, auto | **Shuts down 2026-12-01** |
| `gpt-image-1` | low, medium, high | low, high | same | "Compatibility only". EOL unannounced |
| `gpt-image-1-mini` | low, medium, high | low, high | same | **Shuts down 2026-12-01** |
| `chatgpt-image-latest` | alias | n/a | n/a | **Shuts down 2026-12-01** |

Where it works, `input_fidelity: "high"` "preserves fine detail, faces, logos and texture from the input images at higher token cost"; `low` "re-imagines more of the frame". It is "helpful for identity and likeness preservation during scene edits" [distilled-image-models.md].

**The trap:** the only models that support the explicit likeness-fidelity knob are the ones being retired. On **2026-12-01** that knob disappears from the platform entirely. After that date, reference fidelity must be carried by multi-image inputs on `/v1/images/edits` plus explicit preserve-list prompting, nothing else [distilled-image-models.md].

### 3.6 Mask alpha semantics

The API reference describes the mask as an "image reference indicating the area to edit", and states that **transparent regions of the mask mark the editable area** [distilled-image-models.md].

Practitioner restatement, which agrees: "mask-based inpainting uses alpha transparency, **opaque = preserve, transparent = regenerate**" [PRACTITIONER].

**Rule:** paint the region you want changed as **transparent**. Leave everything you want preserved **opaque**. The mask must match the base image dimensions.

### 3.7 Reference image input formats

Accepted as fully qualified URLs, base64-encoded data URLs (`data:image/png;base64,{encoded}`), or File IDs created with the Files API using purpose `"vision"`. Multiple reference images are supported simultaneously in a single request [distilled-image-models.md].

### 3.8 Pricing

| Line | Price per 1M tokens |
|---|---|
| Input | **$8.00** |
| Cached input | **$2.00** |
| Output | **$30.00** |

No per-image price was published. **You cannot compute cost per render on OpenAI**, because no tokens-per-image figure exists in any source [distilled-image-models.md]. Budget with headroom or use Gemini's published per-image prices for planning.

---

## 4. Nano Banana Pro (`gemini-3-pro-image`) parameter reference

### 4.1 Endpoint and config shape

Endpoint: **`POST https://generativelanguage.googleapis.com/v1beta/interactions`** [distilled-image-models.md].

Config parameters on the current `interactions` API:

| Key | Contents |
|---|---|
| `response_format` | output type, MIME type, **aspect ratio**, **image size** |
| `generation_config` | includes **`thinking_level`**, values **`minimal`** or **`high`** |
| `tools` | array supporting `{"type": "google_search"}` with optional `search_types` |
| `previous_interaction_id` | multi-turn conversational iteration, the editing loop |

The legacy `generateContent` form used `generationConfig.imageConfig.aspectRatio`, `generationConfig.imageConfig.imageSize`, and `responseModalities: ["TEXT","IMAGE"]`. **Third-party bug reports show `imageConfig` being silently ignored on some SDK and proxy paths** (litellm #17075, #18656, #21070; googleapis/js-genai #1461). If your aspect ratio or size is being ignored, this is the first thing to check [distilled-image-models.md].

SDK coverage: Python (`google-genai`), JavaScript, REST.

### 4.2 The THREE separate reference limits, plus the total

This is the part people get wrong. There are four numbers, not one.

| Model | Objects | Characters | Style references |
|---|---|---|---|
| `gemini-3.1-flash-lite-image` | 14 | N/A | N/A |
| `gemini-3.1-flash-image` | 10 | 4 | N/A |
| **`gemini-3-pro-image`** | **6** | **5** | **3** |

Plus the separate **total input cap of 14 images**, with consistency maintained for **up to 5 people** [distilled-image-models.md].

Google states it in one sentence: "Achieve consistent resemblance for up to five individuals, integrate six high-fidelity shots, or blend as many as fourteen standard inputs into a single, polished ad." Read that as 5 character references, 6 high-fidelity object references, 14 total standard inputs.

**These are different axes, not a contradiction.** 14 is the total input budget; 6 / 5 / 3 are per-category caps within it.

### 4.3 Resolutions and aspect ratios

| Item | Values |
|---|---|
| Image sizes | **512px (0.5K), 1K, 2K, 4K**. The Lite model supports **1K only** |
| Aspect ratio enum (verbatim) | `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` |

The docs enum lists 10 values. Replicate's material mentions "docs elsewhere list 11 options incl. a 'match input image' option"; **the 11th value is unconfirmed** [distilled-image-models.md]. Do not pass a value outside the 10 above without testing.

### 4.4 `thinking_level`

Enum: **`minimal`** or **`high`**. Thinking mode is **default enabled** on 3 Pro and generates interim "thought images" [distilled-image-models.md].

**Gap to state honestly:** no source documents `thinking_level`'s effect on photographic realism, latency, or price. Do not claim `high` improves realism. Test it on your own prompt set before defaulting to either value.

### 4.5 Editing and multi-turn

| Capability | Detail |
|---|---|
| Multi-turn editing | Conversational iteration via **`previous_interaction_id`**. Pass the prior interaction ID and describe only the change |
| Inpainting | **Semantic masking. No mask file required.** You describe the region in prose |
| Editing verbs documented | add / remove / modify elements; style transfer; localized editing; camera-angle adjustment; color grading; scene-lighting transformation; depth of field; specific image regions |
| Text rendering | "Legible, stylized text generation", multiple languages, "a wider variety of textures, fonts and calligraphy" |
| Search grounding | Web search and image search, real-time information integration |
| Interleaved content | 3 Pro generates combined text plus image responses |
| Video-to-image | **3.1 Flash only**, accepts YouTube URLs or uploaded files. Not on 3 Pro |
| Provenance | **SynthID watermark applied to all generated images** |

**Not documented anywhere:** no `seed`, no negative prompt, no CFG-style control appears in either the Google docs or the Replicate schema. Do not invent them [distilled-image-models.md].

### 4.6 Pricing (Gemini API, per 1M tokens)

| Model | Output (images) | Input (text/image) | Per-image equivalents |
|---|---|---|---|
| Gemini 3 Pro Image (Nano Banana Pro) | **$120.00** | **$2.00** ("equivalent to $0.0011 per image") | **$0.134 per 1K/2K image, $0.24 per 4K image** |
| Gemini 3.1 Flash Image (Nano Banana 2) | **$60.00** | **$0.50** | $0.045 per 0.5K, $0.067 per 1K, $0.101 per 2K, $0.151 per 4K |

Token consumption: 3 Pro outputs from 1K up to 2K consume **1120 tokens**; outputs up to 4K consume **2000 tokens**. 3.1 Flash: 0.5K **747**, 1K **1120**, 2K **1680**, 4K **2520** [distilled-image-models.md].

Nano Banana Pro is roughly **2x** the output token price of 3.1 Flash Image and **4x** the input price. Google's own developer blog notes "higher cost and latency" versus Gemini 2.5 Flash Image.

---

## 5. The Replicate path

### 5.1 Model slug

**`google/nano-banana-pro`**. Related slugs: `google/nano-banana` (Gemini 2.5 Flash Image, the original), and the `google/nano-banana-2` / `google/gemini-3-flash-image` family (**verify the slug before use**). Latest version date on the model page: **2026-07-21**; roughly 34.1M total runs [distilled-image-models.md].

### 5.2 Input schema (complete)

| Field | Type | Required | Description (verbatim) | Values |
|---|---|---|---|---|
| `prompt` | string | **yes** | "A text description of the image you want to generate" | free text |
| `image_input` | array of image URIs/files | no | "Input images to transform or use as reference (supports up to 14 images)" | up to 14 |
| `aspect_ratio` | string | no | "Aspect ratio of the generated image" | values seen: `1:1`, `4:3`, `3:4`, `16:9`, `9:16` |
| `resolution` | string | no | "Resolution of the generated image" | `1K`, `2K`, `4K` |
| `output_format` | string | no | "Format of the output image" | `png`, `jpg` (jpeg) |
| `safety_filter_level` | string | no | "block_low_and_above is strictest, block_medium_and_above blocks some prompts, block_only_high is most permissive but some prompts will still be blocked" | `block_low_and_above`, `block_medium_and_above`, `block_only_high` |
| `allow_fallback_model` | boolean | no | "Fallback to another model (currently bytedance/seedream-5) if Nano Banana Pro is at capacity" | true / false |

**The full 11-value `aspect_ratio` enum and all field defaults are unconfirmed** [distilled-image-models.md]. Replicate's own prompting blog post references only `prompt` and `aspect_ratio`.

### 5.3 Output shape

```json
{ "type": "string", "title": "Output", "format": "uri" }
```

**A single image URI, a string, not an array.** This differs from many other Replicate image models, which return arrays. Code that indexes `output[0]` will break [distilled-image-models.md].

### 5.4 Direct calling forms

```python
replicate.run("google/nano-banana-pro", input={...})
```

```bash
curl -s -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Prefer: wait" \
  -H "Content-Type: application/json" \
  -d '{"version":"google/nano-banana-pro","input":{"prompt":"...","resolution":"2K"}}'
```

Both forms from [distilled-image-models.md].

### 5.5 Official Replicate MCP server

| Item | Value |
|---|---|
| Status | **Official** Replicate MCP server, announced **2025-08-10** (replicate.com/blog/remote-mcp-server) |
| Remote URL (recommended) | **`mcp.replicate.com`** |
| Remote auth | Web-based OAuth flow (Cloudflare OAuth Provider Framework for Workers). You supply a Replicate API key that the server uses on your behalf. Tokens are stored in Cloudflare KV, kept separate from the AI tool |
| Local invocation | **`npx -y replicate-mcp`** with `REPLICATE_API_TOKEN` in env. Requires a recent Node.js |

Client configs, all the same object shape:

```jsonc
// claude_desktop_config.json  and  .cursor/mcp.json   (key: mcpServers)
{
  "mcpServers": {
    "replicate": {
      "command": "npx",
      "args": ["-y", "replicate-mcp"],
      "env": { "REPLICATE_API_TOKEN": "your-token-here" }
    }
  }
}
```

```jsonc
// .vscode/mcp.json  for VS Code / GitHub Copilot   (key is "servers", NOT "mcpServers")
{ "servers": { "replicate": { "command": "npx", "args": ["-y","replicate-mcp"], "env": { "REPLICATE_API_TOKEN": "your-token-here" } } } }
```

**Tool names exposed** (they mirror Replicate's HTTP API):

| Tool | Purpose |
|---|---|
| `models.search` | Model discovery |
| `models.list` | Model comparison |
| `models.get` | Fetch metadata. **This is how you pull a model's live input schema** |
| `predictions.create` | Run models |
| `predictions.get` | Retrieve predictions |

Responses can be filtered with a WebAssembly `jq` implementation to keep JSON small.

Limitations: Claude Desktop support is **local-only** (not the web app). "Code mode" is experimental and requires Deno, with remote cloud sandboxing under development. Community non-official alternatives exist (`deepfates/mcp-replicate`, `gerred/mcp-server-replicate`) but are not the official server [distilled-image-models.md].

### 5.6 Worked example: driving a generation through the MCP tools

Goal: a natural-light portrait at 2K, 4:5, with capacity fallback disabled because we need Nano Banana Pro specifically for skin texture.

**Step 1. Confirm the live schema before assuming any field name.**

```
models.get { "owner": "google", "name": "nano-banana-pro" }
```

Read the returned `latest_version.openapi_schema.components.schemas.Input` block. Confirm that `resolution`, `aspect_ratio`, `image_input`, `safety_filter_level`, and `allow_fallback_model` are all still present and that the `aspect_ratio` enum contains the value you plan to send. The schema published here is a 2026-08-17 snapshot; `models.get` is authoritative at call time.

**Step 2. Create the prediction.**

```
predictions.create {
  "version": "google/nano-banana-pro",
  "input": {
    "prompt": "A photorealistic close-up portrait of a woman in her sixties standing at a north-facing kitchen window in late afternoon. Soft directional daylight from camera left, no fill. Weathered skin with visible pores, fine vellus hair catching the light, laugh lines, an unretouched complexion. Shot at eye level with an 85mm portrait lens, shallow depth of field, subtle film grain. Candid, not posed. No watermark, no text.",
    "aspect_ratio": "4:5",
    "resolution": "2K",
    "output_format": "png",
    "safety_filter_level": "block_only_high",
    "allow_fallback_model": false
  }
}
```

Note: `4:5` is in the Gemini docs enum but was **not** among the values observed in the Replicate schema (`1:1`, `4:3`, `3:4`, `16:9`, `9:16`). This is exactly why step 1 is not optional. If `models.get` does not list `4:5`, fall back to `3:4` and crop, or use the direct Gemini API where `4:5` is documented.

**Step 3. Poll if the call did not return synchronously.**

```
predictions.get { "prediction_id": "<id from step 2>" }
```

Status progresses `starting` to `processing` to `succeeded` or `failed`. On `succeeded`, `output` is **a single URI string**. Fetch it and write it to disk immediately; prediction output URLs are not permanent.

**Step 4. Hand off to the metadata layer.**

The delivered file carries a SynthID watermark in the pixels and (per the Google side) a C2PA manifest in the container. Before you touch it with exiftool, classify the output per guide 11: a Replicate `google/nano-banana-pro` render with no source frame is a **Case B** output. Do not write borrowed capture EXIF into it.

---

## 6. Rate limits, capacity, and fallback

| Topic | Behavior | Handling |
|---|---|---|
| **Nano Banana Pro capacity** | The model "may at times be at capacity" | This is the documented reason `allow_fallback_model` exists |
| **`allow_fallback_model: true`** | Falls back to **`bytedance/seedream-5`** when NBP is at capacity | **The output will not be a Nano Banana Pro image.** It is a different model with different skin rendering, different text behavior, and different provenance signals (no SynthID from Google) |
| **`allow_fallback_model: false`** | The call fails rather than silently substituting | **Default to this for photographic work.** Silent model substitution destroys the entire reason you selected NBP |
| **Detecting a fallback happened** | Inspect the prediction record's model field on `predictions.get` rather than trusting the request | Always check when fallback was enabled |
| **OpenAI organization verification** | Access to any GPT Image model "may need" completed API Organization Verification | A 403 on first use is usually this, not a bad key |
| **Retry posture** | Capacity and rate errors are transient; content-policy refusals are not | Retry the first with backoff. Never retry a policy refusal unchanged, rewrite the prompt or switch models |

**Fallback policy for this skill:** set `allow_fallback_model: false` unless the user has explicitly said any comparable image will do. If you do enable it, say so in your report and name the model that actually rendered.

---

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "Model not found" or the request silently runs on DALL-E 2 | On `/v1/images/generations` the default model is `dall-e-2` unless a GPT-specific parameter is present, and the published enum lags and omits `gpt-image-2` | **Always pass `model: "gpt-image-2"` explicitly.** Never rely on the default |
| Request rejected for invalid `size` | Edge not a multiple of 16, edge >= 3840, aspect beyond 3:1, or total pixels outside 655,360 to 8,294,400 | Round both edges down to the nearest multiple of 16 and re-check all four constraints in 3.4 |
| Custom `WIDTHxHEIGHT` rejected on the edit endpoint | The edit page documents only `auto` / `1024x1024` / `1536x1024` / `1024x1536`. Whether `gpt-image-2` accepts custom sizes here is unresolved | Use a documented edit size, then resize downstream. Do not assume parity with generate |
| `input_fidelity` has no effect | **It is disabled on `gpt-image-2`** | Carry fidelity via multi-image `image` inputs plus an explicit preserve list in the prompt. Using `gpt-image-1.5` for the knob buys you only until 2026-12-01 |
| `style: "natural"` rejected | `style` was DALL-E 3 only and DALL-E shut down 2026-05-12. **No `style` parameter exists on GPT image models** | Put the photographic intent in prompt text. Include the literal word "photorealistic" |
| Output is base64 when you expected a URL | `response_format` is DALL-E 2/3 only. **GPT image models always return base64** | Decode the base64. Remove `response_format` from the request |
| Prompt appears to have been rewritten | The mainline Responses API path automatically revises prompts and exposes the rewrite in `revised_prompt` | Read `revised_prompt` to see what actually ran. For deterministic photographic wording, call the raw `/v1/images/generations` endpoint instead |
| Output looks plastic, smoothed, poreless | Denoising and coherence smooth out high-frequency texture. **OpenAI staff acknowledged this.** There is no "Style Raw" or no-polish switch; `quality` raises polish, not grit | Name micro-texture as subject matter ("visible pores", "fine vellus hair", "fabric slub"). Do not upscale to fix it, upscaling stretches an already-denoised image. Consider switching to `gemini-3-pro-image` |
| Aspect ratio or image size ignored on Gemini | `imageConfig` is reported as **silently ignored on some SDK and proxy paths** (litellm, js-genai issues) | Move to the current `interactions` API with `response_format`, or bypass the proxy/SDK and call REST directly |
| Reference images beyond the 6th/5th/3rd appear ignored on NBP | You exceeded a per-category cap (6 objects / 5 characters / 3 style) even though you were under the 14 total | Rebalance by category, not by total count |
| More than 16 references rejected on OpenAI | 16 is the hard cap on `/v1/images/edits` | Reduce, or composite in two passes |
| A reference upload fails | Per-image cap is **20971520 bytes (20 MiB)** | Downsample or re-encode below 20 MiB before upload |
| Hard refusal mentioning "prominent people" on NBP | Nano Banana Pro hard-refuses prompts involving prominent real people | **Switch to `gpt-image-2`.** Rewording rarely helps; this is a category refusal |
| Replicate call returns something that does not look like NBP output | `allow_fallback_model: true` and NBP was at capacity, so `bytedance/seedream-5` rendered it | Set `allow_fallback_model: false` and retry with backoff. Check the prediction record to confirm which model ran |
| `output[0]` is a single character | The Replicate output is **a string URI, not an array**, so indexing gives you one character | Use `output` directly as the URI |
| 403 on first OpenAI image call | API Organization Verification not completed | Complete verification in the OpenAI dashboard |
| A field you read about does not exist | No `seed`, no negative prompt, no CFG on Nano Banana Pro. No `--no` / weights / `::` emphasis on OpenAI | Express exclusions as plain English sentences inside the prompt ("no watermark", "no extra text") |
| Text in the image is garbled | Text-rendering rank between the two models is genuinely unsettled and language-dependent | **Test both models on your actual string.** Put literal text in straight quotes, spell tricky words letter by letter, use `quality: "high"` |

---

## 8. Quick reference card

```
NOT A MODEL:  "Sol 5.6 ULTRA"
REAL:         gpt-5.6-sol  (text-only reasoning; effort none|low|medium|high|xhigh|max)
REAL:         gpt-image-2  (= ChatGPT Images 2.0; alias chatgpt-image-latest, dies 2026-12-01)
REAL:         gemini-3-pro-image  (= Nano Banana Pro)
PIPELINE:     reason with gpt-5.6-sol -> render with gpt-image-2   ("plan-then-generate")

SKIN / CANDID / 4K / 5-PERSON SERIES  -> gemini-3-pro-image
REAL NAMED PEOPLE / ALPHA MASK / TRANSPARENT BG / DIAGRAMS -> gpt-image-2
TEXT IN IMAGE -> contested, test both
BOTH -> Gemini base plate + GPT typography pass, composited

gpt-image-2 size: edges %16 == 0, max edge < 3840, aspect <= 3:1, px 655360..8294400
NBP refs: 6 objects + 5 characters + 3 style, 14 total
NBP price: $0.134 per 1K/2K image, $0.24 per 4K
gpt-image-2 price: $8 / $2 / $30 per 1M tokens, per-image cost UNKNOWN
Replicate: google/nano-banana-pro, output is ONE URI STRING
MCP: mcp.replicate.com or npx -y replicate-mcp, REPLICATE_API_TOKEN
     models.search | models.list | models.get | predictions.create | predictions.get
```

All facts in this guide are sourced from [distilled-image-models.md], researched 2026-08-17. Treat prices, enums, and deprecation clocks as snapshot-dated and re-verify with `models.get` or the vendor reference page before a production run.
