# Distilled: Metadata and Provenance
Operational reference. Every claim carries a `[raw/...]` citation to the stage-2 research file it came from. Anything not in a raw file is marked **INFERRED**. Conflicts are stated both ways.

Source files distilled (16): `meta--c2pa--adobe-content-credentials-photoshop.md`, `meta--c2pa--c2patool-cli.md`, `meta--c2pa--content-authenticity-initiative.md`, `meta--c2pa--technical-specification.md`, `meta--exif-tags--exiftool-exif-tag-reference.md`, `meta--exif-tags--makernotes-and-present-vs-absent.md`, `meta--exiftool--exiftool-org-application-docs.md`, `meta--exiftool--exiftool-org-common-mistakes.md`, `meta--exiftool--exiftool-org-faq.md`, `meta--iptc--digitalsourcetype-newscodes.md`, `meta--iptc--exiftool-command-line-guide.md`, `meta--iptc--photo-metadata-standard-2025-1.md`, `meta--privacy--gps-tags-and-stripping-practice.md`, `meta--privacy--lightroom-export-metadata-retention.md`, `meta--regulation--california-ai-transparency-act-sb942-ab853.md`, `meta--regulation--eu-ai-act-article-50.md`.

---

## 1. ExifTool operational reference
### 1.1 Version situation
| Fact | Value |
|---|---|
| This container | **12.76** (verified by running `exiftool -ver` in this environment) |
| Target user machine | **13.59** (stated in the task brief; not attested by any raw file) |
| Raw-file coverage of version differences | **None.** No raw file records any version-gated syntax change for the patterns below. |

**Verdict: no known syntax difference between 12.76 and 13.59 for any pattern in this document.** Every option documented here (`-a`, `-G1`, `-s`, `-tagsFromFile`, `-all=`, `-all:all`, `-overwrite_original`, `-P`, `-r`, `-ext`, `-json`, `-@`, `-if`, `-execute`, `-struct`, `-api`, `-unsafe`, `-F`) appears in the canonical man page with no version qualifier [raw/meta--exiftool--exiftool-org-application-docs.md]. **INFERRED:** commands written against 12.76 should run unchanged on 13.59; the practical 12.x to 13.x delta is new camera/format support and new tag tables, not CLI grammar. Verify empirically on the target machine rather than assuming; no raw source confirms this.

### 1.2 Reading with groups
| Pattern | Meaning | Cite |
|---|---|---|
| `exiftool -a -G1 -s image.jpg` | The canonical diagnostic read. `-a` allows duplicates, `-G1` prints family-1 group names, `-s` prints tag names not descriptions. | [raw/meta--exiftool--exiftool-org-common-mistakes.md], [raw/meta--exiftool--exiftool-org-faq.md] |
| `exiftool -exif:all image.jpg` | **WRONG for auditing.** Duplicate tags are suppressed by default; values in a second location are silently missed. | [raw/meta--exiftool--exiftool-org-common-mistakes.md] |
| `exiftool -a -exif:all image.jpg` | RIGHT form of the above. | [raw/meta--exiftool--exiftool-org-common-mistakes.md] |
| `-s` / `-s -s` (`-s2`) / `-s -s -s` (`-s3`) | tag names / no column padding / values only. `-S` = `-veryShort` = `-s2`. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-G0:1` | print both family-0 and family-1 group names. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-n` | disable print conversion globally (raw values). `-TAG#` does it for one tag. | [raw/meta--exiftool--exiftool-org-application-docs.md] |

Group families [raw/meta--exiftool--exiftool-org-application-docs.md]:

| Family | Meaning | Examples |
|---|---|---|
| 0 | general location / information type | `EXIF`, `XMP`, `IPTC`, `MakerNotes`, `Composite`, `File`, `ICC_Profile`, `JFIF`, `Photoshop`, `PNG`, `QuickTime` |
| 1 | specific location | `IFD0`, `ExifIFD`, `GPS`, `InteropIFD`, `XMP-dc`, `XMP-exif`, `XMP-plus`, `XMP-photoshop`, `Canon`, `Nikon`, `Sony` |
| 2 | category | `Camera`, `Image`, `Time`, `Author`, `Location`, `Other`, `Document` |
| 3 to 8 | document number, instance, metadata format, structure path | n/a |

Tag prefixing accepts multiple leading groups: `-EXIF:GPS:all`, `-XMP-plus:DigitalSourceType` [raw/meta--exiftool--exiftool-org-application-docs.md]. Tag names are **case-insensitive** on the command line [raw/meta--iptc--exiftool-command-line-guide.md]. Wildcards are permitted in tag names: `?` matches one character, `*` matches many [raw/meta--exiftool--exiftool-org-application-docs.md].

### 1.3 Writing
| Pattern | Meaning | Cite |
|---|---|---|
| `-TAG=VALUE` | write a value. **An empty VALUE deletes the tag.** | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-TAG+=VALUE` / `-TAG-=VALUE` | add/remove list entries (keywords), or arithmetic on date/numeric tags (`-alldates+=1`) | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `--TAG` | exclude the named tag from extraction | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `'-XMP-dc:creator+=New Creator'` | append to a repeatable (list-type) property | [raw/meta--iptc--exiftool-command-line-guide.md] |

Assignments are applied **left to right**; ordering therefore matters [raw/meta--exiftool--exiftool-org-application-docs.md].

### 1.4 `-tagsFromFile`: copying between files
Synopsis: `exiftool [OPTIONS] -tagsFromFile SRCFILE [-[DSTTAG<]SRCTAG...] FILE...` [raw/meta--exiftool--exiftool-org-application-docs.md]

| Form | Behaviour | Cite |
|---|---|---|
| `exiftool -tagsFromFile src.jpg dst.jpg` | With no tag args, **all** writable tags are copied, but into ExifTool's **preferred locations**, preference order **EXIF > IPTC > XMP**. A tag read from XMP in the source may land in EXIF in the destination. | [raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-faq.md] |
| `exiftool -tagsfromfile src.jpg -all:all dst.jpg` | **Group-preserving form.** `-all:all` preserves the original group structure exactly instead of relocating to preferred locations. Use this whenever the destination layout must match the source. | [raw/meta--exiftool--exiftool-org-faq.md] |
| `exiftool -tagsfromfile src.jpg "-xmp:all>exif:all" dst.jpg` | Force a cross-format copy with explicit group redirection. | [raw/meta--exiftool--exiftool-org-faq.md] |
| `-tagsFromFile @` | `@` is a special SRCFILE meaning **the destination file itself**. Essential for strip-then-restore; works per-file in batch/recursive runs. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-tagsfromfile %d%f.xmp -xmp:title -xmp:description` | SRCFILE may carry filename format codes `%d` (dir), `%f` (name without extension), `%e` (extension) to derive the source per destination, e.g. pull each image's own sidecar, or copy RAW to exported JPEG. | [raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-common-mistakes.md] |
| Multiple `-tagsFromFile` in one command | Legal; each applies to the arguments that follow it. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-DSTTAG<SRCTAG` and `-SRCTAG>DSTTAG` | Equivalent redirection forms. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| "SRCFILE may be the same as FILE" | Moves information around within a single file. | [raw/meta--exiftool--exiftool-org-application-docs.md] |

**MakerNotes form, requires `-make -model`:**

```bash
exiftool -tagsfromfile src.jpg -makernotes -make -model dst.jpg
```

MakerNotes can only be copied as a **complete opaque block**; individual MakerNotes tags cannot be copied to another file, and `Make`/`Model` must accompany them because those tags are what select the parser [raw/meta--exiftool--exiftool-org-faq.md]. Corollary: **changing `Make` or `Model` destroys MakerNotes** [raw/meta--exiftool--exiftool-org-faq.md], [raw/meta--exif-tags--exiftool-exif-tag-reference.md]. Third-party editors routinely corrupt MakerNotes offsets, producing `Possibly incorrect maker notes offsets (fix by -340?)`; `-F` (`-fixBase`) attempts auto-correction [raw/meta--exiftool--exiftool-org-faq.md], [raw/meta--exif-tags--makernotes-and-present-vs-absent.md].

### 1.5 Stripping: `-all=` and the ordering rule
```bash
exiftool -all= image.jpg                                  # delete all writable metadata
exiftool -GPS:all= image.jpg                              # delete one group
exiftool -MakerNotes:all= -XMP:all= -IPTC:all= image.jpg  # per-group deletes
```
[raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-faq.md]

**Why `-all=` must come first:** ExifTool applies assignments **left to right**, so any `--GROUP:all` exclusion or `-tagsFromFile` re-copy must come *after* the delete, otherwise the delete wipes what you just restored [raw/meta--exiftool--exiftool-org-application-docs.md].

**Keep-ICC-profile idioms. Two variants appear in the raw sources:**

```bash
# variant A (application docs): exclusion style
exiftool -all= -tagsfromfile @ -icc_profile image.jpg

