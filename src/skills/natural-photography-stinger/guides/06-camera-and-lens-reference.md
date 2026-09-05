# 06: Camera and Lens Reference

## What this guide is for
The optics lookup. Which body and lens produce which look, what the full-frame-equivalent aperture actually is (this is the number that explains depth of field, not the marketing f-number), how far the camera has to stand for a given framing, what that distance does to a face, and the literal phrasing that invokes each look in a prompt.

## Load this when
- You are filling the camera/lens slot of a prompt (Google's slot 7; OpenAI's "composition terms (lens, aperture feel, lighting)") [distilled-image-models.md].
- You need to decide between a phone look and an interchangeable-lens look.
- You need to know whether the depth of field you are asking for is physically possible for the device you named.
- You are writing a selfie or close-range portrait and need the facial-geometry consequence.

---

## 0. Read this caution first: what these models do with camera specs

| Vendor statement | Verbatim | Consequence |
|---|---|---|
| OpenAI cookbook | Camera specs "may be interpreted loosely, so use them mainly for high-level look and composition" | Naming `f/1.4` does not run a lens simulation. It biases the overall look. |
| OpenAI 1.5 prompting guide | "Composition terms (lens, aperture feel, lighting) often steer realism more reliably than generic 'ultra-detailed'" | Optical language beats quality adjectives. Note the hedge: "aperture **feel**". |
| OpenAI, what to avoid | "detailed camera specs expecting exact physical simulation" is listed as a failure mode | Do not stack EXIF-style specs. Two or three optical terms plus a described *consequence* outperform a spec sheet. |
| Google | Photography terms, camera angles, lens types, lighting, and fine details "steer the model toward a photorealistic result" and give "compositional control" | Same doctrine, stated positively. |

All four rows from [distilled-image-models.md].

**Practical rule that follows:** always pair a spec with its visible consequence. Write `85mm portrait lens, background compressed and softly out of focus but still readable as a kitchen` rather than `85mm f/1.4`. Write `phone main camera, everything from the near table edge to the far wall in focus` rather than `iPhone f/1.6`.

**No style switch exists.** GPT image models have no `style` parameter at all (that was DALL-E 3, now shut down), and there is no "Style Raw" or no-polish parameter. `quality` raises polish, not grit. Photorealism and imperfection must be carried entirely by prompt text [distilled-image-models.md].

**Vendor-named lens vocabulary that is known to work:** `wide-angle lens`, `85mm portrait lens`, `macro lens` (Google) [distilled-image-models.md]. Photorealism trigger words: `photorealistic`, `real photograph`, `taken on a real camera`, `professional photography`, `iPhone photo` [distilled-image-models.md].

---

## 1. Smartphone cameras

### 1.1 iPhone 13 / 13 mini

| Camera | Equiv. FL | Stated aperture | **FF-equivalent aperture** | Sensor | Pixel pitch | Sensor area | Stabilization |
|---|---|---|---|---|---|---|---|
| Wide (main) | **26 mm** | f/1.6 | **f/8.2** | 1/1.9" | 1.7 microns | 35.2 mm2 | sensor-shift |
| Ultra-wide | **13 mm** | f/2.4 | **f/20.2** | 1/3.4" | 1.0 microns | 12.2 mm2 | none, fixed focus |

### 1.2 iPhone 13 Pro / Pro Max

| Camera | Equiv. FL | Stated aperture | **FF-equivalent aperture** | Sensor | Pixel pitch | Focus / IS |
|---|---|---|---|---|---|---|
| Wide (main) | **26 mm** | f/1.5 | **f/6.8** | 1/1.65" | 1.9 microns | sensor-shift plus OIS |
| Ultra-wide | **13 mm** | f/1.8 | **f/15.1** | 1/3.4" | 1.0 microns | PDAF, macro to 2 cm |
| Telephoto (3x) | **77 mm** | f/2.8 | **f/23.8** | 1/3.4" | 1.0 microns | sparse PDAF, OIS, Night mode |

### 1.3 iPhone 17 Pro / Pro Max

