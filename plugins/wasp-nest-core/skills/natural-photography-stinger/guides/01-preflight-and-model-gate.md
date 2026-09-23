# 01: Preflight and the model gate

**What this guide is for.** The first thing the skill does on every
invocation, before any prompt is written and before any API is called.

**Load this when.** Always. This runs first, every time, including on
scheduled and unattended runs.

---

## 1. Run the gate

```bash
python3 references/scripts/preflight.py --json
```

Read the exit code. It is the whole decision.

| Code | Status | Meaning | Action |
|---|---|---|---|
| 0 | READY | At least one model folder validates | Proceed to step 3 |
| 2 | NO_MODELS | Only `model-template/` exists | **Stop.** Go to step 2a |
| 3 | INCOMPLETE | Model folders exist, none validates | **Stop.** Go to step 2b |
| 4 | BAD_LAYOUT | `models/` missing or malformed | **Stop.** Report a broken install |
| 5 | CASE_BLOCKED | The model record is valid, but the requested case/source is not allowed | **Stop that operation.** Go to step 2c |
| 64 | INVALID_ARGUMENTS | The gate invocation is invalid | **Stop.** Fix the invocation; scheduled runs report `E_GATE_ARGUMENTS` |

The gate is not advisory. Do not proceed on a non-zero code because the user
asked you to, because the request seems harmless, or because you could
produce something plausible without it. If the user insists, explain what is
missing and offer to ingest.

## 2a. NO_MODELS: offer ingestion

Nothing has been ingested, so there is no consented source material. Say so
plainly and make the next step easy. Something close to:

> There is no model ingested yet, so there is nothing for me to work from.
> Give me the model's name and their source photographs and I will set up
> their folder. I need at least 12 usable frames, ideally 24 to 40, covering
> a range of angles, lighting conditions and expressions.

Then stop and wait. Specifically, do not:

- generate a placeholder or example person to demonstrate the workflow
- proceed using a stock or web-sourced face
- infer a subject from conversation and build them
- produce "just a test image" of anybody

When the user supplies name and photographs, follow
`guides/02-model-ingestion.md`.

## 2b. INCOMPLETE: report and repair

The gate names the specific problem per folder. The common ones:

| Problem reported | Fix |
|---|---|
| `missing MODEL-BRIEF.md` | Write it from `models/model-template/MODEL-BRIEF.md` |
| `MODEL-BRIEF.md is still the unfilled template` | Fill it in. A copied template is not a brief |
| `no source frames found` | Put the photographs in `01-reference-frames/` |
| `only N source frames (hard minimum 12, target 24)` | Add frames. The hard minimum is not waived; degraded consistency is only a warning between 12 and 23 |
| `missing 01-reference-frames/CHECKSUMS.txt` or checksum error | Create a strict one-to-one SHA-256 manifest for every reference image; exclude the manifest itself |
| `select is not a copy of a checksum-verified reference` | Replace it with a byte-identical copy from `01-reference-frames/` |
| `RELEASE.md ... authorisation must be yes` | Record explicit source-use authorisation as exactly `yes` in the one visible authoritative release field |

Report exactly what the gate said, offer to fix it, and stop.

## 2c. CASE_BLOCKED: keep the model, refuse the operation

This is not a broken ingestion. It means the model is usable, but not for the
requested path. The common case is a `visual-only` model being used for CASE
A, or a capture-backed model being edited from a source path that is not in
`MODEL-STATE.json.case_a_sources`. An explicitly requested model whose roster
status is `retired` is also `CASE_BLOCKED`; generic runs skip it.

Report the capability boundary. Offer CASE B generation, or ask the
photographer to add and register an original capture. Never promote a file to
CASE A from apparent quality, filename or EXIF alone.

Code 64 is not a model result. It means required arguments were missing or
combined incorrectly. Do not reinterpret it as `INCOMPLETE`; correct the
invocation and map it to `E_GATE_ARGUMENTS` in unattended reports. A
case-specific gate requires `--model`; CASE A requires `--source`; and
`--source` is valid only with CASE A.

## 3. Confirm the working model

If the gate lists more than one usable model, and the request does not name
one, ask which. Do not pick for the user. On an unattended run, use the
rotation state described in `guides/13-recurring-and-scheduled-runs.md`
rather than choosing arbitrarily.

Then load, in order:

1. `models/<slug>-source/MODEL-STATE.json` for reference capability and the
   exact CASE A source allowlist
2. `models/<slug>-source/MODEL-BRIEF.md` for attributes, never-alter items and
   the capture basis
3. `models/<slug>-source/RELEASE.md` for the recorded consent scope
4. `models/MODELS-LIST.md` for the ledger row

## 4. Scope check against the release record

Compare the request against the "Excluded uses" and "Out of scope" fields.
If the request falls in either, stop and raise it with the photographer
rather than proceeding.

`RELEASE.md` must contain exactly one visible line named `Whether the supplied
reference files are authorised for this workflow`, and its value must be
exactly `yes`. This is mandatory. The similarly named field in
`MODEL-BRIEF.md` is a non-authoritative mirror and cannot substitute for it.

Separately, if `Signed release on file` is anything other than `yes`, or if
either of the two generative-specific questions in `RELEASE.md` is `unknown`,
flag it once before the first run of a session. Those questions cover AI
assisted editing and generated scenes beyond the original shoot.

The skill records what the photographer stated. It does not verify it and it
makes no legal determination. Say so when you flag, and do not pretend to
adjudicate.

## 5. Classify the job before building anything

Every job is one of two shapes, and the shape determines the metadata case
downstream. Decide now, not later.

| Job shape | What it is | Metadata case | Guide |
|---|---|---|---|
| Edit | A specific captured frame is retouched or altered | CASE A | `guides/10-editing-real-frames.md` |
| Generate | A new scene is built from reference frames | CASE B | `guides/03-prompt-construction.md` |

An edit names its source frame. If you cannot name a single source frame,
it is a generation, whatever it is called in the request. This matters
because CASE A inherits a real capture's EXIF and CASE B may not.

Run the case-specific gate after classification:

```bash
python3 references/scripts/preflight.py --json --model <slug> --case B
python3 references/scripts/preflight.py --json --model <slug> --case A --source <absolute-source-path>
```

CASE B accepts both `visual-only` and `capture-backed` models. CASE A accepts
only the exact authorised, attested original source paths registered in a
capture-backed model's state file and verified by the required checksum
manifest. Metadata-free visual references never become CASE A sources merely
because they are stored beside an original.

## 6. Preflight checklist

Before writing a prompt, confirm all of these:

- [ ] Gate returned 0
- [ ] Working model chosen and its slug recorded
- [ ] `MODEL-STATE.json` read and the requested case/source is allowed
- [ ] Required one-to-one reference checksums passed; selects are byte-identical copies of verified references
- [ ] `MODEL-BRIEF.md` read, never-alter list noted
- [ ] `RELEASE.md` read, source-use authorisation is exactly `yes`, request within stated scope
- [ ] Job classified as edit or generate
- [ ] Metadata case selected and recorded for the handoff
- [ ] Case-specific gate returned 0
- [ ] Target platform chosen per `guides/12-model-selection-and-api.md`
- [ ] Output destination is `models/<slug>-source/03-outputs/`

Only then continue to prompt construction.
