# SR-020: Opportunities are not created or moved

## Use when

Use when an expected opportunity was not created or did not move to the intended stage.

## Required evidence

- Contact identifier, existing opportunities, intended pipeline and stage, workflow and execution time, contact timeline, stage-movement setting, and audit history.

## Customer-facing email

**Subject:** {ticket_id}: Tracing the missing opportunity action

Hi {customer_first_name},

I understand that an opportunity was not created or did not move to the intended stage. We first need to locate any existing opportunity and inspect the workflow and audit history so a corrective action does not create a duplicate or trigger automation twice.

Please send the contact identifier, all existing opportunities you can see for that contact, the intended pipeline and stage, workflow name, execution time with timezone, relevant contact timeline entry, stage-movement setting, and audit history. Redact unrelated customer content.

Please do not create another opportunity or move records in bulk. I will compare the existing record, workflow result, and audit history. A single controlled action may be considered only after the existing opportunity is found or ruled out and prior side effects are known.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-07`. Check the contact, all opportunities, target pipeline and stage, and automation history. Limit any later test to one controlled record.
