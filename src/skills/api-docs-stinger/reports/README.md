# Reports

This folder accumulates past API documentation audit summaries produced by `api-docs-worker-bee`.

## Report shape

Each report is a dated markdown file named: `YYYY-MM-DD-{project-name}-api-docs-audit.md`

A report contains:

1. **Project:** the API name, spec location, and current renderer.
2. **Audit table:** pass/fail/warn for each of the 10 done-checklist items.
3. **Findings:** numbered list of issues found, each with severity (critical / high / medium / low) and a fix recommendation.
4. **Actions taken:** what was changed during the session.
5. **Open items:** issues not fixed in this session, with owner and target date.

## Example report file naming

```
reports/2026-05-20-payments-api-audit.md
reports/2026-06-15-user-api-initial-setup.md
```

Reports are optional. Emit one when the user asks for an audit summary or when multiple findings need tracking across sessions.
