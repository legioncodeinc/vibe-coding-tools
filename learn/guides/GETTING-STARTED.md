# Getting Started

## What you are setting up

Vibe Coding Tools has two jobs:

1. Give your AI assistant specialist agents and playbooks.
2. Help your project store durable knowledge and requirements in a predictable `library/`.

The safest setup is additive. It inspects the target repository, preserves existing work, and creates only missing files.

## Step 1: choose a harness

This repository tracks portable source under `src/`. Installed harness folders are ignored local outputs. Generate the Cursor and Codex adapters with `python learn/scripts/generate-harnesses.py` before using those local paths, or install an appropriate versioned release package.

- **Claude Code:** Install an appropriate versioned Claude release package using your normal plugin workflow.
- **Codex:** Generate the local `.agents/skills` and `.codex/agents` adapters before opening the checkout, or install an appropriate release package. A marketplace descriptor is generated only when its source template exists under `src/harnesses/codex/`.
- **Cursor:** Open the checkout or copy/install the `.cursor` package into the target repository.

## Step 2: initialize the target repository

Open the repository you want to improve and ask:

```text
Use get-started-stinger to initialize Library Schema v2 here. Inspect existing documentation and harness files first. Preserve existing content, create only missing pieces, and produce a setup report with created, unchanged, assumed, and human-decision sections.
```

The skill should create a live structure like:

```text
library/
  knowledge/
    public/
    private/
  requirements/
    backlog/
    in-work/
    completed/
    reports/
  issues/
    backlog/
    in-work/
    completed/
  notes/
```

## Step 3: review before committing

Check the setup report and `git diff`. Confirm:

- No existing document was silently overwritten.
- Product facts were not invented.
- Live files are under the target repository's `library/`, not this repository's example folder.
- Harness instructions point to paths that exist.
- Secret examples use obvious placeholders.
- Security ran before quality for a release-sized change.

## Step 4: try one real task

Good first tasks include:

```text
Use the-beekeeper to route a README rewrite. Explain the chosen Bee and Stinger.
```

```text
Use product requirements guidance to draft a backlog PRD for passwordless sign-in. Make every acceptance criterion observable.
```

```text
Use git-stinger to explain how to recover an accidentally deleted local branch. Show the recovery path before any destructive command.
```

## Step 5: keep the mirrors current

When contributing to Vibe Coding Tools, edit `src` as the source and generate local adapters when needed:

```powershell
python learn/scripts/generate-harnesses.py
```

Review the `.cursor`, `.codex`, and `.agents` output without committing those folders. Use a disposable checkout for generation tests when the working checkout must remain free of adapters. Generated does not mean automatically correct; validation still matters.
