# Guide 08: Skin Tone Rendering

## What this guide is for

This guide teaches an agent to render any human skin tone authentically inside a generated photograph by specifying **light and optics**, not by retrieving a reference face. A naive system tries to solve skin tone with a scraped face corpus: find a photo of someone who looks like the request, imitate it. That approach is both a consent problem and a craft failure, because it copies a result without controlling the mechanism that produced it. This guide replaces the corpus with vocabulary: the physics of how skin returns light, the historical calibration failures that still live inside modern auto-exposure, and a lighting recipe table that produces accurate rendering across the full range of human skin.

## Load this when

- The prompt describes a person and skin tone will be visible (nearly every portrait, candid, half body, or group shot).
- The subject is described with a deep, brown, olive, or medium skin tone, where default generator behavior and default camera behavior both fail in known directions.
- The scene has more than one subject with different skin tones sharing one light.
- The prompt calls for hard light, direct flash, backlight, or midday sun, all of which raise the specular-to-diffuse ratio and are where rendering breaks first.
- Post-processing language is being added to a prompt (shadow lift, exposure, HDR) and needs a guard against the ashy failure.

## Read this before anything else in this file

**This guide describes light and optics. It is not a taxonomy of people.**

Everything below is a statement about how photons behave at an air/oil interface, how they scatter under the epidermis, and what a sensor and a metering algorithm do with the result. It applies to whoever the photographer's consented subject actually is. Skin tone here is a continuous optical variable (how much of the incident light comes back carrying color versus how much bounces off the surface unchanged), not a category with a list of member groups. The lighting recipes are indexed by optical depth of tone because that is what changes the lighting math. Nothing in this guide licenses generating a specific real person, sorting people into types, or attaching ethnic labels to a rendering instruction. Where a prompt phrase is needed, this guide gives descriptive optical language (undertone, luminosity, specular behavior) precisely so that no ethnic category label is required to get an accurate render.

---

## 1. The root mechanism: the dichromatic reflection model

Almost everything else in this guide is a consequence of one fact. Skin reflectance splits into two physically distinct components [distilled-photographic-craft.md, section 7.1].

| Component | Physics | Melanin dependence | Angular behavior |
|---|---|---|---|
| **Specular (interface) reflection** | Light bounced off the air/oil interface at the skin surface. It never enters the tissue. "The specular component reflects the color of the illumination and is generally brighter than the color of skin" | **Melanin-INDEPENDENT** | Varies with incident angle and carries the illuminant's own color |
| **Diffuse (body) reflection** | Light that enters the epidermis and dermis and comes back out after "subsurface scattering of light with melanin and hemoglobin components." This carries the intrinsic skin color | **Melanin-dependent** | Assumed Lambertian: reflects roughly equally in all directions, viewing-angle independent |

[distilled-photographic-craft.md, section 7.1]

### 1.1 The consequence, stated plainly

On deep skin the **diffuse return is much weaker** (more of the entering light is absorbed by melanin before it can scatter back out), while the **specular return is essentially identical** to that on light skin (it is a surface bounce and melanin never touches it).

Therefore: as skin gets deeper, the ratio of specular to diffuse in the recorded signal rises. Under a small, hard source that produces strong speculars, deep skin records as **bright hotspots on a dark field**: shine on the forehead, nose bridge, cheekbones and chin, with very little tonal information in between. The image reads as glare plus shadow rather than as a person with dimensional form.

This is not a metaphor. It is the same mechanism that produced the documented historical failure in section 3, where mixed-tone group photographs reduced darker subjects to "a floating pair of teeth and eyes": teeth and sclera are the brightest specular returns in a face, and under a film stock calibrated for light skin they were the only thing that survived [distilled-photographic-craft.md, section 7.3]. Two independent source lines, one mechanism.

The practitioner statement of the identical physics: "Higher melanin content absorbs more light, requiring careful adjustment of light intensity. Darker skin tones may appear flatter under harsh lighting due to increased light absorption" [distilled-photographic-craft.md, section 7.1]. Flatness plus glare, from one cause.

### 1.2 Why this makes specular control the lever, not brightness

The instinctive fix for "the subject is too dark" is to add exposure. This is wrong, and the dichromatic model says exactly why: **raw exposure scales both components together.** The diffuse component was already the weaker one, so adding exposure blows the speculars into clipped white long before the diffuse component reaches a useful level [distilled-photographic-craft.md, section 7.1].

