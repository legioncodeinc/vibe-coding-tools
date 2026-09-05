# Distilled: Image Models, Operational Reference

Scope: OpenAI GPT Image family (`gpt-image-2` and predecessors) and Google "Nano Banana" family (Gemini 3 Pro Image and siblings), plus the Replicate access path. Every claim carries a `[raw/...]` citation to a file in `references/research/raw/`. All research fetched **2026-08-17**; treat prices, enums, and deprecation clocks as snapshot-dated.

Labels used below:
- **[CONFIRMED]** = stated by a vendor/official-docs source.
- **[PRACTITIONER]** = community/trade-press source, single-tester or unverified.
- **[INFERRED]** = my reading, not stated in any source.
- **[UNCONFIRMED]** = a source explicitly says it could not be verified.

---

## 1. Model identity and lifecycle

### 1.1 OpenAI: identifiers and names

| Consumer / marketing name | API model ID | Notes | Source |
|---|---|---|---|
| ChatGPT Images 2.0 | `gpt-image-2` | Same April 2026 release; three names for one thing | [raw/gptimage--chatgpt-images-2-0-naming-and-realism-claims--petapixel.md] |
| (none) | `chatgpt-image-latest` | API **alias** pointing at whatever image model ChatGPT currently serves; closest real ID to a colloquial "ChatGPT Image" | [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md] |
| (none) | `gpt-image-1.5` | Legacy; migration path available | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] |
| (none) | `gpt-image-1` | "Compatibility only" | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] |
| (none) | `gpt-image-1-mini` | "Cost-optimized batches" | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] |
| DALL-E 3 / DALL-E 2 | `dall-e-3`, `dall-e-2` | **Shut down 2026-05-12** | [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md] |

- There is **no** `chatgpt-image-2` identifier and **no** model literally named "ChatGPT Image 2" in the API surface [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md], [raw/gptimage--models-and-api-guide--openai-developers-docs.md].
- `gpt-image-2` launched **2026-04-21**, available same-day in the API and in Codex [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md].
- Access gate: users "may need to complete the API Organization Verification" before accessing any GPT Image model [raw/gptimage--models-and-api-guide--openai-developers-docs.md].

### 1.2 OpenAI: deprecation clock

| Model | Replacement | Announced | Shutdown | Source |
|---|---|---|---|---|
| `gpt-image-1-mini` | `gpt-image-2` | 2026-06-02 | **2026-12-01** | [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md] |
| `gpt-image-1.5` | `gpt-image-2` | 2026-06-02 | **2026-12-01** | same |
| `chatgpt-image-latest` | `gpt-image-2` | 2026-06-02 | **2026-12-01** | same |
| `dall-e-2` | `gpt-image-2` / `gpt-image-1` / `gpt-image-1-mini` | 2025-11-14 | 2026-05-12 (done) | same |
| `dall-e-3` | same | 2025-11-14 | 2026-05-12 (done) | same |
| `/v1/edits` (legacy) | `/v1/chat/completions` | 2023-07-06 | 2024-01-04 (done) | same |

- `gpt-image-2` is **the only image model with no announced end-of-life** [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md].
- `gpt-image-1` is *not* in the June 2026 batch but the cookbook labels it "Compatibility only" [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md].
- `/v1/images/variations` has no separate deprecation entry but was DALL-E-2-only and is "effectively dead" with the DALL-E shutdown [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md].
- Consequence: any advice relying on DALL-E-3's `style: "natural"` / `"vivid"` is dead; GPT Image models have no `style` parameter at all [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md], [raw/gptimage--generate-endpoint-params--openai-api-reference.md].

### 1.3 Google: identifiers behind "Nano Banana"

| Marketing name | Model ID | Notes | Source |
|---|---|---|---|
| **Nano Banana Pro** | `gemini-3-pro-image` | Premium/professional tier; built on Gemini 3 Pro | [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md], [raw/nanobanana--official-identity--blog-google-announcement.md] |
| Nano Banana 2 | `gemini-3.1-flash-image` | "Versatile workhorse" | [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md] |
| (none) | `gemini-3.1-flash-lite-image` | Fastest/cheapest; **1K only** | same |
| Nano Banana (original) | `gemini-2.5-flash-image` | Legacy | same |

- Preview ID at Nov 2025 launch was `gemini-3-pro-image-preview`; **GA ID is `gemini-3-pro-image`** [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md].
- Nano Banana Pro announced **2025-11-20**; official model name "Gemini 3 Pro Image" [raw/nanobanana--official-identity--blog-google-announcement.md].
- Neither Google announcement page carried an API model ID string or per-image pricing [raw/nanobanana--official-identity--blog-google-announcement.md], [raw/nanobanana--official-identity--blog-google-developers.md].

### 1.4 "Sol 5.6 ULTRA" is NOT a real image model

- **`gpt-5.6-sol` is a text-only reasoning model.** The model page describes it as "Frontier model for complex professional work." Input: text and images. **Output: text only. It does NOT generate images.** [raw/gptimage--sol-5-6-disambiguation--openai-model-page.md]
- Model IDs: `gpt-5.6-sol` (primary), `gpt-5.6` (alias). **No `gpt-5.6-sol-ultra` exists**; no variants or snapshots listed [raw/gptimage--sol-5-6-disambiguation--openai-model-page.md].
- `reasoning.effort` enum: **`none`, `low`, `medium` (default), `high`, `xhigh`, `max`.** There is
  **no level called "ultra"**; the top tiers are literally `xhigh` and `max`. A leaked-system-prompt file circulating as `gpt-5.6-sol-extra-high.md` is the most likely origin of a garbled "ULTRA" [raw/gptimage--sol-5-6-disambiguation--openai-model-page.md].
- `gpt-5.6-sol` specs: context window **1,050,000 tokens**; max output **128,000 tokens**; knowledge cutoff **February 16, 2026**; per 1M tokens input **$5.00**, cached input **$0.50**, output **$30.00** [raw/gptimage--sol-5-6-disambiguation--openai-model-page.md].
- "No primary source anywhere uses the string 'Sol 5.6 ULTRA' in connection with image generation" [raw/gptimage--sol-5-6-disambiguation--openai-model-page.md].

**The legitimate near-equivalent: plan-then-generate.** The real workflow the phrase gestures at is the documented **"Thinking mode"** pattern: a reasoning model (e.g. GPT-5.6 Sol at `high`/`xhigh`/`max` effort) plans and writes the prompt, then calls `gpt-image-2` via the Responses API `image_generation` tool. **That is a pipeline, not a product name** [raw/gptimage--sol-5-6-disambiguation--openai-model-page.md]. OpenAI's own launch post cites "Thinking mode for richer workflows", i.e. "integration with reasoning models so image generation can be planned in context before rendering" [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md].

**Caution when using that pipeline:** the mainline model "will automatically revise your prompt for improved performance," exposing the rewrite in `revised_prompt`. Your literal prompt is **not** necessarily what reaches the image model. The raw Image API (`/v1/images/generations`) does not apply this rewriting layer in the same way, giving more deterministic control over photographic language [raw/gptimage--models-and-api-guide--openai-developers-docs.md].

---

## 2. OpenAI `gpt-image-2` operational reference

### 2.1 Endpoints

| Endpoint | Purpose | Source |
|---|---|---|
| `POST /v1/images/generations` | Text-to-image | [raw/gptimage--generate-endpoint-params--openai-api-reference.md] |
| `POST /v1/images/edits` | Edits, multi-reference conditioning, inpainting | [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md] |
| `POST /v1/images/variations` | DALL-E-2 only, effectively dead | [raw/gptimage--models-and-api-guide--openai-developers-docs.md] |
| Responses API `image_generation` tool | Mainline model calls image gen as a tool | [raw/gptimage--models-and-api-guide--openai-developers-docs.md] |

Responses-API tool shape: `{ type: "image_generation", action: "auto|generate|edit", partial_images: number }`. `action` values: `"auto"` (the model decides), `"generate"` (force new image), `"edit"` (force editing of an existing image). Output: base64 image in the `result` field, plus optional `revised_prompt` [raw/gptimage--models-and-api-guide--openai-developers-docs.md]. Multi-turn iterative editing via `previous_response_id`, or by including prior image-generation call outputs in the context array [raw/gptimage--models-and-api-guide--openai-developers-docs.md].

### 2.2 Parameter table: `/v1/images/generations`