# variant B (FAQ): exclusion plus colour-space tags, the web-export recommendation
exiftool -ext jpg -all= --icc_profile:all -tagsfromfile @ -colorspacetags DIR
```
[raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-faq.md]

Rationale for keeping them: dropping the ICC profile **and** the `ColorSpace` tag makes images render with wrong colour [raw/meta--exiftool--exiftool-org-faq.md]. Note the two variants are not identical. A restores only `-icc_profile`; B *excludes* ICC from the delete with `--icc_profile:all` **and** restores `-colorspacetags`. Prefer B for web export, which is where the FAQ recommends it.

**Rebuild/repair corrupted EXIF by round-tripping through ExifTool's own writer:**

```bash
exiftool -all= -tagsfromfile @ -all:all -unsafe -icc_profile bad.jpg
```

`-unsafe` is required to copy tags ExifTool considers unsafe to write blindly, such as `ThumbnailImage` and some offsets [raw/meta--exiftool--exiftool-org-faq.md].

**TIFF/RAW caveat:** `-exif:all=` does **not** fully strip EXIF from TIFF-based files (including most RAW formats), because the image data itself lives in IFD0. Only the ExifIFD subdirectory is removed; other IFD0 data is preserved by necessity [raw/meta--exiftool--exiftool-org-faq.md].

### 1.6 Redirection syntax gotchas
| WRONG | RIGHT | Why | Cite |
|---|---|---|---|
| `exiftool "-EXIF:Artist<-XMP:Creator"` | `exiftool "-EXIF:Artist<XMP:Creator"` | **A minus sign after the `<` makes it a deletion, not a copy.** | [raw/meta--exiftool--exiftool-org-common-mistakes.md] |
| `exiftool "-comment<$filename"` | `exiftool "-comment<filename"` | No `$` prefix is needed when the whole value is one tag. | [raw/meta--exiftool--exiftool-org-common-mistakes.md] |
| `exiftool "-time:all<datetimeoriginal"` | `exiftool "-time:all<$datetimeoriginal"` | **The `$` is mandatory here.** Without it, this does NOT copy to all Time tags. | [raw/meta--exiftool--exiftool-org-common-mistakes.md] |

**The rule:** `-DST<SRC` copies tag to tag. `-DST<$SRC ...` treats the right side as a **string template** with `$TAG` interpolation, required when the destination is a **wildcard group** or when concatenating literal text with tag values [raw/meta--exiftool--exiftool-org-common-mistakes.md].

**Quoting** [raw/meta--exiftool--exiftool-org-common-mistakes.md]:

- Redirection arguments contain `<` and `>`, which the shell reads as file redirection. **Always quote them:** `"-EXIF:Artist<XMP:Creator"`.
- Unix: single quotes preserve `$` literally; double quotes let the shell interpolate. For ExifTool's own `$TAG` interpolation prefer **single quotes on Unix**, **double quotes on Windows** (cmd.exe has no single quotes).
- Windows cmd.exe uses `%` for its own variables, so filename format codes must be doubled (`%%e`) inside batch files. Compare the man-page example `-d %Y%m%d.%%e` [raw/meta--exiftool--exiftool-org-application-docs.md].

### 1.7 File handling
| Option | Behaviour | Cite |
|---|---|---|
| `-overwrite_original` | Overwrite the source instead of leaving a backup. "By default the original files are preserved with `_original` appended to their names." Deletes the backup. | [raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-faq.md] |
| `-overwrite_original_in_place` | Writes through the existing inode, preserving file attributes (Mac OS type/creator, extended attributes, hard links, ACLs). Slower; use when attributes matter. | [raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-faq.md] |
| `-P` / `-preserve` | **Preserves the filesystem modification date/time.** Without `-P`, writing metadata updates the file's mtime to now. | [raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-faq.md] |
| `-r` / `-recurse` | Recurse into subdirectories. `-r.` also descends into dot-directories. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-ext EXT` / `--ext EXT` | Process only / skip that extension. `-ext+ EXT` adds to normal types. Multiple `-ext` allowed. `-ext "*"` processes all files. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-o OUTFILE` | Write to a new file rather than modifying the input. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-m` / `-ignoreMinorErrors` | Downgrade minor errors to warnings so the write proceeds. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-q` / `-q -q` | Suppress info / info plus warnings. | [raw/meta--exiftool--exiftool-org-application-docs.md] |

**Never let the shell glob.** `exiftool -exif:all *.*` is wrong: it feeds unsupported types to ExifTool, is case-sensitive on Unix (`*.jpg` misses `.JPG`), does not recurse, and is an argument-length and security hazard. Use `exiftool -ext jpg -r .` instead [raw/meta--exiftool--exiftool-org-common-mistakes.md].

**Never loop the shell over files.** One invocation over a tree beats N invocations, because Perl startup dominates cost. Combine tag operations into a single command for the same reason [raw/meta--exiftool--exiftool-org-common-mistakes.md]. For large batches use `-execute` to split one process into multiple commands, `-common_args` for arguments shared across all `-execute` blocks, and `-stay_open True -@ ARGFILE` for maximum throughput from a wrapper [raw/meta--exiftool--exiftool-org-application-docs.md].

### 1.8 Output formats
| Option | Behaviour | Cite |
|---|---|---|
| `-j` / `-json` | JSON output. `-json` plus `-G` gives group-prefixed keys. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-j=JSONFILE` / `-j+=JSONFILE` | **Imports** a JSON file to *write* metadata. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-csv` / `-csv=CSVFILE` | CSV export/import. First row must contain tag names; the `SourceFile` column identifies the target on import. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-X` / `-xmlFormat` | RDF/XML output. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-b` / `-binary` | Binary output, needed to extract embedded previews, thumbnails, ICC profiles. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-d FMT` | Date/time output format, `strftime` codes. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-w EXT` / `-textOut` | Write console output to per-file text files; format codes `%d %f %e %c`. | [raw/meta--exiftool--exiftool-org-application-docs.md] |
| `-struct` | Keeps XMP struct nesting instead of flattening into `LicensorName`/`LicensorURL` pseudo-tags. **Required** for round-tripping structured properties (Licensor, ArtworkOrObject, PersonInImage with details, LocationCreated) without lossy flattening. | [raw/meta--iptc--exiftool-command-line-guide.md] |

Reference JSON invocations:

```bash
exiftool -r -ext jpg -json DIR > output.json                       # recursive JSON dump
exiftool -G1 -json -XMP-dc:creator test-image.jpg                  # group-prefixed keys
exiftool -G1 -json -struct -XMP-plus:Licensor test-image.jpg       # structured property
```
[raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--iptc--exiftool-command-line-guide.md]

### 1.9 `-@ ARGFILE` and its no-quoting rule
`-@ ARGFILE` reads command-line arguments from a file, **one argument per line** [raw/meta--exiftool--exiftool-org-application-docs.md]:

- The reliable way to pass values containing spaces, newlines, quotes, or non-ASCII characters, and to keep long metadata templates under version control.
- `-@ -` reads arguments from standard input.
- Lines beginning with `#` are comments. A `#[CSTR]` prefix enables C-string escapes. Blank lines are ignored.
- **`-@` does NOT shell-split lines.** `-Artist=Jane Doe` on one line is a single argument, so **no quoting is needed or wanted**; adding quotes would make them part of the value.
- It "sidesteps all shell quoting entirely... Prefer it for anything containing spaces, quotes, newlines, or non-ASCII" [raw/meta--exiftool--exiftool-org-common-mistakes.md].

### 1.10 Conditionals and misc
```bash
exiftool -shutterspeed -if '$make eq "Canon"' dir     # Perl-like expr; $TagName refs; multiple -if are ANDed
exiftool -alldates+=1 -if '$CreateDate ge "2006:04:02"' dir
exiftool -overwrite_original -P "-filename<createdate" -d %Y%m%d.%%e DIR
exiftool -d %Y%m%d "-filename<datetimeoriginal" "-filemodifydate<datetimeoriginal#" -ext jpg -r .
```
[raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-common-mistakes.md]

Other: `-charset [TYPE=]CHARSET` (`UTF8`, `Latin`, `Cyrillic`; sub-types `filename=`, `exif=`, `iptc=`); `-api OPT[=VAL]` (`-api QuickTimeUTC=1`, `-api LargeFileSupport=1`, `-api Compact=all`, `-api StructFormat=JSON`); `-list`, `-listw`, `-listf`, `-listg1`, `-listx`; `-ver`; `-fileOrder TAG`; `-progress` [raw/meta--exiftool--exiftool-org-application-docs.md].

XMP specifics: XMP is **always** UTF-8; ExifTool converts `&  <  >  '  "` to XML entity references when writing XMP; XMP date/time may be partial (`YYYY`, `YYYY:mm`, `YYYY:mm:dd`, or full `YYYY:mm:dd HH:MM:SS` with optional `+HH:MM`, `-HH:MM`, or `Z`) [raw/meta--exiftool--exiftool-org-faq.md].

---

## 2. The real-camera EXIF tag set
Three presence tiers, per [raw/meta--exif-tags--makernotes-and-present-vs-absent.md]. Tag IDs, IFDs and formats per [raw/meta--exif-tags--exiftool-exif-tag-reference.md]. **Writing a tag to the wrong IFD is a common failure**, so the group column is load-bearing.

### 2.1 Tier A: near-universal (every camera writes these)
| Tag | ID | Group | Format | Notes |
|---|---|---|---|---|
| `Make` | 0x010f | IFD0 | string | Manufacturer. Changing it **destroys MakerNotes**. |
| `Model` | 0x0110 | IFD0 | string | Changing it **destroys MakerNotes**. |
| `FocalLength` | 0x920a | ExifIFD | rational64u | |
| `FNumber` | 0x829d | ExifIFD | rational64u | |
| `ExposureTime` | 0x829a | ExifIFD | rational64u | |
| `ISO` | 0x8827 | ExifIFD | int16u[n] | "Has maximum value of 65535"; cameras exceeding it use `ISOSpeed` (0x8833, int32u, EXIF 2.3+) or `RecommendedExposureIndex` |
| `ExposureProgram` | 0x8822 | ExifIFD | int16u | |
| `MeteringMode` | 0x9207 | ExifIFD | int16u | |
| `WhiteBalance` | 0xa403 | ExifIFD | int16u | **Only Auto/Manual at EXIF level**; richer detail is MakerNotes |
| `Flash` | 0x9209 | ExifIFD | int16u | Bit-field. Present even when no flash fired (`0x0`/`0x10`/`0x20`) |
| `ColorSpace` | 0xa001 | ExifIFD | int16u | Almost always `1` (sRGB) |
| `Orientation` | 0x0112 | IFD0 | int16u | 8 rotation/mirror values |
| `DateTimeOriginal` | 0x9003 | ExifIFD | string | "Date/time when original image taken", the shutter release |
| `CreateDate` | 0x9004 | ExifIFD | string | "Called DateTimeDigitized by EXIF spec." |
| `ModifyDate` | 0x0132 | IFD0 | string | "Called DateTime by EXIF spec." |
| `Software` | 0x0131 | IFD0 | string | Firmware version straight out of camera; editor name after editing |

All three dates are "usually identical out of camera" [raw/meta--exif-tags--makernotes-and-present-vs-absent.md]. The `AllDates` shortcut writes `DateTimeOriginal` plus `CreateDate` plus `ModifyDate` together [raw/meta--exif-tags--exiftool-exif-tag-reference.md], [raw/meta--exiftool--exiftool-org-faq.md].

