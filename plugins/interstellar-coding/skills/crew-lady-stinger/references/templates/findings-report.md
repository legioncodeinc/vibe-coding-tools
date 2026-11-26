# Findings report: {run-id}

Copy this file to `<run workspace>/findings-report.md`. Every finding must cite evidence LADY checked itself. Delete sections that do not apply; do not leave placeholders.

## Summary

| Field | Value |
|---|---|
| Question | {the question from the brief} |
| Answer | {one or two sentences, or "not established"} |
| Overall confidence | {HIGH, MEDIUM or LOW} |
| Kind | {investigation kind} |
| Scope covered | {paths, branch, PR, commit range} |
| Dispatch | {top-level subagents, inline, or list returned and not yet run, with the names} |
| Requested by, deadline | {sender, deadline, and whether it was met} |
| Report written (UTC) | {time} |

## Top findings

| Id | Severity | Finding | Evidence | Confidence |
|---|---|---|---|---|
| LADY-{run-id}-F1 | {Critical, High, Medium, Low, Info} | {one line} | {file:line, command, commit or log} | {HIGH, MEDIUM, LOW} |

## Findings in detail

### LADY-{run-id}-F1: {title}

- Severity: {level}
- What is wrong: {plain statement}
- Where: {file and line, commit SHA, or log location}
- Evidence: {the command and its relevant output, or the quoted lines; path under `evidence/`}
- Checked by LADY: {yes and how, or why it could not be checked}
- Confidence: {level}
- What would raise it: {the specific check, access or reproduction still missing}
- Alternatives ruled out: {each one and the evidence against it, or none considered}
- Suggested direction (a suggestion, not a fix): {one line, or none}

## Cause and timeline (root-cause and forensics runs)

| Time (UTC) | Event | Source |
|---|---|---|
| {time} | {commit, deploy, CI run, first failure} | {SHA, run URL, log line} |

- Cause: {statement}
- LADY's view was written before the builder's proposed fix was read: {yes, or no and why}
- Where LADY's view and the builder's differ: {lines, or they agree}

## Claims checked

| Claim | Made by | Checked how | Holds |
|---|---|---|---|
| {for example "tests pass on this branch"} | {author, agent, PR body} | {command and output} | {yes, no, could not check} |

## Coverage caps

- {What was not covered and why: skipped paths, tools that failed, code that was not allowed to run. Or none.}

## Not established

- {Parts of the question still open, and what is needed to close them. Or none.}

## Handoff

- Fixes: none made. Findings go to TARS, who decides what becomes a COOP chip.
- Documents for other roles: {PRDs or IRDs for KIPP, knowledge documents for OWEL, or none}
- Out of scope, noticed only: {one line each, or none}
