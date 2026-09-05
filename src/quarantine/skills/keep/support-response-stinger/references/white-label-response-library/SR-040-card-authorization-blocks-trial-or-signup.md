# SR-040: Card authorization blocks a trial or signup

## Use when

Use when a payment-card authorization prevents a customer from starting a trial or completing signup.

## Required evidence

- Billing-authorized requester, signup surface, country and currency, card type and last four digits only when policy permits, timestamp and timezone, redacted error, processor event, mode, and current charge state.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the blocked card authorization

Hi {customer_first_name},

I understand that card authorization is blocking the trial or signup. Before another attempt, we need to verify the exact signup surface, country, currency, processing mode, and whether an authorization or charge already exists.

Please have a billing-authorized user send the signup surface, country, currency, card type, timestamp with timezone, redacted error, processor event identifier if available, and current charge state. Include only the last four card digits if {agency} policy permits. Never send a full card number, security code, bank credentials, or processor password.

Please do not retry until we rule out an existing authorization or charge. I will reconcile the current state and route unexplained regional or processor authorization to our billing team. This message does not promise approval, a refund, or that the next attempt will succeed.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `R1`. Apply `HR-05`. Verify billing authority, mode, regional support, processor event, and charge state before retry. Do not request sensitive payment data or promise authorization.