### 2.2 Tier B: body/lens-specific, must be treated as optional
| Tag | ID | Group | Format | When present / absent |
|---|---|---|---|---|
| `LensModel` | 0xa434 | ExifIFD | string | Present on most ILC bodies from ~2012 with electronic lenses. **Absent** with fully manual/adapted lenses, on many compacts, and on older bodies. |
| `LensInfo` | 0xa432 | ExifIFD | rational64u[4] | "4 rational values giving focal and aperture ranges": min focal, max focal, min f-number at min focal, min f-number at max focal. Less consistently written than LensModel; **many Canon bodies omit it while writing LensModel**. A prime writes the same focal twice. |
| `LensMake` | 0xa433 | ExifIFD | string | Lens manufacturer |
| `FocalLengthIn35mmFormat` | 0xa405 | ExifIFD | int16u | Common on crop-sensor and compact cameras; **frequently absent on full-frame bodies** where it would be redundant. Do not assume it exists. |
| `SubSecTime` | 0x9290 | ExifIFD | string | "Fractional seconds for ModifyDate" |
| `SubSecTimeOriginal` | 0x9291 | ExifIFD | string | "Fractional seconds for DateTimeOriginal" |
| `SubSecTimeDigitized` | 0x9292 | ExifIFD | string | "Fractional seconds for CreateDate". SubSec family: written by most modern ILCs (Canon, Nikon, Sony, Fuji), **absent** on many older and entry-level bodies. Needed to disambiguate burst frames shot in the same second. |
| `BodySerialNumber` | 0xa431 | ExifIFD | string | "Called BodySerialNumber by the EXIF spec." Written by Nikon, Sony, Fujifilm, Pentax and recent Canon. **Historically absent on many Canon models**, which put the serial in `MakerNotes:SerialNumber` instead. |
| `LensSerialNumber` | 0xa435 | ExifIFD | string | Much rarer than BodySerialNumber. Nikon and Sony write it for many native lenses; frequently absent or a placeholder string of zeros. |
| `CameraSerialNumber` | 0xc62f | IFD0 | string | DNG-era tag, **distinct from** BodySerialNumber |
| `OffsetTime` | 0x9010 | ExifIFD | string | "Time zone for ModifyDate" |
| `OffsetTimeOriginal` | 0x9011 | ExifIFD | string | "Time zone for DateTimeOriginal" |
| `OffsetTimeDigitized` | 0x9012 | ExifIFD | string | "Time zone for CreateDate". **Added in EXIF 2.31 (2016). Absent on anything older**, and still not written by all current bodies unless a timezone is configured in-camera. "The single most commonly missing 'modern' tag." |
| `ShutterSpeedValue` | 0x9201 | ExifIFD | rational64s | APEX |
| `ApertureValue` | 0x9202 | ExifIFD | rational64u | APEX |
| `ExposureCompensation` | 0x9204 | ExifIFD | rational64s | |
| `ExposureMode` | 0xa402 | ExifIFD | int16u | |
| `DigitalZoomRatio` | 0xa404 | ExifIFD | rational64u | |
| `SceneCaptureType` | 0xa406 | ExifIFD | int16u | "Value of 4 is non-standard, used by Samsung" |

Formats: date/time strings are `YYYY:MM:DD HH:MM:SS` (**colons in the date**). Offsets are `+HH:MM` / `-HH:MM`. **`SubSecTime` is a string of digits representing the fraction after the decimal point**; `"47"` means .47 s, it is **not** an integer count [raw/meta--exif-tags--exiftool-exif-tag-reference.md].

Filesystem dates (`FileModifyDate`, `FileCreateDate`, `FileAccessDate`) are distinct from metadata dates [raw/meta--exiftool--exiftool-org-faq.md].

### 2.3 Tier C: MakerNotes only
| Tag | Reality |
|---|---|
| `ShutterCount` | **Not a standard EXIF tag at all.** Exists only in vendor MakerNotes, under different names per brand, and not at all for some brands. |

| Brand | Availability | ExifTool tag |
|---|---|---|
| Nikon | Yes, MakerNotes | `ShutterCount` |
| Sony | Yes, MakerNotes | `ShutterCount` |
| Pentax | Yes, MakerNotes | `ShutterCount` |
| Fujifilm | Yes, named differently | `ImageCount` |
| **Canon** | **No.** "Most Canon cameras do not embed shutter count information into the EXIF data." Requires a tethered USB utility (ShutterCheck / EOSInfo). | n/a |
| Olympus | No, hidden in-camera service menu | n/a |
| Panasonic | No, maintenance mode | n/a |
| Leica | **Unconfirmed**, not documented in the source consulted | n/a |

```bash
exiftool -ShutterCount NikonFile.NEF
exiftool -ShutterCount SonyFile.ARW
exiftool -ImageCount   FujiFile.RAF
exiftool -ShutterCount PentaxFile.DNG
```
[raw/meta--exif-tags--makernotes-and-present-vs-absent.md]

Availability is strongest in **RAW** straight from the camera. In-camera JPEGs usually retain MakerNotes and therefore ShutterCount, but **any export through Lightroom or Photoshop typically drops MakerNotes**, taking ShutterCount with it [raw/meta--exif-tags--makernotes-and-present-vs-absent.md].

Also vendor-only: focus point / AF area, drive mode, lens firmware, in-body stabilisation state, internal temperature, battery state, shot number in burst, embedded JPEG preview parameters, and all richer white-balance detail. `Canon:WhiteBalance`, `Nikon:WhiteBalance`, `Sony:WhiteBalance` carry preset names ("Daylight", "Shade", "Tungsten"); Kelvin and fine-tuning live in MakerNotes or, after raw processing, in `XMP-crs:Temperature` and `XMP-crs:Tint` [raw/meta--exif-tags--makernotes-and-present-vs-absent.md], [raw/meta--exif-tags--exiftool-exif-tag-reference.md].

MakerNotes manufacturers ExifTool parses: Canon, Nikon, Sony, FujiFilm, Olympus, Panasonic (and Leica, largely via Panasonic tables), Pentax, Ricoh, Sigma, Kyocera, Minolta, Sanyo, Casio, JVC, Samsung, Apple, DJI, GoPro, FLIR, Leaf, Lytro, PhaseOne, Reconyx, InfiRay, Qualcomm [raw/meta--exif-tags--makernotes-and-present-vs-absent.md].

**Practical rule:** if a tag must be reliable across bodies, restrict to Tier A. Tier B and C tags must be treated as **optional**; code must tolerate absence rather than assume presence [raw/meta--exif-tags--makernotes-and-present-vs-absent.md].

### 2.4 Attribution tags
| Tag | ID | Group | Notes |
|---|---|---|---|
| `Artist` | 0x013b | IFD0 | "Becomes list-type when MWG module loaded" |
| `Copyright` | 0x8298 | IFD0 | "May contain photographer and editor notices" (NULL-separated) |
[raw/meta--exif-tags--exiftool-exif-tag-reference.md]

### 2.5 Enumerations (verbatim)
`ExposureProgram` (0x8822): `0 = Not Defined`, `1 = Manual`, `2 = Program AE`, `3 = Aperture-priority AE`, `4 = Shutter speed priority AE`, `5 = Creative (Slow speed)`, `6 = Action (High speed)`, `7 = Portrait`, `8 = Landscape`, `9 = Bulb` (non-standard, Canon).

`MeteringMode` (0x9207): `0 = Unknown`, `1 = Average`, `2 = Center-weighted average`, `3 = Spot`, `4 = Multi-spot`, `5 = Multi-segment`, `6 = Partial`, `255 = Other`.

`ColorSpace` (0xa001): `0x1 = sRGB`, `0x2 = Adobe RGB`, `0xfffd = Wide Gamut RGB`, `0xfffe = ICC Profile`, `0xffff = Uncalibrated`. The overwhelming majority of real camera JPEGs carry `0x1`. `0xffff` is what some cameras write when set to Adobe RGB, with the real space indicated by `InteropIndex` `R03`.

`Orientation` (0x0112): `1 = Horizontal (normal)`, `2 = Mirror horizontal`, `3 = Rotate 180`, `4 = Mirror vertical`, `5 = Mirror horizontal and rotate 270 CW`, `6 = Rotate 90 CW`, `7 = Mirror horizontal and rotate 90 CW`, `8 = Rotate 270 CW`. Real-world distribution: **1, 6 and 8 cover virtually all camera output; 2/4/5/7 essentially never occur from a camera.**

`WhiteBalance` (0xa403): `0 = Auto`, `1 = Manual`. That is the whole standard enumeration.

`Flash` (0x9209) bit-field, common real values: `0x0 = No Flash`, `0x1 = Fired`, `0x5 = Fired, Return not detected`, `0x7 = Fired, Return detected`, `0x8 = On, Did not fire`, `0x9 = On, Fired`, `0x10 = Off, Did not fire`, `0x18 = Off, Did not fire, Return not detected`, `0x20 = No flash function`, `0x41 = Fired, Red-eye reduction`, `0x59 = Auto, Fired`, `0x5d = Auto, Fired, Return not detected`, `0x5f = Auto, Fired, Return detected`. Bit 0 = fired; bits 1-2 = return detection; bits 3-4 = flash mode (compulsory/auto); bit 5 = no flash function; bit 6 = red-eye reduction. All [raw/meta--exif-tags--exiftool-exif-tag-reference.md].

### 2.6 Composite tags are not real tags
`Composite:LensID`, `Composite:ImageSize`, `Composite:Megapixels`, `Composite:ScaleFactor35efl`, `Composite:CircleOfConfusion`, `Composite:HyperfocalDistance`, `Composite:FOV`, `Composite:GPSPosition`, `Composite:SubSecDateTimeOriginal`, `Composite:ShutterSpeed`, `Composite:Aperture` are **calculated by ExifTool from other tags rather than read from the file**. They are **not writable directly**; writing one causes ExifTool to write the underlying real tags. **A JSON dump will therefore show tags that do not physically exist in the file** [raw/meta--exif-tags--makernotes-and-present-vs-absent.md].

### 2.7 EXIF vs XMP vs IPTC
- **EXIF**: camera-originated, fixed binary structures (IFD0 / ExifIFD / GPS / InteropIFD), includes the vendor MakerNotes block.
- **XMP**: flexible RDF/XML packet, extensible via namespaces, the modern home for rights/description/provenance metadata.
- **IPTC (IIM)**: the older editorial/newsroom binary block; largely superseded by XMP but still read by many CMSes.

