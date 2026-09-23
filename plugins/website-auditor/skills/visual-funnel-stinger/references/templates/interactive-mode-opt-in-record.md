# Interactive/stateful mode opt-in record template

Interactive mode defaults OFF (build plan Q16, PRD-012 non-goal). This template records the decision at intake so the funnel walk's stopping point (or lack of one) is auditable after the fact, not inferred from behavior.

```markdown
## Interactive mode decision: {domain}, {date}

- **Requested by:** {user, at intake}
- **Decision:** {OFF (default, no consent recorded) | ON, explicit per-run opt-in}
- **If ON:**
  - Credentials used: {must be "none real, test/synthetic only" per conduct rule 1 and PRD-012 AC-3}
  - Payment instrument used: {must be "none real" per PRD-012 AC-3}
  - State-creating step(s) this authorizes: {name exactly which step, e.g. "final Place Order click"}
- **If OFF:**
  - Last checkpoint captured before the state-creating step: {checkpoint ID}
  - Reason the walk stopped there: {e.g. "next step is a real Place Order submission"}
```

This record is written once per run, at the point the decision is made (intake or immediately before the funnel walk begins), and referenced by the funnel report's "Where the walk stopped" section rather than duplicated into it.
