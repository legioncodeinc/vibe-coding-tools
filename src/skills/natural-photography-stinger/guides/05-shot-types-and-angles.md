# 05: Shot Types and Camera Angles

## What this guide is for
A lookup table of every shot type, camera angle, and self-capture mode you can specify in an image prompt. Each entry gives the framing definition, the focal length and working distance that produce it, what it communicates, the literal words to write into the prompt, and whether the result reads candid or professional. Two ranking tables tell you which choices survive human scrutiny best and which physical imperfections belong with each shot.

## Load this when
- You are choosing the framing or viewpoint slot of a prompt (Google's slot 1, "shot type"; OpenAI's "framing and viewpoint" rule) [distilled-image-models.md].
- You need to decide between portrait, candid group, posed group, or full body and want the detection-rate evidence.
- You are writing a selfie, mirror selfie, or third-party candid and need the geometry that makes it read real.
- You need to know which imperfections to attach to a given shot so the frame is internally consistent.

---

## 1. Choose the scene type first: detection-rate ranking

CHI 2025, 450 diffusion images plus 149 real photographs, 599 total, 539,749 human responses. Lower detection accuracy means more photorealistic (harder for a human to call as AI) [distilled-photographic-craft.md].

| Rank | Scene type | Detection accuracy (lower = better) | % in bottom decile (most photorealistic) | Verdict |
|---|---|---|---|---|
| 1 | **Portraits** | **72.7%** | **16%** | Best default. Single subject, head-and-shoulders or tighter. |
| 2 | **Candid groups** | **73.4%** | not reported | Second best. Unposed multi-person, no lineup. |
| 3 | Posed groups | 76.2% | 3% | Avoid. Detection penalty ~3.5 points and only 3% bottom-decile. |
| 4 | Full body | 77.2% | not reported | Avoid. Worst of the four; whole-anatomy exposure. |

Source phrasing: "Portraits and candid groups fool people most; posed groups and full-body shots fool people least" [distilled-photographic-craft.md].

**Operational rule:** prefer single-subject portrait framing or candid-group framing. Every step toward full body adds visible anatomy to check. Overall human detection sits at 76% for AI images and 74% for real photographs, per-image range 32% to 99% [distilled-photographic-craft.md].

**Counter-reading to know about:** arXiv 2507.18640 ranks human portraits as the *easiest* to detect, but it compares people against landscapes and objects, not portraits against other people shots. For choosing among shot types the CHI 2025 within-people ranking is the better-supported table [distilled-photographic-craft.md].

---

## 2. Shot type catalog

Focal lengths are full-frame equivalents. Working distances for head-and-shoulders framing come from the practitioner working-distance table; distances for wider framings are scaled from the same linear relationship and are marked (scaled) [distilled-photographic-craft.md].

