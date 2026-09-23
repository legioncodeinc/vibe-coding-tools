# CRM tiers and import formats

Three tiers. Implement all three. Decide which one applies by LISTING the tools actually
available in this session, never by assuming a connector exists because the user mentioned
their CRM.

## Step zero: list your tools, then choose

Before any of this, enumerate the tools available in the session and read the real names.
The roadmap this marketplace was built from assumed a GoHighLevel connector. That
assumption is not safe. Connectors come and go per session, per workspace, and per user
plan.

Decide like this:

| What you found | Tier |
|---|---|
| A tool that creates or updates contacts in a CRM (GoHighLevel, HubSpot, Salesforce, Pipedrive, Close, or similar), and a way to search existing contacts | **Tier 1, connector** |
| No CRM tool, but the user has a CRM that accepts a file import | **Tier 2, import file** |
| No CRM tool and no import path, or the user does not want a file | **Tier 3, copy-paste block** |

State the tier you selected, and WHY, at the top of every output. "No CRM connector is
available in this session, so I produced an import file" is information the user needs. A
silent downgrade is a defect.

Never claim a record was created when it was written to a CSV. Never claim a tier 1 upsert
happened without showing the response.

---

## Tier 1: a CRM connector is available

### Order of operations, and the order is load-bearing

1. **Search first, write never yet.** Query the CRM for each candidate before proposing
   anything. See `references/dedupe-against-crm.md` for the matching procedure. A skill
   that upserts first and dedupes later has already created the duplicate.
2. **Build the exact record set.** For every person: the field values, the tags, the source
   value, and the dedupe verdict from step 1.
3. **Show the user the actual records.** Not a count, not a summary. The literal field
   values that are about to be written, per person, with the dedupe verdict beside each.
4. **Get approval with `AskUserQuestion`.** Approval attaches to the shown records. If the
   user edits one, re-show the edited set.
5. **Then upsert**, one person at a time, capturing the response for each.
6. **Report what actually happened**, including failures. A partial write is reported as
   partial.

### GoHighLevel specifics, since that is the user's stated CRM

A native upsert exists at `POST /contacts/upsert`, and the body fields named in the
developer documentation are `firstName`, `lastName`, `email`, `phone`, `tags`, `source`,
`customFields`, and `locationId`
[research/raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md]. Use whatever the
session's connector exposes; do not hand-roll HTTP if a tool is present.

Two hazards to handle explicitly:

**Hazard one, the split-record silent pick.** The documentation states that when both email
and phone are present and SEPARATE contacts exist for each, the API updates the contact
matching the first field in the configured sequence and ignores the second
[research/raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md]. Two duplicate records
stay split, one is silently updated, and nothing tells you. Mitigation: search on email AND
on phone independently before upserting. If the two searches return different contact ids,
stop, do not upsert, and surface the collision to the user as a pre-existing duplicate to
merge.

**Hazard two, the dedupe configuration is not yours.** The upsert honors the location-level
Allow Duplicate Contact setting, whose default primary match field is Email, with an
optional secondary field checked only if the primary found nothing
[research/raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md],
[research/raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md]. A hand-raiser with no
email and only a name matches on nothing. Say so on the record rather than pretending the
upsert deduped.

### Tags at upsert time

GoHighLevel tags are case sensitive: "'Facebook' and 'facebook' would be treated as
separate tags" [research/raw/piper--ghl-tags--highlevel-add-contact-tag-action.md]. Tags are
also created implicitly on first use with no typo protection
[research/raw/piper--ghl-tags--highlevel-add-contact-tag-action.md]. Together those two
facts mean a single inconsistent run permanently forks a segment.

Pin the tag string ONCE, record it in the run state block as `CAMPAIGN_TAG`, and read it
back from the previous run rather than re-deriving it. See
`references/consent-and-tagging.md` for the naming convention and
`references/high-water-mark.md` for the state block.

---

## Tier 2: no connector, but the CRM takes an import

Produce a CSV. Produce it correctly, and produce an import instruction beside it.

### The file rules, from the vendor's own documentation

| Rule | Value | Source |
|---|---|---|
| Format | CSV only. Not xlsx, not a Google Sheet | [research/raw/piper--ghl-import--highlevel-csv-import-official.md] |
| Size | Under 30 MB per one official article, up to 50 MB per another. Design to 30 MB | [research/raw/piper--ghl-import--highlevel-csv-import-official.md], [research/raw/piper--ghl-import--highlevel-import-existing-contacts.md] |
| Structure | One sheet, one non-blank header row | [research/raw/piper--ghl-import--highlevel-csv-import-official.md] |
| Minimum per row | At least one of Name, Email, or Phone | [research/raw/piper--ghl-import--highlevel-csv-import-official.md] |
| Phone | Strip spaces, dashes, and letters | [research/raw/piper--ghl-import--highlevel-csv-import-official.md] |

A daily drip file is a handful of rows, so the size limits never bind. They are recorded
because the first run may sweep a backlog.

### The header row to emit for GoHighLevel

HighLevel does not publish an exhaustive list of exact header strings, and the mapping step
is manual regardless [research/raw/piper--ghl-import--highlevel-csv-import-official.md],
[research/raw/piper--ghl-import--growthable-import-walkthrough.md]. So headers are chosen to
MATCH THE FIELD LABELS the vendor documents, which makes the mapping screen auto-recognise
most of them and makes the rest obvious to map by hand.

