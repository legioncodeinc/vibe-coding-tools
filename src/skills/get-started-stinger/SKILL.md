---
name: "get-started-stinger"
description: "Initializes a repo to a healthy baseline: library/ docs, GitHub CI, README, .gitignore, CODEOWNERS, SECURITY.md, CHANGELOG.md. Use when bootstrapping a repo or auditing one for missing hygiene files."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. No paired Bee; orchestrator-level, invoked directly rather than dispatched.
metadata:
  hive-tier: orchestrator
  paired-bee: none
  research-window: 2026-02-14 to 2026-08-14
---

# Get Started Stinger

You are equipped to take a repository from nothing, or from partial setup, to the healthiest reasonable baseline: a documentation system, GitHub CI/CD wiring, a fillable README, a correct .gitignore, and the sugar-spice-and-everything-nice hardening layer (CODEOWNERS, SECURITY.md, CHANGELOG.md, .editorconfig, .env.example, and the guidance for pre-commit hooks, branch protection, and secret scanning). Every claim behind this skill traces to `references/research/raw/`. Do not drift from it.

This is an orchestrator-level skill with no paired Bee, same tier as `beekeeper-suit` and `queen-bee-stinger`. It is invoked directly when a repository needs initializing, not dispatched by another orchestrator.

## When to use this skill

- A brand-new repository has just been created and needs a working baseline before real feature work starts
- An existing repository is missing CI, a CODEOWNERS file, a SECURITY.md, or other community-health files and needs them added without disturbing what already exists
- Someone asks to "set this repo up properly," "harden this repo," "add CI to this project," or "get this repo to a healthy baseline"
- A periodic hygiene check: re-running this skill against an already-initialized repo is safe and reports drift rather than re-copying blindly

## When not to use this skill

- Deep CI/CD architecture beyond the starter workflow (matrix builds, deployment pipelines, custom runners): hand off to `ci-release-stinger`
- Writing a fully realized README once the project has real content: this skill hands off a filled-in-shape template; `readme-writing-stinger` owns deep authorship and audits
- Actually flipping GitHub repository Settings (branch protection, secret scanning, CodeQL default setup): this skill has no API/admin access and documents these as human decisions, it does not perform them
- Choosing a license: this skill ships a `SECURITY.md`/README slot for it but does not pick one on the user's behalf

## The copy-out procedure

Full detail in `guides/01-initialization-workflow.md`; the shape of it:

1. Confirm the repository root and inventory every file this skill can produce against what already exists there.
2. Copy in dependency order: `.gitignore`/`.editorconfig`/`.nvmrc`/`.env.example` first, then `.github/` (workflows, dependabot, CODEOWNERS, issue/PR templates), then `README.md`, then `CONTRIBUTING.md`/`SECURITY.md`/`CHANGELOG.md`, then `library/` last of all.
3. Fill every `{placeholder}` token as each file is copied, resolved from observable repo context (package.json, git remote, existing LICENSE, lockfile) wherever possible.
4. Run the verification pass (`guides/07-verification-checklist.md`) and report before calling anything done.

### Idempotency rules (non-negotiable)

Never clobber an existing file without reporting it:

- Missing: copy, fill, report under "created."
- Present and identical to the template output: leave it, report under "already present, unchanged."
- Present and different: do not touch it. Report under "already present, differs, not touched" with a short summary of what differs.
- Directories are evaluated file by file, never as a unit; an existing `deploy.yml` next to a missing `ci.yml` gets `ci.yml` created and `deploy.yml` reported as untouched.

This is what makes re-running the skill safe: the first pass creates what is missing, later passes report drift instead of resetting a maintainer's hand-edits.

## File map

Load these on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `guides/01-initialization-workflow.md` | Any run: the copy-out order and the idempotency rule in full |
| `guides/02-github-ci-setup.md` | Copying `.github/` (workflows, dependabot, CODEOWNERS, templates) |
| `guides/03-readme-authoring.md` | Filling `templates/README.md` |
| `guides/04-gitignore-and-secrets.md` | Copying `.gitignore`/`.env.example`, or explaining push protection |
| `guides/05-commit-and-release-hygiene.md` | Conventional Commits, SemVer, Keep a Changelog, husky/lefthook |
| `guides/06-branch-protection-and-scanning.md` | The Settings-only items to surface in the verification pass |
| `guides/07-verification-checklist.md` | Producing the final report, every run |
| `templates/` | The actual copy-ready files: `library/`, `.github/`, `README.md`, `.gitignore`, `.editorconfig`, `.nvmrc`, `.env.example`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md` |
| `references/research/distilled-get-started.md` | Verifying a claim or resolving a conflict between sources |
| `references/research/raw/` | Tracing a distilled claim back to its primary source |

## Verification pass

Every run ends with a three-part report, detailed in `guides/07-verification-checklist.md`:

1. **Already present**: files that existed before this run, unchanged or flagged as differing.
2. **Created this run**: files written, with how each placeholder was resolved.
3. **Needs a human decision**: everything requiring GitHub Settings/admin access (branch protection, push protection, CodeQL default setup, license choice), plus the Dependabot-vs-Renovate and husky-vs-lefthook calls this skill defaults but does not force, plus any gap this skill's template set does not cover (for example `CODE_OF_CONDUCT.md`).

If `gh` CLI access is available, cross-check the result against `gh api repos/{org}/{repo}/community/profile` for an external, API-verifiable health score.

## Related bees and stingers

- [queen-bee-stinger](../queen-bee-stinger) - The forge that built this skill. Consult it when this skill itself needs updating, or when a different Hive component needs to be forged.
- [github-repo-health-stinger](../github-repo-health-stinger) - Audits the repository hygiene this skill establishes: branch protection, CODEOWNERS coverage, CI density, .gitignore coverage. Run after this skill to score the result.
- [readme-writing-stinger](../readme-writing-stinger) - Deeper README authorship and audit once the project has real content to describe, beyond this skill's fillable shape.
- [security-stinger](../security-stinger) - Security audit pass. First gate of the Ship Gate pipeline before anything this skill created gets committed.
- [quality-stinger](../quality-stinger) - Quality assurance pass. Second gate of the Ship Gate pipeline, always after security.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [queen-bee-stinger](../queen-bee-stinger) - The forge that built this skill. Consult it when this skill itself needs updating, or when a different Hive component needs to be forged.
  - [github-repo-health-stinger](../github-repo-health-stinger) - Repository hygiene audit. Run after this skill to score the baseline it established.
  - [security-stinger](../security-stinger) - Security audit pass. First gate of the Ship Gate pipeline.
  - [quality-stinger](../quality-stinger) - Quality assurance pass. Second gate, always after security.
  - [readme-writing-stinger](../readme-writing-stinger) - Deeper README authorship once the project has real content to describe.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
