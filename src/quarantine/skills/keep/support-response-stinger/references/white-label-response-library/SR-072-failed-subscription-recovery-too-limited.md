# SR-072: Failed-subscription recovery is too limited for the required process

## Use when

Use this response when the available failed-payment retry or notification flow does not support the business's required recovery sequence.

## Required evidence

- Billing-authorized requester, account, affected sub-accounts, and subscription reference.
- Invoice and redacted processor-event references, failure reason, and current charge state.
- Retry history and customer-notification history.
- Desired recovery sequence, timing, channels, and consent state for any proposed message.
- No full card data, security codes, bank credentials, or processor credentials.

## Customer-facing email

**Subject:** {ticket_id}: Failed-subscription recovery review

Hi {customer_first_name},

Thanks for outlining that the current failed-subscription recovery flow does not support the retry and notification sequence your team needs. Before any additional collection attempt or customer message, we must reconcile the existing charge and notification state.

Please have a billing-authorized requester send the following in one reply:

1. The account, affected sub-accounts, and subscription reference.
2. The invoice and redacted processor-event references, failure reason, and current charge state.
3. The complete retry and customer-notification history for this failure.
4. The desired recovery sequence, timing, channels, and confirmed consent state for any message.

Please do not retry the charge, create a replacement subscription, or send another recovery message while we reconcile the record. Never send full card data, security codes, bank credentials, or processor credentials.

Once I have the billing evidence and authority, I will reconcile the failed payment and notifications, then escalate the requested recovery design to our billing and implementation specialists. We have not approved a retry or confirmed that the requested sequence is supported. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- Apply the failed-charge gate before any retry or replacement subscription: check the subscription, invoice, processor event, and customer charge state.
- Confirm consent before any additional recovery message. Do not treat a proposed message sequence as approved automation.
- Do not promise payment recovery, refund, retry approval, or implementation support.
- The owner is `{agent_name}` until billing and implementation accept the reconciled packet.
