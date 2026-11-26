# Investigation brief: {run-id}

Copy this file to `<run workspace>/investigation-brief.md` when a run opens. Fill it as the run proceeds. It is the state LADY restores after a compaction.

## Request

| Field | Value |
|---|---|
| Run id | {YYYY-MM-DD-short-slug} |
| Effort | {effort slug} |
| Requested by | {owner, TARS or MOON, with session or agent id} |
| Received (UTC) | {time} |
| Deadline | {UTC time, or the duration given} |
| Kind | {full code audit, root-cause investigation, incident or regression forensics, pre-merge due diligence} |
| Question | {the one question this run answers} |
| Scope | {paths, branch, PR, commit range} |
| Out of scope | {what the sender excluded, or none} |
| Evidence handed over | {paths, or none} |
| What counts as an answer | {one or two lines} |

## Run setup

| Field | Value |
|---|---|
| Run workspace | {absolute path} |
| Audited repository (read only) | {absolute path} |
| Mode | {top-level session, or subagent} |
| Audit tier, if an audit | {foundation, vibe, basic, full, mario, or not an audit} |
| May the repository's own code run | {no by default; yes only with the owner's recorded consent and where it was recorded} |

## LADY's view (write before reading any proposed fix)

- Written at (UTC): {time}
- Suspected cause or answer: {one paragraph}
- Evidence for it: {file:line, command output, commit, log}
- What would disprove it: {one line}
- Proposed fix seen before this was written: {no, or yes and how}

## Comparison with the builder's view (root-cause work only)

- Builder's stated cause and fix: {summary, with where it was read}
- Agrees with LADY's view: {yes, partly, no}
- Differences and which evidence decides them: {lines}

## Dispatch

Dispatch mode: {top-level subagents, inline, list returned and not yet run}

| Drone or sub-skill | Started (UTC) | Output folder | Verified with check_workspace.py | Result |
|---|---|---|---|---|
| {name} | {time} | {path} | {yes, no, not applicable} | {returned, re-dispatched, failed, pending} |

## Attempts on this question

| # | Approach | What changed from the last one | Result |
|---|---|---|---|
| 1 | {approach} | {first attempt} | {outcome, with the exact relevant error} |

## Coverage caps

- {Every skipped path, lifted tool limit or failed tool, or none}

## Sent

| Message | To | Time (UTC) | Ledger id |
|---|---|---|---|
| {FINDINGS, LEDGER LADY finding, LEDGER LADY resume} | {TARS or OWEL} | {time} | {L-n when recorded} |