| Shot type | Framing definition | Focal length (FF equiv) | Working distance | Communicates | Literal prompt phrasing | Reads as |
|---|---|---|---|---|---|---|
| **Extreme close-up** | Part of a face: eye, mouth, hands only. Frame edge cuts the head. | 85 to 135 mm, or a macro lens | 0.6 to 1.5 m (scaled) | Intensity, texture, forensic attention | `an extreme close-up of` / `macro shot of` | Professional (macro reads as intent) |
| **Close-up** | Head fills the frame, chin to above the hairline, shoulders barely present | 85 to 135 mm | 1.8 to 3.0 m at 85 mm; 3.0 to 4.6 m at 135 mm | Emotion, scrutiny, "attractive, smart, strong" at long focal length | `a close-up of` / `a close-up portrait of` | Professional |
| **Medium close-up** | Head and shoulders, top of chest in frame. The classic headshot. | 50 to 85 mm | 1.2 to 1.8 m at 50 mm; 1.8 to 3.0 m at 85 mm | Conversational, direct address, interview register | `a medium close-up of` / `head-and-shoulders portrait of` | Professional |
| **Medium shot** | Waist up | 35 to 50 mm | 1.5 to 2.5 m (scaled) | Person plus a little context; the documentary default | `a medium shot of` / `waist-up shot of` | Either; leans candid at 35 mm |
| **Medium long (cowboy)** | Mid-thigh up | 35 mm | 2.5 to 3.5 m (scaled) | Person in a place, body language visible | `a medium-long shot of, framed from mid-thigh up` | Candid |
| **Full body** | Head to feet inside the frame | 24 to 35 mm | 3 to 5 m (scaled) | Whole figure, outfit, posture, environment | `a full-body shot of, full body visible, feet included` | Either. **Worst detection rank: 77.2%** |
| **Wide establishing** | Subject small in a large environment | 13 to 24 mm | 5 m and beyond | Place first, person second | `a wide-angle shot of` / `a wide establishing shot of` | Candid |
| **Over-the-shoulder** | Back of one person's head and shoulder occupies a near foreground corner; the second person is in focus beyond | 35 to 50 mm | 1.5 to 2.5 m to the far subject | Conversation, two-party relationship, observer position | `shot over the shoulder of a foreground figure, their shoulder soft and out of focus in the near corner` | Candid |
| **Arm's-length selfie** | Head and shoulders, camera held by the subject, front camera | Phone front camera, ~24 to 26 mm equiv | **~60 cm** (Fried) down to **30 cm** (JAMA extreme) | Immediacy, self-authorship, social-media vernacular | `an arm's-length selfie taken on a phone front camera` | Candid (strongly) |
| **Extended-arm / selfie stick** | Head and torso plus more background than an arm's-length selfie | Phone front camera or main camera | 0.9 to 1.5 m | Group inclusion, background inclusion, tourist register | `a selfie taken at extended arm's length, more background visible, slight downward angle` | Candid |
| **Mirror selfie** | Subject photographed via a mirror, phone visible in hand, mirror frame or room edge visible | Phone main camera, 24 to 26 mm equiv | 0.8 to 2 m to the mirror, so **1.6 to 4 m of optical path** | Outfit display, bathroom/bedroom vernacular, self-documentation | `a mirror selfie, phone held visible in the reflection, room reflected behind` | Candid (strongly) |
| **Third-party candid** | Someone else photographs the subject, who is not addressing the lens | 28 to 50 mm primes; 35 mm f/2 on APS-C for documentary | **2.5 to 3 m (8 to 10 ft)**, the classic street-candid zone | Observation, unguarded moment, "unaltered state" | `a candid photograph of, subject unaware of the camera, not looking at the lens` | Candid |
| **Walking / mid-motion** | Subject in transit, one foot off the ground, weight shifted, arms mid-swing | 28 to 50 mm | 2.5 to 4 m | Momentum, decisive-moment register | `a candid shot of walking mid-stride, caught mid-motion` | Candid |
| **Seated** | Subject seated at a table, on a couch, on steps; torso and hands available | 35 to 85 mm | 1.5 to 3 m | Rest, interview, domesticity | `a seated subject at a table, hands resting on the surface` | Either |
| **Group** | Two or more people | 24 to 35 mm | 3 to 6 m | Relationship, occasion | Candid: `a candid group photograph, nobody looking at the camera at the same time, subjects mid-conversation`. Posed: `a posed group photograph` | Candid group **73.4%**; posed group **76.2%**. Prefer candid phrasing. |

**Cross-vendor vocabulary note.** Google's prompt guide explicitly names `wide-angle shot`, `macro shot`, `close-up`, and `portrait` as shot types the model responds to, and OpenAI's guide says to "Specify framing and viewpoint (close-up, wide, top-down)" [distilled-image-models.md]. Use those exact strings where they fit; they are the words the vendors tested.

---

## 3. Camera angle catalog

