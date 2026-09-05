# SR-053: A contact remains blocked after sending STOP

## Use when

Use this response when a contact previously opted out by sending STOP and outbound messages remain blocked after a customer believes the contact opted back in.

## Required evidence

- Contact record and the sending and recipient numbers
- STOP event timestamp, timezone, and channel
- Current messaging error and current do-not-disturb state
- Any later customer-initiated consent event, including keyword and timestamp
- Proposed confirmation message and applicable jurisdiction
- Prior retry attempts and their delivery state

## Customer-facing email

**Subject:** {ticket_id}: Consent state review for the blocked contact

Hi {customer_first_name},

I understand this contact remains blocked after an earlier STOP request. A contact field change alone does not prove that the messaging consent state has been restored, so we will preserve both the messaging and account records while we review the sequence.

Please do not clear consent fields or send another test message. Send us:

1. The contact record, sending and recipient numbers, and the STOP timestamp and timezone.
2. The exact current error and the do-not-disturb state shown in the account.
3. Any later contact-initiated consent event, including its channel, keyword, and timestamp.
4. The proposed confirmation language, jurisdiction, and any retry already attempted.

Redact unrelated conversation content. Do not send passwords, verification codes, tokens, or a full conversation export.

{agency} will match the opt-out and any later customer-initiated event before deciding whether one controlled retest is allowed. If the consent state or legal authority remains unclear, our compliance authority will review the case. I will update you after that review.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `DOC_COVERED`, subject to jurisdiction and case evidence.
- Preserve the carrier and account consent states. Identify the exact opt-out and any customer-initiated re-consent event.
- Never override a carrier block, clear consent fields to force delivery, or send a promotional confirmation without verified authority.
- Before any retest, resolve the displayed cause, verify consent, check prior delivery, and select one controlled recipient.
- Escalate legal or compliance uncertainty and keep the case on hold until resolved.
