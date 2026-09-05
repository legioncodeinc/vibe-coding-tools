---
name: natural-photography-stinger
description: Photographic generation and editing for consented model work using gpt-image-2 or Nano Banana Pro. Supports capture-backed references and explicitly acknowledged visual-only references, with capability-gated editing, imperfection-led realism prompting, and honest EXIF handling.
license: Proprietary
metadata:
  version: 1.1.0
  domain: photography
  pairs_with: natural-photography-worker-bee
  research_archive: references/research/
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch
---

# natural-photography-stinger

A working photographer's skill for producing and retouching photographs that
read as real. It exists because the thing that makes an image convincing is
not polish, it is the specific texture of imperfection that real capture
leaves behind: a focus miss, a mixed color temperature, grain that stays
constant across the blurred parts of the frame.

It operates on **ingested models**: people whose consent is on record and
whose reference images the operator states they are authorised to use. Those
references may come from the photographer's captures or directly from the
model, including an account export. The skill records that statement; it does
not verify ownership or make a legal determination. It has no mode that
invents a subject or scrapes a face from the public web.

## Requirements

Use Python 3.9 or later. Metadata-writing paths require ExifTool on `PATH`
(tested with 12.76 and 13.59). Generation requires access to OpenAI Images or
Replicate. Visual-only ingestion and preflight do not require ExifTool.

## Run the gate first. Every time.

```bash
python3 references/scripts/preflight.py --json
```

| Code | Meaning | Action |
|---|---|---|
| 0 | READY | Proceed |
| 2 | NO_MODELS | **Stop.** Only `model-template/` exists. Offer to ingest |
| 3 | INCOMPLETE | **Stop.** Report the named problems, offer to fix |
| 4 | BAD_LAYOUT | **Stop.** Broken install |
| 5 | CASE_BLOCKED | **Stop that operation.** The model is valid, but its source state does not permit the requested case |
| 64 | INVALID_ARGUMENTS | **Stop.** Fix the invocation before retrying; a case requires `--model`, CASE A requires `--source`, and `--source` is valid only with CASE A. Scheduled runs report `E_GATE_ARGUMENTS` |

On code 2, tell the user there is nothing to work from, ask for the model's
name and source photographs, and wait. Do not generate a placeholder person
to demonstrate the workflow, do not use a stock or web-sourced face, and do
not proceed because the request seems harmless. The gate is the reason this
skill is safe to run unattended.

Full procedure: [guides/01-preflight-and-model-gate.md](guides/01-preflight-and-model-gate.md)

After classifying the job, run the capability-specific gate too:

```bash
python3 references/scripts/preflight.py --json --model SLUG --case B
python3 references/scripts/preflight.py --json --model SLUG --case A --source ABSOLUTE_SOURCE_PATH
```

A model may be `visual-only`: consented, explicitly acknowledged reference
images whose original capture metadata is unavailable. Such a model is usable
for CASE B generation. It is never usable for CASE A editing. CASE A requires
the exact source frame to be registered in `MODEL-STATE.json` as an
authorised, attested original capture and verified against its required
checksum manifest.

## Workflow

1. **Gate.** Preflight, choose the model, read its state, brief and release record, then run the case-specific gate.
2. **Classify.** Edit of an exact registered, checksum-verified source in a
   capture-backed model, or generation of a new scene. This choice determines
   the metadata case, so make it now.
3. **Build the prompt.** Slot model, then the imperfection pass. The
   imperfection pass is not optional; it is where realism comes from.
4. **Call the platform.** gpt-image-2 or Nano Banana Pro, chosen by task.
5. **Review.** Score against the checklist before anything is delivered.
6. **Write metadata.** The correct case, via the script. Never by hand.

## The metadata rule

EXIF describing a capture event may only be carried by an image that derives
from that capture event.

| Case | When | What happens |
|---|---|---|
| A | Output derives from an exact registered, checksum-verified source in a capture-backed model | Inherit that frame's genuine capture EXIF in full. Log its verified hash and file identity to output lineage |
| B | Novel scene, no single source frame | Write internally coherent technical EXIF. Body serial, lens serial, GPS and capture timestamp are refused |
| C | Publishing | Strip location and identifiers, preserve technical and rights data |

CASE A is what a Lightroom export does and it is correct. CASE C is ordinary
privacy practice. CASE B refuses borrowed capture identity because a serial
number and a timestamp from a different photograph would assert that a frame
was exposed that never was. The script enforces this and exits non-zero
rather than writing it.