| Angle | Definition | Typical placement | Communicates | Literal prompt phrasing | Reads as |
|---|---|---|---|---|---|
| **Eye level** | Lens at the subject's eye height, optical axis horizontal | Standing camera on a standing subject | Neutral, equal, documentary | `shot at eye level` / `eye-level perspective` | Either. The neutral default. |
| **High angle** | Lens above eye level looking down, 10 to 45 degrees | Camera raised, or a taller photographer | Subject reduced, vulnerable; also the natural phone-held-up selfie angle | `shot from a high angle, camera above eye level looking down` | Candid when slight, professional when composed |
| **Low angle** | Lens below eye level looking up | Camera at chest, waist, or ground | Subject enlarged, dominant, heroic | `shot from a low angle` / `low perspective` / `low-angle perspective` | Professional (deliberate) |
| **Dutch angle** | Camera rolled about the optical axis, horizon tilted | Any height | Unease, or with the snapshot aesthetic, carelessness | `Dutch angle, horizon tilted` / `slightly tilted horizon, offhand framing` | **Candid**, if the tilt is small and unmotivated. Snapshot sources call these "Dutch-angled, offhand images" and "drunken horizons" [distilled-photographic-craft.md] |
| **Bird's eye** | Directly overhead, optical axis vertical downward | Above the subject | Diagram, layout, detachment | `a top-down shot` / `bird's-eye view directly overhead` | Professional |
| **Worm's eye** | At or below ground level looking steeply up | Lens on the floor | Monumentality, exaggerated verticals | `a worm's-eye view from ground level looking up` | Professional |
| **Elevated 45 degrees** | Above and to one side, the mid-point between eye level and bird's eye | Standing over a table or seated subject | Product, food, over-the-desk observation | `an elevated 45-degree shot` | Professional. Named verbatim in Google's own vocabulary list [distilled-image-models.md] |

**Angle vocabulary confirmed by vendors:** `low perspective`, `low-angle perspective`, `elevated 45-degree shot`, `Dutch angle` (Google); `eye-level`, `low-angle`, `top-down` (OpenAI) [distilled-image-models.md].

---

## 4. The self-capture modes in detail

These carry geometry consequences that no other shot type does. Full numbers are in guide 06; the operational summary is here.

| Mode | Camera-to-face distance | Facial geometry consequence | Prompt phrasing |
|---|---|---|---|
| **Phone held close (extreme)** | **30 cm (12 in)** | Nasal width **+30% in men, +29% in women** versus a 5 ft portrait (JAMA 2018, DOI 10.1001/jamafacial.2018.0009) | `held close to the face, nose slightly enlarged by the short camera distance` |
| **Arm's-length selfie** | **~60 cm** | "Visible distortions similar to the fisheye effect"; nose enlarged relative to ears and cheeks, ears pushed back and partly hidden, jaw narrowed, face reads rounder at center and tapering at the edges | `an arm's-length selfie, mild wide-angle facial perspective, nose and forehead slightly closer to the lens than the ears` |
| **Phone held high** | 40 to 60 cm, angled down | **Forehead enlarged**, chin narrowed | `phone held above eye level angled down, forehead nearest the lens` |
| **Phone held low** | 40 to 60 cm, angled up | **Chin enlarged**, forehead receding | `phone held below chin level angled up, jaw nearest the lens` |
| **Extended arm / stick** | 0.9 to 1.5 m | Distortion greatly reduced; approaching the 1.2 m Fried comparison distance | `taken at extended arm's length, facial proportions close to normal` |
| **Mirror selfie** | 0.8 to 2 m to the glass, so the effective subject distance is **double the mirror distance** | Near-neutral facial geometry because the optical path is doubled; this is why mirror selfies flatter more than arm's-length selfies | `a mirror selfie, phone visible in the reflection` |

