# SR-075: Mercado Pago renewals fail after the first payment succeeds

## Use when

Use this response when an initial Mercado Pago payment succeeds but a later recurring renewal fails or remains unresolved for a customer in the affected regional payment flow.

## Required evidence

- Billing-authorized requester, account, country, currency, and processor.
- Customer, subscription, initial-invoice, and renewal-invoice references.
- Initial and renewal processor-event references and timestamps.
- Redacted decline state, manual-payment state, and current customer charge state.
- Current access or provisioning effect. Never request payment credentials or full card data.

## Customer-facing email

**Subject:** {ticket_id}: Mercado Pago renewal failed after the first payment

Hi {customer_first_name},

Thanks for reporting that the first Mercado Pago payment succeeded but the renewal did not complete. Before any retry or replacement subscription, we need to reconcile the initial payment, renewal invoice, processor event, subscription state, and customer access.

Please have a billing-authorized requester send the following in one reply:

1. The account, country, currency, customer reference, and subscription reference.
2. The initial and renewal invoice references, processor-event references, and timestamps.
3. The redacted decline state, any manual-payment state, and the current customer charge state.
4. Whether access or provisioning changed after the renewal attempt.

Please do not retry the charge, create a replacement subscription, or assume a manual payment will repair future renewals. Do not send full card data, security codes, bank credentials, or processor credentials.

I will reconcile the complete payment and access state, then escalate it to our billing integration specialist. We have not confirmed the renewal cause, retry safety, or restoration path. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- The named processor is necessary because it identifies the affected external payment account.
- Apply the failed-charge gate: check the subscription, invoices, processor events, and customer charge state before any retry or replacement.
- A manual payment is evidence to reconcile, not proof that the recurring state has recovered.
- The owner is `{agent_name}` until the billing integration specialist accepts the reconciled packet.
