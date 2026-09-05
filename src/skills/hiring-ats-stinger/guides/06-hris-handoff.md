# Guide 06: ATS-to-HRIS Handoff

Source: `research/external/2026-05-20-ats-hris-handoff-rippling.md`, `research/external/2026-05-20-greenhouse-api-updates.md`

---

## The handoff decision tree

```
Is the team already on Rippling HRIS?
  → YES: Use Rippling Recruiting as the ATS (if it meets pipeline requirements)
      → This eliminates the handoff entirely: same platform, zero data transfer friction
  → NO / Rippling Recruiting does not meet requirements:
      → Configure ATS-to-HRIS handoff via integration (see below)
```

Rippling's primary ATS value proposition is eliminating the handoff. The Forterra case study (Rippling customer): previously using Lever as ATS, recruiters drafted offer letters manually, errors were common, employee records were incomplete. After switching to Rippling unified platform, the fragmented process was eliminated. Source: `research/external/2026-05-20-ats-hris-handoff-rippling.md`

---

## The five handoff failure modes

These are the most common ATS-to-HRIS handoff failures. Use this as a validation checklist before the first hire goes through a newly configured integration:

| Failure mode | Root cause | Impact |
|---|---|---|
| **Missing start date** | ATS stores start date as a date field; HRIS expects different format or field name | New hire appears without a start date; blocks payroll setup |
| **Compensation field type mismatch** | ATS stores salary as text string ("$120,000"); HRIS expects numeric value + currency code | Integration breaks silently; payroll run fails |
| **Department/cost center mismatch** | ATS uses informal department names; HRIS enforces formal taxonomy | New hire created in wrong department; reporting errors |
| **Benefits eligibility date not set** | Benefits-eligible date not mapped to HRIS benefits module | New hire misses benefits enrollment window |
| **Background check hold** | New hire record created in HRIS before background check clears | Manual delete and re-create required if check fails |

**The most dangerous failure mode:** Compensation field type mismatch. This often does not surface until the payroll run. Validate this field mapping explicitly in every new integration setup.

---

## Configuring the Greenhouse-to-Rippling handoff

Greenhouse Rippling integration uses the Rippling webhook + Greenhouse API:

1. Configure Greenhouse to trigger an offer-letter-sent event via webhook.
2. Rippling webhook trigger: "when offer letter is signed AND background check is completed."
3. Map the Greenhouse offer fields to Rippling HRIS fields. Required mappings:
   - Start date → Rippling `start_date` (date format: YYYY-MM-DD)
   - Compensation → Rippling `compensation.amount` (numeric) + `compensation.currency` ("USD")
   - Department → Must match Rippling's department taxonomy exactly (not the informal job req department)
   - Job title → Rippling `job_title`
   - Employment type → Full-time / part-time / contractor (required for payroll classification)
4. Validate with a test hire before enabling on all roles.

**Critical:** Greenhouse Harvest API v1/v2 is deprecated and unavailable after **August 31, 2026**. Any Greenhouse-to-Rippling integration built on v1/v2 will break on that date. Migrate to Harvest API v3. Source: `research/external/2026-05-20-greenhouse-api-updates.md`

---

## Gem-to-Rippling handoff

For teams using Gem ATS (not Greenhouse) as their ATS:
- Gem ATS can push hired candidate data to Rippling HRIS automatically, creating draft hire records.
- Fields pushed: name, email, job title, department, work location.
- Verify current field list with Gem support — field sets change.
- Apply the same field-mapping validation checklist as above.

---

## Configuring the Ashby-to-HRIS handoff

Ashby provides a Webhooks API and an Offers API. The integration pattern:

1. Configure Ashby to send a webhook on offer-accepted event.
2. The receiving system (Rippling, BambooHR, Workday, etc.) creates the draft hire record.
3. Map fields via the webhook payload. Ashby's API is well-documented and field-named; the mapping is typically straightforward.
4. Apply the five failure-mode checklist above to the field mapping.

Greenhouse Hire Link for Workday (launched March 2026): if the team uses Workday as HRIS, Greenhouse now has a native Hire Link integration that handles the field mapping out of the box. Use this before building a custom integration.

---

## Handoff validation checklist

Before enabling the integration on all roles:

- [ ] Start date: format matches between ATS and HRIS; field is required and non-null
- [ ] Compensation: ATS sends numeric value + currency code (not a formatted string)
- [ ] Department: all active departments in the ATS exist in the HRIS taxonomy
- [ ] Benefits eligibility date: field is mapped and not null
- [ ] Background check: HRIS record not created until background check status is "cleared" or a manual hold is in place
- [ ] Test with one synthetic hire record before enabling on real roles
- [ ] Validate with payroll that a synthetic hire record processes correctly

---

## Escalation boundary

HRIS configuration depth beyond the ATS handoff interface belongs to a future `hris-worker-bee`. This stinger stops at:

- The field mapping between ATS and HRIS
- The webhook trigger configuration
- The offer-to-hire flow

It does NOT cover: setting up Rippling departments, payroll groups, benefits plans, compensation bands, or IT provisioning workflows. Escalate these to `hris-worker-bee` (when available) or flag as out of scope.
