# A Field Guide to Compression Artifacts (imagecompressor.com)
- URL: https://imagecompressor.com/blog/compression-artifacts-explained
- Fetched: 2026-08-17
- Source type: technical

## Blocking / macroblocking
- **Look**: "quilt-like grid pattern that turns smooth areas into a patchwork of tiny squares."
- **Cause**: JPEG divides the image into **8x8 pixel blocks**, runs a DCT on each independently; quantization strips different amounts from neighboring blocks, so block boundaries no longer align.
- **Threshold**: obvious at **JPEG quality 20**; the classic case is a clear blue sky rendering as a checkerboard.

## Mosquito noise / ringing (Gibbs effect)
- **Look**: "shimmering, noisy halo that appears around sharp edges"; "blotchy, 'radioactive' halos."
- **Cause**: sharp edges are high-frequency; quantization discards those components and the reconstruction oscillates near the edge.
- **Threshold**: most prominent around text on contrasting backgrounds — hence garbled-looking signage in over-compressed photos.

## Color bleeding (chroma subsampling)
- **Look**: "colors appear to smear across boundaries" — red bleeding into skin, green into sidewalk.
- **Cause**: **4:2:0 chroma subsampling** stores color at half resolution in each axis; the encoder forces one chroma value across a **2x2 pixel** area.
- **Accumulates with every re-save.**

## Red channel degradation
- The **Cr** (red-difference) channel is subsampled most aggressively in YCbCr; red details lose sharpness first, so red elements look "especially blocky or muddy."
- Practical tell: red lips, red signage, red clothing show artifacts before anything else.

## Banding / posterization
- **Look**: "smooth gradient turns into a series of visible steps."
- **Cause**: quantization collapses tonal values — a 200-shade gradient may reduce to **15–20 values**.
- **Threshold**: visible in large slowly-changing areas (skies, studio backdrops, out-of-focus walls); **3–4 recompression generations produce "harsh stripes."**

## Prompt-usable takeaways
Real shared/reposted photos carry: 8x8 block structure in flat areas, ringing halos around text and hard edges, red-channel mush, and sky banding. A too-clean file with perfect gradients and pristine edges reads as freshly rendered.
