# Distillation: lead capture and CRM intake

Written from a fresh read of `raw/` on 2026-08-17. Every claim ends in a bracketed
citation to the raw file that carries it. Nothing here comes from training data.

---

## 1. Speed to lead: the direction is real, the magnitudes do not transfer

### What the evidence actually is

The whole field rests on a small number of studies, recycled hard.

| Study | Year | Sample | Headline | Citation |
|---|---|---|---|---|
| Oldroyd / InsideSales / Kellogg / MIT | 2007 | 6 companies, 15,000 plus leads, 100,000 plus call attempts, over 3 years | Contact odds fall over 10x in the first hour; qualify odds over 6x. 5 min versus 30 min: contact odds drop 100x, qualify odds drop 21x | [raw/piper--speed-to-lead--oldroyd-mit-insidesales-2007.md] |
| HBR audit | 2011 | 2,241 US companies | Average response 42 hours, 23% never responded | [raw/piper--speed-to-lead--leadsource-evidence-review.md] |
| HBR lead-life dataset | 2011 | 1.25M leads, 29 B2C and 13 B2B firms | Within 1 hour, roughly 7x more likely to qualify | [raw/piper--speed-to-lead--leadsource-evidence-review.md] |
| RevenueHero mystery shop | 2024 | 1,000 B2B SaaS companies | Average response 1 day 5 hours, 63.5% never replied | [raw/piper--speed-to-lead--leadsource-evidence-review.md] |
| Optifai | 2025 to 2026 | 939 B2B SaaS companies | Close rate 32% under 5 min versus 12% at 24 hours plus | [raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md] |
| Blazeo | Feb 2026 | 573 companies, 6 industries | 81.2% of responders slower than 1 hour lose leads versus 46.6% of fast responders | [raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md] |
| Workato audit | 2026 | 114 B2B companies | Over 99% failed to respond within 5 minutes | [raw/piper--speed-to-lead--leadsource-evidence-review.md] |

### The four honest caveats

1. **The channel does not match.** The 2007 primary study measured "leads that were captured
   through a web form, and attempted or called at least one time", by phone
   [raw/piper--speed-to-lead--oldroyd-mit-insidesales-2007.md]. Nothing in this archive
   measures a social commenter answered by direct message. The 2026 benchmark article names
   social DM as a lead channel and then publishes no data segmented by channel
   [raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md].
2. **The magnitudes shrink when the sample grows.** 100x and 21x come from six companies in
   2007 [raw/piper--speed-to-lead--oldroyd-mit-insidesales-2007.md]. The 2025 to 2026
   dataset of 939 companies shows 32% versus 12%, roughly 2.7x
   [raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md]. Both are in this archive
   and they are not the same claim.
3. **Revenue was never measured.** The 2007 study "used only six companies and never
   measured revenue" [raw/piper--speed-to-lead--leadsource-evidence-review.md]. "Qualify" is
   never defined in the executive summary
   [raw/piper--speed-to-lead--oldroyd-mit-insidesales-2007.md].
4. **Some circulating figures are extrapolations.** The widely repeated 80% lead-quality
   drop "appears to be an editorial extrapolation of HBR's decay curves rather than a
   directly stated figure" [raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md].

### Conflict, stated rather than smoothed

A vendor evidence review calls the base "strong on direction and rough magnitude, and
weaker on exact figures" [raw/piper--speed-to-lead--leadsource-evidence-review.md]. A
second vendor page reports 32% versus 12% as current fact without foregrounding that it is
an order of magnitude milder than the legend
[raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md]. **Preferred reading:** the
first. It criticizes findings that support its own product, which is the more credible
direction for a vendor to lean.

### The one finding that transfers cleanly

Having a WRITTEN response-time target is itself associated with hitting it: 54.9% met a 15
minute SLA where a formal SLA existed versus 29.5% where none did
[raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md]. That is an operational
finding about teams, not a claim about buyer psychology, so it survives the channel
mismatch.

**Named gap.** No source in this archive isolates conversion outcomes for inbound social
hand-raisers. Every number above describes form-fill leads or B2B demo requests.

---

## 2. CRM contact deduplication and matching

### The core split

> "Deterministic matching links two records only when specified fields agree exactly"
> [raw/piper--dedupe--dataladder-deterministic-vs-probabilistic.md]

> "Probabilistic matching links records based on a calculated likelihood that they refer to
> the same entity, scoring partial agreement across multiple fields"
> [raw/piper--dedupe--dataladder-deterministic-vs-probabilistic.md]

