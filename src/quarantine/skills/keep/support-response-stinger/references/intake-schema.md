# Support response intake schema

Complete this intake before drafting a send-ready support email. Use `UNKNOWN` rather than guessing.

## Required case fields

| Field | Required value |
|---|---|
| Agency | `{agency}` public provider name exactly as the customer knows it |
| Sender | `{agent_name}`, role, and approved reply address |
| Customer | `{customer_first_name}` or a neutral greeting |
| Ticket | `{ticket_id}` and original subject |
| Lifecycle state | `ACKNOWLEDGED`, `TRIAGED`, `NEEDS_INFO`, `INVESTIGATING`, `INCIDENT_CONFIRMED`, `WORKAROUND`, `ESCALATED`, `RESOLUTION_PROPOSED`, `RESOLVED`, `FOLLOW_UP`, or `REOPENED` |
| Evidence state | `ACCOUNT_VERIFIED`, `INCIDENT_CONFIRMED`, `DOC_COVERED`, `COMMUNITY_REPORTED`, or `UNRESOLVED` |
| Customer symptom | One factual sentence using the customer's observable result |
| Business impact | What the customer cannot do, who is affected, and whether it is ongoing |
| Scope | Account or workspace, feature, object, user count, and record count when known |
| Time | First observed time, most recent occurrence, and timezone |
| Known facts | Facts proved by the ticket, internal logs, or a controlled reproduction |
| Unknowns | Missing evidence that could change the next action |
| Owner | Customer, `{agent_name}`, `{agency}` technical team, billing authority, security authority, or implementation specialist |
| Next action | One concrete action and its expected result |
| Next update | Real date and time, or `NOT_COMMITTED` |
| Authority | Who may approve billing, security, DNS, irreversible, or cross-account actions |
| Links | Agency-owned links only, or `NONE` |

## Product-specific evidence

Load the matching row from `research/distilled-support-response.md` section 8 and request only the missing evidence. Common evidence classes include:

- Messaging: sender, recipient, timestamp, channel, error code, consent state, registration state, and one controlled retest plan.
- Email: representative recipient, timestamp, sending method, sending domain, delivery or bounce evidence, authentication results, list source, volume, and recent changes.
- Calendar: public link, calendar, assigned user, affected date, timezone, diagnostic reason, integration status, and external conflict.
- Workflow: name and version, contact, trigger event, execution time, enrollment history, exact error, re-entry setting, and expected action.
- Website or form: active account, asset, live URL, saved and published versions, hostname, assignment, path, clean-browser result, and safe test.
- Phone: user, contact or number, direction, timestamp, app and version, network, permissions, routing target, and redacted call identifier.
- Billing: billing authority, account, invoice or subscription, amount, currency, product surface, processor event, mode, charge state, and requested outcome.
- API or integration: endpoint and version, authentication method name, operation, timestamp, request or correlation ID, redacted error, event ID, response code, prior side effects, and affected object IDs.

## Never request by email

- Passwords, one-time codes, recovery codes, or authentication challenges
- API keys, private tokens, OAuth client secrets, authorization headers, webhook secrets, or signatures
- Full payment-card data, security codes, bank credentials, or processor passwords
- Unredacted identity documents
- Another person's magic link
- Malicious attachments or unrestricted private transcripts
- Full customer datasets, contact exports, tool payloads, or unredacted request bodies
- DNS-provider credentials or broad administrative access

Use an agency-approved secure upload path when formal documents are required. Do not invent that path.

## Readiness states

- `READY`: identity, lifecycle state, symptom, evidence state, owner, next action, and required authority are known. The email can be send-ready after QA.
- `DRAFT_WITH_GAPS`: a useful draft can be prepared, but placeholders or unsupported commitments remain. Label it clearly and list every gap.
- `HOLD`: the sender identity, recipient, permission, security boundary, payment authority, irreversible-action approval, or minimum diagnostic evidence is missing. Return the missing items and do not produce send-ready copy.

## Minimum-output rule

The completed response should repeat only the evidence needed for the customer to understand the case and act. Keep internal source names, raw logs, security details, private identifiers, and speculative causes out of the message.