| Position | Equivalent FL | Sensor / output | Note |
|---|---|---|---|
| 0.5x Ultra-Wide | **13 mm** | 48 MP sensor, outputs 24 MP | same sensor and lens as iPhone 16 Pro |
| 1x Main Wide | **24 mm** | 24 MP output | "hasn't changed physically at all" from the prior generation |
| **2x** | **~48 mm look** | **digital crop of the main sensor** | **NOT a physical lens.** See section 1.5. |
| 4x Telephoto | **100 mm** | 48 MP (12 MP at minimum focus distance) | sensor size increased 56% |
| 8x | **200 mm** | digital zoom off the 4x module | |
| Front / selfie | not published | sensor almost 2x larger than iPhone 16 Pro; **square sensor**; ProRes Log | square sensor enables auto orientation switching |

**Apertures and exact sensor dimensions for the iPhone 17 lineup are not published in the source**, so equivalent apertures for the current 24 mm main and 100 mm tele are not derivable. Use the iPhone 13-era equivalents above as the anchor [distilled-photographic-craft.md].

All smartphone tables from [distilled-photographic-craft.md].

### 1.4 THE HEADLINE NUMBER: equivalent aperture and why phone photos have deep depth of field

**Depth of field is set by the *equivalent* aperture, not the stated f-number.**

| What the phone advertises | What the depth of field actually looks like |
|---|---|
| Main camera "f/1.6" | **like a full-frame lens at f/8** |
| Main camera "f/1.5" (Pro) | **like f/6.8** |
| Ultra-wide "f/2.4" | **like f/20** |
| Ultra-wide "f/1.8" (Pro) | **like f/15** |
| Telephoto "f/2.8" | **like f/24** |

"That is why a real phone photo has an entire room in focus, and why any background separation must be synthesized" [distilled-photographic-craft.md].

Supporting hardware facts [distilled-photographic-craft.md]:

| Parameter | Smartphone | Full frame | Ratio |
|---|---|---|---|
| Sensor dimensions | ~5 x 4 mm | 36 x 24 mm | **~43x the area** |
| Pixel pitch | ~1.5 microns or less | ~4 microns | ~7x area per pixel |
| Raw tonal depth | 1024 levels (10-bit) | 4096 (12-bit) to 16384 (14-bit) | 4 to 16x |
| Aperture | fixed, small | variable | light collection reduced by **two orders of magnitude** |

Small aperture plus short actual focal length gives **almost no optical DoF blur**: everything from about 0.5 m to infinity is effectively sharp. Any background separation is synthetic "digital bokeh" computed from a depth or segmentation estimate [distilled-photographic-craft.md].

**Prompt phrasing for a genuine phone depth of field:**
`phone main camera, deep depth of field, the whole room in focus from the near table edge to the far wall, no background blur`

**Prompt phrasing when you want phone portrait mode and its artifacts:**
`phone portrait mode, background blurred by software, the blur stepping abruptly at the subject outline, a few strands of hair blurred away, background specular highlights rendered as dim grey discs rather than bright saturated circles`

### 1.5 THE 2x PORTRAIT MODE NOTE (critical geometry)

**"2x" on a modern iPhone is a sensor crop of the 24 mm main lens, not a physical 48 mm lens.**

Consequence: it retains the **24 mm perspective geometry**, including nose enlargement at close range, even though the framing looks like 48 mm [distilled-photographic-craft.md].

| What people believe | What is true |
|---|---|
| "2x portrait mode gives me an ~48 mm portrait perspective" | The framing is 48 mm. The **perspective is 24 mm** because the lens and the camera-to-subject distance did not change. |
| "2x flatters the face like a short tele" | It does not. If the photographer stands where 48 mm framing requires (about 1.1 to 1.7 m), the geometry is that of standing at 1.1 to 1.7 m with a wide lens. |

**Prompt phrasing:** `shot on a phone at 2x, which is a sensor crop of the wide lens, so the framing is tight but the facial perspective is still that of a 24mm lens: nose and forehead slightly enlarged relative to the ears`

