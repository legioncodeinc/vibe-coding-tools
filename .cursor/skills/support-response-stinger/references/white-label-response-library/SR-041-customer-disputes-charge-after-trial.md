# SR-041: A customer disputes a charge after a trial

## Use when

Use when a customer believes a trial charge was early, unexpected, or otherwise incorrect.

## Required evidence

- Verified billing authority, workspace, subscription and invoice identifiers, trial start and expected end, amount and currency, timestamp and timezone, processor event, current access state, and requested outcome.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the disputed trial charge

Hi {customer_first_name},

I understand that you are disputing a charge associated with the trial. I will preserve the billing timeline and have the authorized billing owner review it before any charge, subscription, or access state is changed.

Please have a billing-authorized user send the workspace, subscription and invoice identifiers, trial start date, expected trial end date, charge amount and currency, timestamp with timezone, processor event identifier if available, current access state, and the exact outcome requested. Do not send full card data, security codes, bank credentials, or processor passwords.

Please do not retry the charge, cancel or recreate the subscription, or restore access manually. After the billing record is reconciled, I will confirm the authorized next action. This message does not approve a refund, trial restoration, or a decision deadline.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `UNRESOLVED`. Stop after preserving the complete billing timeline and escalate to the authorized billing owner. No retry, refund, cancellation, restoration, or deadline claim without authority and evidence.
