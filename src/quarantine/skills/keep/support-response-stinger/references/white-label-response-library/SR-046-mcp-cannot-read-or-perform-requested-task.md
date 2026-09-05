# SR-046: MCP cannot read or perform the requested task

## Use when

Use when an MCP tool cannot read the required configuration object or perform the requested supported action.

## Required evidence

- Requested operation, tool and channel, object type and identifiers if known, expected capability, actual tool list or redacted error, timestamp and timezone, and the minimum field set needed.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the unavailable MCP task

Hi {customer_first_name},

I understand that the MCP tool cannot read or perform the configuration task you requested. We need to record the exact missing read or action and confirm which supported tools are exposed before considering another approach.

Please send the requested operation, tool and channel, object type and identifiers if known, expected capability, actual tool list or redacted error, timestamp with timezone, and only the minimum fields required for the task. Do not send tokens, authorization headers, secrets, credentials, or full private payloads.

Please do not use undocumented endpoints or broaden the data request. After I receive the minimal evidence, I will route the capability boundary to our integration specialist. We have not confirmed that the requested capability exists.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `UNRESOLVED`. Stop after identifying the exact missing operation and supported exposed tools, then escalate. Do not use undocumented endpoints or retrieve more data than needed.