Reference-image metadata and output metadata are separate concerns. A
visual-only reference may guide likeness in CASE B even when it carries no
EXIF. The generated output still follows CASE B and may never borrow or imply
the reference file's capture identity.

Run it, do not hand-roll exiftool:

```bash
python3 references/scripts/exif_apply.py inherit --source SRC.jpg --target OUT.jpg
python3 references/scripts/exif_apply.py scene   --target OUT.jpg --profile PROFILE.json
python3 references/scripts/exif_apply.py publish --target OUT.jpg
```

## Platform note

The real OpenAI image model is **`gpt-image-2`** (consumer name ChatGPT
Images 2.0, alias `chatgpt-image-latest`). There is no image model called
"Sol 5.6 ULTRA". `gpt-5.6-sol` is a text-only reasoning model and cannot
generate images, though it is a good planner in front of `gpt-image-2`.
Nano Banana Pro is **`gemini-3-pro-image`**, reachable on Replicate as
`google/nano-banana-pro`. Details and the selection matrix:
[guides/12-model-selection-and-api.md](guides/12-model-selection-and-api.md)

## File map

Load on demand. Do not read everything up front.

| Guide | Load when |
|---|---|
| [01-preflight-and-model-gate.md](guides/01-preflight-and-model-gate.md) | Always, first |
| [02-model-ingestion.md](guides/02-model-ingestion.md) | Onboarding a new model |
| [03-prompt-construction.md](guides/03-prompt-construction.md) | Building any prompt |
| [04-authenticity-imperfection.md](guides/04-authenticity-imperfection.md) | Always, with 03. The core of the skill |
| [05-shot-types-and-angles.md](guides/05-shot-types-and-angles.md) | Choosing framing |
| [06-camera-and-lens-reference.md](guides/06-camera-and-lens-reference.md) | Choosing a device and optics |
| [07-lighting-reference.md](guides/07-lighting-reference.md) | Specifying light |
| [08-skin-tone-rendering.md](guides/08-skin-tone-rendering.md) | Any human subject |
| [09-wardrobe-registers.md](guides/09-wardrobe-registers.md) | Specifying clothing |
| [10-editing-real-frames.md](guides/10-editing-real-frames.md) | Retouching a captured frame |
| [11-metadata-and-exif.md](guides/11-metadata-and-exif.md) | Writing any metadata |
| [12-model-selection-and-api.md](guides/12-model-selection-and-api.md) | Choosing and calling a platform |
| [13-recurring-and-scheduled-runs.md](guides/13-recurring-and-scheduled-runs.md) | Unattended or scheduled runs |
| [14-quality-review-checklist.md](guides/14-quality-review-checklist.md) | Before delivering anything |

| Reference | Contains |
|---|---|
| `references/research/distilled-photographic-craft.md` | Optics, lighting, sensor and skin-tone findings, cited |
| `references/research/distilled-image-models.md` | Platform parameters, limits, prompting doctrine, cited |
| `references/research/distilled-metadata-and-provenance.md` | ExifTool, IPTC, C2PA, regulation, cited |
| `references/research/raw/` | 73 primary sources behind the above |
| `references/scripts/` | `preflight.py`, `exif_apply.py` |
| `references/templates/exif-profiles/` | CASE B scene profiles |
| `models/` | The roster, the ledger and the template |

## Two things this skill will not do

It will not generate a person who is not an ingested, consented model. That
is what the gate is for.

It will not treat a screenshot, platform download or other visual-only
reference as a captured source frame for CASE A. Adding an attested original
later unlocks CASE A only for the exact paths registered in
`MODEL-STATE.json`.

It will not write a real camera's serial number, GPS coordinate or capture
timestamp onto an image that did not come from that capture. Stripping
metadata is fine and supported. Inheriting genuine capture data through an
edit is fine and supported. Transplanting one photograph's capture identity
onto a different image is the line, and the script enforces it.

Everything else the photographer asks for is in scope.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you
  must make every attempt to search the internet, related knowledge base
  documentation files, and other available resources to supplement your
  knowledge prior to proceeding with your task.
- Run the gate before every job. A non-zero exit code stops the job.
- Classify the metadata case before building the prompt, not after.
- Related Stingers:
  - [security-stinger](../security-stinger) - Security audit pass. Run before any commit that touches this skill's scripts.
  - [quality-stinger](../quality-stinger) - Quality assurance pass. Runs after security.
  - [library-stinger](../library-stinger) - PRD and IRD authorship if this skill's scope changes.
