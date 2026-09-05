# Reading and writing IPTC metadata on the command line using ExifTool — IPTC Knowledge Base

- URL: https://iptc.atlassian.net/wiki/spaces/PMD/pages/649330691/Reading+and+writing+IPTC+metadata+on+the+command+line+using+ExifTool
- Fetched: 2026-08-17
- Source type: official-docs

IPTC's own guidance on driving ExifTool for IPTC Photo Metadata. Authoritative for the exact
group prefixes IPTC expects.

## Reading

Dump everything:

```bash
exiftool <image file name>
```

Read Digital Source Type specifically:

```bash
exiftool -XMP-iptcExt:digitalsourcetype IPTC-PhotometadataRef-Std2021.1.jpg
```

(Tag names are case-insensitive on the command line.)

Read Creator as JSON with group prefixes:

```bash
exiftool -G1 -json -XMP-dc:creator test-image.jpg
```

Read a **structured** property — `-struct` keeps the XMP struct nesting rather than flattening
it into `LicensorName`/`LicensorURL` pseudo-tags:

```bash
exiftool -G1 -json -struct -XMP-plus:Licensor test-image.jpg
```

Read the set of properties Google Image Search consumes (rights + provenance):

```bash
exiftool -G1 -XMP-dc:creator -XMP-photoshop:Credit -XMP-dc:rights \
  -XMP-xmpRights:WebStatement -XMP-plus:LicensorURL \
  -XMP-iptcExt:DigitalSourceType test-image.jpg
```

## Writing

Mark a file as AI-generated:

```bash
exiftool -XMP-iptcExt:digitalsourcetype=https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia test-image.jpg
```

Full rights + provenance write for a real photograph:

```bash
exiftool -XMP-dc:creator="Jane Smith" \
  -XMP-photoshop:Credit="Jane Smith, Smith Photography Ltd" \
  -XMP-dc:rights="Copyright Smith Photography Ltd 2023" \
  -XMP-xmpRights:WebStatement="http://smithphotography.com/licensing/" \
  -XMP-plus:LicensorURL="http://www.mypictureagency.com/obtain-licence/" \
  -XMP-iptcExt:DigitalSourceType="https://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture" \
  test-image.jpg
```

Append to a repeatable (list-type) property:

```bash
exiftool '-XMP-dc:creator+=New Creator' test-image.jpg
```

## Notes

- IPTC uses the `XMP-iptcExt:` group prefix for Extension-schema properties and `XMP-iptcCore:`
  for Core-schema ones. `XMP-dc:`, `XMP-photoshop:`, `XMP-xmpRights:` and `XMP-plus:` cover the
  borrowed namespaces.
- IPTC's own examples write the NewsCodes URI with `https://` even though the CV scheme URI is
  declared `http://`. See the digitalsourcetype file for this discrepancy.
- `-struct` is required for round-tripping structured properties (Licensor, ArtworkOrObject,
  PersonInImage with details, LocationCreated) without lossy flattening.
