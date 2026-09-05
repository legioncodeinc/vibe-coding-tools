# Guide 11: Metadata and EXIF

## What this guide is for

Writing, inheriting, and stripping image metadata honestly. One firm rule, a three-case classifier you must run before writing anything, the exiftool syntax for each case, the real-camera tag set, the IPTC DigitalSourceType decision table, internal EXIF consistency rules, the SynthID versus C2PA split, and the regulatory picture as of 2026-08-17.

## Load this when

- You are about to write, copy, or strip any EXIF, XMP, IPTC, or C2PA data.
- An output has been produced by any model or edit path and needs delivering.
- The user asks to "add camera data", "make it look like it came from my camera", or "match my other shots".
- You are preparing a file for publication and need the privacy strip.
- Someone asks what the law requires.

---

## 1. THE RULE

> **EXIF describing a capture event may only be carried by an image that derives from that capture event.**

That is the whole boundary. Not negotiable, not a style preference.

A body serial, a lens serial, a GPS coordinate, and a capture timestamp are **records of a specific physical event**: a particular body, in a particular place, at a particular instant. Copying them onto an image that did not come from that event produces a false record of a real-world event. That is the line.

Fully permitted and fully supported by this guide: inheriting a real frame's real EXIF into an edit **of that frame**; writing technically coherent scene EXIF on a synthetic image with a correct synthetic `DigitalSourceType`; stripping GPS, serials and personal identifiers before publication; recording processing history and lineage.

**Before writing a single tag, classify the output. Do not skip this. Do not write metadata to an unclassified output.**

```
Does this output derive from one specific, named source frame, such that
a person could point at that frame and say "this came from that"?
  |
  +-- YES, one identifiable source frame that is registered in a
  |   capture-backed model and checksum-verified by CASE A preflight
  |     -> CASE A: derived edit. Inherit that exact frame's genuine capture EXIF.
  |
  +-- NO single source frame (fully generated, multi-source composite, or a
  |   scene that was never photographed)
  |     -> CASE B: novel composite or generation. Scene EXIF only. No borrowed
  |               serial, GPS, or capture timestamp. Ever.
  |
  +-- Image already correct, this is the delivery step
        -> CASE C: publish-time privacy strip.
```

An output can be Case A then later Case C, or Case B then later Case C. It can never be both A and B.

---

## 2. CASE A: derived edit

**Definition:** the output derives from one exact source frame registered in
`MODEL-STATE.json.case_a_sources` for a capture-backed model, and that frame's
required manifest checksum has been verified by a successful CASE A
preflight. Retouching, colour grading, cropping, denoising, mask-precise
inpainting and generative fill may qualify only when that source contract is
met.

Run `preflight.py --json --model <slug> --case A --source <absolute-path>`
immediately before metadata work and retain its verified SHA-256 and file
identity in the run record. A named but unregistered, visual-only or
checksum-unverified frame is not CASE A.

| Step | Action |
|---|---|
| 1 | **Inherit the source frame's genuine capture EXIF in full**: camera (`Make`, `Model`), lens (`LensModel`, `LensInfo`, `LensMake`), exposure (`FocalLength`, `FNumber`, `ExposureTime`, `ISO`), timestamps (`DateTimeOriginal`, `CreateDate`, `SubSecTimeOriginal`, `OffsetTimeOriginal`) |
| 2 | **GPS: inherit only if the photographer wants it retained. Ask.** It is genuine data and also the highest-risk field for photographer and subjects (section 4) |
| 3 | **Add processing history.** Write `Software` naming the actual toolchain, and record what was done |
| 4 | **Set `DigitalSourceType` to match the degree of algorithmic contribution** (section 7.2). Denoise-only is not the same as generative fill |
| 5 | **Log the source file's SHA-256 to output lineage.** This makes "derives from that frame" checkable rather than asserted |
| 6 | **Leave any C2PA manifest intact.** Do not strip it to tidy the file |

```bash
# group-preserving full inheritance
exiftool -tagsFromFile source.CR3 -all:all -overwrite_original -P output.jpg

# selective: capture data only, no GPS
exiftool -tagsFromFile source.CR3 \
  -EXIF:Make -EXIF:Model -EXIF:LensModel -EXIF:LensInfo -EXIF:LensMake \
  -EXIF:FocalLength -EXIF:FNumber -EXIF:ExposureTime -EXIF:ISO \
  -EXIF:ExposureProgram -EXIF:MeteringMode -EXIF:Flash -EXIF:Orientation \
  -EXIF:DateTimeOriginal -EXIF:CreateDate -EXIF:OffsetTimeOriginal \
  -EXIF:SubSecTimeOriginal -overwrite_original -P output.jpg

# per-file: each exported JPEG pulls from its own RAW (%d dir, %f name, %e ext)
exiftool -tagsFromFile %d%f.CR3 -all:all -ext jpg -r -overwrite_original -P ./exports

# MakerNotes: opaque block only, and -make -model are mandatory
exiftool -tagsFromFile source.CR3 -makernotes -make -model -overwrite_original -P output.jpg

# processing history and lineage
SRC_HASH=$(sha256sum source.CR3 | cut -d' ' -f1)
exiftool -EXIF:Software="Lightroom Classic 14.x + exiftool 13.59" \
  -XMP-iptcExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/humanEdits" \
  -XMP-dc:source="source.CR3" -XMP-xmpMM:DerivedFrom="sha256:${SRC_HASH}" \
  -overwrite_original -P output.jpg
```

