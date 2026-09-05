# GoHighLevel Contact Import: Upload and Map CSV Files (Growthable)

- **Title:** GoHighLevel Contact Import: Upload and Map CSV Files
- **URL:** https://growthable.io/gohighlevel-tutorials/contacts/how-to-import-contacts/
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (Growthable, a HighLevel agency and reseller)

## Why this source is in the archive

HighLevel's own articles document the import at a policy level and omit the operator-level
detail that decides whether a generated file actually lands correctly. This walkthrough
fills three specific holes: the tag-at-import option, the duplicate strategy selector, and
the import naming.

## Extracted content

**Column headers.** Examples given are `first name`, `last name`, `email`, `phone`, and
`tag`. The source does not publish an exhaustive header list either.

**Mapping screen.** Three columns are shown during mapping:

| Column | Meaning |
|---|---|
| Column Header From File | which CSV column is being imported |
| Preview Information | the data found in that column |
| Contact Fields | where the information will populate |

The system is "generally able to recognize" common fields such as phone and email.
Everything else, including custom fields, is mapped manually from a dropdown.

**Tags, two paths.** Tags can be carried in a column in the spreadsheet itself, AND there
is a separate option during import to "add a tag here", described as "useful if you are
adding 1 tag to the entire list."

**Duplicate strategy at import.** The advanced settings let the operator

> "choose your duplicate strategy- if a duplicate contact record is found in the import
> that matches an existing contact, do you want the system to update the record, add a
> second/additional record, etc.?"

**Contact Source.** Not mentioned as an import-time option in this walkthrough.

**Import naming.**

> "By default the system will create a name based on date and time"

and the operator can instead choose an import name.

## Claims this source supports

1. A one-tag-for-the-whole-file option exists at import time. That is the cleanest way to
   apply a campaign tag to a generated daily file: one file per campaign per day, one tag
   applied to the whole file, no tag column needed.
2. A per-row `tag` column also works, which is what a mixed file needs when rows carry
   different signal types.
3. The operator chooses update-versus-add at import time, so the import instruction the
   skill emits must name the correct choice explicitly rather than leaving it to a default.
4. Import naming is operator-controlled, so a daily drip should name each import in a way
   that encodes the run date and makes a later audit possible.
5. Field mapping is manual for anything non-obvious, so header naming that matches the
   CRM's field labels reduces operator error but never removes the mapping step.
