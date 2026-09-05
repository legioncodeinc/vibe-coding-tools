# Reports

This folder accumulates audit reports produced by `product-feedback-roadmap-worker-bee` when invoked for a full feedback-system audit.

## Naming convention

```
YYYY-MM-DD-<company-or-context>-feedback-audit.md
```

Example: `2026-07-15-acme-saas-feedback-audit.md`

## What an audit report contains

A feedback-system audit report covers:

1. **Platform assessment** — current tool(s) in use; scoring against the platform selection decision tree.
2. **Collection surface coverage** — which surfaces (widget, portal, voting board) are configured and how.
3. **De-duplication backlog** — how many duplicate clusters identified; merge recommendations.
4. **Status transition health** — requests per status; items > 30 days in "Under Review"; notification gaps.
5. **Prioritization discipline** — is a scoring framework in use? Last RICE/ICE run date.
6. **Roadmap posture** — public vs private; date commitments vs. status-only; sandbagging risk.
7. **Integration health** — which integrations are wired; sync gaps identified.
8. **Priority findings** — top 3-5 findings with severity (Critical / High / Medium / Low).
9. **Recommended next steps** — ordered action list.

## Initial state

This folder is empty. Reports are created on demand by `product-feedback-roadmap-worker-bee` when a user requests an audit. Save reports here for team reference and future comparisons.
