# 04. Webhooks: inbound and outbound

GoHighLevel has two entirely different "webhook" concepts. Do not conflate them.

## Outbound webhooks (HighLevel -> your server)

Configured on a Marketplace app listing (or a workflow's Webhook action). HighLevel sends 58+ event types across Contact, Opportunity, Task, Appointment, Invoice, Product, Association, Location, and User categories [raw/ghl--webhooks--integration-guide-and-signature-verification.md].

### Signature verification -- mid-migration, act now

| Header | Algorithm | Status |
|---|---|---|
| `X-GHL-Signature` | Ed25519 | Current -- verify this first when present |
| `X-WH-Signature` | RSA-SHA256 | **Deprecated 2026-09-01** -- legacy fallback only |

Verify the **raw request body bytes**, never a re-serialized JSON object -- re-serialization can reorder keys and invalidate the signature. Full code samples (Node.js, both algorithms) are in `references/webhook-payload-examples.md` [raw/ghl--webhooks--integration-guide-and-signature-verification.md].

Recommended replay-window: reject any payload whose `timestamp` is older than 5 minutes, in addition to signature verification [raw/ghl--webhooks--integration-guide-and-signature-verification.md].

Public verification keys are published on the live docs page and rotate occasionally with email/Slack notice -- pull the current key at deploy time rather than hard-coding a copy that can go stale [raw/ghl--webhooks--integration-guide-and-signature-verification.md].

`INSTALL`/`UNINSTALL` app-lifecycle events are delivered only to the app's configured "Default Webhook URL" in the marketplace listing, not to arbitrary per-subscription endpoints [raw/ghl--webhooks--integration-guide-and-signature-verification.md].

### Retry behavior

No first-party retry schedule was found anywhere in this research (a documented gap). Treat delivery as at-least-once: dedupe on `webhookId`, and design handlers to be safe to run twice.

## Inbound webhook trigger (external system -> HighLevel workflow)

This is a **workflow trigger**, not a REST resource you call. Configure it inside a workflow: HighLevel generates a unique URL; POST/GET/PUT a JSON body to it and the workflow fires [raw/ghl--webhooks--inbound-trigger-workflow-setup.md].

Setup: add trigger -> copy generated URL -> send a test request -> map the received fields to contact fields/custom values inside the trigger UI -> save -> build the rest of the workflow -> activate.

### Hard constraints

- JSON body only; POST/GET/PUT supported.
- Keys must be single strings, no spaces (CamelCase or snake_case).
- **Email or phone is mandatory if the workflow includes a Find/Create Contact step.** The workflow can run "contactless" if that step is removed -- useful for pure data-logging automations (e.g. write to a Google Sheet, post to Slack) that don't need a GHL contact at all.
- Arrays can be sent in the payload but are not usable inside downstream actions/custom values.
- Field mapping is bound to the sample payload captured during setup -- if the sender's payload shape changes, re-select the Mapping Reference or new fields won't map.

[raw/ghl--webhooks--inbound-trigger-workflow-setup.md]

### No authentication on inbound trigger URLs -- a real gap

**There is no documented signature or auth mechanism for inbound webhook trigger URLs anywhere in this research.** The URL itself is the only secret. Anyone who obtains it can fire the workflow. There is no rotation API -- recovery from a leaked URL is delete-and-recreate the trigger, which generates a new URL and breaks every legitimate sender still pointed at the old one [raw/ghl--webhooks--inbound-trigger-workflow-setup.md]. Practical mitigations (not documented by HighLevel, apply your own judgment): treat the URL as a bearer secret in your own systems' config/secret store, avoid embedding it in client-side code, and consider a lightweight shared-secret field inside the JSON body that a downstream IF/ELSE action checks before proceeding, since the platform provides no header-based verification for this path.

## Which one do you need?

| You have | Use |
|---|---|
| A known GHL `contactId` and want to push it into an existing, hand-built workflow | `POST /contacts/:contactId/workflow/:workflowId` (see `guides/03-opportunities-and-pipelines.md` sibling doc `guides/02-contacts-and-custom-fields.md` for contact resolution, and the endpoint reference for the call itself) |
| Raw lead/event data from an external system, no GHL contact yet | Inbound Webhook Trigger |
| Need to react in your own system when something changes inside GHL | Outbound webhook (configure on your Marketplace app or a workflow action) |

[raw/ghl--workflows--add-contact-to-workflow-endpoint.md, raw/ghl--webhooks--inbound-trigger-workflow-setup.md]
