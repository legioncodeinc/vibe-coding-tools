# SR-061: Dragging an opportunity triggers automation for intermediate stages

## Use when

Use this response when moving an opportunity card across several stages appears to trigger automation tied to stages the customer did not intend to select.

## Required evidence

- Contact and opportunity identifiers
- Pipeline, starting stage, intended stage, and every crossed stage
- Exact drag timestamp and timezone
- Workflow names, versions, triggers, and execution history
- Messages, records, appointments, charges, or webhooks already created
- Current opportunity stage and audit history

## Customer-facing email

**Subject:** {ticket_id}: Review of automation triggered during opportunity movement

Hi {customer_first_name},

I understand that moving the opportunity toward a later stage appears to have triggered automation for intermediate stages. To prevent more messages or record changes, please leave the card at its current stage and do not replay any workflow or send a corrective message yet.

Please send:

1. The contact and opportunity identifiers, pipeline, starting stage, intended stage, and every stage crossed.
2. The drag timestamp and timezone, plus the current stage and audit history.
3. The names and versions of every related workflow and their execution history.
4. A list of messages, records, appointments, charges, or webhooks already created.

Redact private message content. Do not include passwords, verification codes, tokens, full payloads, or unrestricted customer exports.

{agency} will reconstruct the stage and workflow timeline and identify every existing side effect before any controlled correction is considered. I will update you after that audit is complete.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `DOC_COVERED` for trigger and execution-history review.
- Apply `HR-07` and `HR-06`. Freeze further movement and audit the existing opportunity, workflow history, and every external side effect.
- Do not move the card back, recreate the opportunity, replay workflows, or send corrective messages until recipients and effects are known.
- Permit only one controlled correction after the target record, duplicate risk, and rollback are established.
