# SR-024: Voice AI call processing fails

## Use when

Use when an automated voice call remains unprocessed or produces an uncertain partial result.

## Required evidence

- Agent identifier, contact, call direction, timestamp and timezone, redacted call identifier, consent state, call history, contact state, and any partial conversation or follow-up action.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the failed voice call processing

Hi {customer_first_name},

I understand that an automated voice call did not process as expected. Before any retry, we need to determine whether a partial call, contact update, or follow-up action already occurred.

Please send the agent identifier, affected contact, call direction, timestamp with timezone, redacted call identifier, and current consent state. Include the call-history result, current contact state, and a brief redacted description of any partial conversation or follow-up action. Do not send unrestricted recordings or full private transcripts.

Please do not replay the call. After consent and prior side effects are checked, I will consolidate the minimal evidence for our technical team. We have not confirmed a cause or that another call is safe.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Stop after minimal evidence collection and escalate. A replay is prohibited until consent, original call state, and every known downstream effect are reviewed.
