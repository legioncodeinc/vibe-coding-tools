# Guide 05: Onboarding Checklist UI and Activation

Use this guide when building or auditing an onboarding checklist component with progress gamification.

Source: `research/external/2026-05-20-checklist-activation-gamification.md`, `research/external/2026-05-20-tour-analytics-effectiveness.md`.

---

## The activation-vs-completion distinction (the most important concept)

**Activation rate** = % of new users who complete the first meaningful action that correlates with long-term retention (e.g., creating a project, inviting a teammate, connecting an integration).

**Completion rate** = % of users who finish all checklist items.

These are NOT the same metric. A checklist that users complete in one session without becoming retained users has high completion but zero activation value. Build and measure for activation.

*Source: Tandem (May 2026): "Focus on activation rate, time-to-first-value, and CAC payback — not tour completion %."*

---

## The six-stage SaaS onboarding framework (Jimo, 2026)

Use this framework to decide what goes in the checklist:

1. **Sign-up / Account creation**: already done by the time the checklist appears.
2. **Account setup**: profile, company details, initial preferences. Low-friction; quick wins.
3. **Core value action**: the single most predictive activation milestone (varies by product). This is the checklist's most important item.
4. **Feature exploration**: guided exposure to secondary features that increase stickiness.
5. **Integration / collaboration**: connecting external tools or inviting teammates. High retention signal.
6. **Habit formation**: encouraging the first repeat use. Can be email-triggered rather than in-app.

**Rule:** Design the checklist around stages 2-5. Stage 6 is better handled by lifecycle email.

---

## The "3-5 items max" rule

Checklists with more than 5 items have significantly lower completion. The Chameleon 2025 benchmark confirms: 3-step tours convert at 72%; 7-step tours convert at 16%.

Apply the same decay curve to checklists. If you need 8 items, split into two checklists ("Get started" and "Level up") that unlock sequentially.

---

## Three gamification mechanics

### 1. Endowed progress

Show users they are already partway through before they start. Marking the first item as complete by default (or pre-completing sign-up) exploits the endowed-progress effect: users who feel they've already started are more likely to continue.

```tsx
const checklistItems = [
  { id: 'account-created', label: 'Create your account', completedByDefault: true },
  { id: 'create-project', label: 'Create your first project', completedByDefault: false },
  { id: 'invite-teammate', label: 'Invite a teammate', completedByDefault: false },
];
```

### 2. Zeigarnik effect

Incomplete tasks are more psychologically salient than unstarted tasks. Showing the progress percentage prominently ("2 of 4 complete") exploits the Zeigarnik effect: users are drawn to finish what they started.

```tsx
const progress = items.filter(i => i.completed).length / items.length;
// Display: "2 of 4 steps complete — 50%" with a progress bar
```

### 3. Variable-ratio reward

Place a "celebration" (confetti animation, upgrade unlock, in-app notification) at completion that is unexpected in exact timing. The variable-ratio schedule maintains engagement through the checklist.

**Practical implementation:** Trigger a confetti animation when the user completes the activation milestone (item 3 in the framework), not only at full completion. Activation is the reward moment.

---

## Progress persistence

Store checklist item completion in the user's profile, not in localStorage, for authenticated products. Users should see their progress on any device.

**Recommended schema (route to `db-worker-bee` for full schema design):**

```sql
-- Minimal viable table
CREATE TABLE user_checklist_items (
  user_id    UUID NOT NULL REFERENCES users(id),
  item_id    TEXT NOT NULL,  -- e.g., 'create-project'
  completed  BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, item_id)
);
```

For anonymous pre-auth checklists (rare): use versioned localStorage.

---

## Behavioral trigger for checklist display

Show the checklist based on behavior, not login:
- First visit to the main product page after account creation.
- After completing sign-up but before creating first resource.
- When the user navigates to the empty state of a core feature.

Do not force the checklist as a modal on every login. Prefer a persistent (but dismissible) panel or sidebar widget.

---

## Activation measurement

Instrument these events for every checklist (route to analytics Bee for implementation):

| Event | When to fire |
|---|---|
| `checklist_viewed` | Checklist panel becomes visible |
| `checklist_item_clicked` | User clicks an item (starts the guided action) |
| `checklist_item_completed` | The completion condition is met (user performed the action) |
| `checklist_dismissed` | User explicitly hides the checklist |
| `checklist_completed` | All items marked complete |

The critical metric: what % of users who viewed the checklist completed the activation milestone item (`checklist_item_completed` where `item_id = 'your-activation-action'`)?
