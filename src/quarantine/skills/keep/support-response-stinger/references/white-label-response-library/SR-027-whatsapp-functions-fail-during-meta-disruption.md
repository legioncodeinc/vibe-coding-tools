# SR-027: WhatsApp functions fail while Meta services are affected

## Use when

Use when a WhatsApp function fails and other Meta-connected features may fail at the same time.

## Required evidence

- Workspace, WhatsApp number and channel, exact function, message or template identifier, timestamp and timezone, connection state, related Meta feature results, and uncertain operation list.

## Customer-facing email

**Subject:** {ticket_id}: Checking failed WhatsApp functions

Hi {customer_first_name},

I understand that a WhatsApp function failed and that related Meta-connected features may also be affected. We have not confirmed a current broader disruption, so we need to isolate the exact function and preserve uncertain operations.

Please send the workspace, WhatsApp number and channel, exact function, message or template identifier, timestamp with timezone, and current connection state. List any sends or actions whose completion is uncertain and tell me whether other Meta-connected features fail at the same time. Redact message content that is not needed.

Please do not reconnect the account or retry uncertain sends. I will verify current internal service state and consolidate the redacted operation list for our technical team. A resend can be considered only after prior delivery is known and consent is verified.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Stop after minimal evidence and current-status checks, then escalate. Preserve the connection. Prior delivery and consent are mandatory before any later retry.
