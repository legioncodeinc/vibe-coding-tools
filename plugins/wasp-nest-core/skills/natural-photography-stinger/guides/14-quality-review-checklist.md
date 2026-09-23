# 14: Quality Review Checklist

## What this guide is for

This guide is the review pass that runs before any output leaves the skill. It is a structured
checklist plus a scoring rubric with an explicit pass, revise or reject decision.

The review exists because the failure modes are known and enumerable. Human detection of generated
images sits around 62% to 76% depending on the study, barely above chance in the harder cases
`[craft 1.2]`, and machine detectors show negligible reliance on perceptual artefacts even at the
most basic distortion level, making them unreliable and non-explanatory `[models 8.5]`. Neither a
casual glance nor an automated detector substitutes for going through the list. Deliberate inspection
is worth roughly 11 to 18 percentage points of detection accuracy over a one-second look
`[craft 1.1]`, and detection accuracy plateaus around 20 seconds of viewing `[craft 1.2]`. Spend the
twenty seconds per region.

## Load this when

- An output from any path (CASE A edit or CASE B novel scene) is about to be delivered.
- A scheduled run has produced an artefact and needs its verdict before the run report is written.
- The photographer asks "does this look real" or "is this ready".
- You are auditing a previously delivered image.

Run the whole checklist. Do not skip sections because the image "obviously looks fine": the
functional-implausibility class is the hardest for viewers to notice, with 32.8% of instances sitting
in the effectively-invisible 40 to 60% detection band and the largest inspection gain of any class
`[craft 1.1]`. What looks fine is exactly where those live.

Citation legend:
`[craft N]` = `references/research/distilled-photographic-craft.md`, section N.
`[meta N]` = `references/research/distilled-metadata-and-provenance.md`, section N.
`[models N]` = `references/research/distilled-image-models.md`, section N.

---

## Setup

1. Open the output at 100%, not fit-to-screen.
2. Open, beside it: the model's `MODEL-BRIEF.md`, at least two frames from
   `models/<slug>-source/02-selects/` at different angles, and, for a CASE A
   edit, the exact checksum-verified registered source frame from the
   capture-backed model.
3. Confirm which case is being reviewed, using the classifier in `guides/11-metadata-and-exif.md`:
   - **CASE A**: a derived edit of one exact checksum-verified source
     registered in a capture-backed model. The capture identity is inherited
     from that frame.
   - **CASE B**: a novel composite or generation. There is no real capture, so there is no capture
     identity to carry, only scene EXIF that describes the picture.
   - **CASE C** is the publish-time privacy strip, applied after either, and is audited in Section 6.
4. Score each section as you go. Do not total until the end.

---

## Section 1: likeness fidelity (25 points)

Compare against the source frames and the brief, not against the previous iteration. Drift is
cumulative and each step looks acceptable next to the step before it.

| # | Check | Fail if |
|---|---|---|
| 1.1 | Overall recognisability: would the photographer name this person unprompted? | Requires a second look to identify. **Critical.** |
| 1.2 | Face shape, jaw width, cheekbone prominence, chin against the brief. | Any one visibly different. |
| 1.3 | The specific consistent asymmetry recorded in the brief (one eye slightly lower, one nostril larger, a dominant smile side). | The face has become symmetrical, or asymmetrical in a way the brief does not record. Real faces have subtle *consistent* asymmetry `[craft 1.6]`. |
| 1.4 | Skin tone: undertone (warm, cool, neutral or olive) and luminosity against the brief `[craft 7.4]`. | Undertone shifted, or the skin has been lifted toward ashy or grey. |
| 1.5 | Skin has not been brightened independently of the background. | Face brighter than the scene's light justifies. This is the phone-pipeline semantic-face-brightening failure `[craft 2.5]` and the over-lightening failure the skin-tone source warns against `[craft 7.4]`. |
| 1.6 | Hair colour, texture, length, hairline. | Texture changed, especially coily or curly rendered as wavy. |
| 1.7 | Eye colour and lid shape. | Changed. |
| 1.8 | Every item on the brief's **Never alter** list. | Any one altered. **Critical.** |
| 1.9 | Apparent age consistent with the source frames. | Visibly younger or older. |
| 1.10 | Perspective geometry plausible for the stated distance: nose enlarged only if the implied distance is close, flattened only if the implied distance is far `[craft 3.5]`. | Facial proportions of a 0.6 m selfie on a frame that claims 85 mm at 3 m. |

