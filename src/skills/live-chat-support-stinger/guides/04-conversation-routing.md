# Guide 04: Conversation Routing

Routing rule architecture for SaaS support teams. Covers routing primitives, skills-based routing, round-robin, overflow, priority queues for paying customers, and SLA escalation.

---

## Routing primitive taxonomy

All platforms share a common vocabulary for routing — the implementation varies but the concepts are consistent:

| Primitive | What it does | Example |
|---|---|---|
| **Team** | Route to a specific agent group | "Enterprise" team, "Technical" team |
| **Skills** | Route to an agent with a required skill | Skill: "Spanish", Skill: "API integrations" |
| **Round-robin** | Distribute evenly within a team | Prevents one agent from getting all conversations |
| **Load balancing** | Route to the agent with fewest open conversations | Better than round-robin for variable-length conversations |
| **Tags/Labels** | Classify conversations for routing and reporting | Tag: "billing", Tag: "bug" |
| **Attributes** | Route based on user or conversation data | Plan tier: "Enterprise", Region: "EU" |
| **Overflow** | Fallback when primary queue is full or unresponsive | Route to "General" team after 30-minute wait |
| **Priority** | Move certain conversations to the front of the queue | Paying customers, SLA-bound accounts |
| **SLA** | Automatically escalate when response time threshold is breached | Escalate if no first response in 4 hours |
| **Intent** | Route based on detected conversation topic | Intent: "cancellation" → Retention team |

---

## Canonical routing spec for B2B SaaS

This is the standard routing configuration for a 5-20 person SaaS support team. Adapt to your team structure.

### Tier 1: Automated classification (happens first)

1. **Language detection** → Tag with detected language. Route non-English to bilingual agents (if available).
2. **Intent detection** (Intercom/Plain AI) → Auto-tag with: `billing`, `technical`, `bug`, `feature-request`, `cancellation`.
3. **Plan tier lookup** → Fetch `plan` attribute from user record → apply Priority tag (`enterprise-priority`, `pro-priority`).

### Tier 2: Team assignment (after classification)

| Condition | Team | Priority |
|---|---|---|
| `plan = enterprise` | Enterprise team (dedicated CSM or technical lead) | High |
| `plan = pro` AND `tag = technical` | Technical team | Medium |
| `plan = pro` AND `tag = billing` | General team | Medium |
| `plan = free` AND `tag = technical` | Technical queue (lower SLA) | Low |
| `tag = cancellation` | Retention team (separate from general queue) | High |
| No match | General team | Normal |

### Tier 3: Within-team distribution

Use **load balancing** (fewest open conversations) as the default within each team. Round-robin is simpler to configure but produces unfair distribution for long-running technical conversations.

### Tier 4: Overflow and escalation

- If no agent responds in **30 minutes** → notify team lead via Slack + escalate priority.
- If no agent responds in **4 hours** → move to unassigned inbox + send customer an update ("We're looking into this, you'll hear from us within X hours").
- Enterprise conversations: escalate to manager if no first response in **1 hour**.

---

## Paying customer priority queue

This is the single highest-ROI routing configuration for SaaS. Implement it before anything else.

```
IF user.plan IN ('pro', 'enterprise', 'team')
THEN priority = HIGH
AND route_to_team = 'paid-support'
```

Why it matters: Free-tier conversations can wait 24 hours and churn has limited impact. Pro/Enterprise conversations queued behind free-tier traffic generate churn and negative reviews. Segment them physically (separate inbox or queue) rather than just logically (priority flag that can be overridden).

---

## Platform-specific notes

### Intercom

Intercom uses "Assignment Rules" (inbox → team) and "Workflows" (automation with conditions/actions). Configure in Settings → Inbox → Assignment Rules.

Key patterns:
- Condition: `Conversation type = "Live Chat"` + `User attribute > Plan = "enterprise"` → Action: Assign to Enterprise team.
- Use "Workflow" automation for multi-step routing (classify → tag → assign).
- "Priority Replies" feature (Advanced plan) moves flagged conversations to a separate queue visible to all agents.

### Crisp

Crisp uses "Routing Rules" under Crisp Dashboard → Settings → Inbox → Routing. Conditions support operators, tags, and visitor data.

Pattern:
- Condition: `Conversation tag = "enterprise"` → Action: Assign to agent group.
- Round-robin is available within agent groups.
- Note: Overflow rules require manual setup via Crisp's "Triggers" feature.

### Pylon (Slack-native)

Pylon's routing model is account-centric, not conversation-centric. The core concept: each Slack Connect channel maps to a customer account, which maps to a CRM owner.

Configuration steps:
1. Map Slack Connect channel to customer account in Pylon.
2. Set the account owner (maps to CRM field, e.g., Salesforce Account Owner).
3. Configure SLA timers per account tier.
4. Set overflow to team-wide inbox after SLA breach.

The visual workflow builder (Settings → Workflows) handles escalation without code.

### Plain

Plain uses "Tiers" and "Labels" for routing. Configure via the Plain dashboard or GraphQL API (`upsertCustomer` with `tierIdentifier` field).

Priority setup:
```graphql
mutation {
  upsertCustomer(input: {
    identifier: { emailAddress: "user@company.com" }
    onCreate: { tierIdentifier: { identifier: "enterprise" } }
  }) {
    customer { id }
  }
}
```

---

## The no-routing-hole rule

Every routing configuration must have a catch-all rule. The last rule in your routing logic should be: "If none of the above conditions match → assign to General queue." Never allow a conversation to have no routing destination.

A conversation with no team assignment is invisible in most support inboxes and will sit unresponded indefinitely.
