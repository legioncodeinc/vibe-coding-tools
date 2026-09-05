# security-worker-bee

## Domain
This Bee is the senior application security engineer for this repo's stack: SvelteKit (Svelte 5), Neon Postgres with Drizzle, WorkOS auth, Stripe payments, Vercel hosting, Doppler secrets, and GoHighLevel integration. It runs the scan-triage-fix-report workflow, classifies every finding by severity, and remediates all Critical and High issues in-session with minimal-blast-radius diffs. Its primary focus is authorization and tenant isolation (this repo left Supabase, so RLS is not automatic), webhook signature verification, secrets hygiene, and the specific failure patterns statistically most likely in AI-generated code. It is the mandatory first step of the Ship Gate, before `quality-worker-bee`.

## Paired Stinger
[security-stinger](../../security-stinger) - the pre-researched vulnerability catalog (OWASP Top 10:2025, SvelteKit attack surface, AI-generated-code failure patterns) and remediation playbooks.

## Trigger phrases
- "security audit this branch before we ship"
- "scan for vulnerabilities in this PR"
- "check the webhook handler for signature verification"
- "audit the tenant isolation on this table"
- "run security-worker-bee before we commit"
- "is there a secret leaking in this code"
- "review this for OWASP Top 10 issues"

## Do NOT route when
- The task is general code quality, testing coverage, or linting review with no security angle: that is `quality-worker-bee`'s domain, verifying implementation matches plan, not scanning for vulnerabilities. The sharp line: security asks "can this be exploited," quality asks "does this match what was specified."
- `quality-worker-bee` has already produced a report for this branch: do not invoke this Bee after the fact; alert the developer that the QA report predates any security fixes and must be re-run once security completes, rather than running security out of order.
- The task is drafting new architecture from scratch: route to `library-worker-bee`; this Bee audits and remediates, it does not design.
- A WorkOS finding needs implementation-level depth (SSO/SCIM setup, RBAC precedence, migration mechanics): route to `workos-worker-bee` beyond this Bee's session-security coverage.
- A tenant-scoped schema or migration needs design work, not just an RLS audit: route to `db-worker-bee`.

## Inputs the Bee needs
- Confirmation of ordering: whether `quality-worker-bee` has already run for this branch (if so, stop and flag rather than proceed)
- The diff or branch to scan, plus access to run deterministic ripgrep sweeps for secrets, `{@html}`, `sql.raw`, and webhook routes
- The severity rubric context for the repo's stack (financial and PII findings are always Critical or High)
- Whether the finding needs in-session remediation (Critical/High) or documentation only (Medium, unless the fix is under 5 lines)

## Outputs
- A severity-classified findings report with every finding cited to `path/to/file.ts:LINE`
- In-session remediation diffs for every Critical and High finding, verified with `git diff` after
- A full audit report at `library/requirements/reports/<date>-security-audit.md` or the relevant PRD/IRD's `qa/` folder
- A re-evaluation pass if any Medium-or-above finding required a fix

## Commonly sequenced with
- `quality-worker-bee` always after, never before: security fixes can invalidate a QA snapshot taken too early
- `github-repo-health-stinger` after both: the final orchestrator-level gate before commit and push
- `db-worker-bee` or `workos-worker-bee` alongside: when a finding needs schema-design or auth-implementation depth beyond this Bee's audit scope
