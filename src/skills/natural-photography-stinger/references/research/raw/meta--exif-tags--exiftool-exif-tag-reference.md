# ExifTool EXIF Tag Reference — camera-populated tag set

- URL: https://exiftool.org/TagNames/EXIF.html
- Fetched: 2026-08-17
- Source type: official-docs

Authoritative table of standard EXIF tags: tag ID, the IFD they live in, and their format.
Group column matters — writing a tag to the wrong IFD is a common failure.

## Camera and lens identity

| Tag | ID (hex) | Group | Format | Notes |
|---|---|---|---|---|
| Make | 0x010f | IFD0 | string | Manufacturer. Changing this **destroys MakerNotes**. |
| Model | 0x0110 | IFD0 | string | Model name. Changing this **destroys MakerNotes**. |
| LensModel | 0xa434 | ExifIFD | string | Lens model designation |
| LensInfo | 0xa432 | ExifIFD | rational64u[4] | "4 rational values giving focal and aperture ranges" — min focal, max focal, min f-number at min focal, min f-number at max focal |
| LensMake | 0xa433 | ExifIFD | string | Lens manufacturer |
| LensSerialNumber | 0xa435 | ExifIFD | string | |
| BodySerialNumber | 0xa431 | ExifIFD | string | "Called BodySerialNumber by the EXIF spec." |
| CameraSerialNumber | 0xc62f | IFD0 | string | DNG-era tag, distinct from BodySerialNumber |

## Exposure

| Tag | ID | Group | Format |
|---|---|---|---|
| ExposureTime | 0x829a | ExifIFD | rational64u |
| FNumber | 0x829d | ExifIFD | rational64u |
| ShutterSpeedValue | 0x9201 | ExifIFD | rational64s (APEX) |
| ApertureValue | 0x9202 | ExifIFD | rational64u (APEX) |
| ExposureCompensation | 0x9204 | ExifIFD | rational64s |
| FocalLength | 0x920a | ExifIFD | rational64u |
| FocalLengthIn35mmFormat | 0xa405 | ExifIFD | int16u |
| DigitalZoomRatio | 0xa404 | ExifIFD | rational64u |

## Sensitivity and metering

| Tag | ID | Group | Format | Notes |
|---|---|---|---|---|
| ISO | 0x8827 | ExifIFD | int16u[n] | "Has maximum value of 65535" — cameras exceeding this use ISOSpeed / RecommendedExposureIndex |
| ISOSpeed | 0x8833 | ExifIFD | int32u | Extended-range ISO (EXIF 2.3+) |
| ExposureProgram | 0x8822 | ExifIFD | int16u | |
| MeteringMode | 0x9207 | ExifIFD | int16u | |
| ExposureMode | 0xa402 | ExifIFD | int16u | |

## Colour, flash, geometry

| Tag | ID | Group | Format | Notes |
|---|---|---|---|---|
| WhiteBalance | 0xa403 | ExifIFD | int16u | Only Auto/Manual at EXIF level; the actual preset lives in MakerNotes |
| ColorSpace | 0xa001 | ExifIFD | int16u | |
| Flash | 0x9209 | ExifIFD | int16u | Bit-field |
| Orientation | 0x0112 | IFD0 | int16u | 8 rotation/mirror values |
| SceneCaptureType | 0xa406 | ExifIFD | int16u | "Value of 4 is non-standard, used by Samsung" |

## Date and time

| Tag | ID | Group | Format | Notes |
|---|---|---|---|---|
| ModifyDate | 0x0132 | IFD0 | string | "Called DateTime by EXIF spec." |
| DateTimeOriginal | 0x9003 | ExifIFD | string | "Date/time when original image taken" — the shutter release |
| CreateDate | 0x9004 | ExifIFD | string | "Called DateTimeDigitized by EXIF spec." |
| OffsetTime | 0x9010 | ExifIFD | string | "Time zone for ModifyDate" |
| OffsetTimeOriginal | 0x9011 | ExifIFD | string | "Time zone for DateTimeOriginal" |
| OffsetTimeDigitized | 0x9012 | ExifIFD | string | "Time zone for CreateDate" |
| SubSecTime | 0x9290 | ExifIFD | string | "Fractional seconds for ModifyDate" |
| SubSecTimeOriginal | 0x9291 | ExifIFD | string | "Fractional seconds for DateTimeOriginal" |
| SubSecTimeDigitized | 0x9292 | ExifIFD | string | "Fractional seconds for CreateDate" |

