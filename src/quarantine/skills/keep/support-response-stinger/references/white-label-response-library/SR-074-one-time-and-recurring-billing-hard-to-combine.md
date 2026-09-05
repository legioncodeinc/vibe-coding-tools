# SR-074: One-time and recurring service billing is difficult to combine

## Use when

Use this response when the customer needs a billing design that combines setup charges, recurring services, different cadences, invoices, subscriptions, or automatic payment.

## Required evidence

- Billing-authorized requester and account.
- Each product, price, currency, tax treatment, and fee rule.
- One-time or recurring intent, cadence, start date, and cancellation behavior for each charge.
- Required customer documents, processor, and automatic-payment requirement.
- The approved business outcome and any charge grouping that must remain separate.

## Customer-facing email

**Subject:** {ticket_id}: One-time and recurring billing design review

Hi {customer_first_name},

Thanks for outlining the need to combine one-time charges with recurring services. Before anything is configured, we need an approved billing model that separates every charge by product, amount, cadence, and billing object.

Please have a billing-authorized requester send the following in one reply:

1. Each product or service, its price and currency, and whether it is one-time or recurring.
2. The cadence, start date, cancellation behavior, tax treatment, and fee rules for each recurring charge.
3. The invoice, receipt, or subscription documents the customer should receive.
4. The processor and whether automatic payment is required for each item.
5. Which charges should appear together and which must remain separate.

Please do not create live invoices, subscriptions, or payment schedules while we review the model. I will map the requested charges and escalate the design to our billing specialist for a supported configuration decision. We have not confirmed that every cadence can be combined or that automatic payment will behave as requested. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- Keep each product, amount, cadence, tax rule, and desired billing object explicit.
- Do not create live invoices or subscriptions, combine incompatible cadences, or promise automatic-payment behavior before the design is approved.
- Confirm billing authority and cancellation behavior before any live configuration.
- The owner is `{agent_name}` until the billing specialist approves or rejects the proposed model.
