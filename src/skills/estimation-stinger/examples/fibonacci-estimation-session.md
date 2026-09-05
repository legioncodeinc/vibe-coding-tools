# Worked Example: Fibonacci Estimation Session

Demonstrates a Planning Poker session for a 5-person team sizing three backlog stories. Shows the diagnosis step (Category 2: planning-fallacy optimism) and the estimation process.

## Context

**Team:** 5 engineers (3 backend, 1 frontend, 1 full-stack), 2-week sprints, 6 months together.
**Problem reported:** "Our estimates keep being off. We say 5 points, it takes 3 sprints."
**Diagnosis result:** Category 2 (planning-fallacy optimism) + no reference story calibration.

## Step 1: Diagnosis

Ask: "When you estimated 5 points and it took 3 sprints, what was missing from the estimate?"

Team answers: "Testing took longer than expected. And we needed a database migration we didn't think about. And the code review had a lot of back-and-forth."

**Classification:** Planning fallacy / inside-view thinking. The estimates were based on the happy-path narrative (writing the logic), not the full definition of done (tests + migration + review + deployment).

**Fix:** Recalibrate reference stories AND establish an explicit Definition of Done that includes testing, review, and deployment.

## Step 2: Reference story calibration

"Let's pick two reference stories from recent work."

1-point reference: "Add a new field to the user settings page: label, input, and backend validation. No migration, no new endpoint." (Team agreement: this is our unit of 'a small but complete piece of work.')

5-point reference: "Build the CSV export for the reports page: pagination, background job, download endpoint, email notification, and basic test coverage." (Team agreement: this is medium complexity with a few moving parts.)

Write both on cards, paste in the Confluence refinement page, and keep them visible during all future estimation sessions.

## Step 3: Planning Poker session: three stories

### Story A: "Add 2FA toggle to account settings"

Product owner reads acceptance criteria. Team asks: Does this require a new authentication provider integration? (No, just enable/disable for existing TOTP.) Does it affect the mobile app? (Yes, needs API change.)

Cards revealed: 3, 3, 5, 3, 8.

The "8" outlier: backend engineer says "I'm thinking about the rate limiting we'd need on the verification endpoint, and the audit log entry: we don't have those patterns yet."

Discussion: The mobile API change is new scope that wasn't in the AC. The team revises AC, then re-votes: 5, 5, 5, 5, 5. Record: **5 points**.

### Story B: "Fix the date filter on the billing history page"

Cards revealed: 1, 1, 2, 1, 1.

Quick agreement. The "2" estimator says "I was thinking about timezone handling," but after discussion, the existing timezone utility covers it. Record: **1 point**.

### Story C: "Refactor the notification system to support channels (email, SMS, Slack)"

Cards revealed: 3, 5, 8, 13, 21.

Wide divergence: major discussion value.

- "3" estimator: "I'm only thinking about the email channel, which we already have."
- "21" estimator: "I'm thinking about building a channel abstraction, testing all three, updating the admin UI to configure them, and database changes."

After discussion: the AC was ambiguous: "support channels" was interpreted differently. Team decides to split into three stories: (1) channel abstraction + email (3 pts), (2) SMS integration (5 pts), (3) Slack integration (5 pts). Each now has clear scope.

## Outcome

- Story A: 5 points (revealed hidden mobile API scope)
- Story B: 1 point
- Story C: Split into 3 stories (13 points total, was a single story estimated at wildly different values)

## What this demonstrates

- The value of Planning Poker is the **conversation on outliers**, not the vote itself.
- Reference story calibration is required for consistent estimates.
- "Wide estimate" (like Story C's 3-to-21 spread) is a signal to split, not to average.
- Inside-view estimates (Story A at "3") can miss scope that becomes visible when multiple estimators explain their reasoning.

---

*Guides referenced: `guides/02-relative-sizing.md`, `guides/01-diagnosis.md`, `guides/05-planning-fallacy.md`*
