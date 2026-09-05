# Archival Intake Manifest

> Repository: {repo-name} | Prepared: {YYYY-MM-DD} | Prepared by: archivist-worker-bee | Status: Draft

The single document that records what was acquired, what was found, and what the archivist is therefore allowed to remove. Nothing in phase 2 (scrub) may run until every "Decision" cell below is filled by the acquiring party or explicitly delegated.

## 1. Ownership basis

| Item | Value |
| --- | --- |
| Acquisition instrument | {assignment agreement, purchase order, or other reference; never paste the document itself} |
| Acquired party (seller) | {legal entity or individual as named in the instrument; kept here only, never propagated into the repository} |
| Acquiring party | {entity that now holds the rights} |
| Scope stated in the instrument | {whole repository, named components, or specific commits or tags} |
| Contributor coverage | {sole author; all contributors assigned; contributors NOT covered: list handles or counts} |

## 2. Provenance census (from the repository itself)

| Signal | Finding | Source of the finding |
| --- | --- | --- |
| Distinct git author identities | {n} across {m} commits | `attribution_sweep.py --git` |
| Credits in release notes, changelogs, docs | {n} distinct handles or names | `attribution_sweep.py` credit and handle categories |
| Package manifest identity fields | {author, maintainers, repository, homepage, bugs, funding: present or absent per manifest} | ecosystem manifest table |
| Notice-bearing files | {LICENSE, COPYING, NOTICE, AUTHORS, CONTRIBUTORS, CODEOWNERS: list} | `attribution_sweep.py` notice list |
| SPDX or REUSE headers in source | {count of files with SPDX-License-Identifier or SPDX-FileCopyrightText} | grep |
| Vendored or copied third-party code | {paths; their own licenses and notices} | `attribution_sweep.py` third-party class |
| Generated files carrying upstream metadata | {lockfiles, snapshots, generated bundles} | `attribution_sweep.py` generated class |
| Machine or environment identifiers | {home paths, hostnames, internal URLs} | home-path category |
| Secrets or credentials present | {none found, or count by type} | secrets scan (see guide 02) |

## 3. License inventory

| Location | Declared license | Owner class | Decision |
| --- | --- | --- | --- |
| {LICENSE at root} | {SPDX id or text summary} | first-party | {remove: covered by acquisition} |
| {vendor/x/LICENSE} | {SPDX id} | third-party | {preserve verbatim} |
| {src/lib/foo.c header} | {SPDX id} | {first-party or third-party} | {remove or preserve} |
| {package manifest license field} | {SPDX id} | first-party | {remove or replace} |

Rule of the table: an acquisition transfers the seller's copyright and lets the acquirer strip the seller's own notices. It transfers nothing about a dependency, a vendored library, or a contributor who did not assign rights. Those rows are always "preserve" unless the instrument covers them explicitly.

## 4. PII inventory

| Class | Count | Examples (redacted) | Decision |
| --- | --- | --- | --- |
| Personal names | {n} | {surname initials only} | remove |
| Email addresses | {n} | {domain only} | remove; placeholder domains exempt |
| Handles (forge, social, chat) | {n} | {count per platform} | remove |
| Personal URLs and funding links | {n} | {platform only} | remove |
| Home-directory usernames in fixtures, logs, evidence | {n} | {path shape only} | replace with neutral placeholder |
| Git author identities | {n} | {count} | {rewrite history: yes, no, or defer to user} |

## 5. Scope decisions for later phases

| Decision | Choice | Rationale |
| --- | --- | --- |
| Rewrite git history | {yes, no, defer} | {history rewrite is destructive; requires explicit approval} |
| Retire the legacy docs tree after merge | {yes, backup first} | {content preserved under library/} |
| Rename the product identifier | {new identifier or none} | {which forms are in scope: package, commands, env vars, storage paths, internal symbols} |
| Knowledge-base focus domains | {list} | {what the acquirer cares most about} |
| Public documents | {yes, from user docs; or private only} | |

## 6. Sign-off

- Intake reviewed by: {name or role, kept outside the repository}
- Date: {YYYY-MM-DD}
- Phase 2 authorized: {yes or no}
