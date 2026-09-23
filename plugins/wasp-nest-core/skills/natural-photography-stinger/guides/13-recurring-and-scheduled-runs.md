# 13: Recurring and Scheduled Runs

## What this guide is for

This guide covers running the skill unattended on a schedule, once at least one model has been
ingested. A scheduled run has no human in the loop at execution time, so everything a human would
normally catch has to be either checked mechanically before generation starts, or refused outright.

The three things this guide exists to prevent:

- A scheduled run producing images of a person whose consent was never recorded.
- A series that repeats itself, because every run picks the same shot type, the same light and the
  same setting.
- A run that guesses when it should have aborted, and leaves a plausible-looking artefact with a
  wrong provenance record.

## Load this when

- The photographer asks for a daily, weekly or "every Monday" run.
- You are setting up, editing or auditing a scheduled task that invokes this skill.
- A scheduled run failed and you are diagnosing why.
- You need the rotation state format or the run-report format.

Citation legend:
`[craft N]` = `references/research/distilled-photographic-craft.md`, section N.
`[meta N]` = `references/research/distilled-metadata-and-provenance.md`, section N.
`[models N]` = `references/research/distilled-image-models.md`, section N.

---

## Part 1: the precondition check

Run every check below before a scheduled run does anything else. All of them must pass. A failed
check aborts the run and writes a failure report; it never degrades into a guess.

1. **Model and capability gate.** Run
   `python3 references/scripts/preflight.py --json --model <slug> --case B`.
   Abort on any non-zero result. Code 2 maps to `E_NO_MODELS`; code 5 maps to
   `E_CASE_BLOCKED`; code 64 `INVALID_ARGUMENTS` maps to
   `E_GATE_ARGUMENTS`. Scheduled generation is CASE B, so a valid visual-only
   model is eligible.
2. **Model selection is explicit.** The scheduled task names the model slug, or the rotation state
   file names it. If neither does, abort with `E_NO_MODEL_SELECTED`. Never pick a model at random.
3. **Folder present.** `models/<slug>-source/` exists and contains `01-reference-frames/`. Abort with
   `E_MODEL_FOLDER_MISSING`.
4. **Brief present.** `models/<slug>-source/MODEL-BRIEF.md` exists, parses, and contains a
   **Never alter** section and a **Consent and release** section. A missing or malformed brief aborts
   with `E_NO_BRIEF`. Do not reconstruct a brief from the frames: an unattended run has nobody to
   confirm the guess with.
5. **Release and source-use authorisation recorded.** Read `RELEASE.md`, the
   authoritative record. It must contain exactly one visible `Whether the
   supplied reference files are authorised for this workflow` field whose
   value is exactly `yes`; any other value, absence or duplicate aborts with
   `E_RELEASE_NOT_RECORDED`. The brief may mirror this value but is not
   authoritative. The skill records rather than verifies the statement. If
   the separate signed-release field says `none on file` or `verbal only`, the
   run may proceed only if the scheduled task was created with that
   acknowledgement, and the report must carry the marker in its first line.
6. **Restrictions read.** Load the brief's `Restrictions` line and the `Never alter` list into the
   run context now. If a restriction would be violated by the run's own configuration (for example a
   scheduled workplace-themed series against a model who asked for no workplace implication), abort
   with `E_RESTRICTION_CONFLICT`.
7. **Reference frames available.** The required
   `01-reference-frames/CHECKSUMS.txt` is a strict one-to-one SHA-256 manifest
   for every reference image and excludes itself. `02-selects/` holds exactly
   5 or 6 unique valid images, each a byte-identical copy of one verified
   reference. Abort with `E_REFERENCES_MISSING` on any missing, extra,
   duplicate, invalid or mismatched entry/file.
8. **Rotation state readable.** `models/ROTATION-STATE.json` exists and parses, or is created fresh
   with the defaults in Part 2. A corrupt state file aborts with `E_STATE_CORRUPT` rather than being
   silently reinitialised, because reinitialising resets the anti-repetition guarantee.
9. **Output directory writable.** `models/<slug>-source/03-outputs/` and `runs/` exist or can be
   created.
10. **API reachable.** Perform a cheap liveness check before building anything. An unreachable API
    aborts with `E_API_UNREACHABLE` (see Part 5).

