# Importing Contacts using a CSV File (HighLevel Support Portal)

- **Title:** Importing Contacts using a CSV File
- **URL:** https://help.gohighlevel.com/support/solutions/articles/155000004432-importing-contacts-using-a-csv-file
- **Fetched:** 2026-08-17
- **Source type:** official-docs (HighLevel / GoHighLevel vendor support portal)

## Extracted content

**File specifications**

| Item | Requirement |
|---|---|
| Format | CSV (.csv) only. Excel and Google Sheets files are not accepted. |
| Size limit | Under 30 MB. Larger files must be split. |
| Structure | Single sheet or tab, with a header row that is not blank. |
| Header requirement | "at least one column header corresponds to a field in the system" |

**Required fields per row**

> "Every row should have at least one required field (Name, Email, or Phone)."

So a row is importable if it carries a name, an email, or a phone. All three are not required.

**Phone formatting**

The article does not publish a canonical phone format. It warns against special
characters: "Remove spaces, dashes, or letters" from phone numbers.

**Custom fields**

> "If your CSV file includes data for fields that do not yet exist in HighLevel, you will
> need to create those fields as Custom Fields before completing the import."

**Deduplication at import**

When updating, HighLevel matches on this order: Contact ID, then Email, then Phone. The
article points to a separate Contact Deduplication Preferences setting that governs the
behavior.

**Import flow, five steps**

1. Navigate to Contacts.
2. Select the import type (Contacts, or Contacts plus Opportunities).
3. Upload the CSV.
4. Map columns to fields.
5. Verify and confirm before finalizing.

## What this source does NOT say

- It does not publish an exhaustive list of exact column header strings.
- It does not name a tag column or a tag delimiter.
- It does not give a date format specification.

## Claims this source supports

1. GoHighLevel accepts a plain CSV with a header row, and the mapping step is manual, so
   header names are a convenience rather than a hard contract.
2. A minimum viable import row needs only one of name, email, or phone.
3. Custom fields must be created in the CRM BEFORE an import can map to them. A skill that
   emits a custom column the user has not created will silently drop that data.
4. The documented match order for update is Contact ID, then Email, then Phone.
5. Conflict to record: this article states a 30 MB limit. The companion official article
   states 50 MB. See `piper--ghl-import--highlevel-import-existing-contacts.md`.
