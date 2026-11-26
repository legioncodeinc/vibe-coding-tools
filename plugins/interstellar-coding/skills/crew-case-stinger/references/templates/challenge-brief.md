# Challenge brief: what an ASK CASE contains

Send one batched message. CASE answers one verdict line per numbered question, to you, with a copy to TARS.

```text
ASK CASE
From: <ROLE>
Effort: <effort slug>
Actual ask: <what the owner or the brief asked for, in their words, with the source path or message>

Questions:
1. <one decision per question>
2. <...>

My lean:
1. <what you would do and why, one or two sentences>
2. <...>

Evidence:
- <path to the plan, PRD, brief or contract, with revision>
- <path to code, diff or candidate SHA>
- <path to reports: Security, Quality, investigation findings>

Stakes: <small | large or hard to reverse>, because <one phrase>
Needed by: <time, or "no deadline">
```

## Notes for the sender

- Give the actual ask, not your summary of it. CASE measures proportion against the ask.
- Give paths, not excerpts. CASE opens the files.
- State your lean honestly. CASE reads it last, on purpose.
- One decision per question. A question with "and" in it is usually two.
- Do not ask CASE to decide, approve an owner gate, edit, or spawn. It will answer `ASK OWNER` or name the role that owns the action.
- If you already have a ruling from TARS or the owner on the same point, say so and cite it.
