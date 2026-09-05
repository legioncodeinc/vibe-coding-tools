---
source_url: https://scanlyapp.com/blog/definition-of-done-improving-quality
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: definition-of-done
stinger: agile-scrum-stinger
---

# Definition of Done Templates by Team Maturity

## Summary
A practitioner guide providing DoD templates at three maturity levels (startup, standard, enterprise) with concrete checklists. Includes the DoD maturity ladder (Level 1-4) and the critical DoD vs. Acceptance Criteria distinction. Highly actionable: templates can be used directly in the stinger's template folder.

## Key quotations / statistics
- "The Definition of Done (DoD) is a checklist of criteria that a user story, feature, or increment must meet before it's considered complete. It's a quality gate — a contract between the team and stakeholders about what 'done' means."
- "To properly understand what DoD is in Scrum, it's important to recognize that it is team-specific, not one-size-fits-all." (nevolearn.com)
- "Acceptance Criteria: Specific to a user story; defines when the story meets business requirements. Definition of Done: Universal to all stories or backlog items; defines general quality and completion standards." (nevolearn.com)

## DoD Template: Startup (Early Stage)
```markdown
## Definition of Done
- [ ] Code written and pushed to main branch
- [ ] Manually tested in local environment
- [ ] Demoed to founder/product lead
- [ ] Deployed to production
- [ ] No obvious bugs
```

## DoD Template: Standard Team (Growth Stage)
```markdown
## Definition of Done
- [ ] Code follows style guide (linter passes)
- [ ] Code reviewed by at least one team member
- [ ] Unit tests written (>80% coverage on new code)
- [ ] All tests pass in CI (unit, integration, E2E)
- [ ] Documentation updated
- [ ] Deployed to staging and smoke tested
- [ ] Acceptance criteria met and demoed to Product Owner
```

## DoD Template: Enterprise (Mature Product)
**Code Quality:**
- Code adheres to style guide (linter passes)
- Code reviewed by 2 engineers (1 senior)
- Unit test coverage >85%
- Integration tests cover main scenarios

**Security & Compliance:**
- SAST/DAST scans pass (no high/critical findings)
- Dependencies updated to non-vulnerable versions
- PII handling reviewed for GDPR/CCPA compliance
- Security team sign-off for auth/payment changes

**Documentation:**
- API documentation updated (OpenAPI)
- Changelog entry added
- Architecture Decision Record created if applicable

**Testing & Quality:**
- All acceptance criteria met
- Cross-browser tested (latest 2 versions)
- Accessibility audit (axe DevTools, no violations)
- Performance tested (Lighthouse score >90)

**Deployment & Monitoring:**
- Feature flag configured if applicable
- CI/CD pipeline green
- Deployed to staging
- Monitoring dashboards updated
- Rollback plan documented

**Product Sign-Off:**
- Product Owner reviewed and accepted
- UX Designer reviewed for UI changes

## DoD Maturity Ladder
| Level | Name | Key Items |
|---|---|---|
| 1 | Basic | Code compiles, tests pass, code reviewed, merged |
| 2 | Standard | L1 + coverage requirements, documentation, staging deployment, verification |
| 3 | Mature | L2 + security scanning, performance testing, accessibility, monitoring |
| 4 | Excellent | L3 + feature flags, A/B testing ready, rollback plan, analytics configured |

## DoD Evolution by Sprint Stage
| Sprint Stage | Typical DoD Items |
|---|---|
| 0-2 | Code written, peer-reviewed, tested, documented |
| 3-5 | Code merged, all tests pass, deployed to staging, acceptance verified |
| 6+ | CI/CD success, test coverage ≥80%, security scan, performance tested, docs published |

## Annotations for stinger-forge
- The three templates (startup, standard, enterprise) map directly to `templates/definition-of-done-startup.md` and `templates/definition-of-done-enterprise.md` in the stinger folder.
- The Sprint Stage evolution table is perfect for `guides/04-definition-of-done.md`: it shows DoDs are dynamic, not static.
- The DoD maturity ladder should be the opening framework of the DoD guide (what level is your team at?).
- gitscrum.com/en/best-practices/creating-effective-definition-of-done provides a detailed enterprise DoD with the same structure, confirming community consensus.