Write the result of all ten checks into the run report, pass or fail. A run report that does not
show the precondition results is not a valid run report.

---

## Part 2: categorical rotation

A series repeats when successive runs land on the same combination. Rotation is the mechanism that
stops that. Five axes vary independently.

### The axes

**Axis 1: shot type.** Ordered by how photorealistic each type reads, from the within-people ranking
`[craft 1.4]`:

| Value | Detection accuracy (lower is more photorealistic) |
|---|---|
| `portrait` | 72.7% |
| `candid-single` | modelled on the candid-group register, 73.4% |
| `environmental` | mid |
| `posed-group` | 76.2%, use sparingly |
| `full-body` | 77.2%, use sparingly |

Weight the rotation toward `portrait` and `candid-single`; posed groups and full-body figures carry a
3.5 to 4.5 percentage point detection penalty and only 3% bottom-decile representation for posed
groups `[craft 1.4]`. A reasonable cycle is portrait, candid-single, environmental, portrait,
candid-single, full-body.

**Axis 2: wardrobe register.** Drawn from the brief's wardrobe register list, never invented:
`everyday`, `workwear`, `outdoor`, `formal`, `athletic`, `seasonal-layers`. Remove any register the
brief marks off-limits.

**Axis 3: setting.** `domestic-interior`, `workplace`, `street`, `cafe-or-bar`, `park-or-green`,
`transit`, `doorway-or-threshold`, `vehicle`. Settings must be consistent with the model's
restrictions.

**Axis 4: lighting.** Each value carries its own physical specification, so the rotation also varies
the physics rather than just the label:

| Value | Specification |
|---|---|
| `golden-hour` | 2500 to 3500 K, sun 6 degrees above to 6 degrees below the horizon, long gentle shadows, warm skin with cyan sky fill: a genuine two-temperature scene `[craft 4.4]`. |
| `midday` | around 5400 K, sun 60 to 90 degrees, short hard shadows underneath, raccoon-eye sockets, hot forehead and nose `[craft 4.4]`. |
| `overcast` | around 6800 K, whole sky as source, near-shadowless, faint top-down shading, one large soft catchlight band `[craft 4.4]`. |
| `window-near` | Subject 2 to 4 ft from the window: bright side 2 to 3 stops over the shadow side, background 3 to 4 stops down, visible gradient across the face, large rectangular catchlight `[craft 4.5]`. |
| `window-far` | Subject 10+ ft from the window: even, flat, low contrast, tiny catchlight, background nearly as bright as the subject `[craft 4.5]`. |
| `mixed-interior` | 2800 to 3000 K lamps plus a 6500 K window plus 4300 K overhead fluorescent: warm faces, blue window spill, green ceiling bounce, and a green/magenta tint that survives white balance `[craft 4.3]`, `[craft 4.7]`. |
| `direct-flash` | Flat frontal light, hard shadow displaced just behind the subject, specular hotspots on forehead, nose and cheekbones, background falling to black, slight blue-white cast against a warm room `[craft 4.6]`. |
| `blue-hour` | Sun 4 to 8 degrees below the horizon, 10,000 K+ `[craft 4.4]`. |

**Axis 5: device and capture register.** This determines the implied optics and must agree with
everything else:

| Value | Implication |
|---|---|
| `phone-main` | 24 to 26 mm equivalent, depth of field like full frame at f/6.8 to f/8.2, so the whole room is sharp and any separation is synthetic `[craft 2.2]`. Lifted shadows, compressed highlights, flat global tone `[craft 2.5]`. |
| `phone-ultrawide` | 13 mm equivalent, equivalent aperture around f/15 to f/20, everything sharp `[craft 2.2]`. |
| `phone-2x` | A sensor crop of the 24 mm lens, so it keeps 24 mm perspective geometry despite 48 mm framing `[craft 2.2]`. |
| `ilc-35` | 35 mm, working distance 3 to 5 ft `[craft 3.2]`. |
| `ilc-50` | 50 mm, 4 to 6 ft `[craft 3.2]`. |
| `ilc-85` | 85 mm at f/1.4 to f/1.8, 6 to 10 ft, background out of focus but still readable `[craft 3.6]`. |
| `ilc-135` | 135 mm at f/2.8 to f/3.5, 10 to 15+ ft, background melted `[craft 3.6]`. |

