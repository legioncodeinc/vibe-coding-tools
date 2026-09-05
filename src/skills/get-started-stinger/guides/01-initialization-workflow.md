# 01. Initialization workflow

The exact copy-out procedure this skill runs, and the idempotency rule that governs every step. This guide is the one every other guide assumes you've read first.

## The procedure

1. **Confirm the target.** Identify the repository root (the directory containing `.git/`, or the directory the user names). Never write outside it.
2. **Inventory before touching anything.** For every file this skill can produce, check whether it already exists at the target path. Build a full list before copying a single byte: `will_create`, `will_skip_existing`, `needs_merge_review` (directories like `.github/workflows/` where some files exist and others don't).
3. **Copy in this order**, because later steps assume earlier ones exist:
   1. `.gitignore`, `.editorconfig`, `.nvmrc`, `.env.example`: foundational, nothing depends on them existing first, but everything after benefits from `.gitignore` already excluding `.env` before `.env.example` lands next to it.
   2. `.github/` (workflows, dependabot config, CODEOWNERS, issue/PR templates): see guide `02-github-ci-setup.md`.
   3. `README.md`: see guide `03-readme-authoring.md`.
   4. `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`: see guides `05` and `06`.
   5. `library/`: see guide `07-verification-checklist.md` for why this runs last of all copy targets, mirroring the sequencing this skill's own forge used.
4. **Fill placeholders as you copy, not after.** Every template ships `{placeholder}` tokens. Resolve them from repo context you can actually observe (package.json name/repo field, git remote URL, existing LICENSE file, package manager lockfile present) before writing the file. Never leave a literal `{placeholder}` in a file you tell the user is "done": either fill it or flag it explicitly in the verification report as "needs a human decision."
5. **Run the verification pass** (guide `07-verification-checklist.md`) and report before declaring anything finished.

## The idempotency rule (non-negotiable)

**Never clobber an existing file without reporting it.** Concretely:

- If the target file does not exist: copy the template, fill placeholders, report it under "created."
- If the target file exists and is byte-for-byte identical to what this skill would produce: leave it alone, report it under "already present, unchanged."
- If the target file exists and differs from what this skill would produce: **do not overwrite it.** Report it under "already present, differs: not touched" with a one-line diff summary (what the template has that the existing file doesn't, or vice versa). Offer the template content as a `.new` sibling file or inline in the report only if the user asks to see it; do not write a `.new` file speculatively.
- Directories are evaluated file-by-file, not as a unit. `.github/workflows/` with an existing `deploy.yml` and no `ci.yml` gets `ci.yml` created and `deploy.yml` left untouched and reported as "unrelated file present, not evaluated."

This mirrors the hard scope boundary in the Ship Gate and in `github-repo-health-stinger`: an initialization/hardening skill audits and adds, it does not silently rewrite a maintainer's existing decisions. A maintainer who customized `.gitignore` three months ago does not want it silently reset to the template on the next run of this skill.

## Re-runs are safe by construction

Because every step follows the idempotency rule, running this skill twice against the same repository is safe: the first run creates what's missing, the second run reports everything as "already present" (or flags drift if the user hand-edited a copied file since). This is what makes the skill usable as a periodic hardening check, not just a one-time bootstrap.

## What this skill does not do

It does not run `git init`, create the branch, or make any commit. It does not call the GitHub API to flip repository Settings (push protection, secret scanning, branch protection/rulesets, CodeQL default setup): those require admin access this skill's file-copy operations don't have and shouldn't assume. It documents every such gap explicitly in the verification pass (guide `07`) rather than silently skipping it.
