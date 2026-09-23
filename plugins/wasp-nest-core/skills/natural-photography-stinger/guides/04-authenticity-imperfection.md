# Guide 04: Authenticity and Deliberate Imperfection

**What this guide is for.** This is the playbook for making a generated image fail the "too clean" test on purpose. It explains why perfection is the single most reliable tell (with the measured detection numbers), which tell categories are effectively solved in 2026 and which remain open, which scene types fool people best and worst, and then gives you the operational core: a lever table mapping each imperfection to the exact prompt language that produces it and the specific failure it defeats. It also covers the counter-vocabulary for the acknowledged "plastic" smoothing failure mode, how to prompt real optical bokeh instead of computational bokeh, the Duchenne smile as describable anatomy rather than the vague word "genuine", a reusable snapshot-aesthetic prompt bank, and the anti-pattern word list.

**Load this when:** you are filling the `IMPERFECTION` slot of the prompt block in `03-prompt-construction.md`, diagnosing a render that looks like an illustration, choosing a shot type, or writing the imperfection selection in a plan-then-generate planner output.

---

## 1. Why perfection is the tell

### 1.1 The artifact taxonomy and the measured numbers

CHI 2025 study base: **450 diffusion images plus 149 real photographs = 599 images**, and **539,749 human responses** [distilled-photographic-craft.md].

| # | Category | Prevalence | Mean detection accuracy | % in the 40-60% band (effectively invisible) | Accuracy gain, 1 s to unlimited viewing |
|---|---|---|---|---|---|
| 1 | Anatomical implausibilities | ~1/3 of images | **65%** (CI 64.6-65.4) | 21.4% | +11% |
| 2 | Stylistic artifacts | ~1/3 of images | **64.9%** (CI 64.5-65.3) | 22.4% | +11% |
| 3 | Functional implausibilities | ~1/3 of images | **64.1%** (lowest) | **32.8%** (highest) | **+18%** (largest) |
| 4 | Violations of physics | **20 images (~9%)** | not reported | not reported | not reported |
| 5 | Sociocultural implausibilities | **12 images (~5.5%)** (rarest) | not reported | not reported | not reported |
[distilled-photographic-craft.md]

**Category 2, stylistic, is the one this skill exists to defeat.** Its contents: "waxy / glossy / plastic skin; excessive smoothness ('cinematic perfection'); inconsistent resolution between regions of one image; overly dramatic or picturesque quality" [distilled-photographic-craft.md].

**Human detection performance overall:**

| Metric | Value |
|---|---|
| Correctly identifying AI-generated (CHI 2025) | **76%** (CI 74-77), per-image range **32% to 99%** |
| Correctly identifying real photographs (CHI 2025) | **74%** (CI 72-76), range **28% to 92%** |
| Display time 1 s / 5 s / 20 s | **72% / 77% / 82%** (then plateau) |
| Participants hitting >=90% on the first ten images | **34%** |
| Overall success rate (arXiv 2507.18640) | **62%**, "only slightly higher than flipping a coin" |
| Success on AI images specifically (2507.18640) | **63%** (121,735 of 193,779) |
| Machine detector baseline (2507.18640) | **>95%** on both real and AI |
[distilled-photographic-craft.md]

Second study base: **12,500 global participants, Aug 1-8 2024, ~287,000 evaluations, 193,779 AI images shown** [distilled-photographic-craft.md].

**The per-image range 32% to 99% is the operative number.** Detection is not a property of the technology; it is a property of the individual image. Your job is to land in the 32% tail.

Most deceptive generator class on record: **GAN faces and inpaintings, below 50% detection**, with inpainting (real photo plus synthetic region) hardest of all [distilled-photographic-craft.md].

### 1.2 What is fixed and what is not, in 2026

| Status | Tell |
|---|---|
| **FIXED (largely)** | **Hands; teeth** |
| **OBSOLETE** | Traditional pixel-level tells, "increasingly useless"; detection accuracy "essentially a coin flip" |
| **UNFIXED** | Consistent light direction across the frame |
| **UNFIXED** | Correct shadow geometry |
| **UNFIXED** | Correct reflections |
| **UNFIXED** | **Optical (not edge-based) depth of field** |
| **UNFIXED** | Correct sensor noise |
[distilled-photographic-craft.md]

Both practitioner guides are **explicitly silent** on chromatic aberration, lens distortion, sensor noise, and true depth-of-field physics, "which is precisely why those are the strongest remaining levers for making a generated image read as a real capture" [distilled-photographic-craft.md].

**Strategic consequence.** Stop spending prompt budget on hands and teeth; that battle is won by the model. Spend it on the **optics and physics layer**: light direction coherence, shadow geometry, reflections, optical depth of field, and sensor noise. That is where the residual signal lives.

