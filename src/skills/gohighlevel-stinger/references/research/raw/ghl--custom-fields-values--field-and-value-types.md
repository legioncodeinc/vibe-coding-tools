# Overview of Merge Fields & Custom Variables + Understanding Attribution Traffic Sources (HighLevel Support Portal)

- URL: https://help.gohighlevel.com/support/solutions/articles/155000004390-overview-of-merge-fields-custom-variables
- Secondary URL: https://help.gohighlevel.com/support/solutions/articles/48001219997-understanding-attribution-source
- Third URL: https://help.gohighlevel.com/support/solutions/articles/48001078171-list-of-merge-fields
- Fetched: 2026-08-14
- Source type: Official (HighLevel Support Portal)
- Component: custom fields, custom values, custom objects, attribution/source fields

## Custom Fields vs Custom Values vs Custom Objects (official distinction)

- "Custom Fields: User-defined fields for contacts and opportunities." Stores unique per-record data (e.g. birthdays, preferences).
- "Custom Values: Reusable placeholders for static information (e.g., company details) that ensure consistency and simplify updates across multiple areas of your CRM including email templates, websites, funnels, workflows." Use cases: company phone/email/address in footers, standard sign-offs, frequently reused URLs.
- "Custom Objects: User-created data structures for advanced data management" beyond the standard contact/opportunity model -- e.g. subscription plans, inventory, property listings, vendor details.
- Official FAQ: "What is the difference between Custom Fields and Custom Values? Custom Fields are specific to individual contacts or opportunities, storing unique data like birthdays or preferences. Custom Values are reusable placeholders for consistent information across communications."

## Custom field API mechanics (cross-referenced against the Custom-Fields.md community mirror of the official docs)

- `dataType` enum observed: `TEXT`, `LARGE_TEXT`, `NUMERICAL`, `PHONE`, `MONETARY`, `CHECKBOX`, `SINGLE_OPTIONS`, `MULTIPLE_OPTIONS`, `RADIO`, `TEXTBOX_LIST`, and more.
- `fieldKey` format for custom-object fields: `"custom_object.{objectKey}.{fieldKey}"` -- e.g. `custom_object.pet.name`.
- Field creation "Only supports Custom Objects and Company (Business) today. Will be extended to other Standard Objects in the future" (per the Update Custom Field By Id doc) -- a real limitation on which record types can get *new* custom fields created via this particular endpoint family, though contacts/opportunities already have existing custom-field support elsewhere in the API.
- Updating field `options` "will completely replace the existing options array. You must include all existing options alongside any new options you wish to add. Removal of options is not supported through this update."

## Attribution source fields (first-touch and last-touch, both always stored)

- "When attributing a contact to a specific source it is common to consider the first and lastest attribution. Both are always stored on every single contact."
- Merge fields for first attribution: `{{contact.attributionSource.sessionSource}}`, `.url`, `.campaign`, `.utmSource`, `.utmMedium`, `.utmContent`, `.referrer`, `.campaignId`, `.clickId`, `.utmKeyword`, `.utmMatchType`, `.adGroupId`, `.adId`.
- Mirrored fields for latest attribution under `{{contact.lastAttributionSource.*}}`.
- Source classification rule order (official, applied top to bottom, first match wins): 1) `utm_source` contains "adwords" -> Paid Search. 2) `gclid`/`wbraid`/`gbraid`/`msclkid` present -> Paid Search. 3) UTM params present and referring domain is google.com -> Paid Search. 4) `utm_source` contains "fb_ad"/"linkedin_ad"/"twitter_ad"/"reddit_ad", or `ctwa_clid` present -> Paid Social. 5) Referring domain is a social site -> Social Media. 6) Referring domain is a search engine -> Organic Search. 7) Referring domain present, not social/search -> Referral. 8) No referring domain/tracking URL -> Direct Traffic. 9) Lead from Incoming Call/SMS/Email/WhatsApp/FB message -> Others. 10) Manually created in CRM -> CRM UI. 11) From a third-party integration (e.g. Zapier) -> Third-Party.
- Hard constraint: "This action must be a HighLevel Form, Survey, Calendar, Chat Widget and Order Form in order for all attribution data to be captured. Non-HighLevel events will not capture attribution data -- this includes UTM Parameter data." This means a contact created purely via the public Contacts API (not through a native GHL form/survey/calendar/widget) will **not** get automatic UTM-based attribution -- the integration must set `source` and/or attribution-adjacent custom fields itself.

## Notes for the distillation

The rule #11 classification ("Third-Party" source, applied when a lead comes from a third-party integration) is the relevant bucket for anything built with this stinger's lead-intake pattern, since the API is exactly such a third-party integration path. Any lead-capture integration should explicitly set the `source` field on contact creation (e.g. `"source": "public api"` per the OpenAPI example value) since automatic UTM attribution does not apply outside native GHL capture surfaces.