**Focal-length drift to be aware of:** the main camera moved from **26 mm to 24 mm** equivalent across generations (wider, so *more* perspective stretch on close subjects), and the telephoto moved 77 mm to 120 mm to 100 mm [distilled-photographic-craft.md].

### 1.6 What phone processing does to the image

| Stage | Behavior | Visible result | Prompt phrasing |
|---|---|---|---|
| Zero shutter lag | Frames continuously fill a ring buffer; the shutter press hands over the already-captured buffer | Motion caught slightly earlier than intended | `caught a half-beat early` |
| Exposure schedule | Frames deliberately underexposed to protect highlights | Underexposed capture, then lifted | (see tone mapping) |
| Merge | 2 to 8 raw Bayer frames, tile-wise, in the frequency domain, partial merging | **"ghosting" and "zipper" artifacts along the edges of moving objects** | `faint ghosting and zipper artifacts along the edge of the moving hand` |
| Tone mapping | 1D LUT compresses range; gamma per Stevens's power law | Midtones pushed up, local contrast compressed: the flat, shadowless, everything-visible look | `flat tone with lifted shadows and compressed highlight roll-off` |
| Smart HDR 4 | "uses a learning-based approach to identify individual subjects in a photo and process different skin tones individually" | Per-face exposure rather than a global one | `faces brightened independently of the background` |
| Photographic Styles | A pipeline stage, not a filter; "local edits at appropriate stages", skies and faces adjusted "disparately" | The frame no longer shares one coherent light | `sky and faces graded separately, not sharing one light` |
| Noise reduction | Small pixels need non-trivial multiplicative gain; mobile images are "markedly more noisy than images captured with DSLR sensors" | Smeared watercolor shadows | `smeared watercolor texture in the darkest shadows` |

All from [distilled-photographic-craft.md].

**Phone noise deficit, quantified:** phone pixel ~1.5 microns versus full-frame ~4 microns (~7x the area), so a phone is roughly **2.5 to 3 stops noisier per pixel** at the same scene light before processing [distilled-photographic-craft.md].

**Practitioner adjectives for the over-processed phone look, to avoid or to invoke deliberately:** "garish," "cartoonish," "sterile and inhuman," "washed out." Contrasted against images with "natural imperfections: grain and a warm white balance" [distilled-photographic-craft.md].

### 1.7 Portrait-mode failure modes (what to name when you want the phone look, what to avoid when you want real optics)

| # | Failure mode | Visible signature |
|---|---|---|
| 1 | Depth-map resolution errors | "sharp zones in the background and/or blurred zones on the subject", a crisp background patch or a soft shoulder |
| 2 | Segmentation / edge artifacts | Hair, glasses arms, cup handles get the wrong depth; flyaway hair blurs away; a background sliver between arm and torso stays sharp |
| 3 | **Specular highlight rendering (biggest giveaway)** | Real optics turn an out-of-focus point light into a **bright, hard-edged, saturated** blur disc. The phone captures it "on only a few pixels, which tend to saturate," so the synthetic bokeh ball is a **dim grey disc**. **Real bokeh balls are brighter than their surroundings; fake ones are not.** |
| 4 | Blur gradient | Real blur increases continuously with depth; computational blur applies a **step**: subject sharp, everything behind at one blur level |
| 5 | Noise inconsistency | Computationally blurred areas are "totally free of grain" because Gaussian blurring is denoising. **Grain that stops at the subject outline = synthetic.** |
| 6 | Bokeh shape fidelity | Phones deliver "circular shapes of varying sharpness" only: no cat's-eye optical vignetting toward the corners, no aperture-blade polygons, no onion-ring texture, no longitudinal chromatic fringing |
| 7 | Repeatability | "Works best in bright conditions"; inconsistent even under consistent lighting |

**Positive identification list for real optical shallow DoF, to write when you want real glass** [distilled-photographic-craft.md]:
`a continuous blur ramp that increases with distance, bright saturated out-of-focus highlight discs with defined edges, cat's-eye squashing of those discs near the frame corners, the same grain level inside and outside the focus plane, and foreground blur as well as background blur`