Date/time string format is `YYYY:MM:DD HH:MM:SS` (colons in the date, note). Offset format is
`+HH:MM` / `-HH:MM`. SubSecTime is a **string of digits** representing the fraction after the
decimal point, e.g. `"47"` means .47 s — it is not an integer count.

The `AllDates` shortcut writes DateTimeOriginal + CreateDate + ModifyDate together.

## Attribution

| Tag | ID | Group | Format | Notes |
|---|---|---|---|---|
| Artist | 0x013b | IFD0 | string | "Becomes list-type when MWG module loaded" |
| Copyright | 0x8298 | IFD0 | string | "May contain photographer and editor notices" (NULL-separated) |
| Software | 0x0131 | IFD0 | string | Processing software identifier — firmware version straight out of camera, editor name after editing |

## Enumerated values

### ExposureProgram (0x8822)
```
0 = Not Defined
1 = Manual
2 = Program AE
3 = Aperture-priority AE
4 = Shutter speed priority AE
5 = Creative (Slow speed)
6 = Action (High speed)
7 = Portrait
8 = Landscape
9 = Bulb            (non-standard, used by Canon)
```

### MeteringMode (0x9207)
```
0 = Unknown
1 = Average
2 = Center-weighted average
3 = Spot
4 = Multi-spot
5 = Multi-segment
6 = Partial
255 = Other
```

### ColorSpace (0xa001)
```
0x1    = sRGB
0x2    = Adobe RGB
0xfffd = Wide Gamut RGB
0xfffe = ICC Profile
0xffff = Uncalibrated
```
Note: the overwhelming majority of real camera JPEGs carry `0x1` (sRGB). `0xffff`
(Uncalibrated) is what cameras write when set to Adobe RGB in some models, with the real
space indicated by InteropIndex `R03`.

### Orientation (0x0112)
```
1 = Horizontal (normal)
2 = Mirror horizontal
3 = Rotate 180
4 = Mirror vertical
5 = Mirror horizontal and rotate 270 CW
6 = Rotate 90 CW
7 = Mirror horizontal and rotate 90 CW
8 = Rotate 270 CW
```
Real-world distribution: 1, 6, and 8 cover virtually all camera output. 2/4/5/7 (mirrored)
essentially never occur from a camera.

### WhiteBalance (0xa403)
```
0 = Auto
1 = Manual
```
This is the whole standard EXIF enumeration — only two values. Any finer detail
("Daylight", "Cloudy", "Tungsten", Kelvin value) is vendor-specific and lives in MakerNotes
(e.g. `Canon:WhiteBalance`, `Nikon:WhiteBalance`) or in `XMP-crs:WhiteBalance` /
`XMP-crs:Temperature` after raw processing.

### Flash (0x9209)
Bit-field, decoded by ExifTool into strings. Common real values:
```
0x0  = No Flash
0x1  = Fired
0x5  = Fired, Return not detected
0x7  = Fired, Return detected
0x8  = On, Did not fire
0x9  = On, Fired
0x10 = Off, Did not fire
0x18 = Off, Did not fire, Return not detected
0x20 = No flash function
0x41 = Fired, Red-eye reduction
0x59 = Auto, Fired
0x5d = Auto, Fired, Return not detected
0x5f = Auto, Fired, Return detected
```
Bit 0 = fired; bits 1-2 = return detection; bits 3-4 = flash mode (compulsory/auto);
bit 5 = no flash function; bit 6 = red-eye reduction.
