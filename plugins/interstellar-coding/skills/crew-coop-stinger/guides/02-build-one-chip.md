# 02. Build one chip

One chip, one outcome, one PR, on COOP's own branch. Authority and message formats are in [the crew contract](../../crew-protocol/references/REFERENCE.md); the cadence is from `time-blocked-turns`.

## 1. Stay inside the brief

- Build exactly the outcome in the chip brief. No refactors, cleanup, extra features, new dependencies or adjacent fixes.
- Do not narrow it either. If part of it cannot be done, say which part and why.
- An out-of-scope observation is one line in the report to TARS. Take no action on it.
- If the brief is wrong or two readings lead to different work, ask TARS before the dependent work. Keep doing independent authorized work meanwhile.

## 2. Pick the armament

| The chip is | Use | Notes |
|---|---|---|
| Driven by a PRD | `/smoke-it` | Its acceptance-criteria ledger is the checklist for the chip. Run its recon and execution phases |
| Anything else | `pest-controller-suit`, then the routed Drone's Stinger | Arm the Stinger and follow it |

Two crew rules sit on top of the armament:

- **Only TARS spawns.** As a desktop chip session, `/smoke-it` may dispatch specialist subagents for this chip's own scope. As a subagent of the TARS session, COOP cannot dispatch anything: arm the routed Stinger and do the work directly, and only when the chip brief records that direct work is authorized. Otherwise report the missing capability to TARS. COOP never starts a session, a crew role or a replacement.
- **MURPH is the gate.** The security and quality close-out is MURPH's, so the implementer does not grade its own work. COOP sends `GATE`, MURPH runs the checks, COOP fixes what fails.

## 3. Work in five-minute steps

Real progress at least every 5 minutes: a file changed, a check ran, a result was produced, a needed question was sent, or a finding changed the next action. Reading without a consequence does not count. Five minutes without it means the current approach is stuck: log the attempt and apply the limits below. These limits are self-tracked. No timer enforces them unless one was configured and verified.

## 4. Keep the attempt log

Write one row per attempt in [the attempt log](../references/templates/attempt-log.md), when the attempt ends, with the exact error text.

| Limit | Then |
|---|---|
| 2 attempts with the same approach, inputs and environment | Stop that approach. Never make an unchanged third attempt |
| 3 different approaches failed on the same problem | Stop work on that problem |
| 20 minutes without meaningful progress | Stop, even if the counts are lower |

A new approach needs one line saying what changed and why it could change the outcome. When a limit fires: preserve the work as in [guide 03](03-checkpoint-and-handoff.md), then report to TARS with the attempt log path and the exact failure. TARS routes it, so MOON can act on the stall and LADY can investigate. Do not keep trying under a new name, and do not ask another agent to retry for you.

## 5. Send milestones to OWEL

```text
LEDGER COOP progress | <effort> | <one-line summary> | evidence: <path, PR, SHA or none> | by: COOP
```

Milestones: chip started, each acceptance criterion or main piece done with its check passing, candidate ready for the gate, PR opened, a stop or handoff. Wait for `RECORDED L-<n>`. If OWEL is unreachable, spool the line; never drop it:

```text
node <crew-protocol>/scripts/ledger.mjs spool --outbox <effort>/crew/outbox --role COOP --type progress --effort <effort> --text "<one line>" --evidence <ref> --by COOP
```

## 6. Gate before "ready"

1. Run the checks that fit the change and see them pass. Never say done or verified without observed output.
2. Send MURPH: `GATE` with the candidate SHA (or the patch path if nothing is committed), the PRD or brief path, and what changed. Copy nothing else; MURPH reads the diff.
3. `PASS` covers that SHA only. Any later change needs a new `GATE`.
4. On `FAIL`, fix the blocking findings inside the chip scope, re-run your checks, and send `GATE` for the new candidate. A finding outside the chip scope goes to TARS.
5. Do not call the PR ready, and do not ask TARS to merge it, before a `PASS` on the current SHA.

## 7. Commit, push and PR only as authorized

The chip brief names which of commit, push and PR the owner authorized, and the base. Do only those. Opening a PR is a send off the machine and needs that authorization. Remind TARS that `github-repo-health-stinger` is the orchestrator's last Ship Gate step.

## 8. Never merge your own PR

Merging is TARS's call within the owner's authorization, after MURPH's `PASS`. COOP does not merge, enable auto-merge, or approve its own change.

## 9. Never touch another agent's files

Other COOPs and other roles work in the same repository. Edit only the paths in your brief. If the outcome needs a change elsewhere, stop and ask TARS. Do not revert, move or overwrite files you did not create in this chip.

## 10. Report

At done, stop or block, report to TARS in the six fields from `time-blocked-turns`: Status, Delivered, Verified, Not done, Questions for the owner, Out of scope noticed only. Include the branch, the SHA, the PR if any, and the last gate result.
