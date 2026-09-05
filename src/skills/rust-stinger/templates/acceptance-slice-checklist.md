# Rust acceptance slice checklist: {{slice_name}}

- [ ] Read repository instructions, PRD/ADR/ledger, criteria, gates, and current Security/Quality evidence.
- [ ] Confirm repository/worktree and exact owned paths.
- [ ] Preserve unrelated and concurrent edits.
- [ ] Map each changed path and test to {{AC_IDS}}.
- [ ] Inventory crate/features/targets/tasks/channels/migrations/errors/config/logs/unsafe.
- [ ] Record version-sensitive decisions and revalidation points.
- [ ] Add a focused failing test before implementation.
- [ ] Prove cancellation, backpressure, retry/replay, shutdown, and cleanup where affected.
- [ ] Prove transactions, migrations, idempotency, concurrency, and crash recovery where affected.
- [ ] Use fake providers/fixtures unless a live gate is explicitly authorized.
- [ ] Run format, compile/check, Clippy, tests, docs, and affected specialized gates.
- [ ] Generate release evidence locally without signing/publishing unless authorized.
- [ ] Route Security, rerun affected checks after fixes, then route Quality.
- [ ] Report exact commands, results, external effects, limitations, blockers, and rollback/recovery.
