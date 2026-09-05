# Image generation — OpenAI API guide (developers.openai.com)
- URL: https://developers.openai.com/api/docs/guides/image-generation
- Fetched: 2026-08-17
- Source type: official-docs

## Model identifiers documented (as of 2026-08-17)

The guide identifies these GPT Image models for generation and editing:

- `gpt-image-2` (latest)
- `gpt-image-1.5`
- `gpt-image-1`
- `gpt-image-1-mini`

Access gate: users "may need to complete the API Organization Verification" before
accessing GPT Image models including `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`,
and `gpt-image-1-mini`.

Note: the Images **edit** method reference additionally lists an alias
`chatgpt-image-latest` (see the edit-endpoint source file). There is no model
called "ChatGPT Image 2" in the API surface; the API identifier is `gpt-image-2`.

## Two ways to generate

1. **Image API** — `POST /v1/images/generations`, `POST /v1/images/edits`,
   `POST /v1/images/variations` (variations is DALL·E-2 only).
2. **Responses API image_generation tool** — the mainline model calls image
   generation as a tool.

Tool configuration shape:

```
{ type: "image_generation", action: "auto|generate|edit", partial_images: number }
```

`action` values:
- `"auto"` — the model decides whether to generate a new image or edit an existing one
- `"generate"` — force new image creation
- `"edit"` — force editing of an existing image

Output: base64-encoded image in the `result` field, with an optional
`revised_prompt`.

## Prompt revision (important for photorealism control)

> the mainline model "will automatically revise your prompt for improved
> performance"

The revised text is exposed in the `revised_prompt` field. This matters for
photorealism work: when using the Responses API image_generation tool, your
literal prompt is **not** necessarily what reaches the image model. The raw
Image API (`/v1/images/generations`) does not apply this rewriting layer in the
same way, so it gives more deterministic control over photographic language.

## Customizing image output

You can "adjust quality, size, format, and compression." "Transparent backgrounds
depend on model support."

## Multi-turn / iterative editing

The Responses API supports iterative refinement via `previous_response_id`, or by
including prior image-generation call outputs in the context array.

## Reference images (multi-image input)

You can create new images using **one or more reference images**. The Responses
API accepts reference image inputs as:

- fully qualified URLs
- base64-encoded data URLs (`data:image/png;base64,{encoded}`)
- File IDs created with the Files API (purpose: `"vision"`)

Multiple reference images are supported simultaneously in a single request.

## Streaming

Both the Responses API and the Image API support streaming. `partial_images`
(0–3) controls how many intermediate images are streamed before the final image.

## Parameters named in the guide

`model`, `prompt`, `n`, `size`, `quality`, `response_format`, `stream`,
`partial_images`, `output_format`, `output_compression`, `input_fidelity`,
`background`, `moderation`.

## Not found on this page

- No explicit C2PA parameter or provenance section in the guide body.
- No dedicated "photorealism" prompting section.
