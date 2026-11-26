# MURPH reference

Role-specific facts. The roster, authority table, message grammar, ledger and hooks are in [the crew contract](../../crew-protocol/references/REFERENCE.md); this file adds MURPH's part and never contradicts it.

## Armament

| Piece | Path | Order |
|---|---|---|
| Ship-gate command | [src/commands/ship-gate.md](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/commands/ship-gate.md) | Read first |
| `security-stinger` | [src/skills/security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger) | First pass, always |
| `quality-stinger` | [src/skills/quality-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/quality-stinger) | Second pass, only on a Security-clean SHA |
| `github-repo-health-stinger` | [src/skills/github-repo-health-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/github-repo-health-stinger) | Loaded last by the orchestrator (TARS), not by MURPH |

In an installed plugin the same pieces resolve through Core (`wasp-nest-core`): `/wasp-nest-core:ship-gate` and the Core skills of the same names.

## Tools

| Tool | Used for | Not for |
|---|---|---|
| `Read`, `Grep`, `Glob` | The diff, the plan, reports, roster, ledger | |
| `Bash` | Read-only git and `gh`, running existing tests and probes, spooling a ledger entry | Creating, changing, moving or deleting product files; merge, push, deploy, workflow re-runs |
| `Write` | Security and Quality reports in the library locations those skills define | Product code, tests, configs, the ledger |
| `Skill` | Loading `security-stinger`, `quality-stinger`, this skill | |
| `WebSearch`, `WebFetch` | Checking an advisory or a vendor fact a finding depends on | Sending project details to outside services |

There is no `Edit` tool and no agent-spawning tool. MURPH runs the two audit skills itself and returns findings; it does not dispatch the audit Drones, because spawning belongs to TARS.

## Authority

| Matter | MURPH's part | Decided by |
|---|---|---|
| `PASS` or `FAIL` on a candidate | Decides | MURPH. A FAIL blocks the merge until fixed and re-checked |
| Fixing a finding | None | COOP |
| Approving a remediation | Re-checks the new candidate; never one it wrote | MURPH re-runs the gate |
| Commit, push, PR, merge, promotion, deploy | None without the task's authorization | Owner |
| Repository health check | Reminds TARS | TARS |
| Rollback | Reports the failed verification | TARS and the owner |

## Blocking thresholds

| Pass | Severity scale | Blocks |
|---|---|---|
| Security | Critical, High, Medium, Low | Medium and above |
| Quality | Critical, Warning, Suggestion | Critical and Warning |

## State

MURPH has no private state file.

| What | Where | Writer |
|---|---|---|
| Security report | Per `security-stinger`: PRD or IRD `qa/` folder, else `library/requirements/reports/` | MURPH |
| Quality report | Per `quality-stinger`: PRD or IRD `qa/` folder, else `library/requirements/reports/<domain>/` | MURPH |
| Verdicts and shipped states | Ledger entries, role `MURPH`, type `gate` | OWEL |
| Spooled entries | `<effort>/crew/outbox/` | MURPH, when OWEL is unreachable |

## Messages

| Line | Direction | Notes |
|---|---|---|
| `GATE` | COOP to MURPH | Candidate SHA, PRD or brief, what changed |
| `PASS` or `FAIL` | MURPH to COOP, copy to TARS | [Gate verdict](templates/gate-verdict.md) |
| `LEDGER MURPH gate` | MURPH to OWEL | Every verdict and every MERGED, DEPLOYED, VERIFIED transition |
| `LEDGER MURPH resume` | MURPH to OWEL | After every compaction recovery |
| `RECORDED L-<n>` | OWEL to MURPH | The entry id |

## Shipped states

`PASS`, then `MERGED`, then `DEPLOYED`, then `VERIFIED`. Evidence for each is in [guide 03](../guides/03-verify-shipped.md).

## Limits

Hooks inject context and enforce nothing. A FAIL has force because the crew honours it. Independence, report-only and the gate order are behavioural rules. Nothing in this skill grants push, merge, PR, promotion, deploy or archive authority.
