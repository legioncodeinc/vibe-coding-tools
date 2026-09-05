# Template: Routing Spec

Use this skeleton to document your conversation routing configuration.

---

## Product context

- **Platform:** _______________
- **Team size:** _______________
- **Plan tiers:** _______________
- **Business hours:** _______________ (timezone)

---

## Team structure

| Team | Agents | Scope |
|---|---|---|
| [Team 1] | [N] | [Description] |
| [Team 2] | [N] | [Description] |
| (Catch-all) General | All available | Overflow, unclassified |

---

## Routing rules (in priority order)

### Rule 1: [Highest priority condition] → [Team]

```
IF [condition]
THEN assign_to_team = [team]
     priority = [Urgent / High / Medium / Normal]
     SLA_first_response = [time]
```

### Rule 2: [Second condition] → [Team]

```
IF [condition]
THEN assign_to_team = [team]
     priority = [...]
     SLA_first_response = [time]
```

### Rule N (CATCH-ALL): All others → General

```
IF no previous rule matched
THEN assign_to_team = General
     priority = Normal
     SLA_first_response = 24 hours
```

---

## Overflow rules

```
IF no first response within SLA_first_response
THEN [action: notify lead / move to unassigned / send customer update]
```

---

## Within-team distribution

- Distribution method: [Load balancing / Round-robin]
- Fallback: [...]

---

## AI deflection (if applicable)

- AI active: [Yes / No]
- Involvement rate target: [%]
- Hard escalation conditions: [...]
- Bot timeout: [minutes]
