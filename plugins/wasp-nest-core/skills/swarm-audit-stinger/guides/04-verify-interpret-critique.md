# Guide 04: verify, interpret, critique

## Verification design

Two refuters per material finding, each with a distinct lens, and an Opus judge only when they split:

- Evidence refuter: re-derive the evidence from the repository; refute only with contrary evidence; return holds_with_corrections when details are off.
- Materiality refuter: assume the evidence; challenge severity, attribution (owner-gated versus team failure), disclosure status, and whether a settled decision already covers it.

Measured outcome: 24 held as written, 71 held with corrections, 3 refuted, 2 judge calls, across 98 verdicts [../references/research/raw/swarm-audit--evidence--fleet-run-statistics-2026-09-07.md]. Corrections dominate, so the corrected claim, severity, and disclosure flag flow into the evidence pack and the interpreters use that wording, never the original. Do not cap coverage; if the owner sets a cap, the remainder is returned and reported as not verified.

## Evidence labels (one taxonomy for every agent)

Facts: VERIFIED (checked on this machine, command or file and line cited), REPORTED (a document asserts it and nothing contradicts it), UNVERIFIABLE-HERE (needs Docker, live access, credentials, or the owner). Findings: CONFIRMED, CONFIRMED_WITH_CORRECTIONS, REFUTED, UNRESOLVED, with SINGLE_VOTE variants when one refuter died. Reports that blurred fact labels with finding status contradicted themselves and each other in the measured run [../references/research/raw/swarm-audit--evidence--critic-findings-2026-09-07.md]. Put the taxonomy in the shared brief, the report rules, and the critic prompt.

## Interpreters

One Opus batch interpreter per deliverable question, run in parallel, each given the whole evidence pack inline (about 100 to 250 KB of JSON is fine) plus the lens detail file paths for deeper reads. Each writes its file and returns a structured summary. A dead interpreter's file is kept and marked PRODUCED BUT UNREVIEWED; the critic reviews it in full and the next revision round rewrites it [../references/research/raw/swarm-audit--evidence--failure-modes-observed-2026-09-07.md].

## The critic

Mandatory, Opus at effort max, at least two rounds: round 1 found ten gaps, round 2 found eight different ones [../references/research/raw/swarm-audit--evidence--critic-findings-2026-09-07.md]. The critic prompt must check for absence as well as quality:

- Lenses that must exist for the question: branches and governance, product against the ask, deployment reality, code build and tests, data tier and migrations, backups of non-database state, security including webhook verification, dependency and third-party licenses, cost run-rate, access hygiene, documentation truth, the owner's required plan format.
- Every count re-derived from the evidence pack; every VERIFIED tag backed by a command or file and line; unverified-pool facts not tagged VERIFIED.
- Contradictions between reports and within a report.
- Settled decisions re-litigated.
- Style: no em dashes or en dashes.

Critic output becomes work: each gap spawns a gap investigator whose findings get an evidence refuter, then every report is revised with the addendum, then one reconciliation agent fixes cross-report contradictions and stale cross-criticism. Loop until the critic returns ready or the round budget ends; either way the unresolved critic items are printed in the deliverable.

## Judging what survives

A finding enters a report only with its verification status attached. Refuted findings appear only in an appendix so they cannot be re-raised. Findings never verified (cap, budget, or a dead reviewer) are listed under their own heading as investigator observations, with the resume command that would verify them.
