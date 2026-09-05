# Images: edit — OpenAI API reference (multi-image reference + input_fidelity)
- URL: https://developers.openai.com/api/reference/resources/images/methods/edit
- Fetched: 2026-08-17
- Source type: official-docs

Verbatim / near-verbatim parameter extraction for `POST /v1/images/edits`.
This is the endpoint that matters most for likeness / reference conditioning.

## image (input images)

- **Multi-image support: "up to 16 images"** for GPT image models.
- Each image can be supplied as:
  - `file_id` — "The File API ID of an uploaded image"
  - `image_url` — "A fully qualified URL or base64-encoded data URL",
    **max 20971520 bytes (20 MiB)** per image.

This is the documented mechanism for reference conditioning: pass N reference
photographs of a subject/product/location and describe the target scene in the
prompt. There is no separate "reference strength" or IP-Adapter-style weight
parameter — the only fidelity control is `input_fidelity`.

## mask

Optional image reference indicating the area to edit. Accepts either `file_id`
or `image_url` (one is required). Used for inpainting; transparent regions of
the mask mark the editable area.

## prompt

Required text. Range **1–32000 characters**.

## model

Supported options listed: `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`,
**`chatgpt-image-latest`**.

`chatgpt-image-latest` is an alias pointing at whatever image model ChatGPT is
currently serving. This is the closest real identifier to a colloquial
"ChatGPT Image" model name. There is no `chatgpt-image-2` identifier.

## input_fidelity  (the key photorealism/likeness parameter)

- Optional. Allowed values: **`"high"`** or **`"low"`**.
- Documented description: **"Controls fidelity to the original input image(s)."**
- `high` preserves fine detail, faces, logos and texture from the input images at
  higher token cost; `low` is the default-ish looser behaviour that re-imagines
  more of the frame.
- For likeness preservation and for keeping real photographic skin/texture from a
  reference, `input_fidelity: "high"` is the documented lever.

## background

Optional. `"transparent"`, `"opaque"`, `"auto"`.

## quality

Optional. `"low"`, `"medium"`, `"high"`, `"auto"`. "Available for GPT image
models only."

## size

Optional. `"auto"`, `"1024x1024"`, `"1536x1024"`, `"1024x1536"`.
(Note the edit endpoint enum is narrower than generate, which also allows
custom WIDTHxHEIGHT divisible by 16 up to 3840x2160.)

## output_format

Optional. `"png"`, `"jpeg"`, `"webp"`. "Supported for GPT image models."

## output_compression

Optional. 0–100 for JPEG/WebP output.

## n

Optional. 1–10 generated images.

## stream / partial_images

`stream` — optional boolean, "Stream partial image results as events."
`partial_images` — 0–3, used for streaming intermediate results.

## moderation

Optional. `"low"`, `"auto"`. GPT image models only.

## user

Optional string identifier for abuse monitoring.
