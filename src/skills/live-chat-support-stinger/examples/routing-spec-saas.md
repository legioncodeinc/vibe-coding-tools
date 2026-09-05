# Example: Routing Spec for a B2B SaaS Product

A worked routing specification for a 12-person B2B SaaS with three tiers (Free, Pro, Enterprise). Copy and adapt for your platform's routing UI.

---

## Team structure

| Team | Agents | Scope |
|---|---|---|
| Enterprise | 3 dedicated CSMs | Enterprise plan conversations |
| Technical | 4 agents | Bug reports, API integrations, technical escalations |
| Billing | 2 agents | Billing disputes, upgrade/downgrade requests |
| General | All available | Free tier, unclassified, overflow |
| Retention | 1 agent | Cancellation intent, churn risk |

---

## Routing rules (in priority order)

### Rule 1: Cancellation intent → Retention (HIGHEST PRIORITY)

```
IF conversation_tag = "cancellation"
   OR message contains "cancel my account"
   OR message contains "want to cancel"
THEN assign_to_team = Retention
     priority = Urgent
     SLA_first_response = 15 minutes
```

### Rule 2: Enterprise plan → Enterprise team

```
IF user.plan = "enterprise"
THEN assign_to_team = Enterprise
     priority = High
     SLA_first_response = 1 hour
     NOTIFY agent_lead on Slack immediately if unassigned after 30 min
```

### Rule 3: Pro + Technical → Technical team

```
IF user.plan = "pro"
   AND (conversation_tag = "technical"
        OR conversation_tag = "bug"
        OR message contains "API"
        OR message contains "error")
THEN assign_to_team = Technical
     priority = Medium
     SLA_first_response = 4 hours
```

### Rule 4: Pro + Billing → Billing team

```
IF user.plan = "pro"
   AND (conversation_tag = "billing"
        OR message contains "invoice"
        OR message contains "charge"
        OR message contains "refund")
THEN assign_to_team = Billing
     priority = Medium
     SLA_first_response = 4 hours
```

### Rule 5: Pro unclassified → General (medium priority)

```
IF user.plan = "pro"
   AND no previous rule matched
THEN assign_to_team = General
     priority = Medium
     SLA_first_response = 8 hours
```

### Rule 6 (CATCH-ALL): All other → General (standard priority)

```
IF no previous rule matched
THEN assign_to_team = General
     priority = Normal
     SLA_first_response = 24 hours
```

---

## Overflow rules

```
IF assigned conversation has no first response within SLA_first_response
THEN:
  - Notify team lead via Slack
  - After 2x SLA: Move to unassigned inbox
  - After 2x SLA: Send customer update: "We're on it — you'll hear from us by [time]."
```

---

## Within-team distribution

- All teams: **Load balancing** (assign to agent with fewest open conversations).
- Fallback to round-robin if no agent has fewer than 10 open conversations.

---

## Outside business hours

```
IF current_time NOT IN business_hours (Mon–Fri 9am–6pm UTC)
THEN:
  - AI deflection active for all tiers.
  - For Enterprise: send "Your dedicated CSM will respond when back online at [time]."
  - Queue all conversations for morning triage.
  - No routing to on-call (unless PagerDuty escalation for P0 incidents).
```
