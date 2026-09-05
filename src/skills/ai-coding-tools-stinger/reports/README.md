# Reports: ai-coding-tools-stinger

This folder collects past recommendation audits and periodic refresh notes produced by `ai-coding-tools-worker-bee`.

## What goes here

- **Recommendation audits:** When a recommendation was made, what tool was selected, and how it performed after a review period (if the user reports back).
- **Benchmark refresh notes:** Dated notes when SWE-bench or Aider leaderboard scores are re-fetched and guides are updated.
- **Footgun updates:** Notes when a documented Cline, Aider, or other tool failure mode is resolved or a new one is discovered.

## File naming

```
YYYY-MM-DD-[type]-[slug].md
```

Examples:
- `2026-05-20-recommendation-audit-cursor-aider-typescript-monorepo.md`
- `2026-08-15-benchmark-refresh-swe-bench-verified.md`
- `2026-07-01-footgun-update-cline-v3-file-editing.md`

## Refresh cadence

**Every 3 months** (or immediately on a major tool release or acquisition). Sections with the highest churn:
1. SWE-bench and Aider leaderboard scores (guides/02-benchmark-data.md)
2. Default model routing per tool (guides/03-model-routing.md)
3. Windsurf ownership and trajectory (all guides mentioning Windsurf)

The research folder (`research/`) should be re-run via `scripture-historian` at `shallow` depth on each refresh.
