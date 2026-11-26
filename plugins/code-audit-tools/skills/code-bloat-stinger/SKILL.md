---
name: code-bloat-stinger
description: Read-only bloat audit of any repo. jscpd duplication, knip or language dead-code tools with a spot-check, cloc size, function and closure structure, split plans, banded verdict.
license: AGPL-3.0-or-later
compatibility: Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork. Needs Node 20.19 or newer and Python 3.9 or newer; Perl for cloc or a downloaded scc binary; Go or Cargo only for those repos.
metadata:
  author: Legion Code Inc.
  hive-drone: code-bloat-wasp-drone
  pair-drone: code-bloat-wasp-drone
  domain: code bloat audit
  version: 1.0.0
  research-window: 2026-03-30 to 2026-09-30
---

# Code Bloat Stinger

Designed and built by Legion Code Inc.

## Where this skill's files are

Every path below (`guides/`, `references/`, `scripts/`) is relative to the folder that contains this `SKILL.md`. In Claude Code that folder is `${CLAUDE_SKILL_DIR}`. If that text was not replaced with a real path, find the folder yourself (Glob for `**/code-bloat-stinger/SKILL.md`) and use it as `SKILL_DIR` in every command.

## Requirements

Node 20.19 or newer, Python 3.9 or newer, and Perl for cloc or a downloaded scc binary (Go or Cargo only for those repos). The commands in `references/tool-commands.md` are bash (`env -i`, bash arrays, `[ ]` tests): on Windows, run them in Git Bash or WSL, not PowerShell or cmd. The throwaway copy (`audit-my-code-stinger/scripts/make_scratch_copy.py`) and this skill's `scripts/*.py` are plain Python and run anywhere.

## Purpose

Answer "how bloated is this codebase, and why?" with numbers a founder can trust. The skill measures three kinds of bloat separately, because they have different causes and fixes: copy-pasted code (jscpd at two clone sizes, with both the standard and the both-copies figure), unused code (knip for JS and TS, vulture, deadcode, staticcheck or cargo tools elsewhere, always checked by hand before it is called dead), and shape (share of code in files over 1,000 lines, the largest functions, factory closures, and a split plan). It writes the `bloat` dimension of an Audit My Code run (`01-bloat/`) under the shared contract, and never changes the audited repository: every tool runs in a throwaway copy that is removed afterwards. The method reproduces a hand-run reference audit (WHIPT, 2026-09-30) on any repository.

## When to use

- "Is this codebase bloated?", "is it bloated because it was vibe coded?", "how much is copy-pasted?", "how much dead code is there?"
- The `bloat` dimension of `/audit-my-code` at the `vibe`, `basic`, `full`, or `mario` tier
- Measuring duplication, unused files, exports and dependencies, file and function size, or planning how to split giant files
- Re-running the same measures after a cleanup to show what changed

## When not to use

- Security weaknesses: `security-stinger` and the framework security Drones (`02-security/`)
- Whether the code matches its plan, tests, or quality bar: `quality-stinger` (`03-quality/`)
- Repo setup, CI, docs, and hygiene: the foundation Drone (`00-foundation/`)
- Actually deleting code or refactoring: this skill only reports; remediation belongs to the `mario` tier and the owning engineering Drone
- Dependency vulnerability triage: `dependency-audit-stinger`

## Procedure

1. Read `guides/00-scoping-and-throwaway-copy.md`. Read `intake.json`, make the copy with `git archive`, install pinned tools outside the copy, write the scope and file list, capture `git status` of the audited repo, pick the language route.
2. Run duplication per `guides/01-duplication-with-jscpd.md`: 50 and 100 tokens, size and line caps lifted, scan coverage checked against the file list, then `scripts/jscpd_recount.py` for both copies, per area, big versus small files, and top pairs.
3. Run unused-code detection per `guides/02-unused-code-with-knip.md`: workspace-aware knip from outside the repo, a failing plugin disabled through an external config, a production-mode second view, then `scripts/knip_summarize.py`. For non-JS code use the tools in `references/non-js-dead-code.md`.
4. Count lines per `guides/03-size-and-line-counts.md` with cloc (`--skip-uniqueness`) or scc, then `scripts/size_profile.py`.
5. Measure structure per `guides/04-structure-and-split-planning.md` with lizard and `scripts/function_profile.py`; read the largest files and write the split plan, including the context-object step for closures.
6. Spot-check per `guides/05-spot-check-and-false-positives.md`: at least 12 flagged items classified Dead, False alarm, or Partial with a reason, then the truly-dead estimate as a share of core code lines.
7. Band, set the verdict, write the verdict paragraph, and write `metrics.json`, `findings.jsonl`, and `notes.md` per `guides/06-bands-verdict-and-contract-output.md`. List raw artifacts under `## Evidence` in `notes.md` (the orchestrator builds `evidence-index.md`). Run `scripts/validate_outputs.py` and fix every error.
8. Confirm the audited repo is unchanged, remove `.scratch/`, and report to the orchestrator: verdict, headline measures, caps lifted, and anything not run.

## References map

| Path | Load when |
| --- | --- |
| `guides/00-scoping-and-throwaway-copy.md` | Always first |
| `guides/01-duplication-with-jscpd.md` | Running or reading jscpd |
| `guides/02-unused-code-with-knip.md` | Running knip or a language dead-code tool |
| `guides/03-size-and-line-counts.md` | Counting lines, big-file share |
| `guides/04-structure-and-split-planning.md` | Largest functions, closures, split plans |
| `guides/05-spot-check-and-false-positives.md` | Before calling anything dead |
| `guides/06-bands-verdict-and-contract-output.md` | Banding, verdict paragraph, writing outputs |
| `references/tool-commands.md` | Any command line; pinned versions |
| `references/bands.md` | Banding a measure, choosing severity, setting the verdict |
| `references/false-positive-classes.md` | Classifying a flagged item |
| `references/non-js-dead-code.md` | Python, Go, Rust, or another language in scope |
| `references/output-templates.md` | Writing `metrics.json`, `findings.jsonl`, `notes.md` |
| `references/REFERENCE.md` | Script inputs and outputs; raw folder layout |
| `references/research/distilled-code-bloat.md` | Verifying a tool behavior or a band, settling a dispute |
| Source research archive (not shipped with the plugin) | Source-repository only; the shipped distillation summarizes it, do not require it |
| `scripts/*.py` | As each guide directs; every script has `--help` |

## Related drones and stingers

- [code-bloat-wasp-drone](../../agents/code-bloat-wasp-drone.md) - The paired Drone; the orchestrator dispatches it for the `bloat` dimension.
- [audit-my-code-stinger](../audit-my-code-stinger) - The run contract and orchestration for `/audit-my-code`.
- `security-stinger` - Security dimension; overlaps only where dead code hides a vulnerable path.
- `quality-stinger` - Quality dimension, run after security in the `full` and `mario` tiers.
- `dependency-audit-stinger` - Vulnerable or outdated dependencies, as opposed to unused ones.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [audit-my-code-stinger](../audit-my-code-stinger) - Run contract, tiers, workspace layout, and the brief renderer for Audit My Code.
  - [webapp-capture-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/browser-and-app-testing-tools/skills/webapp-capture-stinger) - Code-level UI inconsistency audit, when bloat findings point at duplicated components.

<!-- Ship Gate removed: research-only stinger, produces no committable code. -->

---

Designed and built by Legion Code Inc. Licensed under AGPL-3.0-or-later.
