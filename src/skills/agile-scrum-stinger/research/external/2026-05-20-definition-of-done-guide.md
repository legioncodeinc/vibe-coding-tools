---
source_url: https://www.atlassian.com/agile/project-management/definition-of-done
retrieved_on: 2026-05-20
source_type: official-docs
authority: high
relevance: 5
topic: definition-of-done
stinger: agile-scrum-stinger
fetched: 2026-05-20
url: https://www.atlassian.com/agile/project-management/definition-of-done
---

# Definition of Done (DoD): Atlassian Guide 2026

Source: Atlassian, updated February 2026

## Summary

Authoritative practitioner reference from Atlassian (makers of Jira) on Definition of Done: what it is, how to create it, and how to maintain it. Includes the important DoD vs. Acceptance Criteria distinction. Published February 2026.

## Core Definition

"The definition of done (DoD) is a shared set of criteria that determines when a product increment is complete and ready for release."

"A clear DoD ensures quality, minimizes rework, and aligns team members on expectations for completion."

## DoD vs. Acceptance Criteria (Critical Distinction)

This is the most common confusion agile teams have:

| | Definition of Done | Acceptance Criteria |
|---|---|---|
| Scope | Applies to ALL work universally | Specific to each user story |
| Created by | Whole Scrum Team collaboratively | Product Owner / team for each PBI |
| Purpose | Quality standards | Functional requirements |
| Example | "All code reviewed by 2+ reviewers" | "User can log in with email and password" |

"QUALITY standards (e.g., 'code reviewed,' 'tests >80% coverage'), while Acceptance Criteria defines FUNCTIONAL requirements (e.g., 'user can log in with email'). Both must be met for work to be truly Done."

A story is complete when it meets BOTH its acceptance criteria AND the team's DoD.

## How to Create a DoD

1. **Collaborate**: Engage the entire Scrum Team including developers, testers, product owners, and relevant stakeholders
2. **Define Criteria**: Cover functionality, quality, performance, documentation, and compliance
3. **Keep it SMART**: Specific, Measurable, Attainable, Relevant, Time-bound
4. **Keep it Visible**: Print it out, post it on the wall, include it in the sprint board wiki
5. **Review and Update**: Update in Sprint Reviews when bugs emerge; review quarterly

## DoD as a Living Document

> "The definition of done should be a living document, meaning as you learn new things about your work your team should update their DoD. Consider reviewing the DoD every quarter to ensure it includes all items you think are necessary."

## Common DoD Checklist Structures

From GitScrum DoD best practices (2026):

### Startup/Basic DoD
- Code written and self-reviewed
- Code follows team style guide
- No known tech debt introduced
- Unit tests written and passing
- Integration tests passing
- Manual testing completed
- Code review completed (at least 1 reviewer)
- Review comments addressed
- Merged to main branch
- CI/CD pipeline passing
- Deployed to staging
- Verified working in staging
- Acceptance criteria met
- PO reviewed and approved

### Enterprise/Comprehensive DoD
Additional items beyond basic:
- Unit tests: >80% coverage on new code
- E2E tests for user flows (if UI)
- Performance tested (if applicable)
- Security scan passed
- Accessibility tested (WCAG 2.1 AA)
- 2+ code reviews approved
- Architecture approval (if major change)
- Security review (if data handling)
- API documentation (if API change)
- User documentation (if UI change)
- Runbook updated (if ops impact)
- ADR created (if architectural decision)
- Monitoring alerts configured
- Demo recorded (if major feature)
- Release notes drafted

## DoD Anti-Patterns

From GitScrum DoD best practices (2026):
- DoD exists but nobody follows it
- Too many items (unrealistic checklist)
- Not reviewed or updated
- Different teams, different DoDs (no standard across squads)
- DoD violated "because deadline"
- DoD is just testing (ignores code quality, documentation, deployment)
- No one knows where DoD is documented

## Key Quotations

> "Without a shared understanding of 'done,' teams ship inconsistent work, accumulate technical debt, and waste time in endless back-and-forth over whether a story is truly finished."

> "The DoD isn't a static document. Every bug or error found during a sprint is a quality issue that an unclear definition of done may have caused."

> "Be practical and realistic: The DoD should be achievable within the time frame and with available resources."

## DoD Maturity Stages (from TeachingAgile 2026)

- **Stage 1 - Basic DoD (new teams):** Code reviewed, tests written, merged to main
- **Stage 2 - Intermediate:** + integration tests, performance considerations
- **Stage 3 - Advanced (high-performing teams):** + security scans, accessibility, deployment verification, monitoring

Evolution strategy: Add one item per retrospective. Never add items you can't currently achieve; set aspirational items separately with a gap-closing plan.

## Annotations for stinger-forge

- Primary source for `guides/04-definition-of-done.md` and both DoD templates
- The DoD vs. Acceptance Criteria distinction MUST be explained in the guide: it's the most common confusion
- The three maturity stages map perfectly to the startup/growth/enterprise template tiering
- "Living document" principle = review DoD every retrospective and quarterly
- Atlassian is authoritative because they own Jira, the primary tool where DoD is enforced
