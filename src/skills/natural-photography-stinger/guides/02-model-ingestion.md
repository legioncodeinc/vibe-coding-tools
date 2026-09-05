# 02: Model Ingestion

## What this guide is for

This guide is the procedure for onboarding a new model into the skill. A "model" here means a human
subject whose consent is recorded and whose reference images the operator states they are authorised
to use. References may be photographer-captured or supplied/authorised by the model. Ingestion means:
confirming consent, collecting the source photographs, creating the model's folder, extracting the
honest technical facts from capture-backed source files when available, recording the reference
capability, writing the attribute record, and registering the model in the ledger.

Nothing else in this skill can run until at least one model has been ingested. The generation and
editing guides both hard-fail when `models/` contains only `model-template/`, because an empty model
set means there is no consented source material, and the skill will not invent a person to
photograph.

## Load this when

- The photographer says "add a model", "onboard <name>", "I shot someone new", or supplies a folder
  of photographs of a person.
- A run has aborted with the model gate error (`models/` holds only `model-template/`).
- An existing model needs new source coverage added (same procedure, Steps 2 through 8, run
  non-destructively over the existing folder).
- You are asked to audit whether a model's record is complete before a scheduled run.

Citation legend used throughout this file:
`[craft N]` = `references/research/distilled-photographic-craft.md`, section N.
`[meta N]` = `references/research/distilled-metadata-and-provenance.md`, section N.
`[models N]` = `references/research/distilled-image-models.md`, section N.

---

## Step 0: check the gate before you do anything

1. List `models/`.
2. If the only entry is `model-template/`, you are performing the first ingestion. That is allowed:
   ingestion is the one procedure that may run against an empty model set. Every other procedure
   must abort.
3. If `models/MODELS-LIST.md` does not exist, create it in Step 6 with the header block shown there.
4. Never write into `models/model-template/`. It is the skeleton, copied from and never modified.

---

## Step 1: confirm consent and release status before touching files

Do this first, in conversation, before creating any folder or copying any photograph. If the
photographer cannot answer these questions, stop and say so; do not create a partial folder.

Ask for, and record verbatim:

| Field | What to ask | Recorded as |
|---|---|---|
| `name` | The name the model is to be filed under. | Free text. |
| `slug` | Lowercase, hyphenated, no spaces (`jordan-lee`). | Derived, confirm with the photographer. |
| `release_signed` | "Is there a signed model release for this person?" | `yes` / `no` / `verbal-only` |
| `release_scope` | "What uses does it permit?" Personal portfolio, commercial, social media, editorial, client delivery, AI-assisted derivative work. | Free text, quote the photographer. |
| `release_date` | "What date was it signed?" | `YYYY-MM-DD` or `unknown`. |
| `release_location` | Where the signed document lives (a path, a drive, a filing cabinet). | Free text or `not stated`. |
| `expiry` | "Does it expire or is it open-ended?" | Date or `none stated`. |
| `restrictions` | "Anything the model asked you not to do?" | Free text. This is load-bearing, carry it into the brief. |
| `ai_derivative_ack` | "Does the model know their photographs will be used as reference for AI-assisted images?" | `yes` / `no` / `not discussed` |
| `source_use_authorized` | "Are you authorised to use these supplied reference files for this workflow?" | Exactly `yes` is required in `RELEASE.md`; any other answer aborts ingestion |
| `reference_state` | "Are these authorised, attested original captures, or visual-only derivatives such as screenshots/platform downloads?" | `capture-backed` / `visual-only` |
| `visual_only_acknowledged` | For visual-only: "Do you understand these files permit CASE B generation only and cannot be used as CASE A capture sources?" | `yes` / `no` |

**The skill records what the photographer states. It does not verify it.** There is no check that a
release document exists, that the signature is genuine, or that the scope covers what the
photographer later asks for. The ledger entry is an assertion by the photographer, written down so
it can be re-read later. Say this plainly at ingestion time, and write the same sentence into the
brief so it travels with the record.

