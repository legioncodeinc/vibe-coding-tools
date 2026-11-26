# Gate verdict template

One batched message per verdict, to COOP with a copy to TARS. Then one `LEDGER MURPH gate` line to OWEL.

## PASS

```text
PASS
To: COOP   Copy: TARS
Effort: <effort slug>
Candidate: <full SHA>   Base: <base ref> at <SHA>
Audited: <n files, +a/-d lines>, <PRD or brief path>
Security report: <path>   Result: no open finding of Medium or above
Quality report: <path>    Result: no open Critical or Warning
Non-blocking: <count and one-line list, or none>
Covers: this SHA only. Any new commit needs a new GATE.
Next: TARS loads github-repo-health-stinger before any commit or push. Commit, push, PR and merge still need the task's authorization.
```

```text
LEDGER MURPH gate | <effort> | PASS <change> at <short SHA>: Security and Quality clean | evidence: <security report path>; <quality report path> | by: MURPH
```

## FAIL

```text
FAIL
To: COOP   Copy: TARS
Effort: <effort slug>
Candidate: <full SHA>   Base: <base ref> at <SHA>
Audited: <n files, +a/-d lines>, <PRD or brief path>
Stage reached: <Security | Quality>   (Quality not run while Security has open findings)
Report: <path>
Blocking findings:
1. <severity> <file:line> <one-line finding> (see <skill guide or playbook reference>)
2. <...>
Fix and send a new GATE with the new SHA. MURPH re-runs from Security.
```

```text
LEDGER MURPH gate | <effort> | FAIL <change> at <short SHA>: <n> blocking findings at <stage> | evidence: <report path> | by: MURPH
```

## Shipped-state lines

```text
LEDGER MURPH gate | <effort> | <change> MERGED at <merge sha> on <branch> | evidence: <PR or SHA> | by: MURPH
LEDGER MURPH gate | <effort> | <change> DEPLOYED to <environment>, commit <sha> | evidence: <deployment id or URL> | by: MURPH
LEDGER MURPH gate | <effort> | <change> VERIFIED in <environment> at <sha> | evidence: <test run URL or output path> | by: MURPH
```

## Resume

```text
LEDGER MURPH resume | <effort> | MURPH resumed after compaction; <n> gates open, <m> changes not yet VERIFIED | evidence: none | by: MURPH
```

## Rules for filling it in

- The first line is the word `PASS` or `FAIL` and nothing else.
- Full SHA in the message, short SHA is fine in the ledger summary.
- Report paths are real paths that exist when the message is sent.
- Never write `PASS` with a blocking finding "to be fixed later".
- Never write a fix. Point to the finding and the skill's reference.