For capture-backed models, use device values that appear in the capture
profile or that the photographer explicitly authorised for a novel scene.
For visual-only models, there is no capture profile: use only a scene profile
the photographer explicitly authorised, describe it as an implied register,
and never claim the references prove ownership or use of that device.

### The rotation state file

Store at `models/ROTATION-STATE.json`. One block per model.

```json
{
  "version": 1,
  "models": {
    "jordan-lee": {
      "run_count": 7,
      "cursors": { "shot": 2, "wardrobe": 4, "setting": 1, "lighting": 6, "device": 3 },
      "recent_combos": [
        "portrait|everyday|domestic-interior|window-near|ilc-85",
        "candid-single|outdoor|street|golden-hour|phone-main",
        "environmental|workwear|workplace|mixed-interior|ilc-35"
      ],
      "last_run": "2026-08-17T09:00:00Z",
      "last_case": "B"
    }
  }
}
```

Rules for advancing it:

11. Advance each cursor by a **different stride** each run: shot by 1, wardrobe by 2, setting by 3,
    lighting by 1, device by 2, each modulo its list length. Different strides against different list
    lengths means the full combination does not recur until the strides and lengths align, rather
    than every run walking in lockstep.
12. After computing a candidate combination, check it against `recent_combos`. If the exact string is
    present, advance the `setting` cursor by 1 and recheck. Retry up to 5 times, then accept and note
    `rotation_collision: true` in the run report.
13. Keep `recent_combos` at the last **8** entries. Drop the oldest.
14. Write the state file **after** the run completes, not before. A run that aborts must not consume
    a rotation slot; otherwise repeated failures silently burn through the cycle.
15. Write atomically: write to a temporary file, then rename. A half-written state file is
    `E_STATE_CORRUPT` on the next run.
16. Never share a cursor block between models. Two models on the same schedule must not march in
    step, or the series looks like one shoot with two subjects.

### Coherence constraint

17. After selecting a combination, verify it is physically coherent before building the prompt.
    `golden-hour` plus `domestic-interior` is possible but needs a window; `direct-flash` plus
    `midday` outdoors is contradictory; `phone-ultrawide` plus a shallow-depth-of-field portrait is
    impossible, because the ultra-wide equivalent aperture is around f/15 to f/20 `[craft 2.2]`. If
    the combination is incoherent, advance the offending axis by one and recheck. Note the
    substitution in the run report.

---

## Part 3: situational context for the run

A rotation gives a valid combination. It does not give a reason for the photograph to exist. Pull a
plausible scenario from whatever context source is reachable, in this order, and stop at the first
that returns something usable.

18. **Contextual memory or meeting-notes MCP** (for example Littlebird). Query for recent activity,
    themes, locations or events in the last 7 days. Use it to derive a scenario, never to derive a
    person: the subject is always the ingested model, regardless of who appears in the context.
19. **Calendar.** Look at the next 24 to 72 hours for a plausible situation type (a trip, an
    outdoor event, an evening out, a working day). Take the *type*, not the details.
20. **Seed list.** A plain text file at `models/<slug>-source/SCENARIO-SEEDS.md`, one scenario per
    line, maintained by the photographer. Pick the line at index `run_count mod line_count`.
21. **Fallback when nothing is reachable.** Do not skip the run and do not invent a specific
    real-world event. Fall back to a generic scenario derived from the rotation combination alone:
    the setting plus the lighting plus the time of day implied by the lighting. Record
    `context_source: "fallback-generic"` in the run report. A generic scenario is honest; a
    fabricated meeting is not.

Hard rules for context use:

22. **Never name a real third party** pulled from a calendar or meeting note in a generated image or
    its metadata. The model is the only person in the frame unless the photographer has ingested a
    second consented model and explicitly authorised a multi-subject run.
23. **Never place the model at a specific real address, venue or workplace** derived from context.
    Use the category ("a cafe", "an office corridor"), not the name.
24. **Never let context override a restriction** from the brief. Restrictions win.
25. Record which source was used and what was taken from it. A run report that says "used context"
    without saying which context is not auditable.

---

