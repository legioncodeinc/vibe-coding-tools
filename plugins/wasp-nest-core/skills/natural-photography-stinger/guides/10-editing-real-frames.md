# 10: Editing Real Frames

## What this guide is for

This guide is the retouch workflow for an actual captured photograph of an
ingested model. The input is a real frame the operator is authorised to use
and has attested as an original capture. The output is the same photograph
with one scoped change, and a metadata handoff that says exactly that: CASE A,
a real capture, edited, with the source frame named.

This is the highest-value path in the skill and the one with the lowest failure rate, because the
optics, the light, the anatomy and the capture identity are all real already. The only thing that can
go wrong is drift: the model quietly turning into a different person, or the frame quietly turning
into a render. Everything below exists to prevent that.

## Load this when

- The operator asks to retouch, clean up, fix, remove, replace or adjust an
  authorised, attested original capture.
- A registered frame in `models/<slug>-source/01-reference-frames/` needs a delivery version.
- A generation run produced something the photographer wants applied to a real frame instead.

Do **not** load this when the subject, scene or moment did not happen. That is a novel scene and
belongs to the generation path and to CASE B metadata, which forbids borrowing the capture identity
of a real frame.

Citation legend:
`[craft N]` = `references/research/distilled-photographic-craft.md`, section N.
`[meta N]` = `references/research/distilled-metadata-and-provenance.md`, section N.
`[models N]` = `references/research/distilled-image-models.md`, section N.

---

## Step 0: gate check

1. List `models/`. If the only entry is `model-template/`, abort. There is no consented source
   material and this skill does not invent a subject.
2. Confirm the target model has `MODEL-BRIEF.md` and `MODEL-STATE.json`. If either is missing, abort
   and run guide 02. Then run the CASE A gate with the exact source path:

   ```bash
   python3 references/scripts/preflight.py --json --model <slug> --case A --source <absolute-source-path>
   ```

   Code 5 means the model is valid but that source is not registered for
   CASE A. A visual-only model cannot use this guide. Do not infer original
   status from EXIF, resolution or filename.
3. Read the brief's **Never alter** list and **Restrictions** line now, before writing any prompt.
   Both are quoted verbatim into the preserve list in Step 4.

---

## Step 1: select the source frame

4. Ask the photographer which registered frame, or propose candidates from `01-reference-frames/`
   and confirm. Run the CASE A gate after the exact path is chosen.
5. Prefer a camera original over an export. Exports have already lost MakerNotes and had `Software`
   rewritten `[meta 6.2]`, and a re-encode has already cost the frame some of its 8x8 block
   structure and gradient depth `[craft 5.4]`.
6. Confirm the frame actually contains what the request assumes (the object to remove, the hand to
   fix, the garment to swap). Look at it. Do not take the request's word for the frame's contents.
7. Record the absolute path. This path is named in the handoff and must not change during the run.

---

## Step 2: hash the source frame

8. Confirm the required `01-reference-frames/CHECKSUMS.txt` contains exactly
   one entry for this source, then compute its SHA-256 and record the digest in
   the run notes.
9. Verify the digest matches the manifest. A missing manifest or entry, a
   duplicate/conflicting entry, or a mismatch stops the edit. Ask whether the
   frame changed outside the skill; never refresh the hash during an edit.
10. The digest is the anchor for every later comparison. Every review in Step 6 compares against
    this file, not against an intermediate.
11. Copy the source frame into the working area rather than editing in place. Never edit the
    archival original `[meta 6.3]`.

---

## Step 3: state the intended change in one sentence

12. Write the change as a single sentence with exactly one verb: "remove the coffee cup from the
    table", "replace the grey sweater with a navy crewneck", "clean the sensor dust in the sky".
13. If the sentence needs an "and", it is two edits. Split them and run this procedure twice. Small
    single-change follow-ups are the documented iteration strategy `[models 3.7]`.
14. Read the sentence back to the photographer and get agreement before spending a call.
15. Check the sentence against the brief's **Never alter** list. If the requested change touches a
    never-alter attribute (body shape, skin tone, a scar, hair texture, apparent age), stop and say
    so. Do not negotiate it silently.

---

## Step 4: build the edit prompt using the preserve-list pattern

The documented mitigation for edit drift is: **"change only X" plus "keep everything else the same",
with the preserve list repeated on every iteration** `[models 3.7]`. There is no negative-prompt
syntax, no weights, no `--no`; exclusions and invariants are plain English sentences inside the
prompt `[models 3.6]`.

Prompt skeleton, in labelled segments rather than one paragraph `[models 3.2]`:

