# Characterizing Photorealism and Artifacts in Diffusion Model-Generated Images (CHI 2025; arXiv 2502.11989)
- URL: https://arxiv.org/html/2502.11989
- Fetched: 2026-08-17
- Source type: academic
- Study: 450 diffusion images (Midjourney, Adobe Firefly, Stable Diffusion) + 149 real photographs = 599 images; 539,749 human responses.

## Five-category artifact taxonomy (with prevalence and detection accuracy)

### 1. Anatomical implausibilities — ~1/3 of images; mean detection accuracy **65%** (CI 64.6–65.4)
- Hand/finger anomalies: extra, missing, malformed digits.
- Facial feature irregularities: eye, mouth, nose proportions.
- Body-part misalignment; disproportionate scaling between subjects in the same frame.
- **Biometric artifacts**: eye size/shape, **interpupillary distance**, ear positioning, distinctive markers (moles, scars) that don't persist.
- 21.4% of anatomical images sat in the 40–60% accuracy band (effectively indistinguishable).
- Accuracy gained **+11%** going from 1 s viewing to unlimited.

### 2. Stylistic artifacts — ~1/3 of images; mean accuracy **64.9%** (CI 64.5–65.3)
Defined as "qualities of entire images or inconsistencies of those qualities within an image."
- **Waxy, glossy, plastic-like skin textures.**
- Excessive smoothness / "cinematic perfection."
- **Inconsistent resolution between regions of one image** (one area detailed, another mushy).
- Overly dramatic or picturesque overall quality.
- 22.4% in the 40–60% band; **+11%** accuracy with longer viewing.

### 3. Functional implausibilities — ~1/3 of images; mean accuracy **64.1%** (lowest of the three main types)
- Objects that couldn't work as designed (loose/unattached guitar strings, hands not actually gripping).
- Implausible object placement or use.
- Atypical design details: buttons, buckles, garment prints.
- **Text distortion / garbled glyphs.**
- **32.8% in the 40–60% band — the highest proportion**, i.e. the hardest artifacts to notice.
- **+18% accuracy** from 1 s to unlimited viewing — the largest gain; these require deliberate inspection.

### 4. Violations of physics — only **20 images (~9%)**
- Shadow direction misalignment: multiple shadows diverging, or not corresponding to any visible light source.
- Reflection irregularities in mirrors, water, shiny surfaces.
- Depth and perspective distortion.
- Warping and trajectory misalignment.

### 5. Sociocultural implausibilities — only **12 images (~5.5%)** — rarest
- Socially inappropriate scenarios, cultural norm violations (wrong uniforms, misplaced symbols), historical inaccuracies.

## Overall detection performance
- Correctly identifying **AI-generated**: **76%** (CI 74–77); range across images **32%–99%**.
- Correctly identifying **real photographs**: **74%** (CI 72–76); range **28%–92%**.
- Display time: **1 s -> 72%**, **5 s -> 77%**, **20 s -> 82%** (AI images), then plateau.

## Scene-type accuracy (AI images) — most useful finding for a "make it look real" workflow
| Scene type | Detection accuracy (lower = more photorealistic) | % in bottom decile (most photorealistic) |
|---|---|---|
| **Portraits** | **72.7%** | **16%** |
| **Candid groups** | **73.4%** | — |
| Posed groups | 76.2% | 3% |
| Full body | 77.2% | — |

**Portraits and candid groups fool people most; posed groups and full-body shots fool people least.**

## Other
- Human curation matters: hand-picked "highly photorealistic" sets were detected less accurately than uncurated full generation batches — most generations contain visible artifacts; only a minority are convincing.
- 34% of participants hit >=90% accuracy on their first ten images.