The same rule applies to source-file rights. Record the operator's statement;
do not claim the skill verified copyright or ownership. `RELEASE.md` is the
authoritative record and must contain exactly one visible
`Whether the supplied reference files are authorised for this workflow`
field with the value exactly `yes` before any supplied or account-export
reference is copied. A brief field may mirror that value but cannot grant it.

If `release_signed` is `no` or `verbal-only`, still ingest, but:

5. Mark the ledger entry `RELEASE: none on file` or `RELEASE: verbal only`.
6. Write the same marker at the top of `MODEL-BRIEF.md`.
7. On every later run that uses this model, surface the marker in the run output rather than
   silently proceeding.

If `ai_derivative_ack` is `no` or `not discussed`, record it and flag it. That is a decision for the
photographer, not for the skill, but an unflagged record is a record that will be forgotten.

---

## Step 2: collect the source photographs

Source coverage is what makes a model render consistently across a series rather than drifting into
a different-looking person from run to run.

### Minimum counts

| Tier | Frames | Use |
|---|---|---|
| **Hard minimum** | **12** distinct frames | Below this, refuse to ingest and tell the photographer what coverage is missing. |
| **Working target** | **24 to 40** frames | Enough to select a good reference subset per run without reusing the same five frames every time. |
| **Reference subset per call** | **5 or 6** frames | Set by the API caps, not by taste: Nano Banana Pro allows 5 character references, 6 high-fidelity object references, 14 total inputs `[models 4.3]`; the OpenAI edits endpoint allows up to 16 images at 20 MiB each `[models 2.3]`. |

### Required coverage

Angles (at least one frame each):

1. Frontal, eye level.
2. Three-quarter left.
3. Three-quarter right.
4. Near profile (one side is enough, both is better).
5. Slightly above eye level.
6. Slightly below eye level.

Camera-to-subject distance (this is the one photographers skip, and it is the one that matters most
for facial geometry):

7. Close, around 0.6 m, the arm's-length range `[craft 3.3]`.
8. Neutral, around 1.5 m, the standard portrait distance `[craft 3.4]`.
9. Far, 3 m or more, the telephoto headshot range `[craft 3.2]`.

Perspective is set by camera-to-subject distance, not focal length `[craft 3.1]`. Nasal width
measures about 30% wider for men and 29% wider for women at 12 inches versus 5 feet `[craft 3.4]`,
and at 3 m or beyond the face flattens and the nose-to-ear ratio normalises `[craft 3.5]`. A model
represented only by selfies has a face whose proportions are a lens artefact. Cover the range.

Lighting conditions (at least three of these five):

10. Window light, subject 2 to 4 ft from the window: bright side 2 to 3 stops over the shadow side,
    visible gradient across the face, large soft rectangular catchlight `[craft 4.5]`.
11. Overcast or open shade, near-shadowless, around 6800 K `[craft 4.4]`.
12. Golden hour, 2500 to 3500 K, low sun, long shadows `[craft 4.4]`.
13. Mixed domestic interior (tungsten lamp plus daylight window plus overhead fluorescent), which is
    where the residual green/magenta tint that reads as "real room" comes from `[craft 4.3]`.
14. Direct on-camera flash, flat frontal light, hard shadow behind, specular hotspots on forehead,
    nose and cheekbones `[craft 4.6]`.

Expressions (at least three):

15. Neutral, mouth closed.
16. Genuine enjoyment smile with the AU6 markers visible: cheeks pulled up, lower eyelid raised,
    crow's feet at the outer eye corner, brow slightly lowered `[craft 6.1]`.
17. Social smile, mouth only, eyes unchanged `[craft 6.1]`.
18. Mid-speech or mid-gesture, an incomplete expression rather than a held pose `[craft 6.3]`.

Also collect, when available:

19. At least two frames showing the hands clearly.
20. At least one frame showing any distinguishing feature the photographer wants preserved (a mole,
    a scar, a tattoo, an asymmetry), sharp and well lit.
21. At least one frame with the model's hair in its everyday state rather than styled for a shoot.

### Format rules

