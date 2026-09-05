# SR-044: Voice AI transfer becomes silent or hangs up

## Use when

Use when an automated voice transfer rings without connecting, becomes silent, or ends unexpectedly.

## Required evidence

- Workspace, agent, contact, direction, timestamps and timezone, redacted call identifiers, transfer destination, ringing and voicemail behavior, preserved configuration, consent state, call history, and any follow-up action.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the silent or disconnected voice transfer

Hi {customer_first_name},

I understand that the voice transfer rang without connecting, became silent, or ended unexpectedly. Before another call is attempted, we need to preserve the current configuration and review one failed transfer and its downstream call history.

Please send the workspace, agent, affected contact, call direction, timestamps with timezone, redacted call identifiers, transfer destination, ringing or voicemail behavior, current configuration summary, consent state, call history, and any follow-up action that already occurred. Do not send unrestricted recordings or full private transcripts.

Please do not replay the call or change organization-wide routing. After I receive the minimal evidence, I will send it to our telephony specialist. We have not confirmed a cause or a safe retry.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `UNRESOLVED`. Stop after preserving configuration and collecting one redacted call example, then escalate. No replay or broad routing change without consent and prior-side-effect review.
