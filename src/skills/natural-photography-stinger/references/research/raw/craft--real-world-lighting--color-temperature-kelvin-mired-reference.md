# Color Temperature (Cinematographer's Portal reference PDF)
- URL: https://cinematographersportal.com/wp-content/uploads/2016/11/13-colortemperature.pdf
- Fetched: 2026-08-17
- Source type: technical
- Note: foundational craft reference (film-school style color temperature table). Values are industry-standard and stable across decades.

## Kelvin values by source
**Warm**
- Match flame — 1700 K
- Candle — 2000 K
- Dawn sunlight — 2000 K
- 40–60 W household tungsten bulb — 2800 K
- 100–200 W household tungsten bulb — 2900 K
- 500–1000 W tungsten floods — 3000 K
- Warm white fluorescent — 3000 K
- Studio tungsten lamps — 3200 K
- Tungsten projector lamp — 3200 K
- Tungsten halogen — 3300 K
- Photoflood tungsten — 3400 K

**Mid**
- White fluorescent — 3500 K
- Cool white fluorescent — 4300 K
- Midday sunlight — 5400 K
- "Typical daylight" (sun + sky) — 6500 K

**Cool**
- Overcast sky — 6800 K
- Hazy sky — 8000 K
- Clear blue sky (open shade lit by sky only) — 10,000–25,000 K

## Mired math (for mixed-source thinking)
`MIRED = 1,000,000 / Kelvin`
- Daylight 5500 K = **182 mireds**
- Studio tungsten 3200 K = **312 mireds**
- The perceptual size of a color shift is constant in mireds, not Kelvin — a 100 K error at 3200 K is far more visible than a 100 K error at 6500 K.

## Correction filters / gels
| Filter | Function | Mired shift |
|---|---|---|
| 85 | daylight -> tungsten (amber) | +112 |
| 81EF | half 85 (amber) | +52 |
| 80A | tungsten -> daylight (blue) | -131 |

- **Minus-green (magenta) gel** corrects the excess green of standard cool-white/warm-white fluorescent tubes; **plus-green** goes the other way to match a source *to* fluorescent.
- Fluorescent and cheap LED are off the blackbody locus entirely — they need a green/magenta (tint) axis correction in addition to a Kelvin correction. This is exactly the residual cast that survives auto-white-balance and reads as "real room."

## Prompt-usable takeaways
- A real interior almost never sits at one Kelvin: 2800–3000 K lamps + 6500 K window + 4300 K overhead fluorescent in the same frame => warm faces, blue window spill, green ceiling bounce.
- Open shade is not 5500 K; it is sky-lit at 8000–25,000 K, hence the classic blue-shadow cast.
