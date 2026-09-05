# SR-092: A contact enters a workflow more than once

## Use when

Use this response when one contact has multiple enrollments in the same workflow and duplicate downstream effects may have occurred.

## Required evidence

- The workflow name and version
- The affected contact
- Every enrollment ID and enrollment time
- The triggering event recorded for each enrollment
- The re-entry setting at each event
- Execution history for every enrollment
- Any duplicate messages, records, charges, appointments, or webhooks

## Customer-facing email

**Subject:** {ticket_id}: Reviewing duplicate workflow enrollments

Hi {customer_first_name},

Thanks for reporting that one contact entered the workflow more than once. Before changing the workflow or sending anything again, we need to compare every enrollment with its recorded trigger and re-entry setting and determine whether duplicate side effects occurred.

Please reply with the workflow name and version, affected contact, every enrollment ID and time, the triggering event for each enrollment, the re-entry setting, and the execution result for each run. Please also tell us whether you found duplicate messages, records, charges, appointments, or webhook activity.

Please do not re-enroll the contact, resend a message, delete history, or replay an action while we complete that audit.

{agency} Support will reconstruct the enrollment sequence and separate completed, skipped, failed, and duplicated actions. We will consider a controlled replay only after the original operation state, prior side effects, affected records, and duplicate protection are verified. I will update you after the audit is complete.

{agent_name}
{agency} Support

## Agent notes

- Treat every enrollment as a separate event and preserve its history.
- Audit messages, records, charges, appointments, and webhooks before recommending any further action.
- Do not remove evidence or change re-entry settings until the original sequence is understood.
- A replay requires original-state review, side-effect review, affected-record review, and idempotency control where available.
- Escalate if the recorded triggers and re-entry settings do not explain the enrollments.