## Part 4: the unattended-run report

Every scheduled run writes exactly one report, whether it succeeded or failed, to
`runs/<YYYY-MM-DD>-<HHMM>-<slug>.md`. Write the report even when the run aborts at precondition 1.

```markdown
# Run report: 2026-08-17 09:00 UTC

## Outcome
STATUS: success | aborted | partial
Release marker: <none | RELEASE none on file | RELEASE verbal only>

## Preconditions (all ten, pass/fail, with the detail that matters)
1 model gate: pass | 2 model selected: pass (jordan-lee, from rotation state) | 3 folder: pass
4 brief: pass | 5 release recorded: pass (reference use: yes; signed 2026-03-14, scope: portfolio + social)
6 restrictions read: pass ("no workplace endorsement implication") | 7 references: pass (6 selects,
checksums verified) | 8 rotation state: pass | 9 output dir: pass | 10 api reachable: pass

## Model
- Slug: jordan-lee
- Reference state: visual-only | capture-backed
- Allowed case for this run: B (case-specific gate passed)
- Brief: models/jordan-lee-source/MODEL-BRIEF.md
- Reference frames used (path + sha256, one per line):
  - 02-selects/DSC_0412.NEF  a1b2...
  - ...

## Category combination
- shot: candid-single | wardrobe: outdoor | setting: park-or-green | lighting: golden-hour |
  device: ilc-85
- rotation collision: false | coherence substitution: none

## Context
- Source: littlebird | calendar | seed-list | fallback-generic
- Taken from it: "<one line, what was used>"
- Discarded: "<anything deliberately not used, e.g. named third parties>"

## Generation
- Path: CASE A (edit of real frame) | CASE B (novel scene)
- Source frame (CASE A only): <absolute path> sha256 <digest>
- Model/endpoint: gemini-3-pro-image via <endpoint>
- Parameters: <verbatim>
- Prompt: <full text, or path to the saved prompt file>
- Iterations: 2
- Outputs: 03-outputs/<file> sha256 <digest>

## Metadata
- Case: A | B
- DigitalSourceType written: <full URI>
- Capture identity: copied from source frame | none (novel scene, no borrowed EXIF)
- Privacy strip applied: yes/no
- Verified with: exiftool -a -G1 -s <file>

## Review (guide 14)
- Score: 88/100 | Verdict: pass | revise | reject | Failed items: <list, or none>

## Failures and warnings
- <error code and one-line explanation, or "none">

## Next run
- Rotation cursors after this run: shot 3, wardrobe 6, setting 4, lighting 7, device 5
```

26. Never overwrite a previous report. One file per run, timestamped.
27. If the run aborted, fill in the preconditions section, the failure code, and leave the rest
    empty. An abort report is the most useful report there is.
28. Surface the report to the photographer through whatever notification path the scheduled task was
    configured with. A report nobody reads is a log, not a report.

---

## Part 5: failure handling

A scheduled run has no human to ask, so ambiguity resolves to abort, never to a guess.

### Conditions that must abort the run

