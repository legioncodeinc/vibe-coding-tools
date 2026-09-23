# exif-profiles/

Scene profiles for CASE B in `references/scripts/exif_apply.py`.

A profile describes the *technical characteristics of a depicted scene* so
the file's metadata is internally coherent rather than empty or
self-contradicting. A frame that depicts a dim indoor scene at f/1.9 should
not carry ISO 100, and a frame that depicts visible motion blur should not
carry 1/2000.

## What a profile may contain

Technical and authorship tags only:

`Make`, `Model`, `LensModel`, `LensInfo`, `FocalLength`,
`FocalLengthIn35mmFormat`, `FNumber`, `ExposureTime`, `ISO`,
`ExposureProgram`, `MeteringMode`, `WhiteBalance`, `Flash`, `ColorSpace`,
`Orientation`, `Artist`, `Copyright`, `Creator`, `Rights`.

## What a profile may never contain

The script refuses these outright and exits non-zero:

`BodySerialNumber`, `LensSerialNumber`, `SerialNumber`, `InternalSerialNumber`,
`CameraSerialNumber`, any `GPS*` tag, `DateTimeOriginal`, `CreateDate`,
`OffsetTimeOriginal`, `ImageUniqueID`, `OriginalRawFileName`, `ShutterCount`,
`ImageNumber`.

These name a specific physical capture event: this body, at this place, at
this moment. A CASE B image has no capture event, so there is nothing for
them to describe. If you want genuine values in these fields, the output has
to derive from a genuine frame, which is CASE A.

## Choosing coherent values

See the coherence tables in `guides/11-metadata-and-exif.md`. The short
version:

| If the scene shows | Then |
|---|---|
| Deep focus, everything sharp | Small sensor or narrow aperture. A phone at f/1.9 gives roughly f/8 to f/20 equivalent depth, so deep focus and a wide listed aperture are consistent on a phone and contradictory on a full frame body |
| Shallow focus, background dissolved | Large sensor, wide aperture, longer focal length, subject well separated from background |
| Visible motion blur | Shutter slower than about 1/60 for a walking subject, slower still for panning |
| Frozen action | 1/500 or faster |
| Visible luminance grain | ISO high for the sensor: above about 1600 on a phone, above about 3200 on full frame |
| Clean shadows, no grain | Base ISO, good light |
| Flash look, hot foreground, dark background | `Flash` set to fired, short exposure, background falling off |
| Golden hour warmth | `WhiteBalance` auto, and note the scene is 2500K to 3500K |

## Files here

| Profile | Depicts |
|---|---|
| `phone-selfie-indoor.json` | Front camera, arm's length, mixed indoor light |
| `phone-candid-daylight.json` | Rear main camera, third party candid, daylight |
| `ilc-portrait-85mm.json` | Interchangeable lens body, 85mm portrait, shallow depth |

Copy one, adjust to the scene you actually generated, and pass it with
`--profile`.
