# reports/

Reports land in the host repo's `library/` tree, not here:

- **Standalone audits / investigations:** `library/requirements/reports/retrieval/<date>-<topic>.md`
- **Feature-tied reports:** `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-<type>-report.md`
- **Issue-tied reports:** `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`

Slug examples for `<topic>`: `recall-audit-<query-set>`, `fallback-investigation`, `skillify-gate-audit`, `propagation-scope-leak`, `recall-eval-quarterly`, `graph-stale-investigation`.

Use [`audit-template.md`](./audit-template.md) as the starting skeleton for any recall or skillify quality audit.
