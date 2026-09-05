# Reports

This folder accumulates CRM integration audit reports and sync design reviews produced by `crm-integration-worker-bee`.

## Report types

| Type | Template | Naming convention |
|---|---|---|
| Integration spec | `templates/integration-spec.md` | `YYYY-MM-DD-{product}-{crm}-integration-spec.md` |
| Code audit | `templates/code-audit-checklist.md` | `YYYY-MM-DD-{product}-{crm}-audit.md` |
| Dedup strategy | `templates/dedup-strategy-worksheet.md` | `YYYY-MM-DD-{product}-{crm}-dedup-strategy.md` |

## Accumulation

Each engagement produces one or more report files. Reports are append-only; do not modify past reports. If a follow-up audit supersedes a prior one, create a new dated file and reference the prior report in the header.