**Reference distances for calibration** (Fried, SIGGRAPH 2016): ~60 cm arm's-length selfie; 90 cm mannequin ground-truth baseline; 120 cm comparison; 480 cm "far" professional headshot distance. JAMA models 30 cm selfie versus 5 ft (1.5 m) standard portrait versus infinite distance as the zero-distortion reference [distilled-photographic-craft.md].

**Perceptual associations to invoke or avoid** [distilled-photographic-craft.md]:

| Setup | Perceptual read | Use it when |
|---|---|---|
| Close-up portraits (short distance) | "peaceful," "approachable" | You want warmth and intimacy |
| Distant telephoto headshots | "attractive," "smart," "strong" | You want authority |
| Short lens plus close distance | "amateur / intimate" | You want the shot to read as a real snapshot |
| Long lens plus far distance | "professional / aloof" | You want the shot to read as commissioned work |

---

## 5. Shot type mapped to the imperfections that accompany it

Real photographs carry imperfections specific to how they were made. Attaching the wrong imperfection to a shot type is itself a tell. Every imperfection below is sourced [distilled-photographic-craft.md].

| Shot type | Imperfections that genuinely accompany it | Literal prompt phrasing to add |
|---|---|---|
| **Extreme close-up / close-up** | Visible pores, vellus hair, blemishes, asymmetric moles, one eye slightly lower than the other, luminance grain in the shadow side of the face, shallow-DoF ear or hair edge going soft | `visible pores and fine vellus hair, a small blemish, subtle facial asymmetry, fine monochromatic grain in the shadows` |
| **Medium close-up (headshot)** | Catchlight with a real shape (window rectangle, softbox), gradient across the face from the near cheek to the far cheek, stray flyaway hairs, slight sensor grain | `a large soft rectangular catchlight in each eye, a visible brightness gradient across the face, a few flyaway hairs` |
| **Medium / medium long** | Fabric wear, garment creasing at the elbow and waist, background objects clipped by the frame edge, a slightly off-center subject | `worn fabric with visible creasing and slub, subject slightly off-center, background objects cut by the frame edge` |
| **Full body** | Foot and hand placement problems (the anatomical category, 65% detection), shoes scuffed, shadow anchored under both feet, one shoulder lower | `feet fully visible with a contact shadow under each shoe, weight on one hip, scuffed shoes` |
| **Wide establishing** | Corner-only cyan/magenta color fringing, corner darkening (optical vignetting) at wide apertures, cos^4 natural vignetting always present on wide lenses, barrel-ish edge stretching on figures near the frame edge | `slight corner darkening, faint cyan and magenta fringing in the corners only, edge figures mildly stretched` |
| **Over-the-shoulder** | Foreground shoulder rendered as *foreground* blur (real optics blur foreground as well as background; computational bokeh usually does not) | `the near shoulder rendered as soft foreground blur, grain preserved in the blurred area` |
| **Arm's-length selfie** | Front-camera noise and denoise smear in the shadows, semantic face brightening against a bright background, wide-angle nose enlargement, one arm cropped or entering the frame corner | `phone front camera look, slightly noisy shadows, face brightened relative to the background, the shooting arm entering the lower frame corner` |
| **Extended arm / selfie stick** | Slight downward angle, hand and stick visible or implied, tilted horizon | `held out on a stick, slight downward angle, horizon a few degrees off level` |
| **Mirror selfie** | Mirror smudges and dust, the phone body and its flash or lens array visible, reflected room clutter, focus landing on the mirror plane, reflection showing the correct viewing angle (a common AI failure) | `smudges and dust on the mirror glass, phone body and camera bump visible in the reflection, room clutter behind` |
| **Third-party candid** | Subject blinking or mid-blink, mouth mid-word, awkward hand position, someone partially cropped by the frame edge, "fragments of gestures and postures" rather than complete poses | `mid-sentence expression, hands caught mid-gesture, a second person half cropped at the frame edge` |
| **Walking / mid-motion** | Motion blur on the trailing foot and swinging hand, rolling-shutter lean on vertical edges if the camera panned (phones at ~20 to 35 ms readout), ghosting and zipper artifacts along the edges of moving objects from HDR frame merge | `slight motion blur on the trailing hand and foot, everything else sharp` |
| **Seated** | Compressed clothing at the waist, chair or table edge cropped, cluttered tabletop, uneven table light falloff | `garment bunched at the waist, cluttered tabletop, table edge cut by the frame` |
| **Candid group** | Only one person looking at the lens, differing expressions, one subject blinking, uneven light across faces (the person nearest the source is measurably brighter, per inverse-square), a person partly occluding another | `nobody looking at the camera at the same moment, one person blinking, the nearest face noticeably brighter than the farthest` |
| **Posed group** | Almost none, which is exactly why it is the second-worst scene type at 76.2% detection. If you must, add height mismatch, one person's smile fading, a hand awkwardly placed | `one person's smile already fading, uneven spacing, mismatched eyelines` |

**Universal add-ons regardless of shot type** [distilled-photographic-craft.md]: fine monochromatic luminance grain in the shadows with mild chroma mottling (shadows not perfectly clean); one coherent white balance with a warm cast rather than per-region correction; shadows allowed to go dark and lose detail; highlights allowed to clip. Perfectly clean shadows with soft-edged smeared texture read as heavy noise reduction or as generation.

---

## 6. Candid versus professional: which register a shot lands in

| Marker | Candid register | Professional register |
|---|---|---|
| Working distance | 60 cm (selfie) or 2.5 to 3 m (street) | 1.8 to 4.6 m with a long lens |
| Focal length | 24 to 50 mm equivalent, phone-native | 85 to 200 mm |
| Framing discipline | Non-hierarchical, no rule of thirds, subjects cropped by the frame edge, "taken mostly without aiming" | Single dominant subject, deliberate placement |
| Horizon | Tilted, "drunken" | Level |
| Exposure | "muddy exposures," flat shadows, clipped highlights | Placed, protected highlights |
| Lighting | Available light or direct on-camera flash, "dazzling artificial light" | Controlled key, fill, and separation |
| Expression | "unguarded expression," "fragments of gestures," boredom and vulnerability included | Held expression |
| Grain | Present and unapologetic | Controlled |

Verbatim technical list of the snapshot aesthetic: "meaningless blur, grain, muddy exposures, drunken horizons, and general sloppiness" [distilled-photographic-craft.md].

**The key strategic insight, stated in the source:** the snapshot look reads "natural, point-and-shoot" but is usually deliberately constructed, "staged spontaneity" that mimics amateur vernacular photography. Reproducing the signature of unaimed shooting on purpose is exactly the task [distilled-photographic-craft.md].

**The viewer's calibration point:** about 5.3 billion photos are taken daily as of 2024, 94% via mobile devices. The default "photograph" a viewer's eye is calibrated to is a **24 to 26 mm phone frame**, not a 50 mm SLR frame [distilled-photographic-craft.md]. When in doubt about what reads as normal, that is the answer.

---

## 7. Framing discipline: composition markers by register

The snapshot sources give an explicit list of composition markers for unposed work. These are the phrases that make a frame read as taken rather than made [distilled-photographic-craft.md].

| Marker | Definition | Prompt phrasing | Register |
|---|---|---|---|
| **Subject cropped by the frame edge** | An arm, a shoulder, half a second person, or the top of the head cut off | `a second person half cropped by the right frame edge, the subject's elbow cut off at the bottom` | Candid |
| **Non-hierarchical arrangement** | No single dominant subject, no rule-of-thirds discipline | `no single dominant subject, several people given equal weight in the frame` | Candid |
| **Taken without aiming** | The frame does not resolve to a designed composition | `framed offhand, as if the camera was raised and fired without composing` | Candid |
| **Drunken horizon** | Tilt of a few degrees, unmotivated | `horizon tilted a few degrees off level` | Candid |
| **Dead-center subject** | Subject placed centrally with no compositional reason | `subject placed dead centre with no compositional intent` | Candid |
| **Fragments of gestures and postures** | A partial gesture instead of a complete pose | `hands caught mid-gesture rather than in a resolved pose` | Candid |
| **Single dominant subject, deliberate placement** | The professional inverse | `one clearly primary subject, deliberately placed` | Professional |

