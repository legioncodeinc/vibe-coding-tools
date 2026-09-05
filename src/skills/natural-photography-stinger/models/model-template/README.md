# model-template

This is the empty skeleton. It is a shape, not a model.

**Nothing in this folder is usable source material.** While `model-template`
is the only folder under `models/`, the skill stops before generating or
editing anything. That is deliberate and it is not a bug.

## Why the skill stops

This skill edits and augments photographs of real people. It works from
references the photographer captured or the model supplied/authorised, with
the subject's consent recorded.
Without ingested source material there is no subject, no likeness reference,
and no record of consent. Generating a person in that state would be
inventing one, which is a different activity from the one this skill is for.
An honest EXIF basis is additionally required for CASE A editing, but not for
CASE B generation from an explicitly acknowledged visual-only model.

So the gate is simple: no ingested model, no output.

## How to turn this into a real model folder

Do not edit this template in place. Copy it.

```
models/model-template/   ->   models/<slug>-source/
```

For a model named Mario, the destination is `models/mario-source/`. The slug
is lowercase, hyphen separated, no spaces.

The full procedure is in `guides/02-model-ingestion.md`. The short version:

1. Record consent and release status. The skill writes down what the
   photographer states. It does not verify it.
2. Copy this template to `models/<slug>-source/`.
3. Put the source photographs in `01-reference-frames/`.
4. Create the required `01-reference-frames/CHECKSUMS.txt`: exactly one
   SHA-256 entry per reference image, relative to that directory, and no
   entry for the manifest itself.
5. Set `MODEL-STATE.json` to `visual-only` or `capture-backed`. Visual-only
   requires explicit acknowledgement and allows CASE B only. Capture-backed
   registers the exact original files eligible for CASE A.
6. Extract EXIF only from registered capture-backed originals. Never infer or
   invent a capture profile for visual-only files.
7. Choose five or six selects and copy them byte-for-byte from the
   checksum-verified references into `02-selects/`; do not crop or re-encode.
8. Write `MODEL-BRIEF.md` and `RELEASE.md` from the templates in this folder.
   The release record must contain exactly one visible reference-file
   authorisation field whose value is exactly `yes`.
9. Add the ledger row to `models/MODELS-LIST.md`.

Run the gate to confirm the result is usable:

```bash
python3 references/scripts/preflight.py --json
```

## Folder contract

| Path | Holds | Notes |
|---|---|---|
| `01-reference-frames/` | Every usable source frame of this model plus required `CHECKSUMS.txt` | Hard minimum 12 unique valid images; manifest is one-to-one and excludes itself |
| `02-selects/` | The 5 or 6 frames passed to the model as references | Each is a byte-identical copy of a checksum-verified reference |
| `03-outputs/` | Generated and edited results | One subfolder per session or run is fine |
| `04-lineage/` | `.lineage.json` records written by the metadata layer | One per output, links source hash to result |
| `MODEL-STATE.json` | Machine-readable reference capability | Required. Visual-only permits B; registered capture sources permit A |
| `MODEL-BRIEF.md` | The model's attribute record and standing instructions | Required. The gate fails without it |
| `RELEASE.md` | What the photographer stated about consent and release scope | Required by the ingestion procedure |

## Reference states

`visual-only` accepts consented screenshots, social-media downloads and other
metadata-free derivatives when the photographer explicitly acknowledges the
limitation. They are likeness references for CASE B generation; they are not
evidence that a capture occurred and cannot be edited as CASE A.

`capture-backed` requires `visual_only_acknowledged: false` and at least one
authorised, attested original listed in `case_a_sources`. Only an exact,
checksum-verified listed source may pass the CASE A gate.
Other files in the same model folder remain usable as CASE B references but
do not inherit CASE A capability.

## Why the selects folder is small

Both platforms cap reference images, and the caps differ. OpenAI's edit
endpoint takes up to 16 inputs. Nano Banana Pro allows 5 characters, 6
objects and 3 style references inside a 14 input total. Five or six well
chosen frames covering different angles and lighting beat twenty redundant
ones, and they keep the call inside every limit at once.

## Adding more models later

Repeat the copy. Ingestion is additive and never touches an existing model
folder. The gate passes as soon as one model is usable and reports the others
separately.
