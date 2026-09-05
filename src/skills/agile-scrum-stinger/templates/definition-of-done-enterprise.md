# Definition of Done: Enterprise / Mature Team Template

**Team context:** 6-10 person team, established CI/CD, compliance requirements, multiple environments
**Maturity target:** Level 4 (Evolving / Comprehensive)
**Review cadence:** Every Retrospective; version-controlled and treated as a living document

---

## Definition of Done

A story, task, or bug fix is **Done** when ALL of the following are true:

### Code quality
- [ ] Code is committed and pull request is merged to the integration branch
- [ ] Pull request reviewed by at least two Developers
- [ ] All PR review comments resolved (or explicitly deferred with a tracked issue)
- [ ] No linter errors, no type errors (strict mode)
- [ ] No new code duplication beyond team-defined threshold
- [ ] Code coverage threshold met: `___%` (team sets the threshold; recommend 80%+ for critical paths)

### Testing
- [ ] Unit tests written for all new business logic
- [ ] Integration tests written for all new API endpoints or service boundaries
- [ ] Key E2E paths covered for user-facing flows
- [ ] All automated tests pass in CI
- [ ] No flaky tests introduced (new tests are stable across 5 consecutive runs)
- [ ] Performance regression test passes (Lighthouse / k6 / team-defined benchmark)

### Security
- [ ] OWASP Top 10 self-review completed for any input handling, auth changes, or API additions
- [ ] No secrets or credentials committed to version control
- [ ] Dependency audit passed (no new Critical/High CVEs introduced)
- [ ] `security-worker-bee` invoked if the change touches auth, payments, or PII

### Accessibility
- [ ] No new WCAG 2.1 AA violations (automated scan via axe or Lighthouse)
- [ ] Keyboard navigation tested for any new interactive elements
- [ ] Color contrast verified for any new UI elements

### Deployment and operations
- [ ] Feature deployed to staging environment and verified functional
- [ ] Feature deployed to production (or behind feature flag if controlled rollout)
- [ ] Production smoke test passed
- [ ] Rollback procedure documented or tested
- [ ] Monitoring/alerting configured for new critical paths
- [ ] Feature flag state documented (on by default / off by default / who controls it)

### Documentation
- [ ] API documentation updated (if new or changed endpoint)
- [ ] Runbook updated (if operational procedure changed)
- [ ] User-facing documentation updated (if user workflow changed)
- [ ] ADR written (if architectural decision made)

### Acceptance and compliance
- [ ] All Acceptance Criteria met and verified with PO
- [ ] Analytics events firing correctly (if this feature requires tracking)
- [ ] Compliance review completed (GDPR, SOC 2, HIPAA as applicable)

---

## How to use this template

1. This is a maximum template: remove any item that does not apply to your context
2. The team owns the DoD; do not let management add items without team discussion
3. Version-control this file alongside your codebase
4. Review at each Retrospective and add/strengthen items as quality feedback demands
5. Never remove items without team consensus and a documented rationale

---

## Escalation items for `devops-worker-bee`

The following DoD items require `devops-worker-bee` for implementation:
- CI pipeline configuration for test automation
- Deployment pipeline for staging and production environments
- Feature flag system setup
- Monitoring and alerting configuration

---

*Template source: agile-scrum-stinger. Maturity tier: Enterprise. See `guides/04-definition-of-done.md` for the full context.*
