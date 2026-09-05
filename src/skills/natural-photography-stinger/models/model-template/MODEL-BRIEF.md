# MODEL BRIEF: <Model Name>

Copy this file into `models/<slug>-source/MODEL-BRIEF.md` and fill it in.
The skill reads this before every generation or edit. Leave nothing as a
placeholder; an unfilled field is treated as unknown, not as permission.

---

## 1. Identity

| Field | Value |
|---|---|
| Display name | |
| Folder slug | |
| Ingested on | |
| Ingested by | |
| Source frame count | |
| Selects chosen | |
| Reference state | visual-only / capture-backed |
| Allowed cases | CASE B only / CASE A for registered sources plus CASE B |

## 2. Consent and release

The skill records what the photographer states here. It does not verify any
of it and makes no legal determination.

| Field | Value |
|---|---|
| Signed release on file | yes / no |
| Release held by | |
| Release date | |
| Permitted uses (as stated) | |
| Excluded uses (as stated) | |
| Expiry or review date | |
| Contact for questions | |
| Supplied reference files authorised (mirror only) | copy `yes` from `RELEASE.md`; not authoritative |

If "Signed release on file" is anything other than yes, the ingestion
procedure requires that the photographer be told before the first run.
`RELEASE.md` is authoritative for reference-file workflow authorisation. This
brief field is a human-readable mirror and cannot grant permission or repair a
missing, conflicting or non-`yes` release-record field.

## 3. Physical attributes

Describe what has to stay consistent across a series. Write these as
rendering instructions, not as categories. See
`guides/08-skin-tone-rendering.md` for the vocabulary.

| Attribute | Description |
|---|---|
| Build and proportions | |
| Height (approximate) | |
| Face shape | |
| Jaw and chin | |
| Cheekbones | |
| Nose | |
| Eyes: shape, spacing, color | |
| Brows | |
| Mouth and smile character | |
| Skin: undertone | warm golden / cool pink / neutral / olive |
| Skin: luminosity | |
| Skin: specular behavior | matte / balanced / oily in T zone |
| Skin: texture notes | pore visibility, freckling, blemish pattern |
| Hair: color, texture, length, part | |
| Facial hair | |
| Distinguishing marks | moles, scars, birthmarks, and where |
| Glasses or dental appliances | |
| Piercings, tattoos, jewelry usually worn | |

## 4. Never alter

Anything listed here is preserved in every output without exception. This is
the model's own line, and the photographer's.

- 
- 

## 5. Reference provenance and capture basis

Copy the `reference_state` from `MODEL-STATE.json`. For `visual-only`, state
where the files came from and that capture metadata is unavailable; do not
infer a camera. Visual-only references support CASE B generation only. For
`capture-backed`, read the capture profile from the registered CASE A source
frames. Only those exact files are an honest metadata basis for CASE A.

| Field | Value |
|---|---|
| Reference source state | visual-only / capture-backed |
| Source limitations | |
| Registered CASE A sources | none / relative paths from MODEL-STATE.json |
| Bodies present in source | |
| Lenses present in source | |
| Typical focal lengths | |
| Typical apertures | |
| Typical ISO range | |
| Color space | |
| Phone models present | |

## 6. Standing rendering notes

Anything learned from experience that improves this model's results. Append
over time.

- Lighting that suits them:
- Angles that suit them:
- Angles to avoid and why:
- Expressions that read genuine on them:
- Wardrobe registers in scope:
- Settings in scope:

## 7. Out of scope

Scenarios, settings, wardrobe or contexts this model is not to be placed in,
whether for release reasons or personal preference.

- 