Scoring: 25 for all pass. Deduct 3 per non-critical fail. Any critical fail sends the whole review to
**reject** regardless of total.

---

## Section 2: optics and physics audit (20 points)

This is the layer that remains unfixed across current generators: consistent light direction, correct
shadow geometry, correct reflections, optical rather than edge-based depth of field, and correct
sensor noise are all listed as unfixed, while hands and teeth are largely fixed `[craft 1.7]`.

| # | Check | Fail if |
|---|---|---|
| 2.1 | **Shadow direction.** Every shadow in the frame traces back to the same source position. | Shadows diverge, or a shadow exists with no visible source `[craft 1.1]`. **Critical.** |
| 2.2 | **Shadow character.** Shadow edge softness matches source size and distance; hard source gives hard edges. | Soft light with hard-edged shadows or the reverse. |
| 2.3 | **Falloff gradient.** A brightness ramp exists across the frame consistent with the source distance. | Perfectly even illumination. Absence of any falloff gradient is a strong tell; real point-ish sources always leave a measurable ramp `[craft 4.5]`. |
| 2.4 | **Catchlights.** Shape, size and position in both eyes agree with the stated source, and both eyes agree with each other. | Mismatched or absent catchlights. Close source gives bigger catchlights, distant source smaller `[craft 4.5]`. |
| 2.5 | **Reflections.** Mirrors, glass, water and shiny surfaces show the correct scene from the correct viewing angle. | Reflection shows a different angle or omits scene elements `[craft 1.6]`. |
| 2.6 | **Depth-of-field continuity.** Blur increases continuously with distance. | A step: subject sharp, everything behind at one uniform blur level. That step is the computational signature `[craft 2.4]`. |
| 2.7 | **Bokeh reads optical, not computational.** Out-of-focus specular highlights are bright, saturated, hard-edged discs, brighter than their surroundings. | Dim grey discs. Real bokeh balls are brighter than their surroundings; fake ones are not `[craft 2.4]`. |
| 2.8 | **Optical vignetting in the bokeh.** Cat's-eye squashing of highlight discs toward the frame corners at wide apertures. | Perfectly circular discs everywhere on a frame claiming f/1.4 to f/1.8 `[craft 2.4]`, `[craft 5.6]`. |
| 2.9 | **Foreground blur present** where the scene has foreground elements, not background blur only `[craft 2.4]`. | Only the background is blurred in a shallow-DoF frame. |
| 2.10 | **Segmentation edges.** Hair, glasses arms, cup handles, the gap between arm and torso are all at the correct depth. | Flyaway hair blurred away, or a background sliver left sharp `[craft 2.4]`. |
| 2.11 | **Chromatic aberration.** For a wide-aperture ILC frame, lateral CA (cyan/magenta, or blue/yellow) present in the corners and absent at the centre. The radial gradient is the signature `[craft 5.6]`. | Global fringing, or a total absence on a frame that claims a fast lens wide open. |
| 2.12 | **Vignetting.** Corner darkening present at wide apertures and on wide lenses (natural vignetting follows cos^4 and is always present on wide lenses) `[craft 5.6]`. | Perfectly even corners on a wide-open frame. |
| 2.13 | **Flare geometry**, if shooting into a light source: ghosts fall opposite the source across the frame centre, often in a chain, polygonal when the iris is stopped down `[craft 5.5]`. | Ghosts placed arbitrarily, or veiling haze without a source. |
| 2.14 | **Noise character.** Fine monochromatic luminance grain, with mild chroma mottling, shadows not perfectly clean `[craft 5.2]`. | Perfectly clean shadows with soft-edged smeared texture. |
| 2.15 | **Noise consistency across the frame, including in blurred regions.** Sample grain in the sharp subject and in the out-of-focus background. | Grain stops at the subject outline. Computationally blurred areas come back free of grain because Gaussian blur is denoising; real optical bokeh preserves the same grain level in and out of focus `[craft 2.4]`. **Critical.** |

