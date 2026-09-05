# SR-012: Pinterest posts fail while other channels work

## Use when

Use when publishing fails for Pinterest while other social destinations continue to work.

## Required evidence

- Workspace, Pinterest destination, post identifier, scheduled time and timezone, redacted error, connection state, and destination-side status.

## Customer-facing email

**Subject:** {ticket_id}: Checking a failed Pinterest post

Hi {customer_first_name},

I understand that a Pinterest post failed while your other social channels appear to be working. We first need to confirm whether the original post reached Pinterest and isolate the issue to that destination.

Please reply with the workspace, Pinterest destination, post identifier, scheduled time with timezone, current connection state, and the redacted error. Also confirm whether the original post is visible at the destination.

Please do not reconnect the account, republish the post, or change unrelated social connections. I will compare the planner state with the destination result and send any unexplained conflict to our technical team. We have not confirmed that the original post failed completely or that a retry is safe.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-09`. Confirm destination state before any action. Isolate Pinterest and do not reconnect unrelated accounts or republish a post that may already be live.
