# IPTC Digital Source Type NewsCodes — Controlled Vocabulary

- URL: https://cv.iptc.org/newscodes/digitalsourcetype/
- Fetched: 2026-08-17
- Source type: standard

## Scheme

- **Scheme URI:** `http://cv.iptc.org/newscodes/digitalsourcetype/`
- **Scheme definition:** "Indicates from which source a digital image was created."
- Note: URIs are canonically written with `http://` (not `https://`). The `http://` form is the
  literal value that goes into the metadata field. Do not "upgrade" it to https when writing.

## Where it is written (XMP) — VERIFIED

The value is written to the IPTC Photo Metadata **Extension** schema property
**Digital Source Type**:

- XMP namespace prefix: `Iptc4xmpExt`
- XMP namespace URI: `http://iptc.org/std/Iptc4xmpExt/2008-02-29/`
- Property: `Iptc4xmpExt:DigitalSourceType`
- Full XMP path: `Xmp.iptcExt.DigitalSourceType`
- **ExifTool tag path: `XMP-iptcExt:DigitalSourceType`**
- Data type: closed-choice Text (a single URI string), External
- Cardinality: 0..1 (single value, NOT a list)

Confirmed against IPTC Photo Metadata Standard 2025.1 and against IPTC's own ExifTool
knowledge-base page. It is NOT in the PLUS (`plus:`) namespace — PLUS holds licensing
properties such as `plus:Licensor` and `plus:LicensorURL`.

ExifTool read/write:

```bash
# read
exiftool -XMP-iptcExt:DigitalSourceType photo.jpg

# write (camera photo)
exiftool -XMP-iptcExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture" photo.jpg
```

### http:// vs https:// — a real inconsistency

The IPTC NewsCodes **scheme URI is canonically `http://`** and that is what the CV site
publishes. However **IPTC's own ExifTool examples write `https://`**:

```bash
exiftool -XMP-iptcExt:digitalsourcetype=https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia test-image.jpg
```

Both forms exist in the wild and consumers should match on the path suffix rather than on the
scheme. When writing new files, `http://` matches the canonical scheme declaration; `https://`
matches IPTC's published example code. Pick one and be consistent; do not assume a reader will
normalise.

## Full active vocabulary (concept key → URI → definition)

### 1. digitalCapture
`http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture`
"The media was captured from a real-life source using a digital camera or digital recording device"
— **This is the correct value for an ordinary photograph taken with a camera.**

### 2. computationalCapture
`http://cv.iptc.org/newscodes/digitalsourcetype/computationalCapture`
Multiple frames merged automatically from real-life sources using digital signal processing or
non-generative AI, including HDR processing. (Smartphone computational photography, in-camera
HDR/night mode.)

### 3. negativeFilm
`http://cv.iptc.org/newscodes/digitalsourcetype/negativeFilm`
"The media was digitised from a negative on film or other transparent medium"

### 4. positiveFilm
`http://cv.iptc.org/newscodes/digitalsourcetype/positiveFilm`
"The media was digitised from a positive on a transparency or other transparent medium"

### 5. print
`http://cv.iptc.org/newscodes/digitalsourcetype/print`
"The media was digitised from a non-transparent medium such as a photographic print"

### 6. humanEdits
`http://cv.iptc.org/newscodes/digitalsourcetype/humanEdits`
"Augmentation, correction or enhancement by one or more humans using non-generative tools"
(Supersedes retired `minorHumanEdits`.)

### 7. algorithmicallyEnhanced
`http://cv.iptc.org/newscodes/digitalsourcetype/algorithmicallyEnhanced`
Algorithmic modification initiated by humans without altering core content — e.g. sharpening,
noise reduction.

### 8. digitalCreation
`http://cv.iptc.org/newscodes/digitalsourcetype/digitalCreation`
"Media created by a human using non-generative tools" (supersedes retired `digitalArt`).

### 9. dataDrivenMedia
`http://cv.iptc.org/newscodes/digitalsourcetype/dataDrivenMedia`
"Digital media representation of data via human programming or creativity"

### 10. trainedAlgorithmicMedia
`http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`
"Digital media created algorithmically using an Artificial Intelligence model trained on
captured content" — **This is the value for a fully AI-generated image (Midjourney, DALL·E,
Firefly, Stable Diffusion output).**

### 11. compositeWithTrainedAlgorithmicMedia
`http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia`
"Augmentation, correction or enhancement using a Generative AI model, such as with inpainting
or outpainting operations" — **This is the value for Photoshop Generative Fill / generative
expand applied to a real photo.**

### 12. algorithmicMedia
`http://cv.iptc.org/newscodes/digitalsourcetype/algorithmicMedia`
Media created by algorithm *without* training data — e.g. images generated from mathematical
formulas, fractals, procedural rendering.

### 13. screenCapture
`http://cv.iptc.org/newscodes/digitalsourcetype/screenCapture`
"A capture of the contents of the screen of a computer or mobile device"

### 14. virtualRecording
`http://cv.iptc.org/newscodes/digitalsourcetype/virtualRecording`
"Live recording of virtual event based on Generative AI and/or captured elements"

### 15. composite
`http://cv.iptc.org/newscodes/digitalsourcetype/composite`
"Mix or composite of several elements, any of which may or may not be generative AI"

### 16. compositeCapture
`http://cv.iptc.org/newscodes/digitalsourcetype/compositeCapture`
"Mix or composite of several elements that are all captures of real life"

### 17. compositeSynthetic
`http://cv.iptc.org/newscodes/digitalsourcetype/compositeSynthetic`
"Mix or composite of several elements, at least one of which is Generative AI"

## Retired concepts (do NOT write these into new files)

- **minorHumanEdits** — retired 2024-09-17, superseded by `humanEdits`
- **softwareImage** — retired 2022-06-14, use a more specific term (usually `digitalCreation`
  or `screenCapture`)
- **digitalArt** — retired 2024-09-17, superseded by `digitalCreation`

Retired URIs remain resolvable for backwards compatibility with files already in the wild,
but new writes should use the superseding term.

## Practical mapping summary

| Situation | Correct URI suffix |
|---|---|
| Photo from a real camera | `digitalCapture` |
| Phone photo w/ HDR / night mode stacking | `computationalCapture` |
| Scanned film negative | `negativeFilm` |
| Photo edited in Lightroom/Photoshop, non-generative | `humanEdits` (or `algorithmicallyEnhanced` for denoise/sharpen only) |
| Photo with Generative Fill applied | `compositeWithTrainedAlgorithmicMedia` |
| Fully AI-generated image | `trainedAlgorithmicMedia` |
| Procedural / fractal, no training data | `algorithmicMedia` |
| Screenshot | `screenCapture` |
