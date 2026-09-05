# Lightroom Classic export — what metadata is retained vs dropped

- URL: https://photographylife.com/best-lightroom-export-settings
- Fetched: 2026-08-17
- Source type: practitioner

> Accessibility note: Adobe's own helpx pages for the Lightroom export dialog render their
> bodies client-side; WebFetch retrieved only navigation. `helpx.adobe.com/lightroom-classic/
> help/export-photos-disk-cd.html` returned 404. This practitioner source is used instead;
> option names match the shipping UI.

## The Metadata panel "Include" dropdown

Lightroom Classic's export dialog has a Metadata panel whose **Include** dropdown selects how
much metadata is written into the exported file. Options, from most to least restrictive:

**Copyright Only**
Strips nearly all EXIF, including capture date/time. Retains only the copyright field. This is
the most aggressive normal setting — it also removes DateTimeOriginal, which surprises people.

**Copyright & Contact Info Only**
As above plus the IPTC creator/contact fields (creator, email, website, phone, address).

**All Except Camera & Camera Raw Info**
Retains temporal and capture data plus IPTC/descriptive fields, but **hides the camera model and
exposure settings** as well as the Camera Raw develop settings.

**All Except Camera Raw Info**
Retains most EXIF — camera, lens, exposure settings, dates — but omits the Lightroom/Camera Raw
develop adjustments. **This is the setting most photographers want**: it is what lets Flickr,
500px etc. display camera settings under the photo, without publishing your editing recipe.

**All Metadata**
Everything, including camera info and the full Camera Raw processing settings. Makes your
develop settings publicly readable.

## Privacy checkboxes

**Remove Person Info**
Strips person-type keywords / face-recognition regions, so named subjects are not exposed in
the delivered file. Note: community reports have flagged versions where this did not work
reliably (e.g. "person info not removed during export since 11.0"), so **verify with ExifTool
rather than trusting the checkbox**.

**Remove Location Info**
Strips GPS coordinates from the export. The stated practitioner rationale is twofold: protecting
subject privacy, and protecting fragile or lesser-known shooting locations from being overrun
once coordinates are public.

**Write Keywords as Lightroom Hierarchy**
Preserves hierarchical keyword structure (`Nature|Birds|Raptors`) rather than flattening, for
round-tripping back into Lightroom.

## What a normal Lightroom export actually does to the file

Regardless of the Include setting, exporting from Lightroom **re-renders the image**, so the
output is a new file rather than the original with edits:

- **MakerNotes are dropped.** Lightroom writes its own EXIF block; the vendor proprietary blob
  does not survive. This is why **ShutterCount, focus-point data, and vendor white-balance
  presets disappear on export** even with "All Metadata" selected. (The source consulted does
  not state this explicitly — it is the well-established behaviour, and follows necessarily from
  ExifTool's rule that MakerNotes only survive as a copied opaque block. **Flagged as inferred,
  not directly cited.**)
- **`Software` is rewritten** to identify Adobe Lightroom and the version, replacing the camera
  firmware string.
- **Camera Raw develop settings** are written into the `XMP-crs:` namespace unless excluded.
- **ColorSpace / ICC profile** is set from the export colour space setting (sRGB, Adobe RGB,
  ProPhoto), not inherited.
- **Orientation** is baked into the pixels and normalised to 1.
- **DateTimeOriginal is preserved** under all settings except Copyright Only / Copyright &
  Contact Info Only.

## Consequence for provenance work

If you want a specific metadata state in a delivered file, do **not** rely on the export dialog
alone. Export with the closest setting, then apply the exact tags with ExifTool as a
post-export step. The export is lossy and its exact behaviour varies across Lightroom versions.
