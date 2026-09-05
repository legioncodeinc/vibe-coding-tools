# MODELS-LIST

The ledger. Every ingested model gets a row here and a full record below,
written automatically by the ingestion procedure in
`guides/02-model-ingestion.md`.

This file is the skill's index of who it is allowed to work on. A model that
is not in this ledger has not been ingested, and the gate treats it as absent.

**Status: active models available.** Run the general and case-specific gates
before using any model.

---

## Roster

| Slug | Display name | Frames | Selects | Reference state | Allowed cases | Release on file | Ingested | Last run | Status |
|---|---|---|---|---|---|---|---|---|---|
| mario-aldayuz | Mario Aldayuz | 12 | 6 | visual-only | B | no | 2026-08-21 | 2026-09-04 | active |

---

## Records

Each ingested model gets a block in this shape. The attribute fields exist so
that a series stays consistent across runs, and so a reviewer can check an
output against a written standard rather than a memory of it.

<!-- BEGIN MODEL RECORD TEMPLATE, do not delete, copy below when ingesting -->

<!--
### <slug>

| Field | Value |
|---|---|
| Display name | |
| Folder | `models/<slug>-source/` |
| Ingested | YYYY-MM-DD |
| Source frames | |
| Selects | |
| Reference state | visual-only / capture-backed |
| Allowed cases | B / A, B |
| Release on file | yes / no |
| Release scope summary | |
| Brief | `models/<slug>-source/MODEL-BRIEF.md` |

**Build and proportions:**

**Facial structure:** face shape, jaw, cheekbones, nose, brow, chin

**Eyes:** shape, spacing, color

**Skin:** undertone, luminosity, specular behavior, texture notes

**Hair:** color, texture, length, part, typical styling

**Facial hair:**

**Distinguishing marks:** moles, scars, freckling, birthmarks, and where

**Never alter:**

**Capture basis:** for visual-only, unavailable and CASE A disabled; for
capture-backed, bodies, lenses, focal lengths, apertures and ISO range read
only from the registered CASE A source frames

**Registers in scope:**

**Out of scope:**

**Notes:**
-->

<!-- END MODEL RECORD TEMPLATE -->

### mario-aldayuz

| Field | Value |
|---|---|
| Display name | Mario Aldayuz |
| Folder | `models/mario-aldayuz-source/` |
| Ingested | 2026-08-21 |
| Source frames | 12 |
| Selects | 6 |
| Reference state | visual-only |
| Allowed cases | B |
| Release on file | no separate release; model self-authorization recorded |
| Release scope summary | Legion Code Inc. commercial, website, social, advertising, product, presentation, and marketing generation |
| Brief | `models/mario-aldayuz-source/MODEL-BRIEF.md` |

**Build and proportions:** Stocky, solid build with broad shoulders and a full torso (inferred from frames).

**Facial structure:** Round-to-oval face, broad lower face, full cheeks, moderately broad jaw, rounded chin, softly prominent cheekbones, moderately broad nose with rounded tip, and thick gently arched brows (inferred from frames).

**Eyes:** Dark brown, average-set, gently hooded upper lids (inferred from frames).

**Skin:** Warm-to-neutral undertone, light-medium to medium luminosity, balanced-to-slightly-oily T-zone response, visible pores and natural redness variation (inferred from frames).

**Hair:** Dark brown to black, straight, short, receding front hairline, usually under a flat-brim cap (inferred from frames).

**Facial hair:** Dense dark full beard and moustache, trimmed close-to-medium length with a rounded lower contour (inferred from frames).

**Distinguishing marks:** Broad smile, full cheek volume, thick brows, rounded nose tip, dark beard outline; partially visible upper-chest lettering tattoos must not be invented (inferred from frames).

**Never alter:** Identity-defining facial proportions, skin tone, eye color, brows, beard distribution, hairline, natural asymmetry, apparent age, or body build. Do not generate incidental people from the reference frames.

**Capture basis:** Visual-only; capture profile unavailable and CASE A disabled.

**Registers in scope:** Casual and branded clothing; futuristic Legion black/green combat armor; cinematic photorealistic commercial campaigns.

**Out of scope:** Reproduction of incidental people's likenesses; CASE A capture-based editing; false capture provenance.

**Notes:** Six references contain other adults whose consent was not separately stated. Their likenesses are explicitly excluded and are not part of the model definition.

---

## Ledger rules

1. Keep exactly one visible `## Roster` section. Its table header has exactly
   the ten cells shown above, in that order. Comments and fenced examples do
   not count as roster content.
2. Every canonical `<slug>-source/` folder has exactly one contiguous roster
   row, and no row may exist without its folder. A slug is lowercase letters
   or digits separated by single hyphens. The `_(none yet)_` sentinel is the
   only row allowed when there are no model folders and must be removed on
   first ingestion.
3. `Frames` and `Selects` are canonical integers that equal the gate's counts
   of unique, valid image payloads on disk. Every reference must have exactly
   one matching SHA-256 entry in `01-reference-frames/CHECKSUMS.txt`; every
   select must be a byte-identical copy of one of those verified references.
4. `Reference state` is exactly `visual-only` or `capture-backed`. `Allowed
   cases` is exactly `B` for visual-only and exactly `A, B` for
   capture-backed.
5. `Status` is exactly `active` or `retired`. A retired row remains in the
   ledger, but both generic use and an explicit request for that model are
   blocked; the explicit request returns `CASE_BLOCKED`.
6. One record accompanies each row. The slug is the folder name minus the
   `-source` suffix and is the model's identifier everywhere in the skill.
7. Skin is recorded as undertone plus luminosity plus specular behavior. It
   is not recorded as an ethnic category. The reason is practical as well as
   principled: undertone and specular behavior are what actually drive
   lighting and rendering decisions, and a category label does not.
   See `guides/08-skin-tone-rendering.md`.
8. The release fields record what the photographer stated. The skill does not
   verify them and makes no legal determination.
9. Ingestion is additive. Adding a model never modifies another model's
   folder, record or row.
10. If a model is retired, mark the row `retired` and keep the record. Deleting
   history makes a series impossible to audit later.
11. `Last run` is updated by scheduled and manual runs so the rotation logic in
   `guides/13-recurring-and-scheduled-runs.md` can avoid repeating a model.
12. Reference capability comes from `MODEL-STATE.json`, not from filename,
   apparent image quality or guessed EXIF. Visual-only is a valid CASE B state,
   not an incomplete model.
