# Import Contacts into HighLevel (HighLevel Support Portal)

- **Title:** Import Contacts into HighLevel / Getting Started: Import Existing Contacts
- **URL:** https://help.gohighlevel.com/support/solutions/articles/155000005056-getting-started-import-existing-contacts
- **Fetched:** 2026-08-17
- **Source type:** official-docs (HighLevel / GoHighLevel vendor support portal)

## Extracted content

**Standard contact fields available for mapping**, quoted as listed:

> "Contact ID, Name, First Name, Last Name, Date of Birth, Contact Owner, Contact Source,
> Contact Type, Business Name, Phone, Email, Business Name, Address, State, City, Postal
> Code, Country, DND, Time Zone, Website, Additional Email, Additional Phones, Notes"

Note that "Business Name" appears twice in the vendor's own list. That is the vendor's
duplication, reproduced here rather than silently corrected.

**Contact Source is a first-class standard field.** This matters: campaign attribution has
a native home and does not have to live only in a tag.

**File limits**

> "CSV files up to 50MB" are supported for upload.

**Column headers**

The article does not specify exact required header strings. It offers a downloadable
sample file to show standard field formatting.

**Tags and deduplication**

Neither is detailed here. The article links out to "Importing Contacts using a csv file"
and "Allow Duplicate Contacts (Contact Deduplication Preferences)".

## Claims this source supports

1. The standard field set includes `First Name`, `Last Name`, `Email`, `Phone`,
   `Business Name`, `Contact Source`, `Contact Type`, `Contact Owner`, `Notes`, `DND`,
   `Time Zone`, `Website`, and address components. These are the safe column headers for a
   generated import file.
2. `Contact Source` exists natively, which is where a campaign origin belongs, with the
   campaign tag as a second, queryable axis.
3. `DND` exists natively, which is the field a do-not-contact flag maps to.
4. File size conflict: 50 MB here versus 30 MB in the CSV import article. Both are
   official. Record both; design to the smaller number.
