# SR-036: Native attribution is blank on a custom site

## Use when

Use when attribution fields remain blank after a submission from a custom, embedded, external, or single-page site.

## Required evidence

- Live page address, page type, form or API path, contact identifier, submission timestamp and timezone, UTM values, expected and actual stored fields, analytics method, and a safe test contact.

## Customer-facing email

**Subject:** {ticket_id}: Tracing missing attribution data

Hi {customer_first_name},

I understand that attribution is blank for submissions from your custom or external site. We need to trace one controlled submission from the browser address through the form or API operation to the resulting contact fields.

Please send the live page address, page type, form or API path, affected contact identifier, submission time with timezone, UTM values present at submission, expected attribution fields, actual stored fields, and the analytics method in use. Identify a safe test contact that cannot trigger live charges or customer-facing automation. Do not send access tokens or full private payloads.

Please do not rewrite production tracking or replay live automation. After the side effects are ruled out, {agency} can perform one controlled trace. If the fields remain blank, I will send the minimal reproduction to our technical team.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `R1`. Complete one side-effect-free trace before changing production tracking. Escalate unsupported external or single-page behavior with a redacted minimal reproduction.