22. Prefer camera originals (RAW or in-camera JPEG). Camera originals still carry MakerNotes; any
    export through Lightroom or Photoshop typically drops them `[meta 2.3]`, and with them the
    vendor white-balance presets and shutter count. Register only authorised, attested originals
    in `MODEL-STATE.json.case_a_sources`.
23. If only exports are available, choose `visual-only`, record the limitation in the brief and set
    `visual_only_acknowledged` to `true` only after the photographer explicitly accepts CASE B-only
    operation. Do not infer or synthesise a capture profile.
24. Screenshots, social-media downloads and re-shared copies are permitted as visual-only likeness
    references for a consented model. Major platforms strip metadata aggressively on upload
    `[meta 6.4]`, so record the platform/derivative source, expect recompression damage
    `[craft 5.4]`, and never promote these files to CASE A. They remain invalid as capture-backed
    sources even when a camera-looking filename or partial EXIF survives.

---

## Step 3: create the model folder

25. Derive `<slug>` from the name: lowercase, spaces to hyphens, no punctuation.
26. Copy `models/model-template/` to `models/<slug>-source/`. Copy it; do not move or rename the
    template.
27. Confirm these template paths exist:
    - `01-reference-frames/` for all reference photographs.
    - `02-selects/` for the frames chosen as the standing reference subset.
    - `03-outputs/` for anything the skill later produces from this model.
    - `04-lineage/` for output lineage records.
28. Copy the source photographs into `01-reference-frames/`. Copy, never move: the photographer's
    files stay where they are.
29. Do not rename the source files. The original filename is part of the provenance chain and is
    what the editing guide will name as the source frame.
30. Create the required `01-reference-frames/CHECKSUMS.txt`. It is a strict
    one-to-one manifest: exactly one SHA-256 line per reference image, no
    missing or duplicate/conflicting targets, no duplicate image content and
    no entry for `CHECKSUMS.txt` itself. Paths are relative to
    `01-reference-frames/`, for example:

    ```text
    0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef  portrait-01.jpg
    ```

    Build it through a temporary file outside `01-reference-frames/`, verify
    it, then replace the manifest. Rebuild it whenever the reference set
    changes; never hash the manifest into itself.
31. Fill `MODEL-STATE.json`:
    - `visual-only`: set `visual_only_acknowledged` to `true` and keep `case_a_sources` empty.
    - `capture-backed`: set `visual_only_acknowledged` to `false` and list at least one exact
      relative path under `01-reference-frames/` in `case_a_sources`. List only
      authorised, attested originals; EXIF presence is not proof.
    Then choose 5 or 6 frames for `02-selects/` covering the widest angle,
    lighting and expression spread available. Each select must be a
    byte-identical copy of a checksum-verified reference; do not crop,
    re-encode or otherwise derive it. Leave the source in
    `01-reference-frames/` as well.

---

## Step 4: record provenance and extract capture attributes when available

The reference state decides this step. Visual-only files are valid likeness
references for CASE B, but they do not establish a capture event. Capture-
backed files may supply CASE A metadata only when their exact relative paths
are registered in `MODEL-STATE.json.case_a_sources`.

32. For `visual-only`, do not run EXIF extraction as if it could recover the
    missing capture identity. Record the source type (for example, Facebook
    export or screenshot), resolution/compression limitations, and
    `Capture profile: unavailable; CASE A disabled` in the brief. Do not create
    an `EXIF-SUMMARY.json` placeholder and do not infer a camera from pixels.
33. For `capture-backed`, run the canonical diagnostic read only across the
    registered CASE A sources:
    `exiftool -a -G1 -s <registered-source> [...]`
    `-a` allows duplicate tags, `-G1` prints the specific group, and `-s`
    prints tag names rather than descriptions. Plain `exiftool -exif:all`
    suppresses duplicates and is not an audit `[meta 1.2]`.
34. Produce `EXIF-SUMMARY.json` from those same registered sources only. Do
    not mix visual-only supplements into the capture roll-up.
