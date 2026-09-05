# Example: Salesforce Lead → Contact Migration Pattern

A worked example of the "lead coexistence" failure pattern and the correct migration to resolve it.

**Scenario:** A SaaS company has been running Salesforce for 18 months. Their sync creates Salesforce Leads for every new signup. Some leads have been manually converted by the sales team to Contacts. The result: 3,400 Contact records and 12,000 Lead records, with significant overlap (the same person exists as both a Lead and a Contact).

**References:** `guides/02-crm-data-models.md` (Salesforce section), `guides/05-deduplication.md`

---

## Why this happens

The "lead coexistence failure pattern" occurs when:
1. Integration creates a Lead for every new person.
2. Sales team converts some Leads to Contacts + Accounts.
3. The integration continues to create new Leads for those same people (because it only checks "does a Lead with this email exist?" not "does a Contact with this email exist?").

Result: the same person has a Lead (with the integration's data) and a Contact (with the sales team's data). Two sources of truth. Pipeline reports are wrong. Enrichment runs twice. Sequences fire twice.

---

## The correct Salesforce dedup check

Before creating a Salesforce Lead, the integration must check BOTH objects:

```python
def get_or_create_salesforce_record(person):
    email = person['email'].lower().strip()
    
    # Check Contact first (higher priority -- converted leads are Contacts)
    contacts = sf.query(
        f"SELECT Id, Email FROM Contact WHERE Email = '{email}' LIMIT 1"
    )
    if contacts['totalSize'] > 0:
        # Update existing Contact
        contact_id = contacts['records'][0]['Id']
        sf.Contact.update(contact_id, map_to_contact_fields(person))
        return {'type': 'Contact', 'id': contact_id}
    
    # Check Lead (not yet converted)
    leads = sf.query(
        f"SELECT Id, Email, IsConverted FROM Lead WHERE Email = '{email}' AND IsConverted = false LIMIT 1"
    )
    if leads['totalSize'] > 0:
        # Update existing unconverted Lead
        lead_id = leads['records'][0]['Id']
        sf.Lead.update(lead_id, map_to_lead_fields(person))
        return {'type': 'Lead', 'id': lead_id}
    
    # No existing record -- create Lead
    new_lead = sf.Lead.create(map_to_lead_fields(person))
    return {'type': 'Lead', 'id': new_lead['id']}
```

**Critical:** `IsConverted = false` in the Lead query prevents re-creating a Lead for a converted record.

---

## The migration plan for existing lead coexistence

For teams already in the failure state, the migration has four phases:

### Phase 1: Audit (1 day)

Identify the overlap:

```sql
-- Leads that have a matching Contact (by email, normalized)
SELECT l.Id, l.Email, c.Id AS ContactId, c.Email AS ContactEmail
FROM Lead l
JOIN Contact c ON LOWER(l.Email) = LOWER(c.Email)
WHERE l.IsConverted = false
```

This query returns the orphaned Leads for which a Contact already exists.

### Phase 2: Merge data (per-record, human review for large accounts)

For each orphaned Lead:
1. Compare field values between Lead and Contact.
2. Apply survivorship rules: Contact wins for pipeline data; Lead wins for any richer data (better phone number, more complete address).
3. Copy the winning values to the Contact record.
4. Store the Lead ID in a custom field on the Contact (`HubSpot_Lead_ID__c` or `Legacy_Lead_ID__c`).

### Phase 3: Convert the orphaned Leads

Convert each orphaned Lead to an Account + Contact + (optional) Opportunity using Salesforce's `convertLead()` API. Select "Merge with existing" and point to the existing Account/Contact.

```python
sf.soap_client.convertLead({
    'leadId': orphaned_lead_id,
    'accountId': existing_account_id,
    'contactId': existing_contact_id,
    'convertedStatus': 'Closed - Converted',
    'doNotCreateOpportunity': True  # unless creating an Opportunity
})
```

### Phase 4: Fix the integration

Apply the corrected `get_or_create_salesforce_record` logic above so future syncs check Contact first and never create a Lead for a converted record.

---

## Verification

After migration, run the audit query again. Expected result: 0 rows (no orphaned Leads with matching Contacts).

Monitor for 2 weeks post-migration to confirm the integration no longer creates orphaned Leads.

---

*Edge case: `examples/hubspot-bidirectional-sync.md` for the HubSpot Contact pattern.*
*Guides: `guides/02-crm-data-models.md` for the Salesforce object model, `guides/05-deduplication.md` for survivorship rules.*
