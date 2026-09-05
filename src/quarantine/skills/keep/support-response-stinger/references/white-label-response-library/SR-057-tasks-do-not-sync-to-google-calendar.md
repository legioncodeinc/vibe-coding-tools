# SR-057: Tasks do not synchronize to Google Calendar

## Use when

Use this response when a customer expects assigned sales tasks to synchronize with Google Calendar, but a supported synchronization path has not been confirmed.

## Required evidence

- Account and task type
- Assigned user and source task location
- Destination Google Calendar
- Desired one-way or two-way direction
- Required fields, reminders, updates, and deletion behavior
- Current calendar integration state and business reason for the request

## Customer-facing email

**Subject:** {ticket_id}: Capability review for task synchronization to Google Calendar

Hi {customer_first_name},

I understand you want assigned tasks to appear in Google Calendar. We have not confirmed that the requested one-way or two-way behavior is currently supported, so reconnecting the calendar would not be a safe diagnostic step.

Please leave the existing connection unchanged and send:

1. The account, task type, assigned user, and destination calendar.
2. Whether tasks should move one way or both ways.
3. The fields, reminders, updates, and deletion behavior that must synchronize.
4. The current integration state and the business reason this workflow is needed.

Please redact private task content. Do not send passwords, verification codes, tokens, or calendar credentials.

{agency} will send the requested behavior to our product or implementation specialist for a current capability decision. We will not promise that reconnection or general troubleshooting can enable task synchronization while that decision is unresolved. I will update you after the specialist review.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `UNRESOLVED`.
- Treat this as a current capability boundary, not a confirmed integration failure.
- Document the exact requested data direction and behavior without changing the connected calendar.
- Escalate to a product or implementation specialist. Do not promise native support or advise reconnection as a workaround.