Any of these missing reads as computed or generated.

---

## 2. Interchangeable-lens bodies and lenses

### 2.1 Bodies (measured characteristics)

| Body | Class | Measured trait | Character it produces | Prompt phrasing |
|---|---|---|---|---|
| ARRI ALEXA Mini LF | Cinema | **0 ms readout (global shutter)** | No skew on pans; cinema register | `shot on a cinema camera, no rolling-shutter skew` |
| Sony A7S III | Full-frame mirrorless | 8.3 ms readout | Low-light stills and video, minimal skew | `full-frame mirrorless, clean high-ISO shadows` |
| Sony FX3 | Full-frame cine-mirrorless | 9.7 ms readout; a fast pan leans a building **under 5 degrees** | Documentary video look | `handheld documentary camera` |
| Canon EOS C70 | Super 35 cine | 12 ms | | `Super 35 cinema camera` |
| BMPCC 6K Pro | Super 35 | 17 ms | | |
| Sony A7 IV | Full-frame mirrorless | 23 ms; a fast pan leans a building **15 degrees** | Visible skew when panning | `slight rolling-shutter lean on vertical edges during the pan` |
| Sony A6700 | APS-C | 30 ms | Most skew of the measured set | |
| Sony A7R III | Full-frame, dual conversion gain | Full well **48,500 photons** low gain / **7,600** high gain; read noise **3.3** / **1.01** photons; base ISO **100** / **640**; engineering DR **13.8** / **12.2 stops** | Cleaner shadows at ISO 640 than at ISO 500 | `shot at ISO 640, clean shadows` |
| Phones and older CMOS | | typically **20 to 35 ms** (flagged as a generalization, no phone in the measured table) | Skews readily on pans | `phone-style rolling-shutter skew` |

All from [distilled-photographic-craft.md]. Rolling-shutter offset formula: `Pixel Offset = Pan Speed (px/s) x Readout Time (s)`. At 2,000 px/s and 15 ms: 30 px, 0.78% of a 4K frame width, "visible on a stationary subject like a building or door frame, but subtle enough to miss on casual viewing." At 5,000 px/s: 75 px, 2%, "clearly visible on any vertical edge" [distilled-photographic-craft.md].

**Rolling shutter is not jello.** Rolling shutter is the lean or shear of verticals from slow, large-scale camera movement. Jello is wave-like oscillation from high-frequency vibration (handheld micro-shake, drone motors, engine) [distilled-photographic-craft.md].

### 2.2 Lenses: focal length, aperture, character

| Focal length (FF) | Typical apertures | Character it produces | Prompt phrasing |
|---|---|---|---|
| **13 mm** (ultra-wide) | f/1.8 to f/2.4 stated, **f/15 to f/20 equivalent** on a phone | Extreme edge stretching, everything in focus, dramatic near/far scale contrast | `ultra-wide lens, strong edge stretching, near objects looming, deep focus` |
| **24 mm** | f/1.4 to f/2.8 on full frame | The modern default frame. Environmental context, mild perspective stretch on close subjects | `24mm wide-angle lens, environmental framing` |
| **26 mm** | phone main, f/1.5 to f/1.6 stated, **f/6.8 to f/8.2 equivalent** | The phone-native look a viewer's eye is calibrated to | `iPhone photo, main camera` |
| **28 to 35 mm** | f/2 or faster for candid work | Documentary and street. 35 mm f/2 on APS-C is the classic documentary pairing | `35mm lens, documentary framing` |
| **50 mm** | f/1.4 to f/2 | Near-neutral perspective, mild subject isolation | `50mm lens, natural perspective` |
| **85 mm** | **f/1.4 to f/1.8** | "just enough compression to flatten out any weird distortions" while keeping the working distance conversational; background "beautifully out of focus, but you will still be able to tell" where you are | `85mm portrait lens, background softly out of focus but the room still readable` |
| **135 mm** | **f/2.8 to f/3.5** | "pulls the background dramatically closer to your subject"; background "melts into an absolute wash of color," "a creamy, abstract painting" | `135mm lens, background compressed into an abstract wash of color` |
| **200 mm** | f/2.8 and slower | Maximum compression; requires 20+ ft | `200mm telephoto, heavily compressed background` |
| **~265 mm** | | Cited professional practice: ~265 mm at far distance gives equivalent framing to ~90 mm at close distance, with flatter facial planes | `long telephoto from across the room` |
| **Macro** | f/2.8 to f/16 | Extreme close focus, razor-thin focus plane | `macro lens` |

