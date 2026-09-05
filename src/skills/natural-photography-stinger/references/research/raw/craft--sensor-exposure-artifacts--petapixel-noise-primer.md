# Everything You Wanted to Know About Noise but Were too Afraid to Ask (PetaPixel, Feb 2026)
- URL: https://petapixel.com/2026/02/16/everything-you-wanted-to-know-about-noise-but-were-too-afraid-to-ask/
- Fetched: 2026-08-17
- Source type: education

## The two noise types — appearance, which is what matters for prompting
- **Luminance noise** — "grey speckles in the image, similar to film grain." Monochrome, fine-grained, affects brightness only. This is the *pleasant* noise; it reads as film and as authenticity.
- **Chroma noise** — "blotchy or speckled patches of color," larger-scale mottling in red/green/blue. Caused by inaccurate per-channel data and demosaicing errors in low light. This is the *ugly* noise; it reads as cheap digital, and it is the first thing noise reduction attacks (which is why NR kills shadow color and leaves the watercolor look).

## Scaling
- **Sensor size**: smaller sensors (compacts, phones) have tiny pixels collecting fewer photons -> higher noise probability. The article uses this as the argument against ever-higher pixel counts on the same sensor area.
- **ISO**: raising ISO is "effectively turning up the camera's internal amplifier" while the light coming in is *less*; signal and noise amplify together.
- **Heat / long exposure**: extended shutter durations (the author cites 30-minute exposures) heat the circuitry and add noise; poor heat dissipation makes it worse. This is thermal/dark-current noise — hot pixels and blotchy color in long night exposures.

## Dynamic range
- Modern camera sensors deliver **12–14 stops** in a single frame, comparable to human vision and to good film stock.

## Prompt-usable takeaway
"Fine monochromatic luminance grain in the shadows, mild chroma mottling, shadows not fully clean" = a real capture. "Perfectly clean shadows with soft-edged smeared texture" = heavy NR or generation.