The correct fix operates on the ratio, not the level:

1. **Enlarge and soften the source.** A large source relative to the subject spreads the specular return across a wide area of skin at low intensity instead of concentrating it into a hotspot. The specular energy does not disappear, it becomes a gentle sheen that describes form.
2. **Move the key off axis.** Specular reflection obeys the angle of incidence. Moving the key off the lens axis steers the mirror lobe away from the sensor, so less of the surface bounce enters the camera and the diffuse component becomes proportionally larger in the recorded signal. This is why direct on-camera flash is the single worst possible choice: the light source sits on the axis the camera is looking down, so the specular lobe fires straight back into the lens [distilled-photographic-craft.md, section 4.6].
3. **Cut specularity at the surface.** A polarizer, or matte skin preparation on set, removes surface bounce directly.
4. **Expose for the diffuse component.** Spot meter the face and place the diffuse midtone where you want it, then accept that the speculars sit above it [distilled-photographic-craft.md, section 7.4].

The research framing of this is worth carrying: the SREDS skin measure fixes the same problem algorithmically by "explicitly separating illumination-dependent specular from skin-intrinsic diffuse," which the source notes "is the same conceptual fix a photographer makes with lighting" [distilled-photographic-craft.md, section 7.2]. Measurement and craft converge on the identical move.

### 1.3 What this means for a prompt

A prompt that says "well lit, bright, evenly exposed" gets you the failure. A prompt that specifies **source size, source distance, source angle, and how the sheen behaves** gets you the render. Specify the specular behavior explicitly:

- Bad: "dark skin, brightly lit, clear and visible."
- Good: "large diffused softbox roughly one meter from the subject at 45 degrees off the lens axis, producing a broad soft sheen across the cheekbone and brow rather than a hard hotspot, deep rich skin tone holding warm undertone in the midtones, shadow side allowed to fall away."

---

## 2. Where the defaults fail: metering and processing

The mechanism above is passive physics. On top of it sit two layers of active machinery that were tuned on light skin and still carry that tuning.

### 2.1 Evaluative and matrix metering

Matrix and evaluative metering push the frame's overall luminance toward middle gray. When the subject has deep skin, the correct rendering is a face whose diffuse midtone sits **below** middle gray, so the meter reads the face as underexposed relative to its target and, in a scene where the background dominates the weighting, tends to expose for the background instead. The result is a correctly exposed background with an underexposed subject, and simultaneously a blown background where the algorithm goes the other way [distilled-photographic-craft.md, section 7.4].

The correction is to **spot meter on the face, not the scene**, and to apply **positive exposure compensation** deliberately rather than trusting the auto reading [distilled-photographic-craft.md, section 7.4].

Monitoring practice is vectorscope and waveform to keep skin in an acceptable range. The source itself gives **no IRE numbers**; the raw corpus supplies an outside rule of thumb of roughly **55-70 IRE for light skin and 35-50 IRE for deep skin**, sitting on the vectorscope skin-tone line, and explicitly flags it as **not from that source** [distilled-photographic-craft.md, section 7.4, marked THIN / unsourced]. Treat those numbers as a rough placement heuristic, not a specification.

### 2.2 Semantic face brightening on phones

The modern algorithmic descendant of the historical bias is not a printing card, it is a neural network stage in the phone pipeline. Apple's Smart HDR 4 "uses a learning-based approach to identify individual subjects in a photo and process different skin tones individually," applying a per-person local tone map rather than a global exposure [distilled-photographic-craft.md, section 2.3]. Photographic Styles is likewise baked into the multi-frame pipeline as a stage, not a filter, adjusting skies and faces "disparately" [distilled-photographic-craft.md, section 2.3].

When this overreaches, the documented result is: "every time there's a very bright background, the iPhone also tries to boost the brightness of the people in the photo, making them look very white" [distilled-photographic-craft.md, section 2.5]. This is precisely the over-lightening-to-ashy failure the skin-tone craft source warns against, and it is the modern algorithmic form of the same default that the Shirley card encoded chemically [distilled-photographic-craft.md, section 7.4 cross-reference note, marked INFERRED].

**Prompt consequence:** if you are deliberately simulating a phone capture, you may want a trace of this (mildly lifted face against a bright window). If you want an accurate rendering, you must explicitly negate it: state that the subject's skin retains full saturation and undertone, that shadows on the subject are allowed to remain dark, and that the subject is not brightened independently of the surrounding scene.

