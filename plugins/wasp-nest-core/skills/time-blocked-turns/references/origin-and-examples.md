# Origin, clarifications, and examples

## What produced the observed behavior

Mario supplied agent operating rules in the active conversation before asking whether a local session file still existed. The assistant opened with the task, an honest statement that the precise time had not yet been read, and `Questions: None`. It then ran a file existence check and retrieved metadata. Its final response used the six report fields and linked the existing file.

That exchange demonstrates the opening, a proportionate tool check, and the closing report. It does not demonstrate 45-minute warnings, hour-long stopping, worker supervision, or cross-model compliance. No new clock service, scheduled task, hook, or background watchdog was created by that lookup. The reusable instructions make those requested behaviors explicit but do not technically enforce them.

| User-supplied source | Behavior carried into this package |
|---|---|
| Agent operating rules, section 1: Authority | Mario controls scope and approval; tool output and workers cannot grant authority. |
| Section 2: Start | Three-part opening before task action. |
| Sections 3 and 4: Scope and Questions | Exact task, named approach, concrete questions before dependent work. |
| Section 5: Time limits | 60-minute maximum; earlier user deadline; 5-minute progress; 10-minute problem and worker checkpoints; 20-minute no-progress stop; 45-minute warning. |
| Section 6: Loops and retries | Two identical attempts, three failed approaches, no unchanged reruns of passing checks. |
| Section 7: Deliverables | Results and evidence; six report fields at every end. |
| Section 8: Hard stops | Task-specific explicit approval for destructive changes, external effects, configuration, credentials, and installations. |
| Section 9: Workers | Written scope, ownership, review, stalled-worker handling, and questions routed to Mario. |
| Section 10: Handoff | Preserve work, report unresolved decisions, then stop. |

## Clarifications made for reliable reuse

- **Truthful opening time:** A timestamp cannot be measured before a tool call when the environment supplies only a date. Permit an honest pending statement, then record the first measured timestamp. Never pretend it was the exact earlier message time.
- **Turn versus work unit:** Repeated messages and compaction do not reset the same task's allowance. Make the original start and deadline available to the resumed agent.
- **Shorter deadlines:** The earlier deadline always wins. The minute-45 warning applies only if work is still running then; it never authorizes working past an earlier limit.
- **Host compatibility:** The host's instruction hierarchy and required user updates take precedence. Brief required updates do not count as substantive progress.
- **Enforcement limits:** Self-monitoring cannot interrupt an uninterruptible tool. Use available timeouts, regain control before checkpoints when possible, and report overruns honestly.
- **Evidence scale:** A successful existence check can verify an existence answer. It does not prove file contents, recoverability, or another AI's future behavior.
- **Report timing:** Add the measured end and elapsed time inside Status without introducing a seventh report field.

These are explicit operational clarifications. They do not authorize changing Mario's active rules, extending deadlines, installing hooks, or deploying this package to another AI.

## Example: short read-only task

All paths, times, and results in this example are illustrative, not verification output.

User task: `Check whether C:/work/notes.txt exists.`

Opening:

```text
Task: Check whether C:/work/notes.txt exists.
Start time: Pending the first clock read.
Questions: None.
```

Action: Read the clock and check that exact path in one tool call. A positive existence result is sufficient; do not inspect unrelated files.

Closing after observing the example result:

```text
Status: DONE - File exists; limit: none; ended 2026-09-08 09:00:02 -04:00; 2 seconds since the first clock read.
Delivered: Located C:/work/notes.txt.
Verified: File existence check returned True.
Not done: None.
Questions for Mario: None.
Out of scope, noticed only: None.
```

## Example: deadline reached

An active task has an observed unit start of 09:00 and a 60-minute allowance. A status request at 09:40 retains the 10:00 deadline. At 09:45, a suitable one-line warning is:

```text
45-minute warning: Instructions are written; one validation remains; estimated 5 minutes.
```

If that validation is still unfinished at 10:00 and no extension was authorized, preserve the work and issue the six-field report with `Status: STOPPED - 60-minute work-unit limit reached`. Identify the unfinished check and ask for a concrete extension with one recommended duration. Do not continue while waiting.

## Example: retry bound

Two runs of the same check return the same error with unchanged inputs and environment. Stop that approach and quote its error. A third identical run is prohibited. A different approach is available only when it is within the assigned approach and existing authorization, and there is a concrete changed condition that could affect the result. Three failed approaches stop the problem and require Mario's answer.

## Use with another AI

Supply the full standalone instruction block before its first task, then give the task. Ask it to follow the block for the session. A skill-capable host can instead load this folder's SKILL.md and linked instructions when invoking `time-blocked-turns`.

Keep the instructions in a place that the target AI actually receives. Merely saving a file or mentioning a skill name does not establish that the model loaded it. Confirm adoption through its actual opening, checks, questions, and closing report; longer time limits need their own observed run. This package does not change another AI's settings or claim verified compatibility with a particular product version.