The documented standard field labels are "Contact ID, Name, First Name, Last Name, Date of
Birth, Contact Owner, Contact Source, Contact Type, Business Name, Phone, Email, Business
Name, Address, State, City, Postal Code, Country, DND, Time Zone, Website, Additional
Email, Additional Phones, Notes"
[research/raw/piper--ghl-import--highlevel-import-existing-contacts.md].

Emit exactly this header row:

```
First Name,Last Name,Email,Phone,Contact Source,Tags,Notes
```

| Column | What goes in it | Why |
|---|---|---|
| `First Name` | First token of the display name, only where the split is unambiguous | Never guess a split on a single-token or non-Western-order name. Put the whole string in `First Name` and leave `Last Name` empty rather than inventing a surname. |
| `Last Name` | Remaining tokens where the split is unambiguous | Same rule. |
| `Email` | Only if observed. Never inferred, never constructed | An invented email is a wrong record and a possible message to a stranger. |
| `Phone` | Only if observed, digits only | [research/raw/piper--ghl-import--highlevel-csv-import-official.md] |
| `Contact Source` | The campaign source string | `Contact Source` is a native standard field [research/raw/piper--ghl-import--highlevel-import-existing-contacts.md], so origin does not need a custom field |
| `Tags` | The campaign tag plus the signal-type tag | Per-row tags are supported at import [research/raw/piper--ghl-import--growthable-import-walkthrough.md] |
| `Notes` | Signal type, event time, receipt, and the verbatim comment or message text | `Notes` is a standard field. It is where evidence belongs. |

**Do not put the drafted first message in a plain custom text field.** A Text Field caps at
255 characters [research/raw/piper--ghl-custom-fields--ghlbuilds-custom-fields-guide.md].
Put the draft in `Notes`, or in a Text Area custom field the user has created, which caps
at 5,000 [research/raw/piper--ghl-custom-fields--ghlbuilds-custom-fields-guide.md].

**Any custom field must already exist in the CRM before the import.** The vendor states it
directly [research/raw/piper--ghl-import--highlevel-csv-import-official.md], and the field
key differs from the display label
[research/raw/piper--ghl-custom-fields--ghlbuilds-custom-fields-guide.md]. So: do not emit
custom columns speculatively. Ask the user which custom fields exist, or ship the standard
columns only and tell the user what they would need to create to carry more.

### The import instruction to ship beside the file

Keep it to a screen. The user is doing this between other things.

> 1. Open Contacts, then Import.
> 2. Choose Contacts, not Contacts plus Opportunities, unless you want deals created.
> 3. Upload the CSV.
> 4. On the mapping screen, check every row of the mapping table. Phone and Email are
>    usually recognised automatically; confirm Contact Source, Tags, and Notes landed on
>    the fields you expect.
> 5. In advanced settings, set the duplicate strategy to UPDATE the existing record rather
>    than adding a second one.
> 6. Name the import so you can find it later. Use the run date, for example
>    `piper-2026-08-17`. The default is a date and time string.
> 7. Confirm, then spot check three contacts in the list to verify tags and notes landed.

Steps 5 and 6 come from the operator walkthrough
[research/raw/piper--ghl-import--growthable-import-walkthrough.md]. Step 4 exists because
mapping is manual for anything the system does not recognise
[research/raw/piper--ghl-import--growthable-import-walkthrough.md].

**The one-tag shortcut.** The import screen also offers a single tag applied to the whole
file, described as useful when adding one tag to an entire list
[research/raw/piper--ghl-import--growthable-import-walkthrough.md]. When every row in the
file shares one campaign, that is cleaner than a per-row column: one file per campaign per
day, one tag on the file. Use the `Tags` column only when the rows carry different
signal-type tags.

**What the CRM will dedupe for you, and what it will not.** A CSV import merges on phone or
email regardless of the allow-duplicates setting
[research/raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md]. That covers exact
email and phone matches. It does nothing for a row that has only a display name, which is
the common case for a social commenter. Do not let the import stand in for the dedupe pass
in `references/dedupe-against-crm.md`.

### A different CRM

If the CRM is not GoHighLevel, do not guess its format. Ask the user for its import
template or documentation, read it, and shape the file to what it says. Where you cannot
get the spec, emit the generic header row above, say plainly that it was not verified
against that CRM's documentation, and tell the user to check the mapping screen carefully.
Never present an unverified header row as "the exact format your CRM expects".

---

## Tier 3: neither

Produce a copy-paste block and be blunt about what did not happen.

Shape it as a compact table the user can paste into a spreadsheet or read down while typing
into their CRM by hand:

```
NAME | SIGNAL | WHEN | CAMPAIGN TAG | IN CRM? | DRAFTED FIRST MESSAGE
```

Then, immediately below it and not buried at the end:

> Not automated in this run: no CRM records were created or updated, and no import file was
> produced. There is no CRM tool in this session and no import path was configured. The
> table above is the complete output. Nothing was sent to anyone.

State the count. "Six people are listed above and none of them are in your CRM yet" is the
sentence the user needs.

---

## Rules that apply to every tier

1. **Never auto-send.** The drafted first message is queued for the user to send by hand,
   in every tier, including tier 1 where a connector could technically trigger a send.
   Automated direct messaging gets accounts banned, and the platform prohibitions are
   already documented in `lead-harvester/references/platform-rules.md`. Read that rather
   than re-deriving it.
2. **Never write a private DM's contents into a CRM note.** See
   `references/consent-and-tagging.md`.
3. **Show before you write.** Approval attaches to the actual records and the actual text,
   never to a plan (`references/evidence-standards.md`, rule 6).
4. **Report partial success as partial.** Four upserts succeeded and two failed is two
   numbers, not one.
5. **Say which tier ran and why.** Every time.
