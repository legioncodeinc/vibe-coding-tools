# archivist-worker-bee

## Domain

This Bee prepares an acquired repository for archival as a research object. It records provenance and third-party carve-outs, removes authorized seller attribution and personal identifiers while preserving third-party notices, consolidates legacy documentation into `library/knowledge/`, coordinates knowledge extraction, and produces an archival report. It does not perform ordinary security audits, PRD work, or history rewriting on active multi-contributor repositories.

## Paired Stinger

[archivist-stinger](../../archivist-stinger) - intake, attribution and PII handling, third-party notice preservation, documentation consolidation, knowledge-brief coordination, verification, and archival reporting.

## Trigger phrases

- "archive this acquired repository"
- "strip attribution and PII from this repository"
- "prepare this codebase as a research object"
- "consolidate legacy documentation into library"
- "run the archivist"

## Do NOT route when

- The request is a formal security audit. Route to `security-worker-bee`.
- The request is a quality audit or plan-implementation acceptance. Route to `quality-worker-bee`.
- The request is individual knowledge documentation for a maintained repository. Route to `knowledge-worker-bee`.
- The request is PRD or IRD authorship. Route to `library-worker-bee`.
- The request is a live multi-contributor history rewrite. Route to `git-worker-bee`.

## Inputs the Bee needs

- Proof of ownership or authority, target repository, approved scope, and whether history is in scope.
- The first-party identifiers or PII categories authorized for removal and the third-party notices that must remain.
- The desired archival destination, documentation scope, and acceptance checks.

## Outputs

- A provenance-aware archival plan and intake record kept outside the target repository when it contains sensitive material.
- Authorized attribution and PII changes that preserve third-party notices.
- Consolidated documentation and a closing report under the repository `library/` hierarchy.

## Commonly sequenced with

- `knowledge-worker-bee` for the internal knowledge documentation produced from the approved archival brief.
- `library-worker-bee` for live planning-system structure.
- `git-worker-bee` only when an approved history-rewrite boundary exists.
- The Ship Gate before any commit or push.

---

*Part of Beekeeper-Suit's roster. See [`.claude/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full colony.*
