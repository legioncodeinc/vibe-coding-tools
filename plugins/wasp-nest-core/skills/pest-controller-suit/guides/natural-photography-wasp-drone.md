# natural-photography-wasp-drone

## Domain
This Drone produces and retouches photographs of real people who have given recorded consent, holding itself to whether an experienced eye would take the result for a real frame. It runs a preflight gate before any work, classifies each job as an edit of an exact registered source or a generation of a new scene, applies imperfection-led realism prompting, and writes honest EXIF through a three-case metadata layer (inherit, scene, publish) rather than hand-rolling exiftool. It calls gpt-image-2 or Nano Banana Pro depending on the task. It has no mode that invents a subject or scrapes a face from the public web.

## Paired Stinger
[natural-photography-stinger](../../natural-photography-stinger) - the preflight and model-ingestion gate, prompt-construction and imperfection guides, camera/lighting/skin-tone reference, the metadata-case rules, and the quality-review checklist.

Realism is subtractive: the stinger's imperfection pass is what names back the focus miss, the mixed color temperature, and the grain a real capture leaves behind.

## Trigger phrases
- "generate a photo of <model>"
- "retouch this frame"
- "make this look like a real phone photo"
- "ingest a new model"
- "run the photo rotation"
- "write the EXIF for this output"
- "set up a model folder"
- "strip metadata before publishing"

## Do NOT route when
- The task is graphic design or illustration with no photographic subject: out of scope for this Drone.
- The request asks for a person who is not an ingested, consented model: the preflight gate refuses this, and this Drone does not route around it by offering a stock or placeholder face.
- The task is stock image sourcing or video work: neither is covered by this Drone's stinger.
- The task is a security review of this skill's scripts: that is `security-wasp-drone`, which must run before any commit touching them.
- The request would transplant one photograph's genuine capture identity (serial number, GPS, timestamp) onto a different image: the metadata script refuses this regardless of who asks.

## Inputs the Drone needs
- A passing preflight gate result (`preflight.py --json`); a non-zero exit code stops the job and, on code 2, the Drone offers ingestion and waits rather than proceeding
- The model's brief and release record, checked against the requested scope
- Whether the job names one exact source frame (an edit, CASE A) or has none (a generation, CASE B), decided before prompting begins
- The target platform (gpt-image-2 or Nano Banana Pro) chosen by task requirements
- Whether the model is capture-backed or visual-only, since a visual-only model is usable for generation but never for editing an exact source frame

## Outputs
- A generated or retouched image that has passed the imperfection pass and the quality-review checklist score
- Metadata written through the script under the correct case: inherited genuine EXIF for CASE A, internally coherent technical EXIF with no borrowed serials or GPS for CASE B, or stripped location and identifiers for CASE C publishing
- A report stating which model was used, which metadata case applied, the review score, and which gate stopped the job if it did
- A stated reason whenever the choice between gpt-image-2 and Nano Banana Pro mattered for the outcome

## Commonly sequenced with
- `security-wasp-drone` before any commit: runs a security pass on this skill's scripts
- `quality-wasp-drone` after security, never before: runs the quality-assurance pass on this skill's scope
- `library-wasp-drone` on scope changes: authors the PRD or IRD if this skill's scope changes

The preflight gate is enforced in code, not just judgment: a non-zero exit code always ends the job before any output is produced.
