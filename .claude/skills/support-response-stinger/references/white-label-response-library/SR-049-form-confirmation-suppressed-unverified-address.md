# SR-049: A form confirmation is suppressed for an unverified address

## Use when

Use when a form acknowledgment or confirmation email is suppressed for an address marked unverified.

## Required evidence

- Contact and address, form and workflow, submission and execution timestamps with timezone, verification state, delivery log, exact error or suppression state, and one controlled test address.

## Customer-facing email

**Subject:** {ticket_id}: Tracing the suppressed form confirmation

Hi {customer_first_name},

I understand that the form confirmation did not reach an address marked unverified. We need to inspect one affected submission, its workflow execution, and its delivery record before changing verification or sending again.

Please send the contact identifier and redacted address, form and workflow names, submission and execution times with timezone, current verification state, delivery-log result, and exact error or suppression state. Identify one controlled test address that has consented to receive the test. Do not send mailbox credentials or a full contact export.

Please do not disable verification or resend broadly. I will compare the submission, workflow, recipient state, and delivery record, then determine whether a single controlled test is appropriate. If the evidence does not explain the suppression, I will send it to our technical team.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F3`. Remediation class `R1`. Inspect one affected contact from submission through delivery. Prior delivery and consent must be known before any controlled resend. Do not disable verification as a shortcut.
