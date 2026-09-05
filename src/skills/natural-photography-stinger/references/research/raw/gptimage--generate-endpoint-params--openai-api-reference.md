# Images: create (generate) — OpenAI API reference
- URL: https://developers.openai.com/api/reference/resources/images/methods/generate
- Fetched: 2026-08-17
- Source type: official-docs

Verbatim / near-verbatim parameter extraction for `POST /v1/images/generations`.

## Core

**prompt** (required, string)
- Maximum **32,000 characters** for GPT image models; 1,000 for DALL·E 2;
  4,000 for DALL·E 3.
- Practical note: the 32k prompt budget is what makes long, structured
  photographic briefs (camera body, lens, aperture, lighting diagram, wardrobe,
  grain spec) viable in a single call.

**model** (optional, string)
- Allowed values listed on this reference page: `gpt-image-1.5`, `gpt-image-1`,
  `gpt-image-1-mini`, `dall-e-3`, `dall-e-2`.
- Default: `dall-e-2` **unless** a GPT-specific parameter is used.
- Caveat recorded at fetch time: the *guide* page lists `gpt-image-2` as the
  latest model while this reference page's enum had not yet been updated to
  include it. Treat `gpt-image-2` as current and this enum as lagging.

## Image specification

**size** (optional, string)
- GPT image models: `auto`, `1024x1024`, `1536x1024`, `1024x1536`, **or a custom
  WIDTHxHEIGHT where each dimension is divisible by 16, up to a max of
  3840x2160**.
- DALL·E 3: `1024x1024`, `1792x1024`, `1024x1792`
- DALL·E 2: `256x256`, `512x512`, `1024x1024`

**quality** (optional, string)
- GPT image models: `auto`, `high`, `medium`, `low`
- DALL·E 3: `auto`, `hd`, `standard`
- DALL·E 2: `standard`
- Default: `auto`

**output_format** (optional, string; GPT image models only)
- Allowed: `png`, `jpeg`, `webp`

**background** (optional, string; GPT image models only)
- Allowed: `transparent`, `opaque`, `auto`
- Default: `auto`

**style** (optional; DALL·E 3 only)
- Allowed: `vivid`, `natural`
- Note: **no `style` parameter exists for GPT image models.** The DALL·E-3
  "natural" style trick does not transfer; photorealism must be carried by the
  prompt text.

## Generation control

**n** (optional, number) — range 1–10. DALL·E 3 supports `n=1` only.

**stream** (optional, boolean; GPT image models only) — default `false`.

**partial_images** (optional, number; streaming only) — range 0–3.

**output_compression** (optional, number; GPT image models, webp/jpeg only)
- Range 0–100 (%). Default `100`.
- Photorealism note: compression below 100 on jpeg/webp introduces artifacts
  that read as "digital", not as film grain. Use `png` + `output_compression`
  omitted for archival photorealistic output.

## Content & safety

**response_format** (optional; DALL·E 2/3 only) — `url` or `b64_json`.
URLs are valid for 60 minutes. GPT image models always return base64.

**moderation** (optional, string; GPT image models only)
- Allowed: `low`, `auto`
- Default: `auto`

**user** (optional, string) — end-user identifier for abuse monitoring.

**input_fidelity** — not documented on the *generate* method page; it is a
parameter of the **edit** endpoint (see edit source file).
