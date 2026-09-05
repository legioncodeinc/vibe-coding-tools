# Distilled Photographic Craft: Reference for Prompt Construction
Scope: distilled from the 27 `craft--*` raw research files in `raw/`. Every factual claim carries a bracketed source citation. Claims marked **[INFERRED]** are reasoning across sources, not stated in any source. Claims marked **[THIN]** rest on a single practitioner / non-peer-reviewed source.

## 1. The AI-Look Artifact Taxonomy
### 1.1 The five-category taxonomy (CHI 2025 / arXiv 2502.11989)
Study base: 450 diffusion images (Midjourney, Adobe Firefly, Stable Diffusion) + 149 real photographs = 599 images; 539,749 human responses [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md].

| # | Category | Prevalence in corpus | Mean detection accuracy | % in 40-60% band (effectively invisible) | Accuracy gain 1 s to unlimited viewing |
|---|---|---|---|---|---|
| 1 | Anatomical implausibilities | ~1/3 of images | **65%** (CI 64.6-65.4) | **21.4%** | **+11%** |
| 2 | Stylistic artifacts | ~1/3 of images | **64.9%** (CI 64.5-65.3) | **22.4%** | **+11%** |
| 3 | Functional implausibilities | ~1/3 of images | **64.1%** (lowest) | **32.8%** (highest) | **+18%** (largest) |
| 4 | Violations of physics | **20 images (~9%)** | not reported | not reported | not reported |
| 5 | Sociocultural implausibilities | **12 images (~5.5%)** (rarest) | not reported | not reported | not reported |
[raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md]

**Category contents:**

