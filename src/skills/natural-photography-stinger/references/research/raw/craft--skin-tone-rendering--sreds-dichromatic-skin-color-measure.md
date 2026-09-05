# SREDS: A Dichromatic Separation Based Measure of Skin Color (Bahmani et al., arXiv 2104.02926)
- URL: https://arxiv.org/pdf/2104.02926
- Fetched: 2026-08-17
- Source type: academic

## Dichromatic Reflection Model (DRM) — the physics that matters for lighting skin
Skin reflectance splits into two physically distinct components:
- **Specular (interface) reflection** — bounced off the air/oil interface at the skin surface. "The specular component reflects the color of the illumination and is generally brighter than the color of skin." It is **melanin-independent**; it varies with incident angle and the illuminant's own color.
- **Diffuse (body) reflection** — light that enters the epidermis/dermis and comes back out after "subsurface scattering of light with melanin and hemoglobin components." This carries the *intrinsic* skin color and is assumed **Lambertian** (reflects equally in all directions, so it is viewing-angle independent).

### Practical consequence
On deep skin the diffuse (color-bearing) return is much weaker, while the specular return is essentially the same as on light skin. So the specular highlights dominate the recorded signal — this is exactly the failure described historically as deep-skin subjects reduced to highlights on teeth and eyes. Controlling specularity (larger/softer sources, off-axis key, polarizer, matte skin prep) and exposing for the diffuse component is the correct fix; adding raw exposure just blows the speculars.

## Skin-tone measurement metrics and their limits
- **ITA (Individual Typology Angle)**: converts RGB to CIE-Lab and computes `ITA = arctan((L* - 50)/b*) * 180/pi`, in degrees. Higher ITA = lighter.
- **Fitzpatrick Skin Type (FST)** has "limited quantification and reliability, particularly for nonwhite individuals" — it is a UV-response scale, not a color-measurement scale.
- Both ITA and RSR (relative skin reflectance) are "sensitive to changes in illumination"; all measures show **higher intra-subject variability under varying illumination**.

## Intra-subject variability (std dev; lower = more stable across illumination)
| Dataset | ITA | RSR | SREDS |
|---|---|---|---|
| Multi-PIE High Resolution | 0.401 | 0.307 | **0.138** |
| Multi-PIE Multi-View | 0.926 | 0.860 | **0.820** |
| MEDS-II | 0.448 | 0.493 | **0.463** |
| Morph-II | 0.645 | 0.539 | **0.419** |

## Why algorithms fail on darker skin
1. Reference methods (RSR) require "a highly controlled acquisition environment (constant background, lighting and camera)" — unrealistic in the wild.
2. FST is unreliable for nonwhite subjects, so training/eval labels are noisy.
3. Illumination sensitivity: skin-color estimates drift most exactly where lighting is uncontrolled.
4. Demographic data "may be overlooked because it is difficult to collect reliably," so bias never gets measured.

SREDS's fix — explicitly separating illumination-dependent specular from skin-intrinsic diffuse — is the same conceptual fix a photographer makes with lighting.
