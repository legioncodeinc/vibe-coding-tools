# 01. Audit procedure

How to run a security-stinger pass end to end, and what it must produce. This is the procedural spine; the other guides supply the depth for each surface.

## Where this sits in the Ship Gate

security-stinger is invoked FIRST, before `quality-stinger`, before `github-repo-health-stinger`, and before anything is committed or pushed. This is non-negotiable ordering: `quality-stinger` verifies an implementation against its plan, and that verification is meaningless if the code it read is about to mutate under a security remediation. The full Ship Gate contract is reproduced verbatim at the end of `SKILL.md` - read it there, it is not paraphrased here.

Sequence for a single Ship Gate pass:

1. **security-stinger runs first.** Full pass per this guide. Produces a report per [10-report-format.md](10-report-format.md).
2. **All Medium-or-above findings are resolved**, then security-stinger runs again as a full re-evaluation of the updated code - not a spot check of only the changed lines.
3. Only once the re-evaluation is clean (or all remaining findings are explicitly accepted and documented as Low) does the orchestrating agent proceed to `quality-stinger`, and after that `github-repo-health-stinger`.
4. The user reviews the report(s) and agent summary and approves commit/push. This skill does not commit or push code itself.

## Phase 1 - scope the pass

- Identify the branch/diff under audit. A full first-time audit of a codebase and an audit of a single feature branch's diff use the same checklists, but a diff-scoped audit should still open every file the diff touches PLUS its immediate authorization/tenancy neighbors (the `hooks.server.ts` that gates it, the schema file backing any new table) - a diff can introduce a vulnerability by omission (a new `+server.ts` with no auth check) that a line-diff view alone will not surface.
- Confirm the stack in scope matches this skill's grounding: SvelteKit (Svelte 5), Neon Postgres + Drizzle, WorkOS, Stripe, Vercel, Doppler, GoHighLevel. If the branch introduces a materially different surface (a new datastore, a new payment provider, a new third-party webhook source) not covered by [references/research/distilled-security.md](../references/research/distilled-security.md), flag REDUCED COVERAGE explicitly in the report rather than silently extrapolating facts that were never researched.

## Phase 2 - deterministic sweep

Run the grep/ripgrep sweeps in [references/grep-patterns.md](../references/grep-patterns.md) first. This surfaces leads cheaply before spending reasoning cycles reading every file by hand. Every hit is a lead, not an automatic finding - each one gets confirmed against the surrounding code before it goes in the report.

## Phase 3 - surface-by-surface checklist pass

Work through [references/audit-checklist.md](../references/audit-checklist.md) top to bottom, consulting the matching guide for depth on each surface as needed:

- [02-sveltekit-attack-surface.md](02-sveltekit-attack-surface.md)
- [03-authorization-and-tenancy.md](03-authorization-and-tenancy.md)
- [04-secrets-and-env.md](04-secrets-and-env.md)
- [05-webhooks-and-third-party-intake.md](05-webhooks-and-third-party-intake.md)
- [06-dependencies-and-supply-chain.md](06-dependencies-and-supply-chain.md)
- [07-headers-and-transport.md](07-headers-and-transport.md)
- [08-ai-generated-code-patterns.md](08-ai-generated-code-patterns.md)

PII/logging hygiene (Sentry, PostHog) is checked as part of this pass too - see [references/audit-checklist.md](../references/audit-checklist.md)'s dedicated section.

## Phase 4 - severity triage

Classify every finding BEFORE remediating anything, using [references/severity-rubric.md](../references/severity-rubric.md). Every finding needs a file:line citation and a quoted vulnerable pattern - a finding without coordinates is not auditable and cannot be handed off for a fix.

## Phase 5 - remediation

Apply the canonical fixes in [09-remediation-playbooks.md](09-remediation-playbooks.md) to Critical and High findings in-session, using the secure-by-default snippets in [references/secure-by-default-snippets.md](../references/secure-by-default-snippets.md) as starting points, adapted to the actual code. Minimal blast radius per fix - change only what closes the vulnerability, no opportunistic refactoring. Medium findings are documented only unless the fix is under 5 lines. After all fixes, run `git diff` and confirm the diff contains only security-relevant changes.

## Phase 6 - report and re-evaluation

Write the report per [10-report-format.md](10-report-format.md) to the correct `library/` destination. If any Medium-or-above finding required a fix, run this entire procedure again against the updated code as a full re-evaluation before declaring the pass complete - not a partial recheck of only the touched lines.

## Non-negotiable operating rules

1. Never silent-pass. A clean audit still produces the full report with "None detected" in every checked-and-clear section.
2. Financial (Stripe-adjacent) and PII findings are never downgraded below High to save time.
3. Evidence over opinion - every finding cites `path/to/file.ts:LINE` and the exact vulnerable pattern.
4. Degraded fidelity, not silence, outside this skill's researched stack - flag REDUCED COVERAGE and say so explicitly rather than inventing facts.
5. Never state a security fact that isn't grounded in [references/research/raw/](../references/research/raw/) - if it isn't archived, it isn't a fact yet for this skill.
