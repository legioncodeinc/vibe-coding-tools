# SR-008: Facebook account or page connection fails

## Use when

Use when a Facebook account or page cannot connect while other social destinations may still work.

## Required evidence

- Workspace, exact Facebook asset, authorizing user, current permissions, timestamp and timezone, connection alert, and whether other connected destinations work.

## Customer-facing email

**Subject:** {ticket_id}: Checking your Facebook connection

Hi {customer_first_name},

I understand that a Facebook account or page will not connect. We need to isolate the affected asset and confirm the authorizing user's access before changing the connection.

Please reply with the workspace, exact Facebook account or page, the authorizing user, the permissions that user currently has, the time of the latest attempt with timezone, and the connection alert. Also tell me whether other connected destinations are working.

Please do not disconnect and reconnect the asset repeatedly. I will compare the asset, permissions, and current connection state first. If those details are correct and the connection still fails, I will send the evidence to our technical team. We have not confirmed a broader disruption or a cause.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-09`. Verify current internal status before incident language. Reconnect only the affected asset and only after destination state and authorizing permissions are confirmed.