**Practitioner constraint that pulls the other way:** "Complex scenes work best when one subject is clearly primary" [distilled-image-models.md]. Reconcile by making one subject primary in *focus and light* while keeping the *framing* offhand: a clear subject, sloppily framed.

**Emotional register to include:** the snapshot aesthetic covers "boredom and vulnerability," not just joy, and "bare, unglamorous interiors replace formal studio settings" [distilled-photographic-craft.md].

---

## 8. Shot type mapped to aspect ratio

Vendor-supported values [distilled-image-models.md]:
- **Google:** `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`.
- **OpenAI:** `1024x1024`, `1536x1024`, `1024x1536`, `auto`, or a custom WIDTHxHEIGHT with each dimension divisible by 16, up to 3840x2160. Aspect ratio cap **<= 3:1**. Total pixel count **655,360 to 8,294,400**. Sizes above 2560x1440 are **experimental**.

| Shot type | Natural aspect ratio | Why |
|---|---|---|
| Extreme close-up, close-up, medium close-up | `4:5`, `3:4`, `1024x1536` | Vertical crop follows the head |
| Arm's-length selfie, mirror selfie, extended arm | `9:16`, `3:4` | Phone-native portrait orientation. A selfie in `16:9` reads wrong immediately. |
| Medium, medium long, seated | `4:5`, `3:4`, `1:1` | Torso plus a little room |
| Full body | `2:3`, `9:16`, `1024x1536` | Tall frame follows the figure |
| Walking / mid-motion | `3:2`, `16:9` | Horizontal room for the direction of travel |
| Group, candid group | `3:2`, `4:3`, `16:9` | Horizontal spread |
| Wide establishing | `16:9`, `21:9`, `1536x1024` | Environment first |
| Over-the-shoulder | `3:2`, `16:9` | Two subjects across the frame |
| Bird's eye of a table or layout | `1:1`, `4:3` | Square reads as a deliberate top-down |

