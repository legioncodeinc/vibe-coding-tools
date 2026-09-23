# models/

Where the skill keeps the people it is allowed to work on.

## For the agent reading this at runtime

Before you generate or edit anything, run the gate:

```bash
python3 references/scripts/preflight.py --json
```

Act on the exit code. Do not skip it, and do not proceed on a failing code
because the user asked you to.

| Code | Status | What you do |
|---|---|---|
| 0 | READY | Proceed. Use only the models the gate listed as usable. |
| 2 | NO_MODELS | **Stop.** Nothing has been ingested. Tell the user, then offer to ingest: ask for the model's name and their source photographs, and follow `guides/02-model-ingestion.md`. |
| 3 | INCOMPLETE | **Stop.** Model folders exist but none validates. Report the specific problems the gate listed and offer to fix them. |
| 4 | BAD_LAYOUT | **Stop.** The skill is not installed correctly. Report it. |
| 5 | CASE_BLOCKED | **Stop the requested operation.** The model is valid, but its reference state does not permit that case or source. |
| 64 | INVALID_ARGUMENTS | **Stop.** Fix the gate invocation before retrying; a case requires `--model`, CASE A requires `--source`, and `--source` is valid only with CASE A. Scheduled runs report `E_GATE_ARGUMENTS`. |

`CASE_BLOCKED` also covers an explicitly requested model whose roster status
is `retired`; generic runs skip retired rows.

On code 2 the message to the user is short and concrete. Something close to:

> There is no model ingested yet, so there is nothing to work from. Give me
> the model's name and their source photographs and I will set up their
> folder. I need at least 12 usable frames, ideally 24 to 40, covering
> different angles, lighting and expressions.

Then wait. Do not generate a placeholder person to demonstrate the workflow.

## Layout

```
models/
├── README.md              this file
├── MODELS-LIST.md         the ledger: every ingested model, with attributes
├── model-template/        the empty skeleton, copied per model, never edited
└── <slug>-source/         one per ingested model
    ├── MODEL-BRIEF.md
    ├── RELEASE.md
    ├── MODEL-STATE.json
    ├── 01-reference-frames/
    ├── 02-selects/
    ├── 03-outputs/
    └── 04-lineage/
```

## For the human reading this

This folder is the reason the skill is safe to run on a schedule.

Everything the skill produces is anchored to a named person whose reference
photographs you supplied and whose consent you recorded. There is no mode
where it invents a subject. If the folder is empty, the skill refuses to run
rather than filling the gap with a stranger.

Reference provenance is capability-scoped. A `visual-only` model may use
explicitly acknowledged screenshots or platform downloads for CASE B novel
scenes even when their capture metadata is gone. It cannot run CASE A. A
`capture-backed` model can run CASE A only when the exact source path is in
`MODEL-STATE.json.case_a_sources`; unrelated visual references in the same
folder do not inherit that capability.

That refusal is the point. It means an unattended run at 3am cannot quietly
drift into generating someone who does not exist, and it means every output
traces back to a specific person, an authorised reference set and a consent
record you can point at. Capture-backed CASE A additionally traces to one
exact registered, checksum-verified capture.

The ledger in `MODELS-LIST.md` is the audit trail. Every model that has ever
been ingested is in it, including retired ones, with the attributes that were
recorded and the release status you stated at the time.

## What the skill records about a person, and what it does not

It records what it needs to render them consistently: build, facial
structure, skin undertone and how their skin handles specular light, hair,
eyes, distinguishing marks, and anything you flag as never-alter.

It records skin as undertone, luminosity and specular behavior rather than as
an ethnic category. That is not squeamishness, it is that undertone and
specular response are the properties that actually determine how to light
someone, and a category label is not. `guides/08-skin-tone-rendering.md`
explains the underlying optics.

It does not build a searchable face database, and it does not keep reference
imagery of anyone who is not an ingested, consented model of yours.