---

## 3. The historical failure and its correction: the Shirley card timeline

An agent needs this history because it explains **why the defaults lean the way they do**, and because it names the correction as an act of intent.

| Period | Event |
|---|---|
| **1940s-1950s** | Kodak creates the "Shirley Card," a printed reference featuring Shirley Page, a white Kodak employee. It becomes "the standard for a successfully calibrated photograph in terms of light and color." Lab printers set exposure and color balance to make that skin correct |
| **1960s-1980s** | Labs keep using Shirley Cards. "The darker the skin, the more invisible the subject looked." Mixed-race group photos rendered Black subjects "nearly reduced to a floating pair of teeth and eyes," meaning only the specular highlights on teeth and sclera survived the film's latitude |
| **1980s** | Kodak Gold Max introduced, marketed as able to photograph "a dark horse in low light." The film-chemistry fix arrived for commercial reasons, not equity reasons |
| **1990s** | Kodak issues a **multiracial Shirley Card** (Asian, white, and Black women, with a Hispanic woman added later) |

[distilled-photographic-craft.md, section 7.3]

**What drove the change:** Kodak responded to complaints from **furniture and chocolate manufacturers** who could not advertise dark-brown products, not from families of color [distilled-photographic-craft.md, section 7.3].

**What film stocks and auto-exposure got wrong:** the emulsion's usable latitude was positioned around a light-skin diffuse midtone. Anything whose diffuse return sat well below that midtone fell off the bottom of the curve, and only the melanin-independent specular returns (teeth, sclera, forehead shine) had enough energy to register. The film was not failing randomly, it was failing in exactly the direction the dichromatic model predicts.

**The modern carryover:** digital removed the physical calibration card, but the bias persists in defaults. Automated exposure metering, autofocus, and auto-white-balance "struggle to identify darker skin," because decades of "white is normal" tuning shaped the reference data and the algorithms trained on it [distilled-photographic-craft.md, section 7.3].

**The craft implication, and the reason this guide exists:** correct rendering of deep skin is an act of **intent**, not a default. The source states it via *Moonlight* and *Insecure*: "Photographers and directors have to *want* their Black and darker-skinned subjects and actors to look good," meaning deliberate exposure placement and deliberate lighting rather than trusting auto modes [distilled-photographic-craft.md, section 7.3]. For an agent constructing a prompt, "intent" means the specular and fill decisions below must be written into the prompt explicitly. Silence gets the default, and the default is known to be wrong.

---

## 4. Measurement vocabulary and its limits

### 4.1 ITA (Individual Typology Angle)

Convert RGB to CIE-Lab, then:

```
ITA = arctan((L* - 50) / b*) * 180 / pi     (result in degrees)
```

**Higher ITA means lighter skin** [distilled-photographic-craft.md, section 7.2].

Use ITA as a way to talk about a continuous variable rather than a category. Note the corpus gap: it gives the formula but **no banding thresholds**, and no numeric mapping between ITA degrees, Fitzpatrick types, and Monk-style tone scales exists in the corpus [distilled-photographic-craft.md, section 8 item 11]. Do not invent thresholds.

### 4.2 Fitzpatrick Skin Type (FST) and why not to lean on it

FST is a **UV-response scale, not a color-measurement scale**. It has "limited quantification and reliability, particularly for nonwhite individuals" [distilled-photographic-craft.md, section 7.2]. It was built to predict how skin reacts to ultraviolet exposure, which is a dermatological question, and it is repurposed as a color label constantly and badly.

The corpus lists four stated reasons algorithms fail on darker skin, two of which are measurement failures [distilled-photographic-craft.md, section 7.2]:

1. Reference methods (relative skin reflectance) require "a highly controlled acquisition environment (constant background, lighting and camera)," which is unrealistic in the wild.
2. FST is unreliable for nonwhite subjects, so training and evaluation labels are noisy.
3. Illumination sensitivity: skin-color estimates drift most exactly where lighting is uncontrolled.
4. Demographic data "may be overlooked because it is difficult to collect reliably," so bias never gets measured.

### 4.3 Everything drifts under illumination

Both ITA and RSR are "sensitive to changes in illumination," and all measures show higher intra-subject variability under varying illumination [distilled-photographic-craft.md, section 7.2]. Intra-subject variability (standard deviation, lower is more stable across illumination):

