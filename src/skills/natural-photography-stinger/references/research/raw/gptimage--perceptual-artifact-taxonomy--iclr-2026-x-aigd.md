# Unveiling Perceptual Artifacts: A Fine-Grained Benchmark for Interpretable AI-Generated Image Detection (X-AIGD)
- URL: https://arxiv.org/html/2601.19430v1
- URL (poster): https://iclr.cc/virtual/2026/poster/10009289
- URL (code/data): https://github.com/Coxy7/X-AIGD
- Fetched: 2026-08-17
- Source type: academic (ICLR 2026)

The best available *empirical* taxonomy of what makes generated images read as
fake. Useful as a checklist of failure modes to prompt against and to QA against.

## Abstract (verbatim)

> "Current AI-Generated Image (AIGI) detection approaches predominantly rely on
> binary classification to distinguish real from synthetic images, often lacking
> interpretable or convincing evidence to substantiate their decisions."

## The three-level artifact taxonomy (7 categories)

**Level 1 — Low-level distortions** ("unnatural textures, warped edges")
1. **Textures**
2. **Edges & Shapes**
3. **Symbols** (text, logos, glyphs, signage, watch faces, keyboards)
4. **Color**

**Level 2 — High-level semantics** ("abnormal object structures")
5. **Semantics** (object structure — hands, limbs, anatomy, object assembly)

**Level 3 — Cognitive-level counterfactuals** ("violations of commonsense or
physical laws")
6. **Commonsense**
7. **Physics** (lighting direction, shadow consistency, reflections, optics)

## Dataset

- **3,035** valid annotated fake samples carrying **18,202** annotated artifact
  instances.
- Full collection: **4,000 real** and **52,000 generated** images (4,000 per
  generator).
- **13 generators** across three architectures:
  - Diffusion UNets: Stable Diffusion v1.4, v1.5, SDXL
  - Diffusion Transformers: PixArt-α, FLUX.1-dev, SD 3 / 3.5, Lumina-Next, HYDiT
  - Auto-regressive: Infinity

**Important limitation for this research task:** the dataset **does not include
DALL·E or GPT Image models**. The taxonomy generalises; the frequency numbers do
not necessarily transfer to `gpt-image-2`.

## Frequency findings (across the 13 covered generators)

| Artifact category | Annotated instances |
|---|---|
| Edges & Shapes | **10,277** (most prevalent by a wide margin) |
| Semantics | 3,139 |
| Symbols | 1,980 |

> "Low-level distortions substantially outweigh cognitive-level artifacts across
> modern generators."

Translation for prompting practice: the thing that most often betrays a
generated photograph is **not** an implausible scene — it is **edge and shape
integrity** (silhouettes, contact edges, where one object meets another, hair
against background, fingers against fabric). Physics/commonsense violations,
the failure mode people talk about most, are comparatively rare in modern
models.

## Detector finding (relevant to provenance work)

Existing detectors show "negligible reliance on perceptual artifacts, even at
the most basic distortion level"; even when trained to identify specific
artifacts, detectors "substantially base their judgment on uninterpretable
features."

Implication: pixel-level AI detectors are unreliable and non-explanatory.
Provenance signals (C2PA + SynthID) and human artifact inspection are the
dependable checks, not "AI detector" tools.