| Code | Condition | Why it aborts rather than guessing |
|---|---|---|
| `E_GATE_ARGUMENTS` | Preflight returned code 64 `INVALID_ARGUMENTS`. | The invocation is malformed, so no model/capability conclusion can be drawn. Fix the arguments before retrying. |
| `E_NO_MODELS` | `models/` holds only `model-template/`. | No consented source material exists. |
| `E_CASE_BLOCKED` | The selected model's state does not permit the configured case/source, or its roster status is `retired`. | A scheduler may not expand a model's capability or reactivate a retired person. Use CASE B for visual-only, or register an authorised, attested original before CASE A. |
| `E_NO_BRIEF` | `MODEL-BRIEF.md` missing, unparseable, or missing its Never-alter or consent section. | The preserve list and the consent record both come from the brief. Without it the run would generate a likeness with no constraints and no recorded permission. Do not reconstruct it from the frames. |
| `E_RELEASE_NOT_RECORDED` | `RELEASE.md` is missing/incomplete, or its one authoritative reference-file authorisation field is absent, duplicated or not exactly `yes`. | The skill records rather than verifies, but an absent or non-affirmative source-use record is not permission. The brief mirror cannot replace it. |
| `E_RESTRICTION_CONFLICT` | The run configuration violates a stated restriction. | Restrictions are the model's, not the photographer's, to waive. |
| `E_REFERENCES_MISSING` | The one-to-one reference checksum manifest fails, or selects are not exactly 5 or 6 unique byte-identical copies of verified references. | Likeness fidelity and source identity depend on these verified files; an unattended run cannot repair or reinterpret them. |
| `E_API_UNREACHABLE` | The image API returns a connection error, 5xx, or auth failure. | Retry twice with backoff (60 s, 300 s), then abort. Do not switch providers to get an image out. |
| `E_MODEL_SUBSTITUTION` | The provider silently served a different model. | See the capacity-fallback rule below. |
| `E_STATE_CORRUPT` | Rotation state unparseable. | Reinitialising destroys the anti-repetition history. |
| `E_MODERATION_REFUSAL` | The provider refuses the prompt. | Record the refusal text verbatim and stop. Never rephrase to evade a refusal. Nano Banana Pro hard-refuses prompts involving prominent real people `[models 8.2]`; if that fires for a private consented model, the prompt is describing something other than what was intended. |
| `E_REVIEW_REJECT` | Guide 14 returns `reject`. | Deliver nothing. Keep the artefact for inspection and report the failed items. |
| `E_METADATA_UNVERIFIED` | The post-write `exiftool -a -G1 -s` read (guide 11) does not show the expected `XMP-iptcExt:DigitalSourceType`. | An undisclosed synthetic image is worse than no image. Note that DigitalSourceType lives only in XMP, with no EXIF or IIM fallback, so a strip in the wrong order removes it silently `[meta 3.1]`, `[meta 6.3]`. |

### The capacity-fallback rule

29. **Disable `allow_fallback_model`.** On Replicate it falls back to `bytedance/seedream-5` when
    Nano Banana Pro is at capacity `[models 5.2]`. In an unattended run this silently changes the
    generating model, which changes the skin rendering, the noise character, the provenance signals
    embedded in the output, and the truth of the run report.
30. If a fallback is detected after the fact (the response names a model other than the one
    requested), abort with `E_MODEL_SUBSTITUTION`, discard the output, and record both model names.
31. A capacity abort is a good outcome. The next scheduled firing will try again, and the rotation
    slot was not consumed (rule 14).

### Things that are warnings, not aborts

32. `rotation_collision: true` after 5 retries. Proceed and note it.
33. A coherence substitution on one axis. Proceed and note it.
34. `context_source: fallback-generic`. Proceed and note it.
35. Guide 14 returning `revise` on a scheduled run: iterate up to the guide 10 limit of three, then
    if still `revise`, deliver nothing, keep the artefact, and report `partial`. An unattended run
    does not ship a "good enough" likeness.

---

## Part 6: create the schedule with a durable mechanism

36. **Create scheduled runs with the platform's durable scheduled-task mechanism**, the one that
    persists outside the conversation and starts a fresh session on each firing.
37. **Do not use an in-session scheduler**, a sleep loop, a background timer, or a "remind me later"
    that delivers back into the current conversation. An in-session scheduler dies with the session:
    when the session ends, the container stops or the process is reclaimed, the schedule is gone,
    silently, and the photographer finds out weeks later that the series stopped.
38. Because each firing starts a fresh session with no memory of the conversation that created it,
    the scheduled prompt must be a **complete standalone instruction**. Include: the skill to invoke,
    the model slug (or "use the rotation state"), the output location, the notification preference,
    and an explicit statement of which failure conditions must abort rather than improvise.
39. Encode the schedule in UTC. Convert the photographer's local time using the offset in effect,
    and shift the day fields if the conversion crosses midnight.
40. Set the cadence no finer than the review capacity. Daily unattended generation with a weekly
    human review means six days of unreviewed output; prefer weekly runs with a report the
    photographer actually reads.
41. After creating the schedule, tell the photographer: the cadence, the next fire time, the model,
    where reports land, and how to pause it. Store the same facts at the top of
    `models/ROTATION-STATE.json` under a `schedule` key so a future session can find them without
    the photographer.
42. When editing an existing schedule, update it in place rather than deleting and recreating, so
    the run history stays attached.
