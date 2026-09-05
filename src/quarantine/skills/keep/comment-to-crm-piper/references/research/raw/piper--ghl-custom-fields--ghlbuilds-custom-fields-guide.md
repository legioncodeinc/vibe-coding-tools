# How to Create, Edit and Delete Custom Fields in HighLevel (GHL Builds)

- **Title:** How to Create Custom Fields in GoHighLevel (2026 Guide)
- **URL:** https://ghlbuilds.com/how-to-create-edit-and-delete-custom-fields-in-highlevel/
- **Fetched:** 2026-08-17
- **Source type:** community (independent HighLevel practitioner site)

## Extracted content

**Creation path**

> "Go to Settings, Custom Fields, Click 'Create Field', Name your field, Choose field type
> (text, number, date, etc.), Save."

**Field types, seven of them**

| Type | Limit noted |
|---|---|
| Text Field | 255 characters |
| Text Area | 5,000 characters |
| Number Field | none stated |
| Date Field | none stated |
| Dropdown Field | none stated |
| Checkbox Field | none stated |
| Radio Button Field | none stated |

**Field key.** Described as "the internal identifier used in merge fields". Each field
shows its field key in smaller text under the field name. Merge syntax observed:
`{{contact.custom.field_key}}`. How the key is generated from the label is not explained.

**CSV import requirement, stated directly**

> "Make sure your custom fields exist before importing, then match the CSV column names to
> your field keys during import."

## Source-quality caveat

This is a practitioner site, not HighLevel. It is used here only where it agrees with or
elaborates the official article
`piper--ghl-import--highlevel-csv-import-official.md`, which independently states that
custom fields must exist before import. The seven field types and the two character limits
are single-sourced to this page and are recorded as such.

## Claims this source supports

1. Custom fields must be pre-created in the CRM before an import can map into them. This
   is corroborated by the official CSV import article.
2. A Text Field caps at 255 characters, single-sourced. A drafted first message will not
   fit in one. A drafted message belongs in Notes or in a Text Area custom field, not in a
   plain text custom field.
3. Custom fields carry a separate field key from their display label, so a generated import
   file that guesses a key rather than reading it from the user's own CRM will map wrong.
