# IPTC Photo Metadata Standard 2025.1

- URL: https://iptc.org/std/photometadata/specification/IPTC-PhotoMetadata-2025.1.html
- Fetched: 2026-08-17
- Source type: standard

## Version

- **Current version: 2025.1 (revision 1)**
- **Release date: 26 November 2025**
- Versioned spec URLs follow the pattern
  `https://iptc.org/std/photometadata/specification/IPTC-PhotoMetadata-<YYYY>.<N>.html`
  (2023.1, 2023.2, 2024.1, 2025.1 all resolve). The unversioned
  `https://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata` redirects to the
  latest.
- Note: `https://iptc.org/standards/photo-metadata/photo-metadata-standard/` returns 404;
  the live landing page is `https://iptc.org/standards/photo-metadata/iptc-standard/`.

## Structure

The standard defines two schemas, both expressed in XMP:

**IPTC Core** — descriptive, rights, and contact properties. Uses:
- IPTC Core namespace: `http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/` (prefix `Iptc4xmpCore`)
- Dublin Core: `http://purl.org/dc/elements/1.1/` (prefix `dc`)
- Photoshop: `http://ns.adobe.com/photoshop/1.0/` (prefix `photoshop`)
- XMP Rights: `http://ns.adobe.com/xap/1.0/rights/` (prefix `xmpRights`)

**IPTC Extension** — richer administrative, provenance, artwork, person, location, and
licensing properties. Uses:
- IPTC Extension namespace: `http://iptc.org/std/Iptc4xmpExt/2008-02-29/` (prefix `Iptc4xmpExt`)
- PLUS namespace: `http://ns.useplus.org/ldf/xmp/1.0/` (prefix `plus`) for licensing properties

Note the Extension namespace URI retains the historical date `2008-02-29` and does **not**
change with spec versions.

## Digital Source Type — property definition

- **Property name:** Digital Source Type
- **XMP namespace prefix:** `Iptc4xmpExt`
- **Namespace URI:** `http://iptc.org/std/Iptc4xmpExt/2008-02-29/`
- **XMP property path:** `Iptc4xmpExt:DigitalSourceType`
- **ExifTool tag:** `XMP-iptcExt:DigitalSourceType`
- **Data type:** closed choice of Text [External]
- **Cardinality:** 0..1
- **Controlled vocabulary: required — IPTC Digital Source Type NewsCodes**
  (`http://cv.iptc.org/newscodes/digitalsourcetype/`)
- **IIM equivalent:** none
- **Exif equivalent:** none

Definition: specifies the type of digital source for the image — whether it originated as a
photograph, digital camera capture, or another digital creation method.

Because there is no IIM or Exif equivalent, Digital Source Type exists **only** in the XMP
packet (or in a C2PA manifest as an IPTC assertion). Stripping XMP removes it entirely; there
is no EXIF fallback location.

## Consumption

Google Image Search reads a defined subset for image rights display:
`dc:creator`, `photoshop:Credit`, `dc:rights`, `xmpRights:WebStatement`, `plus:LicensorURL`,
and `Iptc4xmpExt:DigitalSourceType`.
