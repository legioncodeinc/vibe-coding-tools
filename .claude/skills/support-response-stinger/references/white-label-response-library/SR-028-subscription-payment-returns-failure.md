# SR-028: Subscription payment returns a failure

## Use when

Use when a subscription payment fails or returns an uncertain billing result.

## Required evidence

- Billing-authorized requester, workspace, customer, subscription and invoice identifiers, amount and currency, processor event, test or live mode, timestamp and timezone, and current charge state.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the failed subscription payment

Hi {customer_first_name},

I understand that the subscription payment returned a failure. Before any retry or replacement subscription is created, we need to reconcile the invoice, subscription, processor event, and actual charge state to prevent duplicate billing.

Please have a billing-authorized user send the workspace, customer, subscription and invoice identifiers, amount and currency, processor event identifier if available, test or live mode, timestamp with timezone, and the current charge state. Do not send a full card number, security code, bank credentials, or processor password.

Please do not retry the charge or create a replacement subscription. I will compare the existing billing records first and route any unresolved result to the authorized billing team. This message does not confirm a refund, approval, or successful retry.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-05`. Verify billing authority and reconcile every original record before a retry or replacement. Never request full payment credentials or promise a refund.
