# All Apple iPhone 13 and 13 Pro camera upgrades: Explained (DPReview)
- URL: https://www.dpreview.com/articles/6780391159/all-apple-iphone-13-and-13-pro-camera-upgrades-explained/
- Fetched: 2026-08-17
- Source type: technical
- Note: the "equivalent aperture" column is the single most useful number set for explaining why phone photos have no real depth of field.

## iPhone 13 / 13 mini
| Camera | Equiv. FL | Aperture | Sensor | Pixel pitch | Sensor area | **Full-frame-equivalent aperture** | Stabilization |
|---|---|---|---|---|---|---|---|
| Wide (main) | **26 mm** | f/1.6 | 1/1.9" | 1.7 µm | 35.2 mm² | **f/8.2** | sensor-shift |
| Ultra-wide | **13 mm** | f/2.4 | 1/3.4" | 1.0 µm | 12.2 mm² | **f/20.2** | none, fixed focus |

## iPhone 13 Pro / Pro Max
| Camera | Equiv. FL | Aperture | Sensor | Pixel pitch | **Equiv. aperture** | Focus / IS |
|---|---|---|---|---|---|---|
| Wide (main) | **26 mm** | f/1.5 | 1/1.65" | 1.9 µm | **f/6.8** | sensor-shift + OIS |
| Ultra-wide | **13 mm** | f/1.8 | 1/3.4" | 1.0 µm | **f/15.1** | PDAF, macro to **2 cm** |
| Telephoto (3x) | **77 mm** | f/2.8 | 1/3.4" | 1.0 µm | **f/23.8** | sparse PDAF, OIS, Night mode |

### Why this matters
Depth of field is set by the *equivalent* aperture. A phone main camera shooting "f/1.6" renders depth of field like a full-frame lens at **f/8**; the ultra-wide renders like **f/20**; the tele like **f/24**. That is why a real phone photo has an entire room in focus, and why any background separation must be synthesized.

## Computational processing named
- **Smart HDR 4** — "uses a learning-based approach to identify individual subjects in a photo and process different skin tones individually." (Semantic, per-face local tone mapping — a per-person exposure, not a global one.)
- **Photographic Styles** — baked into the multi-frame pipeline, applying "local edits at appropriate stages" with semantic rendering that adjusts skies and faces "disparately" while preserving skin tones. Not available with ProRAW (i.e., it is a pipeline stage, not a filter).
- **Deep Fusion / multi-frame** — pixel-level detail synthesis from a burst.

## Prompt-usable takeaways
- Phone main camera = **24–28 mm equivalent**, DoF behaving like f/6.8–f/8.2 full-frame.
- Ultra-wide = **13 mm**, DoF like f/15–f/20, fixed or near-fixed focus, strong edge stretching.
- Phone tele = **77 mm** (3x) historically, f/2.8, small sensor — DoF like f/24, so still deep.
- Faces and sky are tone-mapped independently from the rest of the frame.
