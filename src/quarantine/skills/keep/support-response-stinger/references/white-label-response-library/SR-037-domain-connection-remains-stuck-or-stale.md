# SR-037: A domain connection remains stuck or stale

## Use when

Use when a domain connection shows no selectable asset, a persistent conflict, or stale deleted-domain state.

## Required evidence

- Workspace, exact hostname, intended asset and service, authoritative DNS provider, current relevant records and proxy state, assignment, propagation result, and screenshot of the stale state.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the stuck domain connection

Hi {customer_first_name},

I understand that the domain connection remains stuck or shows stale information. Before proposing any change, we need to confirm the active workspace, intended asset, exact hostname, assignment, and current authoritative DNS records.

Please send the workspace, exact hostname, intended asset and service, authoritative DNS provider, current relevant A, AAAA, CNAME, MX, and proxy states, domain assignment, propagation result, and a screenshot of the stale state. Include only the record names and values needed for review. Do not send DNS-provider credentials.

Please do not delete or change DNS records, domains, sites, or funnels. I will compare the authoritative records with the intended assignment. If they match and the stale state remains, I will send the evidence to our technical team. Any later change requires the authorized domain owner, impact review, an exact record, and a rollback plan.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `R1`. Apply `HR-01` and `HR-13`. Never give generic record-deletion advice. Escalate only after exact hostname, authoritative records, intended assignment, and preserved object state are confirmed.