```
EDIT: <the single sentence from Step 3>

PRESERVE EXACTLY (do not change any of these):
- The person's face: bone structure, eye shape and spacing, nose, mouth, jawline, ears.
- The person's skin: tone, undertone, luminosity, texture, pores, and every mole, freckle and scar
  in its exact position.
- <every line from the brief's "Never alter" list, quoted>
- Hair: colour, texture, length, hairline, and the existing flyaway strands.
- Expression and gaze direction.
- Body shape, posture and the position of every limb and finger.
- Camera angle, framing and crop.
- Lighting: direction, quality, colour temperature and the existing shadow geometry.
- Existing grain and noise, including its level in the out-of-focus regions.
- Everything else in the frame that is not named in EDIT.

CONSTRAINTS:
- This is a real photograph. Do not re-render it, do not restyle it, do not clean it up.
- Do not smooth skin. Keep visible pores, fine lines and surface texture.
- Do not brighten the face independently of the background.
- Match the grain of the edited region to the grain of the surrounding frame.
- No watermark, no added text, no logos.
```

16. Put the EDIT line first and the preserve list second. Official prompt order runs scene, subject,
    details, constraints `[models 3.1]`; for an edit, the change is the subject.
17. Quote the never-alter lines verbatim from the brief. Paraphrasing loses the specificity that
    makes them enforceable.
18. Name the texture explicitly. Micro-texture must be named as subject matter because it will not
    survive by default: OpenAI staff acknowledged that denoising and coherence balancing smooths out
    high-frequency texture, and there is no parameter that turns smoothing off `[models 3.5]`,
    `[models 8.1]`.
19. Avoid words implying studio polish: pristine, flawless, perfect, ultra-detailed, 8K,
    hyperdetailed, masterpiece `[models 3.4]`.
