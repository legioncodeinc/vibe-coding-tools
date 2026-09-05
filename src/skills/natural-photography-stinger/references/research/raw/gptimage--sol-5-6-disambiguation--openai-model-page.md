# GPT-5.6 Sol — model page (disambiguation of the "Sol 5.6 ULTRA" claim)
- URL: https://developers.openai.com/api/docs/models/gpt-5.6-sol
- Fetched: 2026-08-17
- Source type: official-docs

Archived specifically to resolve the user's phrase **"ChatGPT Image 2 using
Sol 5.6 ULTRA."**

## What gpt-5.6-sol actually is

> "Frontier model for complex professional work"

- It is a **reasoning / text-generation model**, the top tier of the GPT-5.6
  family. The alias `gpt-5.6` routes to Sol.
- **Model IDs:** `gpt-5.6-sol` (primary), `gpt-5.6` (alias).
- **No variants or snapshots** are listed on the official model page beyond the
  base model. There is **no `gpt-5.6-sol-ultra`**.

## Modalities — decisive point

- **Input:** text and images
- **Output:** **text only**
- **It does NOT generate images.**

## Reasoning effort levels (where "ULTRA" probably comes from)

Supported `reasoning.effort` values: **`none`, `low`, `medium` (default),
`high`, `xhigh`, `max`.**

There is no level called "ultra". The highest tiers are literally named `xhigh`
and `max`. Community/leak repos also circulate a file named
`gpt-5.6-sol-extra-high.md` (a leaked system prompt, not an official model ID),
which is the most likely origin of a garbled "ULTRA" tier.

## Context and pricing

- Context window: **1,050,000 tokens**
- Max output: **128,000 tokens**
- Knowledge cutoff: **February 16, 2026**
- Pricing per 1M tokens: input **$5.00**, cached input **$0.50**, output **$30.00**

## Conclusion for the record

"Sol 5.6 ULTRA" is **not** an OpenAI image product, preset, or quality tier.
The phrase conflates two unrelated real things:

1. `gpt-image-2` — the image generation/editing model (launched 2026-04-21), and
2. `gpt-5.6-sol` — a text-only frontier reasoning model.

The plausible real workflow behind the phrase is the documented **"Thinking mode"**
pattern: a reasoning model (e.g. GPT-5.6 Sol at high/xhigh/max effort) plans and
writes the prompt, then calls `gpt-image-2` via the Responses API
`image_generation` tool. That is a *pipeline*, not a product name.

No primary source anywhere uses the string "Sol 5.6 ULTRA" in connection with
image generation.
