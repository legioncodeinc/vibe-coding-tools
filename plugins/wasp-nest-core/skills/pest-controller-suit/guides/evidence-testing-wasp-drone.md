# evidence-testing-wasp-drone

## Domain
Records verifiable proof that a change works: drives the live app itself under an annotated recording, runs headless screenshot-and-probe sequences on machines without a GUI, or captures measured before and after numbers for non-UI changes. Packages evidence.mp4 (or screenshot set), report.md, and manifest.json, stamped with the revision, and posts them to the PR and tracker issue. Marks unrunnable tests untested with reasons instead of skipping them silently.

## Paired Stinger
[evidence-testing-stinger](../../evidence-testing-stinger) - artifact contract, annotation protocol (setup, test_start, assertion), path selection, revision stamping, posting etiquette.

## Trigger phrases
- "prove this works"
- "record evidence of this fix"
- "show me it working, don't tell me"
- "verify the behavior on video"
- "measured before and after for this change"
- "headless proof for the CI box"

## Do NOT route when
- The change only needs a still before-and-after image pair of a visual diff; that is before-after-wasp-drone.
- The task is authoring the unit or e2e test suite for the stack; that is the stack's test skills.
- The task is auditing implementation against the plan document; that is quality-wasp-drone.

## Inputs the Drone needs
- Test targets phrased as testable statements.
- The PR and tracker issue when posting is wanted.
- Environment facts: GUI or headless, deployment URL or local port, recorder availability.

## Outputs
- evidence.mp4 (or screenshots/ set), report.md, and manifest.json in the task artifacts folder.
- The evidence posted to the PR (body appended, never overwritten) and linked from the tracker issue, or delivered as paths.
