# Add Contact to Workflow | HighLevel API (official)

- URL: https://marketplace.gohighlevel.com/docs/ghl/contacts/add-contact-to-workflow/
- Fetched: 2026-08-14
- Source type: Official (HighLevel Developer Marketplace docs) + community mirror keith-wohnv/GHL-API-Docs/API/Contacts.md (reproduces scope/auth detail not always visible on the rendered docs page)
- Component: workflows - the only documented workflow-mutation API surface

## Key facts

- Endpoint: `POST https://services.leadconnectorhq.com/contacts/:contactId/workflow/:workflowId`
- This is the entirety of the documented "workflows API surface" for triggering automation from outside: **there is no endpoint in any source in this archive to create, edit, publish, or read the logic/steps of a workflow.** The `/workflows/` resource (per the v3 resource catalog in `ghl--versioning--v3-announcement-and-resource-catalog.md`) is described only as "List workflows and add or remove contacts from them."
- Required scope: `contacts.write`.
- Body: optional `eventStartTime` (e.g. `"2021-06-23T03:30:00+01:00"`), used when the workflow needs an anchor time for scheduled actions.
- Response: `200`/`302` on success (community mirror shows a `302` in one recorded response, which is unusual for a JSON API endpoint and worth a live test rather than assuming a specific status code).

## Notes for the distillation

External systems cannot author or edit workflow logic via the API at any version documented here -- only two mechanisms exist to connect external events to GHL automation: (1) `POST /contacts/:contactId/workflow/:workflowId` to programmatically enroll an already-known contact into an existing, manually-built workflow, and (2) the Inbound Webhook Trigger (see `ghl--webhooks--inbound-trigger-workflow-setup.md`), which lets an external system start a workflow directly via a generated URL without needing a contact ID up front. These are complementary: use the inbound webhook trigger for "I don't have a contact yet, here's raw lead data," and use `add-contact-to-workflow` for "I already created/found the contact via the Contacts API and now want to push them into automation."
