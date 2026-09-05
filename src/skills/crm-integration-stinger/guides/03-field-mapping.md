# Field Mapping

After choosing the integration architecture and understanding the target CRM's data model, design the field mapping. This guide covers canonical patterns, common data-type traps, and the mapping table format the worker-bee produces.

## The field mapping workflow

1. List every field in the product's internal schema that should sync to the CRM.
2. For each field, find the canonical CRM equivalent (standard field if it exists, or define a custom property/field).
3. Flag data-type mismatches and specify the conversion rule.
4. Identify computed fields (fields in the product that don't map 1:1 to a CRM field and require transformation).
5. Specify the sync direction per field (product → CRM, CRM → product, or bi-directional).

## Common field mapping traps

### HubSpot dropdown values

HubSpot enumeration properties (dropdowns, checkboxes, radio buttons) use internal option values that are NOT the display labels. When writing to a HubSpot dropdown via API:

- Use the internal property value (e.g., `"hs_lead_status": "OPEN"`) not the display label ("Open").
- Use `GET /crm/v3/properties/{objectType}/{propertyName}` to retrieve the list of valid internal option values before writing.
- Writing an invalid dropdown value will succeed silently in some HubSpot API versions but will produce a malformed record.

### Salesforce picklist fields

Salesforce picklist fields (the Salesforce equivalent of dropdowns) reject invalid values with an API error -- unlike HubSpot, which silently accepts them.

- Use `GET /services/data/v{version}/sobjects/{SObject}/describe` to retrieve valid picklist values before writing.
- Multi-select picklist fields use semicolon-separated values (`"A;B;C"`), not arrays.
- "Restricted" picklist fields will reject any value not in the configured list, even through API. "Unrestricted" picklists will accept any string.

### Attio dynamic attributes

Attio attributes are user-defined at the workspace level. There is no static list in documentation.

- Use `GET /v2/objects/{object_id}/attributes` to retrieve the workspace's attribute configuration before writing.
- Attribute slugs are user-defined strings, not canonical values. Two Attio workspaces may use different slugs for conceptually equivalent fields.
- Type mismatch errors are returned immediately -- Attio is stricter than HubSpot about type enforcement.

### Phone number normalization

CRMs store phone numbers in inconsistent formats. For matching and dedup, always normalize to E.164 format (`+14155551234`) before comparison. On write, HubSpot accepts E.164 but strips the `+` in the UI display; Salesforce accepts E.164 natively.

### Email normalization

For dedup and matching: lowercase, strip whitespace. `Alice@Example.com` and `alice@example.com` are the same person. HubSpot automatically lowercases contact email on create; Salesforce does not.

### HubSpot attribution fields

HubSpot's original source (`hs_analytics_source`) and latest source (`hs_analytics_latest_source`) have no direct Salesforce equivalent. If attribution data needs to survive a HubSpot → Salesforce sync:

- Create custom Salesforce text fields: `HubSpot_Original_Source__c` and `HubSpot_Latest_Source__c`.
- Map them explicitly in the sync spec.
- This is a one-way relationship: Salesforce does not write back to HubSpot's source fields (they are read-only in HubSpot).

### Deal/Opportunity orphan prevention

HubSpot Deals must be associated with a Company before syncing to Salesforce Opportunities. The worker-bee should:

1. Check for a Company association on every Deal before attempting to create a Salesforce Opportunity.
2. If no Company is associated: create a placeholder Company/Account in Salesforce, associate, and flag for human review.
3. Do NOT silently drop the Deal -- orphaned Deals cause revenue attribution gaps.

## Field mapping table format

Use `templates/field-mapping-table.md` to produce the mapping. The canonical columns:

| Product field | Product type | CRM object | CRM field | CRM type | Direction | Conversion rule | Notes |
|---|---|---|---|---|---|---|---|
| `person.email` | string | Contact | `email` | email | bi-directional | lowercase normalize | Dedup key |
| `person.company_name` | string | Company | `name` | string | product → CRM | trim whitespace | Create if not exists |
| `person.lifecycle_stage` | enum | Contact | `lifecyclestage` | enumeration | product → CRM | map enum to HubSpot internal values | See HubSpot picklist |
| `deal.value` | integer (cents) | Deal | `amount` | number | bi-directional | divide by 100 | HubSpot stores in dollars |

## Computed fields

Some fields in the product don't map 1:1 to a CRM field. Document these separately:

- **Full name computation:** CRM has `firstname` + `lastname` as separate fields; product may store `display_name` as a single string. Define the split rule (first word = firstname, rest = lastname) and document edge cases (single-word names, names with prefixes).
- **Plan tier → CRM property:** Product's `subscription.plan` enum may need to map to a HubSpot Contact property or Salesforce Contact custom field. Define the mapping table explicitly.
- **MRR calculation:** If syncing revenue data, define whether MRR is synced from the product's billing system or computed in the CRM from Opportunity data.

---

*Sources: `research/external/2026-05-20-hubspot-api-rate-limits-webhooks.md`, `research/external/2026-05-20-salesforce-data-model-lead-contact-lifecycle.md`, `research/external/2026-05-20-attio-api-v2-rate-limits-stability.md`*
*Demonstrates: `examples/hubspot-bidirectional-sync.md` (field mapping section)*
