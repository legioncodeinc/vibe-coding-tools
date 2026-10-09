# Run-watch report template

Fill per release run. Evidence convention: real Actions run URLs, no estimates (the verified-shipped standard).

```markdown
# Production release run report: <RELEASE_ID>

- Date/time (UTC):
- Release kind: normal | hotfix
- Operation: release | recover-*
- Operator (owner authorization reference):
- Target main SHA M:
- Staging SHA at freeze:
- Workflow: <name> run <run URL> (attempt N)

## Preflight results (7-step checklist)
1. Tree equality (main vs staging tree IDs): PASS | FAIL + detail
2. Freeze variables bound: STATUS/SHA/ID/FROZEN_STAGING values recorded?
3. Both branches locked (live lock_branch + enforce_admins): main PASS | FAIL, staging PASS | FAIL
4. Confirmation computed via <script> against live vars: yes | no
5. Required checks on M (check-runs API, not gh pr checks):
   - Quality Gates: <status> (<run URL>)
   - Dependency Audit: <status> (<run URL>)
   - Sandbox MVP Regression: <status> (<run URL>)
   - Release and Worktree Contracts: <status> (<run URL>)
   - (project-specific names from release policy)
6. Dispatch command issued: exact command, run URL
7. Post-success thaw: vars inactive + cleared; local advisory updated; branches re-locked

## Execution watch
- Preflight job: <conclusion> (<duration>)
- Execute job: <conclusion> (<duration>)
  - Migrations applied: <count>, one transaction per file: yes | no
  - Candidate deployment verified READY + identity: PASS | FAIL
  - Promoted exactly the recorded candidate: yes | no
  - Canonical deployment verified: PASS | FAIL
  - Queues held and resumed: PASS | FAIL
- Recovery receipts artifact: <artifact URL> | none expected

## Verification (shipped means verified-shipped)
- Post-deploy smoke job: PASS | FAIL
- Live releaseSha observed: <sha>
- Matches M: yes | no
- Live URL checked: <url>

## Refusals encountered and resolution
| Code | Step | Fix applied | Time cost |
|---|---|---|---|

## Notes / anomalies
- Zombie third-party suites ignored (vercel/coderabbitai QUEUED): yes | n/a
- Advisory-drift classification needed: n/a | regression | drift (+ triage record)
```