Scoring: 20 for all pass. Deduct 2 per non-critical fail. 2.1 and 2.15 are critical.

Register note: several of these checks invert by device. A `phone-main` frame legitimately has almost
no optical depth of field (equivalent aperture around f/6.8 to f/8.2), no cat's-eye bokeh, and
computationally synthesised separation `[craft 2.2]`. Judge each item against the device the frame
claims, not against a universal ideal. That is what Section 5 exists to enforce.

---

## Section 3: texture audit (15 points)

Micro-texture does not survive by default. OpenAI staff acknowledged that denoising and coherence
balancing smooths out high-frequency texture, there is no parameter that disables it, and upscaling
does not recover it because it stretches an already-denoised image `[models 3.5]`, `[models 8.1]`.

| # | Check | Fail if |
|---|---|---|
| 3.1 | **Pore-level skin detail** visible at 100% on the nose, forehead and cheeks. | Skin is smooth, waxy, glossy or plastic `[craft 1.6]`. **Critical.** |
| 3.2 | **Fine lines and surface variation** present where the model's age and the source frames show them. | Airbrushed. |
| 3.3 | **Fabric fibre and weave** visible in the wardrobe; slub, pilling, wear at seams and cuffs. | Fabric reads as a flat colour field. |
| 3.4 | **Fabric behaviour**: folds, drape and tension consistent with the pose and the material. | Garment shaped like the body underneath rather than hanging from it. |
| 3.5 | **Hair separation**: individual strands resolvable at the hairline and against the background. | Hair is painted rather than stranded `[craft 1.6]`. |
| 3.6 | **Hairline and background transition** is optical, not cut out. | A halo or an unnatural hair-to-background transition, the "cut out and pasted" look, which is identical to the computational portrait-mode segmentation artefact and is edge-based rather than optical `[craft 1.6]`. |
| 3.7 | **Environment texture**: leaves are distinct rather than vague foliage, surfaces have grain and wear `[craft 1.6]`. | Vague, smeared or repeating background material. |
| 3.8 | **Resolution consistency.** Compare four quadrants and the subject against the background. No region is sharper or cleaner than the rest. | One region resolves visibly better than another. Inconsistent resolution between regions of one image is a named stylistic artefact `[craft 1.1]`. **Critical.** |
| 3.9 | **Compression character**, if the frame claims to be a shared or reposted photograph: 8x8 block structure in flat areas, ringing near hard edges, some sky banding `[craft 5.4]`. | Pristine gradients and perfect edges on a frame that claims a social-media round trip. |

Scoring: 15 for all pass. Deduct 2 per non-critical fail. 3.1 and 3.8 are critical.

---

## Section 4: anatomy and biometrics (20 points)

Anatomical implausibilities occur in roughly a third of generated images and sit at 65% mean
detection accuracy, with 21.4% effectively invisible at a glance `[craft 1.1]`.