The 85 versus 135 trade, stated by the source: 85 mm keeps environmental context and lets you talk to the subject; 135 mm erases context and forces a shout across the room [distilled-photographic-craft.md].

### 2.3 Aperture consequences you can name (real optics only, not phones)

| Aperture behavior | Signature | Prompt phrasing |
|---|---|---|
| Wide open | **Optical vignetting**: corner darkening, "typically most apparent at lower f-stops (wider apertures), with zoom and wide angle lenses"; plus **cat's-eye bokeh** toward the corners | `shot wide open, darker corners and cat's-eye shaped highlight discs toward the frame edges` |
| Stopped down | Corner darkening and cat's-eye bokeh both vanish; **aperture ghosts become polygons** matching the blade count (hexagons, heptagons, nonagons) | `stopped down, hexagonal flare ghosts` |
| Any wide lens | **Natural vignetting follows the cos^4 law** and is always present regardless of aperture | `faint natural corner falloff` |
| Out-of-focus specular edges | **Longitudinal CA (bokeh fringing)**: green fringes behind the focal plane, magenta/purple in front. **Cannot be corrected in software.** | `green fringing behind the focus plane and magenta fringing in front of it, on out-of-focus specular edges` |
| Frame corners | **Lateral CA**: "opposing dual-color fringing," cyan/magenta with a possible blue/yellow component. **Zero at the frame center, increasing toward the corners.** That radial gradient is the signature. | `faint cyan and magenta fringing in the corners only, none at the center` |

All from [distilled-photographic-craft.md].

**Flare and ghosting geometry** (the part hardest to fake correctly) [distilled-photographic-craft.md]:
- **Veiling flare**: non-image-forming scattered light, "a general reduction in contrast over the frame," "a lifting of shadows and midtones." No discrete shapes; the black point rises and saturation drops. Prompt: `veiling flare lifting the blacks and desaturating the frame`
- **Ghosting**: discrete bright points, appearing **opposite the light source across the center axis of the frame**. Draw a line from the source through the frame center; the ghosts fall along it. They "often occur in series," one per reflective air-glass surface pair. Prompt: `a chain of flare ghosts running from the light source through the frame center and out the opposite side`
- Filters add another glass-air surface and make flare worse.

**"Real capture" cue set** [distilled-photographic-craft.md]: corner-only color fringing (not global); a ghost chain along the source-through-center axis, polygonal if stopped down; veiling haze lifting the blacks when shooting into a light; corner darkening and cat's-eye bokeh at wide apertures. **Absence of all of these gives the "too clean, computer-rendered" read.**

---

## 3. Working distance to focal length, and what it does to a face

### 3.1 The governing rule

**Perspective is set by camera-to-subject distance, not focal length.** Focal length only determines the distance you must stand at for a given framing [distilled-photographic-craft.md]. Fried et al. note that simulating this correctly requires a full perspective camera model, not weak-perspective, and that the distortion is "subtle but noticeable" [distilled-photographic-craft.md].

### 3.2 Working-distance table (head-and-shoulders framing, full-frame equivalents)

| Focal length | Working distance (source 1) | Working distance (source 2) | Facial geometry consequence | Prompt phrasing |
|---|---|---|---|---|
| **24 mm** | ~2 to 3 ft (0.6 to 0.9 m). Flagged as extrapolated from the linear relationship, not stated by either source | not given | Strong nose enlargement, ears pushed back, jaw narrowed | `24mm lens at close range, wide-angle facial perspective` |
| **35 mm** | 3 to 5 ft (0.9 to 1.5 m) | not given | Mild enlargement of whatever is nearest the lens | `35mm lens at conversational distance` |
| **50 mm** | 4 to 6 ft (1.2 to 1.8 m) | not given | Near-neutral | `50mm lens, natural facial proportions` |
| **85 mm** | 6 to 10 ft (1.8 to 3.0 m) | **6 to 8 ft** | Facial planes flatten; nose/ear ratio normalizing | `85mm portrait lens from about 2.5 metres` |
| **135 mm** | 10 to 15 ft (3.0 to 4.6 m) | **12 to 15 ft or more** | Fully flattened planes, compressed head | `135mm lens from across the room` |
| **200 mm** | 20+ ft (6+ m) | not given | Maximum flattening | `200mm telephoto from far back` |

**Minor conflict:** the two practitioner sources disagree at 85 mm (6-10 ft versus 6-8 ft) and 135 mm (10-15 ft versus 12-15+ ft). Neither is better evidenced. **Use the union ranges** and treat the narrower figures as the modal case [distilled-photographic-craft.md].

### 3.3 Fried's reference distance set (SIGGRAPH 2016)

| Distance | Role |
|---|---|
| **~60 cm** | Arm's-length selfie. Produces the enlarged-nose look, "visible distortions similar to the fisheye effect" |
| **90 cm** | Intermediate baseline used in mannequin ground-truth testing |
| **120 cm** | Comparison distance |
| **480 cm** | "Far" / professional headshot distance |

Their focal-length and distance estimation from a single portrait achieved errors **below 2%** versus EXIF ground truth [distilled-photographic-craft.md].

### 3.4 THE JAMA NASAL-DISTORTION FIGURES

Paskhover et al., *JAMA Facial Plastic Surgery*, **March 1, 2018**, DOI **10.1001/jamafacial.2018.0009**; Rutgers New Jersey Medical School with Stanford [distilled-photographic-craft.md].

| Condition | Value |
|---|---|
| Selfie distance modeled | **12 inches (30 cm)** |
| Standard portrait distance | **5 feet (1.5 m)** |
| Reference | **infinite distance** (orthographic, zero perspective distortion) |
| **Men: nasal width increase at 12 in versus 5 ft** | **+30%** |
| **Women: nasal width increase at 12 in versus 5 ft** | **+29%** |

Method: the researchers modeled an average male and female face "as a collection of parallel planes, similar to how an art student might draw a 3D building receding toward the horizon." The nose sits on a plane closer to the lens than the cheeks and ears, so at 12 inches it occupies a disproportionately large solid angle [distilled-photographic-craft.md].

Related figure: a 2017 American Academy of Facial Plastic and Reconstructive Surgery poll found **55% of surveyed plastic surgeons** reported patients requesting changes specifically to improve their appearance **in selfies** [distilled-photographic-craft.md].

**Prompt phrasing for the JAMA case:** `phone held about 30 centimetres from the face, nose noticeably wider and larger relative to the ears and cheeks, ears partly hidden behind the cheeks`

### 3.5 Reconciling the two "selfie distances"

JAMA models **30 cm**; Fried uses **~60 cm** for arm's length. These are different scenarios, not contradictory measurements [distilled-photographic-craft.md]:

| Scenario | Distance | Read |
|---|---|---|
| Extreme close-held phone | **30 cm** | Maximum distortion: +30% / +29% nasal width |
| Fully extended arm | **~60 cm** | "fisheye-like" but socially normal |
| Neutral portrait | **1.5 m** | The JAMA baseline, near-zero distortion |
| Flattering telephoto | **3.0 to 4.6 m** | Flattened planes |
| Reference | infinite | Orthographic, zero distortion |

### 3.6 Geometry effects by range

| Range | What happens to the face |
|---|---|
| **Close (<= 60 cm)** | Nose enlarges relative to ears and cheeks. Features nearest the lens scale up disproportionately, because relative depth differences across the face are a large fraction of total subject distance. **Forehead enlarged when the phone is held high, chin enlarged when held low.** Ears pushed back and partly hidden, jaw narrowed, face reads rounder and wider at center and tapering at the edges. |
| **Far (>= 3 m)** | Face flattens. Nose-to-ear size ratio normalizes. The head reads "compressed." Facial planes flatten. |

Both rows from [distilled-photographic-craft.md].

### 3.7 Perceptual associations by distance

| Setup | Judged as | Prompt phrasing |
|---|---|---|
| Close-up portrait (short distance) | more **"peaceful," "approachable"** | `taken close, an intimate approachable read` |
| Distant / telephoto headshot | more **"attractive," "smart," "strong"** | `long lens from a distance, an authoritative read` |
| Short lens plus close | "amateur / intimate" | `phone-close, amateur register` |
| Long lens plus far | "professional / aloof" | `long lens, commissioned-portrait register` |

All from [distilled-photographic-craft.md].

---

## 4. Candid working numbers (the street-photography operating point)

| Parameter | Value | Prompt phrasing |
|---|---|---|
| Focal lengths | Primes at **28 to 50 mm** on full frame; **35 mm f/2 on APS-C**; **24 mm equivalent** for wider environmental context | `35mm prime` |
| Apertures (low-light mode) | **f/2 or faster** to work without flash | `shot wide open at f/2 in available light` |
| Shutter speeds | **1/500 s or higher** to stay ready and stop unpredictable motion | `fast shutter, motion frozen except at the extremities` |
| Zone focusing | Lens pre-set to a fixed distance, **typically 8 to 10 ft (~2.5 to 3 m)**, at **f/8 to f/16** for maximum depth of field and no autofocus lag | `zone-focused at three metres, deep depth of field, no selective focus` |

The source presents f/2-or-faster and f/8-to-f/16 as **two different operating modes**, not a contradiction. 8 to 10 ft at 35 mm is the classic street-candid working distance, "much closer than a studio portrait, much farther than a selfie" [distilled-photographic-craft.md].

---

## 5. Decision table: which camera to specify

| You want | Specify | Depth of field you may ask for | Do not ask for |
|---|---|---|---|
| A photo that reads as an ordinary everyday capture | `iPhone photo`, main camera, 24 to 26 mm | Deep. Whole room sharp. | Creamy background melt |
| A phone photo with background separation | `phone portrait mode` plus the named artifacts (step blur, dim grey highlight discs, grain stopping at the outline) | Stepped, synthetic | Continuous blur ramp, cat's-eye corner bokeh |
| A flattering portrait | `85mm portrait lens` at 1.8 to 3.0 m, or `135mm` at 3.0 to 4.6 m | Continuous ramp, bright saturated highlight discs, foreground blur too | Deep-focus everything |
| A documentary/street frame | `35mm prime`, zone-focused at 2.5 to 3 m, f/8 | Deep | Isolated subject on a wash of color |
| An environmental establishing frame | `24mm` or `wide-angle lens` | Deep, with corner falloff and corner-only fringing | Center-frame CA |
| A selfie | Phone front camera at 30 to 60 cm | Deep, with software background blur if portrait mode | Optical shallow DoF |

---

## 6. What this corpus does not support

Do not invent numbers for these; write the look, not a spec [distilled-photographic-craft.md]:
- **Apertures and sensor dimensions for current (iPhone 17-era) hardware are unpublished.** Equivalent apertures for the 24 mm main and 100 mm tele are not derivable.
- **No Android or Pixel data at all.** Every phone number here is Apple; the HDR pipeline detail is generic-mobile.
- **No measured phone rolling-shutter readout times.** The 20 to 35 ms figure is a generalization.
- **Wide-angle geometric distortion (barrel, mustache, corner face-stretching) is unquantified.** The corpus mentions "strong edge stretching" without a figure, which matters because the phone ultra-wide is 13 mm equivalent.
- **No just-noticeable-difference threshold for perspective distortion.** JAMA gives +30% / +29% at 12 inches and Fried calls the effect "subtle but noticeable," but no source says how much is too much.
- **No target grain size, amplitude, or ISO-equivalent** for a convincing render.
