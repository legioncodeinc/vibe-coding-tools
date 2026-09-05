# SR-045: An external CRM connection or migration misses data

## Use when

Use when an external CRM connection will not remain connected or migrated records appear missing.

## Required evidence

- Source and target workspaces, integration path, operation, affected object types and identifiers, migration window, mapping, record counts, disconnect time, redacted error, prior retries, and observed side effects.

## Customer-facing email

**Subject:** {ticket_id}: Reconciling the external CRM connection or migration

Hi {customer_first_name},

I understand that the external CRM connection will not stay connected or that expected records are missing after migration. To prevent duplicates or further gaps, we need to pause replay and compare a small source-to-target sample with the connection history.

Please send the source and target workspaces, integration path, operation, affected object types and identifiers, migration window, field mapping, source and target record counts, disconnect time with timezone, redacted error, prior retry history, and any observed side effects. Do not send credentials, tokens, full exports, or unrestricted payloads.

Please do not reconnect, remigrate, port numbers, or replay the operation. After I receive the evidence, I will route it to the implementation owner for reconciliation. We cannot promise complete parity or a recovery method before that review.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `UNRESOLVED`. Apply `HR-06`. Freeze replay, compare a minimal record sample, and escalate. Do not reconnect, remigrate, port numbers, or promise data parity.
