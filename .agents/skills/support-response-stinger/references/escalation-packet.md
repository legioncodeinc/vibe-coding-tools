# Escalation packet

Use this packet when a case requires another `{agency}` team, a third-party owner, or a specialist. Include only fields relevant to the issue.

## Core packet

- `{ticket_id}`
- `{agency}` account or workspace identifier
- Affected feature and object identifiers
- Customer-observable symptom
- Business impact and affected scope
- First observed and most recent occurrence, with timezone
- Reproduction steps
- Expected result
- Observed result
- Exact redacted error or reason code
- Safe screenshot or smallest redacted sample
- Browser, app, device, network, or provider context when relevant
- Recent configuration or content changes
- Diagnostic steps already completed and their results
- Prior actions and possible side effects
- Current evidence state
- Requested specialist decision or action
- Real next-update commitment, if one exists

## Issue-specific additions

| Family | Add to packet |
|---|---|
| Platform access | Exact page or app, version, clean-browser comparison, another-network comparison, and current incident match |
| Email | Representative recipient, sending method, sending domain, delivery or bounce evidence, authentication status, list source, volume, and content or link sample |
| SMS or A2P | Sender and recipient, channel, error code, consent state, brand and campaign state, expected number, actual number, and controlled retest state |
| Calendar | Public link, calendar, assigned user, affected date, expected timezone, diagnostic reason, external conflict, and appointment identifiers |
| Workflow | Workflow name and version, contact, trigger, enrollment and execution history, re-entry setting, branch, failed action, and redacted log |
| Social publishing | Destination, post ID, scheduled time and timezone, destination URL, connection alert, permissions, media, and current destination state |
| Site or form | Asset, live and preview URLs, saved and published versions, hostname, DNS state, assignment, path, embed, custom code, and safe test result |
| CRM | Contact, opportunity, pipeline and stage, workflow history, audit history, import source, master record, and related financial or appointment records |
| Phone or AI | User, contact or number, direction, call or message time, app and version, network, permissions, routing target, prompt or handoff state, and redacted identifier |
| Billing | Verified authority, invoice or subscription, amount and currency, product surface, processor event, test or live mode, charge state, and requested outcome |
| Portal or course | Intended contact, portal URL, course and offer, publication, enrollment, permissions, invitation or link state, and access workflow |
| API or integration | Endpoint and version, authentication method name, operation, request ID, event ID, response code, retry behavior, prior side effects, and affected objects |

## Customer-facing escalation summary

The email should say:

1. What `{agency}` verified.
2. Why the case needs specialist review.
3. What evidence was transferred.
4. Which `{agency}` team owns the next action.
5. When the next update will arrive, only if a real commitment exists.

Do not expose internal ticket URLs, upstream provider names, internal routing notes, secrets, unrestricted logs, or private payloads.
