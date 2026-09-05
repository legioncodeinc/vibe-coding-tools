# SR-010: Social posts remain stuck in progress

## Use when

Use when a scheduled social post remains in progress without a clear completion result.

## Required evidence

- Workspace, post identifier, destination, scheduled time and timezone, current planner status, and the destination-side result.

## Customer-facing email

**Subject:** {ticket_id}: Checking a social post stuck in progress

Hi {customer_first_name},

I understand that your scheduled social post remains in progress. The first priority is to determine whether the original post is already live at its destination before anyone tries to publish it again.

Please reply with the workspace, post identifier, destination, scheduled time with timezone, and the status currently shown in the planner. Also confirm whether you can find the original post at the destination and provide its destination-side result without including private account credentials.

Please do not clone, reschedule, delete, reconnect, or publish the post again. I will compare the planner record with the destination state and determine the safest next action. If the states conflict, I will send the evidence to our technical team. We have not confirmed that the original failed or that a retry is safe.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-09`. Destination state is the first check. A retry is prohibited until the original is confirmed absent and the affected destination is isolated.
