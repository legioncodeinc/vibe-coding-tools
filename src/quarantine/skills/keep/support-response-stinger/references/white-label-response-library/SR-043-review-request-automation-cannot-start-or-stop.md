# SR-043: Review-request automation cannot start or stop

## Use when

Use when review-request automation lacks a clear enrollment source, start trigger, or verified stop event.

## Required evidence

- Business and workspace, consented customer source, intended channel, workflow, trigger, reminder schedule, objective stop event, current contact state, and one redacted example.

## Customer-facing email

**Subject:** {ticket_id}: Mapping your review-request automation

Hi {customer_first_name},

I understand that the review-request automation cannot start or stop as expected. We need to map the consented enrollment source, start trigger, reminder schedule, and objective completion event without sending a test request to a real customer.

Please send the business and workspace, consented customer source, intended channel, workflow name, trigger, reminder schedule, intended stop event, current contact state, and one redacted example. Please describe what should count as completion rather than assuming a click or page visit is sufficient.

Do not enroll a live customer for testing or bypass consent. After I receive this map, I will route the current capability and consent questions for specialist review. We have not confirmed that the desired completion signal exists, and we will not invent one.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `UNRESOLVED`. Stop after evidence collection and escalate for current product and consent review. Never invent a stop event, test on a real customer, or bypass consent.