20. When multiple images go into the call, reference each by index and description ("Image 1: the
    source frame. Image 2: reference for the model's face.") `[models 3.8]`.

---

## Step 5: call the model

21. Choose the endpoint:
    - **Mask-precise change with a supplied alpha mask**: OpenAI `/v1/images/edits` with `mask`.
      Transparent regions of the mask mark the editable area; opaque preserves `[models 2.6]`.
    - **Region described in words rather than masked**: Nano Banana Pro, which does semantic masking
      with no mask file `[models 4.4]`.
    - **Skin, natural light, phone-camera or candid look**: prefer `gemini-3-pro-image`, which leads
      on skin texture, subsurface scattering and sensor-noise character, where the OpenAI output
      reads "too clean, too evenly lit" `[models 8.6]`, `[models 8.4]`.
22. Set `quality` to `high` for identity-sensitive edits and close-up portraits `[models 3.8]`.
23. Do not expect an `input_fidelity` knob on `gpt-image-2`: it is disabled there, and the models
    that support it retire on 2026-12-01, after which reference fidelity is carried entirely by
    multi-image inputs plus explicit preserve-list prompting `[models 2.5]`.
24. **Disable `allow_fallback_model` on Replicate.** It silently falls back to `bytedance/seedream-5`
    when Nano Banana Pro is at capacity `[models 5.2]`, which changes the model mid-series without
    telling you. A capacity error you can see is better than a substitution you cannot.
25. Attach the source frame plus 2 or 3 frames from `02-selects/` as likeness references when the
    edit touches the person at all. Respect the caps: 5 character references, 6 high-fidelity object
    references, 14 total on Nano Banana Pro `[models 4.3]`; 16 images at 20 MiB each on the OpenAI
    edits endpoint `[models 2.3]`.
26. Record the exact request (model, endpoint, parameters, full prompt text) in the run notes. If the
    Responses API returns `revised_prompt`, record that too: the model rewrites prompts silently
    `[models 8.1]`.
27. Save the output with a name that carries the lineage: `<source-stem>--edit-01.<ext>`. Hash it.

---

## Step 6: review against the source

Open the source frame and the output side by side. Compare the output to **the source**, at 100%.

28. **Likeness.** Interpupillary spacing, ear position and shape, nose width relative to the face,
    jaw and chin, the specific asymmetry recorded in the brief. These are the named biometric
    artefacts `[craft 1.1]`.
29. **Persistence.** Every mole, freckle, scar and tattoo in the same place at the same size.
    Non-persisting moles and scars are a named artefact `[craft 1.1]`.
30. **Edges.** The boundary of the edited region against everything around it. Edge and shape
    integrity is the single most frequently annotated artefact class in the empirical taxonomy
    (10,277 instances versus 3,139 for semantics) `[models 8.5]`, and hair against background is the
    canonical failure `[craft 1.6]`.
31. **Grain continuity.** Sample noise inside the edited region and outside it. Computationally
    blurred or regenerated areas come back free of grain, and grain that stops at an outline is the
    synthetic signature `[craft 2.4]`, `[craft 5.2]`.
32. **Resolution consistency.** Does the edited region look sharper or cleaner than the rest of the
    frame? Inconsistent resolution between regions of one image is a named stylistic artefact
    `[craft 1.1]`.
33. **Light and shadow.** Shadow direction, softness and density in the edited region must match the
    rest of the frame. Consistent light direction and correct shadow geometry are both on the
    unfixed-tell list `[craft 1.7]`.
34. **Skin.** Waxy, glossy or excessively smooth skin means the smoothing bias won. Pores and fine
    lines must survive `[craft 1.6]`, `[models 8.1]`.
35. **Unrequested changes.** Scan for anything that changed which the EDIT sentence did not name.
    That is drift, regardless of whether it looks good.

Record the review as a short list of pass/fail lines, not a paragraph. Guide 14 is the full checklist
for the delivery decision; this is the fast in-loop check.

---

## Step 7: iterate with the preserve list repeated every round

36. If the review fails, write one new single-change instruction addressing the largest failure.
37. **Repeat the entire preserve list, verbatim, in every iteration.** This is the documented drift
    mitigation and it is not optional `[models 3.7]`.
38. Prefer re-running from the **original source frame** with a better prompt over stacking a second
    edit onto the previous output. Each generation pass costs texture that upscaling cannot restore
    `[models 8.1]`, and each re-encode costs gradient depth and adds block structure `[craft 5.4]`.
39. Hash and keep every iteration. Never overwrite.
40. Compare each iteration against the **source frame**, never against the previous iteration. See
    the drift note in "When to stop".

---

## Common retouch requests and how to scope them

Every row assumes the standard preserve list is also present.

| Request | Phrase it as | Scope trap to avoid |
|---|---|---|
| Blemish or spot removal | "Remove only the single blemish on the left cheek, below the cheekbone. Keep all other skin marks, moles and freckles exactly as they are, and keep the surrounding pore texture." | An open "clean up the skin" instruction removes the permanent moles and freckles too, and returns waxy skin `[craft 1.6]`. Name the one mark and its location. |
| Stray hair across the face | "Remove only the single hair strand crossing the right eyebrow. Keep the hairline, all other flyaway strands and the hair texture unchanged." | "Tidy the hair" restyles it and turns stranded hair painted `[craft 1.6]`. |
| Wardrobe swap | "Replace only the clothing with a navy crewneck sweater, fitting the garment naturally to her existing pose, with realistic fabric behaviour and shadows matching the existing light. Keep face, body shape, pose, hair and expression exactly." | The documented identity-lock example `[models 3.7]`. Without the pose and shadow clause the body silhouette changes under the new garment. |
| Background object removal | "Remove only the coffee cup on the table at frame right, and reconstruct the tabletop behind it. Keep every other object, the table edge, and the existing shadows." | Removing an object without naming its shadow leaves an orphan shadow with no source, a named physics artefact `[craft 1.1]`. Name the shadow if the object cast one. |
| Bystander removal | "Remove only the person in the far background at frame left, reconstructing the wall behind them. Keep the subject, all foreground objects and the existing light unchanged." | Large reconstructions invite a resolution mismatch in the filled area `[craft 1.1]`. Check that region hardest in review. |
| Sensor dust or sky spots | Do this non-generatively if any local tool is available. If not: "Remove only the three dark specks in the upper sky area. Change nothing else, and keep the existing sky gradient and grain." | Generative sky work re-renders the gradient and produces banding-free perfection, which reads rendered `[craft 5.4]`. |
| Colour cast correction | Do this non-generatively. If generative: "Neutralise only the green cast on the wall behind the subject. Keep the warm colour temperature on the face and the cyan cast in the window unchanged." | A global "fix the white balance" flattens the multi-illuminant residual that reads as a real room `[craft 4.7]`, `[craft 4.3]`. |
| Teeth | "Reduce only the yellow tint of the teeth slightly. Keep the existing tooth shapes, the gap between the front teeth, and all tooth-to-tooth size differences." | "Fix the teeth" produces uniform identical teeth, a review-checklist failure. |
| Eye brightening | "Slightly lift the brightness of the irises only. Keep the existing catchlight shape, position and size, and keep the sclera as it is." | The catchlight shape encodes the real light source; replacing it breaks the lighting story `[craft 4.5]`. |
| Crop or straighten | Do this non-generatively, outside the model. | A generative "straighten" re-renders the whole frame and it is no longer the same capture. |
| Skin smoothing | Push back. If the photographer insists: "Reduce only the specular shine on the forehead and nose bridge. Keep all pores, fine lines and skin texture." | Smoothing is the plastic-look failure mode `[models 8.1]`; shine reduction is the honest version of the request `[craft 4.6]`. |
| Adding an object | "Add only a paperback book lying flat on the table at frame right, matching the existing light direction and casting a shadow consistent with the other objects' shadows." | Objects that could not work as designed and implausible placement are the functional-implausibility category, the hardest class for viewers to notice and therefore the one to check deliberately `[craft 1.1]`. |
| Background replacement | Treat as a new scene, not a retouch. If done anyway, it becomes a composite and the metadata case changes. | A replaced background with the original subject is `compositeWithTrainedAlgorithmicMedia`, not a simple edit `[meta 3.4]`. Say so at handoff. |

---

## When to stop

### Iteration limits

41. **Three iterations per edit.** If the intended change is not achieved by iteration 3, the prompt
    is not the problem: the request is either under-specified or beyond the endpoint.
42. **Hard stop at five.** Past five, deliver nothing and report. Every additional pass costs texture
    and moves the likeness `[models 8.1]`.
43. If two consecutive iterations fail on the **same** review item, stop early. Repeating the same
    instruction louder does not fix a structural failure.
44. If the model refuses the prompt, do not rephrase to evade the refusal. Report the refusal text.
    Nano Banana Pro hard-refuses prompts involving prominent real people `[models 8.2]`, which should
    not fire for a private consented model; if it does, the prompt is describing something other than
    what you intend.

### Drift detection

45. **Always compare against the original source frame, never against the previous iteration.** Drift
    is cumulative and each step looks acceptable next to the step before it. Three passes that each
    move the face 3% look fine pairwise and are 9% off the person by the end.
46. Keep a fixed comparison set for every review: the source frame, the current output, and one
    `02-selects/` frame of the same model from a different angle.
47. Declare drift and restart from source when any of these appear:
    - Interpupillary spacing, ear position or nose width have visibly moved.
    - The recorded facial asymmetry has become symmetry.
    - A mole, freckle or scar has moved, changed size or vanished.
    - Skin texture is smoother than the source anywhere in the frame.
    - Grain is present in the source and absent, or reduced, in the output.
    - The edited region is sharper or cleaner than its surroundings.
    - Shadow direction in the edited region disagrees with the rest of the frame.
    - Anything changed that the EDIT sentence did not name.
48. Restarting from source is cheap. Stacking a corrective edit onto a drifted output is not; it
    bakes the drift in as the new baseline.
49. If the photographer prefers a drifted iteration aesthetically, that is their call, but it is no
    longer a retouch of a real frame. Say so, and hand it off as a composite rather than as CASE A.

---

## Step 8: hand off to the metadata layer as CASE A

50. Declare the case explicitly in the handoff: **CASE A, edit of an exact
    checksum-verified registered source in a capture-backed model**, in the
    sense the classifier in `guides/11-metadata-and-exif.md` uses it: the
    output derives from that one named source frame, so it inherits that
    frame's genuine capture EXIF. If the generative work has
    replaced the scene rather than a localised region, it is no longer CASE A; say so and hand it off
    as CASE B with the inherited capture EXIF dropped.
51. **Name the source frame** by absolute path and by SHA-256 digest. The metadata layer needs it to
    copy the capture identity, and the record needs it to be auditable.
52. State how the edit was performed, because it selects the DigitalSourceType value `[meta 3.4]`:
    - Non-generative tools only: `humanEdits`.
    - Sharpening or noise reduction only, no content change: `algorithmicallyEnhanced`.
    - Generative inpainting, outpainting or object replacement on a real photo:
      `compositeWithTrainedAlgorithmicMedia`.
    - Do not write `trainedAlgorithmicMedia` here. That value is for a fully generated image and is
      wrong for an edited capture.
    - Never write the retired values `minorHumanEdits`, `digitalArt` or `softwareImage` `[meta 3.5]`.
53. State that the capture identity comes from the source frame's own EXIF. The honest CASE A basis
    is the Tier A set already in the file: `Make`, `Model`, `FocalLength`, `FNumber`,
    `ExposureTime`, `ISO`, `DateTimeOriginal`, `Orientation`, `ColorSpace` `[meta 2.1]`. Do not
    invent, round or "improve" any of them.
54. Flag for the privacy strip: whether the source frame carries GPS, `BodySerialNumber`,
    `LensSerialNumber` or MakerNotes. The publish-time strip is allow-list based (strip everything,
    then add back only what is intended), and the whole GPS group must go together because the
    hemisphere lives in separate ref tags `[meta 6.3]`, `[meta 6.1]`.
55. Note that `XMP-iptcExt:DigitalSourceType` exists only in the XMP packet, with no IIM or EXIF
    fallback location, so any strip that removes XMP removes the disclosure entirely `[meta 3.1]`.
    The strip and the disclosure write must happen in the right order, left to right `[meta 6.3]`.
56. Pass the run notes through: model, endpoint, parameters, every prompt version, every iteration
    hash, and the review results.
57. Do not deliver until guide 14 has been run against the final output.

`guides/11-metadata-and-exif.md` is authoritative for the classifier and the exact commands, and it
is also where the publish-time privacy strip (its CASE C) is defined. This guide's obligation is to
hand it a complete, honest, unambiguous statement of what happened.