**Practitioner rule:** "model composition improves when aspect is both flagged and mentioned in prose"; the `size` parameter alone under-informs composition [distilled-image-models.md]. Set the parameter **and** write the orientation into the prompt: `vertical 4:5 frame`, `a tall phone-orientation frame`.

---

## 9. Gaze and eyeline

Gaze is the fastest single switch between the candid and professional registers. OpenAI's guide explicitly lists "gaze" among the things to describe for people, alongside "scale, body framing, and object interactions" [distilled-image-models.md].

| Eyeline | Prompt phrasing | Reads as |
|---|---|---|
| Into the lens | `looking directly into the lens` | Professional, or selfie |
| Just past the lens | `looking just past the camera at someone standing beside it` | Professional portrait, softer |
| Off-axis, mid-conversation | `looking off to the left at someone out of frame, mid-sentence` | Candid |
| Down at a task | `looking down at their hands, absorbed in what they are doing` | Candid |
| Mid-blink | `caught mid-blink, one eye partly closed` | Candid, strong |
| Split in a group | `only one of the four looking at the camera, the rest looking in different directions` | Candid group. The highest-value group phrase. |
| Selfie into the front camera | `looking into the phone's front camera, eyes very slightly off the lens axis because they are watching the preview` | Selfie, authentic detail |

That last row is worth using: real selfie-takers look at the **screen preview**, not the lens, so the eyeline sits a few millimeters off axis. Portrait-lens catchlight geometry from guide 07 should agree with whichever eyeline you pick.