35. Read Tier A tags as reliable when present: `Make`, `Model`,
    `FocalLength`, `FNumber`, `ExposureTime`, `ISO`, `ExposureProgram`,
    `MeteringMode`, `WhiteBalance`, `Flash`, `ColorSpace`, `Orientation`,
    `DateTimeOriginal`, `CreateDate`, `ModifyDate`, `Software` `[meta 2.1]`.
36. Treat Tier B as optional and tolerate absence. Do not synthesise a value
    to fill a hole `[meta 2.2]`.
37. Ignore `Composite:` tags. They are calculated by ExifTool and do not
    physically exist in the file `[meta 2.6]`.
38. Summarise the capture-backed files into a body-and-lens profile: bodies
    and lenses with frame counts; focal-length, aperture and ISO ranges;
    typical flash values; and whether an editor rewrote `Software`.
39. **Record serials and GPS as present-or-absent only. Do not copy their
    values into the brief or ledger.** The brief needs to know they exist so
    the publish-time strip can be verified; it does not need the values
    `[meta 6.1]`.

---

## Step 5: build the model's attribute record

These are the attributes that determine whether the same person is recognisable across a series.
Write each as a short descriptive phrase, not a category label. Interview the photographer for
anything the frames cannot settle.

| Attribute | How to record it | Why it matters |
|---|---|---|
| Build and height | "Slim, around 1.7 m, narrow shoulders." Approximate is fine. | Prevents body drift between frames in a series. |
| Facial structure | Face shape, jaw width, cheekbone prominence, brow shape, chin. | The proportions that survive across angles. |
| Facial asymmetry | The specific, consistent asymmetry: one eye slightly lower, one nostril larger, a dominant smile side. | Real faces have subtle consistent asymmetry; perfectly symmetrical or randomly asymmetrical faces are a documented tell `[craft 1.6]`. |
| Interpupillary spacing impression | "Slightly wide-set" / "close-set" / "average". | Interpupillary distance is a named biometric artefact in the anatomical category `[craft 1.1]`. |
| Ear position and shape | Height relative to eye line, protrusion, lobe attached or free. | Named biometric artefact `[craft 1.1]`; ears are also the feature most distorted by close working distance `[craft 3.5]`. |
| **Skin tone** | Record as **undertone plus luminosity**, never as an ethnic category. Undertone vocabulary: warm (golden, yellow, peach), cool (pink, red, blue), neutral or olive (green-yellow cast) `[craft 7.4]`. Luminosity: a plain-language depth description ("deep", "medium-deep", "medium", "light-medium", "light"). | Fitzpatrick is a UV-response scale, not a colour-measurement scale, with documented poor reliability for nonwhite individuals `[craft 7.2]`. Undertone plus luminosity is what actually drives lighting and grading decisions. |
| Skin rendering notes | Whether the photographer wants exposure placed for the diffuse component, whether speculars are to be controlled, whether backlight separation is standard for this model. | On deep skin the diffuse colour-bearing return is weaker while the specular return is unchanged, so speculars dominate the recorded signal; adding raw exposure blows them `[craft 7.1]`. Deep skin often needs less fill, not more, and a backlight for separation `[craft 7.4]`. |
| Never-over-lighten note | Record explicitly: "do not lift luminance until the skin goes ashy or grey." | The failure mode the skin-tone source warns against `[craft 7.4]`, and the same failure phone pipelines produce automatically by brightening faces against bright backgrounds `[craft 2.5]`. |
| Hair | Colour, texture (straight, wavy, curly, coily), length, hairline shape, typical styling, whether flyaways are normal. | Hair is a documented failure region: "painted rather than stranded", with frizz, hairlines and coily texture the worst failures `[craft 1.6]`, and hair contours are where segmentation assigns the wrong depth `[craft 2.4]`. |
| Eyes | Colour, lid shape, lash character, whether glasses are usual. | Eye size and shape are named biometric artefacts `[craft 1.1]`; asymmetric glasses frames are a named headshot tell `[craft 1.6]`. |
| Teeth | Any gap, overlap, chip or asymmetry. | Tooth uniformity is a review item; real teeth are not identical. |
| Distinguishing features to preserve | Moles, freckle patterns, scars, tattoos, piercings, a crooked finger. Note the location precisely. | Non-persisting moles and scars across a series is a named biometric artefact `[craft 1.1]`. |
| Never alter | Anything the photographer states must never be changed: body shape, skin tone, a scar, hair texture, apparent age. | This list is quoted verbatim into every preserve list the skill later builds. |
| Wardrobe register | The registers this model actually wears, and any the photographer says are off-limits. | Feeds categorical rotation on scheduled runs. |
| Consent notes | The `restrictions` field from Step 1, quoted. | Travels with the model, not with the shoot. |