| Dataset | ITA | RSR | SREDS |
|---|---|---|---|
| Multi-PIE High Resolution | 0.401 | 0.307 | **0.138** |
| Multi-PIE Multi-View | 0.926 | 0.860 | **0.820** |
| MEDS-II | 0.448 | 0.493 | 0.463 |
| Morph-II | 0.645 | 0.539 | **0.419** |

[distilled-photographic-craft.md, section 7.2]. Note MEDS-II is the one dataset where SREDS does not beat ITA (0.463 vs 0.448); the source presents SREDS as the overall winner and this row is a counterexample worth carrying.

### 4.4 The practical conclusion: prefer descriptive undertone language

Because the categorical scales are unreliable for exactly the subjects where accuracy matters most, and because every numeric measure drifts with the illumination the prompt is also specifying, **write descriptive optical language instead of category labels.** A phrase like "deep skin with a warm reddish-brown undertone, luminous under soft light, holding saturation in the shadow side" specifies the render. A phrase like "Fitzpatrick VI" specifies a UV response and nothing about how the image should look.

---

## 5. The lighting recipe table

Indexed by optical depth of tone, because depth of tone is what changes the specular-to-diffuse ratio and therefore the lighting math. Read every row as a statement about light.

| Tone depth | Source size and distance | Fill ratio | Rim / backlight | Reflector choice | Resulting prompt phrasing |
|---|---|---|---|---|---|
| **Light** (high ITA) | Medium to large source, moderate distance. Hard light is survivable because the diffuse return is strong enough to compete with the speculars, but it burns highlights fast: light skin clips before it goes dimensional | **More fill.** "Lighter skin tones may need more fill to avoid harsh shadows" [distilled-photographic-craft.md, 7.4]. Target roughly 2:1 to 3:1 key to fill | **Optional.** Separation is usually free against most backgrounds | **Bleached muslin**, which "tends to suit lighter skin better" [distilled-photographic-craft.md, 7.4]; silver for bright neutral fill | "soft window light from camera left with a white bounce card filling the shadow side, pale skin with a cool pink undertone, gentle specular sheen on the cheekbone, highlights held just below clipping" |
| **Medium** | Large source, close enough to wrap. A beauty dish sits well here for the "balance between soft and contrasty light" it gives [distilled-photographic-craft.md, 7.4] | Moderate. Roughly 3:1 to 4:1. Enough to keep shadow detail, not enough to erase form | Optional but improves the frame. Add when the background luminance is close to the subject's | **Unbleached muslin** (warm-toned), which "wraps light gently around faces and adds a subtle glow" for medium to dark skin; **gold** if warmth is wanted | "large softbox at 45 degrees, one meter from the subject, medium skin with a golden undertone taking the light warmly, soft falloff across the far cheek, single unbleached muslin bounce lifting the shadow side slightly" |
| **Olive** | Large soft source. Olive skin carries a green-yellow cast that goes sallow under cool sources and comes alive under warm ones | Moderate, slightly less than medium. Olive holds contrast well | Optional | **Gold**, which "adds warmth and radiance to brown and olive skin" [distilled-photographic-craft.md, 7.4] | "warm 3200 K key through a large diffusion frame, olive skin with a green-gold undertone reading rich rather than sallow, gold bounce adding a warm radiance along the jawline" |
| **Brown / deep-medium** | **Large source, close.** Closeness matters twice: it softens the specular lobe and it gives you the inverse-square gradient across the face that reads as real [distilled-photographic-craft.md, 4.5] | **Less fill.** "Darker skin tones often require less fill to maintain depth and contrast" [distilled-photographic-craft.md, 7.4]. Roughly 4:1 to 6:1 | **Strongly recommended.** "Use backlight to create separation between subject and background, especially for darker skin tones" [distilled-photographic-craft.md, 7.4] | **Gold** or **unbleached muslin** | "large diffused source close to the subject at 45 degrees, rich brown skin with a warm red undertone holding full saturation, a controlled sheen along the cheekbone and brow, minimal fill so the shadow side falls away, a soft rim light separating the shoulder from the background" |
| **Deep** (low ITA) | **Large source, close, well off axis.** This is the row where source geometry is doing all the work. Hard or on-axis light here produces the hotspot-on-dark-field failure from section 1.1 | **Least fill.** On deep skin the shadow side is already close to black, so heavy fill flattens it. Shape comes from a controlled key plus separation, not from lifting the shadow [distilled-photographic-craft.md, 7.4] | **Mandatory.** Without a rim, edge or kicker light the subject merges into a dark background. A **hair light** additionally "adds separation and helps bring out detail and texture in the hair" that would otherwise absorb all light [distilled-photographic-craft.md, 7.4] | **Unbleached muslin** or **gold**, never a hard silver bounce into the face (silver returns a specular-heavy bounce, which is the component you are trying to control) | "large softbox close and 45 degrees off axis, deep skin rendering luminous with a warm undertone and full saturation in the midtones, soft controlled sheen on the forehead and cheekbone rather than hard glare, minimal fill so the shadow side falls to near black, distinct warm rim light separating head and shoulder from the dark background, hair light picking out texture" |

