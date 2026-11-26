# Crew recovery worksheet

Fill this after a compaction or restart when the facts are not all in front of you. It extends the worksheet in `time-blocked-turns` with the crew's own facts. Use `UNKNOWN` for anything you cannot establish; never guess.

| Fact needed | Recovered value | Evidence source |
|---|---|---|
| My role and role skill | | Hook notice, crew roster |
| Effort folder | | Claim, last handoff, TARS |
| The owner's ask and exact scope | | Owner message, brief or PRD |
| Work unit start and deadline, any extension | | Actual clock receipt, owner words |
| Last real progress and when | | Files, commits, check output |
| Attempts on the current problem (identical, distinct) | | Attempt log, flight recorder |
| What is verified, against which commit | | Check output matching that commit |
| Ledger submissions not yet confirmed | | Outbox folder, `RECORDED` replies |
| Pending questions and who holds them | | Messages, ledger tail |
| Approvals in force and their source | | Owner words, ledger `owner` entries |
| Other agents' files I must not touch | | Crew roster, chip briefs |

Then: reload the role skill, re-arm, send OWEL the `resume` line, continue.
