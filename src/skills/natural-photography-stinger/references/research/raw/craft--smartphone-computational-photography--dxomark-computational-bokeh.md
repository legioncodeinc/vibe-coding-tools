# Evaluating computational bokeh: How we test smartphone portrait modes (DXOMARK)
- URL: https://www.dxomark.com/evaluating-computational-bokeh-test-smartphone-portrait-modes/
- Fetched: 2026-08-17
- Source type: technical

## Documented failure modes of synthetic (computational) bokeh
1. **Depth-map resolution errors** — low-resolution depth maps produce "sharp zones in the background and/or blurred zones on the subject, particularly when capturing moving scenes." Result: a patch of background stays crisp, or a shoulder/hand goes soft.
2. **Segmentation / edge artifacts** — complex contours (hair, hand outlines, glasses arms, cup handles) get assigned the wrong depth. Flyaway hair blurs away or a background sliver between arm and torso stays sharp.
3. **Specular highlight rendering** — the biggest giveaway. In real optics an out-of-focus point light "hits the sensor as large blur spots"; on a phone the highlight is captured "on only a few pixels, which tend to saturate," so the synthesized bokeh ball is a dim gray disc instead of a bright, hard-edged, saturated one. Real bokeh balls are *brighter than their surroundings*; fake ones are not.
4. **Blur gradient (depth transition)** — "blur intensity should change with depth" continuously. Computational versions tend to apply a step: subject sharp, everything behind at one blur level. DXOMARK tests this with regular repeating patterns receding into the frame.
5. **Noise inconsistency** — computationally blurred areas are "totally free of grain" because Gaussian blurring *is* denoising. Real optical bokeh preserves the same grain/noise level in the out-of-focus areas as in the sharp ones. **Grain that stops at the subject outline = synthetic.**
6. **Bokeh shape fidelity** — phones deliver "circular shapes of varying sharpness" only. They do not simulate **optical vignetting (cat's-eye highlights toward frame corners)**, non-circular aperture blades (polygonal bokeh when stopped down), onion-ring texture, or longitudinal chromatic fringing on out-of-focus edges.
7. **Repeatability** — computational bokeh "works best in bright conditions" and gives inconsistent results even under "consistent lighting," sometimes failing to engage at all.

## Prompt-usable takeaways
Real optical shallow DoF is identified by: continuous blur ramp with distance, bright saturated specular discs with defined edges, cat's-eye squashing near corners, matched grain in and out of focus, and foreground blur as well as background blur. Any of these missing reads as computed/AI.
