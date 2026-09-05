# 04. Definition of Done

The Definition of Done (DoD) is the formal commitment attached to the Increment. It is the single most important quality gate in Scrum. Without a DoD, "done" means whatever the loudest person says it means.

---

## DoD vs. Acceptance Criteria: the critical distinction

These are complementary but not interchangeable.

| | Definition of Done | Acceptance Criteria |
|---|---|---|
| **Scope** | Team-level; applies to ALL Backlog items | Item-level; specific to one story |
| **Purpose** | Gates "Done" for the Increment | Defines "meets requirements" for one feature |
| **Who creates it** | Scrum Team collaboratively | PO (with Dev input) |
| **When applied** | End of every Sprint | End of that story |
| **Example** | "Code reviewed, unit tests pass, deployed to staging" | "User can reset password via email link within 30 seconds" |

A story that passes its AC but does not meet the DoD is **NOT Done**.

---

## DoD maturity ladder

| Level | Description | Key indicators |
|---|---|---|
| Level 1: Non-existent | No written DoD; "done" is declared informally | Each Sprint Review reveals surprises; technical debt accumulates |
| Level 2: Basic | Written DoD but inconsistently applied; some items bypass it | DoD exists but Sprint Reviews show undone items regularly |
| Level 3: Consistent | DoD is applied to every item; Increment meets DoD before Sprint Review | Sprint Reviews show only Done items; DoD is not negotiated per story |
| Level 4: Evolving | DoD reviewed and strengthened each Retrospective; includes deployment | DoD includes CI gates, staging deployment, accessibility checks |

---

## DoD templates by maturity tier

### Startup / early-stage team (Level 2 target)

Minimal viable DoD that a 3-person team can sustainably maintain. See `templates/definition-of-done-startup.md`.

Core items:
- [ ] Code is committed to version control
- [ ] Code is reviewed by at least one other Developer
- [ ] All automated tests pass (unit + integration if they exist)
- [ ] Feature tested manually on at least one device/browser
- [ ] Acceptance Criteria met and verified with PO or proxy
- [ ] No known bugs introduced that aren't tracked in the backlog

### Standard / growth-stage team (Level 3 target)

Suitable for a team of 4-8 with CI/CD and regular deployments. Adds quality gates.

Additional items:
- [ ] All automated tests pass (unit + integration + key E2E paths)
- [ ] Code coverage threshold met (team decides threshold)
- [ ] No linter errors or type errors introduced
- [ ] Feature is deployed to staging environment
- [ ] Performance impact reviewed (no regressions in Lighthouse / Core Web Vitals)
- [ ] Accessibility impact reviewed (no new WCAG violations)

### Enterprise / mature team (Level 4 target)

See `templates/definition-of-done-enterprise.md`. Adds compliance, security, and deployment verification.

Additional items:
- [ ] Security review completed for auth, data handling, and API changes
- [ ] Feature flag status documented (on/off strategy)
- [ ] Documentation updated (API docs, runbooks, user docs as applicable)
- [ ] Deployment pipeline green (not just staging, production deploy verified)
- [ ] Rollback procedure tested or documented
- [ ] Analytics events verified (if feature requires tracking)

---

## The CI/deployment gate question

The research summary raised this question: should DoD templates include CI/deployment gates?

**Answer (resolved):**
- **Startup tier:** No CI/deployment gates: teams at this stage may not have CI/CD. Manual testing is sufficient.
- **Standard tier:** Yes: CI green and staging deployment are community consensus for growth-stage teams.
- **Enterprise tier:** Yes: full deployment verification, including rollback testing.

Note: the DoD references that "CI must pass"; `devops-worker-bee` owns the CI pipeline implementation.

---

## Writing and auditing a DoD

### How to write a DoD (facilitated exercise, 45 min)

1. **Gather the Scrum Team**: all roles participate
2. **Start with "what would embarrass us in production?"**: list failure modes
3. **Turn each failure into a gate**: "SQL injection vulnerability shipped" → "Security review for any input handling"
4. **Validate sustainability**: each item must be achievable within a Sprint for a normal story
5. **Write, post, and commit**: the DoD should be visible (physical board or pinned in Confluence/Notion)
6. **Add "review the DoD" to the Retrospective agenda**: it should strengthen over time

### DoD audit checklist
When auditing a team's DoD:
- [ ] Is it written down and visible to the whole team?
- [ ] Is it applied consistently (not negotiated per story)?
- [ ] Does it include quality gates beyond "code is written"?
- [ ] Does it ensure the Increment is releasable (not just "in staging")?
- [ ] Is it more rigorous than the minimum required by the organization?
- [ ] Was it strengthened in the last 3 Retrospectives? (stagnant DoD = stagnant quality)

---

## Common DoD failures

| Failure | Signal | Repair |
|---|---|---|
| No DoD | "Done means done" without definition | Write a Basic DoD in the next Retrospective as Action Item #1 |
| DoD is aspirational | Items on DoD never met in practice | Remove items the team can't meet; rebuild trust before adding them back |
| DoD applied to some items only | "That story is too small to go through the full process" | DoD applies to all items; if it's too heavy for small items, simplify the DoD |
| DoD never changes | Same DoD for 2 years; no new quality gates | Add "review the DoD" to Retrospective template |
| DoD includes subjective items | "Code is clean": no pass/fail criteria | Rewrite as measurable: "No functions > 30 lines (or documented exception)" |
