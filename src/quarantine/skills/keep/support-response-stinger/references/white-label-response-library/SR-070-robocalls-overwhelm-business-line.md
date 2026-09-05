# SR-070: Robocalls overwhelm a business line and hide legitimate leads

## Use when

Use this response when a high volume of suspected automated or unwanted calls is obscuring legitimate calls, creating junk contacts, or triggering paid automation.

## Required evidence

- Account and affected business number reference.
- A small representative set of redacted call references and timestamps.
- Estimated daily scope, repeat caller patterns, and the number of legitimate calls affected.
- Junk contacts, workflows, or automated services triggered by the calls.
- Current routing, business impact, and the outcome the customer considers acceptable.

## Customer-facing email

**Subject:** {ticket_id}: Unwanted calls are obscuring legitimate leads

Hi {customer_first_name},

Thanks for reporting that unwanted calls to {affected_number_reference} are making legitimate leads difficult to identify and may be creating additional contacts or automation usage. We will first preserve representative evidence and measure the effect before proposing a filtering or routing change.

Please send the following in one reply:

1. The account and affected business number reference.
2. Five representative redacted call references with timestamps and timezone.
3. The estimated daily call count, any repeat caller patterns, and how many legitimate calls were affected.
4. The junk contacts, workflows, or automated services triggered by these calls.
5. The current routing and the operational impact on your team.

Please do not replace the number, deploy a new call menu, or make a broad routing change while we assess the impact. I will quantify the effect on calls, contacts, and automation, then escalate the evidence for number reputation and filtering review. We have not confirmed that the unwanted calls can be eliminated. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- A representative sample should be small, redacted, and sufficient to show timing and caller patterns.
- Do not promise elimination or recommend a new number, call menu, or caller barrier without a customer-impact review and authorization.
- Do not change routing broadly while legitimate calls are already difficult to distinguish.
- The owner is `{agent_name}` until the scoped evidence reaches the telephony specialist.
