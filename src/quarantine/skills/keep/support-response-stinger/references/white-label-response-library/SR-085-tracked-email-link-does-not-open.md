# SR-085: A tracked email link does not open

## Use when

Use this response when a link in a sent email fails to open and the intended destination, tracking hostname, DNS resolution, or SSL state still needs to be isolated.

## Required evidence

- The affected message, contact, and send time with timezone
- The visible destination and tracking hostname, with private query values removed
- Whether the intended destination opens directly
- The browser result and exact redacted error
- Whether one recipient or multiple recipients are affected
- Current read-only DNS and SSL results for the tracking hostname
- The authorized domain owner if a change may be required

## Customer-facing email

**Subject:** {ticket_id}: Next check for the email link that does not open

Hi {customer_first_name},

I understand that a tracked link in your email does not open. We have not yet established whether the problem is with the intended destination or the tracking hostname, so the first step is a read-only comparison.

Please reply with the affected contact, the message send time and timezone, the visible destination, the tracking hostname with any private query values removed, the browser used, and the exact error shown. Please also confirm whether the intended destination opens when entered directly and whether the issue affects one recipient or several.

{agency} Support will confirm the destination first, then inspect the tracking hostname, DNS resolution, alignment, and SSL state without changing any records. Please do not delete or edit DNS, proxy, redirect, or SSL settings while we complete that review.

If a record change is needed, we will first confirm the authorized domain owner, the exact current record, the affected services, the intended value, and a rollback plan. I will update you after the read-only review is complete.

{agent_name}
{agency} Support

## Agent notes

- Do not include a live destination or tracking address in the reusable response.
- Confirm that the direct destination works before diagnosing the tracking path.
- A DNS, proxy, redirect, or SSL change requires owner authority, current-record review, impact review, an exact target, and rollback.
- Never tell the customer to delete records generically.
- Keep the case open if the link still fails after a clean read-only comparison.