**Modifiers named by the source** [distilled-photographic-craft.md, section 7.4]: softboxes (diffuse), beauty dish (the balance between soft and contrasty), umbrellas (broad, soft), scrims and diffusion panels. Reflectors: gold (warmth and radiance on brown and olive skin), silver (bright neutral fill), unbleached muslin (warm, gentle wrap, medium to dark skin), bleached muslin (suits lighter skin better).

**Colour temperature note:** production daylight runs 5000-6500 K and tungsten 3200 K [distilled-photographic-craft.md, section 4.1]. CTO warms a cool source, CTB cools a warm one, and adjustable-CCT LED fixtures let you match room practicals rather than fight them [distilled-photographic-craft.md, section 4.2].

---

## 6. The multi-subject rule

When two or more subjects with different skin tones share one frame and one light, the source gives a specific placement rule [distilled-photographic-craft.md, section 7.4]:

> **"Place your light source closest to the darkest-skinned subjects."**

Inverse-square then naturally gives that subject more light and the lighter-skinned subject less, equalizing the recorded diffuse returns without a second fixture.

**The alternative:** run **multiple key lights at different intensities**, and use reflectors to lift only the deeper-skinned subject [distilled-photographic-craft.md, section 7.4].

**The quantitative constraint that makes or breaks this technique.** The falloff table gives the magnitude of the effect, and it is entirely distance dependent [distilled-photographic-craft.md, section 4.5]. Same 1.5 ft separation between two subjects each time:

| Subject A / Subject B distance from source | Relative brightness difference |
|---|---|
| **3 ft vs 4.5 ft** | large, obvious difference |
| **6 ft vs 7.5 ft** | reduced difference |
| **12 ft vs 13.5 ft** | "virtually the same brightness" |

So **the technique only works when the source is close.** At 12 ft the placement rule buys you nothing and you must go to multiple keys [distilled-photographic-craft.md, section 7.4 cross-reference, marked INFERRED]. The underlying law: doubling the distance loses 4x the light, which is 2 stops, and "light intensity or brightness drops much faster closer to the source than it does further away" [distilled-photographic-craft.md, section 4.5].

**Prompt phrasing for a two-subject frame:**

> "two subjects side by side, a large softbox placed close on the left and angled so it sits nearest the subject with the deeper skin tone, the natural falloff across the pair equalizing their exposure, both faces rendering with full undertone and neither washed out, a soft rim from a warm kicker separating both from the background"

---

## 7. Undertone vocabulary and Kelvin interaction

Standard undertone vocabulary from the source: **warm** (golden, yellow, peach), **cool** (pink, red, blue), **neutral / olive** (green-yellow cast) [distilled-photographic-craft.md, section 7.4]. The wrist-vein test (blue veins mean cool undertone, green veins mean warm undertone) is offered by the same source but rests on a single practitioner claim with no validation [distilled-photographic-craft.md, section 7.4, marked THIN, and section 8 item 12]. Use the vocabulary, not the test.

Undertone determines how skin responds to source colour temperature. Because the specular component returns the illuminant's colour unchanged and the diffuse component returns the skin's own colour, a mismatch between illuminant and undertone shows up as a split: the sheen goes one way and the flesh goes the other.

