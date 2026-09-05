# Reports: ai-tools-platform-stinger

This folder accumulates durable recommendation and audit reports produced by `ai-tools-platform-worker-bee`.

## Report types

- **Provider selection reports**: dated recommendations for a project's AI provider stack, following `templates/provider-comparison.md`.
- **Cost estimate reports**: monthly AI spend projections following `templates/cost-estimate.md`.
- **Stack audit reports**: review of an existing AI tooling setup against the stinger's severity rubric (must-fix / should-refactor / style).
- **MCP toolbox audits**: inventory of installed MCP servers and recommendations for additions or removals.

## Naming convention

```
YYYY-MM-DD-<project-slug>-<report-type>.md
```

Examples:
- `2026-05-20-my-saas-provider-selection.md`
- `2026-06-01-my-saas-cost-estimate-q3.md`
- `2026-07-15-my-saas-stack-audit.md`

## Lifecycle

Reports are point-in-time documents. The AI tooling landscape changes every 60-90 days; re-run the relevant guide when a major model release or repricing event occurs. Each report should include a "valid as of" date and a "re-evaluate when" trigger.
