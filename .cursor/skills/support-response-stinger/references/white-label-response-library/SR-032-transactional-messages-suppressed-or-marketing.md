# SR-032: Transactional messages are suppressed or shown as marketing

## Use when

Use when an invoice, confirmation, reminder, or requested asset is suppressed or presented as marketing.

## Required evidence

- Message purpose, channel, contact, consent and do-not-disturb state, sending method, workflow, timestamp and timezone, expected delivery, actual presentation, and other affected message purposes.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the suppressed message

Hi {customer_first_name},

I understand that a message you expected to be treated as transactional was suppressed or presented as marketing. We need to identify the exact message purpose and the point where delivery or classification changed without altering the contact's consent state.

Please send the message purpose, channel, contact identifier, current consent and do-not-disturb state, sending method, workflow name, timestamp with timezone, expected result, and actual recipient presentation. Tell me whether invoices, confirmations, reminders, or other message types are also affected. Redact private message content that is not needed.

Please do not bypass do-not-disturb settings or change consent. After I receive these items, I will consolidate them for product and consent review. We have not confirmed that the message qualifies legally as transactional or that the current behavior is a defect.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `UNRESOLVED`. Stop after minimal evidence collection and escalate for current product and consent review. Never bypass do-not-disturb or make a legal classification claim.
