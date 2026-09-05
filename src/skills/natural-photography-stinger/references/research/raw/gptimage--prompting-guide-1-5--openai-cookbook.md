# gpt-image-1.5 Prompting Guide — OpenAI Cookbook
- URL: https://developers.openai.com/cookbook/examples/multimodal/image-gen-1.5-prompting_guide
  (canonical redirect target of https://cookbook.openai.com/examples/multimodal/image-gen-1.5-prompting_guide)
- Fetched: 2026-08-17
- Source type: official-docs

Model-specific companion to the general GPT Image prompting guide. Quoted below.

## Prompt anatomy and ordering

> "Write prompts in a consistent order (background/scene → subject → key details
> → constraints)"

> "For complex requests, use short labeled segments or line breaks instead of one
> long paragraph."

## Photorealism and camera language

> "Prompt the model as if a real photo is being captured in the moment. Use
> photography language (lens, lighting, framing)"

> "Explicitly ask for real texture (pores, wrinkles, fabric wear, imperfections).
> Avoid words that imply studio polish"

> "Composition terms (lens, aperture feel, lighting) often steer realism more
> reliably than generic 'ultra-detailed'"

That last line is the sharpest primary-source statement on the topic: the model
responds to **optical/physical description** far more than to **quality
adjectives**. "ultra-detailed" is explicitly called out as the weaker lever.

Note the phrase "**aperture feel**" — the guide's own hedge that the model
approximates the *look* of an aperture rather than simulating it.

## Quality / latency

> "For latency-sensitive use cases, start with quality='low'; in many cases it
> provides sufficient fidelity with faster generation"

## Constraints and exclusions

> "State exclusions and invariants explicitly (e.g., 'no watermark,' 'no
> logos/trademarks')"

For edits:
> "Use 'change only X' + 'keep everything else the same,' and repeat the preserve
> list on each iteration to reduce drift"

## Text rendering

> "Put literal text in **quotes** or **ALL CAPS** and specify typography details
> (font style, size, color, placement)"

> "For tricky words (brand names, uncommon spellings), spell them out
> letter-by-letter to improve character accuracy"

## Multi-image inputs

> "Reference each input by **index and description** and describe how they
> interact"

> "When compositing, be explicit about which elements move where"

## Iteration strategy

> "Start with a clean base prompt, then refine with small, single-change
> follow-ups"

## input_fidelity

`low` | `high` — supported on gpt-image-1.5 (and mini). Per the companion guide,
it is "helpful for identity and likeness preservation during scene edits," and
it is **disabled on gpt-image-2**.
