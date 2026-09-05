# auth-stinger

Paired Stinger for **auth-worker-bee**, the Hive's authentication implementation authority.

Read `SKILL.md` first. It is the master navigation layer: invocation modes, hard rules, severity rubric, cross-Bee handoffs, and pointers to the 12 guides, 6 templates, 2 scripts, 3 worked examples, and the research trail.

## Layout

- `SKILL.md`: master index. Read first.
- `guides/`: 12 numbered guides (`00-principles.md` through `11-common-failure-modes.md`).
- `templates/`: 7 fill-in artifacts (provider comparison, consent-screen checklist, scope justification, cookie config, RBAC policy table, audit report, run report).
- `scripts/`: 2 deterministic helpers (`validate-oauth-scopes.ts`, `cookie-attribute-checker.ts`).
- `examples/`: 3 worked end-to-end implementations (Clerk + Google OAuth, WorkOS SSO, Better Auth from scratch).
- `research/`: `research-plan.md` + dated YYYY-MM-DD topic notes. Every factual claim in the guides cites one of these.

## Output convention

Reports are written into the host repo's `library/` tree, never into this Stinger:

- **Standalone audits** → `library/requirements/reports/auth/<date>-<topic>.md`
- **Feature-tied** → `library/requirements/<lifecycle>/fea-<###>-<title>/reports/<date>-<type>-report.md`
- **Issue-tied** → `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-<type>-report.md`
- **Provider-selection ADRs** → `library/knowledge/private/architecture/ADR-<n>-auth-<topic>.md`

Forged 2026-04-25.
