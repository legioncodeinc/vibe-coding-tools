> Per-stinger `reports/` folders have been retired. Reports live in the host repo's `library/` tree:
>
> - **Feature-tied audits:** `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-seo-audit.md`
> - **Issue-tied audits:** `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-seo-audit.md`
> - **Standalone audits:** `library/requirements/reports/seo/<date>-<topic>.md` (e.g. `<date>-seo-audit-<branch>.md`, `<date>-schema-validation.md`, `<date>-web-vitals-snapshot.md`, `<date>-cwv-remediation-<route>.md`)
>
> Use `guides/09-audit-checklist.md` as the report's structure: walk it top to bottom, and every unchecked item needs either a fix or an explicit written reason it's out of scope. This stub remains so existing references don't 404.
