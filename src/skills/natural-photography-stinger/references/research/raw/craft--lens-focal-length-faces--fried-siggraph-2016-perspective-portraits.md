# Perspective-aware Manipulation of Portrait Photos (Fried, Shechtman, Goldman, Finkelstein — SIGGRAPH 2016)
- URL: https://www.ohadf.com/papers/FriedShechtmanGoldmanFinkelstein_SIGGRAPH2016.pdf
- Fetched: 2026-08-17
- Source type: academic
- Note: foundational-modern (2016) academic reference on camera-distance-driven facial distortion.

## Core claim
Camera-to-subject **distance**, not focal length per se, is what changes facial geometry. Perspective distortion in portraits is "subtle but noticeable" and requires a full perspective camera model (not weak-perspective) to simulate correctly.

## Documented distances
- **~60 cm** — arm's-length selfie / smartphone self-portrait distance. Produces the enlarged-nose look; the paper describes it as "visible distortions similar to the fisheye effect."
- **90 cm** — intermediate baseline used in their mannequin ground-truth testing.
- **120 cm (1.2 m)** — comparison distance.
- **480 cm** — "far"/professional headshot distance.
- Professional practice cited: portrait photographers "position the camera several meters from the subject, using a telephoto lens to fill the frame" (example pairing given: ~265 mm telephoto at far distance vs ~90 mm at close distance for equivalent framing).

## Geometry effects
- Close range: nose enlarges relative to ears/cheeks; features nearest the lens (nose, forehead, chin when tilted) scale up disproportionately because relative depth differences across the face are a large fraction of total subject distance.
- Far range: face flattens; nose/ear size ratio normalizes; the head reads "compressed."

## Perceptual findings cited
- Close-up portraits are judged more **"peaceful," "approachable."**
- Distant (telephoto) headshots are judged more **"attractive," "smart," "strong."**
- Implication for craft: the amateur/candid/selfie read is not just framing — it is the geometric signature of a ~50–70 cm camera position.

## Validation numbers
- Their focal-length/distance estimation from a single portrait achieved errors **below 2%** vs EXIF ground truth across test frames.

## Prompt-usable takeaways
- "Shot at arm's length, ~60 cm from the face" = selfie geometry: bigger nose, wider forehead, ears receding/hidden, narrowed jaw.
- "Shot from ~4–5 m with a telephoto" = professional headshot geometry: flat, even facial planes, ears visible, nose in proportion.
