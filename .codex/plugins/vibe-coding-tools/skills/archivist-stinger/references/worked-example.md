# Worked example: archiving a 68,000-line TypeScript CLI

Internal primary source for this stinger: a complete run of the archivist procedure on a real acquired repository, September 2026. The repository is anonymized here (product identifiers, people, and organizations are withheld); the numbers, sequence, tooling, and lessons are exact. Load this when you want to see what "done" looks like before starting a run, or when a step in the guides feels abstract.

## The repository

- A Node.js command-line tool in strict TypeScript: an OAuth multi-account manager and loopback request-rotation proxy that sits between a coding-agent CLI and its vendor backend. About 68,000 lines under `lib/`, a 6,400-line wrapper script, 4,800-line plugin entry, 353 test files.
- Delivered as a single-commit repository (the acquirer's own commit) with the entire source tree untracked, a deleted license file, and a rewritten README already naming the new product identifier.
- Legacy documentation: 144 markdown files and 16 evidence files under `docs/` (user guides, references, 75 release notes, maintainer architecture docs, six runbooks, historical implementation plans, and audit snapshots with evidence).
- Inbound license: permissive (MIT) from a single upstream owner, with external contributors credited in release notes and vendored shims from a second party.

## Sequence and timing

| Phase | What happened | Scale |
| --- | --- | --- |
| Intake | Inventory of every attribution form: author tags in the entry file header, package manifest identity fields, one legacy scoped package name baked into code and tests, two reverse-DNS bundle identifiers, 190 upstream repository links, six contributor credits in release notes, three plain-text handles in a changelog, a personal domain and a username inside audit evidence and one test fixture, a GitHub Pages host in a schema id | 55 files |
| Scrub | One scripted pass (perl in-place substitutions ordered from most specific to least) plus hand rewrites of the six credit sentences; test assertions that pinned old metadata rewritten to assert absence; a `LICENSE` pack requirement and its fixtures removed | 55 files, then 2 leftovers found by a second sweep |
| Merge | Two merge bees in parallel: public half (90 files, release notes scripted) and private half (42 headed docs plus 27 verbatim evidence files, hash-verified) | 160 legacy files, 0 unplaced |
| Fleet | Twelve writer bees across thirteen domains; two bees on the priority domain; one shared brief file; every writer reported line counts, sources read, and unverified facts | 43 new docs, 12,000 lines |
| Final pass | Verifier, domain README generation, overview with coverage counts, tamper baseline diff (no writer touched anything outside `library/`), repo-wide attribution re-sweep | 221 files verified, 3 accepted flags |
| Rename | Kebab identifier across 295 files, title-case and screaming and snake forms, three file renames, lockfile root, plugin manifest, provider id, bundle ids; two split path segments caught by a final sweep | 2,536 occurrences |
| Retirement | Legacy tree tarred to a recoverable location, then removed; nineteen pointers outside the library repointed; two doc-integrity tests reported as still targeting the removed tree | 160 files |

## What the fleet got right that a single writer would not have

- Four writers contradicted the brief where the code disagreed, and the corrections were all real: the rotation shadow home lives under the state root, not the OS temp dir; the client key is off-disk only on one transport branch; the proxy does not reuse the plugin-host request pipeline; a helper the brief called wired had no production caller. A brief written by the orchestrator is a hypothesis; the writers' grep is the test.
- Every writer reported the symbols it could not find rather than inventing a flow. The report template asks for this explicitly and it is the most valuable line in each report.

## Environment lessons (the ones that cost time)

1. **Model alias mapping is a harness property, not a model property.** Eleven writers launched on the `opus` alias were rejected at spawn with a nonexistent Codex model id. Nothing was written, so nothing was lost, but the relaunch cost a full turn. Probe one bee first.
2. **A shell wrapper can choke on an apostrophe.** A heredoc containing prose with an unbalanced apostrophe failed in the harness shell wrapper. Write prose files with the file-write tool; keep shell commands free of quoted prose.
3. **`grep -P` with `\x{2014}` fails under a C locale** and, worse, fails silently when chained with `||`. Byte-level patterns (`\xE2\x80[\x93\x94]`) work everywhere. Writers told to use the code-point form reported "clean" results that had not actually run.
4. **A hard-delete rule needs an escape hatch the user controls.** The legacy tree was retired only after the user asked twice and only after a recoverable tarball existed; the first request was answered with the command to run rather than the deletion.
5. **Merge bees leave scraps.** One writer left a 5 KB scratch file at the repository root. The tamper baseline caught it; the boundary rule kept it out of the commit until the user could decide.
6. **Ordering in the scrub matters.** The scoped-package replacement had to run before the kebab replacement, or the scope would have been renamed with its package and the split path segments (`"@scope", "name"`) would have been missed. They were missed anyway in two files; the second sweep is not optional.
7. **Locale of "everything".** "Rename everything" was scoped by the acquirer's own README: it renamed the package and command family but kept the storage root and env-var family. Following the README avoided a rename that would have broken their own document. Ask the README before asking the user.

## Numbers a reviewer can hold the next run to

- Time to a clean attribution sweep from cold start: one inventory pass, one scripted pass, one leftover pass.
- Merge: two bees, both under 20 minutes wall clock, 0 unplaced files, 1 cross-half link wrong (an audit filed in a different folder by each bee; fixed in the final pass).
- Fleet: 12 writers, 3 to 7 docs each, 78 to 523 lines each, 0 attribution leaks, 0 dashes in new prose, 0 broken links after the final pass.
- Rename: 3 forms plus 3 filename renames, 0 leftovers outside one scrap file, every script parsed afterwards.
