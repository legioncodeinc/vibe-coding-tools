# PRD handoff template

One message to TARS per finished PRD, IRD or card. Keep it to the fields below. TARS routes it past CASE and to COOP; KIPP does not brief COOP directly.

```text
PRD handoff | <effort> | prd-<###>-<slug>
Document: <path to the index file>
Intake note: <path>
Ask (verbatim, <UTC time>): "<the owner's words>"
Outcome: <one sentence>
Number: prd-<###>, <verified | unverified: missing check>
Scope: <what is in, in one line> | Not in scope: <what is out>
Acceptance: <count> criteria, see <section link>
Overlaps: <paths or none>
Contracts needed: <interface names or none>
Knowledge or ADR needs sent to OWEL: <topics or none>
Owner gates open: <questions still waiting, or none>
Owner gates answered: <gate: verbatim answer, time>
Suggested phases: <one line per phase, or "single change">
Files changed (uncommitted unless stated): <paths>
Commit, push or PR: <not authorized for this task | authorized by owner at <time>: "<words>">
Ledger: <L-###### ids, or "spooled">
```

Rules:

- Replace `PRD handoff` with `IRD handoff` or `Card handoff` as fits.
- Leave no field blank. Write "none" or "unverified" and say why.
- Quote the owner exactly. A paraphrase is not a quote.
- Do not attach instructions for a specific builder. The PRD is the instruction.
