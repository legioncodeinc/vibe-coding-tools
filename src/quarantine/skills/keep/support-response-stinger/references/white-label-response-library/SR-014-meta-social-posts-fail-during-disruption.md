# SR-014: Meta social posts fail while related services are affected

## Use when

Use when a Meta social post fails and other Meta-connected features may also show problems.

## Required evidence

- Workspace, Meta destination, post identifier, scheduled time and timezone, current status or redacted error, authorizing-user permission, connection state, destination result, and related feature results.

## Customer-facing email

**Subject:** {ticket_id}: Checking failed Meta social publishing

Hi {customer_first_name},

I understand that a Meta social post did not publish as expected and that related connected features may also be affected. We have not confirmed a current cross-service issue, so the first step is to verify the original post and isolate the operation.

Please send the workspace, destination, post identifier, scheduled time with timezone, current status or redacted error, authorizing user's current permission, and connection state. Confirm whether the post is already live at the destination and whether any related Meta features fail at the same time.

Please do not retry, delete, or reconnect anything yet. I will compare the original post state, destination, permission, and related results, then send the evidence to our technical team if the failure spans more than one connected function.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-09`. Verify current internal status before incident language. Prior publication and destination state must be known before retry, deletion, or reconnection.
