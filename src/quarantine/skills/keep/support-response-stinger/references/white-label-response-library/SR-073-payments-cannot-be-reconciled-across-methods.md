# SR-073: Payments cannot be reconciled across cash, Venmo, or partial amounts

## Use when

Use this response when off-platform, cash, Venmo, or partial payments do not match the expected invoice or accounting balance.

## Required evidence

- Billing-authorized requester, account, customer reference, invoice, and expected payment schedule.
- Processor and external-payment references, amounts, currency, and payment dates.
- Current invoice balance and accounting balance.
- Transaction-by-transaction accounting record and the required reconciliation outcome.
- Redacted references only. Do not request full statements, bank credentials, or full payment-card data.

## Customer-facing email

**Subject:** {ticket_id}: Payment reconciliation across methods

Hi {customer_first_name},

Thanks for reporting that the invoice balance does not reconcile with cash, Venmo, or partial payments recorded elsewhere. We need to compare the transactions line by line while leaving both records unchanged.

Please have a billing-authorized requester send one consolidated reconciliation set:

1. The account, customer reference, invoice reference, and expected payment schedule.
2. Each payment date, amount, currency, method, and redacted processor or external-payment reference.
3. The current invoice balance and the current accounting balance.
4. The required outcome, including which record should represent each settled payment.

Please do not create, delete, or alter payments while we compare the records. Redact unrelated transactions, and do not send bank credentials, full statements, or full payment-card data.

I will build a transaction-by-transaction reconciliation table and escalate the mismatch to our billing and accounting integration specialists. We have not confirmed that automatic matching is available or that either balance should be changed. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- Preserve the payment and accounting records. Reconcile each transaction before proposing any adjustment.
- Do not fabricate payments, change settled amounts, delete records, or promise automatic matching.
- Confirm billing authority before discussing a balance-changing action.
- The owner is `{agent_name}` until billing and accounting integration owners accept the reconciliation packet.
