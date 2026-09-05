# GPT Image Generation Models Prompting Guide — OpenAI Cookbook
- URL: https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide
- Fetched: 2026-08-17
- Source type: official-docs

This is the single most authoritative primary source on photorealism prompting
for the GPT Image family. Passages below are quoted from the guide.

## Prompt structure and ordering (the canonical order)

> background/scene → subject → key details → constraints

Also: include the **intended use** (ad, UI mock, infographic) so the model
infers the right polish level.

> "For complex requests, [use] short labeled segments or line breaks instead of
> one long paragraph."

## Photorealism — the explicit levers

1. **Say the word.**
   > "include the word 'photorealistic' directly in the prompt to strongly
   > engage the model's photorealistic mode"

   Helpful variants named in the guide: "real photograph," "taken on a real
   camera," "professional photography," "iPhone photo".

2. **Prompt as capture, not as description.**
   > "Prompt the model as if a real photo is being captured in the moment."

3. **Use photography language.**
   > "Use photography language (lens, lighting, framing) and explicitly ask for
   > real texture (pores, wrinkles, fabric wear, imperfections)."

4. **Camera specs are a *vibe* control, not a simulator.**
   > camera specs "may be interpreted loosely, so use them mainly for high-level
   > look and composition"

5. **Avoid polish vocabulary.**
   > "Avoid words that imply studio polish or staging."

   This is the direct antidote to the "AI look": words like *pristine, flawless,
   perfect, ultra-detailed, 8K, hyperdetailed, masterpiece* push toward the
   plastic render aesthetic.

## Example photorealism prompt quoted in the guide

> "Create a photorealistic candid photograph of an elderly sailor standing on a
> small fishing boat" — with "weathered skin with visible wrinkles, pores, and
> sun texture" and "soft coastal daylight, shallow depth of field, subtle film
> grain."

Note the three-part recipe visible in that example:
(a) **candid** (not posed/staged), (b) **named skin/texture imperfections**,
(c) **named optical/physical properties** — daylight quality, DOF, grain.

## Composition

- "Specify framing and viewpoint (close-up, wide, top-down), perspective/angle
  (eye-level, low-angle)"
- Include "lighting/mood (soft diffuse, golden hour, high-contrast)"
- For layout-critical work: "call out placement (e.g., 'logo top-right,'
  'subject centered')"

## People and pose

- Describe "scale, body framing, gaze, and object interactions"
- Examples given: "full body visible, feet included," "child-sized relative to
  the table"

## Constraints / exclusions (there is no negative-prompt syntax)

> "State exclusions and invariants explicitly (e.g., 'no watermark,' 'no extra
> text')."

For edits:
> "use 'change only X' + 'keep everything else the same,' and repeat the
> preserve list"
— which "reduces drift on iterative work."

**The guide does not document any negative-prompt or exclusion syntax** (no
`--no`, no weights, no parentheses emphasis). Exclusions are plain English
sentences inside the prompt.

## Text in images

- "Put literal text in quotes or ALL CAPS"
- "Specify typography details (font style, size, color, placement)"
- For difficult words: "spell them out letter-by-letter to improve character
  accuracy"
- Use "`medium` or `high` quality for small text, dense information panels"

## Multi-image inputs / reference conditioning

- "Reference each input by index and description" (e.g., "Image 1: product photo…")
- "Describe how they interact ('apply Image 2's style to Image 1')"
- When compositing: "be explicit about which elements move where"

## Identity / likeness preservation (documented technique)

- "Explicitly lock the person (face, body shape, pose, hair, expression)"
- e.g. "Replace only the clothing, fitting the garments naturally to her
  existing pose"
- Require "realistic fabric behavior" and matching shadows
- On precision edits: preserve "camera angle, lighting, shadows, and surrounding
  context"; "Repeat the preserve list on each iteration to reduce drift."

## Model comparison table (as published)

| Model | Quality settings | input_fidelity | Resolutions | Primary use |
|---|---|---|---|---|
| `gpt-image-2` | low, medium, high | **Disabled** | Any meeting constraints (max edge <3840px, multiples of 16) | "Recommended default for new builds"; highest quality |
| `gpt-image-1.5` | low, medium, high | low, high | 1024x1024, 1024x1536, 1536x1024, auto | Legacy; migration path available |
| `gpt-image-1` | low, medium, high | low, high | 1024x1024, 1024x1536, 1536x1024, auto | Compatibility only |
| `gpt-image-1-mini` | low, medium, high | low, high | 1024x1024, 1024x1536, 1536x1024, auto | Cost-optimized batches |

### gpt-image-2 resolution constraints (exact)

- max edge **< 3840 px**
- both edges **multiples of 16**
- aspect ratio **≤ 3:1**
- total pixels **655,360 – 8,294,400**
- treat sizes above **2560×1440** as **experimental**

### input_fidelity on gpt-image-2 — critical finding

> "Disabled. `input_fidelity` does not work for this model because output is
> already high fidelity by default."

`input_fidelity` (`low` | `high`) applies only to **gpt-image-1.5 / 1.5-mini /
gpt-image-1 / gpt-image-1-mini**, where it is "helpful for identity and likeness
preservation during scene edits."

## Quality guidance

> "`quality=\"low\"` and evaluate whether it meets visual requirements. In many
> cases, it provides sufficient fidelity with significantly faster generation"

Compare `medium` or `high` for: "small or dense text, detailed infographics,
close-up portraits, identity-sensitive edits."

## Product mockups (relevant to product photorealism)

- Keep "background opaque" (use downstream removal if transparency is needed)
- Emphasize "crisp silhouette, no halos/fringing"
- "Preserve product geometry and label legibility exactly"

## What to avoid (as enumerated)

- Overly long prompts without clear structure
- Generic stock-photo language for professional work
- Detailed camera specs expecting exact physical simulation
- Assuming the model preserves identity/geometry without explicit constraints
- Re-generating entire scenes when surgical edits suffice
