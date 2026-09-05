# MakerNotes and which camera tags are actually present vs absent

- URL: https://exiftool.org/TagNames/index.html and https://photographylife.com/how-to-find-camera-shutter-actuations
- Fetched: 2026-08-17
- Source type: official-docs + practitioner

## ExifTool tag table groups

- **EXIF** — standard digital camera metadata (IFD0, ExifIFD, InteropIFD, SubIFD)
- **GPS** — geographic positioning (a sub-IFD of EXIF)
- **IPTC** — legacy IIM editorial block
- **XMP** — Adobe's extensible metadata platform (RDF/XML packet)
- **ICC_Profile** — colour space and rendering
- **JFIF** — JPEG file interchange header
- **Photoshop** — Adobe application-specific image resource blocks
- **PNG**, **QuickTime**, etc. — format-specific
- **MakerNotes** — vendor proprietary block
- **Composite** — derived pseudo-tags
- **File**, **System** — filesystem-level facts (FileSize, FileModifyDate, ImageWidth)

**Composite tags** are calculated by ExifTool from other tags rather than read from the file.
Examples: `Composite:LensID`, `Composite:ImageSize`, `Composite:Megapixels`,
`Composite:ScaleFactor35efl`, `Composite:CircleOfConfusion`, `Composite:HyperfocalDistance`,
`Composite:FOV`, `Composite:GPSPosition`, `Composite:SubSecDateTimeOriginal`,
`Composite:ShutterSpeed`, `Composite:Aperture`. They are **not writable directly** — writing a
Composite tag causes ExifTool to write the underlying real tags. This matters: a JSON dump will
show tags that do not physically exist in the file.

## MakerNotes manufacturers ExifTool parses

Canon, Nikon, Sony, FujiFilm, Olympus, Panasonic (and Leica, largely via Panasonic tables),
Pentax, Ricoh, Sigma, Kyocera, Minolta, Sanyo, Casio, JVC, Samsung, Apple, DJI, GoPro, FLIR,
Leaf, Lytro, PhaseOne, Reconyx, InfiRay, Qualcomm.

MakerNotes is an **opaque, undocumented, offset-dependent binary blob**. Consequences:
- It can only be copied as a whole block, never tag-by-tag.
- Copying requires also copying `Make` and `Model`, since those select the parser.
- Third-party editors routinely corrupt its internal offsets, producing ExifTool's
  `Possibly incorrect maker notes offsets (fix by -NNN?)` warning.
- Many exports drop it entirely.

## Which of the requested tags are typically PRESENT straight out of a camera

**Essentially always present** (standard EXIF, written by every camera):

| Tag | Group | Notes |
|---|---|---|
| Make | IFD0 | |
| Model | IFD0 | |
| FocalLength | ExifIFD | |
| FNumber | ExifIFD | |
| ExposureTime | ExifIFD | |
| ISO | ExifIFD | |
| ExposureProgram | ExifIFD | |
| MeteringMode | ExifIFD | |
| WhiteBalance | ExifIFD | but only Auto/Manual — see below |
| Flash | ExifIFD | present even when no flash fired (value `0x0`/`0x10`/`0x20`) |
| ColorSpace | ExifIFD | almost always `1` (sRGB) |
| Orientation | IFD0 | |
| DateTimeOriginal / CreateDate / ModifyDate | ExifIFD / IFD0 | all three, usually identical out of camera |
| Software | IFD0 | firmware version out of camera |

**Usually present, but body/lens dependent:**

| Tag | Notes |
|---|---|
| **LensModel** (0xa434) | Present on most ILC bodies from ~2012 onward with electronic lenses. **Absent** with fully manual/adapted lenses, and absent on many compacts and older bodies. |
| **LensInfo** (0xa432) | Less consistently written than LensModel. Many Canon bodies omit it while writing LensModel. Format is 4 rationals (min focal, max focal, min f at min focal, min f at max focal); a prime writes the same focal twice. |
| **FocalLengthIn35mmFormat** (0xa405) | Common on crop-sensor and compact cameras; **frequently absent on full-frame bodies**, where it would be redundant. Do not assume it exists. |
| **SubSecTime / SubSecTimeOriginal / SubSecTimeDigitized** (0x9290–0x9292) | Written by most modern ILCs (Canon, Nikon, Sony, Fuji). **Absent** on many older and entry-level bodies. Needed to disambiguate burst frames shot in the same second. |
| **BodySerialNumber** (0xa431) | Written by Nikon, Sony, Fujifilm, Pentax and recent Canon bodies. **Historically absent on many Canon models**, which put the serial in `MakerNotes:SerialNumber` instead. |
| **LensSerialNumber** (0xa435) | Much rarer than BodySerialNumber. Nikon and Sony write it for many native lenses; frequently absent or a placeholder string of zeros. |
| **OffsetTime / OffsetTimeOriginal / OffsetTimeDigitized** (0x9010–0x9012) | Added in EXIF 2.31 (2016). **Absent on anything older**, and still not written by all current bodies unless the camera has a timezone setting configured. This is the single most commonly missing "modern" tag. |

**Effectively never present as standard EXIF — MakerNotes only:**

| Tag | Reality |
|---|---|
| **ShutterCount** | **Not a standard EXIF tag at all.** It exists only in vendor MakerNotes, under different names per brand, and not at all for some brands. |

### ShutterCount by brand

| Brand | Availability | ExifTool tag |
|---|---|---|
| **Nikon** | Yes, in MakerNotes | `ShutterCount` |
| **Sony** | Yes, in MakerNotes | `ShutterCount` |
| **Pentax** | Yes, in MakerNotes | `ShutterCount` |
| **Fujifilm** | Yes, but named differently | `ImageCount` |
| **Canon** | **No.** "Most Canon cameras do not embed shutter count information into the EXIF data." Requires a tethered utility (e.g. ShutterCheck / EOSInfo) reading the camera over USB. | — |
| **Olympus** | No — hidden in-camera service menu | — |
| **Panasonic** | No — maintenance mode | — |
| **Leica** | Not documented in the source consulted — **unconfirmed** | — |

Reading commands:

```bash
exiftool -ShutterCount NikonFile.NEF
exiftool -ShutterCount SonyFile.ARW
exiftool -ImageCount FujiFile.RAF
exiftool -ShutterCount PentaxFile.DNG
```

Availability is strongest in **RAW** files straight from the camera. In-camera JPEGs usually
retain MakerNotes and therefore usually retain ShutterCount, but **any export through Lightroom
or Photoshop typically drops MakerNotes**, taking ShutterCount with it.

### Other MakerNotes-only detail worth knowing

The standard `WhiteBalance` enum has **only two values** (0 = Auto, 1 = Manual). Every richer
white-balance detail is vendor-specific:
`Canon:WhiteBalance`, `Nikon:WhiteBalance`, `Sony:WhiteBalance` carry preset names
("Daylight", "Shade", "Tungsten"); Kelvin values and fine-tuning live in MakerNotes or, after
raw processing, in `XMP-crs:Temperature` and `XMP-crs:Tint`.

Similarly vendor-only: focus point / AF area, drive mode, lens firmware, in-body stabilisation
state, internal temperature, battery state, shot number in burst, and the embedded JPEG preview
parameters.

## Practical rule

If a tag is needed reliably across bodies, restrict to the "essentially always present" list.
Anything in the second or third table must be treated as **optional** — code must tolerate its
absence rather than assume it.
