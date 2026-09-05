# SR-023: Inbound calls do not reach the mobile app

## Use when

Use when calls intended for a user do not ring or arrive in the mobile app.

## Required evidence

- Workspace, user, intended calling channel, current call preference, assignment, app and version, notification and microphone permissions, timestamp and timezone, and one controlled inbound-call result.

## Customer-facing email

**Subject:** {ticket_id}: Checking inbound calls to your mobile app

Hi {customer_first_name},

I understand that inbound calls are not reaching the mobile app. We need to verify the affected user's call preference, assignment, app version, and required device permissions before changing any routing.

Please send the workspace, affected user, intended calling channel, current call preference, number assignment, app version, device type, and current notification and microphone permission states. Include the time of one failed inbound call with timezone and a redacted call identifier if available.

After those settings are confirmed, we can arrange one controlled inbound call and record the result. Please do not change organization-wide routing to address one user's symptom. If the controlled call still fails, I will send the evidence to our technical team.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Verify only the intended user's channel, assignment, app version, and required permissions. Escalate one controlled failure. Broad routing changes require separate authority and impact review.
