# SR-060: Sequential workflow actions run much later than expected

## Use when

Use this response when sequential workflow actions execute minutes or hours apart without an obvious configured wait.

## Required evidence

- Workflow name and version
- Affected contact and trigger timestamp with timezone
- Execution time for every relevant action
- Wait configuration and business-time settings
- Error history and redacted integration response
- Recent changes, prior replays, and known side effects

## Customer-facing email

**Subject:** {ticket_id}: Timeline review for delayed workflow actions

Hi {customer_first_name},

I understand sequential actions are running later than expected. We have not confirmed the cause, so we will compare the configured timing with one affected execution before changing or replaying anything.

Please send one consolidated timeline:

1. The workflow name and version, affected contact, trigger time, and timezone.
2. The recorded start and completion time for each relevant action.
3. Every configured wait, business-time setting, and error entry on that path.
4. The redacted integration response, recent changes, prior replay attempts, and known side effects.

Do not include passwords, verification codes, tokens, authorization details, full payloads, or unrestricted exports.

{agency} will build the exact execution timeline and compare recorded action times with the configured waits. If the configuration does not explain the gap, our technical team will review the redacted evidence. We will not replay the workflow until prior effects and duplicate risk are known. I will update you after the timeline review.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `DOC_COVERED` for history and error review, not for an assumed cause.
- Do not describe the delay as throttling or a service-wide issue without current evidence.
- Apply `HR-06` before any replay. Audit records, messages, charges, appointments, webhooks, and other external effects.
- Escalate the full timestamped timeline and redacted logs when configuration does not explain the delay.