| # | Check | Fail if |
|---|---|---|
| 4.1 | **Interpupillary distance** consistent with the source frames and plausible for the face width. | Eyes too far apart or too close. Named biometric artefact `[craft 1.1]`. **Critical.** |
| 4.2 | **Eye size and shape** match between the two eyes allowing for the recorded asymmetry, and match the brief. | Mismatched or implausible `[craft 1.1]`. |
| 4.3 | **Ear position** relative to the eye line and nose base, and **ear shape** including lobe attachment, consistent with the brief and with the implied camera distance. | Ears at the wrong height, wrong shape, or one ear structurally different from the other `[craft 1.1]`. |
| 4.4 | **Hand and finger count**: five digits per hand, thumbs on the correct side. | Extra, missing or merged digits `[craft 1.6]`. **Critical.** |
| 4.5 | **Finger geometry**: knuckles bending in anatomically possible directions, plausible relative lengths. | Bends in unnatural directions `[craft 1.6]`. **Critical.** |
| 4.6 | **Grip and contact**: hands actually enclose what they hold; contact points deform both surfaces. | Hands not gripping, an object floating in the grip. A named functional implausibility `[craft 1.1]`. |
| 4.7 | **Tooth uniformity**: teeth vary in size, shape and shade; any gap, overlap or chip in the brief is present. | Identical, uniform, unnaturally even teeth. |
| 4.8 | **Moles, freckles, scars, tattoos** in the exact positions recorded in the brief, and identical to their positions in any other image in the same series. | Any moved, resized, added or missing. Non-persisting moles and scars are a named biometric artefact `[craft 1.1]`. **Critical for a series.** |
| 4.9 | **Limb count, joint positions, body-part alignment**. | Misaligned or duplicated `[craft 1.1]`. **Critical.** |
| 4.10 | **Relative scale** between the subject and every object and person in the frame. | Disproportionate scaling between subjects in one frame `[craft 1.1]`. |
| 4.11 | **Expression coherence**: if the smile is meant to read as genuine, the eye aperture narrows, the lower lid rises, crow's feet appear, the cheek bulges under the eye and the brow lowers slightly `[craft 6.1]`. | A wide mouth with unchanged, wide-open, unwrinkled eyes: the stock-photo social smile `[craft 6.1]`. |
| 4.12 | **Accessories**: earrings match as a pair, chains re-emerge after passing behind a shoulder, glasses frames are symmetrical, watch faces carry numerals rather than symbols, necklaces sit correctly against the collar `[craft 1.6]`. | Any mismatch. These fail because they require understanding 3D space and physics `[craft 1.6]`. |
| 4.13 | **Text in the frame**: any visible lettering is real, correctly spelled and consistently rendered. | Morphing letters, near-English words, mixed alphabets `[craft 1.6]`. Symbols are a high-frequency artefact class `[models 8.5]`. |

Scoring: 20 for all pass. Deduct 2 per non-critical fail.

---

## Section 5: register coherence (10 points)

Register coherence asks a single question: do the wardrobe, the setting, the lighting, the device and
the implied EXIF all describe the same photograph?

| # | Check | Fail if |
|---|---|---|
| 5.1 | Wardrobe suits the setting and the implied season and temperature. | A wool coat in a frame lit like midday summer. |
| 5.2 | Wardrobe suits the model's registers as recorded in the brief. | A register the brief marks off-limits. |
| 5.3 | Lighting matches the setting: an interior at 2800 to 3000 K with a 6500 K window and a 4300 K overhead does not resolve to a single clean white balance `[craft 4.3]`. | One uniform colour temperature across a mixed-source interior. |
| 5.4 | The white-balance residual is plausible: one illuminant correct and another visibly wrong in the same frame, or a green/magenta tint surviving correction `[craft 4.7]`. | A globally perfect neutral. |
| 5.5 | Sun position agrees with the stated time: golden hour is 6 degrees above to 6 degrees below the horizon with shadows several times subject height; midday is 60 to 90 degrees with short shadows underneath `[craft 4.4]`. | Long golden shadows with an overhead sun. |
| 5.6 | Depth of field agrees with the stated device and aperture. A phone main camera renders DoF like full frame at f/6.8 to f/8.2; the ultra-wide like f/15 to f/20; the tele like f/24 `[craft 2.2]`. | A phone frame with 85 mm f/1.4 separation. **Critical.** |
| 5.7 | Working distance agrees with the stated focal length: 35 mm at 3 to 5 ft, 50 mm at 4 to 6 ft, 85 mm at 6 to 10 ft, 135 mm at 10 to 15+ ft `[craft 3.2]`. | Framing that implies an impossible distance for the stated lens. |
| 5.8 | Facial perspective agrees with the working distance `[craft 3.4]`, `[craft 3.5]`. | Telephoto framing with selfie-distance nasal proportions. |
| 5.9 | Processing register matches the device: a phone frame shows lifted shadows, compressed highlights, flat global tone and slightly over-sharpened edges `[craft 2.5]`; an ILC frame does not have to. | A phone frame with deep filmic shadows, or an ILC frame with phone-pipeline flatness for no stated reason. |
| 5.10 | Flash evidence is internally consistent: if direct flash is claimed, expect flat frontal light, a hard shadow just behind the subject, specular hotspots, background falling to black, and an on-axis catchlight `[craft 4.6]`. | Flash claimed with soft wraparound light. |
| 5.11 | **Technical descriptors match what is depicted.** CASE A values come unchanged from the exact source. CASE B `FocalLength`, `FNumber`, `ExposureTime` and `ISO` are declared scene-profile values and agree with rendered depth of field, motion, light level and noise. | A declared f/1.4 on a frame with everything in focus, or ISO 100 with heavy grain. **Critical.** |
| 5.12 | For CASE B, any device or exposure descriptor comes from an explicitly selected scene profile and is presented only as a declared technical description of the synthetic scene. It is never copied, recovered or inferred from likeness references, and never claims device ownership or capture history. | A reference is used as provenance for a CASE B device/profile, or a declared scene profile is represented as evidence of a real capture. |

