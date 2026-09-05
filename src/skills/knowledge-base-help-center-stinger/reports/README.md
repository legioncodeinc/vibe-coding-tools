# Reports

This folder accumulates past-run reports produced by `knowledge-base-help-center-worker-bee`.

## Report types

| File pattern | Contents |
|---|---|
| `YYYY-MM-DD-kb-plan.md` | KB setup or migration plan produced for a specific user engagement |
| `YYYY-MM-DD-platform-selection.md` | Completed platform selection matrix with scoring |
| `YYYY-MM-DD-content-gap-triage.md` | Weekly content triage output (copy of the completed template) |
| `YYYY-MM-DD-ai-deflection-audit.md` | AI deflection configuration review and recommendations |

## How reports accumulate

Reports are NOT auto-generated. `knowledge-base-help-center-worker-bee` produces a plan document at the end of each engagement session. The user (or the orchestrator) saves a copy here for audit trail purposes.

## Initial state

This folder is empty on first deploy. The first report appears after the first `knowledge-base-help-center-worker-bee` engagement that produces a durable output.
