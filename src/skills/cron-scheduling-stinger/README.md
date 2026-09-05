# cron-scheduling-stinger

This stinger equips `cron-scheduling-worker-bee` to design, implement, debug, and monitor scheduled jobs across Vercel Cron, Cloudflare Cron Triggers, GitHub Actions `schedule:`, POSIX cron, pg_cron, and BullMQ.

**Command Brief:** `ai-tools/command-briefs/cron-scheduling-worker-bee-command-brief.md`
**Research:** `research/research-summary.md` (normal-depth sweep, 2025-11 to 2026-05)

## Quick start

1. Read `SKILL.md` for the master index, platform decision tree, and cron expression cheat sheet.
2. Jump to the guide for your specific need:
   - Cron syntax → `guides/00-cron-expression-syntax.md`
   - Platform limits → `guides/01-platform-limits.md`
   - Distributed duplication → `guides/02-distributed-cron-correctness.md`
   - Timezone/DST → `guides/03-timezone-dst-safety.md`
   - Retry/failure → `guides/04-retry-and-failure-handling.md`
   - Monitoring → `guides/05-observability-monitoring.md`
   - Audit all cron jobs → `guides/06-audit-and-inventory.md`
3. See `examples/` for worked code snippets.
4. Use `templates/cron-job-spec.md` when specifying a new job.