Scoring: 10 for all pass. Deduct 1 per non-critical fail.

---

## Section 6: metadata audit (10 points)

Run `exiftool -a -G1 -s <output>` and read the actual result. Do not trust the write command's exit
status, and do not trust an export dialog `[meta 1.2]`, `[meta 6.2]`.

| # | Check | Fail if |
|---|---|---|
| 6.1 | **Case classification correct.** CASE A is an edit of one exact checksum-verified source registered in a capture-backed model; CASE B is a novel scene. | The case recorded does not match what was actually done. **Critical.** |
| 6.2 | **DigitalSourceType present** at `XMP-iptcExt:DigitalSourceType`, exactly one value (cardinality 0..1, single value, not a list) `[meta 3.1]`. | Absent, or written as a list. **Critical.** |
| 6.3 | **DigitalSourceType correct for the case** `[meta 3.4]`: `humanEdits` for non-generative editing; `algorithmicallyEnhanced` for denoise or sharpen only; `compositeWithTrainedAlgorithmicMedia` for generative inpainting or outpainting on a real photo; `trainedAlgorithmicMedia` for a fully generated image; `digitalCapture` only for an unmodified camera photograph. | Wrong term for what happened. **Critical.** |
| 6.4 | **No retired value written**: `minorHumanEdits`, `digitalArt`, `softwareImage` are retired and must not appear in new files `[meta 3.5]`. | Any retired URI present. |
| 6.5 | **URI scheme consistent** across the delivery set. IPTC's CV site declares `http://` canonical while IPTC's own ExifTool examples use `https://`; both exist in the wild, consumers should match on the path suffix, so pick one and be consistent `[meta 3.3]`. | Mixed schemes within one series. |
| 6.6 | **Correct vocabulary**: the IPTC term is `trainedAlgorithmicMedia` under `cv.iptc.org/newscodes/digitalsourcetype/`, not C2PA's `trainedAlgorithmicData` under `c2pa.org/digitalsourcetype/`. Different namespace, different term `[meta 3.6]`. | The C2PA extension URI written as if it were the IPTC value. |
| 6.7 | **No borrowed capture identity on a novel scene.** CASE B has no serial, GPS, `DateTimeOriginal`, `CreateDate`, image number or other capture-event identifier. Technical scene descriptors such as focal length/exposure—and, when deliberately used, Make/Model—are declared profile values paired with synthetic `DigitalSourceType`, never copied or claimed to be recovered from a reference. | Any capture-event identifier, any tags copied from a reference, or any scene profile presented as evidence of a real capture. **Critical.** |
| 6.8 | **CASE A capture identity is the exact source frame's own.** The model is capture-backed; CASE A preflight passed for this registered, checksum-verified source; and `Make`, `Model`, `FocalLength`, `FNumber`, `ExposureTime`, `ISO`, `DateTimeOriginal`, `Orientation`, `ColorSpace` match it exactly when present, unrounded and unimproved `[meta 2.1]`. | The model is visual-only, the source/manifest was not verified, or any available value was invented or altered. **Critical.** |
| 6.9 | **Source frame named** in the run record for CASE A by absolute path, verified SHA-256 and file identity, and present in `MODEL-STATE.json.case_a_sources`. | Missing, unregistered or not the verified file. |
| 6.10 | **Privacy strip applied**: no GPS group, no `BodySerialNumber`, no `LensSerialNumber`, no MakerNotes, no person keywords or face regions, no `XMP-crs:` develop settings, no embedded pre-crop thumbnail `[meta 6.1]`, `[meta 6.3]`. | Any survivor. Note the GPS group must be deleted whole, because the hemisphere lives in separate ref tags and partial deletion leaves a still-identifying record `[meta 6.1]`. |
| 6.11 | **Attribution present** if intended: `XMP-dc:Creator`, `XMP-dc:Rights` `[meta 6.3]`. | Missing when the photographer asked for it. |
| 6.12 | **Provenance intact where it should be.** If a C2PA manifest was produced, it is still present; if the workflow re-encoded and dropped it, that is recorded as a known loss rather than passed over silently `[meta 4.5]`, `[models 7.3]`. | An unrecorded silent loss. |
| 6.13 | **Understand what survives.** A metadata strip removes the C2PA manifest entirely, while SynthID remains in the pixels and detectable `[models 7.3]`. Do not describe a stripped file as unmarked. | The delivery note claims no provenance signals remain. |
| 6.14 | **Verified by reading the file back**, not by trusting the write `[meta 6.3]`. | No verification read in the record. |

