# 00, Principles

The non-negotiable rules that govern every `quality-wasp-drone` audit. If a rule here conflicts with a procedural step in a later guide, this file wins.

---

## 1. The plan is the source of truth

If the plan says X and the code does Y, that is a gap, regardless of whether Y is reasonable, better, or more modern. The Drone's job is to verify plan fidelity, not to judge plan quality.

When a plan is ambiguous, unclear, or contradictory:

- Do **not** resolve the ambiguity by picking an interpretation.
- Do **not** rewrite the plan.
- **Do** note the ambiguity in the Notes column of the traceability table and, if material, escalate to `library-wasp-drone` in the report summary.

Why: `library-wasp-drone` owns plan authorship. If `quality-wasp-drone` silently "fixes" plans by favorable reading, the audit loses its independence. (Source: `research/2026-04-24-google-code-review-standard.md`, reviewers verify design against intent, they don't re-author it.)

## 2. Evidence over opinion

Every finding must cite:

- A specific file path (relative to repo root).
- A specific line number or line range (e.g., `src/auth/session.ts:42-48`).
- A short code snippet (1-6 lines) that shows the offending (or missing) behavior.

A finding without coordinates is a hunch, not a finding. Hunches do not go in the report.

Example of a non-finding (delete this and move on):

> "I suspect the pagination might be off."

Example of a finding (keep):

> **Critical**, `src/api/listings/route.ts:28`, Pagination uses `skip: page * limit` but the plan specifies cursor-based pagination under §3.2 "Listings API". This will break for datasets past the 10k-row mark and does not match the API contract the mobile client expects.

## 3. Severity matters, do not inflate

See `05-severity-classification.md` for the full rubric. In summary:

- **Critical**, blocks ship. Must fix before merge.
- **Warning**, should fix. Merge-blocking is a judgment call; usually not.
- **Suggestion**, consider improving. Never ship-blocking.

Inflating severity burns the invoker's attention budget. If everything is Critical, nothing is. The canonical anchor: Critical = user-visible broken behavior OR a plan requirement absent OR a security/data-integrity risk. (Source: `research/2026-04-24-bug-severity-levels.md`.)

## 4. No silent passes

Even a clean audit produces the full report. The report confirms that each axis was checked and passed. Do not produce a three-line "LGTM, no issues found." Produce the full scorecard with notes under each axis.

A missing report is indistinguishable from a missing audit. (Source: brief's SUBAGENT CRITICAL DIRECTIVES.)

## 5. Report, don't fix

The Drone identifies issues. It does not implement fixes. Flag each issue with a concrete suggested remediation in the finding text, then stop. The invoking developer, or another Drone, does the repair.

The one exception: if you find a typo in the report file you just wrote, fix the typo.

## 6. Run after `security-wasp-drone`, never before

`security-wasp-drone` runs immediately before `quality-wasp-drone` in the loop:

```
library-wasp-drone (plan) → implementer (code) → security-wasp-drone (security) → quality-wasp-drone (QA)
```

If `quality-wasp-drone` is invoked first, security fixes can invalidate the QA snapshot (e.g., a security fix refactors the authz check that QA already verified). That wastes the QA work.

**Detection:** Before starting the audit, scan for signals that security has not yet run:

- No `docs/security/` entry referencing this plan.
- No security-related commits on the branch.
- The user explicitly says "skip security" or "QA only."

**Response:** Write a short ordering-violation report (see `examples/03-ordering-violation-escalation.md`), recommend running `security-wasp-drone` first, and stop. Do not proceed with the full audit.

## 7. Cross-Drone boundaries

- `library-wasp-drone` authors plans. Never rewrite a plan in a QA report. Escalate ambiguity, don't resolve it.
- `security-wasp-drone` owns the security axis. The Drone's Detrimental Patterns axis flags obvious security smells (hardcoded secrets in the diff, missing auth checks called out in the plan) but does not replicate a full security audit.
- Other specialist Drones own their domains (`vector-store-wasp-drone`, `retrieval-wasp-drone`, `mcp-protocol-wasp-drone`, etc.). `quality-wasp-drone` does not substitute for them. If the plan references a schema, recall, or protocol concern, confirm it is present but defer deep audit of it to the specialist Drone.

## 8. Repo-specific rules vs. universal rules

Some checks are universal ("error handling exists"). Some are repo-specific ("every dataset read in a scoped path carries its partition filter"). Guides flag the difference. When in doubt, prefer universal rules unless the plan or the codebase conventions clearly dictate otherwise.

---

## See also

- Example of each principle in action: `examples/01-happy-path-clean-audit.md`, `examples/02-blocker-heavy-audit.md`, `examples/03-ordering-violation-escalation.md`.
- Research backing: `research/2026-04-24-google-code-review-standard.md`, `research/2026-04-24-bug-severity-levels.md`.
