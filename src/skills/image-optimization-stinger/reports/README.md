# Reports: image-optimization-stinger

This folder collects past optimization audit reports produced by `image-optimization-worker-bee`.

Each audit run produces a dated report saved as:
```
reports/YYYY-MM-DD-{project-name}-image-audit.md
```

The report template lives at `templates/image-audit-report.md`.

## Report format

Reports follow the structure from `templates/image-audit-report.md`:
1. Scorecard
2. Image inventory
3. Format breakdown
4. srcset/sizes audit
5. LCP candidates
6. Placeholder audit
7. width/height audit
8. Remediation checklist (prioritized)
9. Estimated impact

## Folder state

Initially empty. Reports accumulate over time as `image-optimization-worker-bee` is invoked on projects.
