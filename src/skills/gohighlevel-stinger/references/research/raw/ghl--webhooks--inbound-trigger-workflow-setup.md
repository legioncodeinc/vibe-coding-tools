# How to use the Inbound Webhook Workflow Premium Trigger (HighLevel Support Portal)

- URL: https://help.gohighlevel.com/support/solutions/articles/48001237383-how-to-use-the-inbound-webhook-workflow-premium-trigger
- Fetched: 2026-08-14
- Source type: Official (HighLevel Support Portal, modified 2025-02-27)
- Component: workflows - inbound webhook trigger (external system -> GHL workflow)

## What it is

- "An Inbound Webhook is a robust feature that facilitates the automatic data transfer from external systems to your CRM... When an event occurs in an external system, an HTTP request (POST, GET, or PUT) is sent to a specific URL linked to a trigger within your CRM, initiating a workflow."
- This is a **premium trigger**: "Agencies on Any Plan ($97, $970, $297, $2970, $497, $4970) can access LC Premium Triggers & Actions. Once Premium Actions & Triggers are enabled via the Agency settings, EXISTING and New Sub-Accounts will have 100 free executions." Rebilling for existing sub-accounts must be enabled manually per sub-account; new sub-accounts created after enabling the SaaS Configurator setting get it automatically.

## Setup flow (official steps)

1. Open/create a workflow, select "Inbound Webhook" as the trigger.
2. HighLevel generates a unique Webhook URL for that specific trigger.
3. Configure the external application (Zapier, Make/Integromat, a custom script, etc.) to POST/GET/PUT JSON to that URL.
4. "Test the Integration: Send a test request from the external application... to ensure the integration is functioning correctly."
5. "Map Incoming Data: In HighLevel, you can select and map the data received from the external application to relevant fields or variables within your workflow."
6. Save the trigger.

## Hard constraints (official, verbatim)

- "Always send the request using a supported method (POST, GET, or PUT) when interacting with the webhook."
- "Ensure the data is sent as a JSON object, the only supported data format."
- "To compile correctly, keys must be a single string without space separations; consider using CamelCase or snake_case instead of separating key names with spaces."
- **"Providing an Email or Phone number in the payload is mandatory, as the workflow requires contact information. An Email or Phone is required to Find or Create the Contact."** -- however, the workflow *can* run contactless if the default "Create/Update Contact" step is removed: "Workflow can run contactless without any Contact data dependency so you can send any payload data via Inbound Webhook Triggers and use it in workflow... You can proceed without contact and use actions that are not dependent on contact information. Custom Webhook, Google Sheet, Slack, ChatGPT and all Internal Tools can be executed without contact."
- "Arrays are not supported in custom values. You can send them in the request but cannot use them inside actions."
- "If your data structure changes, re-select the Mapping Reference inside the Inbound Webhook Trigger setup to address those fields in other actions correctly." -- field mapping is bound to the sample payload captured during setup, not dynamically inferred per request.
- URL rotation on compromise: "If your Inbound Webhook Trigger URL gets compromised or leaked and you want to prevent unwanted requests, Delete the existing Inbound Webhook Trigger and Add a New Inbound Webhook Trigger. A new URL with a different ending ID will be generated... incoming requests from the old URL won't enter your workflow."

## Notes for the distillation

The inbound webhook trigger URL functions as a bearer secret (anyone with the URL can fire the workflow -- there is no documented signature/auth mechanism on inbound webhook *trigger* URLs, unlike outbound webhooks which HighLevel itself signs). There is no rotation API; revocation is delete-and-recreate, which breaks every existing integrator pointed at the old URL. If email/phone is required for contact-creating workflows but the source system doesn't reliably have one, the integration must either backfill a placeholder or use the contactless path deliberately.
