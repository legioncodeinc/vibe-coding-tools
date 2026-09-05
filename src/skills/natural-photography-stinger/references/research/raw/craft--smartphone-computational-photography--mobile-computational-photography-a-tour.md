# Mobile Computational Photography: A Tour (Delbracio, Kettunen, Talvala, Milanfar et al., arXiv 2102.09000 / Annual Review of Vision Science)
- URL: https://ar5iv.labs.arxiv.org/html/2102.09000
- Fetched: 2026-08-17
- Source type: academic

## Sensor hardware numbers
- Smartphone sensor: **~5 x 4 mm**. Full-frame DSLR: **36 x 24 mm** (≈43x the area).
- Smartphone pixel pitch: **~1.5 microns or less**. DSLR pixel: **~4 microns**.
- Smartphone raw tonal depth: **1024 levels (10-bit)**. DSLR: **4096 (12-bit)** to **16384 (14-bit)**.
- Smartphone lens: **fixed aperture**, small; light collection reduced by **two orders of magnitude** vs DSLR.
- Bayer CFA demosaic: **2/3 of the image's color data is interpolated, not measured.**

## Optics / depth of field
- Camera module z-height constraint severely limits effective focal length; manufacturers compensate with **multiple camera modules at different effective focal lengths / fields of view** rather than one zoom.
- Small aperture + short actual focal length => **almost no optical DoF blur**. Everything from ~0.5 m to infinity is effectively sharp.
- Portrait background separation is therefore **synthetic ("digital bokeh")**, computed from a depth/segmentation estimate.

## Noise
- Small pixels need "non-trivial multiplicative gain," set by ISO; higher ISO amplifies sensor noise. Result: mobile images are **"markedly more noisy than images captured with DSLR sensors"** at equal scene light.
- The visible noise is then attacked by denoisers, which is what creates the smeared/watercolor look in shadows.

## HDR+ burst pipeline (what makes phone photos look like phone photos)
- **Zero shutter lag (ZSL)**: frames continuously fill a ring buffer; the shutter press hands the *already captured* buffer to the pipeline.
- Frames are **deliberately under-exposed** (protects highlights), then an **exposure schedule** sets times across the burst.
- Merge operates on **2–8 raw Bayer frames**, tile-wise, in the **frequency domain**, with *partial* merging: interpolation weights adapt to the measured difference between aligned tile pairs vs the modeled noise.
- Degrades gracefully: on bad alignment it falls back to the single reference frame.
- **Artifacts named: "ghosting" and "zipper" artifacts along the edges of moving objects.**

## Tone mapping (the "flat HDR look")
- A **1D LUT** compresses the wide merged tonal range into a tight display range, with gamma encoding following **Stevens's power law** coefficients for perceived brightness.
- Because the capture is underexposed and then shadows are lifted globally, midtones get pushed up and local contrast is compressed — the characteristic flat, shadowless, everything-visible phone rendering.

## Prompt-usable takeaways
- Phone look = deep DoF + lifted shadows + compressed midtone contrast + denoised shadow texture + synthetic edge-based background blur.
- Motion in a burst-merged frame shows ghosting/zipper edges, not clean motion blur.
