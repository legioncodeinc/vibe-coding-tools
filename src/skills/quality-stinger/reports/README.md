> **DEPRECATED**, per-stinger `reports/` folders have been retired. QA reports now live in the host repo's `library/` tree:
>
> - **Feature-tied:** `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-qa-report.md`
> - **Issue-tied:** `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-qa-report.md`
> - **Standalone audits:** `library/requirements/reports/quality-audits/<date>-<plan-name>-qa-report.md`
>
> The canonical QA report template lives at [`../templates/qa-report.md`](../templates/qa-report.md). The teaching set (happy-path, blocker-heavy, ordering-violation) lives in [`../examples/`](../examples/). This stub remains so existing references don't 404, it can be removed via `git rm` when convenient.
