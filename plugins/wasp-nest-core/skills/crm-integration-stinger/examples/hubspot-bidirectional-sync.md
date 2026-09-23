# Example: HubSpot Bi-Directional Sync (Happy Path)

A worked example of designing a bi-directional sync between a SaaS product (user + company model) and HubSpot (Contact + Company model).

**Scenario:** B2B SaaS product. Users sign up and create Workspaces. When a user activates their first paid feature, we want the Contact in HubSpot updated. When the sales team updates the deal stage in HubSpot, we want the product's CRM record updated.

**References:** `guides/01-integration-architecture.md`, `guides/02-crm-data-models.md`, `guides/03-field-mapping.md`, `guides/04-sync-and-conflicts.md`

---

## Step 1: Architecture decision

Single CRM (HubSpot). Native SDK is the correct choice. See `guides/01-integration-architecture.md` -- Option A.

Selected: `@hubspot/api-client` (Node.js).

---

## Step 2: Object mapping

| Product object | HubSpot object | Rationale |
|---|---|---|
| `User` | Contact | User is the individual person |
| `Workspace` | Company | Workspace maps to the customer organization |
| `Subscription` | Deal | The active paid subscription |

---

## Step 3: Field mapping (excerpt)

| Product field | HubSpot object | HubSpot field | Direction | Conversion |
|---|---|---|---|---|
| `user.email` | Contact | `email` | bi-directional | lowercase normalize |
| `user.first_name` | Contact | `firstname` | product → HubSpot | trim |
| `user.last_name` | Contact | `lastname` | product → HubSpot | trim |
| `user.activated_at` | Contact | `hs_lifecycle_stage` | product → HubSpot | `activated_at != null` → `"lead"` |
| `workspace.name` | Company | `name` | product → HubSpot | trim |
| `workspace.plan` | Contact | `custom_plan_tier` | product → HubSpot | enum map (see below) |
| `deal.stage` | Deal | `dealstage` | HubSpot → product | map HubSpot internal stage value to product enum |
| `deal.close_date` | Deal | `closedate` | HubSpot → product | ISO 8601 |

**Plan tier enum map:**
- `free` → HubSpot internal value: `"free_tier"` (custom property)
- `starter` → `"starter_tier"`
- `professional` → `"professional_tier"`
- `enterprise` → `"enterprise_tier"`

Verify actual internal values with `GET /crm/v3/properties/contacts/custom_plan_tier`.

---

## Step 4: Conflict resolution policy

| Field | Policy | Rationale |
|---|---|---|
| `email`, `phone` | Last-write-wins (with timestamp) | Either side may update contact info |
| `deal.stage`, `close_date` | CRM-authoritative | Sales team owns pipeline data |
| `workspace.plan` | Product-authoritative | Billing system owns plan data |
| `user.do_not_contact` | Most-restrictive-wins | GDPR non-negotiable |

---

## Step 5: Sync trigger design

**Product → HubSpot:** Product fires events (user.activated, subscription.upgraded, workspace.created). A background worker dequeues and calls HubSpot batch API.

**HubSpot → Product:** HubSpot webhook fires on Contact/Deal property changes. Endpoint returns 200 immediately; worker processes.

**Webhook endpoint (Node.js pseudocode):**

```js
app.post('/webhooks/hubspot', async (req, res) => {
  // Step 1: Validate signature BEFORE returning 200
  const signature = req.headers['x-hubspot-signature-v3'];
  const timestamp = req.headers['x-hubspot-request-timestamp'];
  
  // Anti-replay: reject if > 5 minutes old
  if (Date.now() - parseInt(timestamp) > 300_000) {
    return res.status(400).send('Timestamp expired');
  }
  
  const expectedSig = crypto
    .createHmac('sha256', process.env.HUBSPOT_CLIENT_SECRET)
    .update(`POST${req.url}${JSON.stringify(req.body)}${timestamp}`)
    .digest('base64');
  
  // Constant-time comparison (not string ==)
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  )) {
    return res.status(401).send('Invalid signature');
  }
  
  // Step 2: Return 200 BEFORE processing
  res.status(200).send('OK');
  
  // Step 3: Enqueue for async processing
  for (const event of req.body) {
    const idempotencyKey = `${event.portalId}:${event.objectId}:${event.propertyName}:${event.occurredAt}`;
    await queue.enqueue({ event, idempotencyKey });
  }
});
```

---

## Step 6: Dedup check at Contact create

Before creating a HubSpot Contact for a new `User`:

```js
async function upsertHubSpotContact(user) {
  // Normalize email
  const email = user.email.toLowerCase().trim();
  
  // Check for existing Contact
  const existing = await hubspot.crm.contacts.searchApi.doSearch({
    filterGroups: [{
      filters: [{ propertyName: 'email', operator: 'EQ', value: email }]
    }],
    limit: 1
  });
  
  if (existing.total > 0) {
    // Update existing Contact
    return hubspot.crm.contacts.basicApi.update(
      existing.results[0].id,
      { properties: mapUserToHubSpotProps(user) }
    );
  } else {
    // Create new Contact
    return hubspot.crm.contacts.basicApi.create({
      properties: mapUserToHubSpotProps(user)
    });
  }
}
```

---

## Step 7: Reconciliation job (nightly)

Nightly job queries HubSpot for all Contacts and Deals modified in the last 48 hours. For each, checks product database for discrepancies. Resolves per the conflict resolution policy. Logs all discrepancies for audit.

---

*Happy-path complete. For the Salesforce Lead/Contact migration pattern, see `examples/salesforce-lead-contact-migration.md`.*