**Corroborating frequency data (ICLR 2026 X-AIGD).** Annotated instance counts: **Edges & Shapes 10,277**, Semantics 3,139, Symbols 1,980, across **3,035 valid annotated fake samples carrying 18,202 annotated artifact instances** (full collection **4,000 real** and **52,000 generated** across **13 generators**) [distilled-image-models.md]. Operational translation recorded there: the thing that most often betrays a generated photograph is **edge and shape integrity** (silhouettes, contact edges, where one object meets another, hair against background, fingers against fabric), not an implausible scene [distilled-image-models.md].

**Honesty note.** The 2026 fixed/unfixed claim "comes from a single practitioner marketing blog with no measurement" and is flagged in the source as the strategic premise resting on one non-peer-reviewed source [distilled-photographic-craft.md]. The X-AIGD frequencies "do not cover GPT Image or DALL-E models" [distilled-image-models.md]. Treat the direction as sound and the magnitudes as unverified.

### 1.3 The acknowledged mechanism

A professional creator working at **6,000 x 4,000 px** reported an "over-processed" or "plastic" look, micro-details "overly smoothed," and specifically absent "skin pores, fabric fibers, weathered stone, organic noise", calling it an "uncanny valley of smoothness." **OpenAI staff replied (April 21, 2026) acknowledging the issue stems from models balancing "denoising, coherence, and detail," which "smooth[s] out high-frequency texture"** [distilled-image-models.md].

Three consequences recorded in that thread [distilled-image-models.md]:
1. Micro-texture must be **named as subject matter** ("visible pores", "fine vellus hair", "fabric slub", "dust on the lens barrel"), because it will not survive by default.
2. **No "Style Raw" / no-polish switch exists in the API. There is no parameter that turns off smoothing**, only `quality`, and quality raises polish, not grit.
3. **Upscaling does not recover texture**; it "stretches an already-denoised image."

No workarounds were reported and no follow-up confirmed a fix [distilled-image-models.md]. **Prompt language is the only available control.**

---

## 2. Scene-type ranking, and what it implies for shot selection

| Scene type | Detection accuracy (lower = more photorealistic) | % in the bottom decile (most photorealistic) |
|---|---|---|
| **Portraits** | **72.7%** | **16%** |
| **Candid groups** | **73.4%** | not reported |
| Posed groups | 76.2% | **3%** |
| Full body | 77.2% | not reported |
[distilled-photographic-craft.md]

"Portraits and candid groups fool people most; posed groups and full-body shots fool people least" [distilled-photographic-craft.md].

**Operational rule:** prefer **single-subject portrait** or **candid-group** framing. Avoid posed-group lineups and full-body figures, which carry a **~3.5 to 4.5 percentage-point detection penalty**, and posed groups have only **3%** bottom-decile representation versus **16%** for portraits [distilled-photographic-craft.md].

**Why full body is worse:** more anatomy in frame means more anatomical surface to check, more contact edges (feet to ground, hands to objects) and more shadow geometry to get wrong. Note the vendor's own guidance to describe "full body visible, feet included" when you do need it, which is precisely the frame you should avoid when realism is the priority [distilled-image-models.md].

**The apparent conflict, resolved.** A second study ranks "human portraits" as *easiest* to detect. The comparison sets differ: CHI 2025 ranks *within* people-containing scenes, the other ranks people against non-people categories (landscapes, objects). "People are best at spotting wrongness in faces they can scrutinize, worst at scenes with no anatomy to check." **For shot selection use the CHI 2025 within-people ranking**, the only one that discriminates among the scene types this skill cares about, and resting on 539,749 responses [distilled-photographic-craft.md].

**Corpus-level caution:** hand-picked "highly photorealistic" sets were detected *less* accurately than uncurated full batches; "most generations contain visible artifacts and only a minority are convincing" [distilled-photographic-craft.md]. Generate several, select ruthlessly. Selection is part of the method, not an admission of failure.

---

## 3. The imperfection lever table

This is the core of the skill. Pick at least three levers from different rows, spanning at least two of {skin, optics, physics, framing/behavior}. Copy the middle column into the `IMPERFECTION` slot.