Scoring: 10 for all pass. Deduct 1 per non-critical fail.

---

## Scoring rubric and outcomes

Total: 100 points across likeness (25), optics and physics (20), texture (15), anatomy (20),
register (10), metadata (10).

| Verdict | Condition |
|---|---|
| **PASS** | Total >= 90 **and** zero critical fails **and** every metadata item in Section 6 marked critical is a pass. |
| **REVISE** | Total 70 to 89 with zero critical fails. |
| **REJECT** | Total < 70, **or** any critical fail anywhere, **or** any Section 6 critical fail regardless of total. |

Critical items, collected: 1.1, 1.8, 2.1, 2.15, 3.1, 3.8, 4.1, 4.4, 4.5, 4.8 (within a series), 4.9,
5.6, 5.11, 6.1, 6.2, 6.3, 6.7, 6.8.

### What to do in each outcome

**PASS**

5. Record the score, the section subtotals and the reviewed-against frames in the run record.
6. Deliver, with the case classification and the DigitalSourceType value stated in the delivery
   message so the photographer knows what the file says about itself.
7. For a series, append the frame's mole, scar and accessory positions to the series continuity note
   so the next frame can be checked against it (check 4.8).

**REVISE**

8. List the failed items by number. Do not paraphrase them into prose.
9. Fix the single largest failure first, as one scoped change, using the preserve-list pattern from
   guide 10 with the preserve list repeated in full `[models 3.7]`.
10. Re-run the **entire** checklist after each revision, not just the failed items. Fixing one region
    commonly breaks another, which is exactly what checks 3.8 and 2.15 exist to catch.
11. Compare each revision against the original source frames and the brief, never against the
    previous revision.
12. Maximum three revision cycles. If the third revision still scores below 90, the verdict becomes
    reject.
13. On an unattended scheduled run, a revise verdict that does not reach pass within the iteration
    limit delivers nothing and reports `partial` (guide 13, Part 5).

**REJECT**

14. Deliver nothing. Do not deliver a rejected image with a caveat attached.
15. Keep the artefact and its run notes for inspection; name the file so it cannot be mistaken for a
    delivery (`REJECTED-<name>`).
16. Report the failed critical items plainly, and say which of the four root causes applies:
    - The likeness moved (restart from the source frames with a tighter preserve list).
    - The physics is wrong (rebuild the prompt's lighting and optics specification; the physics layer
      is the one that stays unfixed `[craft 1.7]`).
    - The register does not agree with itself (fix the combination before generating again;
      guide 13, Part 2, rule 17).
    - The metadata is wrong (this is fixable without regenerating: correct the tags, verify with a
      read-back, and re-review Section 6 only).
17. A metadata-only reject never justifies delivering the image "while we sort the metadata out". An
    undisclosed synthetic image is the failure this whole skill is built to avoid.
18. If two consecutive attempts reject on the same item, stop and escalate to the photographer with
    the evidence. Repeating a failing approach is not iteration.
