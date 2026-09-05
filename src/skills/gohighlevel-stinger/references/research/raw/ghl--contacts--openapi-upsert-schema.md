# GoHighLevel API v2 OpenAPI spec (merged) -- Contacts upsert schema

- URL: https://raw.githubusercontent.com/cbnsndwch/ghl-app-template/develop/docs/openapi/ghl-api-v2.merged.yml
- Fetched: 2026-08-14
- Source type: Community-maintained mirror of HighLevel's published OpenAPI spec (secondary, but reproduces first-party schema text verbatim)
- Component: contacts - upsert schema, custom fields shape, tag replace semantics

## Tag catalog confirmed in this spec (partial)

Businesses, Calendars, Campaigns, Contacts, Contact Appointments, Contact Campaigns, Contact Notes, Contact Search, Contact Tags, Contact Tasks, Contact Workflows, Conversations, Custom Fields, Custom Values, Forms, Locations, Location Notes, Location Search, Location Tags, Location Tasks, Location Templates, Media, OAuth, Opportunities, Pipelines, Snapshots, Surveys, Tags, Templates, Trigger Links, Users, Workflows.

## `UpsertContactInput` schema (key fields)

```yaml
UpsertContactInput:
  type: object
  properties:
    firstName: {type: string, nullable: true}
    lastName: {type: string, nullable: true}
    name: {type: string, nullable: true}
    email: {type: string, nullable: true}
    locationId: {type: string}         # required
    phone: {type: string, nullable: true}
    address1: {type: string, nullable: true}
    city: {type: string, nullable: true}
    state: {type: string, nullable: true}
    postalCode: {type: string, nullable: true}
    website: {type: string, nullable: true}
    timezone: {type: string, nullable: true}
    dnd: {type: boolean}
    dndSettings: {$ref: 'ContactDndSettings'}
    inboundDndSettings: {$ref: 'ContactInboundDndSettings'}
    tags: {type: array, items: {type: string}}
    customFields:
      type: array
      items:
        anyOf:
          - $ref: 'CustomFieldStringInput'
          - $ref: 'CustomFieldArrayInput'
          - $ref: 'CustomFieldObjectInput'
    source: {type: string, example: "public api"}
    country: {type: string, example: "US"}
    companyName: {type: string, nullable: true}
  required: [locationId]
```

## `UpsertContactsResponse` schema

```yaml
UpsertContactsResponse:
  type: object
  properties:
    new: {type: boolean, example: true}      # true if a new contact was created, false if matched an existing one
    contact: {$ref: 'Contact'}
    traceId: {type: string}
```

## `ContactCustomField` shape (used both in upsert input and read responses)

```yaml
ContactCustomField:
  type: object
  properties:
    id: {type: string, example: "MgobCB14YMVKuE4Ka8p1"}
    value: {type: string}
```

## `create_new_if_duplicate_allowed` flag (from the Rust-generated `UpsertContactDto` bindings, same OpenAPI source)

- "Controls whether to create a new contact or update an existing duplicate. Scenario 1: If this value is `true` and the location allows duplicate contacts, a new contact will be created immediately without checking for duplicates. Scenario 2: If this value is `true` but the location does not allow duplicate contacts, this field is ignored and the normal upsert behavior applies... Scenario 3: If this value is `false` or not provided, the normal upsert behavior applies regardless of the location's duplicate contact setting."

## Notes for the distillation

This is direct schema evidence that `POST /contacts/upsert` (accepting `UpsertContactInput`, returning `UpsertContactsResponse` with a `new: boolean` flag) is a real, documented v2 endpoint -- resolving the conflict noted in `ghl--contacts--create-update-upsert-recipes.md` in favor of "the upsert endpoint exists; use it." The matching logic is not fully specified in this spec fragment beyond the `create_new_if_duplicate_allowed` override; other sources (smartmarketingarchitect.com) state matching happens "by email or phone" with email checked first. Custom field values are always `{id, value}` pairs keyed by the custom field's ID, never by field name or key, in every schema and every worked example across this entire archive -- this is the single most consistent, well-corroborated fact in the research set.
