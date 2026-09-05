# SR-097: Duplicate contacts need an irreversible merge

## Use when

Use this response when duplicate contacts have been identified and the customer wants to consolidate them through a permanent merge.

## Required evidence

- Every duplicate contact ID and the number of selected records
- The proposed master record that will be retained
- Conflicting fields and the value that should survive
- Related payments, orders, invoices, and appointments
- Conversations, tasks, tags, and active workflows
- Administrator authority to approve the merge
- The business reason and expected result

## Customer-facing email

**Subject:** {ticket_id}: Approval review for the permanent contact merge

Hi {customer_first_name},

I understand that you want to consolidate duplicate contacts. A contact merge is permanent, so we will review the retained record and related activity before asking an authorized administrator to approve it.

Please reply with every duplicate contact ID, the proposed master record to retain, the conflicting fields and intended surviving values, and the number of records selected. Please also confirm whether the records contain payments, orders, invoices, appointments, conversations, tasks, tags, or active workflow activity, and identify the administrator authorized to approve the merge.

Please do not send full payment details or complete customer exports. Do not run the merge while we complete this review.

{agency} Support will review the candidates and document the proposed retained master without executing the merge. We will proceed only after administrator authority, explicit master-record confirmation, and financial, appointment, field, and workflow impact reviews are complete.

{agent_name}
{agency} Support

## Agent notes

- This response is `HOLD` until administrator authority and the proposed retained master are verified.
- State plainly that the merge is permanent.
- Review financial, appointment, field, conversation, task, tag, and workflow effects before approval.
- Do not execute the merge during evidence collection.
- Record the explicit master-record confirmation in the ticket before any authorized action.

