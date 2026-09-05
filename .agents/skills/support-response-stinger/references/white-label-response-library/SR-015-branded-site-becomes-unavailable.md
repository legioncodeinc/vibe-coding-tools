# SR-015: A branded site becomes unavailable

## Use when

Use when a customer-facing branded site no longer opens at its expected address.

## Required evidence

- Exact hostname and page address, workspace, timestamp and timezone, screenshot or redacted error, current DNS records, domain assignment, and a repeat result for the same address.

## Customer-facing email

**Subject:** {ticket_id}: Checking your unavailable branded site

Hi {customer_first_name},

I understand that your branded site is unavailable, which may prevent visitors from reaching your business. We need to verify the current site state and exact hostname before any configuration is changed.

Please reply with the exact hostname and page address, workspace, time of the latest failure with timezone, and a screenshot or redacted error. If you have authorized access to the DNS panel, provide a screenshot or text copy of the current relevant records and the site's current domain assignment. Do not send registrar credentials.

Please do not change DNS, SSL, domain assignment, or site content. I will verify current internal service state and retest the same address first. Any later DNS change requires the authorized domain owner, an exact reviewed record, an impact check, and a rollback record.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-01` and `HR-13`. Historical similarity is not a current diagnosis. Preserve the site and require full DNS authority and rollback gates before a record change.
