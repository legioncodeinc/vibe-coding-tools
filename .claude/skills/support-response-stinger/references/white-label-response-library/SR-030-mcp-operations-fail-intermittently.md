# SR-030: MCP operations fail intermittently

## Use when

Use when an MCP operation returns an error or uncertain result intermittently.

## Required evidence

- Operation name, timestamp and timezone, request or correlation identifier, redacted error, affected object identifiers, and every known prior side effect.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing an intermittent MCP operation failure

Hi {customer_first_name},

I understand that an MCP operation fails intermittently. Before it is replayed, we need to determine whether the failed request still completed or changed data.

Please send the operation name, timestamp with timezone, request or correlation identifier, redacted error, affected object identifiers, and a description of any record, message, charge, or external action that may already have occurred. Do not send credentials, tokens, authorization headers, secrets, or full private payloads.

Please do not replay the operation. I will review the original state and known side effects, then send the minimal redacted record to our technical team. We have not confirmed a current incident, and another attempt is not safe until idempotency and prior effects are known.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Apply `HR-06`. Stop after minimal redacted evidence collection and escalate. Replay is prohibited until completion state, side effects, affected records, and idempotency control are known.
