# SR-019: Opportunities view is blank or bulk actions are unavailable

## Use when

Use when the opportunities view is blank or a previous bulk action has an uncertain result.

## Required evidence

- Workspace, affected view, timestamp and timezone, expected opportunity count, earlier bulk-action details, audit history, and another authorized user's result.

## Customer-facing email

**Subject:** {ticket_id}: Checking the blank opportunities view

Hi {customer_first_name},

I understand that the opportunities view is blank or its bulk actions are unavailable. Before another action is attempted, we need to determine what happened to any earlier bulk operation and compare the expected records with the audit history.

Please send the workspace, affected view, time with timezone, expected opportunity count, and details of any bulk action already attempted. Include the available audit-history result and tell me whether another authorized user can load the same view.

Please do not repeat the bulk action or recreate opportunities. I will compare the recorded action state, audit history, and expected count first. If the discrepancy remains, I will send the scoped evidence to our technical team before any controlled record change.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-07`. The earlier bulk action state must be known before retry. Never bulk-move or recreate records until existing opportunities and automation history are checked.
