# SR-086: A recipient reply is absent from the conversation inbox

## Use when

Use this response when a recipient says they replied to an email but the reply is not visible in the expected conversation inbox.

## Required evidence

- The affected contact and conversation
- The original send time and reply time with timezone
- The sender and recipient addresses
- The sending method and expected inbox
- The current inbox filters, view, and account context
- Minimal redacted reply metadata
- Whether the issue affects one conversation or a broader set

## Customer-facing email

**Subject:** {ticket_id}: Checking the missing email reply in your inbox

Hi {customer_first_name},

Thanks for reporting that a recipient reply is not visible in the expected conversation inbox. We will first trace the specific conversation and current inbox view before changing any connection or delivery setting.

Please reply with the affected contact, the original send time, the recipient's reply time, the timezone, the sender and recipient addresses, the sending method, and the inbox where you expected the reply. Please also include the active filters or view and minimal redacted reply metadata that confirms when and where the reply was sent.

Do not send mailbox passwords, verification codes, access tokens, full private message content, or unrestricted exports.

{agency} Support will inspect the contact conversation, message path, account context, and inbox filters. We will not reset credentials, reconnect the service, or alter a webhook unless ownership, impact, and rollback have been reviewed. I will update you after that trace is complete.

{agent_name}
{agency} Support

## Agent notes

- Begin with the exact contact conversation and current filters.
- Distinguish a missing reply from a reply hidden by account context, assignment, or filters.
- Keep private message content out of the ticket when timestamps and redacted metadata are sufficient.
- Do not request credentials or recommend reconnection as a first step.
- Escalate with the scoped trace if the reply remains absent after the read-only review.

