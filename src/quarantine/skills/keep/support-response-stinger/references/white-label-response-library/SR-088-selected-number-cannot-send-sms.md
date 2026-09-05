# SR-088: The selected number cannot send SMS

## Use when

Use this response when the number selected for a conversation or workflow cannot send SMS because its capability, active state, registration, ownership, or campaign linkage is uncertain.

## Required evidence

- The affected account and selected sending number
- A recipient reference, timestamp, and exact capability error
- The number's active and SMS-capable state
- The required registration and campaign linkage
- The source conversation or workflow
- Other routes, users, or campaigns that depend on the number
- Prior retries and current delivery state

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the number that cannot send SMS

Hi {customer_first_name},

Thanks for reporting that the selected number cannot send SMS. Before replacing or reassigning anything, we need to verify the exact number's capability, ownership, and current dependencies.

Please reply with the affected account, selected sending number, recipient reference, send time and timezone, exact redacted error, and the conversation or workflow that selected the number. Please also confirm whether the number is active, shown as SMS-capable, registered where required, linked to the intended campaign, and used by any other routes or campaigns.

Please do not replace, port, reassign, or retry from the number while we review it.

{agency} Support will verify that the number is active, SMS-capable, correctly registered, and linked to the intended account and campaign. We will review ownership, dependent routes, consent, impact, and rollback before any reassignment. One controlled retest may follow only after prior delivery and consent are confirmed.

{agent_name}
{agency} Support

## Agent notes

- Verify the exact selected number rather than assuming the account default was used.
- Record every dependent route and active campaign before recommending a number change.
- Do not replace, port, or broadly reassign the number without ownership, impact, and rollback review.
- Check prior delivery and consent before one controlled retest.
- Escalate capability or association inconsistencies with the exact redacted error and number state.

