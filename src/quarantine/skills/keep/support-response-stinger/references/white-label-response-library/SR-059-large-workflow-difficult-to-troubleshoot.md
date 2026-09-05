# SR-059: A large workflow is difficult to test and troubleshoot

## Use when

Use this response when a large workflow has many paths or integrations and the customer cannot isolate where one journey fails.

## Required evidence

- Workflow name, version, published state, and trigger
- One affected path and expected branch
- Fresh safe test contact and test restrictions
- Execution and enrollment history with exact redacted error
- Recent changes and integration actions on the affected path
- Prior external side effects and any replay attempts

## Customer-facing email

**Subject:** {ticket_id}: Isolating the failing path in your workflow

Hi {customer_first_name},

I understand the workflow has become difficult to test as the journey has grown. We will isolate one path before changing the live workflow so existing contacts and external actions are protected.

Please send:

1. The workflow name, version, trigger, affected path, and expected branch.
2. The enrollment and execution history for one affected contact, including the exact error with private content redacted.
3. Recent changes, integration actions on that path, and every external side effect or replay already attempted.
4. A fresh test contact that cannot charge, message a real customer, create a live appointment, or change production records.

Do not include passwords, verification codes, tokens, full payloads, or unrestricted customer exports.

{agency} will reproduce only the minimal path with the safe test contact and inspect its execution history before proposing a change. We will not replay any external action until prior side effects and duplicate risk are checked. I will update you after the isolated test is reviewed.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `DOC_COVERED` after the execution path is matched.
- Preserve the live workflow. Test one minimal path with a fresh safe contact before restructuring.
- Apply `HR-06` before replaying any workflow or integration action. Audit prior side effects and use idempotency controls when available.
- Human-review any generated repair. Escalate the minimal failing path rather than editing the entire live journey.
