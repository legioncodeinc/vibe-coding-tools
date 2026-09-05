# SR-071: WhatsApp media appears in Conversations but is not delivered

## Use when

Use this response when a media message appears in the conversation view but the recipient does not receive the attachment.

## Required evidence

- Account, channel, sending-number reference, and redacted recipient reference.
- Message reference, timestamp and timezone, media type and size, delivery state, and upload result.
- Whether a text-only message succeeds.
- Result from one small, non-sensitive, supported test file when a controlled test is safe.
- A non-sensitive test-file reference only. Never request or expose a private media link.

## Customer-facing email

**Subject:** {ticket_id}: WhatsApp attachment appears sent but is not delivered

Hi {customer_first_name},

Thanks for reporting that the attachment appears in the conversation view but does not reach the recipient. We need to compare the failed media message with one text-only result and, if safe, one small non-sensitive test file.

Please send the following in one reply:

1. The account, channel, sending-number reference, and redacted recipient reference.
2. The message reference, exact timestamp and timezone, media type and size, delivery state, and displayed upload result.
3. Whether a text-only message to the same controlled recipient succeeds.
4. If no duplicate message or privacy risk exists, the result of one attempt with a small non-sensitive supported file.

Do not reuse private customer media, expose a private file link, or resend the same attachment repeatedly. If a controlled test could duplicate a customer message, skip it and tell me.

After I receive the evidence, I will preserve the failed message and escalate the comparison to our messaging specialist. We have not confirmed the cause or that the recipient endpoint is responsible. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- The external channel name is necessary here because it identifies the affected account and action.
- Stop after one controlled comparison. Check prior delivery state before any send and never use private media as test content.
- Do not claim that the media endpoint, file host, recipient, or sending account caused the failure.
- The owner is `{agent_name}` until the evidence packet is accepted by the messaging specialist.
