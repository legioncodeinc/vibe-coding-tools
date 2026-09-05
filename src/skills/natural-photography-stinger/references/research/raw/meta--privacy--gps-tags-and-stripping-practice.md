# GPS EXIF tags and legitimate metadata-stripping practice

- URL: https://exiftool.org/TagNames/GPS.html and https://exifdata.org/blog/do-social-media-sites-strip-exif-data-2025-test
- Fetched: 2026-08-17
- Source type: official-docs + practitioner

## GPS tag reference (EXIF GPS IFD)

| Tag ID | Tag | Format |
|---|---|---|
| 0x0000 | GPSVersionID | int8u[4] |
| 0x0001 | GPSLatitudeRef | string[2] — `N` or `S` |
| 0x0002 | GPSLatitude | rational64u[3] — deg, min, sec |
| 0x0003 | GPSLongitudeRef | string[2] — `E` or `W` |
| 0x0004 | GPSLongitude | rational64u[3] — deg, min, sec |
| 0x0005 | GPSAltitudeRef | int8u — 0 = above sea level, 1 = below |
| 0x0006 | GPSAltitude | rational64u |
| 0x0007 | GPSTimeStamp | rational64u[3] — UTC h, m, s |
| 0x0008 | GPSSatellites | string |
| 0x0009 | GPSStatus | string[2] |
| 0x000d | GPSSpeed | rational64u |
| 0x0010 | GPSImgDirectionRef | string[2] — `T` true / `M` magnetic |
| 0x0011 | GPSImgDirection | rational64u — the bearing the camera was pointing |
| 0x0012 | GPSMapDatum | string |
| 0x001b | GPSProcessingMethod | undef |
| 0x001d | GPSDateStamp | string[11] — UTC date |
| 0x001f | GPSHPositioningError | rational64u — horizontal error in metres |

**Storage detail that matters:** latitude and longitude are stored as **unsigned** rational
triples (degrees, minutes, seconds). The hemisphere lives in a *separate* reference tag
(`GPSLatitudeRef` = N/S, `GPSLongitudeRef` = E/W). Deleting only `GPSLatitude` and
`GPSLongitude` while leaving the Ref tags — or vice versa — leaves an inconsistent, partially
identifying record. **Always delete the whole group.**

ExifTool exposes `Composite:GPSPosition`, a derived convenience tag combining lat/long with
their refs into a single signed decimal pair. It is not stored in the file.

Also note `GPSDateStamp` + `GPSTimeStamp` are **UTC**, so they leak the true absolute time even
if `DateTimeOriginal` has been altered, and `GPSHPositioningError` reveals how precise the fix
was.

## Why photographers legitimately strip metadata

These are ordinary professional and privacy practices, not evasion:

**1. GPS / location.**
- Protects the photographer's and subjects' home, school, and workplace addresses — a photo of
  a child in the garden geotags the family home to within metres.
- Protects sensitive shooting locations: nest sites of protected birds, rare plant populations,
  archaeological sites, and fragile landscapes that get trampled once coordinates circulate.
- Protects sources and subjects in journalism and documentary work.
- Removes the ability to reconstruct a person's movement pattern by aggregating many published
  photos.

**2. Serial numbers (`BodySerialNumber`, `LensSerialNumber`, `MakerNotes:SerialNumber`,
`ShutterCount`).**
- Serial numbers **link every photo you have ever published to the same physical body**,
  de-anonymising pseudonymous accounts and connecting personal and professional identities.
- They allow correlation of an anonymous leak with a named photographer's public portfolio.
- They expose equipment inventory to thieves, and (with ShutterCount) reveal camera wear —
  commercially sensitive when selling gear or bidding for work.

**3. Other quiet leaks.**
- `Software` reveals your exact toolchain and version, which is a fingerprint and an attack
  surface.
- `Artist` / `Copyright` / `OwnerName` may contain a legal name you did not intend to publish.
- Person keywords and face-region data name identifiable subjects.
- Camera Raw develop settings (`XMP-crs:`) expose your editing recipe.
- Thumbnails embedded in EXIF can retain **pre-crop, pre-retouch** image content — a genuine
  historical leak vector where the visible image was cropped but the thumbnail was not.

## Privacy best practice

- **Strip everything, then add back only what you intend to publish.** Allow-list, do not
  deny-list — a deny-list misses the tag you did not know existed.

  ```bash
  exiftool -all= -tagsFromFile @ \
    -EXIF:DateTimeOriginal -EXIF:Make -EXIF:Model \
    -EXIF:FNumber -EXIF:ExposureTime -EXIF:ISO -EXIF:FocalLength \
    -EXIF:Orientation -EXIF:ColorSpace -ICC_Profile \
    -XMP-dc:Creator -XMP-dc:Rights \
    -overwrite_original -P photo.jpg
  ```

- **Never edit the delivery file in place from the master.** Keep an unstripped archival master
  with full GPS and serials for your own catalogue, and strip only on the export copy.
- **Verify, do not trust the checkbox.** After any export or strip, confirm with
  `exiftool -a -G1 -s file.jpg` that nothing survived.
- Remember that **stripping is not reversible** and platform behaviour is not a substitute for
  doing it yourself.

## Do platforms strip metadata for you? — empirical 2025 test

Methodology: a smartphone photo with location services enabled was uploaded to each platform
via its mobile app, re-downloaded, and analysed with an in-browser EXIF viewer.

| Platform | Result |
|---|---|
| **Instagram** | Strips aggressively — "stripped nearly all of the original metadata" including GPS, camera info, timestamps |
| **Facebook** | Same — GPS coordinates, camera details, original timestamps "nowhere to be found" |
| **X / Twitter** | Downloaded image "free of any GPS coordinates, camera information" |
| Discord | Not tested here; "widely reported to remove metadata" |
| LinkedIn, Reddit, Flickr, Google Photos, WhatsApp, Imgur, Pinterest, self-hosted/WordPress | **NOT TESTED — unconfirmed** |

All tested platforms replaced the original metadata with their own server-side information.

**Two conclusions, and they pull in opposite directions:**

1. You cannot rely on platforms to protect you — coverage is inconsistent, untested for many
   services, and self-hosted sites strip nothing by default. Strip before upload.
2. The same aggressive stripping **destroys deliberately-authored provenance metadata** —
   IPTC DigitalSourceType, creator, copyright, and embedded C2PA manifests all die on upload to
   the major social platforms. This is precisely the behaviour California AB 853 targets from
   1 January 2027 by forbidding large online platforms from knowingly stripping compliant
   provenance data, and precisely why C2PA invests in soft bindings (watermark + fingerprint)
   rather than relying on embedded metadata alone.
