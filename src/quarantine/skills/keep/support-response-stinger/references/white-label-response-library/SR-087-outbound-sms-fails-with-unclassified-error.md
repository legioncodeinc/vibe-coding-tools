# SR-087: An outbound SMS fails with an unclassified error

## Use when

Use this response when an outbound SMS fails with an error that has not yet been classified to the application, provider, or carrier layer.

## Required evidence

- The affected account, sending number, and recipient reference
- The message ID and timestamp with timezone
- The exact redacted error
- Whether the send came from a conversation or workflow
- The consent and A2P registration state at send time
- Prior retry attempts and current delivery state
- Whether one recipient or a broader set is affected

## Customer-facing email

**Subject:** {ticket_id}: Information needed for the failed SMS

Hi {customer_first_name},

I understand that an outbound SMS failed with an error that has not yet been classified. We have not confirmed a service-wide issue, and we need one complete example before any resend is considered.

Please reply with the affected account, sending number, recipient reference, message ID, send time and timezone, the exact redacted error, and whether the send came from a conversation or workflow. Please also confirm the recipient's consent state, the A2P registration state, any prior retry, and whether the issue affects other recipients.

Do not send message content that is not needed for diagnosis. Please do not resend the message yet.

{agency} Support will inspect the matching conversation, contact timeline, workflow or delivery record, and classify the failing layer. A single controlled retest will be considered only after the displayed cause is addressed, prior delivery is checked, and consent is verified. I will update you after the classification is complete.

{agent_name}
{agency} Support

## Agent notes

- Do not call an unclassified error an outage.
- Check prior delivery state and every earlier retry before approving another send.
- Consent and registration must be valid before a controlled retest.
- Use only one controlled recipient after the cause is addressed.
- Escalate the message ID, timestamps, redacted error, and layer findings if classification remains inconclusive.

