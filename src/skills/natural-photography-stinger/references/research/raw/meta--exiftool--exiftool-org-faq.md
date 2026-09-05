# ExifTool FAQ — Phil Harvey

- URL: https://exiftool.org/faq.html
- Fetched: 2026-08-17
- Source type: official-docs

## Deleting metadata

Delete everything from a JPEG:

```bash
exiftool -all= image.jpg
```

Safer strip that keeps the colour profile and colour-space tags (recommended for web export,
because dropping the ICC profile and ColorSpace tag makes images render with wrong colour):

```bash
exiftool -ext jpg -all= --icc_profile:all -tagsfromfile @ -colorspacetags DIR
```

**TIFF/RAW caveat:** `-exif:all=` does not fully strip EXIF from TIFF-based files (including
most RAW formats) because the image data itself lives in IFD0. Only the ExifIFD subdirectory
is removed; other IFD0 data is preserved by necessity.

## The `_original` backup

When ExifTool writes changes it renames the untouched input to `FILE_original` by default.
Suppress with `-overwrite_original` (deletes the backup) or `-overwrite_original_in_place`
(writes through the existing inode, preserving attributes/hard links).

## Copying metadata with -tagsFromFile

Basic:

```bash
exiftool -tagsfromfile src.jpg dst.jpg
```

By default information is copied to ExifTool's **preferred locations**, with preference order
EXIF > IPTC > XMP. That means a tag read from XMP in the source may be written to EXIF in the
destination. To preserve the original group structure exactly, add `-all:all`:

```bash
exiftool -tagsfromfile src.jpg -all:all dst.jpg
```

To force a cross-format copy, use explicit group redirection:

```bash
exiftool -tagsfromfile src.jpg "-xmp:all>exif:all" dst.jpg
```

Repair/rebuild corrupted EXIF by round-tripping everything through ExifTool's own writer:

```bash
exiftool -all= -tagsfromfile @ -all:all -unsafe -icc_profile bad.jpg
```

(`-unsafe` is required to copy tags ExifTool considers unsafe to write blindly, such as
`ThumbnailImage` and some offsets.)

## XMP specifics

- XMP is **always** encoded UTF-8.
- ExifTool converts these five characters to XML entity references when writing XMP:
  `&  <  >  '  "`
- XMP date/time values may be partial: `YYYY`, `YYYY:mm`, `YYYY:mm:dd`, or the full
  `YYYY:mm:dd HH:MM:SS` with optional timezone suffix `+HH:MM`, `-HH:MM`, or `Z`.

## MakerNotes preservation — critical rules

- **Changing `Make` or `Model` destroys MakerNotes**, because those tags are what identify the
  MakerNotes format to the parser.
- MakerNotes can only be copied as a **complete opaque block** — individual MakerNotes tags
  cannot be copied to another file. To copy them you must also copy Make and Model:

  ```bash
  exiftool -tagsfromfile src.jpg -makernotes -make -model dst.jpg
  ```

- Editing an image in other software commonly breaks MakerNotes offsets, producing the warning
  `Possibly incorrect maker notes offsets (fix by -340?)`. `-F` (`-fixBase`) attempts to
  auto-correct the base offset.

## Date/time tags

The three common metadata date/time tags, addressed together by the shortcut `AllDates`:

- **DateTimeOriginal** — when the photo was taken (shutter release)
- **CreateDate** — when the digital image/metadata was created
- **ModifyDate** — when the file was last modified

Filesystem dates (`FileModifyDate`, `FileCreateDate`, `FileAccessDate`) are distinct from
metadata dates. Use `-P` to preserve `FileModifyDate` across a metadata edit:

```bash
exiftool -alldates+=1 -P images/
```

Shift and derive:

```bash
exiftool "-datetimeoriginal<filemodifydate" image.jpg
exiftool -globaltimeshift -2 image.jpg
```

## EXIF vs XMP vs IPTC duplication

The three formats store overlapping information:

- **EXIF** — camera-originated, fixed binary structures (IFD0 / ExifIFD / GPS / InteropIFD),
  includes the vendor MakerNotes block.
- **XMP** — flexible RDF/XML packet, extensible via namespaces, the modern home for
  rights/description/provenance metadata.
- **IPTC (IIM)** — the older editorial/newsroom binary block; largely superseded by XMP but
  still read by many CMSes.

When the same logical tag exists in more than one format, ExifTool extracts only one value
unless `-a` (allow duplicates) is given. Contradictory values across formats are a common
source of confusion; `-a -G1 -s` shows exactly where each value lives:

```bash
exiftool -a -G1 -s image.jpg
```
