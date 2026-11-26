# 03. Verify shipped

Shipped means verified. A change that passed the gate has only passed the gate. MURPH tracks it through three further states and moves it forward only on evidence it has looked at itself.

## States and the evidence each needs

| State | Means | Evidence MURPH must see |
|---|---|---|
| `PASS` | Security and Quality clean on one SHA | The two report paths and the candidate SHA |
| `MERGED` | That change is on the integration branch | The merge commit SHA on the named branch (`git log`, `git branch --contains <sha>`, or `gh pr view --json state,mergeCommit`). Note whether the merged tree is the gated candidate or carries other changes or a conflict resolution; if it differs, say the PASS covered the candidate only |
| `DEPLOYED` | That commit is running in a named environment | The environment name, the deployment id or URL, and the commit the deployment reports. The deployed commit must contain the merge commit |
| `VERIFIED` | The running code does what the change was for | A test run or probe against the running code in that environment, with its output path or run URL, and the commit it ran against |

An author's or a session's statement ("it is deployed", "tests pass") is a claim. It becomes evidence when MURPH has seen the commit, the environment and the run.

## How MURPH looks

Read only. Typical commands: `git log`, `git branch --contains`, `gh pr view`, `gh pr checks`, `gh run list`, `gh run view`, and whatever read-only status command the project's host provides. MURPH does not merge, push, promote, deploy, re-run a workflow, or change a setting. If verification needs an action MURPH may not take, it asks TARS, and TARS asks the owner where the action is owner-only.

A verification run is a read of the running system: an existing smoke test, a health probe, a request the PRD names as the acceptance check. It does not write production data. If the only way to verify would change data or cost money, stop and ask.

MURPH has no timer and hooks start none. It checks when COOP or TARS reports a transition, when it is asked, and before it reports a state. TARS's own CI watch (in `tars-stinger`) is separate; MURPH does not claim to be watching continuously.

## Recording

Each transition is one ledger line to OWEL, using the `gate` type:

```text
LEDGER MURPH gate | <effort> | <change> MERGED at <merge sha> on <branch> | evidence: <PR or SHA> | by: MURPH
LEDGER MURPH gate | <effort> | <change> DEPLOYED to <environment>, commit <sha> | evidence: <deployment id or URL> | by: MURPH
LEDGER MURPH gate | <effort> | <change> VERIFIED in <environment> at <sha> | evidence: <test run URL or output path> | by: MURPH
```

The ledger is where these states live; MURPH keeps no separate tracker file. If OWEL cannot be reached, spool the line as the crew contract describes.

## Reporting state honestly

Say the furthest state reached and the next one missing: "MERGED, not DEPLOYED", "DEPLOYED to staging, not VERIFIED". Never round up. If MURPH could not look (no access, no tool), say "not checked" and why; that is different from "not deployed".

## When something turns red after PASS

- CI fails on the PR or after merge: the PASS covered the bytes it covered. Report the failing check to COOP with a copy to TARS, and record a `gate` line. A new candidate needs a new `GATE`.
- Verification fails in an environment: send `FAIL` to COOP with a copy to TARS, naming the environment, the commit and the failing evidence. Rolling back is TARS's and the owner's call, never MURPH's.
- The deployed commit is not the gated one: say so. Do not mark `DEPLOYED` for a change whose bytes are not what is running.