Deterministic wins on clean data with a shared identifier and "a single typo or formatting
difference breaks the match"
[raw/piper--dedupe--dataladder-deterministic-vs-probabilistic.md]. Deterministic matching
alone misses an estimated 30 to 40% of real duplicates in typical CRM databases
[raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

### Normalise before comparing

Trim whitespace, lowercase everything, expand abbreviations, format phones to E.164
[raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

### The confidence ladder, practitioner consensus not measured constant

| Score | Action | Citation |
|---|---|---|
| 0.95 to 1.00 | Auto-merge generally safe | [raw/piper--dedupe--digitalapplied-merge-framework-2026.md] |
| 0.80 to 0.95 | Strong match, review recommended | same |
| 0.60 to 0.80 | Possible match, human validation required | same |
| Below 0.60 | Likely false positive, no merge | same |

Per-field algorithms: Jaro-Winkler at about 0.85 for first names, phonetic plus edit
distance at about 0.90 for surnames, normalised exact match for email, E.164 exact for
phone [raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

### The risk asymmetry

> "A merged record that shouldn't have been merged is a different kind of risk than a
> missed duplicate" [raw/piper--dedupe--dataladder-deterministic-vs-probabilistic.md]

Auto-merge is reserved for the top tier; everything from 0.60 to 0.95 goes to human review
with related records visible, to avoid orphaning history
[raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

### Survivorship

Per field, never per record: "The 'winning' record rarely holds the best value for every
field" [raw/piper--dedupe--digitalapplied-merge-framework-2026.md]. Six rule types are
named: source priority, most recent, most complete, quality score, conditional, hybrid
[raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

### Duplicates are the normal state

92% of organisations report duplicates; only 22% hit a 1% or lower duplicate rate; contact
data decays about 70% a year; ungoverned databases run 10 to 30% duplicates
[raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

**Source-quality note.** The threshold tiers come from a marketing agency page describing
"practitioner consensus", not a study
[raw/piper--dedupe--digitalapplied-merge-framework-2026.md]. Use them as a convention.

---

## 3. GoHighLevel: import format, tags, custom fields, dedupe, API

### CSV import file rules

| Item | Value | Citation |
|---|---|---|
| Format | CSV only, not Excel or Google Sheets | [raw/piper--ghl-import--highlevel-csv-import-official.md] |
| Size | Under 30 MB in one official article, up to 50 MB in another | [raw/piper--ghl-import--highlevel-csv-import-official.md], [raw/piper--ghl-import--highlevel-import-existing-contacts.md] |
| Structure | Single sheet, non-blank header row | [raw/piper--ghl-import--highlevel-csv-import-official.md] |
| Minimum per row | At least one of Name, Email, Phone | [raw/piper--ghl-import--highlevel-csv-import-official.md] |
| Phone formatting | Remove spaces, dashes, letters | [raw/piper--ghl-import--highlevel-csv-import-official.md] |

**Conflict:** 30 MB versus 50 MB, both official HighLevel pages. **Preferred reading:**
design to 30 MB, the stricter of the two. A daily drip file is a few kilobytes, so the
conflict is recorded for completeness rather than because it binds.

### Standard fields available for mapping

> "Contact ID, Name, First Name, Last Name, Date of Birth, Contact Owner, Contact Source,
> Contact Type, Business Name, Phone, Email, Business Name, Address, State, City, Postal
> Code, Country, DND, Time Zone, Website, Additional Email, Additional Phones, Notes"
> [raw/piper--ghl-import--highlevel-import-existing-contacts.md]

`Contact Source` and `DND` are native standard fields, so campaign origin and
do-not-contact both have a home without custom fields
[raw/piper--ghl-import--highlevel-import-existing-contacts.md].

**Named gap.** Neither official article publishes an exhaustive list of exact header
STRINGS, and mapping is manual anyway
[raw/piper--ghl-import--highlevel-csv-import-official.md],
[raw/piper--ghl-import--growthable-import-walkthrough.md]. So headers matching the field
labels reduce operator error but are not a strict contract.

### Tags

- Tags are CASE SENSITIVE: "'Facebook' and 'facebook' would be treated as separate tags"
  [raw/piper--ghl-tags--highlevel-add-contact-tag-action.md].
- Tags are created implicitly on first use, with no typo protection
  [raw/piper--ghl-tags--highlevel-add-contact-tag-action.md].
- Many tags per contact are supported
  [raw/piper--ghl-tags--highlevel-add-contact-tag-action.md].
- At import there are two paths: a per-row tag column, and a single tag applied to the
  whole file, the latter "useful if you are adding 1 tag to the entire list"
  [raw/piper--ghl-import--growthable-import-walkthrough.md].
- No published naming rules or character limits
  [raw/piper--ghl-tags--highlevel-add-contact-tag-action.md].

### Custom fields

Must exist BEFORE the import can map to them
[raw/piper--ghl-import--highlevel-csv-import-official.md],
[raw/piper--ghl-custom-fields--ghlbuilds-custom-fields-guide.md]. Seven field types, with a
255 character cap on Text Field and 5,000 on Text Area
[raw/piper--ghl-custom-fields--ghlbuilds-custom-fields-guide.md]. Each field carries an
internal field key distinct from its label, used as `{{contact.custom.field_key}}`
[raw/piper--ghl-custom-fields--ghlbuilds-custom-fields-guide.md].

### Deduplication inside GoHighLevel

- Default primary match field is Email; an optional secondary field is checked only if the
  primary produced no match [raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md].
- With duplicates disabled, a new submission "Updates the existing contact with the new
  information instead of creating a duplicate"
  [raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md].
- **CSV imports merge on phone or email "regardless of the setting"**
  [raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md].
- Nothing is published about email or phone normalisation
  [raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md].

**Conflict:** the import article gives the match order as Contact ID, then Email, then
Phone [raw/piper--ghl-import--highlevel-csv-import-official.md]; the dedupe settings article
describes primary-then-secondary and never mentions Contact ID
[raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md]. **Preferred reading:** the
dedupe settings article governs runtime behavior, because the API documentation confirms
that the location-level setting is what the upsert consults
[raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md]. Contact ID is best read as a
short circuit when an explicit ID is supplied.

### The API path

`POST /contacts/upsert`, with `firstName`, `lastName`, `email`, `phone`, `tags`, `source`,
`customFields`, `locationId` named in the body
[raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md]. It identifies an existing
contact "based on the priority sequence specified in the setting", the same location-level
dedupe configuration the UI uses
[raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md].

The hazard worth naming:

> "When both email and phone are present and separate contacts exist for each, the API will
> update the contact that matches the first field in the configured sequence, and ignore the
> second field to prevent duplication."
> [raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md]

Two split records stay split, one gets silently updated, and nothing surfaces the
collision.

**Named gaps.** Required OAuth scope, rate limits, and whether the response distinguishes a
created record from an updated one were not captured from the rendered documentation
[raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md].

---

## 4. Lead source attribution and campaign tagging conventions

- Lowercase everything and separate words with hyphens, because case variance produces
  duplicate entries [raw/piper--attribution--improvado-utm-naming-conventions.md]. This is
  the same failure mode as case-sensitive GoHighLevel tags reached from a different
  direction [raw/piper--ghl-tags--highlevel-add-contact-tag-action.md].
- Campaign values should be descriptive and period-anchored, for example
  `2026-q3-product-launch`, not a vague code
  [raw/piper--attribution--improvado-utm-naming-conventions.md].
- Three naming models exist: cryptic, positional, key-value. Key-value is called the most
  scalable [raw/piper--attribution--improvado-utm-naming-conventions.md]. A CRM tag is a
  single string, so positional is the practical shape for tags even though key-value is
  better in a URL.
- Governance is a registry plus an audit: a documented list of approved values, a running
  campaign log, review before launch, and regular audits for inconsistency
  [raw/piper--attribution--improvado-utm-naming-conventions.md].
- Roughly 30% of large organisations spend significant budget with no reliable way to track
  campaign effectiveness [raw/piper--attribution--improvado-utm-naming-conventions.md].
- The CRM side has a native home for origin: `Contact Source` is a standard field
  [raw/piper--ghl-import--highlevel-import-existing-contacts.md], so source and campaign
  tag are two axes, not one.

---

## 5. Consent and data protection for piping a social engager into a CRM

### The direct answer to "they commented publicly, so it is fine"

The UK regulator rejects it in terms:

> "Because someone's social media page has not been made private or they are seeking a
> large audience for their social media post doesn't mean that you are free to use their
> personal information for direct marketing purposes."
> [raw/piper--consent--ico-collect-information-and-generate-leads.md]

Public availability does not establish lawfulness, and the operative test is whether the
person would EXPECT to be contacted that way
[raw/piper--consent--ico-collect-information-and-generate-leads.md].

### Transparency has a deadline

Privacy information must reach the person "within a reasonable period and at the latest
within a month of obtaining their information", and for direct marketing at the latest when
you first communicate with them, whichever is sooner
[raw/piper--consent--ico-collect-information-and-generate-leads.md]. Required disclosures
include the categories of information held and THE SOURCE of it
[raw/piper--consent--ico-collect-information-and-generate-leads.md].

### Lawful basis depends on channel and on subscriber type

| Situation | Basis available | Citation |
|---|---|---|
| Electronic mail to individual subscribers, including sole traders and partnerships | Consent, or soft opt-in | [raw/piper--consent--ico-choosing-lawful-basis-direct-marketing.md] |
| Email to corporate subscribers | Legitimate interests may apply | same |
| Automated or recorded calls, calls to registered numbers | Consent | same |
| Postal marketing, live calls to unregistered numbers with no objection | Legitimate interests may apply | same |

> "PECR can affect your choice of data protection lawful basis. This is because sometimes
> PECR says you must have consent to send direct marketing."
> [raw/piper--consent--ico-choosing-lawful-basis-direct-marketing.md]

### Legitimate interest is a documented assessment, not a checkbox

Purpose, necessity, balancing
[raw/piper--consent--usercentrics-gdpr-legitimate-interest.md]. Necessity means no
reasonably available alternative with a smaller privacy footprint, not merely useful
[raw/piper--consent--usercentrics-gdpr-legitimate-interest.md]. Recital 47 identifies
direct marketing to EXISTING CUSTOMERS as capable of qualifying
[raw/piper--consent--usercentrics-gdpr-legitimate-interest.md], which a first-time
commenter is not. Objection to direct marketing is absolute and immediate
[raw/piper--consent--usercentrics-gdpr-legitimate-interest.md],
[raw/piper--consent--ico-collect-information-and-generate-leads.md].

### The US regime is different at the root

CAN-SPAM requires no prior consent for a commercial email; the remedy is an opt-out honored
within 10 business days, with accurate headers, ad disclosure, and a physical postal
address, at up to $53,088 per violating email
[raw/piper--consent--ftc-can-spam-compliance-guide.md]. A message that only fulfils what
the person asked for leans transactional or relationship; a message that pitches is
commercial [raw/piper--consent--ftc-can-spam-compliance-guide.md].

**Conflict, and it is jurisdictional rather than evidential.** The US default is opt-out
[raw/piper--consent--ftc-can-spam-compliance-guide.md]; the UK default for individual
subscribers is consent or soft opt-in
[raw/piper--consent--ico-choosing-lawful-basis-direct-marketing.md]. There is no single
rule to state. Both readings stand and the skill surfaces which one applies rather than
picking.

### The practical shape this implies

1. Fulfilling the specific request the person made sits inside their reasonable expectation
   [raw/piper--consent--ico-collect-information-and-generate-leads.md].
2. Enrolling that same person in ongoing marketing is a different purpose with a different
   expectation attached, and is the step that needs its own basis
   [raw/piper--consent--ico-collect-information-and-generate-leads.md],
   [raw/piper--consent--usercentrics-gdpr-legitimate-interest.md].
3. Record the source on the record. That is a regulatory disclosure requirement, not
   optional metadata [raw/piper--consent--ico-collect-information-and-generate-leads.md].
4. Wire the opt-out at intake, not later
   [raw/piper--consent--usercentrics-gdpr-legitimate-interest.md],
   [raw/piper--consent--ftc-can-spam-compliance-guide.md]. `DND` exists natively in the
   CRM for exactly this
   [raw/piper--ghl-import--highlevel-import-existing-contacts.md].

---

## Named gaps in this archive

1. **No channel-segmented speed-to-lead data.** Nothing measures response-time effects for
   social commenters or direct messages
   [raw/piper--speed-to-lead--digitalapplied-benchmarks-2026.md].
2. **No exhaustive GoHighLevel CSV header list from the vendor.** Both official articles
   omit it [raw/piper--ghl-import--highlevel-csv-import-official.md],
   [raw/piper--ghl-import--highlevel-import-existing-contacts.md].
3. **No GoHighLevel API rate limits or scopes captured** from the rendered upsert page
   [raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md].
4. **No regulator source on non-email platform DMs.** The ICO pages cover electronic mail,
   calls, and post [raw/piper--consent--ico-choosing-lawful-basis-direct-marketing.md]. A
   direct message on a social platform is governed primarily by that platform's own terms,
   which are documented in the sibling skill's `platform-rules.md` rather than here.
5. **No EU-level regulator source.** The consent research leans on the UK ICO plus a vendor
   summary of GDPR. No EDPB guidance was captured.
6. **No measured dedupe threshold study.** The confidence tiers are practitioner consensus
   from a vendor page [raw/piper--dedupe--digitalapplied-merge-framework-2026.md].
