# ADR operational practice: naming, lifecycle, cadence, anti-patterns

- **Title:** Architecture Decision Records: Templates and Operational Patterns for Teams
  That Actually Maintain Them
- **URL:** https://hidekazu-konishi.com/entry/architecture_decision_records_templates_and_operations.html
- **Fetched:** 2026-08-17
- **Source type:** community (practitioner blog, no disclosed measurement, opinion informed
  by practice)

## File naming and layout

Sequential, monotonic numbering. Quoted: "Numbers are assigned monotonically and never
reused, even when an ADR is deprecated."

Format: `NNNN-kebab-case-title.md`, for example `0014-store-sessions-in-postgres.md`.

Recommended directory:

```
docs/adr/
  0000-record-architecture-decisions.md
  0001-use-postgres-as-primary-datastore.md
  decision-log.md
  template-nygard.md
```

## Status lifecycle, four states

| Status | Meaning as stated |
|---|---|
| Proposed | "The ADR has been written and opened for review. The decision is not yet in force." The only mutable state. |
| Accepted | "The decision is in force. The ADR is now considered immutable." |
| Deprecated | No longer applicable, with no replacement. |
| Superseded by ADR-NNNN | The number of the replacement is in the status field "so the chain is traversable forward." |

The immutability rule restated: if the conclusion later turns out wrong, the new record
says so and the old record's status points forward to it. The old text is not edited.

## Review cadence

Pull request based. Proposer opens with status Proposed, reviewers comment inline, on
consensus the status flips to Accepted and merges. A **quarterly architecture review**
examines the whole collection for staleness and gaps. Large decisions get a synchronous
review meeting before the pull request.

## Granularity: what earns a record

Quoted: "ADRs are for decisions that are hard to reverse, that span multiple components, or
that materially affect operability or security. A formatter choice is not an ADR. A
datastore choice is."

The opposite failure is also named: only "cosmic" decisions recorded, with the load-bearing
middle layer missing.

## Index

An `index.md` or `README.md` listing every record by number, title, and status. Without it
"the directory is a wall of filenames that nobody can navigate."

## Seven named anti-patterns

1. The first five are the only five. Momentum dies after the initial batch.
2. Trivial decisions recorded while load-bearing ones are skipped.
3. Advocacy documents that hide the tradeoffs.
4. Silent edits to accepted records, which breaks the audit trail.
5. Storage in a wiki nobody checks.
6. Decision drift: the system changes, the record does not.
7. A single owner, so the practice lapses when that person leaves.

## Evidence quality

Practitioner assertion throughout. No study, no sample, no measurement. The naming, numbering,
and lifecycle conventions are consistent with the primary Nygard source, so treat those as
corroborated. The quarterly cadence and the anti-pattern list are one practitioner's
experience and are cited as such.
