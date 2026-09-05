# Reports

This folder accumulates audit findings reports produced by `http-rest-fundamentals-worker-bee`.

Each report is a dated markdown file following the template at `../templates/findings-report.md`.

## Naming convention

```
YYYY-MM-DD-<branch-or-scope>-http-audit.md
```

Example: `2026-05-20-feature-api-v2-http-audit.md`

## What a report contains

- One-paragraph summary of overall API health
- Severity-tagged findings (Critical / High / Medium / Informational)
- RFC citation for each finding
- Concrete remediation steps per finding
- Handoffs to `security-worker-bee` (OWASP-level header security) and `auth-worker-bee` (auth-header semantics)

## Accumulation

Reports accumulate over time as new audits are run. No report is deleted; they form an audit trail.