| Lever | What to write in the prompt | What it defeats |
|---|---|---|
| **Skin texture and pore detail** | "Visible skin pores across the nose, cheeks and forehead, fine vellus hair catching the light along the jaw, a few blemishes and uneven redness around the nostrils, faint under-eye discoloration, dry patches on the lips. Skin is not retouched." | The stylistic-artifact category: "waxy / glossy / plastic skin; excessive smoothness" [distilled-photographic-craft.md]. Directly counters the acknowledged denoising smoothing, which requires micro-texture be "named as subject matter" [distilled-image-models.md] |
| **Asymmetry** | "One eye sits slightly lower than the other, one nostril is slightly larger, the smile pulls more strongly to the left side, one eyebrow is higher, the hairline is uneven." | "Faces too perfectly symmetrical or unnaturally asymmetrical; real faces have subtle **consistent** asymmetry (one eye slightly lower, one nostril larger, a dominant smile side)" [distilled-photographic-craft.md]. Note the word consistent: pick a direction and hold it across iterations |
| **Mixed color temperature** | "A 2800 K household bulb overhead, 6500 K daylight through the window on the left, and a 4300 K fluorescent tube in the next room: warm faces, blue window spill, green ceiling bounce, and the white balance has only reconciled the warm source." | The single-illuminant AI look. "A real interior almost never sits at one Kelvin" and the authentic tells are the **residuals** of AWB failure: "one illuminant correct and the other visibly wrong in the same frame" plus "green/magenta tint that survives correction" [distilled-photographic-craft.md] |
| **Motion blur** | "Her raised hand is blurred by the movement while her face stays sharp; the near shoulder smears slightly; a passing figure at the frame edge is a soft streak." | The frozen-tableau look. Snapshot aesthetic names "meaningless blur" as a positive marker [distilled-photographic-craft.md] |
| **Focus miss** | "The focus has landed on his ear and shoulder rather than his eyes, so the eyelashes are just short of critically sharp." | The everything-perfectly-resolved read, and the "inconsistent resolution between regions of one image" stylistic artifact when regions are sharp for no optical reason [distilled-photographic-craft.md] |
| **Blown highlight** | "The window behind her is clipped to pure white with no detail, and the specular highlight on her forehead has just gone to paper white." | The HDR-everything-visible phone look. Authentic target: "shadows allowed to go dark and lose detail, highlights allowed to clip", versus the phone signature of "lifted shadows, compressed highlight roll-off" [distilled-photographic-craft.md] |
| **Lens flare (veiling)** | "Shooting slightly into the light, so a veiling haze lifts the blacks across the whole frame, contrast drops and the shadows go milky." | Impossibly deep blacks. Veiling flare is "a general reduction in contrast over the frame," "a lifting of shadows and midtones", no discrete shapes, black point rises, saturation drops [distilled-photographic-craft.md] |
| **Lens flare (ghosting)** | "A chain of small polygonal ghosts running from the streetlight through the frame center and out the opposite side, hexagonal because the iris is stopped down." | Physically wrong flare. Ghosts appear **opposite the light source across the center axis of the frame**, "often occur in series", one per reflective air-glass surface pair; straight-blade lenses give polygons, rounded blades give discs [distilled-photographic-craft.md] |
| **Chromatic aberration** | "Faint cyan and magenta fringing on the high-contrast edges in the frame corners only, absent at the center. Slight green fringing behind the focal plane and magenta in front on the out-of-focus specular edges." | Lens-free perfection. "Magnitude is zero at the frame center and increases toward the corners... **This radial gradient is the signature: fringing present in the corners and absent in the center**." Longitudinal CA is "green fringes behind the focal plane, magenta/purple in front" and **cannot** be corrected in software [distilled-photographic-craft.md] |
| **Vignetting** | "Corner darkening consistent with a wide aperture, with the out-of-focus highlights near the corners squashed into cat's-eye shapes." | The evenly-lit render. Optical vignetting is "most apparent at lower f-stops (wider apertures)" and clears on stopping down; natural vignetting follows the **cos^4 law**. "Real wide-open shots have darker corners *and* cat's-eye-shaped corner bokeh" [distilled-photographic-craft.md] |
| **Sensor noise, luminance** | "Fine monochromatic luminance grain, like film grain, present in the shadows and at the same level across both the sharp and the blurred parts of the frame." | The grain-free render. Luminance noise reads as "grey speckles... similar to film grain": **the pleasant noise, reads as film and as authenticity** [distilled-photographic-craft.md] |
| **Sensor noise, chroma** | "Mild blotchy color mottling in the darkest areas; the shadows are not perfectly clean." | Over-denoised shadows. Chroma noise is "blotchy or speckled patches of color", **the ugly noise, and the first thing noise reduction attacks**, which is why NR kills shadow color and leaves the watercolor look. Target: "fine monochromatic luminance grain in the shadows, mild chroma mottling, shadows not fully clean = a real capture. Perfectly clean shadows with soft-edged smeared texture = heavy NR or generation" [distilled-photographic-craft.md] |
| **JPEG artifacts** | "This is a photo that has been saved, sent and re-saved: faint 8x8 block structure in the flat sky area, slight ringing halos around the high-contrast edges and the lettering on the sign, red elements slightly muddier than the rest, and visible banding steps in the smooth wall gradient." | The freshly-rendered file. Blocking comes from **8x8 pixel blocks**, obvious at **quality 20**; mosquito ringing is worst "around text on contrasting backgrounds"; color bleeding comes from **4:2:0 chroma subsampling** forcing one chroma value across a **2x2 pixel** area; the **Cr** channel is subsampled most aggressively so "red lips, red signage, red clothing show artifacts before anything else"; banding may reduce a 200-shade gradient to **15-20 values**, and **3-4 recompression generations produce "harsh stripes"**. "A too-clean file with perfect gradients and pristine edges reads as freshly rendered" [distilled-photographic-craft.md]. Caution: do **not** achieve this with `output_compression` below 100, which "introduces artifacts that read 'digital', not as film grain" [distilled-image-models.md]; prompt it as scene content instead |
| **Cluttered background** | "The background is unarranged: a dish rack with plates still wet, a takeaway container, a cable running down the wall, a half-open cabinet. Nothing has been tidied for the photograph." | The stock-photo background, and the headshot tell of "generic office/stock backgrounds 'blurry in inconsistent ways'" with "gradients that seem to fade into nowhere" [distilled-photographic-craft.md]. Snapshot marker: "bare, unglamorous interiors replace formal studio settings" [distilled-photographic-craft.md] |
| **Cut-off framing** | "The top of her head is cut by the frame edge; a stranger's arm enters from the right and is cropped in half; the horizon is tilted about three degrees." | Composed-for-you framing. Snapshot markers: "Dutch-angled, offhand images", tilted or "drunken" horizons, subjects "cropped by the frame edge", **non-hierarchical arrangement**: "no single dominant subject, no rule-of-thirds discipline", photographs taken "mostly without aiming" [distilled-photographic-craft.md] |
| **Mid-motion awkwardness** | "Caught mid-gesture between two expressions, weight shifting onto one foot, one hand raised and unresolved, head turned slightly away from the lens." | The completed pose. Candid photography prioritizes the subject's "unguarded expression" and "unaltered state"; the snapshot register wants **"fragments of gestures and postures"** rather than complete poses [distilled-photographic-craft.md] |
| **Blink** | "One eye is half closed in a partial blink; the other is open." | The both-eyes-perfectly-open portrait. Pairs with asymmetry; use on candid registers, not on the professional headshot |
| **Genuine vs social smile** | See section 5 for the full AU6 language. Short form: "the smile narrows the eye aperture, the lower eyelids push up, crow's feet appear at the outer eye corners, the cheeks bulge and the skin under the eyes bags slightly, and the eyebrows lower very slightly." | The stock-photo social smile: "full teeth, wide mouth, eyes wide open and unwrinkled, brows unmoved" [distilled-photographic-craft.md] |
| **Lens smudge** | "A faint fingerprint smear on the lens front element scatters light from the bright window into a soft milky bloom on that side of the frame only, lifting the blacks locally." | The pristine optical path. Mechanistically this is localized veiling flare: non-image-forming scattered light producing "a general reduction in contrast" and "a lifting of shadows and midtones" [distilled-photographic-craft.md]. Any added glass surface increases reflections; "cheap uncoated filters flare badly" [distilled-photographic-craft.md] |
| **Dust** | "Dust on the lens barrel and a few specks of dust visible on the dark cabinet surface; small lint on the wool of the blazer." | The sterile render. "Dust on the lens barrel" is one of the vendor-thread examples of micro-texture that "must be named as subject matter, because it will not survive by default" [distilled-image-models.md] |
| **Light falloff gradient** (bonus, physics layer) | "The near cheek is visibly brighter than the far cheek; the wall three metres behind falls two stops darker than the subject." | **"Absence of any falloff gradient across the frame is a strong AI/studio tell. Real point-ish sources always leave a measurable brightness ramp"** [distilled-photographic-craft.md]. Magnitudes: 3 ft = f/16, 6 ft = f/8 (**-2 stops**), 12 ft = f/4 (**-4 stops**) [distilled-photographic-craft.md] |
| **Shadow geometry coherence** (bonus, physics layer) | "Every shadow in the frame runs the same direction from the single window, including the shadows of the objects on the far counter, and each has a visible source." | The unfixed-in-2026 physics tells: shadow direction misalignment, "multiple shadows diverging, or shadows with no visible source" [distilled-photographic-craft.md] |

