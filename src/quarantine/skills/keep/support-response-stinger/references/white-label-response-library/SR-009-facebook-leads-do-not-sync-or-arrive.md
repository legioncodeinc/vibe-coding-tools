# SR-009: Facebook leads do not synchronize or arrive

## Use when

Use when submitted Facebook leads are not visible in the expected workspace or contact records.

## Required evidence

- Workspace, Facebook page and form, missing lead identifiers when available, submission timestamps and timezone, connection state, field mapping, and current contact search results.

## Customer-facing email

**Subject:** {ticket_id}: Tracing missing Facebook leads

Hi {customer_first_name},

I understand that Facebook form submissions are not appearing where you expect them. Before synchronizing or recreating anything, we need to confirm which submissions are missing and whether any already exist under another contact.

Please send the workspace, Facebook page and form, submission times with timezone, and the missing lead identifiers if available. Include the current connection state, field mapping, and the contact search terms or results you already checked. Please redact lead content that is not needed to identify the records.

Do not manually import or resubmit these leads yet. I will inventory the missing submissions and compare them with existing contacts. If the connection and mapping are intact but the records remain absent, I will send the evidence to our technical team. Any later synchronization must first protect against duplicate contacts and duplicate automation.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Stop after the minimal inventory and current-state checks, then escalate. Do not claim a current incident, manually synchronize, or recreate leads until duplicate side effects are controlled.
