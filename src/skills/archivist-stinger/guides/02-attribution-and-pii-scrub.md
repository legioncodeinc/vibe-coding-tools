# Guide 02: Attribution and PII scrub

Phase 2. Remove every first-party attribution, license grant, and personal identifier from the working tree; preserve every third-party notice; decide git history deliberately. Language and license agnostic: the procedure works from signals (strings, fields, file names), never from a particular ecosystem.

Grounding: `../references/research/distilled-archival-sanitization.md`, sections 1 to 4 and 6. Worked run: `../references/worked-example.md`. Tools: `../scripts/attribution_sweep.py`, `../scripts/apply_replacements.py`, `../scripts/baseline_manifest.py`.

## Scope table

| Signal | First-party (covered by the acquisition) | Third-party or generated |
| --- | --- | --- |
| Root license, copying, and notice files | Remove | Preserve verbatim; never edit a dependency's notice |
| `LICENSES/<SPDX-id>` files | Remove only the ids that apply solely to first-party files | Preserve |
| Per-file headers: `SPDX-License-Identifier`, `SPDX-FileCopyrightText`, `Copyright`, `©`, `.license` sidecars, `REUSE.toml`, `.reuse/dep5` | Remove the first-party lines | Preserve lines naming other holders |
| Manifest fields: author, contributors, maintainers, owners, developers, organization, license, license-file, repository, homepage, bugs, funding, support, copyright, scm, issueManagement | Remove or neutralize (see below) | Dependency manifests inside vendored trees: preserve |
| `@author`, `@license`, `@copyright` doc tags | Remove the line | |
| Contributor credits in release notes, changelogs, READMEs, evidence ("reported by", "thanks to", `@handle`) | Rewrite the sentence to keep the technical fact and drop the credit | |
| Handles, emails, personal URLs, funding and social links, profile links | Remove | Dependency funding links inside lockfiles: leave (generated) |
| Upstream repository links (`.../owner/repo/pull/N`) | Convert to plain `#N` references | Links to the official upstream tool the product wraps or integrates: keep |
| Reverse-DNS bundle identifiers and scoped package names carrying a handle | Rename to a neutral or acquirer-owned form; keep code and tests consistent | Dependency scopes (`@types/...`): leave |
| Schema `$id` or documentation URLs on a personal host | Replace with an example or acquirer host | |
| Home-directory usernames in fixtures, comments, logs, evidence | Replace with a placeholder (`alice`, `<HOME>`), preserving case variants | |
| Commit author identities | Decide in the history step | |
| Lockfiles, snapshots, generated bundles | Leave; regenerate after renames; note in the report | |

## Procedure

1. **Baseline the tree** so the blast radius is provable later:

   ```bash
   python <stinger>/scripts/baseline_manifest.py create . before-scrub.sha256
   ```

2. **Re-read the sweep report from intake**, category by category, and write the replacement map. Order matters: the most specific string first. A scoped package name (`@seller/product`) is replaced before its base name, or the scope survives inside a renamed package. Bundle identifiers before bare handles. Full email addresses before bare usernames.
3. **Express every mechanical edit as a rule** in a JSON map for `apply_replacements.py`, with `paths` filters where a rule must not reach vendored trees. Dry-run, read the per-file counts, then apply:

   ```bash
   python <stinger>/scripts/apply_replacements.py scrub-map.json . --exclude-dir vendor
   python <stinger>/scripts/apply_replacements.py scrub-map.json . --exclude-dir vendor --apply
   ```

4. **Hand-edit what a rule cannot express**: credit sentences (keep the fact, drop the person), manifest objects (delete the field rather than blanking it), and doc-tag blocks (delete the tag lines, tidy the comment).
5. **Follow the metadata into tests and packaging.** Tests that assert `author`, `license`, `repository`, or a legacy package name must be rewritten to assert absence or the new value, never deleted wholesale. Packaging checks that require a `LICENSE` file (pack budgets, manifest allowlists, `license-files` globs) are updated to the new state; a required-file list is edited, not silently left failing.
6. **Sweep again, differently.** The second pass uses patterns the first did not: backslash path forms (`C:\Users\name`, `C:\\Users\\name`), case variants (`Name`, `NAME`), split path segments (`"@scope", "name"`), and the noreply address forms. The worked example lost a username to exactly the first two of these.
7. **Verify to zero.** Rerun `attribution_sweep.py`; every first-party category should be zero or explained (an allowlist entry with a reason). Diff the baseline to list every file touched.

## Git history

Three options, in order of preference for an archive:

| Option | What changes | When |
| --- | --- | --- |
| Leave history as it is | Nothing; the report states that commit metadata carries the identities | Default when the acquirer is fine with the seller's identity in history, or when the repository was ever public (forks keep the data regardless) |
| Add a `.mailmap` | Display only: `git log` and `git shortlog` show canonical values; stored objects are unchanged | When the acquirer wants identities hidden from ordinary reads without an irreversible rewrite |
| Rewrite with `git filter-repo` | Author, committer, and tagger identities via `--mailmap`; strings via `--replace-text`; files via `--invert-paths --path`; commit hashes and signatures change | Only with explicit approval recorded in the intake manifest; always in a fresh clone; never by adopting `--force` as a habit; push back with `git push --force --mirror` |

Rules from the research that the procedure keeps: rotate any secret before rewriting, because rotation may make the rewrite unnecessary; expect signatures to be dropped and closed pull-request diffs to break; and say plainly in the report that clones, forks, and cached views are outside reach.

## Shell and tool pitfalls

- Some harness shells collapse `\\` to `\` inside commands and heredocs. Build backslash patterns with `chr(92)` in Python or write the script to a file first; a character class that must match a backslash needs two of them in the pattern string.
- `grep -P` with `\x{2014}` fails under a C locale and, when chained with `||`, reports success. Use byte patterns (`\xE2\x80[\x93\x94]`) or Python.
- Hard-deleting files needs an explicit instruction and a recoverable backup first. The scrub edits files; it does not delete trees.
- Commit only when asked. Leave the modified files for review with the report.

## Output

- The applied replacement map (kept with the intake manifest, outside the repository).
- The list of hand-edited files and what changed in each.
- Sweep results before and after, and the baseline diff, for section 3 of the report.
