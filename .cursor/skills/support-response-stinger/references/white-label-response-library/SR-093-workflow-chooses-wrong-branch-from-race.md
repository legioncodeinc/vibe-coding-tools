# SR-093: A workflow chooses the wrong branch because values race

## Use when

Use this response when a workflow evaluates a condition before an expected value update and the contact follows a different branch than intended.

## Required evidence

- The workflow name, version, and affected contact
- The condition values at evaluation time
- Ordered timestamps for the update, condition, and branch actions
- Relevant action outputs
- The expected branch and actual branch
- Wait configuration and recent workflow changes
- Any external actions or side effects from the run

## Customer-facing email

**Subject:** {ticket_id}: Tracing the workflow branch evaluation order

Hi {customer_first_name},

I understand that the workflow followed a different branch than expected. We need to reconstruct the action order and identify which value existed when the condition was evaluated before changing the live workflow.

Please reply with the workflow name and version, affected contact, expected and actual branches, condition values at evaluation time, ordered timestamps for the value update and branch evaluation, relevant action outputs, wait configuration, and any recent changes. Please also identify any messages, records, charges, appointments, or external actions already produced by that run.

Please preserve the live version and do not reorder actions or replay the contact yet.

{agency} Support will reconstruct the sequence for one safe test contact and determine which value the condition evaluated. Any proposed reordering will be tested in a safe copy after enrolled-contact impact and prior side effects are reviewed. We will not replay an external action without duplicate protection and a rollback plan.

{agent_name}
{agency} Support

## Agent notes

- Preserve the live workflow and execution history.
- Use timestamps and action outputs to identify the value that existed at evaluation time.
- Test a change only in a safe copy with no uncontrolled external effects.
- Review enrolled-contact impact before changing order or waits.
- Any replay requires original-state, side-effect, affected-record, and idempotency review.