---

## Step 6: write the ledger entry

The ledger at `models/MODELS-LIST.md` is the single index of every ingested model.

39. If the file does not exist, create it with exactly one visible
    `## Roster` section and this canonical ten-cell table:

```markdown
# Models List

Every model ingested by natural-photography-stinger. One entry per model.
Release status is recorded as stated by the photographer and is NOT verified by this skill.

## Roster

| Slug | Display name | Frames | Selects | Reference state | Allowed cases | Release on file | Ingested | Last run | Status |
|---|---|---|---|---|---|---|---|---|---|
```

40. Insert exactly one contiguous row per canonical `<slug>-source/` folder.
    Remove the `_(none yet)_` sentinel on first ingestion. The slug uses only
    lowercase letters or digits separated by single hyphens. `Frames` and
    `Selects` are canonical integers equal to the gate's unique valid image
    counts on disk, not filenames or claimed counts. Keep the row to one line;
    the detail lives in the brief.

```markdown
| jordan-lee | Jordan Lee | 28 | 6 | visual-only | B | yes | 2026-08-17 | never | active |
```

    `Reference state` is exactly `visual-only` or `capture-backed`. `Allowed
    cases` is exactly `B` for visual-only and exactly `A, B` for
    capture-backed. `Status` is exactly `active` or `retired`; retired models
    remain recorded but explicit requests return `CASE_BLOCKED` and generic
    runs skip them. Each row must match its `MODEL-STATE.json`, checksum-backed
    frame/select counts and folder slug.

41. Below the table, add a per-model block only if there is a restriction or a missing release, so
    that the exception is impossible to miss:

```markdown
## jordan-lee
- RESTRICTION (photographer's words): "no images that imply a workplace endorsement".
- Release document location: photographer's drive, not in this repo.
```

42. Never rewrite or delete another model's row during an ingestion. Append only.

---

## Step 7: write the per-model brief

Write `models/<slug>-source/MODEL-BRIEF.md`. This is the file every later run reads. Structure:

```markdown
# Model Brief: <Name> (<slug>)

## Consent and release
Recorded as stated by the photographer on <date>. NOT verified by this skill.
- Signed release: <yes|no|verbal only>
- Scope: <quoted>
- Release date: <YYYY-MM-DD|unknown>
- Expiry: <date|none stated>
- AI derivative use acknowledged: <yes|no|not discussed>
- Supplied reference files authorised (mirror only): copy `yes` from RELEASE.md; not authoritative
- Restrictions (photographer's words): <quoted>

## Source coverage
- Frames: <n> in 01-reference-frames/, <n> in 02-selects/
- Angles / distances / lighting / expressions covered: <list each>
- Gaps: <what is missing, plainly>

## Reference provenance and capture profile
- Reference state: <visual-only|capture-backed>
- Allowed cases: <CASE B only|CASE A for registered sources plus CASE B>
- Source and limitations: <platform export/screenshot/original capture; resolution and metadata notes>
- Registered CASE A sources: <none|relative paths from MODEL-STATE.json>
- Capture profile: <unavailable; CASE A disabled|body/lens/exposure roll-up from registered sources>
- Serials present: <not assessed|yes|no>. GPS present: <not assessed|yes|no>. Values deliberately
  not recorded.

## Physical attributes
<the Step 5 table, filled in>

## Never alter
- <one line per item>

## Reference subset
- 02-selects/<file> : <angle, distance, light, expression>
- ... (5 or 6 entries)

## Notes
<anything the photographer said that does not fit above>
```

