# iPhone Camera Over Processing (Michael Tsai blog roundup, Jan 2023)
- URL: https://mjtsai.com/blog/2023/01/10/iphone-camera-over-processing/
- Fetched: 2026-08-17
- Source type: practitioner
- Note: an aggregation of practitioner/press criticism; useful because it names the *look* in plain language.

## The named failure modes (quoted)
- **Flat / washed-out tone mapping**: "pictures taken on modern iPhones often look sort-of washed out and samey, like much of the contrast and highlights from real life were lost."
- **Smart HDR overreach**: "Smart HDR does a bad job, making things look artificial and over processed."
- **Semantic face brightening**: "every time there's a very bright background, the iPhone also tries to boost the brightness of the people in the photo, making them look very white." — a per-face local exposure lift that destroys backlit rim-light drama and shifts skin tone.
- **Low-light selfie artifacts**: "bizarre artifacts" producing "an 'absurd watercolor-like mess'" — the canonical description of heavy NR + detail synthesis on skin.
- **Over-aggressive noise reduction** compromising fine texture.
- **Scene decomposition failure**: "the way it slices a scene into individual components for separate adjustments — sometimes fail to resolve in a satisfying final photo." Sky, faces, foliage and skin each get their own treatment, so the frame no longer shares one coherent light.

## Adjectives used for the processed look
"garish," "cartoonish," "sterile and inhuman," "washed out."
Contrasted against images with **natural imperfections: grain and a warm white balance.**

## Prompt-usable takeaways
The "phone look" to reproduce deliberately: lifted shadows, compressed highlight roll-off, faces brightened independently of the background, watercolor shadow texture, slightly over-sharpened edges with light halos, and a global tone that reads flat rather than contrasty.
The "authentic look" to reproduce instead: retained grain, one coherent white balance with a warm cast, shadows allowed to go dark and lose detail, highlights allowed to clip.
