# Guide 06: Integration Wiring

Feedback platforms are most powerful when they reflect what is actually being built. This guide covers the integration wiring for the four most common pairings — Productlane + Linear, Canny + Jira, Featurebase + Linear, and Userback + Slack/Jira — with a focus on bidirectional sync, status reflection, and avoiding duplicate-source drift.

## Productlane + Linear (the native pair)

Productlane's Linear integration is "at the core of Productlane" — not an afterthought.

### What syncs (two-way)

| Productlane | Linear | Sync direction |
|-------------|--------|---------------|
| Customer requests | Linear Customer Requests (Dec 2024 feature) | Two-way |
| Customers (company, contact, MRR) | Linear customer properties (stage, tier, revenue) | Two-way |
| Issues and projects | Always up to date in Productlane | Linear → Productlane |
| Public roadmap | Mirrors Linear projects automatically | Linear → Productlane |
| Changelog drafts | Auto-generated when Linear project marked complete | Linear → Productlane |

### The key benefit: the roadmap IS Linear

Productlane's public roadmap is not a separate artifact you maintain — it is a live mirror of Linear's project list. When your engineering team ships a Linear project, the changelog draft appears in Productlane automatically. This is the only platform where the feedback-to-roadmap loop requires zero manual status updating.

### Setup steps

1. Connect via Linear account (Admin rights recommended for full team access).
2. Select which Linear teams are visible in Productlane.
3. Configure customer property sync (stage, tier, MRR) from HubSpot if applicable.
4. Configure the "importance button" behavior: after upvoting a feature, users can mark it as "important" by providing context text. This appears as a weighted signal in Linear.

### HubSpot integration

Productlane + HubSpot enables:

- Customer data from HubSpot contacts/deals flows into Productlane company and contact records.
- Feedback from Productlane is linked to HubSpot accounts.
- CS teams can see which features a customer has requested without leaving HubSpot.

Setup: Productlane Settings → Integrations → HubSpot → Connect and configure field mapping.

### Migration from Productboard

Productlane provides a Productboard importer and CSV upload for teams switching. Import historical feature requests and votes before cutting over.

---

## Canny + Jira

Canny's Jira integration is bidirectional and mature (available on paid plans).

### What syncs

- **Canny → Jira:** When a Canny feature request is moved to "Planned", Canny creates a linked Jira ticket automatically.
- **Jira → Canny:** When the Jira ticket's status changes, Canny's status updates automatically.
- Canny voters receive notifications when the linked Jira ticket progresses.

### Setup steps

1. Canny Settings → Integrations → Jira → Connect (requires Jira admin).
2. Configure the Jira project and issue type for auto-created tickets.
3. Configure status mapping: which Jira workflow statuses map to which Canny statuses.
4. Test with one Canny item: move it to Planned and verify the Jira ticket is created.

### Drift prevention

The most common failure mode: the Jira ticket gets closed ("Done") but the Canny status stays on "In Progress" because no one set up the reverse mapping.

- Map Jira "Done" → Canny "Shipped" explicitly in the integration settings.
- Assign one team member as the "sync owner" who checks the Canny board weekly for items whose Jira ticket is Done but Canny status is stale.

### Canny + Linear (alternative)

Canny also has a Linear integration (two-way). Same principles apply — map Linear "Completed" → Canny "Shipped" to close the loop automatically.

---

## Featurebase + Linear

Featurebase's Linear integration is simpler than Productlane's but sufficient for most teams.

### What syncs

- **Featurebase → Linear:** When a Featurebase request is moved to "In Progress" or "Planned", a Linear issue can be created.
- **Linear → Featurebase:** Status updates on the Linear issue reflect back to Featurebase.

### Setup steps

1. Featurebase Settings → Integrations → Linear → Connect via OAuth.
2. Configure which Linear workspace/team receives new issues.
3. Test with one request.

**Caveat:** Featurebase's integration depth is thinner than Canny's Jira or Productlane's Linear. Two-way property sync (customer MRR, plan tier) is limited compared to Productlane. If Linear + CRM data is the priority, Productlane is the better choice.

---

## Userback + Slack / Jira

Userback integrates with Slack for notifications and Jira for issue creation.

### Userback + Slack

- New feedback submitted via the widget → Slack notification to a designated channel.
- Status changes (Shipped) → Slack notification.
- Setup: Userback Settings → Integrations → Slack → Connect and configure channel.

### Userback + Jira

- When a bug report or feature request is submitted via Userback, a Jira ticket can be auto-created.
- The Jira ticket link appears in the Userback item.
- Status changes in Jira are NOT automatically reflected back to Userback (one-way, Userback → Jira).

### Limitation

Userback's integrations are primarily notification-based (Userback → Jira/Slack). There is no deep bidirectional status sync comparable to Canny + Jira or Productlane + Linear. Userback is best suited as the collection surface; a second tool (Canny, Productlane) handles deep issue-tracker integration when bidirectional sync is needed.

---

## Integration anti-patterns

| Anti-pattern | Consequence | Fix |
|-------------|-------------|-----|
| Running two separate feedback tools (e.g., Userback for widget + Canny for voting) | Two canonical sources of truth that drift | Pick one primary tool; the other is a collection surface only (no separate voting board) |
| Bidirectional sync without status mapping | Jira "Done" never closes the Canny "Planned" request | Map all final states explicitly on setup |
| No one owns the weekly sync check | Drift accumulates silently | Designate a sync owner; calendar a 15-min weekly audit |
| Importing historical data after going live | Confuses vote counts and created dates | Import before going live or accept a clean-slate start date |