| Parameter | Type | Values / range | Notes | Source |
|---|---|---|---|---|
| `prompt` | string, **required** | **max 32,000 chars** (GPT image models); 1,000 DALL-E 2; 4,000 DALL-E 3 | The budget that makes long structured photographic briefs viable in one call | [raw/gptimage--generate-endpoint-params--openai-api-reference.md] |
| `model` | string, optional | Reference-page enum: `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`, `dall-e-3`, `dall-e-2`. Default `dall-e-2` **unless** a GPT-specific parameter is used | **Enum lags**, see conflict in 2.7 | same |
| `size` | string, optional | `auto`, `1024x1024`, `1536x1024`, `1024x1536`, **or a custom WIDTHxHEIGHT where each dimension is divisible by 16, up to a max of 3840x2160** | DALL-E 3: `1024x1024`, `1792x1024`, `1024x1792`; DALL-E 2: `256x256`, `512x512`, `1024x1024` | same |
| `quality` | string, optional | GPT: `auto`, `high`, `medium`, `low` (default `auto`). DALL-E 3: `auto`, `hd`, `standard`. DALL-E 2: `standard` | | same |
| `output_format` | string, optional | `png`, `jpeg`, `webp` (GPT image models only) | | same |
| `background` | string, optional | `transparent`, `opaque`, `auto` (default `auto`; GPT only) | | same |
| `style` | n/a | `vivid`, `natural`, **DALL-E 3 only** | **No `style` parameter exists for GPT image models**; photorealism must be carried by prompt text | same |
| `n` | number, optional | **1 to 10**. DALL-E 3 supports `n=1` only | | same |
| `stream` | boolean, optional | default `false` (GPT only) | | same |
| `partial_images` | number, optional | **0 to 3**, streaming only | | same |
| `output_compression` | number, optional | **0 to 100 (%)**, default `100`; webp/jpeg only | Below 100 introduces artifacts that read "digital", not as film grain | same |
| `response_format` | string | `url` or `b64_json`, **DALL-E 2/3 only**; URLs valid 60 minutes. **GPT image models always return base64** | | same |
| `moderation` | string, optional | `low`, `auto` (default `auto`; GPT only) | | same |
| `user` | string, optional | End-user identifier for abuse monitoring | | same |
| `input_fidelity` | n/a | **Not documented on the generate page**; it is an *edit* endpoint parameter | | same |

### 2.3 Parameter table: `/v1/images/edits`

| Parameter | Type | Values / range | Notes | Source |
|---|---|---|---|---|
| `image` | image(s) | **Up to 16 images** for GPT image models. Each as `file_id` ("The File API ID of an uploaded image") or `image_url` ("A fully qualified URL or base64-encoded data URL"), **max 20971520 bytes (20 MiB) per image** | The documented reference-conditioning mechanism. **No "reference strength" or IP-Adapter-style weight parameter exists** | [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md] |
| `mask` | image, optional | `file_id` or `image_url` (one is required) | Inpainting; **transparent regions of the mask mark the editable area** | same |
| `prompt` | string, **required** | **1 to 32000 characters** | | same |
| `model` | string | Listed: `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`, `chatgpt-image-latest` | Same lagging-enum caveat | same |
| `input_fidelity` | string, optional | `"high"` or `"low"`. "Controls fidelity to the original input image(s)." | **Disabled on `gpt-image-2`**, see 2.5 | same |
| `background` | string, optional | `transparent`, `opaque`, `auto` | | same |
| `quality` | string, optional | `low`, `medium`, `high`, `auto` ("Available for GPT image models only") | | same |
| `size` | string, optional | `auto`, `1024x1024`, `1536x1024`, `1024x1536` | **Narrower than generate**; no custom WIDTHxHEIGHT documented here | same |
| `output_format` | string, optional | `png`, `jpeg`, `webp` ("Supported for GPT image models") | | same |
| `output_compression` | number, optional | 0 to 100 for JPEG/WebP output | | same |
| `n` | number, optional | **1 to 10** generated images | | same |
| `stream` / `partial_images` | boolean / number | "Stream partial image results as events."; `partial_images` 0 to 3 | | same |
| `moderation` | string, optional | `low`, `auto` (GPT image models only) | | same |
| `user` | string, optional | Abuse-monitoring identifier | | same |

### 2.4 `gpt-image-2` resolution constraints (exact, from the cookbook table)

| Constraint | Value | Source |
|---|---|---|
| Max edge | **< 3840 px** | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] |
| Edge granularity | both edges **multiples of 16** | same |
| Aspect ratio cap | **<= 3:1** | same |
| Total pixel count | **655,360 to 8,294,400** | same |
| Experimental zone | treat sizes above **2560x1440** as **experimental** | same |
| Advertised ceiling | "up to **2K resolution**" via the API; aspect ratios **3:1 (wide) to 1:3 (tall)** | [raw/gptimage--chatgpt-images-2-0-naming-and-realism-claims--petapixel.md], [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md] |

[INFERRED] The "<= 3:1" cap and the "3:1 to 1:3" press framing describe the same limit from opposite ends (ratio magnitude in either orientation).

### 2.5 The `input_fidelity` situation (critical)

Cookbook model comparison table, as published [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md]:

| Model | Quality settings | `input_fidelity` | Resolutions | Primary use |
|---|---|---|---|---|
| `gpt-image-2` | low, medium, high | **Disabled** | Any meeting constraints (max edge <3840px, multiples of 16) | "Recommended default for new builds"; highest quality |
| `gpt-image-1.5` | low, medium, high | low, high | 1024x1024, 1024x1536, 1536x1024, auto | Legacy; migration path available |
| `gpt-image-1` | low, medium, high | low, high | same | Compatibility only |
| `gpt-image-1-mini` | low, medium, high | low, high | same | Cost-optimized batches |

Verbatim: "Disabled. `input_fidelity` does not work for this model because output is already high fidelity by default." [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md]

On the models where it does work it is "helpful for identity and likeness preservation during scene edits" [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/gptimage--prompting-guide-1-5--openai-cookbook.md]. `high` "preserves fine detail, faces, logos and texture from the input images at higher token cost"; `low` "re-imagines more of the frame" [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md].

**The trap:** `input_fidelity` is supported only on models being retired (`gpt-image-1.5`, `gpt-image-1`, and the minis), so the explicit likeness-fidelity knob
**disappears from the platform on 2026-12-01**. After that, reference fidelity must be carried entirely by multi-image inputs on `/v1/images/edits` plus explicit preserve-list prompting [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md].

### 2.6 Mask alpha semantics

- API reference: the mask is an "image reference indicating the area to edit"; **transparent regions of the mask mark the editable area** [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md].
- Practitioner restatement: "mask-based inpainting uses alpha transparency, **opaque = preserve, transparent = regenerate**" [PRACTITIONER] [raw/gptimage--practitioner-prompt-conventions--gpt-image2-skill-repo.md].
- These agree. Better-supported reading: the official API reference.

### 2.7 Conflict: which models does the enum allow?

| Reading | Support |
|---|---|
| `model` enum = `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`, `dall-e-3`, `dall-e-2` (no `gpt-image-2`) | The `/v1/images/generations` reference page as fetched [raw/gptimage--generate-endpoint-params--openai-api-reference.md] |
| `gpt-image-2` is current and callable | The image-generation **guide** lists `gpt-image-2` as latest [raw/gptimage--models-and-api-guide--openai-developers-docs.md]; the launch announcement says it is available in the API [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md]; the cookbook comparison table includes it [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] |

**Better-supported reading: `gpt-image-2` is current; the reference-page enum is lagging.** The raw file states this explicitly: "Treat `gpt-image-2` as current and this enum as lagging" [raw/gptimage--generate-endpoint-params--openai-api-reference.md].

### 2.8 Pricing: `gpt-image-2`

| Line | Price per 1M tokens | Source |
|---|---|---|
| Input | **$8.00** | [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md] |
| Cached input | **$2.00** | same |
| Output | **$30.00** | same |

No per-image price was published in the announcement [INFERRED from absence].

### 2.9 Reference-image input formats (Responses API)

Accepted as: fully qualified URLs; base64-encoded data URLs (`data:image/png;base64,{encoded}`); File IDs created with the Files API (purpose `"vision"`). Multiple reference images are supported simultaneously in a single request [raw/gptimage--models-and-api-guide--openai-developers-docs.md].

---

## 3. OpenAI prompting doctrine

### 3.1 The canonical prompt order (official)

**background/scene -> subject -> key details -> constraints** [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/gptimage--prompting-guide-1-5--openai-cookbook.md]

Also include the **intended use** (ad, UI mock, infographic) "so the model infers the right polish level" [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md]. The community skill repo restates both rules verbatim [PRACTITIONER] [raw/gptimage--practitioner-prompt-conventions--gpt-image2-skill-repo.md].

### 3.2 Labeled segments over paragraph

"For complex requests, [use] short labeled segments or line breaks instead of one long paragraph." [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/gptimage--prompting-guide-1-5--openai-cookbook.md]

