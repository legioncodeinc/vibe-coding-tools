# SR-080: Messaging reaches a daily, ramp, or restriction limit

## Use when

Use this response when messaging stops, slows, or shows a daily-limit, ramp, restriction, or throughput warning.

## Required evidence

- Account and sending-number reference.
- Exact error, timestamp and timezone, current volume, and recent volume.
- Displayed limit or ramp progress and restriction history.
- Registration state and confirmed consent state.
- Campaign or workflow reference and the prior delivery state of attempted messages.

## Customer-facing email

**Subject:** {ticket_id}: Messaging limit or restriction review

Hi {customer_first_name},

Thanks for reporting that messaging from {sending_number_reference} stopped or slowed after a limit or restriction appeared. Please stop repeated sends while we identify the exact limit and confirm the delivery state of messages already attempted.

Please send the following in one reply:

1. The account and sending-number reference.
2. The exact error, timestamp and timezone, current sending volume, and recent daily volume.
3. The displayed limit or ramp progress and any restriction history.
4. The current registration state and confirmed consent state for the affected recipients.
5. The campaign or workflow reference and the prior delivery state of attempted messages.

Do not rotate numbers, split traffic, or replay the campaign to bypass the limit. Please redact recipient content and do not send private contact exports or access credentials.

I will inspect the specific limit or restriction record and determine whether the next action is a configuration correction, compliant limit review, or specialist escalation. I will update you after that record review is complete. We have not approved a resend or limit increase.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F4`. Remediation class: `R1`.
- Check prior delivery state, exact error, registration, and consent before any controlled resend.
- Never rotate numbers, split traffic, or replay a campaign to evade a limit or restriction.
- A limit-increase request requires valid registration, compliant traffic, confirmed consent, and owner approval.
- The owner is `{agent_name}` through classification. Escalate restriction or limit decisions with the complete, redacted record.
