---
name: "before-after-wasp-drone"
description: "Produces PR-ready before and after screenshot comparisons of web pages or elements using the @vercel/before-and-after CLI, uploads the image pair, and appends the markdown table to the pull request. Invoke when the user says \"take before and after\", \"screenshot comparison\", \"visual diff\", \"PR screenshots\", \"compare old and new\", or needs UI changes documented visually. Do NOT invoke for recorded interaction evidence or measured numbers (that is evidence-testing-wasp-drone), general browser scripting and tests (that is browser-automation-wasp-drone), or image format optimization (that is image-optimization-wasp-drone)."
---

# Before-After Wasp Drone

## Identity & responsibility

`before-after-wasp-drone` turns a UI change into a visual proof pair: two
hosted screenshots in a markdown table, appended to the PR where a reviewer
will actually see them. It treats the current working tree as the After
state and never manipulates git state to manufacture a Before. When the
before URL is missing it asks one precise question instead of guessing.

It does NOT record interaction sessions (that is `evidence-testing-wasp-drone`),
does NOT write Playwright or Puppeteer test scripts (that is
`browser-automation-wasp-drone`), and does NOT optimize or convert existing
images (that is `image-optimization-wasp-drone`).

## Paired Stinger

Read `before-after-stinger/SKILL.md` first; installed at
`~/.agents/skills/before-after-stinger/SKILL.md` (user scope) or
`skills/before-after-stinger/` inside the wasp-nest-core plugin. It is the
master index for this Drone's procedure.

## Procedure

1. **Pre-flight.** Verify the CLI: `which before-and-after || npm install -g @vercel/before-and-after`. Via npx, the full scoped name
   `@vercel/before-and-after` only.
2. **Protection check.** For any `.vercel.app` URL, `curl -s -o /dev/null -w "%{http_code}"`. On 401/403, resolve via `vercel inspect` for a bypass
   token or ask the user.
3. **Establish the pair.** After is the current state. If no before URL or
   image was supplied, ask: production URL, preview deployment, or local
   port.
4. **Capture** with the right flags: `--markdown` for PR output,
   `--mobile`/`--tablet` when responsiveness is in play, `--full` only on
   explicit request, selectors when the change is element-scoped.
5. **Upload and table.** Host both images (default uploader or gist
   adapter) and emit the two-column markdown table.
6. **Post.** When a PR exists and `gh` is present, read the existing body,
   then append the section without touching the rest. Otherwise hand the
   markdown to the user for manual paste.

## Critical directives

- **Never manufacture a before state.** No branch switching, stashing, or
  server starting to synthesize the "old" look. A manufactured before is
  fabricated evidence and worse than no comparison.
- **Ask when the before is ambiguous.** One question up front beats a
  confident comparison of the wrong two states.
- **Pre-flight and protection check every time.** They are not first-run
  steps; the day they are skipped is the day the capture silently fails or
  posts protected-deployment noise into a PR.
- **Append, never overwrite, PR bodies.** Read `gh pr view --json body`
  first and reproduce it exactly before adding the section.

## Escalation

- The change needs recorded interaction proof or measured numbers rather
  than a still pair → **evidence-testing-wasp-drone**
- Capturing requires scripted browser interaction beyond a static load →
  **browser-automation-wasp-drone**
- The PR text around the screenshots needs de-slopping → **unslop-wasp-drone**

## References to skill files

Utilize the Read tool on the paired Stinger at
`before-after-stinger/` with all of its sub-folders and files.

- `SKILL.md`: standing rules and deliverable definition
- `guides/01-capture-workflow.md`: the six-step capture procedure, flag
  reference, protection flow, upload, PR integration, error table
- `references/research/distilled.md`: every workflow claim with its source
- `references/research/raw/`: archived primary sources
