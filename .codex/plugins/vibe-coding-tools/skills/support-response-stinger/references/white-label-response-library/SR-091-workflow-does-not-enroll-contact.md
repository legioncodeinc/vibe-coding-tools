# SR-091: A workflow does not enroll an eligible contact

## Use when

Use this response when a contact appears eligible for a workflow but has no expected enrollment or first action.

## Required evidence

- The workflow name, version, and published state
- The affected contact
- The trigger event and time with timezone
- Relevant field values at trigger time
- Every trigger filter and the re-entry setting
- Enrollment history and the expected first action
- Known prior execution or external side effects

## Customer-facing email

**Subject:** {ticket_id}: Checking why the contact did not enter the workflow

Hi {customer_first_name},

I understand that an eligible contact did not enter the expected workflow. We will first compare the published version and enrollment history with the contact's values at the exact trigger time.

Please reply with the workflow name and version, its published state, the affected contact, the trigger event and time with timezone, the relevant field values at that time, every active trigger filter, the re-entry setting, and the expected first action. Please also note whether anyone manually enrolled the contact or whether any part of the workflow already ran.

Please do not manually enroll the contact, republish the workflow, or loosen production filters while we review the record.

{agency} Support will inspect publication and enrollment history, then compare one fresh safe test contact with every trigger filter when that test cannot message, charge, or change a real customer record. Any replay will wait until prior execution and side effects are ruled out. I will update you after the comparison is complete.

{agent_name}
{agency} Support

## Agent notes

- Capture values as they existed at trigger time, not only their current values.
- Confirm the workflow version and published state before testing.
- The safe test contact must not trigger external messages, charges, appointments, or irreversible writes.
- Do not manually enroll, republish, loosen filters, or replay until prior effects are checked.
- Escalate with enrollment history, trigger evidence, and the controlled comparison if the contact still does not enroll.

