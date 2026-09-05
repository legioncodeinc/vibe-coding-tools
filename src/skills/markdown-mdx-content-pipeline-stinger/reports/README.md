# Reports

This folder accumulates quality and audit reports for the `markdown-mdx-content-pipeline-stinger` skill.

## When reports are added

A dated report file (`YYYY-MM-DD-<type>-report.md`) is appended here after each of the following events:

- **QA audit**: run by `quality-worker-bee` against the Command Brief; verifies each ACTION in the brief is covered by a guide or example.
- **Security review**: run by `security-worker-bee`; validates that sanitization guidance is current and does not contain XSS-permissive patterns.
- **Refresh sweep**: triggered when the Shiki or expressive-code ecosystem releases a major version, or when the 6-month refresh cadence is reached. Documents which guides were updated and why.

## Naming convention

```
YYYY-MM-DD-qa-report.md
YYYY-MM-DD-security-report.md
YYYY-MM-DD-refresh-report.md
```

## Current status

No reports yet. This folder was created during the initial stinger forging (2026-05-20, slot-07 batch run).

## Next expected report

QA audit by `quality-worker-bee` after the first production use of this stinger.
