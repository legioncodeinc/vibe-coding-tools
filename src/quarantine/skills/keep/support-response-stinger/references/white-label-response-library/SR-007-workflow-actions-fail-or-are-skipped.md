# SR-007: Workflow actions fail or are skipped

## Use when

Use when a workflow trigger or action appears failed, skipped, or only partly completed.

## Required evidence

- Workflow name and version, affected contact or object, operation, execution time and timezone, enrollment and execution history, redacted error, correlation ID if available, and observed side effects.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing failed or skipped workflow actions

Hi {customer_first_name},

I understand that a workflow trigger or action did not produce the expected result. Before any retry, we need to determine whether each operation failed, was skipped, partly completed, or completed without the expected display.

Please send the workflow name and version, affected contact or object identifier, operation, execution time with timezone, enrollment and execution history, and the redacted error. Include a correlation ID if one is shown and describe any message, record change, charge, or external action that may already have occurred. Do not send access tokens, authorization headers, secrets, or full private payloads.

Do not replay the workflow or action. I will audit the recorded state and prior side effects first, then determine whether a fresh safe test or technical review is appropriate. We have not confirmed a current incident or that replay is safe.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-06`. Audit live side effects before using any safe test contact. Escalate redacted history and never reuse a historical disruption as the present cause.
