# Archivist Report: {repo-name}

> Prepared: {YYYY-MM-DD} | Bee: archivist-worker-bee | Stinger: archivist-stinger | Status: Complete

Filed at `library/requirements/reports/{YYYY-MM-DD}-archivist-report.md` (Library Schema v2 repository-wide report). The intake manifest it builds on stays outside the repository.

## 1. Outcome in one paragraph

{What the repository was, what it is now, and the one or two facts a reviewer must know before trusting the archive.}

## 2. Provenance and scope (phase 1)

| Item | Result |
| --- | --- |
| Ownership basis recorded | {yes; instrument reference held outside the repo} |
| Contributor coverage | {sole author; or n uncovered contributors flagged} |
| First-party notices removed | {list} |
| Third-party notices preserved | {list, with paths} |
| Generated files left as-is | {lockfiles etc.} |

## 3. Attribution and PII scrub (phase 2)

| Category | Hits before | Hits after | How handled |
| --- | --- | --- | --- |
| Copyright and license markers | {n} | 0 | {removed from first-party files; third-party preserved} |
| Author and maintainer tags | {n} | 0 | removed |
| Contributor credits | {n} | 0 | {sentences rewritten to keep the technical fact, credit dropped} |
| Handles | {n} | 0 | removed |
| Emails | {n} | 0 | removed; placeholder domains exempt |
| Upstream repository links | {n} | 0 | {converted to plain issue and PR numbers} |
| Funding, social, profile links | {n} | 0 | removed |
| Home-directory usernames | {n} | 0 | replaced with `<HOME>` or a neutral fixture name |
| Bundle identifiers and scoped package names | {n} | 0 | {renamed to neutral or acquirer scope} |
| Git author identities | {n} | {unchanged or rewritten} | {user decision} |

Verification: final repo-wide sweep returned {zero hits outside excluded generated files}.

## 4. Documentation merge (phase 3)

- Legacy tree: {path}, {n} files. Destination counts: public {n}, private {n}, evidence {n} (hash-verified).
- Pointers repointed outside the library: {list}.
- Tests still targeting the legacy tree: {list} (reported, not modified).
- Legacy tree: {retired with backup at ...; or left in place}.

## 5. Knowledge base (phase 4)

| Measure | Count |
| --- | --- |
| Bees dispatched (merge + writers) | {n} |
| New private narrative docs | {n} across {n} domains |
| Relocated private docs | {n} |
| Public docs | {n} |
| Verifier result | {files, headed, problems (accepted: list)} |
| Corrections bees made to the brief | {list: the facts the code contradicted} |

Entry points: `library/knowledge/private/overview.md`, `library/knowledge/public/overview/product-overview.md`.

## 6. Identifier rename (phase 5)

| Item | Result |
| --- | --- |
| Old identifier forms found | {kebab n, screaming n, title n, snake n, pascal n} |
| Renamed | {which forms and where: package name, bins, manifests, provider ids, bundle ids, filenames} |
| Deliberately unchanged | {env vars, storage paths, internal symbols; and why} |
| Leftovers | {zero, or the exact files} |
| Syntax or manifest checks | {scripts parse; manifests valid} |

## 7. Decisions for the acquirer

1. {Git history rewrite: not performed; command or offer.}
2. {Legacy tree retirement or stray files needing a delete.}
3. {Any uncovered contributor or third-party notice that needs legal review.}
4. {Optional deeper rename (env vars, storage paths).}
5. {Tests to repoint or remove.}

## 8. Environment notes worth keeping

{Anything that would save the next run time: model alias problems, shell quoting pitfalls, locale limits on regex tools, hooks that reject content.}