### 3.1 Dosage

Three to five levers is the working range. Rationale: the CHI corpus shows **stylistic artifacts alone appear in about one third of images** and read as a category, so one lever rarely moves the needle [distilled-photographic-craft.md]. But the same taxonomy lists "overly dramatic" as itself a stylistic artifact, so a frame stuffed with flare plus grain plus blur plus tilt reads as an Instagram filter, which is its own artificial register. Pick levers that a single real camera in a single real moment would plausibly produce together.

### 3.2 Coherence constraints (levers that must agree)

| If you use | You must also | Because |
|---|---|---|
| Corner vignetting or cat's-eye bokeh | Use a wide-aperture description, not a stopped-down one | Optical vignetting is "most apparent at lower f-stops" and clears on stopping down [distilled-photographic-craft.md] |
| Polygonal ghosts | Say the iris is stopped down | Polygons come from straight aperture blades at a stopped-down setting; rounded blades give discs [distilled-photographic-craft.md] |
| Grain | Apply it to **both** sharp and blurred regions | "Grain that stops at the subject outline = synthetic" [distilled-photographic-craft.md] |
| Shallow depth of field on a phone register | Do not. Use deep focus instead | A phone main camera at "f/1.6" renders DoF like full-frame at **f/8**, the ultra-wide like **f/20**, the tele like **f/24** [distilled-photographic-craft.md] |
| Golden hour | Keep the warm cast rather than neutralizing it | Golden hour at **2500-3500 K** sits in tungsten territory, "which is why an AWB'd golden-hour shot often comes back neutral and disappointing; the warmth must be preserved deliberately" [distilled-photographic-craft.md] |
| Direct flash | Add the full flash signature, not just brightness | "Deer in the headlights": flat frontal light, hard-edged shadow just behind the subject on a nearby wall, specular hotspots on forehead/nose/cheeks, background falling to darkness, red-eye or a bright on-axis catchlight, slight blue-white cast (flash tubes **~5500-6000 K**) against a warm room [distilled-photographic-craft.md] |