| Undertone | Under warm source (2000-3400 K: candle 2000 K, household tungsten 2800-2900 K, studio tungsten 3200 K, golden hour 2500-3500 K) | Under neutral daylight (5400-6500 K) | Under cool source (overcast 6800 K, open shade 8000-25,000 K, blue hour 10,000 K+) |
|---|---|---|---|
| **Warm / golden / peach** | Reinforced and glowing. The most flattering pairing. Risk is going orange if the grade also pushes warm | Reads true and healthy | Fights the source. Skin goes muddy or slightly green as the yellow undertone meets a blue illuminant |
| **Cool / pink / blue** | Neutralized toward a pleasant balance. Warm light is generally kind to cool undertones | Reads true, pink undertone visible in the cheeks and around the eyes | Reinforced toward pallor. Skin can read bloodless or blue-gray. Add a warm bounce |
| **Neutral** | Warms attractively without going orange. The most forgiving undertone | Reads true | Cools without a strong penalty |
| **Olive (green-yellow)** | Comes alive: the warm source lifts the gold in the undertone and suppresses the green | Reads true, characteristic green-gold cast visible | Goes sallow. This is the worst common pairing. Correct with a warm bounce or a partial CTO on the key |

**Kelvin reference figures used above** [distilled-photographic-craft.md, section 4.1 and 4.4]: candle 2000 K, 40-60 W household tungsten 2800 K, studio tungsten 3200 K, tungsten halogen 3300 K, cool white fluorescent 4300 K, midday sunlight 5400 K, typical daylight (sun plus sky) 6500 K, overcast sky 6800 K, hazy sky 8000 K, clear blue sky / open shade lit by sky only 10,000-25,000 K, electronic flash tubes ~5500-6000 K, golden hour ~2500-3500 K, blue hour 10,000 K+.

Two operationally important notes:

- **Perceptual shift size is constant in mireds, not Kelvin** (MIRED = 1,000,000 / Kelvin). A 100 K error at 3200 K is far more visible than a 100 K error at 6500 K [distilled-photographic-craft.md, section 4.2]. So getting the undertone right under tungsten is more demanding than under daylight.
- **Golden hour sits in tungsten territory** at 2500-3500 K, which is why an auto-white-balanced golden hour frame comes back neutral and disappointing. The warmth must be preserved deliberately in the prompt [distilled-photographic-craft.md, section 4.4].
- **Fluorescent and cheap LED sit off the blackbody locus entirely** and need a green/magenta tint correction in addition to a Kelvin correction. That residual green cast on skin is one of the strongest "real room" signatures [distilled-photographic-craft.md, section 4.3].

---

## 8. Prompt-phrasing bank

Written descriptively: undertone, luminosity, specular behavior, and how the tone responds to the specified light. No ethnic category labels are used or needed. Combine one skin phrase with one light phrase.

**Deep tones**

- "deep skin with a warm red-brown undertone, rendering luminous under a large close softbox, a soft controlled sheen along the cheekbone and brow rather than hard glare, full saturation retained in the midtones, shadow side allowed to fall to near black"
- "very deep skin with a cool blue-black undertone, lit by a large diffused source well off the lens axis, the sheen reading as a soft gradient across the temple, a warm rim light separating the head from the dark background, no fill on the shadow side"
- "deep skin with a neutral undertone under overcast 6800 K light, near-shadowless soft rendering, low contrast, faint top-down shading under the brow and chin, skin holding its depth and colour rather than being lifted toward gray"

**Brown and medium-deep tones**

- "rich brown skin with a golden undertone, warm 3200 K key through a diffusion frame, gentle wrap of light around the jaw, minimal fill preserving contrast, a subtle specular highlight down the nose bridge"
- "medium-brown skin with a reddish undertone, backlit at golden hour around 2800 K, a bright warm rim along the shoulder and hairline, the face filled by a gold bounce, cyan skylight fill in the shadows giving a genuine two-temperature scene"

**Olive tones**

- "olive skin with a green-gold undertone reading rich and warm under a 3200 K tungsten practical, gold bounce keeping it from going sallow, soft specular sheen on the forehead"
- "olive skin under midday 5400 K daylight in open shade, undertone reading true green-gold, low-contrast soft shading, no hard hotspots"

**Medium tones**

- "medium skin with a warm peach undertone, soft window light from camera left at two feet, a bright side of the face roughly two stops over the shadow side, a large soft rectangular catchlight in the eye, visible brightness gradient across the face from near cheek to far cheek"
- "medium skin with a neutral undertone under mixed interior light, warm 2900 K lamp on the face and cool 6500 K window spill behind, skin holding a warm cast that survives white balance"

**Light tones**

