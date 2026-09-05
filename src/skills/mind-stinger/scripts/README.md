# mind-stinger scripts

Deterministic audit scripts that mind-worker-bee runs to surface findings without judgment.

| Script | Purpose | Exit code |
|---|---|---|
| `audit-untraced-llm-calls.ts` | Static AST scan: find LLM calls not wrapped in `traceAICall()` | # must-fix findings |
| `audit-tenant-id-filters.ts` | Static AST scan: find Qdrant queries without `tenant_id` filter | # findings |
| `coach-routing-audit.ts` | Pull `AiTrace` rows, compute routing accuracy per coach, flag below 90% | # coaches flagged |
| `retrieval-precision-snapshot.ts` | Pull `AiTrace.retrievalScore` distribution, flag sustained < 0.4 | 1 if alert, else 0 |

## Running

All scripts run with `pnpm tsx`:

```bash
# Static audits — local, fast
pnpm tsx .claude/skills/mind-stinger/scripts/audit-untraced-llm-calls.ts api/src
pnpm tsx .claude/skills/mind-stinger/scripts/audit-tenant-id-filters.ts api/src

# Operational audits — DB access required
pnpm tsx .claude/skills/mind-stinger/scripts/coach-routing-audit.ts \
  --tenantId=<id> --window=7d
pnpm tsx .claude/skills/mind-stinger/scripts/retrieval-precision-snapshot.ts \
  --tenantId=<id> --window=7d
```

The static scripts (`audit-untraced-llm-calls`, `audit-tenant-id-filters`) require `ts-morph`. The operational scripts (`coach-routing-audit`, `retrieval-precision-snapshot`) require Prisma client access.

## In CI

The static scripts are CI-safe (no DB access). Recommended:

```yaml
# .github/workflows/mind-audit.yml
- run: pnpm tsx .claude/skills/mind-stinger/scripts/audit-untraced-llm-calls.ts api/src
- run: pnpm tsx .claude/skills/mind-stinger/scripts/audit-tenant-id-filters.ts api/src
```

Failing exit code → must-fix findings → blocks merge.

The operational scripts are best run as a weekly cron, with output posted to a Slack channel for the eval-review cadence (see `guides/17-evaluation-discipline.md §6`).

## What the scripts DON'T cover

- **Rerank skipping**: requires runtime tracing of `cohere-client.rerank()` calls.
- **Coach persona drift**: needs a live comparison of `AiCoachConfig.systemPrompt` (DB) vs Valkey-cached value.
- **`temperature` / `max_tokens` drift**: partial coverage (literal-detection in source) but tunable values from `getAIConfig()` need runtime inspection.
- **Sycophancy creep**: already auto-computed by `computeAgreementRate()` and stored in `AiTrace.agreementScore`; reporting goes through `retrieval-precision-snapshot.ts` pattern (a similar script could be added).
- **`PromptVersion` audit-on-change**: best done by code review, not static scan.

These gaps are intentional: the scripts cover the highest-leverage deterministic checks, not everything.

## Adding a new script

When adding a script:

1. Header comment must include: purpose, run command, source-of-truth doc reference, source-of-truth Stinger guide reference.
2. Exit code reflects severity (0 = clean, > 0 = findings).
3. Output is markdown to stdout (not files) so the CI can capture and post.
4. Add to the table above + the `SKILL.md` scripts section.
5. Document any new operational-data dependencies (Prisma access, Valkey access, etc.).
