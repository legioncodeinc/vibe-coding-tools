# Definition of Done: Startup / Early-Stage Template

**Team context:** 2-5 person team, early product, may not yet have CI/CD pipeline
**Maturity target:** Level 2 (Basic / Consistent)
**Review cadence:** Quarterly or after each Retrospective that surfaces quality issues

---

## Definition of Done

A story or task is **Done** when ALL of the following are true:

### Code quality
- [ ] Code is committed to version control (no local-only changes)
- [ ] Code is reviewed by at least one other Developer (or, for solo founders: self-review against a checklist)
- [ ] No uncommitted debugging code, console.log statements, or TODO comments that are not tracked issues

### Testing
- [ ] Feature has been tested manually by the Developer on at least one device/browser
- [ ] All existing automated tests pass (if the project has tests)
- [ ] No new bugs introduced that are not tracked in the backlog

### Acceptance Criteria
- [ ] All Acceptance Criteria for this item are met
- [ ] PO or a designated reviewer has confirmed the item meets the AC

### Deployment
- [ ] Code is merged to the integration branch (main, develop, or equivalent)
- [ ] No merge conflicts left unresolved

---

## Guidance notes

**On automated tests:** If the team does not yet have automated tests, the DoD may temporarily omit the test-pass requirement, but this should be treated as technical debt. Add "establish test baseline" as a Backlog item.

**On solo founders:** Peer code review is not always feasible. Substitute with a self-review checklist and a time buffer (review your own code the next morning, not immediately after writing it).

**On deployment:** Startup teams often deploy to production frequently. If so, add "deployed to production and verified" to this section.

---

## How to use this template

1. Copy this file to your team's Confluence, Notion, or shared wiki
2. Discuss each item in a team session: remove anything the team cannot consistently meet
3. Post the DoD visibly (physical board, Slack pin, or sprint board header)
4. Review and strengthen at every third Retrospective

---

*Template source: agile-scrum-stinger. Maturity tier: Startup. See `guides/04-definition-of-done.md` for the full context.*
