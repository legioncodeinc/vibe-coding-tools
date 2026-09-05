# How good are humans at detecting AI-generated images? Learnings from an experiment (arXiv 2507.18640)
- URL: https://arxiv.org/html/2507.18640v1
- Fetched: 2026-08-17
- Source type: academic

## Study design
- 12,500 global participants, August 1–8, 2024.
- ~287,000 image evaluations; 193,779 AI-generated images shown; 1,000+ image database.

## Headline numbers
- **62% overall success rate** — "only slightly higher than flipping a coin."
- **63%** success on AI-generated images specifically (121,735 of 193,779 correctly flagged).

## By image category
- **Easiest to detect: human portraits** (highest accuracy).
- **Hardest to detect: natural landscapes**, then **urban landscapes**, then **objects**.
- (Note this is the inverse of the CHI 2025 result on *within-people* scenes — here portraits vs landscapes; there, portraits vs posed groups. Combined read: people are best at spotting wrongness in *faces they can scrutinize*, worst at scenes with no anatomy to check.)

## By generator
- **Below 50% detection (most deceptive): GAN-generated faces and inpaintings.** Inpainting/partial edits are the hardest of all — a real photo with a synthetic region.
- Easier to identify: DALL-E 3, Midjourney, Stable Diffusion.
- Amazon Titan v1 with guided generation was notably deceptive.

## Machine baseline
- The researchers' automated detector exceeded **95%** accuracy on both real and AI images, consistently across categories — machines vastly outperform humans.

## Caveat
The paper did not report which conscious visual cues participants used.