| Category | Specific artifacts |
|---|---|
| 1. Anatomical | Extra / missing / malformed digits; facial feature proportion irregularities (eye, mouth, nose); body-part misalignment; disproportionate scaling between subjects in one frame; **biometric artifacts**: eye size/shape, **interpupillary distance**, ear positioning, non-persisting moles/scars [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| 2. Stylistic | Waxy / glossy / plastic skin; excessive smoothness ("cinematic perfection"); **inconsistent resolution between regions of one image**; overly dramatic or picturesque quality. Defined as "qualities of entire images or inconsistencies of those qualities within an image" [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| 3. Functional | Objects that couldn't work as designed (loose/unattached guitar strings, hands not gripping); implausible object placement; atypical buttons, buckles, garment prints; **text distortion / garbled glyphs** [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| 4. Physics | Shadow direction misalignment (multiple shadows diverging, or shadows with no visible source); reflection irregularities in mirrors, water, shiny surfaces; depth and perspective distortion; warping and trajectory misalignment [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| 5. Sociocultural | Socially inappropriate scenarios; cultural norm violations (wrong uniforms, misplaced symbols); historical inaccuracies [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |

**Key ranking:** functional implausibilities are the *hardest for humans to notice* (32.8% in the indistinguishable band, +18% gain with deliberate inspection). They require conscious scrutiny, not a glance [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md].

### 1.2 Overall human detection performance
| Metric | Value | Source |
|---|---|---|
| Correctly identifying AI-generated (CHI 2025) | **76%** (CI 74-77); per-image range **32%-99%** | [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| Correctly identifying real photographs (CHI 2025) | **74%** (CI 72-76); range **28%-92%** | [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| Display time 1 s | 72% | [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| Display time 5 s | 77% | [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| Display time 20 s | 82% (then plateau) | [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| Participants hitting >=90% on first ten images | 34% | [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md] |
| Overall success rate (arXiv 2507.18640) | **62%**, "only slightly higher than flipping a coin" | [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md] |
| Success on AI images specifically (2507.18640) | **63%** (121,735 of 193,779) | [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md] |
| Machine detector baseline (2507.18640) | **>95%** on both real and AI, consistent across categories | [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md] |

Study 2 base: 12,500 global participants, Aug 1-8 2024; ~287,000 evaluations; 193,779 AI images shown; 1,000+ image database [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md].

### 1.3 CONFLICT: are portraits easy or hard to detect?
- **CHI 2025:** portraits are the *hardest to detect* (most photorealistic) of the people-containing scene types, at 72.7% accuracy and 16% of portraits in the most-photorealistic bottom decile [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md].
- **arXiv 2507.18640:** "Easiest to detect: human portraits (highest accuracy)"; hardest are natural landscapes, then urban landscapes, then objects [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md].

**Resolution: the comparison sets differ, and both readings are compatible.** CHI 2025 ranks *within* people-containing scenes (portrait vs candid group vs posed group vs full body). 2507.18640 ranks people against *non-people* categories (landscapes, objects). The combined reading, stated in the raw file itself: "people are best at spotting wrongness in faces they can scrutinize, worst at scenes with no anatomy to check" [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md]. **Better supported for shot selection: the CHI 2025 within-people ranking**, because it is the only one that discriminates among the scene types this reference cares about, and it rests on a far larger response count (539,749 responses vs ~287,000 evaluations spread over more categories) [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md; raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md].

### 1.4 Scene-type ranking (drives shot selection)
| Scene type | Detection accuracy (lower = more photorealistic) | % in bottom decile (most photorealistic) |
|---|---|---|
| **Portraits** | **72.7%** | **16%** |
| **Candid groups** | **73.4%** | not reported |
| Posed groups | 76.2% | 3% |
| Full body | 77.2% | not reported |

"Portraits and candid groups fool people most; posed groups and full-body shots fool people least" [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md].

**Operational rule [INFERRED from the table]:** prefer single-subject portrait or candid-group framing; avoid posed-group lineups and full-body figures, which carry a ~3.5-4.5 percentage-point detection penalty and only 3% bottom-decile representation for posed groups.

### 1.5 By generator (most to least deceptive)
| Generator class | Detection | Source |
|---|---|---|
| **GAN faces and inpaintings** | **below 50%**, most deceptive; inpainting (real photo + synthetic region) hardest of all | [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md] |
| Amazon Titan v1 with guided generation | "notably deceptive" | [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md] |
| DALL-E 3, Midjourney, Stable Diffusion | easier to identify | [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md] |

### 1.6 The practitioner ten-tell checklist
1. **Hands/fingers:** "too many or too few fingers, fingers that merge together, thumbs on the wrong side, or knuckles that bend in unnatural directions."
2. **Skin texture:** unnaturally smooth, plastic-like, lacking **pores, wrinkles, blemishes**; waxy or glossy.
3. **Background anomalies:** objects merging, misaligned shelves, impossible architecture, wobbling lines, vague foliage instead of distinct leaves.
4. **Lighting inconsistency:** "a subject's face may be lit from the left while their shadow falls in the wrong direction."
5. **Text/letters:** "letters that morph into meaningless shapes, words that are close to real English but not quite right, or characters from multiple alphabets mixed together."
6. **Symmetry:** faces too perfectly symmetrical or unnaturally asymmetrical; real faces have *subtle consistent* asymmetry (one eye slightly lower, one nostril larger, a dominant smile side).
7. **Hair:** "painted rather than stranded"; frizz, hairlines, and textured/coily hair are the worst failures.
8. **Jewelry/accessories:** mismatched pairs, chains that vanish behind a shoulder and don't re-emerge, random symbols instead of numerals on watch faces, uneven frame thickness, absent reflections.
9. **Reflections/shadows:** reflections showing a different viewing angle or missing scene elements; shadows missing, duplicated, oddly shaped.
10. **Uncanny quality:** an "idealized quality rather than authentic capture"; nothing individually wrong.

[raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md]

**Headshot-specific additions:** hair/background halo, an unnatural hair-to-background transition, "cut out and pasted", *identical to the computational portrait-mode segmentation artifact; both are edge-based, not optical*; asymmetric glasses frames; mismatched earrings; necklace sitting wrongly against a collar (these fail because they "require the AI to understand 3D space and physics"); generic office/stock backgrounds "blurry in inconsistent ways," background light sources not matching the subject light, gradients "that seem to fade into nowhere" [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md].

### 1.7 WHICH TELLS REMAIN UNFIXED IN 2026: the optics/physics layer
This is the load-bearing finding for prompt construction.

| Status | Tell | Source |
|---|---|---|
| **FIXED** (largely) | Hands; teeth | [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md] |
| **OBSOLETE** | Traditional pixel-level tells, "increasingly useless"; detection accuracy "essentially a coin flip" | [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md] |
| **UNFIXED** | Consistent light direction across the frame | [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md] |
| **UNFIXED** | Correct shadow geometry | [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md] |
| **UNFIXED** | Correct reflections | [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md] |
| **UNFIXED** | **Optical (not edge-based) depth of field** | [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md] |
| **UNFIXED** | Correct sensor noise | [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md] |

Both practitioner guides are **explicitly silent** on chromatic aberration, lens distortion, sensor noise, and true depth-of-field physics, "which is precisely why those are the strongest remaining levers for making a generated image read as a real capture" [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md].

**Corpus-level caution:** human curation matters. Hand-picked "highly photorealistic" sets were detected *less* accurately than uncurated full generation batches; most generations contain visible artifacts and only a minority are convincing [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md]. The 2507.18640 paper did not report which conscious visual cues participants used, so the cue attribution in the practitioner lists is not experimentally validated [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md].

## 2. Smartphone Computational Photography
### 2.1 Sensor hardware, phone vs full frame
| Parameter | Smartphone | Full-frame DSLR | Ratio |
|---|---|---|---|
| Sensor dimensions | **~5 x 4 mm** | **36 x 24 mm** | **~43x the area** |
| Pixel pitch | **~1.5 microns or less** | **~4 microns** | ~7x area per pixel |
| Raw tonal depth | **1024 levels (10-bit)** | **4096 (12-bit)** to **16384 (14-bit)** | 4-16x |
| Aperture | fixed, small | variable | light collection reduced by **two orders of magnitude** |
[raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md]

- Bayer CFA demosaic: **2/3 of the image's color data is interpolated, not measured** [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md].
- Module z-height limits effective focal length; makers compensate with **multiple camera modules at different effective focal lengths / fields of view** rather than one zoom [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md].
- Small aperture + short actual focal length gives **almost no optical DoF blur**; everything from ~0.5 m to infinity is effectively sharp; background separation is therefore synthetic "digital bokeh" computed from a depth/segmentation estimate [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md].

### 2.2 Per-lens specifications and full-frame-equivalent apertures
**iPhone 13 / 13 mini** [raw/craft--smartphone-computational-photography--dpreview-iphone13-camera-specs.md]

| Camera | Equiv. FL | Aperture | Sensor | Pixel pitch | Sensor area | **FF-equivalent aperture** | Stabilization |
|---|---|---|---|---|---|---|---|
| Wide (main) | **26 mm** | f/1.6 | 1/1.9" | 1.7 microns | 35.2 mm2 | **f/8.2** | sensor-shift |
| Ultra-wide | **13 mm** | f/2.4 | 1/3.4" | 1.0 microns | 12.2 mm2 | **f/20.2** | none, fixed focus |

**iPhone 13 Pro / Pro Max** [raw/craft--smartphone-computational-photography--dpreview-iphone13-camera-specs.md]

| Camera | Equiv. FL | Aperture | Sensor | Pixel pitch | **Equiv. aperture** | Focus / IS |
|---|---|---|---|---|---|---|
| Wide (main) | **26 mm** | f/1.5 | 1/1.65" | 1.9 microns | **f/6.8** | sensor-shift + OIS |
| Ultra-wide | **13 mm** | f/1.8 | 1/3.4" | 1.0 microns | **f/15.1** | PDAF, macro to **2 cm** |
| Telephoto (3x) | **77 mm** | f/2.8 | 1/3.4" | 1.0 microns | **f/23.8** | sparse PDAF, OIS, Night mode |

**Why it matters:** depth of field is set by the *equivalent* aperture. A phone main camera shooting "f/1.6" renders DoF like a full-frame lens at **f/8**; the ultra-wide like **f/20**; the tele like **f/24**. That is why a real phone photo has an entire room in focus, and why any background separation must be synthesized [raw/craft--smartphone-computational-photography--dpreview-iphone13-camera-specs.md].

**iPhone 17 Pro / Pro Max lineup** [raw/craft--smartphone-computational-photography--moment-iphone17-lens-lineup.md]

| Position | Equivalent FL | Sensor / output | Note |
|---|---|---|---|
| 0.5x Ultra-Wide | **13 mm** | 48 MP sensor, outputs 24 MP HEIF/JPG | same sensor and lens as iPhone 16 Pro / Pro Max |
| 1x Main Wide | **24 mm** | 24 MP output | "hasn't changed physically at all" from the prior generation |
| 2x | **~48 mm look** | digital crop of the main sensor | **NOT a physical lens** |
| 4x Telephoto | **100 mm** | 48 MP (drops to 12 MP at minimum focus distance) | **sensor size increased 56%**; replaced the iPhone 16's 5x |
| 8x | **200 mm** | digital zoom off the 4x module | |
| Front / selfie | not stated | sensor **almost 2x larger** than iPhone 16 Pro; **square sensor**; ProRes Log | square sensor enables auto landscape/portrait orientation switching |

Aperture f-numbers and exact sensor dimensions are **not published** in that article [raw/craft--smartphone-computational-photography--moment-iphone17-lens-lineup.md].

**Focal-length drift over generations:** main **26 mm to 24 mm** equivalent (wider, more perspective stretch on close subjects); telephoto **77 mm to 120 mm to 100 mm** equivalent [raw/craft--smartphone-computational-photography--moment-iphone17-lens-lineup.md; raw/craft--smartphone-computational-photography--dpreview-iphone13-camera-specs.md].

**Critical geometry consequence:** the "2x portrait" most people shoot is a **sensor crop of a 24 mm lens**, so it retains the 24 mm *perspective* geometry (nose enlargement at close range) even though the framing looks like 48 mm [raw/craft--smartphone-computational-photography--moment-iphone17-lens-lineup.md].

### 2.3 HDR merge behavior and its named artifacts
| Stage | Behavior | Source |
|---|---|---|
| Zero shutter lag (ZSL) | Frames continuously fill a ring buffer; the shutter press hands the *already captured* buffer to the pipeline | [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md] |
| Exposure schedule | Frames **deliberately under-exposed** to protect highlights; a schedule sets times across the burst | [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md] |
| Merge | **2-8 raw Bayer frames**, tile-wise, in the **frequency domain**, with *partial* merging: interpolation weights adapt to the measured difference between aligned tile pairs vs the modeled noise | [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md] |
| Degradation | On bad alignment it falls back to the single reference frame | [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md] |
| **Named artifacts** | **"ghosting" and "zipper" artifacts along the edges of moving objects** | [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md] |
| Tone mapping | A **1D LUT** compresses the merged range into display range; gamma encoding follows **Stevens's power law** coefficients for perceived brightness | [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md] |
| Net look | Underexposed capture plus globally lifted shadows pushes midtones up and compresses local contrast: the characteristic flat, shadowless, everything-visible rendering | [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md] |

**Named semantic stages (Apple):** **Smart HDR 4**, which "uses a learning-based approach to identify individual subjects in a photo and process different skin tones individually" (per-face local tone mapping, a per-person exposure rather than a global one); **Photographic Styles**, baked into the multi-frame pipeline, applying "local edits at appropriate stages" with semantic rendering that adjusts skies and faces "disparately" while preserving skin tones, and unavailable with ProRAW (therefore a *pipeline stage*, not a filter); **Deep Fusion / multi-frame**, pixel-level detail synthesis from a burst [raw/craft--smartphone-computational-photography--dpreview-iphone13-camera-specs.md].

### 2.4 Portrait-mode (computational bokeh) failure modes
| # | Failure mode | Visible signature |
|---|---|---|
| 1 | **Depth-map resolution errors** | Low-res depth map produces "sharp zones in the background and/or blurred zones on the subject, particularly when capturing moving scenes": a crisp background patch, or a soft shoulder/hand |
| 2 | **Segmentation / edge artifacts** | Complex contours (hair, hand outlines, glasses arms, cup handles) get assigned the wrong depth; flyaway hair blurs away; a background sliver between arm and torso stays sharp |
| 3 | **Specular highlight rendering** (the biggest giveaway) | Real optics: an out-of-focus point light "hits the sensor as large blur spots." Phone: captured "on only a few pixels, which tend to saturate," so the synthesized bokeh ball is a **dim gray disc** instead of bright, hard-edged and saturated. **Real bokeh balls are brighter than their surroundings; fake ones are not.** |
| 4 | **Blur gradient (depth transition)** | "Blur intensity should change with depth" continuously; computational versions apply a *step*: subject sharp, everything behind at one blur level. DXOMARK tests this with regular repeating patterns receding into the frame |
| 5 | **Noise inconsistency** | Computationally blurred areas are "totally free of grain" because Gaussian blurring *is* denoising. Real optical bokeh preserves the same grain level in and out of focus. **Grain that stops at the subject outline = synthetic.** |
| 6 | **Bokeh shape fidelity** | Phones deliver "circular shapes of varying sharpness" only. No **optical vignetting (cat's-eye highlights toward frame corners)**, no non-circular aperture-blade shapes, no onion-ring texture, no longitudinal chromatic fringing on out-of-focus edges |
| 7 | **Repeatability** | "Works best in bright conditions"; gives inconsistent results even under "consistent lighting," sometimes failing to engage at all |
[raw/craft--smartphone-computational-photography--dxomark-computational-bokeh.md]

**Positive identification list for real optical shallow DoF:** continuous blur ramp with distance; bright saturated specular discs with defined edges; cat's-eye squashing near corners; matched grain in and out of focus; **foreground blur as well as background blur**. Any of these missing reads as computed/AI [raw/craft--smartphone-computational-photography--dxomark-computational-bokeh.md].

### 2.5 Vocabulary for the processed look
Practitioner-named failure modes (quoted) [raw/craft--smartphone-computational-photography--iphone-over-processing-critique.md]:

| Named failure | Quote |
|---|---|
| Flat / washed-out tone mapping | "pictures taken on modern iPhones often look sort-of washed out and samey, like much of the contrast and highlights from real life were lost" |
| Smart HDR overreach | "Smart HDR does a bad job, making things look artificial and over processed" |
| Semantic face brightening | "every time there's a very bright background, the iPhone also tries to boost the brightness of the people in the photo, making them look very white" |
| Low-light selfie artifacts | "bizarre artifacts" producing "an 'absurd watercolor-like mess'" |
| Over-aggressive noise reduction | compromises fine texture |
| Scene decomposition failure | "the way it slices a scene into individual components for separate adjustments, sometimes fail to resolve in a satisfying final photo": sky, faces, foliage and skin each get their own treatment, so the frame no longer shares one coherent light |

**Adjectives used for the processed look:** "garish," "cartoonish," "sterile and inhuman," "washed out", contrasted against images with **natural imperfections: grain and a warm white balance** [raw/craft--smartphone-computational-photography--iphone-over-processing-critique.md].

**Phone look to reproduce deliberately:** lifted shadows, compressed highlight roll-off, faces brightened independently of the background, watercolor shadow texture, slightly over-sharpened edges with light halos, flat global tone. **Authentic look to reproduce instead:** retained grain, one coherent white balance with a warm cast, shadows allowed to go dark and lose detail, highlights allowed to clip [raw/craft--smartphone-computational-photography--iphone-over-processing-critique.md].

**Noise consequence:** small pixels need "non-trivial multiplicative gain," set by ISO; mobile images are **"markedly more noisy than images captured with DSLR sensors"** at equal scene light, and the denoisers that attack this are what create the smeared/watercolor shadows [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md].

## 3. Focal Length, Distance and Facial Geometry
### 3.1 The governing rule
Perspective is set by **camera-to-subject distance**, not focal length. Focal length only determines what distance you must stand at for a given framing [raw/craft--lens-focal-length-faces--portrait-focal-length-working-distances.md; raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md]. Fried et al. state that simulating this correctly requires a **full perspective camera model, not weak-perspective**, and that the distortion is "subtle but noticeable" [raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md].

### 3.2 Working-distance table (head-and-shoulders / headshot framing, full-frame equivalents)
| Focal length | Working distance (source 1) | Working distance (source 2) |
|---|---|---|
| **24 mm** | **~2-3 ft (0.6-0.9 m)**, **[INFERRED]**: explicitly flagged in the raw file as extrapolated from the linear relationship, not stated by either source | not given |
| **35 mm** | **3-5 ft (0.9-1.5 m)** | not given |
| **50 mm** | **4-6 ft (1.2-1.8 m)** | not given |
| **85 mm** | **6-10 ft (1.8-3.0 m)** | **6-8 ft** |
| **135 mm** | **10-15 ft (3.0-4.6 m)** | **12-15 ft or more** |
| **200 mm** | **20+ ft (6+ m)** | not given |
[raw/craft--lens-focal-length-faces--portrait-focal-length-working-distances.md]

**CONFLICT (minor, within one raw file):** the two cited practitioner sources disagree on 85 mm (6-10 ft vs 6-8 ft) and 135 mm (10-15 ft vs 12-15+ ft). Neither is better evidenced; both are practitioner guides with no measurement method given. **Use the union ranges (85 mm: 6-10 ft; 135 mm: 10-15+ ft)** and treat the narrower figures as the modal case [raw/craft--lens-focal-length-faces--portrait-focal-length-working-distances.md].

### 3.3 Fried's distance set (SIGGRAPH 2016)
| Distance | Role |
|---|---|
| **~60 cm** | Arm's-length selfie / smartphone self-portrait. Produces the enlarged-nose look; described as "visible distortions similar to the fisheye effect" |
| **90 cm** | Intermediate baseline used in mannequin ground-truth testing |
| **120 cm (1.2 m)** | Comparison distance |
| **480 cm** | "Far" / professional headshot distance |
[raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md]

Professional practice cited: photographers "position the camera several meters from the subject, using a telephoto lens to fill the frame", example pairing **~265 mm telephoto at far distance vs ~90 mm at close distance** for equivalent framing [raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md]. Validation: their focal-length/distance estimation from a single portrait achieved errors **below 2%** vs EXIF ground truth [raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md].

### 3.4 JAMA 2018 nasal distortion figures
Citation: Paskhover et al., *JAMA Facial Plastic Surgery*, **March 1, 2018**; lead author Dr. Boris Paskhover (Rutgers New Jersey Medical School) with Stanford; **DOI 10.1001/jamafacial.2018.0009** [raw/craft--lens-focal-length-faces--selfie-nasal-distortion-jama-2018.md].

| Condition | Value |
|---|---|
| Selfie distance modeled | **12 inches (30 cm)** |
| Standard portrait distance | **5 feet (1.5 m)** |
| Reference | **infinite distance** (orthographic, zero perspective distortion) |
| **Men: nasal width increase at 12 in vs 5 ft** | **+30%** |
| **Women: nasal width increase at 12 in vs 5 ft** | **+29%** |
[raw/craft--lens-focal-length-faces--selfie-nasal-distortion-jama-2018.md]

Method: the researchers "modeled an average male and an average female face as a collection of parallel planes, similar to how an art student might draw a 3D building receding toward the horizon"; the nose sits on a plane closer to the lens than the cheeks/ears, so at 12 in it occupies a disproportionately large solid angle [raw/craft--lens-focal-length-faces--selfie-nasal-distortion-jama-2018.md].

Related figure: 2017 American Academy of Facial Plastic and Reconstructive Surgery poll, **55% of surveyed plastic surgeons** reported patients requesting changes specifically to improve appearance **in selfies** [raw/craft--lens-focal-length-faces--selfie-nasal-distortion-jama-2018.md].

**CONFLICT / reconciliation on "selfie distance":** JAMA models **30 cm**; Fried uses **~60 cm** for arm's length. These are *different scenarios*, not contradictory measurements: 12 in (30 cm) is the extreme close-held phone, ~60 cm is a fully extended arm, 1.5 m is neutral, 3-4.6 m is flattering telephoto. The raw corpus resolves it exactly this way [raw/craft--lens-focal-length-faces--selfie-nasal-distortion-jama-2018.md; raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md].

### 3.5 Geometry effects by range
| Range | Facial geometry |
|---|---|
| **Close (<=60 cm)** | Nose enlarges relative to ears/cheeks; features nearest the lens (nose, forehead, chin when tilted) scale up disproportionately because relative depth differences across the face are a large fraction of total subject distance [raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md]. Forehead enlarged when the phone is held high, chin enlarged when held low; ears pushed back and partly hidden; jaw narrowed; face reads rounder/wider at center and tapering at the edges [raw/craft--lens-focal-length-faces--selfie-nasal-distortion-jama-2018.md] |
| **Far (>=3 m)** | Face flattens; nose/ear size ratio normalizes; the head reads "compressed" [raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md]. Facial planes flatten, nose and ears normalize [raw/craft--lens-focal-length-faces--portrait-focal-length-working-distances.md] |

### 3.6 Perceptual associations
| Range | Perceptual read |
|---|---|
| Close-up portraits | judged more **"peaceful," "approachable"** [raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md] |
| Distant / telephoto headshots | judged more **"attractive," "smart," "strong"** [raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md] |
| Short lens + close | "amateur/intimate" [raw/craft--lens-focal-length-faces--portrait-focal-length-working-distances.md] |
| Long lens + far | "professional/aloof" [raw/craft--lens-focal-length-faces--portrait-focal-length-working-distances.md] |

**85 mm vs 135 mm character:** 85 mm gives "just enough compression to flatten out any weird distortions" while keeping the working distance conversational; background is "beautifully out of focus, but you will still be able to tell" where you are; typical apertures **f/1.4-f/1.8**. 135 mm "pulls the background dramatically closer to your subject"; background "melts into an absolute wash of color," "a creamy, abstract painting"; typical apertures **f/2.8-f/3.5**. The trade: 85 mm keeps environmental context and lets you talk to the subject; 135 mm erases context and forces a shout across the room [raw/craft--lens-focal-length-faces--portrait-focal-length-working-distances.md].

## 4. Lighting
### 4.1 Full Kelvin table
| Band | Source | Kelvin |
|---|---|---|
| Warm | Match flame | **1700 K** |
| Warm | Candle | **2000 K** |
| Warm | Dawn sunlight | **2000 K** |
| Warm | 40-60 W household tungsten bulb | **2800 K** |
| Warm | 100-200 W household tungsten bulb | **2900 K** |
| Warm | 500-1000 W tungsten floods | **3000 K** |
| Warm | Warm white fluorescent | **3000 K** |
| Warm | Studio tungsten lamps | **3200 K** |
| Warm | Tungsten projector lamp | **3200 K** |
| Warm | Tungsten halogen | **3300 K** |
| Warm | Photoflood tungsten | **3400 K** |
| Mid | White fluorescent | **3500 K** |
| Mid | Cool white fluorescent | **4300 K** |
| Mid | Midday sunlight | **5400 K** |
| Mid | "Typical daylight" (sun + sky) | **6500 K** |
| Cool | Overcast sky | **6800 K** |
| Cool | Hazy sky | **8000 K** |
| Cool | Clear blue sky / open shade lit by sky only | **10,000-25,000 K** |
[raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md]

Supplementary values from other files: electronic flash tubes **~5500-6000 K** [raw/craft--real-world-lighting--on-camera-direct-flash-and-red-eye.md]; production daylight **5000-6500 K**, tungsten **3200 K** [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md]; golden hour **~2500-3500 K**, blue hour **10,000 K+** [raw/craft--real-world-lighting--golden-hour-sun-angle-color-temperature.md].

**Minor inconsistency to be aware of:** the mired worked example uses "Daylight 5500 K" while the same file's table lists midday sunlight at 5400 K and "typical daylight" at 6500 K [raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md]. These are different referents (nominal photographic daylight vs measured midday sun vs sun+sky), not a measurement disagreement. **[INFERRED]**

### 4.2 Mired math
`MIRED = 1,000,000 / Kelvin` [raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md]

| Source | Kelvin | Mireds |
|---|---|---|
| Daylight | 5500 K | **182 mireds** |
| Studio tungsten | 3200 K | **312 mireds** |

**The perceptual size of a color shift is constant in mireds, not Kelvin.** A 100 K error at 3200 K is far more visible than a 100 K error at 6500 K [raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md].

**Correction filters / gels:**

| Filter | Function | Mired shift |
|---|---|---|
| 85 | daylight to tungsten (amber) | **+112** |
| 81EF | half 85 (amber) | **+52** |
| 80A | tungsten to daylight (blue) | **-131** |
[raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md]

Production-side equivalents: **CTO** warms a cool source (daylight to tungsten); **CTB** cools a warm source; adjustable-CCT LED fixtures let you match room practicals rather than fight them [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md].

### 4.3 The off-blackbody-locus problem
- **Minus-green (magenta) gel** corrects the excess green of standard cool-white/warm-white fluorescent tubes; **plus-green** goes the other way to match a source *to* fluorescent [raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md].
- **Fluorescent and cheap LED are off the blackbody locus entirely.** They need a green/magenta (tint) axis correction *in addition to* a Kelvin correction. "This is exactly the residual cast that survives auto-white-balance and reads as 'real room'" [raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md].
- A real interior almost never sits at one Kelvin: 2800-3000 K lamps + 6500 K window + 4300 K overhead fluorescent in the same frame yields warm faces, blue window spill, green ceiling bounce [raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md].
- Open shade is **not** 5500 K; it is sky-lit at 8000-25,000 K, hence the classic blue-shadow cast [raw/craft--real-world-lighting--color-temperature-kelvin-mired-reference.md].

### 4.4 Golden hour and blue hour: sun angles, temperature, duration
| Stage | Sun elevation | Color temperature |
|---|---|---|
| **Golden hour** | **+6 degrees above to -6 degrees below** the horizon | **~2500-3500 K** |
| **Blue hour** | **-4 to -8 degrees** below the horizon | **10,000 K+** |
| Civil twilight (reference) | **0 to -6 degrees** | not applicable |
[raw/craft--real-world-lighting--golden-hour-sun-angle-color-temperature.md]

The golden/blue overlap is why the two bleed into each other [raw/craft--real-world-lighting--golden-hour-sun-angle-color-temperature.md]. Golden hour at 2500-3500 K sits in **tungsten territory**, which is why an AWB'd golden-hour shot often comes back neutral and disappointing; the warmth must be preserved deliberately [raw/craft--real-world-lighting--golden-hour-sun-angle-color-temperature.md].

**Duration (latitude and season dependent):** summer **15-20 minutes**; winter **45-60+ minutes**; shortest near the equator, can last hours at high latitudes [raw/craft--real-world-lighting--golden-hour-sun-angle-color-temperature.md].

**Light quality:** low sun angle produces long, gentle shadows that add depth; light travels through more atmosphere, Rayleigh-scattering blue out and leaving warm wavelengths; **reduced contrast** vs midday, "even exposure... easier to capture detail" [raw/craft--real-world-lighting--golden-hour-sun-angle-color-temperature.md].

**Three canonical daylight conditions** [raw/craft--real-world-lighting--golden-hour-sun-angle-color-temperature.md]:

| Condition | Kelvin | Sun elevation | Signature |
|---|---|---|---|
| Golden hour | 2500-3500 K | 0-6 degrees | shadows several times subject height, strong directional rim/kicker, warm skin, cyan/blue shadow fill from the sky: a genuine two-color-temperature scene |
| Midday | ~5400 K | 60-90 degrees | short hard shadows directly beneath, raccoon-eye shadows in eye sockets, hot forehead and nose, shadow under nose and chin, high contrast |
| Overcast | ~6800 K | entire sky is the source | near-shadowless, very low contrast, faint top-down shading (slight shadow under brow, nose, chin), no catchlight shape except a large soft band in the eye |

### 4.5 Inverse-square falloff
**The law:** doubling the distance from a light source loses **4x the light = 2 stops**, not one. "Light intensity or brightness drops much faster **closer** to the source than it does further away" [raw/craft--real-world-lighting--inverse-square-law-falloff.md].

**Worked distance/aperture table (constant ISO and shutter):**

| Distance from source | Correct aperture | Cumulative loss |
|---|---|---|
| **3 ft** | f/16 | baseline |
| **6 ft** | f/8 | **-2 stops** |
| **12 ft** | f/4 | **-4 stops** total |
[raw/craft--real-world-lighting--inverse-square-law-falloff.md]

**Two-subject falloff demonstration** (same 1.5 ft separation each time; the *ratio* matters, not the gap):

| Subject A / Subject B distance | Relative brightness difference |
|---|---|
| **3 ft vs 4.5 ft** | large, obvious difference |
| **6 ft vs 7.5 ft** | reduced difference |
| **12 ft vs 13.5 ft** | "virtually the same brightness" |
[raw/craft--real-world-lighting--inverse-square-law-falloff.md]

**Visual signature, near source vs far source:**

| Position | Shadows | Catchlights | Background |
|---|---|---|---|
| **Close to source** | sharper-edged | **bigger** | **darker** (background proportionally much farther, falls off hard) |
| **Far from source** | softer | **smaller** | **brighter** (subject and background at similar distances) |
[raw/craft--real-world-lighting--inverse-square-law-falloff.md]

**Worked window-light cases:**
- Person **2-4 ft from a window** in a real room: bright side of face **2-3 stops** over the shadow side, background **3-4 stops** down, visible gradient *across the face itself* (near cheek brighter than far cheek), large soft rectangular catchlight [raw/craft--real-world-lighting--inverse-square-law-falloff.md].
- Person **10+ ft from the window**: even, flat, low-contrast, tiny catchlight, background nearly as bright as the subject. This is the "real interior snapshot" look [raw/craft--real-world-lighting--inverse-square-law-falloff.md].
- **Absence of any falloff gradient across the frame is a strong AI/studio tell.** Real point-ish sources always leave a measurable brightness ramp [raw/craft--real-world-lighting--inverse-square-law-falloff.md].

### 4.6 Direct on-camera flash
| Characteristic | Detail |
|---|---|
| The look | **"Deer in the headlights"**: "the side of the subject which receives all the light is also the side the subject the camera sees, resulting in shadows that are barely visible, and a bright and harshly-lit subject" |
| Dimensionality | Subjects "look less three-dimensional"; the modeling shadow falls directly behind the subject, hidden by them |
| Texture | The hard, localized source **emphasizes surface texture undesirably**: skin appears rougher because every pore casts a tiny hard shadow, while sebum/sweat returns bright specular hotspots (forehead, nose bridge, cheekbones, chin) |
| Geometry collapse | Flash brackets and off-camera positions "appear increasingly similar to an on-camera flash the farther they are from your subject" |
| Bounce | Spreads the source over a large area but "greatly reduces its intensity," requiring more power |
[raw/craft--real-world-lighting--on-camera-direct-flash-and-red-eye.md]

**Black-background math (flash plus inverse-square):** subject at 6 ft with the wall behind at 12 ft, the wall gets **2 stops less** flash; at 18 ft it gets **~3.2 stops less**. Signature of a real on-camera flash snapshot: correctly exposed subject, a **hard shadow line on any wall close behind**, and rapid darkening into a black background when nothing is close behind [raw/craft--real-world-lighting--on-camera-direct-flash-and-red-eye.md].

**Red-eye mechanism and dependencies:**

| Factor | Mechanism |
|---|---|
| Optical path | Light "travels through the eyes and rebounds at the rear of the eye, turning the eyes red"; the flash enters the dilated pupil, reflects off the fundus, and returns along nearly the same axis into the lens |
| Color source | "the ample amount of blood in the **choroid**, which supports the back of the eye and lies behind the retina" |
| **Melanin** | Individuals with **less ocular melanin reflect more light**, so red-eye is stronger in light-eyed subjects |
| Geometry | "the close distance of the flash to the camera lens can also have an impact, especially on cameras with built-in flash". The smaller the flash-to-lens angle as seen from the subject, the stronger the effect, which is why compacts and phones (flash millimeters from the lens) produce it and a hot-shoe or bracket flash does not |
| Pupil state | More ambient light constricts pupils and reduces the effect; red-eye reduction fires **pre-flashes** to force pupil contraction before the exposure |
| Animals | Different colors by the same mechanism (a reflective layer behind the retina) |
[raw/craft--real-world-lighting--on-camera-direct-flash-and-red-eye.md]

Mitigations listed: subject looks away from the lens; more ambient light; flash on a hot shoe or bracket; bounce off white surfaces; fill flash; in-camera and software correction (face detection, region growing, grayscale approaches) [raw/craft--real-world-lighting--on-camera-direct-flash-and-red-eye.md].

**Composite authentic direct-flash snapshot:** flat frontal light, hard-edged shadow displaced just behind or beside the subject onto a nearby wall, specular hotspots on forehead/nose/cheeks, background falling to darkness, red-eye or a bright on-axis catchlight dead center in each pupil, slight blue-white color cast (flash tubes ~5500-6000 K) against a warm room [raw/craft--real-world-lighting--on-camera-direct-flash-and-red-eye.md].

### 4.7 AWB failure modes
**Gray World assumption.** Premise: "all the colors in an image ought to average out to a neutral gray"; for every blue there is a yellow, for every red a cyan. Implementation: average the whole frame, then scale R/G/B so the average becomes R=G=B [raw/craft--real-world-lighting--awb-gray-world-retinex-failure-modes.md].

**Retinex / white-point (Edwin Land, Polaroid).** Premise: human vision keys off the **brightest patches** to infer the illuminant color and discount it. Implementation: find the brightest pixels per R/G/B channel independently, scale so the highlights match across channels (equivalent to Photoshop Auto Levels with "Enhance Per Channel Contrast"). "When it works at all, it works very well," but it degrades badly with exposure problems [raw/craft--real-world-lighting--awb-gray-world-retinex-failure-modes.md].

| Scenario | Result |
|---|---|
| Mixed fluorescent + incandescent | "corrected result shows green and magenta color casts... looks rather worse": a single global correction cannot fix two illuminants at once |
| Over/underexposed channels | Retinex/Auto Levels "will *not* work properly, or at all"; a blown window or a specular hotspot poisons the estimate |
| Incandescent interior | Camera auto setting "failed to adjust for the color of light" (leaves the orange) |
| Predominantly colored subject | Gray World yields implausible neutralization; a snow/blue scene "simply has too much blue and too little red to reconstruct a plausible image". Same failure with green foliage, a red wall, a sunset, a wooden interior, or a face filling the frame |
[raw/craft--real-world-lighting--awb-gray-world-retinex-failure-modes.md]

**The authentic-photo tells are the *residuals* of these failures:** one illuminant correct and the other visibly wrong in the same frame (warm face + cyan window, or neutral face + orange lamp glow); green/magenta tint that survives correction (fluorescent, cheap LED); a global cast pulled by a dominant colored surface (green lawn gives magenta-ish skin; red wall gives cyan-ish skin) [raw/craft--real-world-lighting--awb-gray-world-retinex-failure-modes.md].

## 5. Sensor and Exposure Artifacts
### 5.1 SNR math
`SNR_photon = signal / std.dev = lambda / sqrt(lambda) = sqrt(lambda)` So **SNR rises with the square root of the number of photons captured.** Collect 4x the light gives 2x the SNR, i.e. 1 stop cleaner [raw/craft--sensor-exposure-artifacts--noise-iso-dynamic-range-explained.md].

- **Photon (shot) noise dominates** in modern cameras; it is not a defect but the Poisson statistics of light itself [raw/craft--sensor-exposure-artifacts--noise-iso-dynamic-range-explained.md].
- Sensor electronic (read) noise matters only near the bottom of the range; crossover at `SNR_photon = SNR_electronic` when `lambda* = sigma_sensor^2` [raw/craft--sensor-exposure-artifacts--noise-iso-dynamic-range-explained.md].

**Measured example: Sony A7R III (dual conversion gain)**

| Parameter | Low-gain state | High-gain state |
|---|---|---|
| Full well capacity | **48,500 photons** | **7,600 photons** |
| Sensor electronic noise (sigma_sensor) | **3.3 photons** | **1.01 photons** |
| Base ISO for that state | **ISO 100** | **ISO 640** |
| Engineering dynamic range | **13.8 stops** | **12.2 stops** |
[raw/craft--sensor-exposure-artifacts--noise-iso-dynamic-range-explained.md]

The dual-gain switch at ISO 640 is why many cameras get *cleaner* shadows at ISO 640 than at ISO 500 [raw/craft--sensor-exposure-artifacts--noise-iso-dynamic-range-explained.md].

**Dynamic range, mild conflict.** PhotoPXL gives perceptual/push-based acceptable quality up to **ISO 6400-25,600**, roughly **6 stops of shadow recovery at base ISO**, and usable DR of **12-13 stops** on a modern full-frame body (arguing SNR-threshold DR definitions are arbitrary) [raw/craft--sensor-exposure-artifacts--noise-iso-dynamic-range-explained.md]. PetaPixel gives **12-14 stops** in a single frame, "comparable to human vision and to good film stock" [raw/craft--sensor-exposure-artifacts--petapixel-noise-primer.md]. **These are compatible:** 12-13 is the perceptual working figure and 13.8 is the measured engineering figure for one body. The 14-stop top of PetaPixel's range is unattributed to a specific measurement, so **the PhotoPXL figures are better supported**; they name the body, the gain state, and the method [raw/craft--sensor-exposure-artifacts--noise-iso-dynamic-range-explained.md; raw/craft--sensor-exposure-artifacts--petapixel-noise-primer.md].

**Phone deficit:** phone pixel ~1.5 microns vs full-frame ~4 microns (~7x the area), so the phone is roughly **2.5-3 stops noisier per pixel** at the same scene light before any processing. That deficit is what noise reduction hides, and the hiding is the visible artifact [raw/craft--sensor-exposure-artifacts--noise-iso-dynamic-range-explained.md].

### 5.2 Luminance vs chroma noise, and why the distinction carries authenticity
| Type | Appearance | Cause | Authenticity read |
|---|---|---|---|
| **Luminance noise** | "grey speckles in the image, similar to film grain": monochrome, fine-grained, affects brightness only | photon and read statistics | **The pleasant noise.** Reads as film and as authenticity |
| **Chroma noise** | "blotchy or speckled patches of color": larger-scale mottling in red/green/blue | inaccurate per-channel data and demosaicing errors in low light | **The ugly noise.** Reads as cheap digital, and **it is the first thing noise reduction attacks**, which is why NR kills shadow color and leaves the watercolor look |
[raw/craft--sensor-exposure-artifacts--petapixel-noise-primer.md]

**Why the distinction matters for prompt construction:** the target is *fine monochromatic luminance grain in the shadows, mild chroma mottling, shadows not fully clean* = a real capture. *Perfectly clean shadows with soft-edged smeared texture* = heavy NR or generation [raw/craft--sensor-exposure-artifacts--petapixel-noise-primer.md]. This aligns exactly with the DXOMARK finding that **grain that stops at the subject outline = synthetic** [raw/craft--smartphone-computational-photography--dxomark-computational-bokeh.md].

**Scaling factors:** smaller sensors (compacts, phones) have tiny pixels collecting fewer photons, so higher noise probability (the source's argument against ever-higher pixel counts on the same sensor area); raising ISO is "effectively turning up the camera's internal amplifier" while the light coming in is *less*, so signal and noise amplify together; **heat and long exposure** (the source cites 30-minute exposures) heat the circuitry and add thermal/dark-current noise, giving hot pixels and blotchy color in long night exposures, worse with poor heat dissipation [raw/craft--sensor-exposure-artifacts--petapixel-noise-primer.md].

### 5.3 Rolling shutter: measured readout times by body
| Camera | Readout time |
|---|---|
| ARRI ALEXA Mini LF | **0 ms** (global shutter) |
| Sony A7S III | **8.3 ms** |
| Sony FX3 | **9.7 ms** |
| Canon EOS C70 | **12 ms** |
| BMPCC 6K Pro | **17 ms** |
| DJI Mavic 3 Cinema | **22 ms** |
| Sony A7 IV | **23 ms** |
| Sony A6700 | **30 ms** |
[raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md]

Phones and older/cheaper CMOS sit at the slow end, **typically 20-35 ms**, which is why phone video skews so readily. **[THIN]**: stated as a generalization without measurement, and no phone appears in the measured table [raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md].

**Pixel-offset formula:** `Pixel Offset = Pan Speed (pixels/second) x Readout Time (seconds)` [raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md]

| Pan speed | Readout | Offset | As % of 4K frame width | Visibility |
|---|---|---|---|---|
| 2,000 px/s | **15 ms** | **30 px** | **0.78%** | "Visible on a stationary subject like a building or door frame, but subtle enough to miss on casual viewing" |
| 5,000 px/s | (same 15 ms implied) | **75 px** | **2%** | "clearly visible on any vertical edge" |
[raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md]

**Degrees of lean (real example):** Sony A7 IV (23 ms), a pan made a building **lean 15 degrees**; Sony FX3 (9.7 ms), same movement, lean **under 5 degrees** [raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md].

**Measurement method:** tripod-mount, pan rapidly past a scene of many vertical lines, then measure the **horizontal pixel offset between the top and bottom of a vertical element** in the most severe pan [raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md].

**Rolling shutter is not jello.** Rolling shutter (skew/shear) is the lean or shear of vertical elements from relatively slow, large-scale camera movement; **jello** is the wave-like oscillation produced by **high-frequency vibrations** (handheld micro-shake, drone motors, car engine) [raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md].

**Explicitly not covered by the source:** LED/fluorescent flicker banding interaction with rolling shutter, noted in the raw file as a separate artifact (horizontal light/dark bands rolling through the frame when the source's AC flicker frequency beats against the line-scan rate), but not sourced [raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md].

### 5.4 JPEG compression artifacts
| Artifact | Look | Cause | Threshold |
|---|---|---|---|
| **Blocking / macroblocking** | "quilt-like grid pattern that turns smooth areas into a patchwork of tiny squares" | JPEG divides the image into **8x8 pixel blocks** and runs a DCT on each independently; quantization strips different amounts from neighboring blocks so block boundaries no longer align | Obvious at **JPEG quality 20**; the classic case is a clear blue sky rendering as a checkerboard |
| **Mosquito noise / ringing (Gibbs)** | "shimmering, noisy halo that appears around sharp edges"; "blotchy, 'radioactive' halos" | Sharp edges are high-frequency; quantization discards those components and the reconstruction oscillates near the edge | Most prominent around text on contrasting backgrounds, hence garbled-looking signage in over-compressed photos |
| **Color bleeding** | "colors appear to smear across boundaries": red bleeding into skin, green into sidewalk | **4:2:0 chroma subsampling** stores color at half resolution in each axis; the encoder forces one chroma value across a **2x2 pixel** area | **Accumulates with every re-save** |
| **Red channel degradation** | Red elements look "especially blocky or muddy" | The **Cr** (red-difference) channel is subsampled most aggressively in YCbCr, so red details lose sharpness first | Practical tell: **red lips, red signage, red clothing show artifacts before anything else** |
| **Banding / posterization** | "smooth gradient turns into a series of visible steps" | Quantization collapses tonal values; a 200-shade gradient may reduce to **15-20 values** | Visible in large slowly-changing areas (skies, studio backdrops, out-of-focus walls); **3-4 recompression generations produce "harsh stripes"** |
[raw/craft--sensor-exposure-artifacts--jpeg-compression-artifact-field-guide.md]

**Composite:** real shared/reposted photos carry 8x8 block structure in flat areas, ringing halos around text and hard edges, red-channel mush, and sky banding. A too-clean file with perfect gradients and pristine edges reads as freshly rendered [raw/craft--sensor-exposure-artifacts--jpeg-compression-artifact-field-guide.md].

### 5.5 Flare and ghosting geometry
**Two distinct phenomena** [raw/craft--sensor-exposure-artifacts--lens-flare-ghosting-and-aberrations.md]:

| Phenomenon | Behavior |
|---|---|
| **Veiling flare** | Non-image-forming light scattered across the whole frame: "a general reduction in contrast over the frame," "a lifting of shadows and midtones." No discrete shapes, the image just goes milky. Black point rises, saturation drops |
| **Ghosting** | Reflected light that lands "closer to the focal plane," so the reflections are "essentially more in focus and thus appear as bright and more distinct points in the frame" |

**Ghost geometry (the part hardest to fake correctly):**
- Ghosts appear **opposite the original light source across the center axis of the frame**. Draw a line from the light source through the frame center and the ghosts fall along it.
- They "often occur in series, with multiple points of ghosting in a single exposure", **one per reflective air-glass surface pair**, so a complex zoom produces a long chain.
- **Aperture ghosting:** ghosts take on the literal shape of the iris. "Most readily identifiable with older style lenses without rounded aperture blades, which can project a series of identically shaped polygons stretching out radially from the light source." Straight-blade lenses give polygons (hexagons, heptagons, nonagons per blade count); rounded-blade lenses give discs.
- **Filters make it worse:** any filter adds "another reflective glass-air surface to a lens," increasing reflection likelihood. Cheap uncoated filters flare badly; well-coated ones minimally.

[raw/craft--sensor-exposure-artifacts--lens-flare-ghosting-and-aberrations.md]

### 5.6 Chromatic aberration types
| Type | Signature | Correctable? |
|---|---|---|
| **Lateral CA** | "opposing dual-color fringing"; "colors are often **cyan/magenta**, along with potentially a **blue/yellow** component." Magnitude is **zero at the frame center and increases toward the corners**, "increasingly so near the corners." **This radial gradient is the signature: fringing present in the corners and absent in the center** | Yes, in software |
| **Longitudinal CA (bokeh fringing)** | **Green fringes behind the focal plane, magenta/purple in front**, visible on out-of-focus specular edges, and it *changes color across the focus plane* | **Cannot** be corrected in software the way lateral CA can |
[raw/craft--sensor-exposure-artifacts--lens-flare-ghosting-and-aberrations.md]

**Vignetting:** optical vignetting is "typically most apparent at **lower f-stops** (wider apertures), with zoom and wide angle lenses," and clears up on stopping down. Natural vignetting follows the **cos^4 law** and is always present on wide lenses regardless of aperture. Corollary: real wide-open shots have darker corners *and* cat's-eye-shaped corner bokeh, and both vanish when stopped down [raw/craft--sensor-exposure-artifacts--lens-flare-ghosting-and-aberrations.md].

**"Real capture" cue set:** corner-only color fringing (cyan/magenta), not global; a ghost chain along the source-through-center axis, polygonal if the iris is stopped down; veiling haze lifting the blacks when shooting into a light source; corner darkening and cat's-eye bokeh at wide apertures. **Absence of all of these gives the "too clean, computer-rendered" read** [raw/craft--sensor-exposure-artifacts--lens-flare-ghosting-and-aberrations.md].

## 6. Candid vs Posed
### 6.1 Duchenne marker anatomy: the action units
| Smile type | Muscles | FACS coding |
|---|---|---|
| **Genuine / enjoyment (Duchenne) smile** | *zygomatic major* (pulls lip corners up and back) **plus orbicularis oculi** (the muscle orbiting the eye) | **AU 6** (orbicularis oculi pars lateralis, "cheek raiser") **plus AU 12** (lip-corner pull) |
| **Social / fake smile** | *zygomatic major only*; the eye ring stays inactive | AU 12 alone |
[raw/craft--candid-vs-posed--ekman-duchenne-smile-markers.md]

**Visible signature of AU6 (the describable markers):**
- cheeks are pulled **up**
- the skin **below the eye may bag or bulge**
- the **lower eyelid moves up** (narrowing the eye aperture)
- **crow's feet wrinkles** appear at the outer corner of the eye socket
- the skin **above the eye is pulled slightly down and inwards**
- the **eyebrows move down very slightly**

[raw/craft--candid-vs-posed--ekman-duchenne-smile-markers.md]

**Fake-smile tell:** the primary marker is "the absence of movement in the outer part of the muscle that orbits the eye": wide mouth, unchanged eye aperture, no lower-lid rise. For *broad* fake smiles (where the cheek raise happens passively from the mouth), the reliable subtle clue is "a very slight lowering of the eyebrows and the skin between the eyebrow and the upper eyelid, which is called the **eye cover fold**" [raw/craft--candid-vs-posed--ekman-duchenne-smile-markers.md].

**Reliability caveat, stated by the source:** a "deliberately made broad smile will produce all these signs, making it more difficult to spot fabrication"; the difference "is difficult to recognize, and most of the time we are easily fooled by broad smiles that are fabrication" [raw/craft--candid-vs-posed--ekman-duchenne-smile-markers.md]. **So the AU6 markers are a generation instruction, not a reliable discriminator.** **[INFERRED]**

**Prompt-usable pair:** authentic candid = narrowed eye aperture, lower lid pushed up, crow's feet, cheek bulge under the eye, brow slightly lowered, i.e. **eyes changed shape**, not just a wide mouth. The AI/stock-photo "social smile" tell = full teeth, wide mouth, eyes wide open and unwrinkled, brows unmoved [raw/craft--candid-vs-posed--ekman-duchenne-smile-markers.md].

Lineage: Duchenne 1862 to Ekman (FACS) [raw/craft--candid-vs-posed--ekman-duchenne-smile-markers.md].

### 6.2 Candid technique numbers
| Parameter | Value |
|---|---|
| Focal lengths | Primes at **28-50 mm** on full-frame; **35 mm f/2 on APS-C** for documentary framing; **24 mm equivalent** for wider environmental context |
| Apertures | **f/2 or faster** to work in low light without flash |
| Shutter speeds | **1/500 s or higher** to stay ready across variable light and stop unpredictable motion |
| Zone focusing | Pre-set the lens to a fixed distance, **typically 8-10 feet (~2.5-3 m)**, combined with **f/8 to f/16** to maximize depth of field and eliminate autofocus lag |
[raw/craft--candid-vs-posed--candid-photography-technique-and-history.md]

**Note the internal tension in the source:** it lists both f/2-or-faster (low light) and f/8-f/16 (zone focusing). These are two different operating modes, not a contradiction; the file presents them as separate techniques [raw/craft--candid-vs-posed--candid-photography-technique-and-history.md]. 8-10 ft at 35 mm is the classic street-candid working distance, "much closer than a studio portrait, much farther than a selfie" [raw/craft--candid-vs-posed--candid-photography-technique-and-history.md].

**The distinction as stated:** candid prioritizes the subject's **"unguarded expression"** and **"unaltered state"**; formal portraiture is defined by "deliberate posing" and "controlled lighting"; the genre "emphasizes imperfection and unpredictability", and unplanned elements *contribute to* authenticity rather than detracting from control [raw/craft--candid-vs-posed--candid-photography-technique-and-history.md].

**Historical timeline** [raw/craft--candid-vs-posed--candid-photography-technique-and-history.md]:

| Date | Event |
|---|---|
| **1838** | Daguerre's Boulevard du Temple, earliest known candid human figures in a photograph |
| **1851** | Charles Negre photographs Parisian street vendors and laborers |
| **1893-1897** | Carl Stormer makes 500+ secret street portraits with a concealed camera in Oslo |
| **1932** | Cartier-Bresson adopts the Leica; "Behind the Gare Saint-Lazare" |
| **1947** | Magnum Photos founded (Cartier-Bresson, Capa, et al.) |
| **1952** | *Images a la Sauvette* / *The Decisive Moment* |
| **1955-56 / 1959** | Robert Frank's 10,000-mile road trip; *The Americans* published 1959 |

**Context numbers:** smartphone penetration >80% by 2020; >6.8 billion smartphones in use by 2023; ~**5.3 billion photos taken daily** as of 2024, **94% via mobile devices**; projected ~2 trillion photos/year by 2025; compact camera shipments peaked at **>120 million units/year in 2010** [raw/craft--candid-vs-posed--candid-photography-technique-and-history.md]. Implication stated in the source: the modern default "photograph" that a viewer's eye is calibrated to is a **24-26 mm phone frame**, not a 50 mm SLR frame [raw/craft--candid-vs-posed--candid-photography-technique-and-history.md]. This is consistent with the 24-26 mm phone main-camera equivalents in section 2.2 [raw/craft--smartphone-computational-photography--dpreview-iphone13-camera-specs.md; raw/craft--smartphone-computational-photography--moment-iphone17-lens-lineup.md].

### 6.3 Snapshot-aesthetic vocabulary
**Framing and composition markers of unposed work** [raw/craft--candid-vs-posed--snapshot-aesthetic-origins.md]:
- Unposed, uncomposed; no technical perfection.
- **"Dutch-angled, offhand images"**, tilted or "drunken" horizons.
- Subjects **cropped by the frame edge**, captured "on the fly."
- **Non-hierarchical arrangement**: no single dominant subject, no rule-of-thirds discipline.
- Photographs taken "mostly without aiming."

**Technical elements, the literal quote list:**
> "meaningless blur, grain, muddy exposures, drunken horizons, and general sloppiness"

Expanded: blur and grain present and unapologetic; muddy (not optimized) exposures with flat shadows and clipped highlights; **direct flash**, often "dazzling artificial light" [raw/craft--candid-vs-posed--snapshot-aesthetic-origins.md].

**Conceptual qualities:** spontaneous, coincidental appearance; intimate and vulnerable moments; **"fragments of gestures and postures"** rather than complete poses; an emotional register including **boredom and vulnerability**, not just joy; **bare, unglamorous interiors replace formal studio settings** [raw/craft--candid-vs-posed--snapshot-aesthetic-origins.md].

**Lineage and dates** [raw/craft--candid-vs-posed--snapshot-aesthetic-origins.md]: Robert Frank, *The Americans* (shot **1955-56**); Diane Arbus, **1960s**; Lee Friedlander, **1960s**; Mark Cohen, **1970s onward**; Nan Goldin, **1980s-90s**; Wolfgang Tillmans, **1990s**; Juergen Teller, **1990s**.

**Key insight for prompting:** the aesthetic reads "natural, point-and-shoot" but is usually **deliberately constructed**, "staged spontaneity" that mimics amateur vernacular photography. That is exactly the task: reproduce the *signature* of unaimed shooting on purpose [raw/craft--candid-vs-posed--snapshot-aesthetic-origins.md].

**Cross-reference:** the snapshot direct-flash marker [raw/craft--candid-vs-posed--snapshot-aesthetic-origins.md] is fully specified optically in section 4.6 [raw/craft--real-world-lighting--on-camera-direct-flash-and-red-eye.md]; and "grain" as a positive marker [raw/craft--candid-vs-posed--snapshot-aesthetic-origins.md] matches the luminance-noise-as-authenticity finding [raw/craft--sensor-exposure-artifacts--petapixel-noise-primer.md].

## 7. Skin Tone Rendering
### 7.1 The dichromatic model: the root mechanism
Skin reflectance splits into two physically distinct components (Dichromatic Reflection Model, DRM) [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md]:

| Component | Physics | Melanin dependence | Angular behavior |
|---|---|---|---|
| **Specular (interface) reflection** | Bounced off the air/oil interface at the skin surface. "The specular component reflects the color of the illumination and is generally brighter than the color of skin" | **Melanin-INDEPENDENT** | Varies with incident angle and the illuminant's own color |
| **Diffuse (body) reflection** | Light that enters the epidermis/dermis and comes back out after "subsurface scattering of light with melanin and hemoglobin components." Carries the *intrinsic* skin color | **Melanin-dependent** | Assumed **Lambertian**: reflects equally in all directions, viewing-angle independent |

**WHY this is the root mechanism, the specular-vs-diffuse consequence for deep skin:** on deep skin the diffuse (color-bearing) return is much weaker, while the **specular return is essentially the same as on light skin**. So the specular highlights dominate the recorded signal. This is exactly the failure described historically as deep-skin subjects reduced to highlights on teeth and eyes. Controlling specularity (larger/softer sources, off-axis key, polarizer, matte skin prep) and exposing for the diffuse component is the correct fix; **adding raw exposure just blows the speculars** [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md].

The practitioner statement of the same physics: "Higher melanin content absorbs more light, requiring careful adjustment of light intensity. Darker skin tones may appear flatter under harsh lighting due to increased light absorption", i.e. the flatness-plus-glare problem [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md].

### 7.2 ITA formula and Fitzpatrick's documented limitations
**ITA (Individual Typology Angle):** convert RGB to CIE-Lab, then `ITA = arctan((L* - 50) / b*) * 180/pi`, in degrees. **Higher ITA = lighter** [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md].

**Fitzpatrick Skin Type (FST)** has "limited quantification and reliability, particularly for nonwhite individuals". **It is a UV-response scale, not a color-measurement scale** [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md].

Both ITA and RSR (relative skin reflectance) are "sensitive to changes in illumination"; all measures show **higher intra-subject variability under varying illumination** [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md].

**Intra-subject variability (standard deviation; lower = more stable across illumination):**

| Dataset | ITA | RSR | SREDS |
|---|---|---|---|
| Multi-PIE High Resolution | 0.401 | 0.307 | **0.138** |
| Multi-PIE Multi-View | 0.926 | 0.860 | **0.820** |
| MEDS-II | 0.448 | 0.493 | **0.463** |
| Morph-II | 0.645 | 0.539 | **0.419** |
[raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md] Note MEDS-II is the one dataset where SREDS does *not* beat ITA (0.463 vs 0.448). The source presents SREDS as the overall winner; this one row is a counterexample worth carrying [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md].

**Four stated reasons algorithms fail on darker skin** [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md]:
1. Reference methods (RSR) require "a highly controlled acquisition environment (constant background, lighting and camera)", unrealistic in the wild.
2. FST is unreliable for nonwhite subjects, so training and evaluation labels are noisy.
3. Illumination sensitivity: skin-color estimates drift most exactly where lighting is uncontrolled.
4. Demographic data "may be overlooked because it is difficult to collect reliably," so bias never gets measured.

SREDS's fix, explicitly separating illumination-dependent specular from skin-intrinsic diffuse, **is the same conceptual fix a photographer makes with lighting** [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md].

### 7.3 The Shirley card history, with dates
| Period | Event |
|---|---|
| **1940s-1950s** | Kodak creates the "Shirley Card," a printed reference featuring Shirley Page, a white Kodak employee. It becomes "the standard for a successfully calibrated photograph in terms of light and color." Lab printers set exposure and color balance to make *that* skin correct |
| **1960s-1980s** | Labs keep using Shirley Cards. "The darker the skin, the more invisible the subject looked." Mixed-race group photos rendered Black subjects "nearly reduced to a floating pair of teeth and eyes", i.e. only the specular highlights on teeth and sclera survived the film's latitude |
| **1980s** | Kodak Gold Max introduced, marketed as able to photograph "a dark horse in low light". The film-chemistry fix arrived for commercial, not equity, reasons |
| **1990s** | Kodak issues a **multiracial Shirley Card** (Asian, white, and Black women; a Hispanic woman added later) |
[raw/craft--skin-tone-rendering--shirley-card-racial-photographic-bias.md]

**Why it changed:** Kodak responded to complaints from **furniture and chocolate manufacturers** who couldn't advertise dark-brown products, not from families of color [raw/craft--skin-tone-rendering--shirley-card-racial-photographic-bias.md].

**Modern carryover:** digital removed the physical calibration card, but the bias persists in defaults. Automated exposure metering, autofocus, and auto-white-balance "struggle to identify darker skin," because decades of "white is normal" tuning shaped the reference data and the algorithms trained on it [raw/craft--skin-tone-rendering--shirley-card-racial-photographic-bias.md].

**Craft implication:** correct rendering of deep skin is an act of **intent**, not default. Cited via *Moonlight* and *Insecure*: "Photographers and directors have to *want* their Black and darker-skinned subjects and actors to look good," meaning deliberate exposure placement and lighting rather than trusting auto modes [raw/craft--skin-tone-rendering--shirley-card-racial-photographic-bias.md].

**Note the causal chain across sources:** the Shirley-card failure mode ("floating pair of teeth and eyes") [raw/craft--skin-tone-rendering--shirley-card-racial-photographic-bias.md] is the *observable* of the dichromatic mechanism (specular survives, diffuse does not) [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md]. Two independent sources, one mechanism.

### 7.4 Concrete lighting and metering technique
**Metering and exposure** [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md]:
- **Spot meter on the subject's face**, not the scene. Matrix/evaluative metering pulls deep skin toward middle gray, *underexposing* it while blowing the background.
- Apply **positive exposure compensation** to prevent underexposure of darker skin.
- Monitor with **vectorscope and waveform** to keep skin in an acceptable range. **The source gives no IRE numbers**; the raw file supplies an industry rule of thumb from elsewhere, skin around **55-70 IRE for light skin, ~35-50 IRE for deep skin**, sitting on the vectorscope skin-tone line, and explicitly flags it as not from this source. **[THIN / unsourced]**

**Fill and contrast, counterintuitive but correct** [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md]:
- **"Darker skin tones often require less fill to maintain depth and contrast."**
- **"Lighter skin tones may need more fill to avoid harsh shadows."**
- Rationale given: on deep skin the shadow side is already close to black, so heavy fill flattens it. Shape comes from a controlled key plus separation, not from lifting the shadow.

**Separation** [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md]:
- **"Use backlight to create separation between subject and background, especially for darker skin tones."** Rim, edge or kicker light is not optional here; without it the subject merges into a dark background.
- A **hair light** "adds separation and helps bring out detail and texture in the hair" that would otherwise absorb all light.

**Modifiers named** [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md]: softboxes (diffuse); **beauty dish** ("balance between soft and contrasty light"); umbrellas (broad, soft); scrims and diffusion panels. Reflectors: **gold** adds warmth and radiance to brown and olive skin; **silver** gives bright neutral fill; **unbleached muslin** (warm-toned) "wraps light gently around faces and adds a subtle glow" for medium-to-dark skin, whereas **bleached muslin** "tends to suit lighter skin better."

**The multi-subject inverse-square placement rule** [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md]:
- **"Place your light source closest to the darkest-skinned subjects."** Inverse-square then naturally gives the darker subject more light and the lighter subject less.
- Alternative: run **multiple key lights at different intensities**, and use reflectors to lift only the darker subject.
- Quantitatively, the falloff table in section 4.5 gives the magnitude: at a 3 ft vs 4.5 ft split the brightness difference is "large, obvious"; at 12 ft vs 13.5 ft it is "virtually the same", so the technique only works when the source is *close*. **[INFERRED]** cross-source [raw/craft--real-world-lighting--inverse-square-law-falloff.md; raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md].

**Undertone vocabulary** [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md]:
- Wrist-vein test: **blue veins = cool undertone; green veins = warm undertone**. Drives background and wardrobe color and the grading direction. **[THIN]**: a single practitioner source, no validation offered.
- Standard undertone vocabulary: **warm** (golden, yellow, peach), **cool** (pink, red, blue), **neutral/olive** (green-yellow cast).

**Post** [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md]: "Boosting highlight and shadow sliders can help bring out detail," with the caution to "give a faithful representation of your subject's skin without over-lightening". **Do not lift luminance until the skin goes ashy or gray; deep skin should retain saturation and a warm or cool undertone, not become desaturated brown.**

**Cross-reference warning:** phone semantic face brightening, "every time there's a very bright background, the iPhone also tries to boost the brightness of the people in the photo, making them look very white" [raw/craft--smartphone-computational-photography--iphone-over-processing-critique.md], is precisely the over-lightening-to-ashy failure the skin-tone source warns against [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md], and is the modern algorithmic descendant of the Shirley-card default [raw/craft--skin-tone-rendering--shirley-card-racial-photographic-bias.md]. **[INFERRED]**: no source draws this connection explicitly.

## 8. Gaps and Unresolved
What the 27-file `craft--*` corpus does **not** establish:

1. **Detection rates for the physics and sociocultural categories.** CHI 2025 reports mean detection accuracy only for the three high-prevalence categories (anatomical 65%, stylistic 64.9%, functional 64.1%). Physics (20 images) and sociocultural (12 images) have no reported accuracy, no CI, and no 40-60%-band figure [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md]. Since the physics layer is the corpus's own recommended lever, this is the single largest evidential gap.
2. **No experimental validation of the "unfixed tells" claim.** The 2026 claim that hands and teeth are fixed while light direction, shadow geometry, reflections, optical DoF and sensor noise remain unfixed comes from a single practitioner marketing blog with no measurement [raw/craft--ai-look-tells--ten-telltale-signs-practitioner-checklist.md]. It is the strategic premise of this entire reference and it rests on one non-peer-reviewed source.
3. **No cue-attribution data.** 2507.18640 "did not report which conscious visual cues participants used" [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md], so the practitioner tell-lists are not tied to measured human behavior.
4. **No 2025-2026 generator detection rates.** Both detection studies predate current-generation models (2507.18640 data collected Aug 2024; CHI 2025 uses Midjourney, Firefly, Stable Diffusion) [raw/craft--ai-look-tells--how-good-are-humans-at-detecting-ai-images.md; raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md]. GPT-Image-class models are not represented.
5. **No f-numbers or sensor dimensions for current iPhone hardware.** The iPhone 17 article does not publish apertures or sensor sizes [raw/craft--smartphone-computational-photography--moment-iphone17-lens-lineup.md], so the full-frame-equivalent-aperture table in section 2.2 is anchored to **iPhone 13-era** hardware only [raw/craft--smartphone-computational-photography--dpreview-iphone13-camera-specs.md]. Equivalent apertures for the current 24 mm main and 100 mm tele are **not derivable from this corpus**.
6. **No Android or Google Pixel data at all.** Every phone-specific number is Apple; the HDR+ pipeline detail is generic-mobile [raw/craft--smartphone-computational-photography--mobile-computational-photography-a-tour.md].
7. **No measured phone rolling-shutter readout times.** The 20-35 ms figure is a generalization, not a measurement, and no phone appears in the measured table [raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md].
8. **LED/fluorescent flicker banding** is explicitly out of scope of the rolling-shutter source and unsourced anywhere in the corpus [raw/craft--sensor-exposure-artifacts--rolling-shutter-readout-times.md].
9. **Wide-angle geometric distortion (barrel, mustache, corner face-stretching) is absent.** The fetch that would have covered it failed with ROBOTS_DISALLOWED [raw/craft--sensor-exposure-artifacts--lens-flare-ghosting-and-aberrations.md]. This matters because the phone ultra-wide is 13 mm equivalent [raw/craft--smartphone-computational-photography--dpreview-iphone13-camera-specs.md] and the corpus mentions "strong edge stretching" without quantifying it.
10. **No IRE or waveform numbers for skin from a primary source.** The 55-70 / 35-50 IRE figures are flagged in the raw file as an outside rule of thumb, not the source's claim [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md].
11. **No numeric mapping between ITA degrees, Fitzpatrick types, and Monk-scale-style tone scales.** The ITA formula is given but no banding thresholds [raw/craft--skin-tone-rendering--sreds-dichromatic-skin-color-measure.md].
12. **The wrist-vein undertone test is unvalidated**: a single practitioner source, no evidence offered [raw/craft--skin-tone-rendering--lighting-different-skin-tones-technique.md].
13. **No numbers for grain magnitude.** The corpus establishes that luminance grain reads as authentic [raw/craft--sensor-exposure-artifacts--petapixel-noise-primer.md] but gives no target grain size, amplitude, or ISO-equivalent for a convincing render.
14. **No quantification of a "how much distortion is too much" threshold.** JAMA gives +30% / +29% nasal width at 12 in [raw/craft--lens-focal-length-faces--selfie-nasal-distortion-jama-2018.md] and Fried says the effect is "subtle but noticeable" [raw/craft--lens-focal-length-faces--fried-siggraph-2016-perspective-portraits.md], but no source gives a just-noticeable-difference for perspective distortion.
15. **Duchenne markers are a weak discriminator by the source's own admission**: deliberately made broad smiles produce all the signs [raw/craft--candid-vs-posed--ekman-duchenne-smile-markers.md]. The corpus offers no alternative validated candid-vs-posed facial discriminator.
16. **No data on multi-person shadow and light coherence**, which is the failure mode the physics layer implies matters most for the "candid group" scene type the corpus recommends [raw/craft--ai-look-tells--chi2025-characterizing-photorealism-artifact-taxonomy.md].
17. **No source addresses how any of this survives a generative model's own resampling**, i.e. whether prompting for corner CA or 8x8 blocking actually produces those artifacts or only their stylistic impression. The whole reference is a specification of targets, not evidence that the targets are reachable by prompt. **[INFERRED]**