When the same logical tag exists in more than one format, ExifTool extracts only one value unless `-a` is given; contradictory cross-format values are a common source of confusion, and `exiftool -a -G1 -s image.jpg` shows exactly where each lives [raw/meta--exiftool--exiftool-org-faq.md].

---

## 3. IPTC DigitalSourceType
### 3.1 Exact identifiers
| Item | Value | Cite |
|---|---|---|
| Property name | Digital Source Type | [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| XMP namespace prefix | `Iptc4xmpExt` | [raw/meta--iptc--digitalsourcetype-newscodes.md], [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| XMP namespace URI | `http://iptc.org/std/Iptc4xmpExt/2008-02-29/`. **Retains the historical date `2008-02-29` and does not change with spec versions.** | [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| XMP property path | `Iptc4xmpExt:DigitalSourceType` | [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| Full XMP path | `Xmp.iptcExt.DigitalSourceType` | [raw/meta--iptc--digitalsourcetype-newscodes.md] |
| **ExifTool tag path** | **`XMP-iptcExt:DigitalSourceType`** | [raw/meta--iptc--digitalsourcetype-newscodes.md], [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| Data type | closed choice of Text [External], a single URI string | [raw/meta--iptc--digitalsourcetype-newscodes.md], [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| **Cardinality** | **0..1. Single value, NOT a list.** | [raw/meta--iptc--digitalsourcetype-newscodes.md], [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| Controlled vocabulary | required: IPTC Digital Source Type NewsCodes | [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| Scheme URI | `http://cv.iptc.org/newscodes/digitalsourcetype/`. Scheme definition: "Indicates from which source a digital image was created." | [raw/meta--iptc--digitalsourcetype-newscodes.md] |
| IIM equivalent | **none** | [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| Exif equivalent | **none** | [raw/meta--iptc--photo-metadata-standard-2025-1.md] |

**It is NOT in the PLUS (`plus:`) namespace.** PLUS (`http://ns.useplus.org/ldf/xmp/1.0/`) holds licensing properties such as `plus:Licensor` and `plus:LicensorURL` [raw/meta--iptc--digitalsourcetype-newscodes.md], [raw/meta--iptc--photo-metadata-standard-2025-1.md].

**Because there is no IIM or Exif equivalent, DigitalSourceType exists ONLY in the XMP packet (or in a C2PA manifest as an IPTC assertion). Stripping XMP removes it entirely; there is no EXIF fallback location** [raw/meta--iptc--photo-metadata-standard-2025-1.md].

Spec version: **IPTC Photo Metadata Standard 2025.1 (revision 1), released 26 November 2025** [raw/meta--iptc--photo-metadata-standard-2025-1.md].

### 3.2 Read and write
```bash
# read
exiftool -XMP-iptcExt:DigitalSourceType photo.jpg
exiftool -XMP-iptcExt:digitalsourcetype IPTC-PhotometadataRef-Std2021.1.jpg   # names are case-insensitive

# write (camera photo)
exiftool -XMP-iptcExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture" photo.jpg

# write (AI-generated), IPTC's own example, note the https
exiftool -XMP-iptcExt:digitalsourcetype=https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia test-image.jpg
```
[raw/meta--iptc--digitalsourcetype-newscodes.md], [raw/meta--iptc--exiftool-command-line-guide.md]

### 3.3 The http vs https inconsistency: FLAG
**This is a real inconsistency inside IPTC's own materials** [raw/meta--iptc--digitalsourcetype-newscodes.md]:

| Position | Scheme | Where |
|---|---|---|
| Canonical scheme declaration | `http://` | The CV site publishes `http://cv.iptc.org/newscodes/digitalsourcetype/`. "The `http://` form is the literal value that goes into the metadata field. Do not 'upgrade' it to https when writing." |
| IPTC's own ExifTool examples | `https://` | `exiftool -XMP-iptcExt:digitalsourcetype=https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia test-image.jpg`, and the full rights write example likewise uses `https://.../digitalCapture` |

**Matching rule:** both forms exist in the wild; **consumers should match on the path suffix rather than on the scheme**. When writing new files, `http://` matches the canonical scheme declaration and `https://` matches IPTC's published example code. **Pick one and be consistent; do not assume a reader will normalise** [raw/meta--iptc--digitalsourcetype-newscodes.md], [raw/meta--iptc--exiftool-command-line-guide.md].

### 3.4 Full active controlled vocabulary
All URIs prefix `http://cv.iptc.org/newscodes/digitalsourcetype/` [raw/meta--iptc--digitalsourcetype-newscodes.md].

| # | Concept key | Definition | Production situation it maps to |
|---|---|---|---|
| 1 | `digitalCapture` | "The media was captured from a real-life source using a digital camera or digital recording device" | **Ordinary photograph taken with a camera.** The default for real photography |
| 2 | `computationalCapture` | Multiple frames merged automatically from real-life sources using digital signal processing or non-generative AI, including HDR processing | Smartphone computational photography; in-camera HDR / night mode stacking |
| 3 | `negativeFilm` | "The media was digitised from a negative on film or other transparent medium" | Scanned film negative |
| 4 | `positiveFilm` | "The media was digitised from a positive on a transparency or other transparent medium" | Scanned slide / transparency |
| 5 | `print` | "The media was digitised from a non-transparent medium such as a photographic print" | Scanned print |
| 6 | `humanEdits` | "Augmentation, correction or enhancement by one or more humans using non-generative tools" | Photo edited in Lightroom/Photoshop, non-generative. **Supersedes retired `minorHumanEdits`.** |
| 7 | `algorithmicallyEnhanced` | Algorithmic modification initiated by humans without altering core content, e.g. sharpening, noise reduction | Denoise/sharpen only |
| 8 | `digitalCreation` | "Media created by a human using non-generative tools" | Digital painting/illustration. **Supersedes retired `digitalArt`.** |
| 9 | `dataDrivenMedia` | "Digital media representation of data via human programming or creativity" | Data visualisation |
| 10 | `trainedAlgorithmicMedia` | "Digital media created algorithmically using an Artificial Intelligence model trained on captured content" | **Fully AI-generated image** (Midjourney, DALL-E, Firefly, Stable Diffusion output) |
| 11 | `compositeWithTrainedAlgorithmicMedia` | "Augmentation, correction or enhancement using a Generative AI model, such as with inpainting or outpainting operations" | **Photoshop Generative Fill / generative expand applied to a real photo** |
| 12 | `algorithmicMedia` | Media created by algorithm *without* training data | Mathematical formulas, fractals, procedural rendering |
| 13 | `screenCapture` | "A capture of the contents of the screen of a computer or mobile device" | Screenshot |
| 14 | `virtualRecording` | "Live recording of virtual event based on Generative AI and/or captured elements" | Virtual event capture |
| 15 | `composite` | "Mix or composite of several elements, any of which may or may not be generative AI" | Unspecified composite |
| 16 | `compositeCapture` | "Mix or composite of several elements that are all captures of real life" | Real-only composite, e.g. multi-exposure blend of camera frames |
| 17 | `compositeSynthetic` | "Mix or composite of several elements, at least one of which is Generative AI" | Mixed real plus generative composite |

### 3.5 RETIRED values: do NOT write these into new files
| Retired concept | Retirement date | Superseded by |
|---|---|---|
| `minorHumanEdits` | **2024-09-17** | `humanEdits` |
| `digitalArt` | **2024-09-17** | `digitalCreation` |
| `softwareImage` | **2022-06-14** | a more specific term, usually `digitalCreation` or `screenCapture` |

"Retired URIs remain resolvable for backwards compatibility with files already in the wild, but new writes should use the superseding term" [raw/meta--iptc--digitalsourcetype-newscodes.md].

### 3.6 C2PA's digitalsourcetype namespace is a DIFFERENT vocabulary: FLAG
C2PA reuses the IPTC NewsCodes as its **primary** vocabulary, carried as an IPTC assertion within the manifest, but C2PA **additionally defines its own extension URIs under its own namespace** [raw/meta--c2pa--technical-specification.md]:

- `http://c2pa.org/digitalsourcetype/trainedAlgorithmicData`
- `http://c2pa.org/digitalsourcetype/empty`

**These are C2PA-specific and are NOT IPTC NewsCodes.** Do not confuse `c2pa.org/digitalsourcetype/trainedAlgorithmicData` with `cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`: **different namespace, different term ("Data" vs "Media")** [raw/meta--c2pa--technical-specification.md].

### 3.7 Google Image Search consumption set
Google reads a defined subset for image-rights display: `dc:creator`, `photoshop:Credit`, `dc:rights`, `xmpRights:WebStatement`, `plus:LicensorURL`, `Iptc4xmpExt:DigitalSourceType` [raw/meta--iptc--photo-metadata-standard-2025-1.md].

```bash
exiftool -G1 -XMP-dc:creator -XMP-photoshop:Credit -XMP-dc:rights \
  -XMP-xmpRights:WebStatement -XMP-plus:LicensorURL \
  -XMP-iptcExt:DigitalSourceType test-image.jpg
```
[raw/meta--iptc--exiftool-command-line-guide.md]

Full rights plus provenance write for a real photograph (IPTC's own example, verbatim):

```bash
exiftool -XMP-dc:creator="Jane Smith" \
  -XMP-photoshop:Credit="Jane Smith, Smith Photography Ltd" \
  -XMP-dc:rights="Copyright Smith Photography Ltd 2023" \
  -XMP-xmpRights:WebStatement="http://smithphotography.com/licensing/" \
  -XMP-plus:LicensorURL="http://www.mypictureagency.com/obtain-licence/" \
  -XMP-iptcExt:DigitalSourceType="https://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture" \
  test-image.jpg
```
[raw/meta--iptc--exiftool-command-line-guide.md]

IPTC schema namespaces [raw/meta--iptc--photo-metadata-standard-2025-1.md], [raw/meta--iptc--exiftool-command-line-guide.md]:

| Schema | Namespace URI | Prefix | ExifTool group |
|---|---|---|---|
| IPTC Core | `http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/` | `Iptc4xmpCore` | `XMP-iptcCore:` |
| IPTC Extension | `http://iptc.org/std/Iptc4xmpExt/2008-02-29/` | `Iptc4xmpExt` | `XMP-iptcExt:` |
| Dublin Core | `http://purl.org/dc/elements/1.1/` | `dc` | `XMP-dc:` |
| Photoshop | `http://ns.adobe.com/photoshop/1.0/` | `photoshop` | `XMP-photoshop:` |
| XMP Rights | `http://ns.adobe.com/xap/1.0/rights/` | `xmpRights` | `XMP-xmpRights:` |
| PLUS | `http://ns.useplus.org/ldf/xmp/1.0/` | `plus` | `XMP-plus:` |

---

## 4. C2PA / Content Credentials
### 4.1 Spec version
| Version | Date | Status |
|---|---|---|
| **2.4** | **April 2026** | **CURRENT as of the 2026-08-17 research date** |
| 2.2 | May 2025 | "technical and editorial changes to clarify some of the new features" |
| 2.0 | January 2024 | |

Versioned spec URLs: `https://spec.c2pa.org/specifications/specifications/<VER>/specs/C2PA_Specification.html` [raw/meta--c2pa--technical-specification.md].

**What changed in 2.4 vs 2.2/2.3:** crJSON serialization introduced; three new assertions (**Repository Receipt**, **Environmental Sustainability**, **AI Disclosure**); HTML / structured text embedding support; Actions assertion gained a `relatedAssertions` field; `specVersion` moved out of the claim into `claim_generator_info` [raw/meta--c2pa--technical-specification.md].

### 4.2 Manifest structure
A **C2PA Manifest Store** is "a collection of C2PA Manifests that can either be embedded into an asset or be external to its asset." The **last manifest in the store is the active manifest**, holding the currently valid content bindings. Each Manifest contains three parts [raw/meta--c2pa--technical-specification.md]:

| Part | Role |
|---|---|
| **Assertions** | Individual statements about the asset: metadata, actions, hashes, thumbnails, ingredients |
| **Claim** | Container referencing the assertions, establishing the binding to the content |
| **Claim Signature** | Cryptographic signature over the claim, proving authenticity and integrity |

**Ingredients** represent prior assets consumed to produce this one, which is how edit chains and composites are expressed. A **parent ingredient** represents the pre-edit state. "The set of C2PA Manifests, as stored in the asset's Content Credential, represent its provenance data" [raw/meta--c2pa--technical-specification.md].

Key assertions [raw/meta--c2pa--technical-specification.md]:

| Assertion | Notes |
|---|---|
| `c2pa.actions` / `c2pa.actions.v2` | Records operations performed by an actor (create, embed, filter). v2 supports "richer models of ingredient-based workflows", refined watermarking actions, and **requires that either `c2pa.created` or `c2pa.opened` is present in a standard manifest**. |
| `c2pa.metadata` | The common metadata assertion. Carries supported metadata schemas (Dublin Core, EXIF, IPTC, XMP). Validation requires consistency with the serialized values in the asset. |
| AI Disclosure | New in 2.4 |
| Repository Receipt, Environmental Sustainability | New in 2.4 |

### 4.3 Embedding mechanism: JUMBF
Manifests are embedded using **JUMBF (JPEG Universal Metadata Box Format)**, defined in **ISO/IEC 19566-5:2023**. For non-BMFF formats such as JPEG and PNG, the manifest store is stored as a **JUMBF superbox** containing description and content boxes [raw/meta--c2pa--technical-specification.md].

**CAVEAT carried forward:** the 2.4 text fetched did not spell out the specific JPEG marker segment or PNG chunk name. "In practice JPEG uses APP11 marker segments and PNG uses a `caBX` ancillary chunk. **This detail was not confirmed from the primary source in this pass.**" [raw/meta--c2pa--technical-specification.md]

### 4.4 Hard binding vs soft binding
| | Hard binding | Soft binding |
|---|---|---|
| What it is | Cryptographic hashes uniquely identifying an asset or a portion of it | Fingerprints or invisible watermarks computed from the content itself |
| Purpose | **Tamper detection / integrity verification** | **Identity matching, NOT integrity verification** |
| Mechanisms | Byte-range hashing, box hashing, BMFF-based hashing | Invisible watermark; perceptual/digital fingerprint |
| Survives re-encode? | No, bits must match | Yes. Matches derived assets and renditions "even when the underlying bits differ", across resolutions, re-encodings, format conversions |
| Replaces the other? | n/a | **No.** The spec is explicit that soft bindings do not replace the cryptographic hard binding. |
[raw/meta--c2pa--technical-specification.md]

**Durable Content Credentials** are defined as "a Content Credential for which there exists one or more soft bindings that enable its discovery in a manifest repository." This is the mechanism that lets a manifest be recovered and re-attached after the embedded manifest is stripped: the watermark/fingerprint survives, the repository lookup returns the manifest [raw/meta--c2pa--technical-specification.md]. CAI describes the same as a three-part combination of "**watermarking, secure metadata, and digital fingerprinting**" [raw/meta--c2pa--content-authenticity-initiative.md]:

| Component | Behaviour under stripping |
|---|---|
| Secure metadata | The embedded, cryptographically signed JUMBF manifest. **Removed by any metadata strip.** |
| Invisible watermark | Soft binding embedded in the pixels; survives re-encoding, resizing, screenshotting to a degree |
| Digital fingerprint | Perceptual hash computed from content, allowing lookup without modifying the asset at all |

### 4.5 What happens to a manifest when metadata is stripped
[raw/meta--c2pa--technical-specification.md]

- Claim generators may **exclude asset metadata from the content binding** using exclusion mechanisms in the hash assertions. Excluded metadata is not attributed to the signer.
- When asset metadata outside the C2PA manifest (EXIF, XMP) is stripped, it is **no longer protected by the hard binding**.
- Spec guidance: "any asset metadata values that are supported by the common metadata assertion should be copied into such an assertion and included in the C2PA Manifest", i.e. duplicate the important EXIF/IPTC/XMP values *inside* the signed manifest so they survive and are attributable.
- **If the embedded JUMBF manifest itself is removed, the only recovery route is a soft binding (durable Content Credentials) plus a manifest repository lookup, or a remote/sidecar manifest reference. A plain metadata strip removes embedded Content Credentials entirely.**

Tamper-**evident**, not tamper-**proof**: "the signature proves that the signed bytes have or have not changed; it does not prevent anyone from removing the manifest entirely" [raw/meta--c2pa--content-authenticity-initiative.md]. Recovery "depends on the manifest actually being present in a queried repository, and on the watermark surviving the transformation applied. **Neither is guaranteed.**" [raw/meta--c2pa--content-authenticity-initiative.md]

CAI's own stated limit: it creates "an attribution- and transparency-based solution" rather than claiming to resolve misinformation. Content Credentials establish **who says what about an asset's history**, verifiably. They do **not** prove that an image depicts reality, nor detect AI content that never carried a credential. **Absence of a Content Credential means nothing** [raw/meta--c2pa--content-authenticity-initiative.md].

### 4.6 c2patool basics
Repo `https://github.com/contentauth/c2patool`; docs `https://opensource.contentauthenticity.org/docs/c2patool/`. Syntax: `c2patool [trust] [PATH] [OPTIONS]` [raw/meta--c2pa--c2patool-cli.md].

Install: pre-built binaries from releases (Linux, macOS, Windows), verify with `c2patool -h`; or `cargo install cargo-binstall` then `cargo binstall c2patool`; or `cargo install c2patool` [raw/meta--c2pa--c2patool-cli.md].

**Supported formats:** `.avi .avif .c2pa .dng .heic .heif .jpg .jpeg .m4a .mp3 .mp4 .mov .pdf .png .svg .tif .tiff .wav .webp`. **No support for raw formats other than DNG. Camera-native raw (CR3, NEF, ARW) is not in the list** [raw/meta--c2pa--c2patool-cli.md].

```bash
c2patool sample/C.jpg                       # print manifest JSON to stdout
c2patool sample/C.jpg --output ./report     # manifest plus extracted thumbnails to a directory
c2patool sample/C.jpg --detailed            # detailed report in internal C2PA format
c2patool sample/C.jpg -d --output ./report  # writes detailed.json into ./report
c2patool sample/C.jpg --info                # manifest size, count, validation status, cloud manifest URLs
c2patool sample/C.jpg --certs               # extract signing certificate chain
c2patool sample/C.jpg --tree                # manifest store as a tree

c2patool sample/image.jpg -m sample/test.json -o signed_image.jpg
c2patool sample/image.jpg -m sample/test.json -f -o signed_image.jpg              # force overwrite
c2patool sample/image.jpg -m sample/test.json -p sample/c.jpg -o signed_image.jpg # declare parent
c2patool sample/C.jpg --ingredient --output ./ingredient                          # two-step ingredient
c2patool sample/image.jpg -s -m sample/test.json -o signed_image.jpg              # external .c2pa sidecar
c2patool sample/image.jpg -r http://my_server/myasset.c2pa -m sample/test.json -o signed_image.jpg
c2patool sample/image.jpg -c '{"assertions": [{"label": "org.contentauth.test", "data": {"my_key": "whatever I want"}}]}'
```
[raw/meta--c2pa--c2patool-cli.md]

Flags [raw/meta--c2pa--c2patool-cli.md]: `--manifest`/`-m` manifest definition file to add; `--output`/`-o` output file or folder; `--detailed`/`-d` detailed C2PA-format report; `--parent`/`-p` parent (pre-edit) file; `--force`/`-f` overwrite existing output; `--sidecar`/`-s` write external `.c2pa` manifest; `--remote`/`-r` remote manifest HTTP URL; `--ingredient`/`-i` create an ingredient definition; `--config`/`-c` inline JSON manifest definition; `--signer-path` external signing executable (receives claim bytes on stdin, writes signature bytes to stdout); `--reserve-size` bytes reserved for the signature; `--no_signing_verify` skip post-signing validation; `--info` high-level file info; `--certs` extract certificate chain; `--tree` manifest store tree diagram; `--version`/`-V` version.

Manifest definition JSON, with and without credentials:

```json
{ "assertions": [ { "label": "org.contentauth.test", "data": { "my_key": "whatever I want" } } ] }
```
```json
{ "private_key": "/path/to/private.key", "sign_cert": "/path/to/certificate.pem", "assertions": [] }
```

**If `private_key` / `sign_cert` are absent, c2patool falls back to a built-in test certificate and key "suitable for development and testing" only. Such manifests will not validate against the production trust list.** Credentials can also come from environment variables [raw/meta--c2pa--c2patool-cli.md].

Trust lists [raw/meta--c2pa--c2patool-cli.md]: `c2patool sample/C.jpg trust --allowed_list sample/allowed_list.pem --trust_config sample/store.cfg`. Environment variables: `C2PATOOL_TRUST_ANCHORS` (trust anchor list, PEM) = `https://contentcredentials.org/trust/anchors.pem`; `C2PATOOL_ALLOWED_LIST` (end-entity certificates, PEM) = `https://contentcredentials.org/trust/allowed.sha256.txt`; `C2PATOOL_TRUST_CONFIG` (custom certificate OIDs) = `https://contentcredentials.org/trust/store.cfg`; then `c2patool sample/C.jpg trust`.

### 4.7 Adobe's implementation position
CAI was **founded by Adobe in 2019**; open membership, free to join. Named partners include **Microsoft, Reuters, BBC**, and hardware manufacturers **Leica and Nikon**. CAI is the advocacy/implementation community; **C2PA is the standards body** that publishes the technical specification. CAI ships the open-source tooling (c2patool, c2pa-rs / c2pa-js SDKs) [raw/meta--c2pa--content-authenticity-initiative.md].

Adobe's framing: Content Credentials are "a durable, industry-standard metadata type that acts like a digital nutrition label for content", recording **creator identity** (verified name and connected social accounts), **creation method** (camera-captured, AI-generated, or edited), and **edit history**: "New Content Credentials can be added at each stage, creating a transparent version history" [raw/meta--c2pa--adobe-content-credentials-photoshop.md].

Supporting Adobe apps: **Photoshop, Lightroom, Premiere, Adobe Stock, Firefly (and the Firefly APIs)** [raw/meta--c2pa--adobe-content-credentials-photoshop.md].

**Generative Fill does write Content Credentials: YES.** Adobe "automatically applies Content Credentials to content generated on Adobe Firefly and APIs"; Photoshop's generative features (Generative Fill, Generative Expand, Generate Image) are Firefly-backed, and the credential records that generative AI was used [raw/meta--c2pa--adobe-content-credentials-photoshop.md].

**Behavioural detail: user-reported, NOT vendor-confirmed** (Adobe community thread with no Adobe staff reply) [raw/meta--c2pa--adobe-content-credentials-photoshop.md]:

- Applying Generative Fill causes Photoshop to add Content Credentials metadata to the file.
- **The record persists after undo.** The credential "saying the work was generated using AI will not be removed" even after undoing or deleting the AI layer.
- Users report needing "the workaround of having to save first and then reload".
- Separate threads complain of Photoshop attaching Content Credentials on export regardless of whether AI was used and regardless of the preference setting. **User-reported, contested, and version-dependent.**

Practical implication: **the "did AI touch this file" signal in a Photoshop workflow is sticky within a session.** If a clean provenance record matters, do generative experiments in a separate document rather than undoing them in the delivery file [raw/meta--c2pa--adobe-content-credentials-photoshop.md].

Content Credentials can also carry a **generative-AI training preference** requesting that "supported models not train on or use your content", currently honoured by Adobe Firefly and Spawning. **This is a request, not an enforcement mechanism** [raw/meta--c2pa--adobe-content-credentials-photoshop.md].

Adobe calls credentials "durable" and says they "remain attached to your content, enabling others to view the information on supported platforms", but the overview page does **not** address export behaviour, re-upload to third-party platforms, watermark resistance, or metadata-stripping resistance. Those claims live in the CAI durable-credentials material, not the product overview [raw/meta--c2pa--adobe-content-credentials-photoshop.md].

---

## 5. Regulatory state as of 2026-08-17
### 5.1 EU AI Act: Regulation (EU) 2024/1689
Published in the Official Journal **12 July 2024**. EUR-Lex ELI: `https://eur-lex.europa.eu/eli/reg/2024/1689/oj` [raw/meta--regulation--eu-ai-act-article-50.md].

**Status: Article 50 is IN FORCE.** Chapter IV (Transparency obligations), which contains Article 50, is not carved out by the phased provisions of Article 113, so it falls under the Regulation's general application date of **2 August 2026**, fifteen days before the research date [raw/meta--regulation--eu-ai-act-article-50.md].

**Article 113, entry into force and application** (verbatim): "This Regulation shall enter into force on the twentieth day following that of its publication in the Official Journal of the European Union. It shall apply from **2 August 2026**."

| Date | What applies | Cite |
|---|---|---|
| **2 February 2025** | "Chapters I and II shall apply from 2 February 2025": general provisions and the Article 5 prohibited-practices list | [raw/meta--regulation--eu-ai-act-article-50.md] |
| **2 August 2025** | "Chapter III Section 4, Chapter V, Chapter VII and Chapter XII and Article 78 shall apply from 2 August 2025, with the exception of Article 101": notified bodies, GPAI models, governance, penalties | [raw/meta--regulation--eu-ai-act-article-50.md] |
| **2 August 2026** | **General application date for the Regulation as a whole, including Chapter IV / Article 50** | [raw/meta--regulation--eu-ai-act-article-50.md] |
| **2 August 2027** | "Article 6(1) and the corresponding obligations in this Regulation shall apply from 2 August 2027": high-risk classification for products under sectoral safety legislation | [raw/meta--regulation--eu-ai-act-article-50.md] |

**Article 50(2), PROVIDER obligation, machine-readable marking of synthetic content.** The key provision for images. Providers of AI systems (**including general-purpose AI systems**) generating **synthetic audio, image, video or text** content shall ensure the **outputs are marked in a machine-readable format and detectable as artificially generated or manipulated**. Providers shall ensure their technical solutions are **"effective, interoperable, robust and reliable as far as this is technically feasible"**, taking into account the specificities and limitations of various content types, implementation costs, and generally acknowledged state of the art (as may be reflected in relevant technical standards). **Exemptions from paragraph 2:** where the AI systems perform an **assistive function for standard editing** or do not substantially alter the input data provided by the deployer or its semantics; and law-enforcement systems authorised by law [raw/meta--regulation--eu-ai-act-article-50.md].

> The obligation falls on the **provider** of the generative system (the model/tool vendor), **not on the end user**. It is an obligation to mark **at generation time**. C2PA Content Credentials and IPTC DigitalSourceType in XMP are the two mechanisms the industry is using to satisfy "machine-readable format" [raw/meta--regulation--eu-ai-act-article-50.md].

**Article 50(4), DEPLOYER obligation, deepfakes.** The key provision for deployers/publishers. Deployers of an AI system that generates or manipulates image, audio or video content constituting a **deepfake** shall **disclose that the content has been artificially generated or manipulated** [raw/meta--regulation--eu-ai-act-article-50.md].

**The artistic carve-out (50(4)):** where the content forms part of an **"evidently artistic, creative, satirical, fictional or analogous work or programme"**, the transparency obligation is **limited to disclosing the existence of such generated content in an appropriate manner that does not hamper the display or enjoyment of the work**. Also exempt: use authorised by law for criminal-justice purposes [raw/meta--regulation--eu-ai-act-article-50.md].

Also in 50(4): for **AI-generated or manipulated text published to inform the public on matters of public interest**, deployers must disclose that it is artificially generated, **unless** the content has undergone **human review or editorial control** and a natural or legal person holds editorial responsibility for publication, or the use is law-enforcement authorised [raw/meta--regulation--eu-ai-act-article-50.md].

Remaining paragraphs [raw/meta--regulation--eu-ai-act-article-50.md]:

| Paragraph | Content |
|---|---|
| 50(1) | Direct interaction. Providers must ensure persons are informed they are interacting with an AI system, unless obvious to a reasonably well-informed observer. Law-enforcement exemption with safeguards, unless the system is publicly available to report a criminal offence. |
| 50(3) | Emotion recognition / biometric categorisation. Deployers must inform exposed natural persons and process personal data in accordance with the GDPR. Law-enforcement exemptions with safeguards. |
| 50(5) | Manner of disclosure. Information under paragraphs 1, 3 and 4 must be provided **clearly and distinguishably at the latest at the time of the first interaction or exposure**, conforming to applicable accessibility requirements. |
| 50(6) | No derogation. Paragraphs 1 to 4 do not affect Chapter III (high-risk) obligations and are without prejudice to other transparency obligations in Union or national law. |
| 50(7) | Codes of practice. The **AI Office** shall encourage and facilitate codes of practice at Union level for detection and labelling of artificially generated or manipulated content. The Commission may adopt implementing acts to approve them; if a code is not adequate, the Commission may specify common rules by implementing act. |

**Practical takeaway for image work** [raw/meta--regulation--eu-ai-act-article-50.md]:

- A photograph made with a camera is **not in scope of Art. 50(2)/(4) at all**. The obligations attach to AI-generated or AI-manipulated content.
- **There is no EU legal obligation to mark a real photograph as real.** Writing `digitalCapture` into DigitalSourceType is **voluntary good practice, not compliance**.
- Since 2 Aug 2026 there is a binding obligation on generative-AI **providers** to machine-readably mark synthetic output, and on **deployers** to disclose deepfakes.
- "Assistive function for standard editing" is the exemption ordinary retouching relies on; **generative fill that substantially alters semantics does not clearly fall within it**.

### 5.2 California AI Transparency Act: SB 942 as amended by AB 853
| Instrument | Detail | Cite |
|---|---|---|
| **SB 942 (2024)** | California AI Transparency Act. Codified at **Business and Professions Code Chapter 25, Sections 22757 et seq.** | [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md] |
| **AB 853 (2025)** | Amending act. **Chaptered 13 October 2025, Chapter 674, Statutes of 2025.** Delayed SB 942's operative date and added new categories of duty-holder. | [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md] |

**Tiered rollout** [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md]:

| Date | Who | What |
|---|---|---|
| ~~1 January 2026~~ | covered providers | Original SB 942 operative date, **superseded/delayed by AB 853** |
| **2 August 2026** | **Covered providers (GenAI developers)** | **IN FORCE as of 2026-08-17.** Detection tool, manifest plus latent disclosure |
| **1 January 2027** | Large online platforms | Detect, surface, and **not strip** provenance data |
| **1 January 2027** | GenAI system hosting platforms | May not knowingly host non-compliant GenAI systems |
| **1 January 2028** | Capture device manufacturers | Latent disclosure option in cameras/phones |

Notable coincidence: **2 August 2026 is the same day EU AI Act Article 50 became applicable** [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].

**Covered provider** = "An entity that creates, codes, or otherwise produces a generative AI system" that (1) has **over 1,000,000 monthly visitors or users**, AND (2) is publicly accessible within California. Pending **SB 1000** would remove the user-count threshold; **not enacted** as of this date [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].

**Core obligations in force 2 August 2026** [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md]:

- **Free AI detection tool.** Providers must "maintain a free AI detection tool allowing users to assess whether image, video, or audio content was created or altered" by their system, and output any embedded provenance data found.
- **Manifest disclosure.** A **visible** label option on AI-generated or AI-altered image, video and audio content.
- **Latent disclosure.** **Embedded provenance data** on AI-generated or AI-altered image, video and audio content, required "when technically feasible and reasonable". This is the metadata/watermark-level disclosure.

**AB 853 additions, Large online platforms, from 1 January 2027** (the **platform no-strip duty**) [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md]:

- Must detect whether "provenance data that is compliant with widely adopted specifications adopted by an established standards-setting body" is embedded in distributed content. **This is the hook that pulls in C2PA.**
- Must allow users to inspect available provenance information.
- **Must not knowingly strip compliant provenance data or digital signatures from content.** This directly targets the current platform behaviour of stripping all metadata on upload.

**AB 853, GenAI system hosting platforms, from 1 January 2027:** may not "knowingly make available a GenAI system that does not place the required disclosures" [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].

**AB 853, Capture device manufacturers, from 1 January 2028** (the **capture-device duty**) [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md]:

- Must offer users the **option** to include latent disclosures in photos, video and audio.
- Applies to devices "first produced for sale in California on or after January 1, 2028": cameras, smartphones, voice recorders.
- **CONFLICT, unresolved:** the raw sources differ on whether **default-on** embedding is required. One summary states latent disclosures embedded "by default" for such devices; the primary framing is an *option to include*. **Not fully confirmed. Check statutory text.**

**Penalties: $5,000 civil penalty per violation.** "Each day that a covered provider ... is in violation is deemed a discrete violation", so **exposure compounds daily** [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].

### 5.3 WARNING: AB 3211 never became law
**AB 3211 (2023 to 2024), California Digital Content Provenance Standards (Wicks)** would have added **Chapter 41 (commencing with Section 22949.90) to Division 8 of the Business and Professions Code**, proposing far broader mandates including provenance metadata on capture devices and watermarking of generative output [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].

**Status: DIED.** Last action **31 August 2024, "Ordered to inactive file at the request of Senator Gonzalez."** It was **never enacted**. **AB 3211 is frequently cited in commentary as if it were law; it is not.** The operative California provenance regime is **SB 942 as amended by AB 853** [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].

### 5.4 What these laws do NOT require of an individual photographer today
State plainly, on 2026-08-17:

- **Nothing.** "None of these laws impose any obligation on an individual photographer to add metadata to a real photograph" [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].
- **There is no EU legal obligation to mark a real photograph as real.** Writing `digitalCapture` into `XMP-iptcExt:DigitalSourceType` is **voluntary good practice, not compliance** [raw/meta--regulation--eu-ai-act-article-50.md].
- A camera photograph is **not in scope of EU AI Act Art. 50(2) or 50(4) at all** [raw/meta--regulation--eu-ai-act-article-50.md].
- The California duty-holders are **large GenAI developers, hosting platforms, large online platforms, and (from 2028) device manufacturers**, not photographers [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].
- The obligations that *do* exist bite the **provider** of a generative system at generation time (50(2)) and the **deployer** publishing a deepfake (50(4)). A photographer publishing an unmanipulated photograph is neither [raw/meta--regulation--eu-ai-act-article-50.md].
- The practical consequence a photographer should care about is the **2027 platform anti-stripping duty**: large online platforms will be required to stop destroying provenance metadata, improving the odds that deliberately-written metadata survives publication [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md].

---

## 6. Legitimate metadata practice
### 6.1 Why photographers strip GPS and serials
**GPS tag reference (EXIF GPS IFD)** [raw/meta--privacy--gps-tags-and-stripping-practice.md]:

GPS IFD tags, ID / tag / format: `0x0000` `GPSVersionID` int8u[4]; `0x0001` `GPSLatitudeRef` string[2] (`N`/`S`); `0x0002` `GPSLatitude` rational64u[3] deg/min/sec; `0x0003` `GPSLongitudeRef` string[2] (`E`/`W`); `0x0004` `GPSLongitude` rational64u[3]; `0x0005` `GPSAltitudeRef` int8u (0 = above sea level, 1 = below); `0x0006` `GPSAltitude` rational64u; `0x0007` `GPSTimeStamp` rational64u[3] UTC h/m/s; `0x0008` `GPSSatellites` string; `0x0009` `GPSStatus` string[2]; `0x000d` `GPSSpeed` rational64u; `0x0010` `GPSImgDirectionRef` string[2] (`T` true / `M` magnetic); `0x0011` `GPSImgDirection` rational64u (bearing the camera was pointing); `0x0012` `GPSMapDatum` string; `0x001b` `GPSProcessingMethod` undef; `0x001d` `GPSDateStamp` string[11] UTC date; `0x001f` `GPSHPositioningError` rational64u (horizontal error in metres).

**Storage detail that matters:** latitude and longitude are stored as **unsigned** rational triples (degrees, minutes, seconds); the hemisphere lives in a **separate reference tag** (`GPSLatitudeRef` = N/S, `GPSLongitudeRef` = E/W). Deleting only `GPSLatitude` and `GPSLongitude` while leaving the Ref tags, or vice versa, leaves an inconsistent, partially identifying record. **Always delete the whole group** (`-GPS:all=`) [raw/meta--privacy--gps-tags-and-stripping-practice.md].

`GPSDateStamp` plus `GPSTimeStamp` are **UTC**, so they leak the true absolute time even if `DateTimeOriginal` has been altered; `GPSHPositioningError` reveals how precise the fix was. `Composite:GPSPosition` is a derived convenience tag (lat/long plus refs as a signed decimal pair) and is **not stored in the file** [raw/meta--privacy--gps-tags-and-stripping-practice.md].

**Why strip. These are ordinary professional and privacy practices, not evasion** [raw/meta--privacy--gps-tags-and-stripping-practice.md]:

| Category | Rationale |
|---|---|
| GPS / location | Protects the photographer's and subjects' home, school and workplace addresses; a photo of a child in the garden geotags the family home to within metres. Protects sensitive shooting locations: nest sites of protected birds, rare plant populations, archaeological sites, fragile landscapes trampled once coordinates circulate. Protects sources and subjects in journalism and documentary work. Removes the ability to reconstruct a person's movement pattern by aggregating many published photos. |
| Serial numbers (`BodySerialNumber`, `LensSerialNumber`, `MakerNotes:SerialNumber`, `ShutterCount`) | **Link every photo you have ever published to the same physical body**, de-anonymising pseudonymous accounts and connecting personal and professional identities. Allow correlation of an anonymous leak with a named photographer's public portfolio. Expose equipment inventory to thieves, and (with ShutterCount) reveal camera wear, commercially sensitive when selling gear or bidding for work. |
| `Software` | Reveals your exact toolchain and version, a fingerprint and an attack surface. |
| `Artist` / `Copyright` / `OwnerName` | May contain a legal name you did not intend to publish. |
| Person keywords / face-region data | Name identifiable subjects. |
| `XMP-crs:` develop settings | Expose your editing recipe. |
| Embedded EXIF thumbnails | Can retain **pre-crop, pre-retouch** image content, a genuine historical leak vector where the visible image was cropped but the thumbnail was not. |

### 6.2 What a normal Lightroom / Photoshop export retains vs drops
Lightroom Classic export dialog, **Metadata panel, "Include" dropdown**, most to least restrictive [raw/meta--privacy--lightroom-export-metadata-retention.md]:

| Setting | Retains | Drops |
|---|---|---|
| **Copyright Only** | Copyright field only | Nearly all EXIF **including capture date/time**. It removes `DateTimeOriginal`, which surprises people |
| **Copyright & Contact Info Only** | As above plus the IPTC creator/contact fields (creator, email, website, phone, address) | Same as above |
| **All Except Camera & Camera Raw Info** | Temporal and capture data plus IPTC/descriptive fields | **Hides camera model and exposure settings**, plus Camera Raw develop settings |
| **All Except Camera Raw Info** | Most EXIF: camera, lens, exposure settings, dates | Lightroom/Camera Raw develop adjustments. **This is the setting most photographers want**: it lets Flickr, 500px etc. display camera settings without publishing your editing recipe |
| **All Metadata** | Everything, including camera info and full Camera Raw processing settings | Nothing (makes develop settings publicly readable) |

Privacy checkboxes [raw/meta--privacy--lightroom-export-metadata-retention.md]:

- **Remove Person Info.** Strips person-type keywords / face-recognition regions. **Community reports have flagged versions where this did not work reliably** (e.g. "person info not removed during export since 11.0"), so **verify with ExifTool rather than trusting the checkbox**.
- **Remove Location Info.** Strips GPS from the export. Practitioner rationale: subject privacy, and protecting fragile or lesser-known shooting locations from being overrun once coordinates are public.
- **Write Keywords as Lightroom Hierarchy.** Preserves hierarchical keywords (`Nature|Birds|Raptors`) rather than flattening, for round-tripping back into Lightroom.

**What an export actually does to the file, regardless of the Include setting.** Lightroom **re-renders** the image, so the output is a new file rather than the original with edits [raw/meta--privacy--lightroom-export-metadata-retention.md]:

| Effect | Detail |
|---|---|
| **MakerNotes are dropped** | Lightroom writes its own EXIF block; the vendor proprietary blob does not survive. This is why **ShutterCount, focus-point data and vendor white-balance presets disappear on export even with "All Metadata" selected.** **FLAGGED AS INFERRED in the raw source:** "the source consulted does not state this explicitly... it is the well-established behaviour, and follows necessarily from ExifTool's rule that MakerNotes only survive as a copied opaque block." |
| `Software` is rewritten | Identifies Adobe Lightroom and the version, replacing the camera firmware string |
| Camera Raw develop settings | Written into the `XMP-crs:` namespace unless excluded |
| ColorSpace / ICC profile | Set from the export colour-space setting (sRGB, Adobe RGB, ProPhoto), **not inherited** |
| Orientation | **Baked into the pixels and normalised to 1** |
| `DateTimeOriginal` | **Preserved** under all settings except Copyright Only and Copyright & Contact Info Only |

**Consequence for provenance work: do not rely on the export dialog alone.** Export with the closest setting, then apply the exact tags with ExifTool as a **post-export step**. The export is lossy and its exact behaviour varies across Lightroom versions [raw/meta--privacy--lightroom-export-metadata-retention.md].

### 6.3 Recommended publish-time privacy strip
**Principle: allow-list, do not deny-list.** "Strip everything, then add back only what you intend to publish. A deny-list misses the tag you did not know existed" [raw/meta--privacy--gps-tags-and-stripping-practice.md].

Recommended command, verbatim from the raw source [raw/meta--privacy--gps-tags-and-stripping-practice.md]:

```bash
exiftool -all= -tagsFromFile @ \
  -EXIF:DateTimeOriginal -EXIF:Make -EXIF:Model \
  -EXIF:FNumber -EXIF:ExposureTime -EXIF:ISO -EXIF:FocalLength \
  -EXIF:Orientation -EXIF:ColorSpace -ICC_Profile \
  -XMP-dc:Creator -XMP-dc:Rights \
  -overwrite_original -P photo.jpg
```

What it keeps and what it removes:

| Kept (technical plus authorship) | Removed (location plus identifiers) |
|---|---|
| `DateTimeOriginal`, `Make`, `Model`, `FNumber`, `ExposureTime`, `ISO`, `FocalLength`, `Orientation`, `ColorSpace`, `ICC_Profile`, `XMP-dc:Creator`, `XMP-dc:Rights` | Everything else: the entire GPS IFD, `BodySerialNumber`, `LensSerialNumber`, all MakerNotes (and therefore `ShutterCount`), `Software`, person keywords and face regions, `XMP-crs:` develop settings, embedded thumbnails |

Note the ordering: `-all=` first, then `-tagsFromFile @` with the allow-list, per the left-to-right rule [raw/meta--exiftool--exiftool-org-application-docs.md]. `-P` preserves the filesystem mtime and `-overwrite_original` suppresses the `_original` backup [raw/meta--exiftool--exiftool-org-application-docs.md].

**INFERRED extension (not in any raw file):** to add provenance in the same pass, append `-XMP-iptcExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture"` as a plain assignment *after* the `-tagsFromFile` allow-list; assignments apply left to right, so a later assignment is not wiped by the earlier `-all=` [raw/meta--exiftool--exiftool-org-application-docs.md]. Choose `humanEdits` instead if the frame was edited non-generatively [raw/meta--iptc--digitalsourcetype-newscodes.md]. **Untested against a real file in this pass. Verify with `exiftool -a -G1 -s` before relying on it.**

Supporting rules [raw/meta--privacy--gps-tags-and-stripping-practice.md]:

- **Never edit the delivery file in place from the master.** Keep an unstripped archival master with full GPS and serials for your own catalogue; strip only on the export copy.
- **Verify, do not trust the checkbox.** After any export or strip, confirm with `exiftool -a -G1 -s file.jpg` that nothing survived.
- **Stripping is not reversible**, and platform behaviour is not a substitute for doing it yourself.

### 6.4 Do platforms strip metadata for you? Empirical 2025 test
Methodology: a smartphone photo with location services enabled was uploaded to each platform via its mobile app, re-downloaded, and analysed with an in-browser EXIF viewer [raw/meta--privacy--gps-tags-and-stripping-practice.md].

Results: **Instagram** strips aggressively, "stripped nearly all of the original metadata" including GPS, camera info, timestamps. **Facebook** the same, GPS coordinates, camera details, original timestamps "nowhere to be found". **X / Twitter**, downloaded image "free of any GPS coordinates, camera information". Discord not tested here but "widely reported to remove metadata". **LinkedIn, Reddit, Flickr, Google Photos, WhatsApp, Imgur, Pinterest and self-hosted/WordPress: NOT TESTED, unconfirmed.**

All tested platforms replaced the original metadata with their own server-side information.

**Two conclusions, pulling in opposite directions** [raw/meta--privacy--gps-tags-and-stripping-practice.md]:

1. You **cannot rely on platforms** to protect you. Coverage is inconsistent, untested for many services, and self-hosted sites strip nothing by default. **Strip before upload.**
2. The same aggressive stripping **destroys deliberately-authored provenance metadata**. IPTC DigitalSourceType, creator, copyright, and embedded C2PA manifests all die on upload to the major social platforms. This is precisely the behaviour **California AB 853 targets from 1 January 2027**, and precisely why C2PA invests in soft bindings (watermark plus fingerprint) rather than relying on embedded metadata alone.

---

## Gaps and unresolved
Every caveat the raw files flagged, carried forward.

| # | Gap | Source |
|---|---|---|
| 1 | **ExifTool 12.76 vs 13.59.** No raw file addresses version differences at all. The version-delta claim ("no known difference for these patterns") is this document's own reading of the man page, not a cited finding. Verify on the target machine. | this document (INFERRED) |
| 2 | **C2PA JPEG/PNG embedding specifics unconfirmed.** "The 2.4 text fetched did not spell out the specific JPEG marker segment / PNG chunk name in the excerpt retrieved. In practice JPEG uses APP11 marker segments and PNG uses a `caBX` ancillary chunk. This detail was not confirmed from the primary source in this pass." | [raw/meta--c2pa--technical-specification.md] |
| 3 | **Adobe helpx pages are client-side rendered.** WebFetch retrieved only navigation/metadata for several, including `.../save-and-export/metadata-content-credentials/use-content-credentials.html` and `.../generative-ai/generative-ai-features-overview.html`. Adobe community threads (moderated, public) were used to fill behavioural gaps. | [raw/meta--c2pa--adobe-content-credentials-photoshop.md] |
| 4 | **Photoshop Generative Fill "credential persists after undo" is user-reported, not vendor-confirmed**, with no Adobe staff reply in the thread. The related claim that Photoshop attaches Content Credentials on export regardless of AI use and regardless of the preference setting is user-reported, contested, and version-dependent. | [raw/meta--c2pa--adobe-content-credentials-photoshop.md] |
| 5 | **CAI durability recovery mechanics not specified.** The `how-it-works` page "did not spell out the specific recovery mechanics or the failure modes of each component. Recovery depends on the manifest actually being present in a queried repository, and on the watermark surviving the transformation applied, neither of which is guaranteed." | [raw/meta--c2pa--content-authenticity-initiative.md] |
| 6 | **EUR-Lex partially inaccessible via WebFetch.** The AI Act full-text HTML "fetched but is so large that the extraction returned only fragments and paraphrase that did not match the true article text." Substantive Article 50 content comes from artificialintelligenceact.eu, which republishes the consolidated text. **Verify verbatim wording against EUR-Lex before quoting in a legal context.** | [raw/meta--regulation--eu-ai-act-article-50.md] |
| 7 | **leginfo.legislature.ca.gov is disallowed by robots.txt** and could not be fetched. SB 942 / AB 853 section numbers and dates come from compliance trackers and CalMatters Digital Democracy. **Verify verbatim statutory text against leginfo directly before relying on it legally.** | [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md] |
| 8 | **CONFLICT: capture-device default-on embedding (1 Jan 2028).** The statute is described as an *option to include* latent disclosures, but "one summary states latent disclosures embedded 'by default' for such devices. **Not fully confirmed.** Check statutory text." | [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md] |
| 9 | **SB 1000 status.** Would remove the 1,000,000-user threshold from "covered provider". **Not enacted** as of 2026-08-17. Recheck. | [raw/meta--regulation--california-ai-transparency-act-sb942-ab853.md] |
| 10 | **CONFLICT: DigitalSourceType URI scheme.** IPTC's CV site declares `http://` canonical and says do not upgrade to https; IPTC's own ExifTool examples write `https://`. Both are in the wild. Match on path suffix, not scheme. Unresolved by IPTC itself. | [raw/meta--iptc--digitalsourcetype-newscodes.md], [raw/meta--iptc--exiftool-command-line-guide.md] |
| 11 | **Leica ShutterCount availability unconfirmed.** "Not documented in the source consulted." | [raw/meta--exif-tags--makernotes-and-present-vs-absent.md] |
| 12 | **Lightroom dropping MakerNotes on export is flagged INFERRED in the raw source, not directly cited:** "the source consulted does not state this explicitly... follows necessarily from ExifTool's rule that MakerNotes only survive as a copied opaque block." | [raw/meta--privacy--lightroom-export-metadata-retention.md] |
| 13 | **Lightroom "Remove Person Info" reliability contested.** Community reports of versions where it did not work ("person info not removed during export since 11.0"). Verify with ExifTool. | [raw/meta--privacy--lightroom-export-metadata-retention.md] |
| 14 | **Adobe helpx Lightroom export page returned 404** (`helpx.adobe.com/lightroom-classic/help/export-photos-disk-cd.html`); a practitioner source was used instead, though "option names match the shipping UI." | [raw/meta--privacy--lightroom-export-metadata-retention.md] |
| 15 | **Platform stripping test coverage is partial.** Only Instagram, Facebook and X were tested. Discord is "widely reported" but untested. LinkedIn, Reddit, Flickr, Google Photos, WhatsApp, Imgur, Pinterest and self-hosted/WordPress are **NOT TESTED, unconfirmed**. | [raw/meta--privacy--gps-tags-and-stripping-practice.md] |
| 16 | **Two different keep-ICC idioms** appear across the raw sources (`-all= -tagsfromfile @ -icc_profile` vs `-all= --icc_profile:all -tagsfromfile @ -colorspacetags`). They are not equivalent and no raw source reconciles them. | [raw/meta--exiftool--exiftool-org-application-docs.md], [raw/meta--exiftool--exiftool-org-faq.md] |
| 17 | **IPTC landing-page URL drift.** `https://iptc.org/standards/photo-metadata/photo-metadata-standard/` returns 404; the live landing page is `https://iptc.org/standards/photo-metadata/iptc-standard/`. | [raw/meta--iptc--photo-metadata-standard-2025-1.md] |
| 18 | **The publish-time strip command extended with DigitalSourceType is INFERRED and untested** against a real file in this pass. | this document (INFERRED) |
