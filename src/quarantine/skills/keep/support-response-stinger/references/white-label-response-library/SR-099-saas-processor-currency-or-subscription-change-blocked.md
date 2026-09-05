# SR-099: A SaaS account, processor, currency, or subscription change is blocked

## Use when

Use this response when a billing-authorized customer cannot disconnect a processor, transfer an account, change currency, move or upgrade a subscription, change an interval, pause service, or disable service.

## Required evidence

- Verified billing authority
- The affected account and customer
- Non-sensitive processor, subscription, and invoice identifiers
- Current plan, plan version, billing interval, and currency
- Wallet balance and active services or subscriptions
- Source and target accounts when a move is requested
- Exact requested outcome and effective date
- The current redacted error and payment state

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the blocked billing or subscription change

Hi {customer_first_name},

I understand that the requested account, processor, currency, or subscription change is blocked. Because this action can interrupt billing or access, we need to verify authority and all current dependencies before making or approving a change.

Please reply with the billing-authorized contact, affected account and customer, non-sensitive processor, subscription, and invoice identifiers, current plan and interval, currency, wallet balance, active services, requested outcome, effective date, and exact redacted error. If this is a move, include the source and target accounts.

Do not send full card details, security codes, bank credentials, processor passwords, or access tokens.

{agency} Support will inventory balances, subscriptions, processor dependencies, account access, and the exact requested change. Disabling the service cancels the subscription and permanently deletes the related wallet. We will not proceed without verified billing authority, an impact review, explicit confirmation, and a recovery plan, and we will not imply that a refund is automatic.

{agent_name}
{agency} Support

## Agent notes

- Keep the response `HOLD` until billing authority is verified.
- Inventory balances, active subscriptions, processor dependencies, and account access before discussing execution.
- State irreversible effects before requesting explicit confirmation.
- Do not promise an unsupported interval conversion, approval, or refund.
- Record the impact review, confirmation, and recovery plan before any authorized change.

