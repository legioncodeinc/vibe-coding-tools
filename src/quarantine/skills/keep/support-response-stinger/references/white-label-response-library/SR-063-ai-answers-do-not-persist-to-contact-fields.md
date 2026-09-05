# SR-063: AI-collected answers do not persist to contact fields

## Use when

Use this response when an AI conversation appears to collect information but one or more expected contact fields remain empty or contain a different value.

## Required evidence

- Account, AI agent, contact, channel, and timestamp
- Field names, types, and current definitions
- Minimal redacted transcript excerpts showing the collected values
- Expected field mapping and actual stored values
- Related workflow and execution history
- Owner changes and one safe controlled-test plan

## Customer-facing email

**Subject:** {ticket_id}: Review of AI answers missing from contact fields

Hi {customer_first_name},

I understand the conversation collected answers that did not all appear in the expected contact fields. We have not confirmed where the values stopped, so we will preserve the current transcript, field definitions, and mapping before testing.

Please send:

1. The account, AI agent, contact, channel, and affected timestamp.
2. The field names, types, expected mapping, and actual stored values.
3. Only the minimal redacted transcript lines that show the collected values.
4. The related workflow history, any owner change, and a safe test contact that contains no private customer information.

Do not send a full transcript, passwords, verification codes, tokens, or unrestricted customer exports. Please do not overwrite the live fields while we compare the evidence.

{agency} will run one minimal controlled conversation, compare its resulting fields, and then escalate the preserved evidence to our technical team. We will not guess at a mapping fix while the behavior remains unresolved. I will update you after the controlled comparison and escalation review.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `UNRESOLVED`.
- Preserve the transcript, configuration, field definitions, mapping, and current stored values.
- Use one minimal controlled conversation without private customer data, then stop and escalate.
- Never request a full private transcript or overwrite live fields to force a result.