---

## 4. The plastic failure mode: counter-prompt vocabulary

There is no parameter for this. `quality` "raises polish, not grit" [distilled-image-models.md]. Everything below is prompt text.

### 4.1 Name the micro-texture as subject matter

The vendor thread's own examples: **"visible pores", "fine vellus hair", "fabric slub", "dust on the lens barrel"** [distilled-image-models.md]. Extend along the same axis:

```
Visible skin pores, fine vellus hair along the jaw and upper lip, individual
eyebrow hairs with gaps between them, dry flaking on the lower lip, a healing
scratch on the knuckle, the weave of the shirt fabric readable at the collar,
fabric slub and pilling on the sleeve, a loose thread, dust settled on the
dark surfaces, scuffs and fingerprints on the painted wall, the grain of the
wooden table with a ring stain.
```

### 4.2 The vendor's official imperfection sentence

Copy this construction directly: "Use photography language (lens, lighting, framing) and explicitly ask for real texture (**pores, wrinkles, fabric wear, imperfections**)" [distilled-image-models.md].

The official worked example, quoted: a "photorealistic candid photograph of an elderly sailor standing on a small fishing boat", with "**weathered skin with visible wrinkles, pores, and sun texture**" and "**soft coastal daylight, shallow depth of field, subtle film grain**". The three-part recipe visible in it: **(a) candid not posed/staged, (b) named skin/texture imperfections, (c) named optical/physical properties** [distilled-image-models.md].

### 4.3 Process negation

State that the post-production which would have created the plastic look did not happen:

```
This photograph has not been retouched. No frequency separation, no skin
smoothing, no dodge and burn, no clarity or texture slider applied, no
teeth whitening, no eye brightening, no color grading. Straight out of
camera with default processing.
```

### 4.4 Register the resolution consistency requirement

Counter the "inconsistent resolution between regions of one image" stylistic artifact [distilled-photographic-craft.md] explicitly:

```
Detail level is consistent across the whole frame: the background carries the
same amount of real detail and the same grain as the subject, and nothing is
sharper or smoother than the optics would allow.
```

### 4.5 Model choice as a lever

If the register is photorealistic human skin or a phone/UGC candid, prefer `gemini-3-pro-image`: practitioner comparison found it rendered "skin texture, subsurface scattering in the lips, the way individual hair strands catch the shaft of window light" and "looks like a frame from a real camera" versus GPT Image 2.0's "strong digital painting"; on a phone-camera test it captured "fisheye, the hard overhead LED reflection on the hoodie, the slight sensor noise" while GPT 2.0's output was **"too clean, too evenly lit"** [distilled-image-models.md]. Counter-constraint: Nano Banana Pro **hard-refuses prompts involving prominent real people** [distilled-image-models.md].

---

## 5. Bokeh authenticity

### 5.1 Why computational bokeh reads fake

Optical depth of field is on the **UNFIXED** list, specifically "optical (not edge-based) depth of field" [distilled-photographic-craft.md]. The generated look inherits the computational-bokeh signature, whose failure modes are catalogued:

| # | Failure mode | Visible signature |
|---|---|---|
| 1 | Depth-map resolution errors | "sharp zones in the background and/or blurred zones on the subject": a crisp background patch, a soft shoulder |
| 2 | Segmentation / edge artifacts | Hair, hand outlines, glasses arms and cup handles get the wrong depth; flyaway hair blurs away; a background sliver between arm and torso stays sharp |
| 3 | **Specular highlight rendering (the biggest giveaway)** | Real optics: an out-of-focus point light "hits the sensor as large blur spots." Phone: captured "on only a few pixels, which tend to saturate", so the synthesized bokeh ball is a **dim gray disc** instead of bright, hard-edged and saturated. **"Real bokeh balls are brighter than their surroundings; fake ones are not."** |
| 4 | Blur gradient | "Blur intensity should change with depth" continuously; computational versions apply a **step**: subject sharp, everything behind at one blur level |
| 5 | Noise inconsistency | Computationally blurred areas are "totally free of grain" because Gaussian blurring *is* denoising. **"Grain that stops at the subject outline = synthetic."** |
| 6 | Bokeh shape fidelity | Only "circular shapes of varying sharpness". No **optical vignetting (cat's-eye highlights toward frame corners)**, no aperture-blade shapes, no onion-ring texture, no longitudinal chromatic fringing on out-of-focus edges |
| 7 | Repeatability | "Works best in bright conditions"; inconsistent even under "consistent lighting" |
[distilled-photographic-craft.md]

This is the same edge-based mechanism as the headshot halo tell: "hair/background halo, an unnatural hair-to-background transition, 'cut out and pasted', *identical to the computational portrait-mode segmentation artifact; both are edge-based, not optical*" [distilled-photographic-craft.md].

### 5.2 The positive identification list, turned into prompt language

The source's list of what real optical shallow DoF looks like: **continuous blur ramp with distance; bright saturated specular discs with defined edges; cat's-eye squashing near corners; matched grain in and out of focus; foreground blur as well as background blur. Any of these missing reads as computed/AI** [distilled-photographic-craft.md].

Copy-paste block:

```
OPTICAL BOKEH: Real optical shallow depth of field from a fast prime, not a
computational portrait-mode effect. The blur increases continuously with
distance rather than stepping: the near shoulder is slightly soft, the ear is
sharp, the collar behind is slightly soft, and the far wall is fully diffuse.
Out-of-focus point lights render as bright, saturated discs with defined hard
edges, brighter than their surroundings, and those discs are squashed into
cat's-eye shapes toward the frame corners. There is foreground blur as well as
background blur. Film grain is present at the same level inside the blurred
regions as on the sharp face. Flyaway hairs stay sharp against the soft
background with no halo, no cut-out edge and no clean segmentation line.
```

### 5.3 When not to prompt bokeh at all

On any phone register, **do not**. A phone main camera's equivalent aperture is **f/6.8 to f/8.2**, the ultra-wide **f/15.1 to f/20.2**, the 3x tele **f/23.8** [distilled-photographic-craft.md]. "A real phone photo has an entire room in focus, and any background separation must be synthesized" [distilled-photographic-craft.md]. Prompt deep focus and let the depth cue come from clutter and falloff instead.

---

## 6. The Duchenne smile as prompt language

"Genuine smile" is too vague to steer a model. Name the anatomy and, more importantly, the **visible signs**.

| Smile type | Muscles | FACS coding |
|---|---|---|
| **Genuine / enjoyment (Duchenne)** | *zygomatic major* (pulls lip corners up and back) **plus orbicularis oculi** (the muscle orbiting the eye) | **AU 6** (orbicularis oculi pars lateralis, "cheek raiser") **plus AU 12** (lip-corner pull) |
| **Social / fake** | *zygomatic major* only; the eye ring stays inactive | **AU 12 alone** |
[distilled-photographic-craft.md]

**The six visible signs of AU6 (this is the describable part, put these in the prompt):**
- cheeks are pulled **up**
- the skin **below the eye may bag or bulge**
- the **lower eyelid moves up**, narrowing the eye aperture
- **crow's feet wrinkles** appear at the outer corner of the eye socket
- the skin **above the eye is pulled slightly down and inwards**
- the **eyebrows move down very slightly**
[distilled-photographic-craft.md]

Copy-paste block:

```
EXPRESSION: A genuine enjoyment smile, AU6 plus AU12. The eye aperture is
narrowed because the lower eyelids have pushed up; the skin under each eye
bags slightly; crow's feet fan out from the outer corners of both eye sockets;
the cheeks are raised and bulging; the skin above the eyes is pulled slightly
down and inward and the eyebrows sit very slightly lower than neutral. The
eyes have changed shape, not just the mouth. The smile is asymmetric, pulling
harder to one side.
```

**The counter-target, to exclude:** the fake-smile tell is "the absence of movement in the outer part of the muscle that orbits the eye": wide mouth, unchanged eye aperture, no lower-lid rise. For broad fake smiles, the subtle clue is "a very slight lowering of the eyebrows and the skin between the eyebrow and the upper eyelid, which is called the **eye cover fold**" [distilled-photographic-craft.md]. The AI / stock-photo signature to write into `EXCLUDE`: **"full teeth, wide mouth, eyes wide open and unwrinkled, brows unmoved"** [distilled-photographic-craft.md].

**Honesty note.** The source itself states a "deliberately made broad smile will produce all these signs, making it more difficult to spot fabrication", so **the AU6 markers are a generation instruction, not a reliable discriminator** [distilled-photographic-craft.md]. Use them to specify; do not use them to certify.

---

## 7. The snapshot-aesthetic prompt bank

Reusable phrases. The whole point: the snapshot aesthetic "reads 'natural, point-and-shoot' but is usually **deliberately constructed**, 'staged spontaneity' that mimics amateur vernacular photography. That is exactly the task: reproduce the *signature* of unaimed shooting on purpose" [distilled-photographic-craft.md].

**The literal quote list of technical elements, worth keeping intact:**
> "meaningless blur, grain, muddy exposures, drunken horizons, and general sloppiness"
[distilled-photographic-craft.md]

### 7.1 Framing and composition

- "unposed, uncomposed, no technical perfection"
- "Dutch-angled, offhand", "tilted horizon", "drunken horizon"
- "the subject is cropped by the frame edge", "captured on the fly"
- "non-hierarchical arrangement, no single dominant subject, no rule-of-thirds discipline"
- "taken mostly without aiming"
[distilled-photographic-craft.md]

### 7.2 Exposure and texture

- "blur and grain present and unapologetic"
- "muddy, not optimized exposure, with flat shadows and clipped highlights"
- "direct flash, dazzling artificial light"
- "retained grain, one coherent white balance with a warm cast, shadows allowed to go dark and lose detail, highlights allowed to clip"
[distilled-photographic-craft.md]

### 7.3 Content and register

- "spontaneous, coincidental appearance"
- "intimate and vulnerable moment"
- "fragments of gestures and postures rather than complete poses"
- "an emotional register including boredom and vulnerability, not just joy"
- "bare, unglamorous interior rather than a formal studio setting"
[distilled-photographic-craft.md]

### 7.4 Candid technique numbers to cite in `OPTICS`

| Parameter | Value |
|---|---|
| Focal lengths | Primes at **28-50 mm** full-frame; **35 mm f/2 on APS-C** for documentary framing; **24 mm equivalent** for wider environmental context |
| Apertures | **f/2 or faster** to work in low light without flash |
| Shutter speeds | **1/500 s or higher** to stay ready and stop unpredictable motion |
| Zone focusing | Lens pre-set to a fixed distance, **typically 8-10 feet (~2.5-3 m)**, at **f/8 to f/16** |
[distilled-photographic-craft.md]

**Calibration anchor.** The modern default "photograph" a viewer's eye is calibrated to is a **24-26 mm phone frame**, not a 50 mm SLR frame: about **5.3 billion photos taken daily** as of 2024, **94% via mobile devices** [distilled-photographic-craft.md]. When in doubt about which optics read as "a photo", the phone main camera equivalent is the safest default.

### 7.5 Register-selection quick table

| Register | MEDIUM trigger phrase | Depth of field | Grain | Framing | Smile |
|---|---|---|---|---|---|
| Phone selfie | "photorealistic iPhone photo" | Deep, everything sharp | Present, heavier in shadows | Cut off, tilted, off-center | Mid-laugh, asymmetric |
| Candid third-party | "photorealistic candid photograph taken on a real camera" | Deep if phone, shallow only if a real lens is named | Present, even across frame | Frame-edge intrusions, drunken horizon | Between expressions |
| Professional headshot | "photorealistic professional photography, taken on a real camera" | Shallow, continuous ramp, cat's-eye corners | Present, matched in sharp and blurred regions | Deliberate, small headroom | Full AU6 block |

---

## 8. Anti-patterns: words that push toward the AI look

### 8.1 Vendor-named offenders (hard ban)

"Avoid words that imply studio polish or staging." Named offenders: **pristine, flawless, perfect, ultra-detailed, 8K, hyperdetailed, masterpiece** [distilled-image-models.md].

Also named as things to avoid: "generic stock-photo language for professional work"; "overly long prompts without clear structure"; "detailed camera specs expecting exact physical simulation" [distilled-image-models.md].

### 8.2 Extended ban list, by the failure each one induces

| Avoid | Induces |
|---|---|
| ultra-detailed, hyperdetailed, 8K, 4K quality, high resolution, sharp as a tack | The "inconsistent resolution between regions of one image" stylistic artifact, and unearned uniform micro-detail [distilled-photographic-craft.md] |
| perfect, flawless, pristine, immaculate, spotless | The core stylistic-artifact category: "excessive smoothness ('cinematic perfection')" [distilled-photographic-craft.md] |
| masterpiece, award-winning, breathtaking, stunning, epic | "Overly dramatic or picturesque quality", an explicitly listed stylistic artifact [distilled-photographic-craft.md] |
| cinematic, filmic look, movie still, dramatic lighting | Same. Also pulls toward the "idealized quality rather than authentic capture" uncanny tell [distilled-photographic-craft.md] |
| studio lighting, three-point softbox setup, professional lighting setup, eliminate harsh shadows | The no-falloff, no-shadow-geometry frame. Remember "absence of any falloff gradient across the frame is a strong AI/studio tell" [distilled-photographic-craft.md]. These terms are legitimate only in the professional-headshot register, and even there must be paired with an explicit falloff description |
| smooth skin, glowing skin, radiant, porcelain, airbrushed, beauty retouching | Directly requests the waxy/plastic failure the vendor acknowledged [distilled-image-models.md] |
| symmetrical, balanced composition, perfectly framed, rule of thirds | Defeats the snapshot markers of "drunken horizons", frame-edge cropping and "non-hierarchical arrangement" [distilled-photographic-craft.md] |
| bokeh background, blurred background, portrait mode, dreamy bokeh | Invokes the edge-based computational look catalogued in section 5, including the dim-gray-disc specular failure [distilled-photographic-craft.md] |
| clean, crisp, pure white background, seamless backdrop, minimalist | The "generic office/stock backgrounds" and "gradients that seem to fade into nowhere" headshot tell [distilled-photographic-craft.md] |
| vibrant, saturated, punchy colors, HDR | Reproduces the phone over-processing register described as "garish", "cartoonish", "sterile and inhuman", "washed out" [distilled-photographic-craft.md] |
| posed, group photo lined up, everyone smiling at the camera | Selects the worst-performing scene types: posed groups at **76.2%** detection and only **3%** bottom-decile [distilled-photographic-craft.md] |
| full body, head to toe, feet included | Selects the worst scene type at **77.2%** detection [distilled-photographic-craft.md] |
| noise-free, clean shadows, no grain | "Perfectly clean shadows with soft-edged smeared texture = heavy NR or generation" [distilled-photographic-craft.md] |

### 8.3 The substitution table

| Instead of | Write |
|---|---|
| "ultra-detailed skin" | "visible pores, fine vellus hair, uneven tone, a blemish on the chin" |
| "beautiful bokeh" | "continuous blur ramp with distance, bright hard-edged specular discs, cat's-eye squashing toward the corners, grain matched in and out of focus" |
| "dramatic lighting" | "a single window camera-left at 6500 K, near cheek two stops over the far cheek, all shadows running the same direction" |
| "professional photo" | "shot at 85 mm from about 2.5 m" plus the actual optical description |
| "genuine smile" | The AU6 six-sign block from section 6 |
| "candid" | "caught mid-gesture between two expressions, head turned slightly away, one hand blurred by movement" |
| "high quality" | Delete. Replace with a lens, a distance, a light source and a grain description |

---

## 9. Two-minute audit

Before sending, check the render brief against this. Every "no" is a defect.

1. Is at least one lever from the **optics layer** present (bokeh ramp, CA, vignetting, flare)? That layer is UNFIXED in 2026 [distilled-photographic-craft.md].
2. Is at least one lever from the **physics layer** present (light direction coherence, shadow geometry, falloff gradient, reflections)? Same reason [distilled-photographic-craft.md].
3. Is **grain** specified, and specified as present in **both** the sharp and blurred regions? "Grain that stops at the subject outline = synthetic" [distilled-photographic-craft.md].
4. Is micro-texture **named as subject matter** rather than implied? It "will not survive by default" [distilled-image-models.md].
5. Is the scene type a **portrait (72.7%)** or a **candid group (73.4%)** rather than a posed group (76.2%) or full body (77.2%) [distilled-photographic-craft.md]?
6. Does the frame contain **more than one color temperature** if it is an interior [distilled-photographic-craft.md]?
7. Is there a visible **brightness falloff ramp** somewhere in the frame [distilled-photographic-craft.md]?
8. Is the smile specified by **AU6 visible signs**, not by the word "genuine" [distilled-photographic-craft.md]?
9. Zero occurrences of the banned words in 8.1 [distilled-image-models.md]?
10. If the register is a phone, is depth of field **deep**, matching an equivalent aperture of **f/6.8 to f/8.2** [distilled-photographic-craft.md]?
11. Are you generating several and selecting, given that "most generations contain visible artifacts and only a minority are convincing" [distilled-photographic-craft.md]?
