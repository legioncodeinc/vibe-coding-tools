# White-label issue response library

This directory contains one reusable customer-facing email playbook for each issue in `../highlevel-issue-catalog.md`.

## File contract

Each file must:

1. Use the exact filename declared by its catalog entry.
2. Begin with `# SR-###: Customer-facing issue title`.
3. Contain `## Use when`, `## Required evidence`, `## Customer-facing email`, and `## Agent notes`.
4. Include `**Subject:**`, `Hi {customer_first_name},`, `{agent_name}`, and `{agency} Support`.
5. Ask only for minimal, redacted evidence.
6. Stop at escalation when the catalog says `UNRESOLVED`.
7. State a next-update time only when `{next_update_at}` is supplied and real.
8. Avoid every prohibited upstream name, domain, service, help link, status link, or ticket reference.
9. Contain no pre-filled URL. Add an agency-owned or approved neutral link only at runtime.
10. Contain no authored em dash or en dash.

## Email pattern

```text
**Subject:** {ticket_id}: [specific feature and symptom]

Hi {customer_first_name},

[Acknowledge the exact observed issue and impact.]

[State what is verified and what remains unknown.]

[Request one consolidated evidence set or give one safe, bounded next step.]

[Name the owner and real next update, or state that no time is confirmed.]

{agent_name}
{agency} Support
```

These files are starting structures, not permission to invent an outage, diagnosis, fix, refund, escalation, or ETA. Run `../../scripts/validate.py` after every library edit.
