# SR-025: An AI agent does not answer prompts

## Use when

Use when an AI agent receives a prompt but does not return the expected response.

## Required evidence

- Agent identifier, channel, contact, timestamp and timezone, preserved configuration and prompt, one controlled prompt result, and a minimal redacted transcript segment.

## Customer-facing email

**Subject:** {ticket_id}: Checking an AI agent that does not respond

Hi {customer_first_name},

I understand that the AI agent is not answering prompts. Please preserve its current configuration and prompt before testing so we can investigate the existing object without losing evidence.

Please send the agent identifier, channel, affected contact, and time of the latest attempt with timezone. Include the preserved configuration summary, the exact test prompt with private content removed, the result of one controlled prompt that contains no customer data, and only the smallest redacted transcript segment needed to show the failure.

Please do not delete or recreate the agent. If the controlled prompt still receives no response, I will send the preserved evidence to our technical team. We have not confirmed a current incident, a defect, or a cause.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Apply `HR-13`. Preserve the agent and use only one non-sensitive controlled prompt. Stop after reproduction and escalate without guessing.