---

## 10. Assembled shot blocks (copy, then substitute)

Each block fills Google's slots 1 through 7 in order and carries the required imperfections for that shot type. Combine with a lighting block from guide 07 and a lens block from guide 06.

**Candid portrait, best detection rank (72.7%):**
`A photorealistic close-up portrait of [subject], shot at eye level with an 85mm portrait lens from about two and a half metres. Looking off to the left at someone out of frame, mid-sentence. Visible pores and fine vellus hair, a small blemish on one cheek, subtle facial asymmetry with one eye slightly lower than the other. Fine monochromatic grain in the shadows. Vertical 4:5 frame.`

**Candid group, second-best rank (73.4%):**
`A photorealistic candid group photograph of [subjects] in [setting], shot at eye level with a 35mm lens from about three metres. Nobody looking at the camera at the same moment, one person blinking, hands caught mid-gesture. The nearest face noticeably brighter than the farthest. A fourth person half cropped by the right frame edge. Horizontal 3:2 frame.`

**Arm's-length selfie:**
`A photorealistic arm's-length selfie of [subject] in [setting], phone front camera held about sixty centimetres away, slightly above eye level and angled down. Mild wide-angle facial perspective: nose and forehead slightly closer to the lens than the ears, ears partly hidden. The shooting arm entering the lower frame corner. Slightly noisy shadows, face brightened relative to the background. Vertical 9:16 frame.`

**Mirror selfie:**
`A photorealistic mirror selfie of [subject] in [setting], phone held visible in the reflection with the camera bump showing, shot at eye level on a phone main camera about one metre from the glass. Smudges and dust on the mirror surface, room clutter reflected behind, focus landing on the mirror plane. Vertical 9:16 frame.`

**Third-party street candid:**
`A photorealistic candid photograph of [subject] walking mid-stride in [setting], shot at eye level with a 35mm prime zone-focused at three metres, deep depth of field. Subject unaware of the camera, not looking at the lens. Slight motion blur on the trailing hand and foot, everything else sharp. Horizon tilted a few degrees off level. Horizontal 3:2 frame.`

---

## 11. Candid expression: what to write instead of "smiling"

A genuine (Duchenne) smile is AU 6 plus AU 12: zygomatic major *plus* orbicularis oculi. A social or fake smile is AU 12 alone [distilled-photographic-craft.md].

| Write this | Not this |
|---|---|
| `cheeks pulled up, lower eyelids raised and narrowing the eye aperture, crow's feet at the outer eye corners, the skin below the eye bulging slightly, eyebrows very slightly lowered` | `smiling`, `happy`, `beaming` |
| `eyes changed shape, not just the mouth` | `wide bright smile` |
| `mid-sentence, mouth partly open, eyes off-axis` | `looking at the camera and smiling` |

The AI and stock-photo tell to avoid: full teeth, wide mouth, eyes wide open and unwrinkled, brows unmoved [distilled-photographic-craft.md].

**Caveat carried from the source:** a deliberately made broad smile produces all the AU6 signs, so these markers are a *generation instruction*, not a reliable discriminator [distilled-photographic-craft.md].

---

## 12. Prompt slot order (where the shot type goes)

- **Google:** shot type, subject, action, environment, lighting, mood, camera and lens details, aspect ratio. Shot type is slot 1 [distilled-image-models.md].
- **Google's photorealism template, verbatim:** `A photorealistic [type of shot] of a [subject description] in a [setting description]. [Description of the light]. Shot from a [camera angle] with a [lens type].` [distilled-image-models.md]
- **OpenAI:** background/scene, then subject, then key details, then constraints. Framing and viewpoint go in the key-details block [distilled-image-models.md].

Both vendors want the shot type stated as a phrase, not implied. Neither supports weights, `::` emphasis, or `--no` negatives; exclusions are plain English sentences [distilled-image-models.md].
