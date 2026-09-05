> **DEPRECATED** - per-stinger `reports/` folders have been retired. Reports now live in the host repo's `library/` tree:
>
> - **Feature-tied reports:** `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-<type>-report.md`
> - **Issue-tied reports:** `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`
> - **Standalone audits:** `library/requirements/reports/ci/<date>-<topic>.md`
> - **Build/CI/release architecture or migration plans:** `library/knowledge/private/architecture/<date>-<topic>.md`
>
> The audit template has moved to [`../templates/audit-template.md`](../templates/audit-template.md). This stub remains so existing references don't 404 - it can be removed via `git rm` when convenient.
