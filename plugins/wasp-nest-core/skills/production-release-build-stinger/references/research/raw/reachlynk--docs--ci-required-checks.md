# Required-Check Posture: Staging-Bound PRs vs Main

PRD-038 AC-038-06. This document records which CI checks are required on each
branch class, and why. It documents the intended posture; the actual GitHub
branch-protection settings are applied by the owner/orchestrator and are not
changed by the PR that introduced this file.

Principle: **a required check must be a check that actually runs, at meaningful
depth, on that branch.** A required check whose job is skipped on the branch it
protects is a rubber stamp; PR #872 showed the failure mode (all main-push
checks skipped ~11s each, so a knowingly broken test validated green).

## Lane classes (from `scripts/ci/changed-files.mjs`)

| Lane | Trigger | Depth |
|---|---|---|
| process-only | docs, workflows, library Markdown, scripts, reviewed evidence | scoped checks only (fast lane) |
| queue-health-only | reviewed queue-health sources | focused queue-health checks |
| inngest-only | reviewed Inngest surfaces + pinned bytes | focused Inngest worker checks |
| prd020 | campaign-builder draft surfaces | focused vitest files + real browser proof |
| full gate | everything else, including any dependency bump (`package.json` / `package-lock.json`, asserted by `scripts/ci/changed-files.test.mjs`) | tsc, lint, sharded vitest suite, build, contracts, audit, sandbox |

## Staging-bound PRs (pull_request to main/staging)

Required checks and why each one runs at meaningful depth here:

- **Quality Gates**: always runs (scoped lanes run their scoped checks). This
  check name is unchanged and stays required; the production-release preflight
  keys on it. A scoped lane skipping deep checks is a deliberate, lane-tested
  decision, and the skip is visible in the job summary.
- **TypeScript** (new name, PRD-038): promoted from a Quality Gates step to
  its own parallel job so tsc never gates lint/build/vitest wall clock.
- **Lint** (new name, PRD-038): same promotion; independent of TypeScript.
- **Vitest Suite (1/6 through 6/6)**: required on full-depth PRs; six sharded
  runners execute the whole vitest suite without coverage (AC-038-02/04). On
  scoped lanes the job is skipped with an explicit lane output, so branch
  protection should use either path-filtered rules or an aggregate job; the
  aggregate form is recommended (below).
- **Build** (new name, PRD-038): the Next build, promoted from a Quality
  Gates step to its own parallel job; it is the slowest single full-depth job
  (~5 min baseline) and now defines the full-depth wall clock.
- **Release and Worktree Contracts**: lane-aware as of PRD-038 (AC-038-03).
  The full 274-test run plus real-Redis proofs run whenever source, dependency,
  schema, unknown, or contract-owned inputs change; docs/workflow-only bumps
  skip it with a summary. Required, with the aggregate form.
- **Dependency Audit**, **Sandbox MVP Regression**: required on full-depth
  PRs; dependency bumps always take the full gate, so the audit that matters
  always runs.
- **Live-Traffic Harness Contract**: required, path-filtered to the webhook,
  outbound-client, and guard surfaces it certifies.

### Aggregate-check recommendation

Because scoped lanes legitimately skip deep jobs, the clean required-check
mechanism is one thin **`ci/aggregate`** job (or the existing `quality` job
reused) that depends on all others and succeeds only when every non-skipped
job succeeds; branch protection then requires exactly one check. Skips inside
a lane are visible in run logs and step summaries, and the safety net is the
post-merge main validation below.

## Main (push to main)

Main validates its own tests (AC-038-05, replacing the previous all-skip
policy that let PR #872 land broken):

- **Quality Gates**: required. Push events never take a scoped lane; the
  full-depth static jobs (TypeScript, Lint, Build, Vitest Suite) always run.
  The `full-depth-aggregate` job (check name "Quality Gates Full Depth")
  re-checks every full-depth job's result and fails if any failed, so a
  fan-out failure cannot hide behind the retained required
  check name.
- **Vitest Suite (1/6 through 6/6)**: required. The full vitest suite runs
  sharded on every main push, no coverage. A broken test on main turns these
  checks red immediately.
- **Release and Worktree Contracts**: required; push events always run the
  contracts at full depth (no lane skip on push).
- **Dependency Audit**: required on full-depth pushes.
- **Nightly Coverage**: informational, not required (scheduled workflow;
  fails loudly on threshold regression but has no per-commit SHA to gate).

## The release path (PRD-039 extension)

The sections above govern check depth on staging-bound PRs and main pushes. The
production release path adds its own verification layer on top; the full
stage-by-stage story lives in the delivery map
(`library/knowledge/private/infrastructure/delivery-pipeline.md`).

**Staging-bound PRs vs main pushes, in one line:** PRs run at lane depth
(scoped lanes legitimately skip deep jobs, with visible skip summaries); main
pushes always run full depth and never take a scoped lane.

**Production release preflight (the release half):** the `production-release.yml`
preflight does not trust any PR's green checks. It requires, on the exact main
commit M being released:

- Input SHA, dispatch SHA, and workflow SHA all equal M; dispatch ref is main.
- Required GitHub Actions checks succeeded on M itself (checks on a merge ref
  or the staging head S are insufficient).
- The required names from `.release/release-policy.json` (Quality Gates,
  Dependency Audit, Sandbox MVP Regression, Release and Worktree Contracts)
  are green on M, in addition to main's own required checks.
- Live branch protection shows `lock_branch.enabled=true` and
  `enforce_admins.enabled=true` on main (the freeze posture); a ruleset alone
  is not accepted, and the local `.release/release-freeze.json` is advisory
  only.
- The `Production` environment permits only the `main` branch.

So the posture is three-layered: PR lanes prove the changeset at lane depth,
main push re-proves the merge at full depth, and the release preflight
re-verifies the exact release SHA's checks plus freeze and identity before any
production effect. Zombie third-party suites (vercel, coderabbitai; fly-io
uninstalled 2026-09-29) can leave long-QUEUED check runs on rewritten commits;
they are not required checks and never block mergeability on their own.

## Explicitly unchanged (AC-038-08)

The production pipeline's approval semantics are out of scope for required-
check changes: `production-release.yml` preflight (Quality Gates, Dependency
Audit, Sandbox MVP Regression green on the exact main commit), the release
freeze posture (live `lock_branch.enabled=true` plus
`enforce_admins.enabled=true`), and deploy Vercel workflows keep their
current contracts. This document governs check depth on PRs and main pushes
only.
