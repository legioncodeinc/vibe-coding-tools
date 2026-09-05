# SR-062: Assigning a contact owner changes the AI conversation sender number

## Use when

Use this response when an established AI conversation appears to switch from its original sender number after the contact owner changes.

## Required evidence

- Account, contact, AI agent, and workflow identifiers
- Owner before and after the change
- Assignment timestamp and timezone
- Expected and actual sender numbers
- Redacted conversation history around the change
- Current routing configuration and message timestamps

## Customer-facing email

**Subject:** {ticket_id}: Sender number changed after contact ownership update

Hi {customer_first_name},

I understand the conversation began from one sender number and appeared to switch after the contact owner changed. We have not confirmed the cause or the supported sender-selection behavior, so we will preserve the current routing and message history while we trace the event.

Please do not reassign the owner, rotate a number, or replay a message as a test. Send us:

1. The account, contact, AI agent, and workflow identifiers.
2. The owner before and after assignment, with the assignment timestamp and timezone.
3. The expected and actual sender numbers and the related message timestamps.
4. The current routing configuration and only the minimal redacted conversation segment needed to show the change.

Do not include passwords, verification codes, tokens, or a full private transcript.

{agency} will trace the sender state before and after the owner-assignment event and escalate the evidence to our technical team. We will not change routing or send another message while this behavior remains unresolved. I will update you after the technical review.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `UNRESOLVED`.
- Preserve routing, sender numbers, contact ownership, and conversation history while tracing the assignment event.
- Stop after minimal redacted evidence collection and escalate to the technical team.
- Do not reassign owners, rotate numbers, or replay messages as a diagnostic.