Counterpoint on syntax [PRACTITIONER]: "Any format works; consistency matters more." Minimal prompts, JSON structures, instruction-style prose, and tag/booru-style lists all succeed; "For production, prefer a skimmable template over clever syntax." Explicitly: no weights, no `::` emphasis, no `--no` negatives [raw/gptimage--practitioner-prompt-conventions--gpt-image2-skill-repo.md]. [INFERRED] These are compatible: OpenAI prescribes *structure*, the practitioner source denies that any *particular* syntax is magic.

### 3.3 The literal trigger word

"include the word **'photorealistic'** directly in the prompt to strongly engage the model's photorealistic mode" [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md]

Named helpful variants: **"real photograph," "taken on a real camera," "professional photography," "iPhone photo"** [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md]; restated as "say 'photorealistic' directly; 'real photograph', 'taken on a real camera', and 'iPhone photo' also help" [PRACTITIONER] [raw/gptimage--practitioner-prompt-conventions--gpt-image2-skill-repo.md].

Adjacent rule: "Prompt the model as if a real photo is being captured in the moment." [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/gptimage--prompting-guide-1-5--openai-cookbook.md]

### 3.4 Optical language beats quality adjectives (sharpest primary-source statement)

"Composition terms (lens, aperture feel, lighting) often steer realism more reliably than generic 'ultra-detailed'" [raw/gptimage--prompting-guide-1-5--openai-cookbook.md]

- Note the hedge "**aperture feel**", the guide's own admission that the model approximates the *look* of an aperture rather than simulating it [raw/gptimage--prompting-guide-1-5--openai-cookbook.md].
- Camera specs are a vibe control: they "may be interpreted loosely, so use them mainly for high-level look and composition" [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md].
- "Avoid words that imply studio polish or staging." The raw file names the offenders: *pristine, flawless, perfect, ultra-detailed, 8K, hyperdetailed, masterpiece* [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md].

### 3.5 Imperfection prompting (explicit, official)

"Use photography language (lens, lighting, framing) and explicitly ask for real texture (pores, wrinkles, fabric wear, imperfections)." [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/gptimage--prompting-guide-1-5--openai-cookbook.md]

Official example prompt, quoted: "Create a photorealistic candid photograph of an elderly sailor standing on a small fishing boat", with "weathered skin with visible wrinkles, pores, and sun texture" and "soft coastal daylight, shallow depth of field, subtle film grain." The three-part recipe visible in it: (a) **candid** not posed/staged, (b) **named skin/texture imperfections**, (c) **named optical/physical properties** [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md].

**Why imperfection must be prompted: the mechanism, officially acknowledged.** A professional creator (working at 6,000 x 4,000 px) reported an "over-processed" or "plastic" look, micro-details "overly smoothed," and specifically absent "skin pores, fabric fibers, weathered stone, organic noise", calling it an "uncanny valley of smoothness." OpenAI staff replied (April 21, 2026) acknowledging the issue stems from models balancing "denoising, coherence, and detail," which "smooth[s] out high-frequency texture" [raw/gptimage--plastic-look-failure-mode--openai-developer-community.md].

Consequences recorded in that file:
- Micro-texture must be **named as subject matter** ("visible pores", "fine vellus hair", "fabric slub", "dust on the lens barrel"), because it will not survive by default.
- **No "Style Raw" / no-polish switch exists in the API. There is no parameter that turns off smoothing**, only `quality`, and quality raises polish, not grit.
- Upscaling an OpenAI output does not add texture; it stretches an already-denoised image.
- No workarounds were reported in the thread; no follow-up from OpenAI confirming a fix. [raw/gptimage--plastic-look-failure-mode--openai-developer-community.md]

OpenAI's own marketing frames the same axis positively: the model is "better able to capture the defining characteristics of photos, including **the tiny flaws that add realism**" [raw/gptimage--chatgpt-images-2-0-naming-and-realism-claims--petapixel.md].

### 3.6 No negative-prompt syntax, and what to do instead

"State exclusions and invariants explicitly (e.g., 'no watermark,' 'no extra text')." [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] "State exclusions and invariants explicitly (e.g., 'no watermark,' 'no logos/trademarks')" [raw/gptimage--prompting-guide-1-5--openai-cookbook.md]

"**The guide does not document any negative-prompt or exclusion syntax** (no `--no`, no weights, no parentheses emphasis). Exclusions are plain English sentences inside the prompt." [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] Corroborated [PRACTITIONER]: "There are no weights, no `::` emphasis, no `--no` negatives" [raw/gptimage--practitioner-prompt-conventions--gpt-image2-skill-repo.md].

### 3.7 Edit drift and its mitigation

Use **"change only X" + "keep everything else the same," and repeat the preserve list**, which "reduces drift on iterative work." [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] "...and repeat the preserve list on each iteration to reduce drift" [raw/gptimage--prompting-guide-1-5--openai-cookbook.md]

Identity/likeness technique, documented:
- "Explicitly lock the person (face, body shape, pose, hair, expression)"
- e.g. "Replace only the clothing, fitting the garments naturally to her existing pose"
- Require "realistic fabric behavior" and matching shadows
- On precision edits, preserve "camera angle, lighting, shadows, and surrounding context"; "**Repeat the preserve list on each iteration to reduce drift.**" [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md]

Iteration strategy: "Start with a clean base prompt, then refine with small, single-change follow-ups" [raw/gptimage--prompting-guide-1-5--openai-cookbook.md].

### 3.8 Other official rules worth carrying

| Topic | Rule | Source |
|---|---|---|
| Composition | "Specify framing and viewpoint (close-up, wide, top-down), perspective/angle (eye-level, low-angle)"; include "lighting/mood (soft diffuse, golden hour, high-contrast)"; call out placement ("logo top-right," "subject centered") | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] |
| People / pose | Describe "scale, body framing, gaze, and object interactions", e.g. "full body visible, feet included," "child-sized relative to the table" | same |
| In-image text | Put literal text **in quotes or ALL CAPS**; specify typography (font style, size, color, placement); spell tricky words **letter-by-letter**; use `medium` or `high` quality for small text and dense information panels | same, [raw/gptimage--prompting-guide-1-5--openai-cookbook.md] |
| In-image text [PRACTITIONER] | "Any text that must appear in the image, slogans, prices, kanji, should be in straight quotes. Do not paraphrase it inside the prompt." `quality high` treated as mandatory for "in-image text, dense diagrams, small labels, and multi-panel layouts" | [raw/gptimage--practitioner-prompt-conventions--gpt-image2-skill-repo.md] |
| Multi-image | "Reference each input by **index and description**" ("Image 1: product photo..."); describe how they interact ("apply Image 2's style to Image 1"); when compositing "be explicit about which elements move where" | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/gptimage--prompting-guide-1-5--openai-cookbook.md] |
| Quality dial | Start `quality="low"` and evaluate; use `medium` or `high` for "small or dense text, detailed infographics, close-up portraits, identity-sensitive edits" | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/gptimage--prompting-guide-1-5--openai-cookbook.md] |
| Aspect ratio [PRACTITIONER] | "model composition improves when aspect is both flagged and mentioned in prose"; the `size` parameter alone under-informs composition | [raw/gptimage--practitioner-prompt-conventions--gpt-image2-skill-repo.md] |
| Subject hierarchy [PRACTITIONER] | "Complex scenes work best when one subject is clearly primary" | same |
| Moderation [PRACTITIONER] | The community CLI defaults to `--moderation low` vs the API default `auto` | same |
| Product mockups | Keep "background opaque" (use downstream removal if transparency is needed); "crisp silhouette, no halos/fringing"; "Preserve product geometry and label legibility exactly" | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] |
| What to avoid | Overly long prompts without clear structure; generic stock-photo language for professional work; detailed camera specs expecting exact physical simulation; assuming the model preserves identity/geometry without explicit constraints; re-generating entire scenes when surgical edits suffice | same |

---

## 4. Google Nano Banana Pro operational reference

### 4.1 Endpoint and config shape

- Endpoint: **`POST https://generativelanguage.googleapis.com/v1beta/interactions`** [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md]
- Config parameters on the current `interactions` API:
  - `response_format`: output type, MIME type, **aspect ratio**, **image size**
  - `generation_config`: includes **`thinking_level`** with values **`minimal`** or **`high`**
  - `tools`: array supporting `{"type": "google_search"}` with optional `search_types`
  - Multi-turn conversational iteration via **`previous_interaction_id`** [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md]