`-all:all` is the **group-preserving form**. Without it, `-tagsFromFile src dst` with no tag arguments copies all writable tags into ExifTool's **preferred** locations, preference order **EXIF > IPTC > XMP**, so a tag that lived in XMP in the source can land in EXIF in the destination [distilled-metadata-and-provenance.md].

MakerNotes can only be copied as a **complete opaque block**; individual MakerNotes tags cannot be copied, and `Make`/`Model` must accompany them because those tags select the parser. **Changing `Make` or `Model` destroys MakerNotes.** On `Possibly incorrect maker notes offsets (fix by -340?)`, add `-F` (`-fixBase`).

Log the same SHA-256 to your own lineage record (sidecar JSON, ledger, job log), not only into the file. Metadata inside the file can be stripped by a platform; your record cannot.

**Case A forbids:** using a visual-only model; using an unregistered or
checksum-unverified source; inheriting EXIF from a **different** frame than
the one the output derives from because the numbers looked better; inheriting
from a frame that shares a shoot but not the capture; backdating
`DateTimeOriginal` to a shoot date on an output with no single source frame
(that is Case B wearing Case A's clothes).

---

## 3. CASE B: novel composite or generation

**Definition:** there is no single source frame. Fully generated images, multi-source composites, scenes that were never photographed.

The likeness references may be capture-backed or visual-only. Their metadata
does not change the case: references guide appearance, while the output is
still a scene that was never captured.

| Step | Action |
|---|---|
| 1 | **Write technically coherent scene EXIF**: `FocalLength`, `FNumber`, `ExposureTime`, `ISO`, consistent with the depicted scene **and with each other** (section 8) |
| 2 | **NEVER write a body serial, lens serial, GPS coordinate, `DateTimeOriginal`, `CreateDate`, or other capture-event timestamp.** Record generation time in the external lineage/run record instead |
| 3 | **Set `DigitalSourceType` to the correct synthetic value** (section 7.2): `trainedAlgorithmicMedia`, `compositeWithTrainedAlgorithmicMedia`, `compositeSynthetic`, or `compositeCapture` |
| 4 | **Leave C2PA intact.** If the generator wrote a manifest, it stays |
| 5 | Write authorship and rights normally. Those are true statements about you, not about a capture event |

**Why scene EXIF is legitimate and serials are not.** `FocalLength: 85mm` on a synthetic portrait is a statement about the **rendered image**: this frame has the perspective compression of an 85mm lens. It describes the picture. `BodySerialNumber: 042051000386` is a statement about **a physical object in the world** that did not make this picture. The first is a description; the second is a fabricated evidentiary claim. Same reasoning for `DateTimeOriginal`: on a synthetic image there is no "moment when the original image was taken". Record the generation time in the run/lineage record, whose semantics are unambiguous.

```bash
exiftool -EXIF:FocalLength=85 -EXIF:FNumber=1.8 -EXIF:ExposureTime=1/250 \
  -EXIF:ISO=200 -EXIF:ColorSpace=1 -EXIF:Orientation=1 \
  -EXIF:Software="gemini-3-pro-image via Replicate + exiftool 13.59" \
  -XMP-dc:creator="Jane Smith" -XMP-dc:rights="Copyright Jane Smith 2026" \
  -XMP-iptcExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia" \
  -overwrite_original -P generated.jpg
```

**Never, on a Case B output:** `-EXIF:BodySerialNumber=`, `-EXIF:LensSerialNumber=`, `-GPS:GPSLatitude=`, `-GPS:GPSLongitude=`, `DateTimeOriginal`, `CreateDate`, or `-tagsFromFile someOtherPhoto.CR3 -all:all`. That last one is the whole rule in a single argument.

`Make` and `Model` on a Case B output are borderline: they name a physical body that did not take the picture. Either omit them, or use them only as declared scene-style descriptors paired with an unmistakable synthetic `DigitalSourceType`. Never copy or claim to recover them from a visual reference. When in doubt, omit.

---

## 4. CASE C: publish-time privacy strip

**Definition:** the image is already correct. This is delivery. Remove GPS, serials and personal identifiers while preserving technical, authorship and rights data.

**This is normal professional practice, fully supported, and not evasion.** Photographers strip GPS to protect subjects' home addresses, nest sites of protected birds, rare plant populations, archaeological sites, journalistic sources, and their own movement patterns. They strip serials because `BodySerialNumber` links every photo they have ever published to the same physical body, de-anonymising pseudonymous accounts and exposing equipment inventory to thieves [distilled-metadata-and-provenance.md].

**Principle: allow-list, never deny-list.** "Strip everything, then add back only what you intend to publish. A deny-list misses the tag you did not know existed."

```bash
exiftool -all= -tagsFromFile @ \
  -EXIF:DateTimeOriginal -EXIF:Make -EXIF:Model \
  -EXIF:FNumber -EXIF:ExposureTime -EXIF:ISO -EXIF:FocalLength \
  -EXIF:Orientation -EXIF:ColorSpace -ICC_Profile \
  -XMP-dc:Creator -XMP-dc:Rights \
  -overwrite_original -P photo.jpg
```

| Kept (technical plus authorship) | Removed (location plus identifiers) |
|---|---|
| `DateTimeOriginal`, `Make`, `Model`, `FNumber`, `ExposureTime`, `ISO`, `FocalLength`, `Orientation`, `ColorSpace`, `ICC_Profile`, `XMP-dc:Creator`, `XMP-dc:Rights` | Everything else: the entire GPS IFD, `BodySerialNumber`, `LensSerialNumber`, all MakerNotes (and therefore `ShutterCount`), `Software`, person keywords and face regions, `XMP-crs:` develop settings, embedded thumbnails |

`@` is a special SRCFILE meaning **the destination file itself**, which is what makes strip-then-restore work in one pass. It works per-file in batch and recursive runs.

To carry provenance through the strip, append the assignment **after** the allow-list (assignments apply left to right, so a later assignment is not wiped by the earlier `-all=`):

```bash
  ... -XMP-dc:Rights \
  -XMP-iptcExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture" \
  -overwrite_original -P photo.jpg
```

This extension is flagged **INFERRED and untested against a real file** in the source. Verify with `exiftool -a -G1 -s` before relying on it.

**GPS: delete the whole group.** Latitude and longitude are stored as **unsigned** rational triples; the hemisphere lives in **separate reference tags** (`GPSLatitudeRef` N/S, `GPSLongitudeRef` E/W). Deleting only the coordinates and leaving the refs, or vice versa, leaves an inconsistent partially-identifying record. Always `exiftool -GPS:all= -overwrite_original -P photo.jpg`. Note `GPSDateStamp` plus `GPSTimeStamp` are **UTC**, so they leak the true absolute time even if `DateTimeOriginal` was altered; `Composite:GPSPosition` is derived by ExifTool and not stored in the file.

**Supporting rules.** Never edit the delivery file in place from the master: keep an unstripped archival master with full GPS and serials for your own catalogue, strip only the export copy. Verify, do not trust the checkbox: Lightroom's "Remove Person Info" has had versions where it did not work. Stripping is not reversible. Do not rely on platforms: Instagram, Facebook and X were empirically shown to strip aggressively, but coverage is inconsistent, many platforms are untested, self-hosted sites strip nothing, and the same aggressive stripping destroys your deliberately-authored provenance and embedded C2PA manifests.

---

## 5. exiftool syntax reference

**The `-all=` ordering rule.** ExifTool applies assignments **left to right**, so any `--GROUP:all` exclusion or `-tagsFromFile` re-copy must come **after** the delete, otherwise the delete wipes what you just restored.

```bash
exiftool -all= -tagsFromFile @ -icc_profile image.jpg   # RIGHT
exiftool -tagsFromFile @ -icc_profile -all= image.jpg   # WRONG, the delete wins
```

**The keep-ICC idiom.** Two non-equivalent variants appear in the sources; both are documented and they do different things.

```bash
# variant A (application docs): restore ICC after the delete
exiftool -all= -tagsfromfile @ -icc_profile image.jpg

# variant B (FAQ): exclude ICC from the delete AND restore colour-space tags.
# This is the web-export recommendation. Prefer it for delivery files.
exiftool -ext jpg -all= --icc_profile:all -tagsfromfile @ -colorspacetags DIR

# repair corrupted EXIF by round-tripping through ExifTool's own writer
exiftool -all= -tagsfromfile @ -all:all -unsafe -icc_profile bad.jpg
```

Dropping the ICC profile **and** the `ColorSpace` tag makes images render with wrong colour. `-unsafe` is required to copy tags ExifTool considers unsafe to write blindly, such as `ThumbnailImage` and some offsets. **TIFF/RAW caveat:** `-exif:all=` does **not** fully strip EXIF from TIFF-based files including most RAW, because the image data itself lives in IFD0; only the ExifIFD subdirectory is removed.

**The redirection quoting gotcha.**

| WRONG | RIGHT | Why |
|---|---|---|
| `exiftool "-EXIF:Artist<-XMP:Creator"` | `exiftool "-EXIF:Artist<XMP:Creator"` | **A minus sign after the `<` makes it a deletion, not a copy** |
| `exiftool "-comment<$filename"` | `exiftool "-comment<filename"` | No `$` prefix is needed when the whole value is one tag |
| `exiftool "-time:all<datetimeoriginal"` | `exiftool "-time:all<$datetimeoriginal"` | **The `$` is mandatory here.** Without it this does NOT copy to all Time tags |

**The rule:** `-DST<SRC` copies tag to tag. `-DST<$SRC ...` treats the right side as a **string template** with `$TAG` interpolation, **required** when the destination is a **wildcard group** (like `time:all`) or when concatenating literal text with tag values. `-DSTTAG<SRCTAG` and `-SRCTAG>DSTTAG` are equivalent forms.

**Quoting.** Redirection arguments contain `<` and `>`, which the shell reads as file redirection. **Always quote them.** On Unix use **single quotes** when ExifTool's own `$TAG` interpolation must be preserved (double quotes let the shell interpolate first). On Windows use double quotes (cmd.exe has no single quotes) and double the `%` in batch files (`%%e`).

**File handling.**

| Option | Behaviour |
|---|---|
| `-overwrite_original` | Overwrite the source instead of leaving a backup. By default originals are preserved with `_original` appended; this deletes that backup |
| `-overwrite_original_in_place` | Writes through the existing inode, preserving file attributes (xattrs, hard links, ACLs). Slower. Use when attributes matter |
| **`-P` / `-preserve`** | **Preserves the filesystem modification date/time.** Without `-P`, writing metadata updates the file's mtime to now |

Use **both** `-overwrite_original -P` on every write in this guide. Without `-P` you silently destroy the filesystem timeline of your own archive.

**`-@ ARGFILE`** reads command-line arguments from a file, **one argument per line**. It is the reliable way to pass values containing spaces, newlines, quotes, or non-ASCII, and to keep long metadata templates under version control. `-@ -` reads from stdin. Lines beginning with `#` are comments (`#[CSTR]` enables C-string escapes); blank lines are ignored. **`-@` does NOT shell-split lines**, so `-Artist=Jane Doe` on one line is a single argument and **no quoting is needed or wanted**; adding quotes would make them part of the value. It "sidesteps all shell quoting entirely."

```
# case-b-generated.args   ->   exiftool -@ case-b-generated.args generated.jpg
-EXIF:FocalLength=85
-EXIF:FNumber=1.8
-XMP-dc:creator=Jane Smith
-XMP-iptcExt:DigitalSourceType=http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia
-overwrite_original
-P
```

**Auditing:** `exiftool -a -G1 -s image.jpg`. `-a` allows duplicates, `-G1` prints family-1 group names, `-s` prints tag names not descriptions. **`exiftool -exif:all image.jpg` is wrong for auditing**: duplicates are suppressed by default and a value in a second location is silently missed. Never let the shell glob (`exiftool -exif:all *.*`); use `exiftool -ext jpg -r .`. Never loop the shell over files; one invocation over a tree beats N invocations because Perl startup dominates cost.

---

## 6. The real-camera tag set

**Writing a tag to the wrong IFD is a common failure**, so the group column is load-bearing.

### 6.1 Tier A: near-universal, every genuine body writes these

| Tag | ID | Group | Format | Notes |
|---|---|---|---|---|
| `Make` | 0x010f | IFD0 | string | Changing it **destroys MakerNotes** |
| `Model` | 0x0110 | IFD0 | string | Changing it **destroys MakerNotes** |
| `FocalLength` | 0x920a | ExifIFD | rational64u | |
| `FNumber` | 0x829d | ExifIFD | rational64u | |
| `ExposureTime` | 0x829a | ExifIFD | rational64u | |
| `ISO` | 0x8827 | ExifIFD | int16u[n] | Max 65535; cameras exceeding it use `ISOSpeed` (0x8833) |
| `ExposureProgram` | 0x8822 | ExifIFD | int16u | 1 Manual, 2 Program AE, 3 Aperture-priority, 4 Shutter priority, 7 Portrait, 8 Landscape |
| `MeteringMode` | 0x9207 | ExifIFD | int16u | 1 Average, 2 Center-weighted, 3 Spot, 5 Multi-segment, 6 Partial |
| `WhiteBalance` | 0xa403 | ExifIFD | int16u | **Only `0 = Auto` / `1 = Manual` at EXIF level.** Richer detail is MakerNotes |
| `Flash` | 0x9209 | ExifIFD | int16u | Bit-field. **Present even when no flash fired** (`0x0`, `0x10`, `0x20`) |
| `ColorSpace` | 0xa001 | ExifIFD | int16u | Almost always `1` (sRGB) |
| `Orientation` | 0x0112 | IFD0 | int16u | **1, 6 and 8 cover virtually all camera output.** 2/4/5/7 essentially never occur |
| `DateTimeOriginal` | 0x9003 | ExifIFD | string | The shutter release |
| `CreateDate` | 0x9004 | ExifIFD | string | Called DateTimeDigitized by the spec |
| `ModifyDate` | 0x0132 | IFD0 | string | Called DateTime by the spec |
| `Software` | 0x0131 | IFD0 | string | Firmware out of camera; editor name after editing |
| `Artist` / `Copyright` | 0x013b / 0x8298 | IFD0 | string | Attribution. Copyright "may contain photographer and editor notices", NULL-separated |

All three dates are **usually identical out of camera**; the `AllDates` shortcut writes all three. Date/time strings are `YYYY:MM:DD HH:MM:SS`, **colons in the date**.

### 6.2 Tier B: body and lens specific, always treat as optional

| Tag | ID | Group | When present / absent |
|---|---|---|---|
| `LensModel` | 0xa434 | ExifIFD | Most ILC bodies from ~2012 with electronic lenses. **Absent** with manual/adapted lenses, many compacts, older bodies |
| `LensInfo` | 0xa432 | ExifIFD | 4 rationals: min focal, max focal, min f-number at min focal, min f-number at max focal. **Many Canon bodies omit it while writing LensModel.** A prime writes the same focal twice |
| `LensMake` | 0xa433 | ExifIFD | Lens manufacturer |
| `FocalLengthIn35mmFormat` | 0xa405 | ExifIFD | Common on crop and compacts, **frequently absent on full-frame** where redundant |
| `SubSecTimeOriginal` | 0x9291 | ExifIFD | **A string of digits after the decimal point**: `"47"` means .47 s, not a count. Most modern ILCs; absent on older and entry-level bodies. Disambiguates burst frames |
| **`BodySerialNumber`** | 0xa431 | ExifIFD | Nikon, Sony, Fujifilm, Pentax, recent Canon. **Historically absent on many Canon models**, which use `MakerNotes:SerialNumber` |
| **`LensSerialNumber`** | 0xa435 | ExifIFD | Much rarer. Nikon and Sony on many native lenses. Often absent or a placeholder string of zeros |
| `CameraSerialNumber` | 0xc62f | IFD0 | DNG-era tag, **distinct from** BodySerialNumber |
| `OffsetTimeOriginal` | 0x9011 | ExifIFD | **Added in EXIF 2.31 (2016). Absent on anything older**, and still not written by all current bodies unless a timezone is set in-camera. "The single most commonly missing modern tag" |
| `ShutterSpeedValue` / `ApertureValue` | 0x9201 / 0x9202 | ExifIFD | APEX encodings |
| `ExposureCompensation` / `ExposureMode` / `SceneCaptureType` | 0x9204 / 0xa402 / 0xa406 | ExifIFD | |

### 6.3 Tier C: MakerNotes only

`ShutterCount` is **not a standard EXIF tag at all.** It exists only in vendor MakerNotes, named differently per brand, and not at all for some brands.

| Brand | Availability | ExifTool tag |
|---|---|---|
| Nikon / Sony / Pentax | Yes, MakerNotes | `ShutterCount` |
| Fujifilm | Yes, named differently | `ImageCount` |
| **Canon** | **No.** Requires a tethered USB utility | n/a |
| Olympus / Panasonic | No, in-camera service or maintenance mode | n/a |
| Leica | **Unconfirmed** | n/a |

Also MakerNotes-only: focus point / AF area, drive mode, lens firmware, in-body stabilisation state, internal temperature, battery state, burst shot number, and all richer white-balance detail (Kelvin, fine tuning; after raw processing these land in `XMP-crs:Temperature` / `XMP-crs:Tint`). Availability is strongest in **RAW straight from the camera**; **any export through Lightroom or Photoshop typically drops MakerNotes**, taking `ShutterCount` with it.

**Composite tags are not real tags.** `Composite:LensID`, `Composite:ImageSize`, `Composite:ScaleFactor35efl`, `Composite:CircleOfConfusion`, `Composite:HyperfocalDistance`, `Composite:FOV`, `Composite:GPSPosition`, `Composite:ShutterSpeed`, `Composite:Aperture` are **calculated by ExifTool from other tags, not read from the file**, and are not writable directly. **A JSON dump will therefore show tags that do not physically exist in the file.**

**Practical rule.** If a tag must be reliable across bodies, restrict to **Tier A**. Tier B and C are optional; code must tolerate absence rather than assume presence. On Case B output, a Tier B or C tag is a strong tell: a generated image carrying `ShutterCount` is claiming a mechanical history that does not exist.

---

## 7. IPTC DigitalSourceType

| Item | Value |
|---|---|
| **ExifTool tag path** | **`XMP-iptcExt:DigitalSourceType`** |
| XMP namespace URI | `http://iptc.org/std/Iptc4xmpExt/2008-02-29/` (retains the historical date, does not change with spec versions) |
| Data type | Closed choice of Text, a single URI string |
| **Cardinality** | **0..1. Single value, NOT a list** |
| Scheme URI | `http://cv.iptc.org/newscodes/digitalsourcetype/` |
| IIM equivalent / Exif equivalent | **none / none** |

**Because there is no IIM or EXIF equivalent, DigitalSourceType exists ONLY in the XMP packet (or in a C2PA manifest as an IPTC assertion). Stripping XMP removes it entirely. There is no EXIF fallback location** [distilled-metadata-and-provenance.md]. It is **not** in the PLUS namespace, which holds licensing properties like `plus:Licensor`. Spec version: IPTC Photo Metadata Standard **2025.1 (revision 1)**, released 26 November 2025.

### 7.1 Decision table: production situation to exact URI

All URIs prefix `http://cv.iptc.org/newscodes/digitalsourcetype/`.

| Your production situation | Concept key | Case |
|---|---|---|
| Ordinary photograph taken with a camera | **`digitalCapture`** | A / C |
| Smartphone computational photography, in-camera HDR or night-mode stacking | **`computationalCapture`** | A |
| Scanned film negative | **`negativeFilm`** | A |
| Scanned slide or transparency | **`positiveFilm`** | A |
| Scanned photographic print | **`print`** | A |
| Photo edited in Lightroom or Photoshop, non-generative | **`humanEdits`** | A |
| Denoise or sharpen only, algorithmic, no content change | **`algorithmicallyEnhanced`** | A |
| Digital painting or illustration, non-generative tools | **`digitalCreation`** | B |
| Data visualisation | **`dataDrivenMedia`** | B |
| **Fully AI-generated image** (gpt-image-2, Nano Banana Pro, Midjourney, Firefly, SD) | **`trainedAlgorithmicMedia`** | **B** |
| **Generative fill / expand / inpainting applied to a real photo** | **`compositeWithTrainedAlgorithmicMedia`** | A or B, see note |
| Algorithmic without training data: fractals, procedural rendering | **`algorithmicMedia`** | B |
| Screenshot | **`screenCapture`** | B |
| Live recording of a virtual event with generative and/or captured elements | **`virtualRecording`** | B |
| Unspecified composite, any element may or may not be generative | **`composite`** | B |
| **Composite of elements that are ALL real captures** (multi-exposure blend) | **`compositeCapture`** | B |
| **Mixed real plus generative composite** | **`compositeSynthetic`** | **B** |

**Note on `compositeWithTrainedAlgorithmicMedia`:** whether the output is Case A or Case B depends on the section 1 classifier, not on this tag. If it still derives from one named source frame and the generative work is localized, treat it as **Case A** with this DigitalSourceType. If the generative work has replaced the scene, it is **Case B** and inherited capture EXIF must be dropped.

### 7.2 RETIRED values: do NOT write these into new files

| Retired concept | Retirement date | Superseded by |
|---|---|---|
| `minorHumanEdits` | **2024-09-17** | `humanEdits` |
| `digitalArt` | **2024-09-17** | `digitalCreation` |
| `softwareImage` | **2022-06-14** | a more specific term, usually `digitalCreation` or `screenCapture` |

Retired URIs remain resolvable for backwards compatibility with files already in the wild, but **new writes must use the superseding term**.

### 7.3 FLAG: the http versus https scheme inconsistency

A real inconsistency inside IPTC's own materials [distilled-metadata-and-provenance.md]:

| Position | Scheme | Where |
|---|---|---|
| Canonical scheme declaration | **`http://`** | The CV site publishes `http://cv.iptc.org/newscodes/digitalsourcetype/` and says the `http://` form "is the literal value that goes into the metadata field. Do not upgrade it to https when writing" |
| IPTC's own ExifTool examples | **`https://`** | `exiftool -XMP-iptcExt:digitalsourcetype=https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia test-image.jpg` |

**Matching rule: consumers should match on the path suffix, not on the scheme.** Both forms exist in the wild. When writing new files, `http://` matches the canonical declaration and `https://` matches IPTC's published example code. **Pick one and be consistent. Do not assume a reader will normalise.** This guide uses `http://` throughout. IPTC has not resolved this itself.

### 7.4 FLAG: C2PA's digitalsourcetype namespace is a DIFFERENT vocabulary

C2PA reuses the IPTC NewsCodes as its **primary** vocabulary, carried as an IPTC assertion in the manifest, but it **additionally defines its own extension URIs under its own namespace**: `http://c2pa.org/digitalsourcetype/trainedAlgorithmicData` and `http://c2pa.org/digitalsourcetype/empty`.

**These are C2PA-specific and are NOT IPTC NewsCodes.** Do not confuse `c2pa.org/digitalsourcetype/trainedAlgorithmicData` with `cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`: **different namespace, different term ("Data" versus "Media").** Writing the C2PA URI into `XMP-iptcExt:DigitalSourceType` is wrong.

### 7.5 The rights block Google Image Search reads

Google reads `dc:creator`, `photoshop:Credit`, `dc:rights`, `xmpRights:WebStatement`, `plus:LicensorURL`, `Iptc4xmpExt:DigitalSourceType`.

```bash
exiftool -XMP-dc:creator="Jane Smith" -XMP-photoshop:Credit="Smith Photography Ltd" \
  -XMP-dc:rights="Copyright Smith Photography Ltd 2026" \
  -XMP-xmpRights:WebStatement="http://smithphotography.com/licensing/" \
  -XMP-plus:LicensorURL="http://www.mypictureagency.com/obtain-licence/" \
  -XMP-iptcExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture" \
  -overwrite_original -P photo.jpg
```

---

## 8. Internal EXIF consistency rules

A Case B output must not be **self-contradicting**. The numbers describe the picture, so the picture and the numbers have to agree. A viewer who reads `f/16` on an image with a fully dissolved background has caught you writing fiction into a technical field.

| EXIF value | Must match the depicted | Coherent | Incoherent (a tell) |
|---|---|---|---|
| **`ExposureTime`** | **implied motion blur** | 1/1000 with a frozen wingbeat; 1/15 with smeared traffic lights; 1/60 with slight hand-shake softness | 1/2000 with visibly smeared water; 1/4 with a tack-sharp handheld portrait and no tripod cue |
| **`ISO`** | **implied light level and noise** | ISO 100 in bright daylight, clean shadows; ISO 6400 in a dim bar with visible luminance noise in the shadows | ISO 12800 with glassy noise-free shadows; ISO 64 in a candlelit interior at 1/250 |
| **`FNumber`** | **implied depth of field** | f/1.4 with a background dissolved to smooth bokeh and a razor-thin plane at the near eye; f/11 with foreground and distant hills both resolved | f/16 with a fully blurred background; f/1.2 with everything from 1m to infinity sharp |
| **`FocalLength`** | **implied perspective** | 24mm with strong foreground-to-background size falloff and converging verticals; 200mm with compressed layers and a subject flat against the background | 200mm with wide-angle facial distortion; 16mm on a head-and-shoulders portrait with no perspective exaggeration |
| **`Flash`** | **implied light source** | `0x0` / `0x10` on available-light work; `0x9` with a hard specular catchlight and fast falloff shadow behind the subject | `0x9` (fired) on a soft north-window portrait with no flash signature |
| **`WhiteBalance`** | remember it is Auto/Manual only at EXIF level | Either value is defensible | Writing a Kelvin value into `EXIF:WhiteBalance`. That field has two states |
| **`ColorSpace`** / **`Orientation`** | the embedded profile and the delivered pixel orientation | `1` (sRGB) with an sRGB ICC profile; `1` on an already-upright file | `1` with an AdobeRGB profile embedded; `6` on a file whose pixels are already rotated, which double-rotates in viewers |

**The exposure triangle must also close on itself.** The three values are not independent. Read them together and ask whether that combination is a correct exposure **for the light the image depicts**.

| Depicted light | Plausible set |
|---|---|
| Open sunlight | ISO 100, f/8, 1/500 (the "sunny 16" family: ISO 100, f/16, 1/125) |
| Overcast outdoors | ISO 200 to 400, f/4, 1/250 |
| Bright window interior | ISO 400, f/2.8, 1/125 |
| Dim interior, available light | ISO 3200, f/1.8, 1/60 |
| Night street, available light | ISO 6400, f/1.4, 1/60 |

`ISO 100, f/1.4, 1/8000` in a dim bar is roughly ten stops of nonsense. If you cannot reason about the stops, take a row from the table and describe the scene to match, rather than inventing numbers.

**Cross-checks against the rest of the file.** `FocalLength` must fall inside `LensInfo`'s focal range if you wrote `LensInfo` (a prime writes the same focal twice). `FNumber` must not be wider than the lens's minimum f-number in `LensInfo`. `FocalLengthIn35mmFormat`, if written, must be consistent with `FocalLength` and the implied sensor size (omit rather than guess). `DateTimeOriginal`, `CreateDate` and `ModifyDate` are usually identical out of camera, so three wildly divergent values on a "straight out of camera" claim is a tell. `Software` must name the tool that actually touched the file.

**When you cannot make a value coherent, omit the tag.** An absent tag is honest. A wrong tag is a false statement embedded in the file.

---

## 9. SynthID versus C2PA

Two technologies in two domains. Complements, not alternatives.

| | **C2PA / Content Credentials** | **SynthID** |
|---|---|---|
| Domain | **Container domain.** A cryptographically signed manifest embedded in the file using JUMBF (ISO/IEC 19566-5:2023) | **Pixel domain.** An invisible watermark modifying pixel values imperceptibly, detectable by a trained classifier. Added the moment content is created |
| What it tells you | **Who says what about an asset's history**, verifiably: creator identity, creation method, edit history, ingredients | Only that the content **came from a SynthID-enabled generator.** It "cannot tell you who created it, when, what edits were applied" |
| Durability | **Fragile** | **Robust.** "Designed to stand up to modifications like cropping, adding filters, changing frame rates, or lossy compression" |
| Binding | **Hard binding**: cryptographic hashes, for tamper detection and integrity verification. Bits must match | **Soft binding**: for identity matching, **not** integrity verification. Matches derived assets even when the bits differ |

**What survives a metadata strip:**

| Operation | C2PA manifest | SynthID |
|---|---|---|
| `exiftool -all=` or any re-save that drops XMP | **Removed** | **Intact and detectable** |
| Screenshot | Gone | Survives |
| Social-platform upload / transcode | Stripped | Survives |
| JPEG recompression, resize, recolor, minor crop, colour grading | Typically lost (container rewrite) | Survives |
| Many successive alterations | Gone | "chance that after many alterations the watermark won't be detected" |

**Consequences you must act on.**

- **Your Case C privacy strip destroys C2PA.** `exiftool -all=` removes the embedded JUMBF manifest with everything else. If provenance matters on the delivery file, either exclude the manifest from the strip or re-sign afterwards with c2patool, and **say which you did**.
- **Your Case C privacy strip does not touch SynthID**, and there is **no supported way to remove SynthID**. A generated image stays detectable as generated regardless of what you do to the metadata.
- **C2PA is tamper-evident, not tamper-proof**: "the signature proves that the signed bytes have or have not changed; it does not prevent anyone from removing the manifest entirely." **Absence of a Content Credential means nothing**; it does not indicate a real photograph, it usually indicates a platform re-encode.
- **Duplicate what matters into the manifest.** C2PA guidance: asset metadata values supported by the common metadata assertion "should be copied into such an assertion and included in the C2PA Manifest", so they survive and are attributable. **Recovery after a strip is not guaranteed**: durable Content Credentials use soft bindings plus a repository lookup, but that "depends on the manifest actually being present in a queried repository, and on the watermark surviving the transformation applied. Neither is guaranteed."
- **Photoshop's credential is sticky within a session.** Applying Generative Fill adds Content Credentials and the record reportedly **persists after undo**. If a clean provenance record matters, run generative experiments in a separate document rather than undoing them in the delivery file. (User-reported, not vendor-confirmed.)

Verification surfaces: `openai.com/verify`; the Gemini app and the SynthID Detector portal; C2PA and SynthID detection in Google Search and Chrome after Google I/O 2026; `c2patool file.jpg` locally.

---

## 10. Regulatory state as of 2026-08-17

Be accurate and non-alarmist. Do not overstate obligations, and do not use the law as a scare tactic to push metadata practice that is really just good craft.

### 10.1 EU AI Act, Article 50: IN FORCE

Regulation (EU) 2024/1689, published 12 July 2024. **Chapter IV, containing Article 50, applies from 2 August 2026**, fifteen days before this document's research date. It is in force now.

**The provider versus deployer distinction is the whole thing.**

| Paragraph | Who it binds | What it requires |
|---|---|---|
| **50(2)** | **PROVIDERS** of AI systems (including general-purpose systems) generating synthetic audio, image, video or text | Ensure outputs are **marked in a machine-readable format and detectable as artificially generated or manipulated**. Solutions must be "effective, interoperable, robust and reliable as far as this is technically feasible". **Exempt:** systems performing an assistive function for standard editing, or not substantially altering the input data or its semantics; and law-enforcement systems authorised by law |
| **50(4)** | **DEPLOYERS** of an AI system generating or manipulating image, audio or video constituting a **deepfake** | **Disclose that the content has been artificially generated or manipulated.** **Artistic carve-out:** where the content forms part of an "evidently artistic, creative, satirical, fictional or analogous work or programme", the obligation is limited to disclosing the existence of generated content "in an appropriate manner that does not hamper the display or enjoyment of the work" |
| 50(5) | both | Disclosure must be **clear and distinguishable, at the latest at the time of first interaction or exposure**, conforming to accessibility requirements |

**Provider** means the model or tool vendor (OpenAI, Google). **Deployer** means whoever uses the system to produce and publish content. The 50(2) marking obligation attaches **at generation time, to the vendor, not to you.** C2PA Content Credentials and IPTC DigitalSourceType in XMP are the two mechanisms the industry is using to satisfy "machine-readable format".

For image work: **a photograph made with a camera is not in scope of Art. 50(2) or 50(4) at all**; **there is no EU legal obligation to mark a real photograph as real**, so writing `digitalCapture` is **voluntary good practice, not compliance**; and "assistive function for standard editing" is the exemption ordinary retouching relies on, while **generative fill that substantially alters semantics does not clearly fall within it**.

### 10.2 California SB 942 as amended by AB 853

**SB 942 (2024)**, the California AI Transparency Act, codified at Business and Professions Code Chapter 25, Sections 22757 et seq. **AB 853 (2025)**, chaptered 13 October 2025 (Chapter 674, Statutes of 2025), delayed the operative date and added new duty-holders.

| Date | Who | What |
|---|---|---|
| ~~1 January 2026~~ | covered providers | Original operative date, **superseded and delayed by AB 853** |
| **2 August 2026** | **Covered providers (GenAI developers)** | **IN FORCE now.** Free AI detection tool; manifest disclosure (a visible label option); **latent disclosure**, meaning embedded provenance data, "when technically feasible and reasonable" |
| **1 January 2027** | **Large online platforms** | Must detect provenance data compliant with widely adopted standards (**the hook that pulls in C2PA**), let users inspect it, and **must not knowingly strip compliant provenance data or digital signatures** |
| **1 January 2027** | GenAI system hosting platforms | May not knowingly host non-compliant GenAI systems |
| **1 January 2028** | Capture device manufacturers | Must offer users the **option** to include latent disclosures, for devices first produced for sale in California on or after that date |

**Covered provider** = an entity that creates, codes, or otherwise produces a generative AI system that (1) has **over 1,000,000 monthly visitors or users** AND (2) is publicly accessible in California. Pending SB 1000 would remove the user-count threshold; **it is not enacted**. Penalties are **$5,000 per violation**, each day a discrete violation, so exposure compounds daily. That applies to the duty-holders above, not to photographers. Unresolved in the sources: whether **default-on** embedding is required for capture devices from 2028, or only an option to include. Note 2 August 2026 is the same day EU AI Act Article 50 became applicable.

### 10.3 WARNING: AB 3211 never became law

**AB 3211 (2023 to 2024), California Digital Content Provenance Standards (Wicks)** would have added Chapter 41 (commencing with Section 22949.90) to Division 8 of the Business and Professions Code, proposing far broader mandates including provenance metadata on capture devices and watermarking of generative output.

**Status: DIED. Last action 31 August 2024, "Ordered to inactive file at the request of Senator Gonzalez." It was never enacted.**

**AB 3211 is frequently cited in commentary as if it were law. It is not.** The operative California provenance regime is **SB 942 as amended by AB 853**. If a user, a blog post, or another agent cites AB 3211 as a requirement, correct it.

### 10.4 What these laws require of an individual photographer today

Plainly, on 2026-08-17:

- **Nothing.** None of these laws impose any obligation on an individual photographer to add metadata to a real photograph. There is **no EU legal obligation to mark a real photograph as real**; `digitalCapture` is voluntary good practice. A camera photograph is **not in scope of EU AI Act Art. 50(2) or 50(4) at all.**
- The California duty-holders are **large GenAI developers, hosting platforms, large online platforms, and (from 2028) device manufacturers.** Not photographers.
- The obligations that do exist bite the **provider** at generation time (50(2)) and the **deployer** publishing a **deepfake** (50(4)). A photographer publishing an unmanipulated photograph is neither.

**Where it does reach you:** if you publish AI-generated or AI-manipulated image content constituting a deepfake, **you are the deployer** under 50(4) and you must disclose, subject to the artistic carve-out. The practical development to watch is the **2027 platform anti-stripping duty**, which improves the odds that metadata you deliberately wrote survives publication.

Neither OpenAI nor Google has an explicit anti-stripping clause in their terms, and **routine EXIF stripping for privacy is not itself a policy breach**. **Presenting a generated image as a human-shot photograph in order to deceive is squarely prohibited by both**, and by 50(4) where it applies. Use `DigitalSourceType` to positively disclose rather than relying on absence.

Verification caveat: EUR-Lex and leginfo.legislature.ca.gov were partially inaccessible during research, so substantive text came from republished consolidated sources and compliance trackers. **Verify verbatim statutory wording before relying on it in a legal context.**

---

## 11. Version note

| Machine | exiftool version |
|---|---|
| Reference / target user machine | **13.59** |
| Development container where these patterns were exercised | **12.76** |

**No version-gated syntax difference is known for any pattern in this guide.** Every option used here (`-a`, `-G1`, `-s`, `-tagsFromFile`, `-all=`, `-all:all`, `-overwrite_original`, `-P`, `-r`, `-ext`, `-json`, `-@`, `-if`, `-execute`, `-struct`, `-api`, `-unsafe`, `-F`) appears in the canonical man page with no version qualifier [distilled-metadata-and-provenance.md]. Commands written against 12.76 should run unchanged on 13.59; the practical 12.x to 13.x delta is new camera and format support and new tag tables, not CLI grammar. That is **inferred, not attested by any source**. Verify empirically (`exiftool -ver`) rather than assuming.

---

## 12. Pre-flight checklist

```
[ ] Classified the output: Case A, Case B, or Case C. Stated which.
[ ] Case A: capture-backed preflight returned READY for the exact registered,
    checksum-verified source; logged its SHA-256 and file identity to lineage.
[ ] Case A: asked about GPS retention rather than assuming.
[ ] Case B: wrote NO borrowed serial, GPS, or capture timestamp. Checked, not assumed.
[ ] Case B: ran the section 8 coherence table against the actual image.
[ ] DigitalSourceType set from the 7.1 table, not from memory; not a retired value;
    scheme (http vs https) consistent across the delivery set; not a c2pa.org URI.
[ ] -all= comes first; -tagsFromFile and later assignments come after.
[ ] -overwrite_original and -P are both present.
[ ] Redirections quoted; wildcard-group destinations use $TAG.
[ ] Verified after writing:  exiftool -a -G1 -s output.jpg
[ ] Said out loud what happened to any C2PA manifest.
```

All facts in this guide are sourced from [distilled-metadata-and-provenance.md], researched 2026-08-17.
