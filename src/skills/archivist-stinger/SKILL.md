---
name: "archivist-stinger"
description: "Prepares an acquired repository for archival: provenance intake, attribution and PII scrub, docs merge into library/, knowledge-base fleet, identifier rename, verification. Any language or license."
license: MIT
compatibility: "Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork. Scripts need Python 3.10 or newer."
metadata:
  hive-bee: "archivist-worker-bee"
  domain: "acquired-repository archival"
  pair-bee: "archivist-worker-bee"
---

# Archivist Stinger

## Purpose

Turns a software repository whose intellectual property has just been acquired into a clean research object: the seller's attribution, license grants, and personal identifiers are removed; every third-party notice is preserved; the repository's scattered documentation is consolidated into the Library Schema v2 tree; a full private knowledge base is written by a fleet of `knowledge-worker-bee` instances; the product identifier is renamed if the acquirer wants; and one report records what was found, what was changed, and what the acquirer still has to decide. The procedure is language and license agnostic: it works from signals (notice files, manifest fields, headers, credits, identities) rather than from any one ecosystem.

## When to use

- "We bought this repository, archive it as a research object"
- "Strip all attribution, license, and PII from this codebase"
- "Sanitize this acquired codebase and document it"
- "Merge the docs into library/ and build the knowledge base for this repo"
- "Rename everything to <new product name>"
- "Run the archivist"

## When not to use

- Writing individual knowledge docs for a repository you already maintain: that is `knowledge-stinger` armed on `knowledge-worker-bee`.
- Authoring PRDs, IRDs, or ADRs: `library-stinger` and `adr-writing-stinger`.
- A security audit or a quality audit of the code itself: `security-stinger`, `quality-stinger`. This stinger documents the security model as built; it never audits it.
- Rewriting git history for a live, multi-contributor project: `git-stinger`; this stinger only decides whether an archive's history is rewritten, and only on explicit approval.
- Any repository whose ownership basis cannot be stated. The intake gate refuses to proceed without it.

## Procedure

1. **Provenance intake** (guide 01). Record the ownership basis outside the repository, census contributors and credits, inventory every notice location and manifest field, classify each notice as first-party, third-party, or generated, scan for secrets separately, and sign the intake manifest. Nothing changes in the tree before the manifest is signed.
2. **Attribution and PII scrub** (guide 02). Baseline the tree, build an ordered replacement map from the sweep report, apply it with the dry-run first, hand-edit credits and manifest objects, follow the metadata into tests and packaging checks, then sweep again with the second-form patterns until first-party hits are zero. Decide git history from the three options (leave, mailmap, rewrite) per the manifest.
3. **Documentation merge** (guide 03). Map every legacy document to its Library Schema v2 destination, dispatch two merge bees with the prompt template, verify counts and links, repoint pointers outside the library, and retire the legacy tree only on instruction with a backup in hand.
4. **Knowledge-base fleet** (guide 04). The archivist reads the code, writes the shared brief and the per-bee assignments, and hands them to the orchestrator; the orchestrator dispatches the `knowledge-worker-bee` fleet at top level (nested Bee spawns are forbidden), reconciles corrections, generates the domain READMEs and the overview, and re-dispatches the archivist.
5. **Identifier rename** (guide 05), when the acquirer names the product. Scope from the acquirer's README, inventory every spelling, apply the ordered map, rename files, keep tests aligned, rewrite the prose that described the old naming, check syntax, sweep for leftovers.
6. **Verification and report** (guide 06). Repository-wide sweeps, knowledge verifier, byte-level dash check, tamper-baseline diff, link and syntax checks, then the report at `library/requirements/reports/<date>-archivist-report.md` with the acquirer's open decisions listed. Commit only when asked.

Hard rules that hold in every phase: third-party notices are preserved, never edited; a history rewrite needs explicit approval and a fresh clone; deleting a tree or a stray file needs an explicit instruction and a recoverable backup; names and handles from the intake never enter a file inside the repository; automated detection is a floor, so a human reads every sweep report.

## References map

- `references/research/distilled-archival-sanitization.md`, load when a claim about licenses, manifest fields, PII, or history rewriting needs its source, or when a report cites a standard.
- `references/research/raw/`, load when tracing a distilled claim to its primary source.
- `references/worked-example.md`, load before the first run to see what a complete archival looks like, with numbers and the environment pitfalls that cost time.
- `guides/01-provenance-intake.md` through `guides/06-verification-and-report.md`, load one per phase as the phase starts.
- `templates/intake-manifest.md`, `templates/library-merge-map.md`, `templates/knowledge-brief.md`, `templates/fleet-assignment-prompt.md`, `templates/merge-bee-prompt.md`, `templates/archivist-report.md`, load when producing that artifact.
- `scripts/attribution_sweep.py`, run at intake and after every scrub pass; read-only. `scripts/apply_replacements.py`, run with a reviewed map, dry-run first. `scripts/identifier_forms.py`, run before a rename. `scripts/baseline_manifest.py`, run before and after any multi-file change. `scripts/verify_kb.py`, run after the merge and after the fleet. `scripts/gen_domain_readmes.py`, run once after the fleet. All are standard-library Python and never modify a file unless told to with `--apply`.

## Related bees and stingers

- [knowledge-stinger](../knowledge-stinger) - The format, taxonomy, and analysis workflow every fleet writer follows; the archivist's brief inherits its header and rules.
- [knowledge-worker-bee](../../agents/knowledge-worker-bee.md) - The writer the orchestrator dispatches in phase 4, one or two per domain.
- [library-stinger](../library-stinger) - Library Schema v2, the folder contract the merge and the knowledge base land in.
- [git-stinger](../git-stinger) - History rewriting mechanics when the acquirer approves a rewrite.
- [dependency-audit-stinger](../dependency-audit-stinger) - SBOM and provenance tooling for the third-party inventory on large or polyglot repositories.
- [archivist-worker-bee](../../agents/archivist-worker-bee.md) - The paired Bee; the orchestrator delegates phases 1, 2, 3, 5, and 6 to it and runs phase 4 itself.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [knowledge-stinger](../knowledge-stinger) - Narrative knowledge documentation format and workflow; used by every fleet writer.
  - [library-stinger](../library-stinger) - Library Schema v2 folder contract and documentation lifecycle.
  - [git-stinger](../git-stinger) - Interactive rebase, filter-repo, mailmap, and recovery for approved history rewrites.
  - [dependency-audit-stinger](../dependency-audit-stinger) - Dependency inventory, SBOM, and provenance verification.
  - [security-stinger](../security-stinger) - First gate of the Ship Gate.
  - [quality-stinger](../quality-stinger) - Second gate of the Ship Gate.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