- Legacy `generateContent` form used `generationConfig.imageConfig.aspectRatio` and `generationConfig.imageConfig.imageSize`, plus `responseModalities: ["TEXT","IMAGE"]`. Third-party bug reports show **`imageConfig` being silently ignored by some SDK/proxy paths** (litellm #17075, #18656, #21070; googleapis/js-genai #1461) [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md].
- SDK coverage: Python (`google-genai`), JavaScript, REST [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md].

### 4.2 Resolutions and aspect ratios

| Item | Values | Source |
|---|---|---|
| Image sizes | **512px (0.5K), 1K, 2K, 4K**; the Lite model supports **1K only** | [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md] |
| Aspect ratio enum (verbatim) | `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` | same |
| Announcement framing | "2K and 4K resolution" available (1K is the base tier per API docs) | [raw/nanobanana--official-identity--blog-google-announcement.md], [raw/nanobanana--official-identity--blog-google-developers.md] |

[INFERRED] The docs enum lists 10 aspect ratios; the Replicate file mentions "docs elsewhere list 11 options incl. a 'match input image' option" [raw/nanobanana--replicate-schema--replicate-llms-txt.md]; the 11th value is unconfirmed here.

### 4.3 The THREE separate reference-image limits

Verbatim per-model table [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md]:

| Model | Objects | Characters | Style references |
|---|---|---|---|
| 3.1 Flash Lite | 14 | N/A | N/A |
| 3.1 Flash | 10 | 4 | N/A |
| **3 Pro (Nano Banana Pro)** | **6** | **5** | **3** |

The total input cap is separate: **up to 14 images** as inputs for composition work, maintaining consistency of **up to 5 people** [raw/nanobanana--official-identity--blog-google-announcement.md]. Google's developer blog states it verbatim in one sentence: "Achieve consistent resemblance for up to five individuals, integrate six high-fidelity shots, or blend as many as fourteen standard inputs into a single, polished ad.", read as 5 character references / 6 high-fidelity object references / 14 total standard inputs [raw/nanobanana--official-identity--blog-google-developers.md].

[INFERRED] The "6 objects / 5 characters / 3 style" table and the "14 total" figure are different axes, not a contradiction: 14 is the total input budget, the other three are per-category caps.

### 4.4 Features and editing capabilities

| Capability | Detail | Source |
|---|---|---|
| Text rendering | "legible, stylized text generation"; the announcement calls it "the best model for creating images with correctly rendered and legible text directly in the image," supporting "multiple languages" and "a wider variety of textures, fonts and calligraphy" | [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md], [raw/nanobanana--official-identity--blog-google-announcement.md] |
| Search grounding | Web search and image search; real-time information integration | same |
| Video-to-image | **3.1 Flash only**; accepts YouTube URLs or uploaded files | [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md] |
| Interleaved content | 3 Pro generates combined text + image responses | same |
| Thinking mode | **Default enabled**; generates interim "thought images" | same |
| Inpainting | **Semantic masking, no mask file required, describe the region** | same |
| Editing verbs | Add / remove / modify elements; style transfer; localized editing; camera-angle adjustment; color grading; scene-lighting transformation; depth of field; specific image regions | same, [raw/nanobanana--official-identity--blog-google-announcement.md], [raw/nanobanana--replicate-schema--replicate-llms-txt.md] |
| Multi-turn | Conversational iteration via `previous_interaction_id` | [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md] |
| Provenance | SynthID watermark applied to **all** generated images | same |

### 4.5 Official pricing (Gemini API, per 1M tokens)

| Model | Output | Input | Per-image equivalents | Source |
|---|---|---|---|---|
| Gemini 3 Pro Image (Nano Banana Pro) | **$120.00 (images)** | **$2.00 (text/image)**, "equivalent to $0.0011 per image" | "$0.134 per 1K/2K image and $0.24 per 4K image" | [raw/nanobanana--pricing--ai-google-dev-pricing.md] |
| Gemini 3.1 Flash Image (Nano Banana 2) | **$60.00 (images)** | **$0.50 (text/image)** | "$0.045 per 0.5K image, $0.067 per 1K image, $0.101 per 2K image, and $0.151 per 4K image" | same |

Token consumption (verbatim): 3 Pro, outputs from 1024x1024 (1K) up to 2048x2048 (2K)
**consume 1120 tokens**; outputs up to 4096x4096 (4K) **consume 2000 tokens**. 3.1 Flash: 0.5K
**747**, 1K **1120**, 2K **1680**, 4K **2520** [raw/nanobanana--pricing--ai-google-dev-pricing.md].

Takeaway: Nano Banana Pro is roughly **2x** the output token price of 3.1 Flash Image and **4x** the input price [raw/nanobanana--pricing--ai-google-dev-pricing.md]. Google's own developer blog notes "higher cost and latency" versus Gemini 2.5 Flash Image [raw/nanobanana--official-identity--blog-google-developers.md].

---

## 5. Replicate access path

### 5.1 Model slug and version

- Slug: **`google/nano-banana-pro`**. Related slugs: `google/nano-banana` (Gemini 2.5 Flash Image, the original), `google/nano-banana-2` / `google/gemini-3-flash-image` family (**verify slug before use**). Latest version date shown on the model page: **2026-07-21**; total runs ~34.1M [raw/nanobanana--replicate-schema--replicate-llms-txt.md].

### 5.2 Input schema (verbatim field names, types, descriptions)

| Field | Type | Required | Description (verbatim) | Source |
|---|---|---|---|---|
| `prompt` | string | yes | "A text description of the image you want to generate" | [raw/nanobanana--replicate-schema--replicate-llms-txt.md] |
| `image_input` | array (image URIs/files) | no | "Input images to transform or use as reference (supports up to 14 images)" | same |
| `aspect_ratio` | string | no | "Aspect ratio of the generated image", values seen: `1:1`, `4:3`, `3:4`, `16:9`, `9:16` | same |
| `resolution` | string | no | "Resolution of the generated image", values: `1K`, `2K`, `4K` | same |
| `output_format` | string | no | "Format of the output image", values: `png`, `jpg` (jpeg) | same |
| `safety_filter_level` | string | no | enum `block_low_and_above`, `block_medium_and_above`, `block_only_high`. Verbatim: "block_low_and_above is strictest, block_medium_and_above blocks some prompts, block_only_high is most permissive but some prompts will still be blocked" | same |
| `allow_fallback_model` | boolean | no | "Fallback to another model (currently bytedance/seedream-5) if Nano Banana Pro is at capacity" | same |

### 5.3 Output shape (verbatim)

```json
{ "type": "string", "title": "Output", "format": "uri" }
```
**A single image URI, a string, not an array**, unlike some Replicate image models [raw/nanobanana--replicate-schema--replicate-llms-txt.md].

Calling forms (both from the same source): `replicate.run("google/nano-banana-pro", input={...})` in Python; `POST https://api.replicate.com/v1/predictions` with `Authorization: Bearer $REPLICATE_API_TOKEN`, `Prefer: wait`, body `{"version":"google/nano-banana-pro","input":{"prompt":"...","resolution":"2K"}}` [raw/nanobanana--replicate-schema--replicate-llms-txt.md].

### 5.4 Official Replicate MCP server

| Item | Value | Source |
|---|---|---|
| Existence | **Official** Replicate MCP server, announced **2025-08-10** (replicate.com/blog/remote-mcp-server) | [raw/nanobanana--replicate-mcp--replicate-docs-reference-mcp.md] |
| Remote URL (recommended) | **`mcp.replicate.com`** | same |
| Remote auth | Web-based OAuth flow (Cloudflare OAuth Provider Framework for Workers); you supply a Replicate API key that the server uses on your behalf; tokens stored in Cloudflare KV, kept separate from the AI tool | same |
| Local invocation | **`npx -y replicate-mcp`**, with `REPLICATE_API_TOKEN` in env; requires a recent Node.js | same |
| Claude Desktop config | `claude_desktop_config.json`, `mcpServers.replicate = { "command": "npx", "args": ["-y","replicate-mcp"], "env": { "REPLICATE_API_TOKEN": "your-token-here" } }` | same |
| Cursor config | `.cursor/mcp.json`, same object shape under `mcpServers` | same |
| VS Code / GitHub Copilot config | `.vscode/mcp.json`, same object shape but under the key **`servers`** | same |

**Tool names exposed** (they mirror Replicate's HTTP API) [raw/nanobanana--replicate-mcp--replicate-docs-reference-mcp.md]:

| Tool | Purpose |
|---|---|
| `models.search` | Model discovery |
| `models.list` | Model comparison |
| `models.get` | Fetch metadata, "this is how you pull a model's live input schema" |
| `predictions.create` | Run models |
| `predictions.get` | Retrieve predictions |

Responses can be filtered with a WebAssembly `jq` implementation to keep JSON small [raw/nanobanana--replicate-mcp--replicate-docs-reference-mcp.md].

Limitations noted: Claude Desktop support is **local-only** (not the web app); "Code mode" is experimental and requires Deno, with remote cloud sandboxing under development [raw/nanobanana--replicate-mcp--replicate-docs-reference-mcp.md]. Community (non-official) alternatives: `deepfates/mcp-replicate`, `gerred/mcp-server-replicate` [raw/nanobanana--replicate-mcp--replicate-docs-reference-mcp.md].

### 5.5 What could NOT be confirmed [UNCONFIRMED]

- **Replicate's exact per-image price** for `google/nano-banana-pro`: not listed on replicate.com/pricing, and the model page's price badge is client-rendered and did not appear via WebFetch. Google's list price is $0.134/image at 1K to 2K and $0.24/image at 4K; "Replicate typically charges at or slightly above passthrough" [raw/nanobanana--replicate-schema--replicate-llms-txt.md].
- **The full 11-value `aspect_ratio` enum and the field defaults** were not retrievable [raw/nanobanana--replicate-schema--replicate-llms-txt.md].
- Replicate's own prompting blog post references **only** `prompt` and `aspect_ratio` [raw/nanobanana--replicate-schema--replicate-llms-txt.md].

---

## 6. Google prompting doctrine

### 6.1 Core principle

**"Describe the scene, don't just list keywords."** [raw/nanobanana--prompting--developers-googleblog-flash-image.md], [raw/nanobanana--prompting--ai-google-dev-prompt-guide.md]

The model "excels with a narrative, descriptive paragraph" rather than disconnected terms [raw/nanobanana--prompting--developers-googleblog-flash-image.md]. Hyper-specificity example (verbatim): instead of "fantasy armor," write "ornate elven plate armor, etched with silver leaf patterns, with a high collar and pauldrons shaped like falcon wings" [raw/nanobanana--prompting--developers-googleblog-flash-image.md], [raw/nanobanana--prompting--ai-google-dev-prompt-guide.md].

### 6.2 The photorealism template (VERBATIM)

```
A photorealistic [type of shot] of a [subject description] in a [setting
description]. [Description of the light]. Shot from a [camera angle]
with a [lens type].
```
[raw/nanobanana--prompting--ai-google-dev-prompt-guide.md]

Google's guidance for this template: "use photography terms, camera angles, lens types, lighting, and fine details, to steer the model toward a photorealistic result." Official example (verbatim): "A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens." [raw/nanobanana--prompting--ai-google-dev-prompt-guide.md]

### 6.3 The eight documented prompt slots (Google's own order)

1. shot type  2. subject  3. action  4. environment  5. lighting  6. mood  7. camera/lens details
8. aspect ratio [raw/nanobanana--prompting--developers-googleblog-flash-image.md] This is "the checklist behind the one-line template in the API docs" [raw/nanobanana--prompting--developers-googleblog-flash-image.md].

### 6.4 Named vocabulary Google itself recommends

| Category | Terms named | Source |
|---|---|---|
| Shot types | `wide-angle shot`, `macro shot`, `close-up`, `portrait` | [raw/nanobanana--prompting--ai-google-dev-prompt-guide.md] |
| Angles | `low perspective`, `low-angle perspective`, `elevated 45-degree shot`, `Dutch angle` | same, [raw/nanobanana--prompting--developers-googleblog-flash-image.md] |
| Lenses | `wide-angle lens`, `85mm portrait lens`, `macro lens` | same |
| Lighting | `three-point softbox setup`, `studio-lit`, `soft diffused highlights`, `sunbeams filtering down`, "eliminate harsh shadows" | [raw/nanobanana--prompting--ai-google-dev-prompt-guide.md] |

Google's framing of these terms: they give "compositional control" and "direct the final result" [raw/nanobanana--prompting--developers-googleblog-flash-image.md].

### 6.5 Other official templates (VERBATIM)

**Product mockups and commercial photography:**
```
A high-resolution, studio-lit product photograph of a [product description]
on a [background surface/description]. The lighting is a [lighting setup,
e.g., three-point softbox setup] to [lighting purpose]. The camera angle is
a [angle type] to showcase [specific feature].
```
**Stylized illustrations and stickers:**
```
A [style] of a [subject, with details about accessories or actions]
doing [activity]. The design features [visual qualities, e.g., bold outlines,
cel-shading, etc.] and [color/background preference].
```
**Accurate text in images:**
```
Create a [image type] for [brand/concept] with the text "[text to render]"
in a [font style]. The design should be [style description], with a
[color scheme].
```
**Minimalist / negative space:**
```
A minimalist composition featuring a single [subject] positioned in the
[bottom-right/top-left/etc.] of the frame. The background is a vast, empty
[color] canvas, creating significant negative space. Soft, subtle lighting.
[Aspect ratio].
```
**Sequential art:** `Make a 3 panel comic in a [style]. Put the character in a [type of scene].`

**Add / remove / modify elements:**
```
Using the provided image of [subject], please [add/remove/modify] [element]
to/from the scene. Ensure the change is [description of how the change should
integrate].
```
**Inpainting (semantic masking, no mask file needed):**
```
Using the provided image, change only the [specific element] to [new
element/description]. Keep everything else in the image exactly the same,
preserving the original style, lighting, and composition.
```
**Style transfer:**
```
Transform the provided photograph of [subject] into the artistic style of
[artist/art style]. Preserve the original composition but render it with
[description of stylistic elements].
```
All of the above verbatim from [raw/nanobanana--prompting--ai-google-dev-prompt-guide.md].

[INFERRED] Google's inpainting template and OpenAI's edit doctrine converge on the same "change only X / keep everything else the same" formula: a cross-vendor portable idiom.

Replicate's own guidance adds [PRACTITIONER]: the model has "intermediary prompting layers that help the model make logical conclusions" (you can ask it to "show your work"); it "tolerates long, detailed prompts with precise adherence"; editing idiom shown: "Make him [insert scenario here]. Keep his whiteboard style, but make the surroundings realistic"; it can deduce landmarks from GPS coordinates but needs Search tools for real-time data; "structured tool calling coming soon" [raw/nanobanana--replicate-schema--replicate-llms-txt.md].

---

## 7. Provenance: what each platform embeds

### 7.1 OpenAI

| Signal | Detail | Source |
|---|---|---|
| C2PA (Content Credentials) | Cryptographically signed manifest | [raw/gptimage--c2pa-provenance-signals--openai-help-center.md] |
| SynthID | Invisible watermark embedded in the pixels, via partnership with Google | same, [raw/gptimage--provenance-policy-stance--openai-blog-and-usage-policies.md] |

"Supported images generated with ChatGPT, Codex, and the OpenAI API include both signals." Coverage is explicitly hedged: it "varies by product, model, export path, file type, and creation date" [raw/gptimage--c2pa-provenance-signals--openai-help-center.md].

**Manifest field names.** The only primary source naming actual fields is Microsoft's Azure OpenAI doc (verbatim table) [raw/gptimage--c2pa-manifest-fields--microsoft-azure-openai-docs.md]:

| Field | Content |
|---|---|
| `"description"` | `"AI Generated Image"` for all generated images, attesting to the AI-generated nature of the image |
| `"softwareAgent"` | `"Azure OpenAI DALL-E"` or `"Azure OpenAI ImageGen"` (DALL-E series / GPT-image-1 series models in Azure OpenAI) |
| `"when"` | The timestamp of when the content credentials were created |

Signed by a certificate that traces back to Azure OpenAI; issuing organization **Microsoft Corporation**. Caveats: these `softwareAgent` values are **Azure-specific** (images generated through OpenAI's own API carry an OpenAI-issued certificate and a different `softwareAgent` string, which OpenAI does not publish); the doc does not enumerate `gpt-image-2`; and it does **not** document `digitalSourceType` or the `c2pa.actions` list [raw/gptimage--c2pa-manifest-fields--microsoft-azure-openai-docs.md]. OpenAI's own help article describes the manifest only in prose: it "can include the tool or service that created a file, when it was created, and other details about its origin or history" [raw/gptimage--c2pa-provenance-signals--openai-help-center.md].

OpenAI's provenance blog (dated **May 19, 2026**, updated **July 31, 2026** for audio): OpenAI is "a C2PA Conforming Generator Product," has added Content Credentials to images since 2024, and the metadata uses "cryptographic signatures to help information about a piece of media securely travel with the content itself"; SynthID is an "invisible watermarking layer that complements C2PA metadata-based approaches" applied to images from ChatGPT, Codex, and the OpenAI API [raw/gptimage--provenance-policy-stance--openai-blog-and-usage-policies.md]. Verification tool: **openai.com/verify**, which reports whether the file contains "supported OpenAI provenance signals, such as a SynthID watermark or a trusted C2PA manifest" [raw/gptimage--c2pa-provenance-signals--openai-help-center.md].

### 7.2 Google: two technologies, two domains

| Technology | Domain | Durability | Source |
|---|---|---|---|
| **SynthID** | **Pixel domain**: "adds an invisible digital watermark", "It's added the moment content is created" | "designed to stand up to modifications like cropping, adding filters, changing frame rates, or lossy compression" | [raw/nanobanana--synthid--deepmind-synthid.md] |
| **C2PA / Content Credentials** | **Container domain**: "a technology that acts like a digital passport, documenting the digital content's origin and history, and is used for both AI and non-AI content" | Fragile | [raw/nanobanana--synthid--google-support-verify-ai-generated.md] |

Google's key robustness sentence (VERBATIM): "The digital watermark will usually still exist even if the image, video, or audio is re-scaled, re-colored, compressed or altered in other ways." Caveat (verbatim): "there's still a chance that after many alterations the watermark won't be detected." [raw/nanobanana--synthid--google-support-verify-ai-generated.md]

C2PA fragility (verbatim, practitioner): "Take a screenshot of an AI-generated image, save it as a new PNG, and the manifest is gone. Re-encode a video through a social platform's transcoder, and the credentials are stripped.", because "C2PA metadata lives in the file container" [raw/nanobanana--synthid--c2pa-vs-synthid-durability.md]. SynthID by contrast "modifies pixel values or audio samples in ways that are imperceptible to human senses but detectable by a trained classifier" and "survives operations that would destroy a metadata record. Screenshots, resizing, JPEG recompression, color grading, and minor crops all leave the watermark intact" [raw/nanobanana--synthid--c2pa-vs-synthid-durability.md].

SynthID's limitation (verbatim): it "can confirm that content came from a SynthID-enabled generator, but it cannot tell you who created it, when, what edits were applied" [raw/nanobanana--synthid--c2pa-vs-synthid-durability.md]. Google's own stated limits: "Gemini can currently only recognize content created by Google AI tools"; if a watermark is not detected "it could have been created by other AI systems"; and very simple or abstract content can be inconclusive [raw/nanobanana--synthid--google-support-verify-ai-generated.md].

Detection surfaces: Gemini app upload-and-ask; the **SynthID Detector** portal (image, video, audio), currently being tested with journalists and media professionals [raw/nanobanana--synthid--deepmind-synthid.md]; and, after Google I/O 2026, C2PA and SynthID detection integrated into **Google Search and Chrome** (right-click to check an image) [raw/nanobanana--synthid--c2pa-vs-synthid-durability.md]. Also **2026-05-19**: OpenAI joined the C2PA steering committee and adopted SynthID [raw/nanobanana--synthid--c2pa-vs-synthid-durability.md].

### 7.3 What survives stripping and what does not

| Operation | C2PA manifest | SynthID | Source |
|---|---|---|---|
| `exiftool -all=` or any re-save that drops XMP | **Removed** | **Intact and detectable** | [raw/nanobanana--synthid--c2pa-vs-synthid-durability.md], [raw/nanobanana--synthid--deepmind-synthid.md] |
| Screenshot | Gone | Survives | [raw/nanobanana--synthid--c2pa-vs-synthid-durability.md] |
| Social-platform upload / transcode | Stripped | Survives | same |
| JPEG recompression, resize, recolor, minor crop, color grading | Typically lost (container rewrite) | Survives | same, [raw/nanobanana--synthid--google-support-verify-ai-generated.md] |
| Many successive alterations | Gone | "chance that after many alterations the watermark won't be detected" | [raw/nanobanana--synthid--google-support-verify-ai-generated.md] |

OpenAI acknowledges the same asymmetry: metadata may be "stripped during upload, download, editing, conversion, or sharing," and watermarks may degrade through "compression, cropping, noise, edits, format conversion, or other transformations" [raw/gptimage--c2pa-provenance-signals--openai-help-center.md]. Its verification tool "will not make a definitive conclusion about whether the image was generated with OpenAI tools since provenance signals can in some cases be stripped" [raw/gptimage--provenance-policy-stance--openai-blog-and-usage-policies.md].

[INFERRED, from the Azure file] A photorealistic image delivered with its Content Credentials intact is **self-disclosing**; any workflow that re-encodes to JPEG/WebP through a tool that does not preserve XMP/JUMBF will silently drop it, "which is a documentation problem for the deliverer, not an automatic policy violation" [raw/gptimage--c2pa-manifest-fields--microsoft-azure-openai-docs.md].

### 7.4 August 2026 visible-watermark change (Google)

- **Date of change: 2026-08-14.** Google will allow users to turn off the **visible** watermark (the Gemini sparkle badge) on AI-generated images, videos and songs. Scope: **Nano Banana, Omni, and Lyria** models, in the **Gemini app** and the **Flow** video editor; Search support "coming soon." Setting path: **Settings > Media Watermark** [raw/nanobanana--tos-provenance--visible-watermark-optional-aug-2026.md].
- Google's statement (VERBATIM): "We're striking a balance here between creative control and safety: while the visible watermarks are now optional, invisible SynthID watermarks and C2PA metadata are still being used for transparency." [raw/nanobanana--tos-provenance--visible-watermark-optional-aug-2026.md]
- Prior state: a visible Gemini sparkle watermark applied to free-tier and Pro-tier outputs; **no** visible watermark for Google AI Ultra subscribers and Google AI Studio developer-tool users, with the invisible SynthID watermark remaining regardless [raw/nanobanana--official-identity--blog-google-announcement.md].
- **API / Replicate consequence:** API and Google AI Studio output has never carried the visible sparkle badge, so for a Replicate `google/nano-banana-pro` call: **no visible watermark, SynthID always present, C2PA manifest present in the file container (and lost on re-save/screenshot)** [raw/nanobanana--tos-provenance--visible-watermark-optional-aug-2026.md].

### 7.5 VERBATIM policy language, and the precise gap

**Neither vendor has an explicit anti-stripping clause.** What they actually have:

**Google, Generative AI Prohibited Use Policy**, section "Misinformation, misrepresentation, or misleading activities", under "Do not perform or facilitate the following activities":

> "Misrepresenting the provenance of generated content by claiming it was created solely by a
> human, in order to deceive"

Adjacent bullet in the same section:

> "Impersonating an individual (living or dead) without explicit disclosure, in order to deceive"

Anti-circumvention bullet ("Do not compromise the security of others' or Google's services"):

> "Circumvention of abuse protections or safety filters -- for example, manipulating the model to
> contravene our policies."

Generative AI Additional Terms of Service, use restrictions:

> "You may not use the Services to develop machine learning models or related technology."
> "you must comply with our Prohibited Use Policy, which provides additional details about
> appropriate conduct when using the Services."

Gemini API Additional Terms:

> "You may not use the Services to develop models that compete with the Services (e.g., Gemini API
> or Google AI Studio). You also may not attempt to reverse engineer, extract or replicate any
> component of the Services, including the underlying data or models (e.g., parameter weights)."
> "You may not attempt to bypass these protective measures or use content that violates the API
> Terms or these Additional Terms."

Google states that exceptions may be permitted for educational, documentary, scientific, or artistic purposes where public benefits outweigh harms. All of the above verbatim from [raw/nanobanana--tos-provenance--google-generative-ai-prohibited-use-policy.md].

**IMPORTANT NEGATIVE FINDING (Google), verbatim from the source:** as of 2026-08-17 there is "**no clause in any of Google's public generative-AI terms (Prohibited Use Policy, Generative AI Additional ToS, Gemini API Additional Terms) that explicitly prohibits removing, stripping, obscuring, or altering the SynthID watermark, C2PA Content Credentials, or EXIF/XMP metadata.** There is no 'you shall not remove our watermark' sentence to quote." [raw/nanobanana--tos-provenance--google-generative-ai-prohibited-use-policy.md] The enforceable hooks are the intent-based provenance-misrepresentation bullet, and the anti-circumvention bullet "whose plain reading targets safety filters rather than watermarks" [raw/nanobanana--tos-provenance--google-generative-ai-prohibited-use-policy.md].

**OpenAI, Usage Policies**, the two located clauses:

> "use of someone's likeness, including their photorealistic image or voice, without their consent
> in ways that could confuse authenticity"

> "deceit, fraud, scams, spam, or impersonation"

[raw/gptimage--provenance-policy-stance--openai-blog-and-usage-policies.md]

**Notable absence (OpenAI):** the usage policies "do **not** contain any clause about watermarks, C2PA, Content Credentials, provenance metadata, or an obligation to preserve technical indicators of AI generation. There is no 'do not remove the watermark' rule." [raw/gptimage--provenance-policy-stance--openai-blog-and-usage-policies.md] The help article likewise carries "**No explicit policy statement** about whether removing provenance metadata violates OpenAI's terms" [raw/gptimage--c2pa-provenance-signals--openai-help-center.md].

**Synthesis recorded in the sources:** re-encoding a photorealistic render (which incidentally drops the C2PA manifest) is not itself a named policy violation, but using the resulting image to pass off a real person's likeness or to deceive is squarely prohibited; SynthID survives most re-encodes regardless [raw/gptimage--provenance-policy-stance--openai-blog-and-usage-policies.md]. On Google's side: "do not attempt SynthID removal (it is designed to survive re-encoding anyway); routine EXIF stripping for privacy is not itself a policy breach, but presenting the result as a human-shot photograph in order to deceive is squarely prohibited. Use IPTC `digitalSourceType` = `trainedAlgorithmicMedia` to positively disclose instead" [raw/nanobanana--tos-provenance--google-generative-ai-prohibited-use-policy.md]. There is "no supported way to remove SynthID" [raw/nanobanana--synthid--c2pa-vs-synthid-durability.md].

**Jurisdictional caveat:** several regimes (EU AI Act Article 50 transparency obligations, and California and Chinese synthetic-media labeling rules) impose **statutory** disclosure duties stricter than OpenAI's own terms. "Vendor policy is the floor, not the ceiling" [raw/gptimage--provenance-policy-stance--openai-blog-and-usage-policies.md].

---

## 8. Failure modes and model selection

### 8.1 OpenAI GPT Image: documented weaknesses

| Failure mode | Evidence | Source |
|---|---|---|
| Plastic / over-processed look; "uncanny valley of smoothness"; missing skin pores, fabric fibers, weathered stone, organic noise | User report plus **OpenAI staff acknowledgement** that denoising/coherence "smooth[s] out high-frequency texture" | [raw/gptimage--plastic-look-failure-mode--openai-developer-community.md] |
| No mechanism to disable smoothing | "No 'Style Raw' / no-polish switch exists in the API"; `quality` "raises polish, not grit" | same |
| Upscaling does not recover texture | It "stretches an already-denoised image" | same |
| Precise physical reasoning / structural accuracy | OpenAI acknowledges continued limitations with "precise physical reasoning or highly detailed structural accuracy" | [raw/gptimage--chatgpt-images-2-0-naming-and-realism-claims--petapixel.md] |
| Downstream symptoms of the above [INFERRED in source] | Impossible optics (bokeh not matching the stated aperture, non-reciprocating reflections, shadow directions disagreeing between subject and background), plus hands, teeth, jewellery clasps, eyeglass hinges, background text | same |
| Prompt silently rewritten in the Responses API | `revised_prompt` shows the model's own revision | [raw/gptimage--models-and-api-guide--openai-developers-docs.md] |
| Photographic axis unaddressed by marketing | The launch announcement has **no explicit photorealism claim**, no quality-tier table, no input-fidelity guidance; the emphasis is on text rendering, layout and instruction following, i.e. the graphic-design axis | [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md] |
| Grading [PRACTITIONER, about 1.5] | "Slightly flat color grading in photo edits (cooler tones)"; looser, less cohesive layouts; "less consistent with dense text"; in style transformations "kept more shading and detail than the prompt asked for" | [raw/nanobanana--failure-modes--getimg-gpt-image-15-comparison.md] |

### 8.2 Nano Banana Pro: documented weaknesses (consolidated)

Verbatim from the Replicate README and both comparisons [raw/nanobanana--replicate-schema--replicate-llms-txt.md], [raw/nanobanana--failure-modes--getimg-gpt-image-15-comparison.md]:

1. "sometimes produce inaccurate or unexpected results."
2. Text: "occasional issues with grammar, spelling, or cultural nuances" (varies by language); can garble non-Latin scripts and dense multi-block layouts.
3. "Advanced features like masked editing and lighting changes may create visual artifacts or unnatural results."
4. "Character consistency is generally reliable but not perfect every time."
5. Data visualizations require human verification for factual accuracy (the model may invent figures).
6. **Hard refusals on prompts involving prominent real people.** Observed refusal text: "This prompt might violate our policies about generating prominent people. Please try a different prompt or send feedback." [PRACTITIONER] [raw/nanobanana--failure-modes--vs-gpt-image-2-head-to-head.md]
7. Capacity limits: the model "may at times be at capacity", hence `allow_fallback_model` (falls back to `bytedance/seedream-5`) [raw/nanobanana--replicate-schema--replicate-llms-txt.md].
8. Higher cost and latency than the Flash-tier models [raw/nanobanana--official-identity--blog-google-developers.md].
9. Cannot access real-time weather or current info without tools; "structured tool calling coming soon" [PRACTITIONER] [raw/nanobanana--replicate-schema--replicate-llms-txt.md].

### 8.3 The contested text-rendering comparison, stated both ways

| Reading | Claim | Source |
|---|---|---|
| **Nano Banana Pro wins text** | "Nano Banana Pro > GPT Image 1.5 > Nano Banana > GPT Image 1"; NBP is the "most consistently strong performer" at dense infographics, and produces editorial layouts "with proper column flow and line spacing"; GPT Image 1.5 is "less consistent with dense text" | [raw/nanobanana--failure-modes--getimg-gpt-image-15-comparison.md] |
| **GPT Image 2 wins text** | Manga test: GPT 2.0's "dialogue bubbles and the page number 'p.01' are cleanly rendered with correct spelling," while NBP "mangle[d] the English text inside two of the four bubbles." Multilingual menu: GPT 2.0's "Japanese characters are legible and the English translations match," whereas NBP had "three of its six dish lines have garbled kanji or invented dish names." Dense silkscreen poster: GPT 2.0 all legible and correctly spelled; NBP's "four of its seven text blocks are gibberish" | [raw/nanobanana--failure-modes--vs-gpt-image-2-head-to-head.md] |
| Vendor claims | Google: "the best model for creating images with correctly rendered and legible text"; "state-of-the-art text rendering." OpenAI: "improved text rendering", "#1 spot across all Image Arena leaderboards", "+242 point lead in Text-to-Image", score **1,512** | [raw/nanobanana--official-identity--blog-google-announcement.md], [raw/nanobanana--official-identity--blog-google-developers.md], [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md] |

**Better-supported reading: unsettled. Treat text-rendering rank as prompt- and language-dependent, not as a fixed ordering.** Both practitioner files say so explicitly: the head-to-head is a "Single-tester, 10-prompt sample" whose results "contradict Google's own marketing and other comparisons" [raw/nanobanana--failure-modes--vs-gpt-image-2-head-to-head.md]; the getimg file notes it "directly contradicts the aivideobootcamp head-to-head on text rendering, the two sources disagree, so text quality is prompt- and language-dependent rather than a settled ranking" [raw/nanobanana--failure-modes--getimg-gpt-image-15-comparison.md]. Note also that the two comparisons test **different OpenAI models** (1.5 vs 2.0), which alone could explain the flip [INFERRED].

### 8.4 Where Nano Banana Pro measurably leads on photographic realism [PRACTITIONER]

- Skin: "skin texture, subsurface scattering in the lips, the way individual hair strands catch the shaft of window light"; NBP "looks like a frame from a real camera" versus GPT Image 2.0's "strong digital painting."
- Phone-camera / UGC: NBP captured "fisheye, the hard overhead LED reflection on the hoodie, the slight sensor noise"; GPT 2.0's comparable output was "too clean, too evenly lit."
- Materials and lighting: "more convincing metal finishing on the case middle and the rotor"; superior "photorealistic skin texture, shallow depth of field, and tagline."
- Painterly: "more convincing gouache texture and a more storybook-feeling palette." [raw/nanobanana--failure-modes--vs-gpt-image-2-head-to-head.md]
- "Produces naturally balanced results without over-processing" [raw/nanobanana--failure-modes--getimg-gpt-image-15-comparison.md]

### 8.5 The empirical artifact taxonomy (what actually betrays a fake)

ICLR 2026 X-AIGD three-level, 7-category taxonomy [raw/gptimage--perceptual-artifact-taxonomy--iclr-2026-x-aigd.md]:

| Level | Categories |
|---|---|
| L1, low-level distortions ("unnatural textures, warped edges") | Textures; **Edges & Shapes**; Symbols (text, logos, glyphs, signage, watch faces, keyboards); Color |
| L2, high-level semantics ("abnormal object structures") | Semantics (hands, limbs, anatomy, object assembly) |
| L3, cognitive-level counterfactuals ("violations of commonsense or physical laws") | Commonsense; Physics (lighting direction, shadow consistency, reflections, optics) |

Frequency (annotated instances): **Edges & Shapes 10,277**; Semantics 3,139; Symbols 1,980. "Low-level distortions substantially outweigh cognitive-level artifacts across modern generators." Dataset: **3,035** valid annotated fake samples carrying **18,202** annotated artifact instances; full collection **4,000 real** and **52,000 generated** (4,000 per generator) across **13 generators** [raw/gptimage--perceptual-artifact-taxonomy--iclr-2026-x-aigd.md].

**Limitation, stated in the source:** the dataset "does not include DALL-E or GPT Image models." The taxonomy generalises; the frequency numbers do not necessarily transfer to `gpt-image-2` [raw/gptimage--perceptual-artifact-taxonomy--iclr-2026-x-aigd.md].

Operational translation recorded there: the thing that most often betrays a generated photograph is
**edge and shape integrity** (silhouettes, contact edges, where one object meets another, hair against background, fingers against fabric), not an implausible scene. Also: existing detectors show "negligible reliance on perceptual artifacts, even at the most basic distortion level", so
**pixel-level AI detectors are unreliable and non-explanatory; provenance signals (C2PA + SynthID) and human artifact inspection are the dependable checks** [raw/gptimage--perceptual-artifact-taxonomy--iclr-2026-x-aigd.md].

### 8.6 Selection matrix

| Job | Reach for | Why | Source |
|---|---|---|---|
| Photorealistic human skin, natural-light portrait | **`gemini-3-pro-image`** | Skin texture, subsurface scattering, hair in light; "looks like a frame from a real camera" [PRACTITIONER] | [raw/nanobanana--failure-modes--vs-gpt-image-2-head-to-head.md] |
| Phone-camera / UGC / candid look | **`gemini-3-pro-image`** | Captured fisheye, LED reflection, sensor noise; GPT was "too clean, too evenly lit" [PRACTITIONER] | same |
| Un-over-processed color | **`gemini-3-pro-image`** | "naturally balanced results without over-processing" [PRACTITIONER] | [raw/nanobanana--failure-modes--getimg-gpt-image-15-comparison.md] |
| Anything featuring a named or prominent real person | **`gpt-image-2`** | NBP hard-refuses; "you cannot rely on Nano Banana Pro" for press, political satire, biographical content, recruiting flyers, editorial illustration, podcast cover art [PRACTITIONER] | [raw/nanobanana--failure-modes--vs-gpt-image-2-head-to-head.md] |
| Dense in-image typography, multi-panel layout, localized text | **Contested, test both.** GPT 2.0 won the 10-prompt head-to-head; NBP won the getimg comparison | See 8.3 | [raw/nanobanana--failure-modes--vs-gpt-image-2-head-to-head.md], [raw/nanobanana--failure-modes--getimg-gpt-image-15-comparison.md] |
| Diagrams, infographics, charts, posters, comics | **`gpt-image-2`** | Vendor: "stronger structured generation (diagrams, infographics, charts, posters, comics)"; positioned for production workflows needing output that is "accurate, readable, on-brand, localized, formatted for the destination surface" | [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md] |
| Transparent background required | **`gpt-image-2`** | `background: "transparent"` is a documented parameter; no equivalent appears in the Google or Replicate schemas [INFERRED from absence] | [raw/gptimage--generate-endpoint-params--openai-api-reference.md], [raw/nanobanana--replicate-schema--replicate-llms-txt.md] |
| Mask-precise inpainting with a supplied alpha mask | **`gpt-image-2`** via `/v1/images/edits` `mask` | Google uses **semantic masking, no mask file** | [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md], [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md] |
| 4K output | **`gemini-3-pro-image`** | OpenAI caps at max edge < 3840 px; Google supports up to 4K | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md] |
| More than 14 reference images | **`gpt-image-2`** (16 max) | OpenAI allows "up to 16 images"; Google's total is 14 | [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md], [raw/nanobanana--official-identity--blog-google-announcement.md] |
| Explicit likeness-fidelity knob (before 2026-12-01) | **`gpt-image-1.5`** with `input_fidelity: "high"` | Disabled on `gpt-image-2`; those models retire 2026-12-01 | [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md], [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md] |
| Real-world grounded facts inside an image | **`gemini-3-pro-image`** with `tools: [{"type":"google_search"}]` | Google Search grounding is a first-class feature | [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md] |
| Cheap batch drafts | **`gemini-3.1-flash-image`** ($0.067 per 1K image) or `gpt-image-1-mini` (until 2026-12-01) | Price and stated positioning | [raw/nanobanana--pricing--ai-google-dev-pricing.md], [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md] |
| Best of both | **Hybrid**: "Nano Banana Pro for the photographic base plate, GPT 2.0 for the typography pass, and a compositor (Photoshop, Affinity, or a React canvas layer) that layers the two" [PRACTITIONER] | | [raw/nanobanana--failure-modes--vs-gpt-image-2-head-to-head.md] |

---

## Gaps and unresolved

1. **`gpt-image-2` per-image cost is unknown.** Only per-1M-token pricing ($8 / $2 / $30) is published; no tokens-per-image figure was found, so cost per render cannot be computed the way Google's can [raw/gptimage--gpt-image-2-launch--openai-community-announcement.md].
2. **The `/v1/images/generations` and `/v1/images/edits` `model` enums do not list `gpt-image-2`.** Treated here as a lagging docs artifact, but the authoritative enum was never observed to include it [raw/gptimage--generate-endpoint-params--openai-api-reference.md], [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md].
3. **Whether the edit endpoint's narrower `size` enum applies to `gpt-image-2`** is unresolved: the edit page lists only `auto` / `1024x1024` / `1536x1024` / `1024x1536`, while the cookbook says `gpt-image-2` supports "any size meeting constraints" [raw/gptimage--edit-endpoint-and-input-fidelity--openai-api-reference.md], [raw/gptimage--photorealism-prompting--openai-cookbook-models-guide.md].
4. **OpenAI's actual (non-Azure) `softwareAgent` string and certificate issuer are unpublished**, and no source documents whether `digitalSourceType` or `c2pa.actions` appear in OpenAI manifests [raw/gptimage--c2pa-manifest-fields--microsoft-azure-openai-docs.md].
5. **No source enumerates `gpt-image-2` in any C2PA doc.** Azure's doc covers DALL-E series and GPT-image-1 series only [raw/gptimage--c2pa-manifest-fields--microsoft-azure-openai-docs.md].
6. **Replicate's per-image price for `google/nano-banana-pro` is unconfirmed**, as are the full 11-value `aspect_ratio` enum and all field defaults [raw/nanobanana--replicate-schema--replicate-llms-txt.md].
7. **No `thinking_level` guidance exists.** The enum (`minimal` or `high`) is documented but nothing states its effect on photographic realism, latency, or price [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md].
8. **`imageConfig` silently ignored on some SDK/proxy paths** is reported only in third-party issues, not acknowledged by Google; scope and current status unknown [raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md].
9. **Google publishes no C2PA field names** for Gemini image output, only the "digital passport" prose description [raw/nanobanana--synthid--google-support-verify-ai-generated.md]. C2PA is not mentioned at all in the Nano Banana Pro launch announcement [raw/nanobanana--official-identity--blog-google-announcement.md].
10. **No SynthID detection thresholds or confidence scores are published**, and no pixel-level algorithm detail [raw/nanobanana--synthid--deepmind-synthid.md].
11. **Text-rendering rank between `gpt-image-2` and `gemini-3-pro-image` is unresolved** (see 8.3); the two practitioner sources also test different OpenAI versions.
12. **The X-AIGD artifact frequencies do not cover GPT Image or DALL-E models**, so the "Edges & Shapes dominates" finding is a generalization, not a measurement of these two models [raw/gptimage--perceptual-artifact-taxonomy--iclr-2026-x-aigd.md].
13. **No prompt-level control over the smoothing/denoising bias exists on OpenAI.** The staff reply committed only to capturing feedback; no fix confirmed [raw/gptimage--plastic-look-failure-mode--openai-developer-community.md].
14. **Nano Banana Pro's per-parameter behavior is thinly documented**: no `seed`, no negative prompt, no CFG-style control appears in either the Google docs or the Replicate schema [INFERRED from absence in raw/nanobanana--api-schema-and-limits--ai-google-dev-image-generation.md and raw/nanobanana--replicate-schema--replicate-llms-txt.md].
15. **The "up to eight coherent outputs in a single request" claim** for ChatGPT Images 2.0 [raw/gptimage--chatgpt-images-2-0-naming-and-realism-claims--petapixel.md] sits oddly beside the API's documented `n` range of **1 to 10** [raw/gptimage--generate-endpoint-params--openai-api-reference.md]. Better-supported reading: `n` 1 to 10 is the API limit, and "eight" is a ChatGPT-surface product framing about *coherent, character-continuous* outputs rather than the API cap [INFERRED].
16. **`gpt-image-1`'s own end-of-life is unannounced** even though the cookbook labels it "Compatibility only"; it was not in the June 2026 deprecation batch [raw/gptimage--model-lifecycle-deprecations--openai-api-docs.md].
