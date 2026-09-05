# Legacy documentation merge map

> Repository: {repo-name} | Legacy tree: {docs/ or equivalent} | Prepared: {YYYY-MM-DD}

Every file in the legacy tree gets exactly one row. The merge is complete when every row has a destination or an explicit "not documentation, dropped" decision, and the count of rows equals the count of files.

## Destination rules

| Legacy content kind | Destination under `library/knowledge/` | Status header |
| --- | --- | --- |
| User landing pages, daily guides, feature maps | `public/overview/` | Active |
| Getting started, configuration, troubleshooting, upgrade guides | `public/guides/` | Active |
| FAQ | `public/faqs/` | Active |
| Command, settings, path, API, error references | `public/reference/` | Active |
| Release notes, changelog history | `public/releases/` (one file per version) | Active |
| Maintainer architecture references, scope maps | `private/architecture/` | Active |
| Planning documents, implementation plans, handoffs | `private/architecture/history/` | Archived |
| Config field inventories and resolution flows | `private/data/` | Active |
| Testing guides, benchmark methodology | `private/infrastructure/` | Active |
| UI parity checklists | `private/frontend/` | Active |
| Runbooks | `private/operations/` (`runbook-<slug>.md`) | Active |
| Audit snapshots and their evidence | `private/operations/audits/` (evidence copied byte for byte, no header) | Archived |
| Documentation governance, style guides, discoverability notes | `private/standards/` | Active |
| Site generator configuration (`_config.yml`, `mkdocs.yml`, `conf.py`) | not documentation: dropped, noted in the report | n/a |

## Transformation rules

1. Copy, transform, write; never edit the legacy tree in place. Retire it only after every row is verified.
2. Prepend the standard knowledge header; keep the body faithful. Relocation adds a header, a description, a Related section, and rewritten links. It does not rewrite prose.
3. Rewrite every relative link to the new location. Links to files that do not exist in the archive (contribution policy, code of conduct, security policy, issue templates) become plain text or are dropped.
4. Evidence folders are copied verbatim and verified by hash.
5. Release notes are transformed by script, not by hand: header, description from the first sentence, Related links to the previous and next version in semver order plus the portal page.
6. New prose written during the merge (headers, descriptions, Related sections, the portal index) contains no em or en dashes; pre-existing body text keeps its dashes.
7. Folder README indexes are not written by the merge bees; the orchestrator generates them after the fleet finishes.

## Mapping

| # | Legacy path | Destination | Category | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | `{docs/index.md}` | `public/overview/daily-guide.md` | Overview | Active | |
| 2 | `{docs/README.md}` | `public/overview/documentation-portal.md` | Overview | Active | index rewritten to new paths |
| 3 | `{docs/reference/commands.md}` | `public/reference/commands.md` | Reference | Active | |
| ... | | | | | |

## Verification record

- Legacy files counted: {n} markdown, {m} other
- Rows with destinations: {n + m minus dropped}
- Dropped as non-documentation: {list}
- Evidence files hash-verified: {m} of {m}
- Relative links resolving after merge: {all} (checker: `scripts/verify_kb.py`)
- Pointers outside the library repointed (README, manifests, help text, skills, comments, ignore files): {list}
- Tests that still target the legacy tree: {list, reported to the user}
- Legacy tree retired: {yes, backup at ...; or left in place pending user decision}
