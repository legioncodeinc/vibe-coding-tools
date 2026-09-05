# Contact Deduplication Preferences (HighLevel Support Portal)

- **Title:** Contact Deduplication Preferences (Settings) / Allow Duplicate Contact Explained
- **URL:** https://help.gohighlevel.com/support/solutions/articles/48001181714-allow-duplicate-contact-explained
- **Fetched:** 2026-08-17
- **Source type:** official-docs (HighLevel / GoHighLevel vendor support portal)

## Extracted content

**What the setting does.** It controls whether a duplicate contact can be created, based
on a match against email or phone.

**Default.** Email is the default primary matching field.

**Matching order.**

1. Primary field, Email by default, or Phone if the location is configured that way.
2. Secondary field, optional, checked only if the primary field produced no match.

This article does not mention Contact ID as a matching criterion, unlike the CSV import
article, which lists Contact ID first.

**Behavior**

| Setting | Result |
|---|---|
| Allow duplicates ON | "Allows duplicates, creating separate records for contacts with the same email or phone" |
| Allow duplicates OFF | "Updates the existing contact with the new information instead of creating a duplicate" |

**Behavior varies by entry point, which is the important part**

| Entry point | Behavior |
|---|---|
| Forms and Zapier | The setting controls creation directly. |
| CSV imports | Duplicates "are merged automatically based on phone number or email, regardless of the setting" |
| Facebook and Instagram lead sources | Automatic merging happens only when duplicates are disabled. |

**Normalization**

The article says nothing about phone or email normalization: no statement about E.164,
leading zeros, plus-addressing, or case folding.

## Claims this source supports

1. GoHighLevel deduplicates on a single primary field by default, which is Email. A
   contact with no email and only a name deduplicates on nothing useful.
2. A CSV import merges on email or phone REGARDLESS of the allow-duplicates setting. So a
   generated import file is safer than it looks for exact matches, and still useless for
   near matches.
3. The CRM's own dedupe is deterministic and exact. It will not catch "Dani Thompson" in
   the CRM versus "Dani M. Thompson" on the comment thread, because neither carries an
   email.
4. Conflict to record: matching order is Contact ID then Email then Phone in the import
   article, and primary-then-secondary field here with no Contact ID. Both are official
   HighLevel pages.
