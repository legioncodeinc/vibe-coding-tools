# SR-055: A dynamic image or MMS attachment does not render correctly

## Use when

Use this response when a dynamic image value appears as text, an MMS attachment is missing, or the recipient sees different media rendering than the sender expects.

## Required evidence

- Sending and recipient numbers, channel, message identifier, and timestamp
- Recipient device and carrier
- Media type and file size
- Dynamic field value with private paths and customer data redacted
- Sender-side and recipient-side rendering results
- Exact error, prior delivery state, consent state, and prior retries

## Customer-facing email

**Subject:** {ticket_id}: Image or MMS rendering needs a controlled comparison

Hi {customer_first_name},

I understand the image or attachment is not rendering as expected for the recipient. We first need to separate a dynamic-field problem from an attachment or device-rendering problem, without sending repeated messages to live contacts.

Please do not resend the original message yet. Send us:

1. The message identifier, timestamp, channel, sending and recipient numbers, device, and carrier.
2. The media type and size, plus the dynamic field value with private paths and customer details redacted.
3. What appeared for the sender and recipient, the exact error if any, and every prior retry result.
4. The recipient's current consent state.

Do not include passwords, verification codes, tokens, private media addresses, or a full conversation export.

{agency} will check prior delivery and consent first. If those checks permit a retest, we will compare one supported static attachment of known size with the dynamic-value path using one controlled recipient. I will update you after that comparison is reviewed.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `DOC_COVERED` once the channel and attachment conditions are matched.
- Apply `HR-08` before any resend. Verify exact error, prior delivery, consent, and the single controlled recipient.
- Do not request private media addresses or repeatedly message real contacts.
- Escalate when a supported static attachment also fails under controlled conditions.
