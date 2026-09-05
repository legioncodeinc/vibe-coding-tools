# How to Spot AI-Generated Images: 10 Telltale Signs (whichoneis.ai) + AI Headshot tells (headshotphoto.io)
- URL: https://whichoneis.ai/blog/how-to-spot-ai-generated-images
- URL: https://www.headshotphoto.io/blogs/how-to-spot-ai-headshot
- Fetched: 2026-08-17
- Source type: practitioner

## The ten documented tells
1. **Hands and fingers** — "too many or too few fingers, fingers that merge together, thumbs on the wrong side, or knuckles that bend in unnatural directions."
2. **Skin texture** — unnaturally smooth, plastic-like skin lacking **pores, wrinkles, and blemishes**; some outputs waxy or overly glossy.
3. **Background anomalies** — objects merging, misaligned shelves, impossible architectural spaces, wobbling lines, vague foliage instead of distinct leaves.
4. **Lighting inconsistency** — "a subject's face may be lit from the left while their shadow falls in the wrong direction."
5. **Text and letters** — "letters that morph into meaningless shapes, words that are close to real English but not quite right, or characters from multiple alphabets mixed together."
6. **Symmetry** — faces either **too perfectly symmetrical** or unnaturally asymmetrical; real faces have subtle consistent asymmetry (one eye slightly lower, one nostril larger, a dominant smile side).
7. **Hair** — "painted rather than stranded"; frizz, hairlines, and textured/coily hair types are the worst failures.
8. **Jewelry and accessories** — mismatched pairs, chains that disappear behind a shoulder and don't re-emerge, random symbols instead of numbers on watch faces, frames with uneven thickness or absent reflections.
9. **Reflections and shadows** — reflections showing a different viewing angle, or missing elements present in the scene; shadows missing, duplicated, or oddly shaped.
10. **Uncanny quality** — an "idealized quality rather than authentic capture"; nothing individually wrong.

## Headshot-specific additions
- **Hair/background halo** — an unnatural transition where hair meets skin or background, "cut out and pasted" (identical to the computational portrait-mode segmentation artifact — both are edge-based, not optical).
- **Asymmetric glasses frames**; **mismatched earrings**; necklace sitting wrongly against a collar. These fail because they "require the AI to understand 3D space and physics."
- **Background** — generic office/stock settings, "blurry in inconsistent ways," light sources in the background not matching the light on the subject, gradients "that seem to fade into nowhere."

## Important 2026 caveat (from the headshot source)
Traditional pixel-level tells are "increasingly useless"; detection accuracy is "essentially a coin flip." Modern models have largely fixed hands and teeth. **What has NOT been fixed is the physics layer**: consistent light direction, correct shadow geometry, correct reflections, correct optical (not edge-based) depth of field, and correct sensor noise.

## Explicitly absent from these guides
Neither addresses chromatic aberration, lens distortion, sensor noise, or true depth-of-field physics — which is precisely why those are the strongest remaining levers for making a generated image read as a real capture.
