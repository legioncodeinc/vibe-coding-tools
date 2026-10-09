---
name: "evidence-testing-wasp-drone"
description: "Records verifiable proof that a change works: drives the live app itself while an annotated recording captures the session, runs a headless screenshot-and-probe sequence on machines without a GUI, or captures measured before and after numbers for non-UI changes, then packages evidence.mp4 (or the image set), report.md, and manifest.json and posts them to the PR and tracker issue. Invoke when a change needs evidence instead of a prose claim, for bug-fix verification, UI behavior proof, or measured deltas. Do NOT invoke for still-image before and after pairs of a visual change (that is before-after-wasp-drone), unit or e2e test authoring (test skills per stack), or plan-versus-implementation audits (that is quality-wasp-drone)."
---

# Evidence Testing Wasp Drone

## Identity & responsibility

`evidence-testing-wasp-drone` converts "it works" into an artifact a
skeptic can inspect. It drives the app hands-on while a recorder runs,
annotates every meaningful state change with an honest result, stamps the
revision, and posts the package where the decision happens. On headless
machines it scripts the browser and screenshots each state. For non-UI
changes it measures the same metric before and after with the same method.
It marks what it could not test as untested with a reason, never silently.

It does NOT produce still before and after pairs (that is
`before-after-wasp-drone`), does NOT author the test suite (stack test
skills own that), and does NOT audit implementation against a plan (that is
`quality-wasp-drone`).

## Paired Stinger

Read `evidence-testing-stinger/SKILL.md` first; installed at
`~/.agents/skills/evidence-testing-stinger/SKILL.md` (user scope) or
`skills/evidence-testing-stinger/` inside the wasp-nest-core plugin. It is
the master index for this Drone's artifact contract and paths.

## Procedure

1. **Pick the path.** Live recording when a GUI is drivable; headless
   screenshots and probes on headless machines; measured numbers for non-UI
   changes. State which path and why in the report.
2. **Stamp the revision.** `git rev-parse HEAD`, branch, deployment URL into
   report and manifest before the first action.
3. **Prepare.** Maximize the app window, close popups, navigate to the
   starting state before recording (unless setup is under test). Verify the
   capture path works before the first real take.
4. **Test and annotate.** Drive at a watchable pace. setup annotation at the
   start, test_start per named test phrased as a testable statement,
   assertion with passed, failed, or untested after each check. One
   assertion per meaningful state change.
5. **Verify the artifact against the assertions.** Re-watch or re-walk the
   evidence; every passed must be visible in the artifact. Downgrade
   anything that is not.
6. **Package and post.** evidence.mp4 (or screenshots/), report.md,
   manifest.json; append to the PR body without overwriting, link from the
   tracker issue, or deliver paths to the requester.

## Critical directives

- **The evidence must show your own session.** A recording of someone else
  driving, or a synthetic pattern, is not evidence; presenting it as such is
  the one unforgivable act in this domain.
- **untested with reason, never a silent skip.** A missing prerequisite or
  expired auth window is a fact for the report, not a hole in it.
- **A timestamp records when you asserted, not that it was true.** Look at
  the screen or the probe output before choosing passed.
- **A number without its method is not evidence.** Same metric, same method,
   same environment, before and after, all four stated.

## Escalation

- The visual change only needs a still comparison pair →
  **before-after-wasp-drone**
- The headless path needs browser scripting beyond simple navigation →
  **browser-automation-wasp-drone**
- The PR text describing the evidence reads like slop → **unslop-wasp-drone**

## References to skill files

Utilize the Read tool on the paired Stinger at
`evidence-testing-stinger/` with all of its sub-folders and files.

- `SKILL.md`: standing rules and the deliverable
- `guides/01-evidence-protocol.md`: artifact contract, annotation protocol,
  revision stamping, posting, honest-use rules
- `guides/02-paths.md`: live, headless, and measured paths with procedures
- `references/research/distilled.md`: every protocol claim with its source
- `references/research/raw/`: archived primary sources
