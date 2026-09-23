# Worked Example: RICE Scoring for 5 Feature Requests

This example scores five common SaaS feature requests end-to-end using the RICE framework. The product context is a B2B SaaS project management tool with 800 monthly active users (MAU), 120 paying customers, and a 4-person engineering team.

## Product context

- MAU: 800
- Paying customers: 120 (avg MRR $150/customer)
- Team: 2 engineers, 1 designer, 1 PM
- Planning period: Q3 (one quarter = ~3 months)
- Engineering capacity: 4 person-months per quarter

---

## Feature requests (de-duplicated and tagged)

| # | Request | Tag | Votes | Top voter MRR |
|---|---------|-----|-------|--------------|
| 1 | CSV export for task list | `exports` | 47 | $500/mo |
| 2 | Slack notifications for task assignment | `notifications` | 38 | $200/mo |
| 3 | Gantt chart view | `ui-ux` | 29 | $500/mo |
| 4 | Two-factor authentication (2FA) | `permissions` | 22 | $500/mo |
| 5 | Dark mode | `ui-ux` | 18 | $50/mo |

---

## Scoring

### 1. CSV export for task list

| Component | Value | Reasoning |
|-----------|-------|-----------|
| Reach | 320 | ~40% of active users (power users who export for reporting) |
| Impact | 2 | High — removes a common pain point; currently users screenshot or copy-paste |
| Confidence | 80% | 4 customer interviews confirmed it; support tickets corroborate |
| Effort | 0.5 | 1 engineer, 2 weeks; API already exists |

**RICE Score = (320 × 2 × 0.80) / 0.5 = 512 / 0.5 = 1,024**

---

### 2. Slack notifications for task assignment

| Component | Value | Reasoning |
|-----------|-------|-----------|
| Reach | 480 | ~60% of active users who work in Slack-heavy teams |
| Impact | 1 | Medium — reduces context-switching; users already check email notifications |
| Confidence | 80% | 47 upvotes with comments; clear demand signal |
| Effort | 1 | 1 engineer, 1 month; Slack API + webhook system needed |

**RICE Score = (480 × 1 × 0.80) / 1 = 384 / 1 = 384**

---

### 3. Gantt chart view

| Component | Value | Reasoning |
|-----------|-------|-----------|
| Reach | 200 | ~25% of users (project managers specifically) |
| Impact | 3 | Massive — would unlock a new segment (teams managing complex timelines); currently the #1 churn reason cited by churned PM users |
| Confidence | 50% | No user research yet; churn data qualitative; complex build |
| Effort | 3 | 2 engineers, 6 weeks; significant frontend work |

**RICE Score = (200 × 3 × 0.50) / 3 = 300 / 3 = 100**

---

### 4. Two-factor authentication (2FA)

| Component | Value | Reasoning |
|-----------|-------|-----------|
| Reach | 120 | All paying customers (enterprise requirement for two accounts) |
| Impact | 2 | High — unblocks enterprise deals; two customers stated they cannot proceed without it |
| Confidence | 100% | Two customers cited it as a hard blocker in sales calls |
| Effort | 1 | 1 engineer, 1 month; TOTP standard implementation |

**RICE Score = (120 × 2 × 1.00) / 1 = 240 / 1 = 240**

---

### 5. Dark mode

| Component | Value | Reasoning |
|-----------|-------|-----------|
| Reach | 160 | ~20% of active users (low-light workers, developer persona) |
| Impact | 0.5 | Low — preference feature; users can use OS dark mode as workaround |
| Confidence | 50% | Votes are clear; no interview data on actual impact on retention/conversion |
| Effort | 2 | 1 engineer + designer, 2 months; requires systematic token audit |

**RICE Score = (160 × 0.5 × 0.50) / 2 = 40 / 2 = 20**

---

## Results: Ranked priority

| Rank | Request | RICE Score | Fits in Q3? |
|------|---------|------------|------------|
| 1 | CSV export | **1,024** | Yes (0.5 person-months) |
| 2 | Slack notifications | **384** | Yes (1 person-month) |
| 3 | 2FA | **240** | Yes (1 person-month) |
| 4 | Gantt chart | **100** | Partially (3 person-months; investigate scope reduction) |
| 5 | Dark mode | **20** | No — deferred to Q4 |

**Q3 budget:** 4 person-months. CSV (0.5) + Slack (1) + 2FA (1) = 2.5 person-months. Remaining 1.5 could fund a scoped-down Gantt MVP (milestones only, no dependencies).

---

## Key lessons from this example

1. **Dark mode scores last** despite having 18 votes. Effort is high relative to impact (preference feature). RICE correctly deprioritizes it.
2. **2FA scores above Gantt** despite fewer votes — 100% confidence and commercial urgency (enterprise deals blocked) boost the score significantly.
3. **Gantt chart has high potential** but low confidence. The right action: run 3-5 user interviews to raise confidence from 50% to 80% before committing Q3 budget. A confident Gantt score would be (200 × 3 × 0.80) / 3 = 160 — which jumps it above Slack notifications.