- "light skin with a cool pink undertone, soft overcast light, gentle shading under the brow and chin, highlights on the forehead held just below clipping, visible surface texture with pores and fine lines"
- "pale skin with a warm peach undertone under low tungsten light at 2800 K, warm cast fully preserved, mild specular sheen on the nose and cheekbone, shadows going dark and losing detail"

**Universal texture clause (append to any of the above).** Waxy, glossy or plastic skin lacking "pores, wrinkles, blemishes" is a named top-tier artifact tell, and excessive smoothness reads as "cinematic perfection" rather than capture [distilled-photographic-craft.md, sections 1.6 and 1.1]:

> "visible skin texture with pores, fine lines, slight unevenness in tone, a blemish or two, no smoothing"

---

## 9. Post-processing caution: shadow lift versus ashy skin

The source permits shadow lifting and immediately bounds it: "Boosting highlight and shadow sliders can help bring out detail," with the caution to "give a faithful representation of your subject's skin without over-lightening" [distilled-photographic-craft.md, section 7.4].

**The operative rule:**

> Do not lift luminance until the skin goes ashy or gray. Deep skin should retain saturation and a warm or cool undertone, not become desaturated brown [distilled-photographic-craft.md, section 7.4].

### What the two outcomes look like

| Correct shadow lift | Over-lightening into ashy |
|---|---|
| Shadow detail becomes legible: the jaw line, the far cheek, the fold of an ear are readable | Shadow detail is legible but colourless |
| **Saturation is retained or slightly increased** as luminance rises | Saturation falls as luminance rises. The skin desaturates toward neutral gray-brown |
| Undertone is still identifiable (warm red, cool blue, green-gold) | Undertone is gone. The skin is a flat mid-brown with no hue direction |
| Specular highlights still sit clearly above the diffuse midtone | Specular and diffuse have collapsed toward each other, so the face loses dimensionality |
| Contrast across the face still describes form | The face reads flat, a cutout pasted on the background |

### Why this failure is so common

Three mechanisms converge on it:

1. **Global shadow lift is a luminance operation.** Raising L without raising chroma is definitionally desaturation in perceptual terms.
2. **Phone pipelines do it automatically.** Underexposed capture plus globally lifted shadows pushes midtones up and compresses local contrast, giving "the characteristic flat, shadowless, everything-visible rendering" [distilled-photographic-craft.md, section 2.3], and semantic face brightening does it selectively to faces [distilled-photographic-craft.md, section 2.5].
3. **Noise reduction kills shadow colour.** Chroma noise is "the first thing noise reduction attacks, which is why NR kills shadow colour and leaves the watercolor look" [distilled-photographic-craft.md, section 5.2]. Aggressive NR in the shadows removes exactly the chroma information that keeps deep skin from reading as gray.

### Prompt guards to write in

- "shadow detail lifted just enough to read, skin retaining full saturation and its warm undertone, never desaturating toward gray"
- "no semantic face brightening, the subject exposed consistently with the rest of the scene rather than lifted independently of the background"
- "fine luminance grain retained in the shadows, mild chroma mottling, shadows not perfectly clean" [distilled-photographic-craft.md, section 5.2]
- "no skin smoothing, no highlight recovery flattening the specular sheen"

---

## 10. Fast checklist

1. Have you specified **source size, distance and off-axis angle**, not just "well lit"? (Section 1.2)
2. Is the **fill ratio** matched to tone depth, less fill for deeper tones, more for lighter? (Section 5)
3. Is a **rim, edge or hair light** present for deep tones? It is mandatory, not decorative. (Section 5)
4. Is the **reflector colour** right (gold or unbleached muslin for brown and olive, bleached muslin for light)? (Section 5)
5. For multiple subjects, is the **key nearest the deepest-skinned subject and close enough** for inverse-square to do the work? (Section 6)
6. Have you written an **undertone** in descriptive optical language rather than a category label? (Sections 4.4, 7)
7. Does the undertone **agree with the Kelvin** you specified, or have you added a corrective bounce? (Section 7)
8. Have you **negated semantic face brightening** and guarded against ashy over-lightening? (Sections 2.2, 9)
9. Is **skin texture** explicitly requested (pores, fine lines, unevenness) to defeat the waxy tell? (Section 8)
10. Have you avoided **on-axis hard light** (direct flash) unless the snapshot look is the deliberate goal? (Section 1.2)