43. Every claim in the brief must be traceable to either the source files or a statement by the
    photographer. If you inferred something from the frames, write "(inferred from frames)" after it.
44. Do not write a physical attribute you cannot see and the photographer did not state. An empty
    field is better than a guess that becomes canon.

---

## Step 8: verify the ingestion

Run these checks and report the result. Any failure means the model is not ingested.

45. `models/<slug>-source/` exists and `models/model-template/` is unchanged.
46. `01-reference-frames/` holds at least 12 unique valid images. Its required
    `CHECKSUMS.txt` has exactly one matching SHA-256 entry for every image and
    no entry for itself; there are no extra, missing, duplicate or conflicting
    entries and no duplicate image content.
47. `02-selects/` holds exactly 5 or 6 unique valid image files, each a
    byte-identical copy of a checksum-verified reference.
48. `MODEL-STATE.json` parses and matches the brief. Visual-only has acknowledgement `true` and an
    empty CASE A list; capture-backed has at least one valid registered source. For capture-backed,
    `EXIF-SUMMARY.json` exists and parses. For visual-only, it is not required.
49. `MODEL-BRIEF.md` and `RELEASE.md` exist and have no unfilled `<...>`
    placeholders. `RELEASE.md` contains exactly one visible source-use
    authorisation field with the value exactly `yes`; the brief contains the
    "Never alter" section and only mirrors that authorisation.
50. `models/MODELS-LIST.md` has exactly one visible canonical `## Roster`
    table and exactly one matching row for every `<slug>-source/` folder. The
    row has ten cells, exact state/case/status values and frame/select counts
    that match the verified disk contents.
51. Report to the photographer: frame count, coverage gaps, release status as recorded, and the
    one-sentence statement that the skill did not verify the release.

---

## Adding additional models later

The procedure is identical, run again from Step 1. Three rules make it safe:

52. **Non-destructive.** Ingesting a second model creates a new folder and appends a row. It never
    touches an existing `<slug>-source/` folder, never rewrites another model's brief, and never
    reorders the ledger.
53. **No cross-contamination.** Frames of one model never enter another model's `01-reference-frames/`. If two
    people appear in one photograph, it belongs to whichever model the photographer nominates, and
    the brief must note that a second person is present and whether that person consented.
54. **Slug collisions abort.** If `models/<slug>-source/` already exists, stop and ask whether this
    is new coverage for the existing model (run Steps 2, 3, 4, 8 only, appending frames and updating
    the coverage and capture-profile sections of the existing brief) or a different person needing a
    distinct slug (`jordan-lee-2` is a bad slug; ask for a disambiguating name).

Adding coverage to an existing model updates the brief in place and updates the frame count in the
ledger row. It does not create a second ledger row.

---

## What aborts an ingestion

Stop, report, and create nothing when any of these hold:

55. The photographer will not or cannot answer the Step 1 consent questions.
56. Fewer than 12 usable source frames, or the frames cover only one angle, one lighting condition
    and one distance. Say which coverage is missing.
57. The photographer states the subject did not consent, or the subject is a minor and the
    photographer has not confirmed guardian consent.
58. The supplied files are visual-only and the photographer will not explicitly acknowledge that
    CASE A is disabled, or asks to register those derivatives as CASE A capture sources. Missing
    metadata alone does not abort a CASE B-only ingestion.
59. The operator asks to ingest a public figure or other person from scraped,
    stock or web-sourced images without that person's recorded consent and a
    statement authorising use of the reference files.

## Upgrading visual-only to capture-backed

When an original becomes available, copy it into `01-reference-frames/`, add
its exact relative path to `MODEL-STATE.json.case_a_sources`, set
`reference_state` to `capture-backed`, extract its capture profile, update the
brief and ledger, rebuild the complete one-to-one checksum manifest, copy any
new selects byte-for-byte, and run:

```bash
python3 references/scripts/preflight.py --json --model <slug> --case A --source <absolute-source-path>
```

Do not promote the existing platform derivatives. The upgrade unlocks CASE A
only for each newly registered original.
