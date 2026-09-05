# SR-005: Email content will not save or load, or scheduling fails

## Use when

Use when email content cannot be saved or loaded, or a campaign cannot be scheduled reliably.

## Required evidence

- Workspace, template or campaign identifier, timestamp and timezone, exact action and redacted error, preserved copy of unsaved content when available, and current schedule state.

## Customer-facing email

**Subject:** {ticket_id}: Protecting your email content and checking its schedule

Hi {customer_first_name},

I understand that your email content will not save or load, or that scheduling is failing. Please copy any unsaved text into a local document now so it is protected while we check the current state.

Please reply with the workspace, template or campaign identifier, the exact action that failed, the time with your timezone, and the redacted error. Also tell me what schedule the interface currently shows and whether you received any confirmation that the original schedule was accepted.

Do not schedule, clone, or send the campaign again until we know whether the first action was recorded. I will verify the schedule state before recommending a controlled next step. If the same preserved content still cannot save or load in a clean session, I will send the evidence to our technical team. We have not confirmed a current incident or a safe resend.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-08` before rescheduling or replay. Preserve content and check the original campaign state first. Do not call this an incident without current verification.
