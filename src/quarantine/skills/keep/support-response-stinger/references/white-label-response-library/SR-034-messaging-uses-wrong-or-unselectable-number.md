# SR-034: Messaging uses the wrong or unselectable number

## Use when

Use when a message uses an unexpected sender number or the customer cannot choose among available numbers.

## Required evidence

- Workspace, contact, channel, inbox or workflow source, expected and actual sender numbers, number capabilities, owner assignment, conversation history, timestamp and timezone, and prior delivery state.

## Customer-facing email

**Subject:** {ticket_id}: Tracing the unexpected sender number

Hi {customer_first_name},

I understand that messaging used an unexpected number or did not let you select the intended one. We need to trace one message from its inbox or workflow source to the actual sender without changing routing.

Please send the workspace, contact identifier, channel, inbox or workflow source, expected and actual sender numbers, each number's known capabilities, owner assignment, relevant conversation history, and timestamp with timezone. Also confirm whether the original message was delivered. Redact message content that is not required for the trace.

Please do not rotate numbers, change routing, or replay the message. I will trace the recorded sender selection and send any unexplained result to our technical team. A later retry requires verified consent and confirmed prior delivery state.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `R2`. Trace before changing. Escalate behavior not explained by documented sender selection. No number rotation or replay until consent and prior delivery are known.
