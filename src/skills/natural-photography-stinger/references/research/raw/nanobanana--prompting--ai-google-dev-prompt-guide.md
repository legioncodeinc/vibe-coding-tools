# Gemini image generation — official "Prompt guide and strategies"
- URL: https://ai.google.dev/gemini-api/docs/image-generation#prompt-guide
- Fetched: 2026-08-17
- Source type: official-docs

Google's stated core principle (from the companion developer blog):
**"Describe the scene, don't just list keywords."** The model responds better to a narrative,
descriptive paragraph than to a comma-separated keyword soup.

## 1. Photorealistic scenes — the official template (VERBATIM)
```
A photorealistic [type of shot] of a [subject description] in a [setting
description]. [Description of the light]. Shot from a [camera angle]
with a [lens type].
```
Google's guidance for this template: "use photography terms — camera angles, lens types,
lighting, and fine details — to steer the model toward a photorealistic result."

Official example (verbatim):
> "A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish.
> Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a
> sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens."

### Camera / lens / lighting vocabulary Google explicitly uses or recommends
- Shot types: `wide-angle shot`, `macro shot`, `close-up`, `portrait`
- Angles: `low perspective`, `low-angle perspective`, `elevated 45-degree shot`, `Dutch angle`
- Lenses: `wide-angle lens`, `85mm portrait lens`, `macro lens`
- Lighting: `three-point softbox setup`, `studio-lit`, `soft diffused highlights`,
  `sunbeams filtering down`, "eliminate harsh shadows"
- Hyper-specificity example (verbatim from dev blog): instead of "fantasy armor" write
  "ornate elven plate armor, etched with silver leaf patterns, with a high collar and pauldrons
  shaped like falcon wings."

## 2. Product mockups & commercial photography — template (VERBATIM)
```
A high-resolution, studio-lit product photograph of a [product description]
on a [background surface/description]. The lighting is a [lighting setup,
e.g., three-point softbox setup] to [lighting purpose]. The camera angle is
a [angle type] to showcase [specific feature].
```
Example (verbatim):
> "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte
> black, presented on a polished concrete surface. The lighting is a three-point softbox setup
> designed to create soft, diffused highlights and eliminate harsh shadows."

## 3. Stylized illustrations & stickers — template (VERBATIM)
```
A [style] of a [subject, with details about accessories or actions]
doing [activity]. The design features [visual qualities, e.g., bold outlines,
cel-shading, etc.] and [color/background preference].
```
Example: "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching
on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a
vibrant color palette."

## 4. Accurate text in images — template (VERBATIM)
```
Create a [image type] for [brand/concept] with the text "[text to render]"
in a [font style]. The design should be [style description], with a
[color scheme].
```
Example: "Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text
should be in a clean, bold, sans-serif font. The color scheme is black and white."

## 5. Minimalist / negative space — template (VERBATIM)
```
A minimalist composition featuring a single [subject] positioned in the
[bottom-right/top-left/etc.] of the frame. The background is a vast, empty
[color] canvas, creating significant negative space. Soft, subtle lighting.
[Aspect ratio].
```

## 6. Sequential art (comic panel / storyboard) — template (VERBATIM)
```
Make a 3 panel comic in a [style]. Put the character in a [type of scene].
```

## Editing templates (VERBATIM)
Add / remove / modify elements:
```
Using the provided image of [subject], please [add/remove/modify] [element]
to/from the scene. Ensure the change is [description of how the change should
integrate].
```
Inpainting (semantic masking — no mask file needed):
```
Using the provided image, change only the [specific element] to [new
element/description]. Keep everything else in the image exactly the same,
preserving the original style, lighting, and composition.
```
Style transfer:
```
Transform the provided photograph of [subject] into the artistic style of
[artist/art style]. Preserve the original composition but render it with
[description of stylistic elements].
```
